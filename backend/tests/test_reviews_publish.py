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
