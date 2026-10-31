import json
from fastapi.testclient import TestClient

def test_satellite_graceful_missing_dataset(client: TestClient, auth_headers, tmp_path, monkeypatch):
    officer_headers = auth_headers("field_officer")

    # Point to nonexistent observations file
    nonexistent = str(tmp_path / "nonexistent_observations.json")
    monkeypatch.setattr("backend.app.core.config.settings.LEAD_OBSERVATIONS_PATH", nonexistent)

    # Calling endpoint must return 200 with empty list, NOT 500 error
    resp = client.get("/api/satellite/observations", headers=officer_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["items"] == []
    assert data["total"] == 0
    assert data["metadata"]["status"] == "no_data_available"

def test_satellite_observations_with_fixture(client: TestClient, auth_headers, tmp_path, monkeypatch):
    officer_headers = auth_headers("field_officer")

    # Point to valid observations file
    obs_file = tmp_path / "observations.json"
    obs_file.write_text(
        json.dumps([
            {
                "id": "SAT-TEST-01",
                "date": "2026-06-15",
                "sensor": "Copernicus Sentinel-2 MSI",
                "cloudCoverPercent": 2.1,
                "sunAzimuthDeg": 130.0,
                "meanNdvi": 0.45,
                "meanNdwi": 0.32,
            }
        ]),
        encoding="utf-8",
    )
    monkeypatch.setattr("backend.app.core.config.settings.LEAD_OBSERVATIONS_PATH", str(obs_file))

    resp = client.get("/api/satellite/observations", headers=officer_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert data["items"][0]["id"] == "SAT-TEST-01"
    assert data["items"][0]["cloudCoverPercent"] == 2.1
