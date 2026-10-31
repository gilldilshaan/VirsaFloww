import io
import hashlib
from fastapi.testclient import TestClient

def test_evidence_magic_bytes_validation(client: TestClient, auth_headers):
    officer_headers = auth_headers("field_officer")

    # 1. Valid JPEG
    jpeg_bytes = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00"
    resp = client.post(
        "/api/evidence",
        headers=officer_headers,
        data={
            "fieldId": "PB-FIELD-001",
            "title": "Field Inspection Photo",
            "type": "photo",
            "category": "supporting",
            "capturedAt": "2026-06-15T08:00:00Z",
            "author": "Harpreet Singh",
            "source": "mobile_app",
            "lat": 30.901,
            "lng": 75.855,
        },
        files={"file": ("photo.jpg", io.BytesIO(jpeg_bytes), "image/jpeg")},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["provenance"]["sha256"] == hashlib.sha256(jpeg_bytes).hexdigest()
    assert data["fileDetails"]["mime"] == "image/jpeg"
    assert data["status"] == "hash_recorded"

    # 2. Fake JPEG with executable header (magic byte rejection)
    fake_bytes = b"MZ\x90\x00\x03\x00\x00\x00ThisIsAnExecutable"
    resp_fake = client.post(
        "/api/evidence",
        headers=officer_headers,
        data={
            "fieldId": "PB-FIELD-001",
            "title": "Malicious Upload",
            "type": "photo",
            "capturedAt": "2026-06-15T08:00:00Z",
            "author": "Attacker",
        },
        files={"file": ("virus.jpg", io.BytesIO(fake_bytes), "image/jpeg")},
    )
    assert resp_fake.status_code == 415
    assert resp_fake.json()["error"]["code"] == "UNSUPPORTED_MEDIA_TYPE"

    # 3. Empty file rejection
    resp_empty = client.post(
        "/api/evidence",
        headers=officer_headers,
        data={
            "fieldId": "PB-FIELD-001",
            "title": "Empty File",
            "type": "photo",
            "capturedAt": "2026-06-15T08:00:00Z",
            "author": "Officer",
        },
        files={"file": ("empty.jpg", io.BytesIO(b""), "image/jpeg")},
    )
    assert resp_empty.status_code == 400
    assert resp_empty.json()["error"]["code"] == "EMPTY_FILE"

def test_evidence_scoping_and_rbac(client: TestClient, auth_headers):
    # Farmer can upload to assigned field PB-FIELD-001
    farmer_headers = auth_headers("farmer")
    jpeg_bytes = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01"
    resp = client.post(
        "/api/evidence",
        headers=farmer_headers,
        data={
            "fieldId": "PB-FIELD-001",
            "title": "Farmer Sowing Log Photo",
            "type": "photo",
            "capturedAt": "2026-06-15T09:00:00Z",
            "author": "Gurdev Singh",
        },
        files={"file": ("sowing.jpg", io.BytesIO(jpeg_bytes), "image/jpeg")},
    )
    assert resp.status_code == 201

    # Farmer forbidden on unassigned field (404 NOT FOUND)
    resp_unassigned = client.post(
        "/api/evidence",
        headers=farmer_headers,
        data={
            "fieldId": "PB-FIELD-999-UNASSIGNED",
            "title": "Other Farmer Field",
            "type": "photo",
            "capturedAt": "2026-06-15T09:00:00Z",
            "author": "Gurdev Singh",
        },
        files={"file": ("other.jpg", io.BytesIO(jpeg_bytes), "image/jpeg")},
    )
    assert resp_unassigned.status_code == 404

    # Buyer denied access completely (404)
    buyer_headers = auth_headers("buyer")
    resp_buyer = client.get("/api/evidence", headers=buyer_headers)
    assert resp_buyer.status_code == 404

def test_evidence_supersession_workflow(client: TestClient, auth_headers):
    admin_headers = auth_headers("admin")
    initial_bytes = b"\xff\xd8\xff\xe0\x00\x10JFIF_INITIAL"

    # Step 1: Upload initial evidence
    create_resp = client.post(
        "/api/evidence",
        headers=admin_headers,
        data={
            "fieldId": "PB-FIELD-001",
            "title": "Original Photo",
            "type": "photo",
            "capturedAt": "2026-06-10T08:00:00Z",
            "author": "Inderjit Singh",
        },
        files={"file": ("orig.jpg", io.BytesIO(initial_bytes), "image/jpeg")},
    )
    assert create_resp.status_code == 201
    orig_id = create_resp.json()["id"]

    # Step 2: Supersede with replacement evidence
    replacement_bytes = b"\xff\xd8\xff\xe0\x00\x10JFIF_REPLACEMENT"
    sup_resp = client.post(
        f"/api/evidence/{orig_id}/supersede",
        headers=admin_headers,
        data={
            "reason": "Original photo was taken with poor lighting, replacing with clearer photo",
            "title": "Clear Daytime Sowing Photo",
        },
        files={"file": ("replacement.jpg", io.BytesIO(replacement_bytes), "image/jpeg")},
    )
    assert sup_resp.status_code == 201
    sup_data = sup_resp.json()
    new_id = sup_data["id"]
    assert sup_data["supersedesId"] == orig_id
    assert sup_data["provenance"]["sha256"] == hashlib.sha256(replacement_bytes).hexdigest()

    # Step 3: Check original evidence is now superseded
    get_orig = client.get(f"/api/evidence/{orig_id}", headers=admin_headers)
    assert get_orig.status_code == 200
    assert get_orig.json()["status"] == "superseded"

    # Step 4: Check history endpoint
    hist_resp = client.get(f"/api/evidence/{orig_id}/history", headers=admin_headers)
    assert hist_resp.status_code == 200
    history = hist_resp.json()["history"]
    assert any(h["newStatus"] == "superseded" for h in history)

    # Step 5: Second supersession attempt on same evidence MUST return 409 CONFLICT
    second_sup = client.post(
        f"/api/evidence/{orig_id}/supersede",
        headers=admin_headers,
        data={"reason": "Trying to supersede already superseded item"},
        files={"file": ("another.jpg", io.BytesIO(replacement_bytes), "image/jpeg")},
    )
    assert second_sup.status_code == 409
    assert second_sup.json()["error"]["code"] == "ALREADY_SUPERSEDED"

    # Step 6: Verify audit chain integrity remains intact
    verify_resp = client.get("/api/audit/verify", headers=admin_headers)
    assert verify_resp.status_code == 200
    assert verify_resp.json()["valid"] is True
