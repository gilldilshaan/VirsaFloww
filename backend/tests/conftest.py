import os
import tempfile
import pytest
from fastapi.testclient import TestClient

from backend.app.main import create_app
from backend.app.core.config import settings
from backend.app.api.deps import AppContainer, set_container
from backend.app.schemas.user import User, UserRole

@pytest.fixture(scope="session")
def test_temp_dir():
    with tempfile.TemporaryDirectory() as tmpdir:
        yield tmpdir

@pytest.fixture(scope="function")
def test_container(tmp_path):
    runtime_dir = str(tmp_path / "runtime")
    audit_path = str(tmp_path / "audit" / "audit.jsonl")
    container = AppContainer(
        runtime_dir=runtime_dir,
        seed_dir=settings.SEED_DIR,
        audit_path=audit_path,
    )
    set_container(container)
    yield container
    set_container(None)

@pytest.fixture(scope="function")
def client(test_container):
    app = create_app()
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def auth_headers(test_container):
    def _get_headers(role: str = "admin") -> dict:
        email_map = {
            "admin": "admin@terraledger.ai",
            "project_developer": "developer@panjdhara.com",
            "field_officer": "officer@ludhiana-fpo.org",
            "reviewer": "reviewer@vvb-auditor.org",
            "farmer": "farmer@punjab-agri.in",
            "buyer": "buyer@auraclimate.com",
        }
        target_email = email_map.get(role)
        user_in_db = test_container.user_repo.find_one(lambda u: u.role.value == role or u.email == target_email)
        if not user_in_db:
            raise ValueError(f"No test user found for role: {role}")
        user = User.model_validate(user_in_db.model_dump())
        token, _ = test_container.auth_service.create_access_token(user)
        return {"Authorization": f"Bearer {token}"}
    return _get_headers
