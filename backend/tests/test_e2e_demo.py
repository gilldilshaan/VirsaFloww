import io
import json
import os
from fastapi.testclient import TestClient

def test_complete_demo_journey_pb_field_001(client: TestClient, auth_headers, tmp_path, monkeypatch):
    officer_headers = auth_headers("field_officer")
    admin_headers = auth_headers("admin")
    field_id = "PB-FIELD-001"

    # =========================================================================
    # STEP 1: Initial Assessment Run (Only seeded flagged photo, no activities/satellite)
    # Result -> UNVERIFIED
    # =========================================================================
    resp1 = client.post(
        "/api/assessments/run",
        headers=officer_headers,
        json={"fieldId": field_id, "seasonId": "KHARIF-2026", "triggerReason": "initial_scan"},
    )
    assert resp1.status_code == 201
    data1 = resp1.json()
    assert data1["status"] == "UNVERIFIED"
    assert data1["statusLabel"] == "Unverified"
    assert any(r["result"] == "fail" for r in data1["ruleResults"])

    # Provide Sentinel-2 observations dataset
    mock_obs_file = tmp_path / "observations.json"
    obs_data = [
        {
            "id": "OBS-SENTINEL2-PB01",
            "date": "2026-06-12",
            "sensor": "Copernicus Sentinel-2 MSI",
            "cloudCoverPercent": 4.5,
            "sunAzimuthDeg": 125.0,
            "meanNdvi": 0.42,
            "meanNdwi": 0.38,
            "surfaceWaterDetected": True,
            "qualityRating": "High",
        }
    ]
    mock_obs_file.write_text(json.dumps(obs_data), encoding="utf-8")
    monkeypatch.setattr("backend.app.core.config.settings.LEAD_OBSERVATIONS_PATH", str(mock_obs_file))

    # =========================================================================
    # STEP 2: Add activities. Seeded photo EV-2026-001 has 420m spatial offset.
    # Result -> NEEDS_REVIEW
    # =========================================================================
    # 2a. Add pre-sowing irrigation activity (5 days before sowing)
    client.post(
        "/api/activities",
        headers=officer_headers,
        json={
            "id": "ACT-PB-IRR-01",
            "fieldId": field_id,
            "seasonId": "KHARIF-2026",
            "activityType": "pre_sowing_irrigation",
            "declaredDate": "2026-06-10",
            "createdBy": "USR-FLD-03",
            "createdAt": "2026-06-10T10:00:00Z",
        },
    )

    # 2b. Add direct seeding activity
    client.post(
        "/api/activities",
        headers=officer_headers,
        json={
            "id": "ACT-PB-SOW-01",
            "fieldId": field_id,
            "seasonId": "KHARIF-2026",
            "activityType": "direct_seeding",
            "declaredDate": "2026-06-15",
            "createdBy": "USR-FLD-03",
            "createdAt": "2026-06-15T10:00:00Z",
        },
    )

    # 2c. Run assessment -> EV-2026-001 causes R3 spatial warning -> overall NEEDS_REVIEW
    resp2 = client.post(
        "/api/assessments/run",
        headers=officer_headers,
        json={"fieldId": field_id, "triggerReason": "post_activity_upload"},
    )
    assert resp2.status_code == 201
    data2 = resp2.json()
    assert data2["status"] == "NEEDS_REVIEW"
    assert data2["statusLabel"] == "Needs review"
    r3_result = next(r for r in data2["ruleResults"] if r["ruleId"] == "R3_PHOTO_DISTANCE")
    assert r3_result["result"] == "warn"

    # =========================================================================
    # STEP 3: Supersede EV-2026-001 with in-boundary photograph
    # Result -> READY_FOR_VERIFICATION
    # =========================================================================
    # 3a. Supersede EV-2026-001 with corrected photo taken inside boundary
    replacement_bytes = b"\xff\xd8\xff\xe0\x00\x10JFIF_IN_BOUNDS"
    sup_resp = client.post(
        "/api/evidence/EV-2026-001/supersede",
        headers=officer_headers,
        data={
            "reason": "Farmer re-took photo from within parcel boundary following field officer visit",
            "title": "Verified In-Parcel DSR Seeding Photo",
            "lat": 30.9110,
            "lng": 75.8370,  # Precisely inside field boundary (centroid of PB-FIELD-001)
        },
        files={"file": ("in_bounds.jpg", io.BytesIO(replacement_bytes), "image/jpeg")},
    )
    assert sup_resp.status_code == 201

    # 3b. Verify EV-2026-001 is marked superseded
    get_old = client.get("/api/evidence/EV-2026-001", headers=officer_headers)
    assert get_old.status_code == 200
    assert get_old.json()["status"] == "superseded"

    # 3c. Run assessment -> All 5 rules pass -> READY_FOR_VERIFICATION
    resp3 = client.post(
        "/api/assessments/run",
        headers=admin_headers,
        json={"fieldId": field_id, "triggerReason": "post_supersession_recheck"},
    )
    assert resp3.status_code == 201
    data3 = resp3.json()
    assert data3["status"] == "READY_FOR_VERIFICATION"
    assert data3["statusLabel"] == "Ready for verification"
    # Invariant: "VERIFIED" must NEVER be used
    assert data3["status"] != "VERIFIED"
    assert all(r["result"] == "pass" for r in data3["ruleResults"])
