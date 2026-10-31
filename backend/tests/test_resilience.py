import os
import json
import time
import jwt
import pytest
from backend.app.core.config import settings
from agent.cache import ExplainerCache
from agent.context import ExplainerContext
from agent.explainer import TerraExplainer

def test_missing_observations_graceful_handling(client, test_container, auth_headers):
    # Ensure observations path does not exist
    non_existent_path = os.path.join(settings.RUNTIME_DIR, "non_existent_observations.json")
    if os.path.exists(non_existent_path):
        os.remove(non_existent_path)

    # Calling graph endpoint should succeed gracefully with 0 satellite observation nodes
    resp = client.get("/api/fields/PB-FIELD-001/graph", headers=auth_headers("admin"))
    assert resp.status_code == 200
    data = resp.json()
    sat_nodes = [n for n in data["nodes"] if n["type"] == "satellite_observation"]
    assert len(sat_nodes) == 0

def test_corrupted_explainer_cache_file_recovery(tmp_path):
    cache_path = str(tmp_path / "corrupted_cache.json")
    with open(cache_path, "w", encoding="utf-8") as f:
        f.write("{ invalid json corrupted content !#@$%")

    cache = ExplainerCache(cache_path)
    # Reading corrupted cache must return {} instead of crashing
    data = cache._read_cache()
    assert data == {}

    # Setting value should overwrite cleanly with valid JSON
    cache.set("test_key", {"summary": "recovered"})
    recovered = cache.get("test_key")
    assert recovered == {"summary": "recovered"}

def test_jwt_tampering_and_expiration_resilience(client):
    # 1. Random garbage token
    r1 = client.get("/api/me", headers={"Authorization": "Bearer not.a.real.jwt.token"})
    assert r1.status_code == 401
    assert r1.json()["error"]["code"] == "UNAUTHENTICATED"

    # 2. Expired JWT token
    expired_payload = {
        "sub": "usr_admin_01",
        "email": "admin@terraledger.ai",
        "role": "admin",
        "exp": int(time.time()) - 3600,  # 1 hour ago
        "iat": int(time.time()) - 7200,
    }
    expired_token = jwt.encode(expired_payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    r2 = client.get("/api/me", headers={"Authorization": f"Bearer {expired_token}"})
    assert r2.status_code == 401
    assert r2.json()["error"]["code"] == "UNAUTHENTICATED"

def test_nonexistent_resources_404_resilience(client, auth_headers):
    # Non-existent field graph
    r_graph = client.get("/api/fields/NON_EXISTENT_FIELD/graph", headers=auth_headers("admin"))
    assert r_graph.status_code == 404
    assert r_graph.json()["error"]["code"] == "NOT_FOUND"

    # Non-existent assessment explanation
    r_expl = client.post(
        "/api/explanations",
        json={"assessmentId": "NON_EXISTENT_ASSESSMENT"},
        headers=auth_headers("reviewer"),
    )
    assert r_expl.status_code == 404
    assert r_expl.json()["error"]["code"] == "NOT_FOUND"
