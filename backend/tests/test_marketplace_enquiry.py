from fastapi.testclient import TestClient

def test_marketplace_buyer_safety_and_pii_absence(client: TestClient, auth_headers):
    admin_headers = auth_headers("admin")
    buyer_headers = auth_headers("buyer")
    project_id = "PRJ-PB-DSR-001"

    # Step 1: Admin publishes project
    pub_resp = client.post(f"/api/projects/{project_id}/publish", headers=admin_headers)
    assert pub_resp.status_code == 200

    # Step 2: Buyer views marketplace
    market_resp = client.get("/api/marketplace")
    assert market_resp.status_code == 200
    items = market_resp.json()["items"]
    assert len(items) >= 1

    # Verify structural absence of farmer PII and counts
    for project in items:
        # Check forbidden keys
        forbidden_keys = [
            "farmerName", "farmer_name", "farmerNameLocal",
            "phone", "phoneNumber", "mobile",
            "farmerId", "farmer_id",
            "farmerCount", "farmer_count",
        ]
        for key in forbidden_keys:
            assert key not in project, f"Forbidden key '{key}' found in buyer-facing marketplace response!"

        # Check that prices / carbon values are not fabricated
        if "indicativePricePerTonUsd" in project:
            assert project["indicativePricePerTonUsd"] is None
        if "estimatedTonsCo2ePerYear" in project:
            assert project["estimatedTonsCo2ePerYear"] is None

        # Verify methodology is pending confirmation
        assert "pending confirmation" in project["methodology"].lower()

def test_buyer_enquiry_lifecycle(client: TestClient, auth_headers):
    buyer_headers = auth_headers("buyer")
    admin_headers = auth_headers("admin")
    project_id = "PRJ-PB-DSR-001"

    # Step 1: Buyer creates enquiry
    enq_payload = {
        "projectId": project_id,
        "volumeRequestedTons": 500.0,
        "targetRetirementYear": "2027",
        "message": "Interested in forward contract for Basmati DSR credits upon accredited verification.",
    }
    create_resp = client.post("/api/buyer/enquiries", headers=buyer_headers, json=enq_payload)
    assert create_resp.status_code == 201
    enq_data = create_resp.json()
    assert enq_data["projectId"] == project_id
    assert enq_data["volumeRequestedTons"] == 500.0
    assert enq_data["status"] == "Active"
    assert enq_data["stage"] == "Inquiry"
    enquiry_id = enq_data["id"]

    # Step 2: Buyer views own enquiries
    buyer_list = client.get("/api/buyer/enquiries", headers=buyer_headers)
    assert buyer_list.status_code == 200
    own_items = buyer_list.json()["items"]
    assert any(e["id"] == enquiry_id for e in own_items)

    # Step 3: Admin views internal enquiries queue
    internal_list = client.get("/api/enquiries", headers=admin_headers)
    assert internal_list.status_code == 200
    all_items = internal_list.json()["items"]
    assert any(e["id"] == enquiry_id for e in all_items)
