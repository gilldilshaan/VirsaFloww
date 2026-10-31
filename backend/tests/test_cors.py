import pytest
from fastapi import Request
from fastapi.testclient import TestClient

from backend.app.main import create_app
from backend.app.core.config import Settings, settings

def test_dev_preflight_localhost_8080_passes(client):
    """Verifies that development CORS preflight from http://localhost:8080 succeeds with 200 OK and matching Allow-Origin."""
    res = client.options(
        "/api/auth/register",
        headers={
            "Origin": "http://localhost:8080",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization,content-type",
        },
    )
    assert res.status_code == 200
    assert res.headers.get("access-control-allow-origin") == "http://localhost:8080"
    assert "POST" in res.headers.get("access-control-allow-methods", "")

def test_dev_preflight_127_0_0_1_5173_passes(client):
    """Verifies that development CORS preflight from http://127.0.0.1:5173 succeeds."""
    res = client.options(
        "/api/auth/register",
        headers={
            "Origin": "http://127.0.0.1:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization,content-type",
        },
    )
    assert res.status_code == 200
    assert res.headers.get("access-control-allow-origin") == "http://127.0.0.1:5173"

def test_dev_preflight_evil_origin_fails(client):
    """Verifies that development CORS preflight from unauthorized origins is rejected with HTTP 400."""
    res = client.options(
        "/api/auth/register",
        headers={
            "Origin": "https://evil.example",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization,content-type",
        },
    )
    assert res.status_code == 400
    assert res.headers.get("access-control-allow-origin") is None

def test_production_mode_rejects_localhost_unless_explicitly_listed(monkeypatch):
    """Verifies that when APP_ENV=production, localhost is blocked unless explicitly enumerated in CORS_ORIGINS."""
    monkeypatch.setattr(settings, "APP_ENV", "production")
    monkeypatch.setattr(settings, "CORS_ORIGINS", ["https://app.terraledger.ai"])

    app = create_app()
    with TestClient(app) as prod_client:
        # Preflight from localhost should be rejected
        res_local = prod_client.options(
            "/api/auth/register",
            headers={
                "Origin": "http://localhost:8080",
                "Access-Control-Request-Method": "POST",
            },
        )
        assert res_local.status_code == 400
        assert res_local.headers.get("access-control-allow-origin") is None

        # Preflight from explicit production origin should be allowed
        res_prod = prod_client.options(
            "/api/auth/register",
            headers={
                "Origin": "https://app.terraledger.ai",
                "Access-Control-Request-Method": "POST",
            },
        )
        assert res_prod.status_code == 200
        assert res_prod.headers.get("access-control-allow-origin") == "https://app.terraledger.ai"

def test_production_refuses_to_start_with_wildcard_or_empty_origins(monkeypatch):
    """Verifies production safety assertion: refusing to start if CORS_ORIGINS is empty or wildcard with credentials."""
    monkeypatch.setattr(Settings, "APP_ENV", "production")
    monkeypatch.setattr(Settings, "JWT_SECRET", "super-secure-production-jwt-secret-with-high-entropy-64-bytes")
    monkeypatch.setattr(Settings, "APP_MODE", "live")

    # 1. Empty origins
    monkeypatch.setattr(Settings, "CORS_ORIGINS", [])
    with pytest.raises(RuntimeError, match="CORS_ORIGINS must not be empty"):
        Settings.validate_production_safety()

    # 2. Wildcard origin
    monkeypatch.setattr(Settings, "CORS_ORIGINS", ["*"])
    with pytest.raises(RuntimeError, match="must not contain '\\*'"):
        Settings.validate_production_safety()

def test_500_error_responses_preserve_cors_headers(test_container):
    """Verifies that unhandled 500 exceptions still return Access-Control-Allow-Origin to allowed origins."""
    app = create_app()

    @app.get("/api/test-crash")
    def crash_route():
        raise RuntimeError("Simulated crash for CORS testing")

    with TestClient(app, raise_server_exceptions=False) as crash_client:
        # Request with allowed origin
        res = crash_client.get("/api/test-crash", headers={"Origin": "http://localhost:8080"})
        assert res.status_code == 500
        assert res.headers.get("access-control-allow-origin") == "http://localhost:8080"
        assert res.json()["error"]["code"] == "INTERNAL_SERVER_ERROR"

        # Request with evil origin should NOT have Access-Control-Allow-Origin
        res_evil = crash_client.get("/api/test-crash", headers={"Origin": "https://evil.example"})
        assert res_evil.status_code == 500
        assert res_evil.headers.get("access-control-allow-origin") is None
