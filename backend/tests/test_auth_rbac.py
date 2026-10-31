from datetime import datetime, timezone, timedelta
import jwt
from backend.app.utils.crypto import hash_password
from fastapi.testclient import TestClient
from backend.app.core.config import settings

def test_login_success_and_me(client: TestClient, test_container):
    # Get admin from the temporary test database
    admin = test_container.user_repo.find_one(
        lambda u: u.email.lower() == "admin@terraledger.ai"
    )
    assert admin is not None

    # Set a known password only in the temporary test database
    updated_admin = admin.model_copy(
        update={"password_hash": hash_password("admin12345")}
    )
    test_container.user_repo.update(updated_admin)

    # Test login
    resp = client.post(
        "/api/auth/session",
        json={"email": "admin@terraledger.ai", "password": "admin12345"},
    )

    assert resp.status_code == 200
    data = resp.json()

    assert "accessToken" in data
    assert "user" in data
    assert data["user"]["email"] == "admin@terraledger.ai"
    assert data["user"]["role"] == "admin"

    # Test /api/me
    token = data["accessToken"]
    me_resp = client.get(
        "/api/me",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "admin@terraledger.ai"

def test_login_failure_and_throttling(client: TestClient):
    email = "officer@ludhiana-fpo.org"

    # 5 consecutive bad attempts
    for _ in range(5):
        resp = client.post("/api/auth/session", json={"email": email, "password": "wrong"})
        assert resp.status_code == 401

    # 6th bad attempt triggers throttling / lockout
    resp6 = client.post("/api/auth/session", json={"email": email, "password": "wrong"})
    assert resp6.status_code == 429
    assert resp6.json()["error"]["code"] == "RATE_LIMITED"

def test_token_tampering_role_spoofing(client: TestClient, test_container):
    # Attacker crafts a token with role: "admin", but subject is a buyer user
    buyer = test_container.user_repo.find_one(lambda u: u.role.value == "buyer")
    assert buyer is not None

    now = datetime.now(timezone.utc)
    expire = now + timedelta(hours=1)
    payload = {
        "sub": buyer.id,
        "email": buyer.email,
        "role": "admin",  # Attacker attempts to claim admin role in token
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "iss": "TerraLedger-AI-Backend",
    }
    forged_token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    # Calling an admin-only endpoint: /api/audit
    # The server MUST look up buyer.id in user_repo and discover role == "buyer", rejecting with 404
    resp = client.get("/api/audit", headers={"Authorization": f"Bearer {forged_token}"})
    assert resp.status_code == 404

def test_rbac_audit_endpoint_access(client: TestClient, auth_headers):
    # Admin allowed
    admin_headers = auth_headers("admin")
    resp = client.get("/api/audit", headers=admin_headers)
    assert resp.status_code == 200

    # Reviewer allowed
    reviewer_headers = auth_headers("reviewer")
    resp = client.get("/api/audit", headers=reviewer_headers)
    assert resp.status_code == 200

    # Field officer denied (404 NOT FOUND to avoid endpoint discovery)
    officer_headers = auth_headers("field_officer")
    resp = client.get("/api/audit", headers=officer_headers)
    assert resp.status_code == 404

    # Farmer denied
    farmer_headers = auth_headers("farmer")
    resp = client.get("/api/audit", headers=farmer_headers)
    assert resp.status_code == 404

    # Buyer denied
    buyer_headers = auth_headers("buyer")
    resp = client.get("/api/audit", headers=buyer_headers)
    assert resp.status_code == 404

def test_register_success(client: TestClient):
    reg_payload = {
        "name": "Simranjit Kaur",
        "email": "simranjit@punjab-agri.in",
        "password": "SecurePassword2026!",
        "role": "farmer",
        "organization": "Malwa Farmer Collective",
    }
    resp = client.post("/api/auth/register", json=reg_payload)
    assert resp.status_code == 201
    data = resp.json()
    assert "accessToken" in data
    assert "user" in data
    assert data["user"]["email"] == "simranjit@punjab-agri.in"
    assert data["user"]["name"] == "Simranjit Kaur"
    assert data["user"]["role"] == "farmer"
    assert data["user"]["organization"] == "Malwa Farmer Collective"

    # Verify session token works on /api/me
    token = data["accessToken"]
    me_resp = client.get("/api/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "simranjit@punjab-agri.in"

    # Verify subsequent login works with new credentials
    login_resp = client.post(
        "/api/auth/session",
        json={"email": "simranjit@punjab-agri.in", "password": "SecurePassword2026!"},
    )
    assert login_resp.status_code == 200
    assert login_resp.json()["user"]["name"] == "Simranjit Kaur"

def test_register_duplicate_email(client: TestClient):
    # Attempting to register existing email
    payload = {
        "name": "Duplicate Tester",
        "email": "admin@terraledger.ai",
        "password": "Password123!",
        "role": "farmer",
    }
    resp = client.post("/api/auth/register", json=payload)
    assert resp.status_code == 400
    err = resp.json()
    assert err["error"]["code"] == "EMAIL_ALREADY_EXISTS"

def test_register_short_password(client: TestClient):
    payload = {
        "name": "Short Pass User",
        "email": "shortpass@example.com",
        "password": "short",
        "role": "farmer",
    }
    resp = client.post("/api/auth/register", json=payload)
    assert resp.status_code == 422
