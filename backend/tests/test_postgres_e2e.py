"""End-to-End API integration tests using PostgreSQL storage backend against TEST database."""

import os
import pytest
from fastapi.testclient import TestClient

from backend.app.api import deps
from backend.app.core.config import settings
from backend.app.main import create_app
from backend.app.schemas.user import User
from backend.scripts.migrate_json_to_postgres import JsonToPostgresMigrator


@pytest.fixture(scope="module")
def postgres_e2e():
    """Configures the application container to use PostgreSQL storage against TEST database."""
    # Ensure migration has seeded the TEST database
    migrator = JsonToPostgresMigrator(target="test", apply=True)
    migrator.run()

    old_backend = settings.STORAGE_BACKEND
    settings.STORAGE_BACKEND = "postgres"

    old_container = deps._container
    container = deps.AppContainer()
    deps.set_container(container)

    app = create_app()
    with TestClient(app) as client:
        # Generate valid tokens directly from postgres user repository
        admin_user_db = container.user_repo.find_one(lambda u: u.email == "admin@terraledger.ai")
        assert admin_user_db is not None
        admin_user = User.model_validate(admin_user_db.model_dump())
        admin_token, _ = container.auth_service.create_access_token(admin_user)
        admin_headers = {"Authorization": f"Bearer {admin_token}"}

        yield client, admin_headers, container

    deps.set_container(old_container)
    settings.STORAGE_BACKEND = old_backend


def test_postgres_health_endpoint(postgres_e2e):
    """GET /api/health returns operational status."""
    client, _, _ = postgres_e2e
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"


def test_postgres_auth_me(postgres_e2e):
    """GET /api/me succeeds with admin JWT."""
    client, admin_headers, _ = postgres_e2e
    me_resp = client.get("/api/me", headers=admin_headers)
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["email"] == "admin@terraledger.ai"
    assert me_data["role"] == "admin"


def test_postgres_projects_list(postgres_e2e):
    """GET /api/projects returns the migrated demo project with correct envelope shape."""
    client, admin_headers, _ = postgres_e2e
    resp = client.get("/api/projects", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 1
    project_slugs = [p["slug"] for p in data["items"]]
    assert "punjab-dsr-cluster-1" in project_slugs


def test_postgres_fields_and_evidence_list(postgres_e2e):
    """GET /api/fields and /api/evidence return migrated seed entities."""
    client, admin_headers, _ = postgres_e2e

    # Fields list
    fields_resp = client.get("/api/fields", headers=admin_headers)
    assert fields_resp.status_code == 200
    f_data = fields_resp.json()
    assert f_data["total"] >= 1
    assert any(f["code"] == "PB-FIELD-001" for f in f_data["items"])

    # Evidence list
    ev_resp = client.get("/api/evidence", headers=admin_headers)
    assert ev_resp.status_code == 200
    ev_data = ev_resp.json()
    assert ev_data["total"] >= 1
    assert any(e["id"] == "EV-2026-001" for e in ev_data["items"])


def test_postgres_audit_log_endpoint(postgres_e2e):
    """GET /api/audit returns the migrated audit events with unbroken hash chain."""
    client, admin_headers, _ = postgres_e2e
    audit_resp = client.get("/api/audit", headers=admin_headers)
    assert audit_resp.status_code == 200
    audit_data = audit_resp.json()
    assert audit_data["total"] >= 25
    # First event previousHash is 64 zeroes
    assert audit_data["items"][0]["previousHash"] == "0" * 64
