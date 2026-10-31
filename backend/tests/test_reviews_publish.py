from fastapi.testclient import TestClient

def test_reviews_listing_and_decision(client: TestClient, auth_headers):
    reviewer_headers = auth_headers("reviewer")
    admin_headers = auth_headers("admin")

    # List reviews
    resp = client.get("/api/reviews", headers=reviewer_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert len(data["items"]) >= 1
    review_id = data["items"][0]["id"]

    # Reviewer submits decision with CLARIFICATION_REQUESTED
    dec_resp = client.post(
        f"/api/reviews/{review_id}/decision",
        headers=reviewer_headers,
        json={
            "decision": "clarification_requested",
            "comment": "Please provide clearer boundary documentation for western parcel edge.",
            "correctionRequest": "Re-upload GPS survey coordinates within parcel boundary",
        },
    )
    assert dec_resp.status_code == 200
    updated_review = dec_resp.json()
    assert updated_review["status"] == "in_investigation"
    assert updated_review["decision"] == "clarification_requested"
    assert updated_review["comment"] == "Please provide clearer boundary documentation for western parcel edge."

    # Check that notification was automatically dispatched
    officer_headers = auth_headers("field_officer")
    notif_resp = client.get("/api/notifications", headers=officer_headers)
    assert notif_resp.status_code == 200
    notifs = notif_resp.json()["items"]
    assert any(n["type"] == "correction_request" for n in notifs)

def test_project_publication_rbac(client: TestClient, auth_headers):
    admin_headers = auth_headers("admin")
    dev_headers = auth_headers("project_developer")
    project_id = "PRJ-PB-DSR-001"

    # Non-admin attempting to publish receives 404 (RBAC hidden route)
    resp_forbidden = client.post(f"/api/projects/{project_id}/publish", headers=dev_headers)
    assert resp_forbidden.status_code == 404

    # Admin publishes project
    resp_publish = client.post(f"/api/projects/{project_id}/publish", headers=admin_headers)
    assert resp_publish.status_code == 200
    assert resp_publish.json()["isPublished"] is True

    # Audit event logged
    audit_resp = client.get("/api/audit", headers=admin_headers)
    assert audit_resp.status_code == 200
    events = audit_resp.json()["items"]
    assert any(e["action"] == "PROJECT_PUBLISHED" for e in events)

def test_spatial_discrepancy_waiver_authorization(client: TestClient, auth_headers):
    reviewer_headers = auth_headers("reviewer")
    admin_headers = auth_headers("admin")
    review_id = "REV-2026-001"

    # 1. Ordinary reviewer attempts to ACCEPT review with active +420m spatial discrepancy -> 403 Forbidden
    resp_reviewer_accept = client.post(
        f"/api/reviews/{review_id}/decision",
        headers=reviewer_headers,
        json={
            "decision": "accepted",
            "comment": "Attempting to accept sowing photograph despite 420m offset.",
        },
    )
    assert resp_reviewer_accept.status_code == 403
    err_data = resp_reviewer_accept.json()["error"]
    assert err_data["code"] == "WAIVER_AUTHORIZATION_REQUIRED"

    # 2. Lead Auditor (Admin) attempts to accept without formal waiver justification -> 422 Unprocessable
    resp_admin_no_reason = client.post(
        f"/api/reviews/{review_id}/decision",
        headers=admin_headers,
        json={
            "decision": "accepted",
            "comment": "Admin accepting without waiver reason.",
        },
    )
    assert resp_admin_no_reason.status_code == 422
    err_data = resp_admin_no_reason.json()["error"]
    assert err_data["code"] == "WAIVER_JUSTIFICATION_REQUIRED"

    # 3. Lead Auditor (Admin) issues formal regulatory waiver with complete rationale -> 200 OK
    waiver_reason = "Corroborated by high-resolution tractor GPS datalogger and contiguous seedling emergence pattern."
    regulatory_rationale = "ISO 14064-2 Clause 6.4: Secondary in-situ telemetry confirms drill operation within registered plot."
    resp_admin_waiver = client.post(
        f"/api/reviews/{review_id}/decision",
        headers=admin_headers,
        json={
            "decision": "accepted",
            "comment": "Formal lead auditor waiver granted based on telemetry corroboration.",
            "waiverReason": waiver_reason,
            "waiverRegulatoryRationale": regulatory_rationale,
        },
    )
    assert resp_admin_waiver.status_code == 200
    rev_data = resp_admin_waiver.json()
    assert rev_data["status"] == "resolved"
    assert rev_data["waiverIssued"] is True
    assert rev_data["waiverReason"] == waiver_reason
    assert rev_data["waiverAuthorizedBy"] == "USR-ADMIN-01"

    # 4. Verify that linked evidence retains spatial_distance_meters: 420.0 and records waiver
    ev_resp = client.get("/api/evidence/EV-2026-001", headers=admin_headers)
    assert ev_resp.status_code == 200
    ev_data = ev_resp.json()
    assert ev_data["provenance"]["spatialDistanceMeters"] == 420.0  # Crucial: original anomaly NOT erased
    assert ev_data["provenance"]["waiverIssued"] is True
    assert ev_data["provenance"]["waiverReason"] == waiver_reason

    # 5. Verify SPATIAL_DISCREPANCY_WAIVER event in immutable audit log
    audit_resp = client.get("/api/audit", headers=admin_headers)
    assert audit_resp.status_code == 200
    events = audit_resp.json()["items"]
    waiver_events = [e for e in events if e["action"] == "SPATIAL_DISCREPANCY_WAIVER"]
    assert len(waiver_events) >= 1
    assert waiver_events[-1]["details"]["spatialDistanceMeters"] == 420.0

