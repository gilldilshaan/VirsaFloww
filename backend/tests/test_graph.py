import pytest
from backend.app.schemas.graph import GraphNodeType, GraphRelation
from backend.app.schemas.evidence import Evidence, EvidenceStatus, EvidenceType, EvidenceCategory, Provenance, Coordinates

def test_field_evidence_graph_admin(client, auth_headers):
    # Admin accesses PB-FIELD-001 graph
    resp = client.get("/api/fields/PB-FIELD-001/graph", headers=auth_headers("admin"))
    assert resp.status_code == 200
    data = resp.json()
    assert "nodes" in data
    assert "edges" in data
    assert "generatedAt" in data
    assert len(data["nodes"]) > 0

    # Check field node exists
    field_nodes = [n for n in data["nodes"] if n["type"] == "field"]
    assert len(field_nodes) == 1
    assert field_nodes[0]["id"] == "PB-FIELD-001"
    # Admin can see farmerId
    assert "farmerId" in field_nodes[0]["meta"]

    # Check project node exists and edge connects project -> field
    proj_nodes = [n for n in data["nodes"] if n["type"] == "project"]
    assert len(proj_nodes) == 1
    has_field_edges = [e for e in data["edges"] if e["relation"] == "has_field"]
    assert any(e["source"] == proj_nodes[0]["id"] and e["target"] == "PB-FIELD-001" for e in has_field_edges)

    # Check deterministic ordering: repeated call returns exact same order of node and edge IDs
    resp2 = client.get("/api/fields/PB-FIELD-001/graph", headers=auth_headers("admin"))
    data2 = resp2.json()
    assert [n["id"] for n in data["nodes"]] == [n["id"] for n in data2["nodes"]]
    assert [e["id"] for e in data["edges"]] == [e["id"] for e in data2["edges"]]

def test_project_evidence_graph_developer(client, auth_headers):
    resp = client.get("/api/projects/PRJ-PB-DSR-001/graph", headers=auth_headers("project_developer"))
    assert resp.status_code == 200
    data = resp.json()
    assert "nodes" in data
    assert "edges" in data

    # Project node present
    proj_nodes = [n for n in data["nodes"] if n["type"] == "project" and n["id"] == "PRJ-PB-DSR-001"]
    assert len(proj_nodes) == 1

    # Field node included
    field_nodes = [n for n in data["nodes"] if n["type"] == "field" and n["id"] == "PB-FIELD-001"]
    assert len(field_nodes) == 1

def test_superseded_evidence_isolation(client, test_container, auth_headers):
    # Run an assessment first to have rule results
    assess_resp = client.post("/api/assessments/run", json={"fieldId": "PB-FIELD-001"}, headers=auth_headers("reviewer"))
    assert assess_resp.status_code == 201

    # Add a superseded evidence item
    superseded_ev = Evidence(
        id="EV-SUPERSEDED-001",
        field_id="PB-FIELD-001",
        activity_id="ACT-PB-001",
        title="Superseded Sowing Photo",
        description="Earlier blurry sowing photo",
        type=EvidenceType.PHOTO,
        category=EvidenceCategory.SUPPORTING,
        status=EvidenceStatus.SUPERSEDED,
        supersedes_id="EV-PB-001",
        captured_at="2026-06-15T09:00:00Z",
        submitted_at="2026-06-15T09:10:00Z",
        submitter_id="usr_farmer_01",
        provenance=Provenance(
            author="Harpreet Singh",
            source="Farmer Mobile App",
            sha256="abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            gps_coordinates=Coordinates(lat=30.9010, lng=75.8573),
        ),
    )
    test_container.evidence_repo.create(superseded_ev)

    resp = client.get("/api/fields/PB-FIELD-001/graph", headers=auth_headers("admin"))
    assert resp.status_code == 200
    data = resp.json()

    # The superseded node exists
    sup_node = next((n for n in data["nodes"] if n["id"] == "EV-SUPERSEDED-001"), None)
    assert sup_node is not None
    assert sup_node["status"] == "superseded"

    # But it MUST NOT have any active 'supports' edge to any rule result
    rule_result_edges = [
        e for e in data["edges"]
        if e["source"] == "EV-SUPERSEDED-001" and e["relation"] == "supports"
    ]
    assert len(rule_result_edges) == 0

def test_graph_rbac_buyer_denied(client, auth_headers):
    # Buyer receives 404 for both field and project graphs
    field_resp = client.get("/api/fields/PB-FIELD-001/graph", headers=auth_headers("buyer"))
    assert field_resp.status_code == 404

    proj_resp = client.get("/api/projects/PRJ-PB-DSR-001/graph", headers=auth_headers("buyer"))
    assert proj_resp.status_code == 404

def test_graph_rbac_farmer_own_field_privacy(client, auth_headers):
    # Farmer accessing own assigned field succeeds
    resp = client.get("/api/fields/PB-FIELD-001/graph", headers=auth_headers("farmer"))
    assert resp.status_code == 200
    data = resp.json()

    # 1. No review nodes present for farmer (Amendment 6)
    review_nodes = [n for n in data["nodes"] if n["type"] == "review"]
    assert len(review_nodes) == 0

    # 2. No review edges present
    review_edges = [e for e in data["edges"] if e["relation"] == "reviewed_in"]
    assert len(review_edges) == 0

    # 3. Farmer PII is redacted from field node
    field_node = next(n for n in data["nodes"] if n["id"] == "PB-FIELD-001")
    assert "farmerId" not in field_node["meta"]

def test_graph_rbac_farmer_unassigned_field_denied(client, auth_headers):
    # Farmer accessing unassigned field receives 404
    resp = client.get("/api/fields/PB-FIELD-999/graph", headers=auth_headers("farmer"))
    assert resp.status_code == 404

    # Farmer accessing project graph receives 404
    proj_resp = client.get("/api/projects/PRJ-PB-DSR-001/graph", headers=auth_headers("farmer"))
    assert proj_resp.status_code == 404

def test_graph_unauthenticated(client):
    resp = client.get("/api/fields/PB-FIELD-001/graph")
    assert resp.status_code == 401
