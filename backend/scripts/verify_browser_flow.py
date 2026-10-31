#!/usr/bin/env python3
"""
TerraLedger AI — Real Browser Flow & CORS End-to-End Verification Script

Validates the backend against real browser cross-origin requests:
1. Health check (GET /api/health)
2. Preflight OPTIONS requests from multiple dev ports (8080, 8081, 5173) and rejection of unauthorized origins
3. Full registration flow (POST /api/auth/register) with Origin header and CORS response header verification
4. Full login & profile restoration (POST /api/auth/session + GET /api/me) with Bearer token
5. Error envelope CORS header preservation on validation failures (short password)
"""

import sys
import time
import httpx

SERVER_BASE_URL = "http://127.0.0.1:8000"

def log_step(name: str, passed: bool, details: str = "") -> None:
    status_str = "\033[92mPASS\033[0m" if passed else "\033[91mFAIL\033[0m"
    print(f"[{status_str}] {name}")
    if details:
        for line in details.strip().splitlines():
            print(f"       {line}")

def main() -> int:
    all_passed = True
    created_accounts = []

    print("===================================================================")
    print(" TerraLedger AI — Real Browser & CORS End-to-End Verification")
    print(f" Target Server: {SERVER_BASE_URL}")
    print("===================================================================")

    with httpx.Client(base_url=SERVER_BASE_URL, timeout=10.0) as client:
        # -----------------------------------------------------------------
        # Step 1: Health Check
        # -----------------------------------------------------------------
        try:
            res = client.get("/api/health")
            status_val = res.json().get("status") if res.status_code == 200 else None
            if res.status_code == 200 and status_val in ("ok", "healthy"):
                log_step("Step 1: GET /api/health", True, f"HTTP {res.status_code}: {res.json()}")
            else:
                log_step("Step 1: GET /api/health", False, f"Unexpected response: HTTP {res.status_code} - {res.text}")
                all_passed = False
        except Exception as exc:
            log_step("Step 1: GET /api/health", False, f"Connection failed: {exc}")
            return 1

        # -----------------------------------------------------------------
        # Step 2: Preflight OPTIONS requests
        # -----------------------------------------------------------------
        origins_to_test = [
            ("http://localhost:8080", True),
            ("http://localhost:8081", True),
            ("http://127.0.0.1:5173", True),
            ("https://evil.example", False),
        ]

        step2_passed = True
        step2_details = []

        for origin, should_succeed in origins_to_test:
            res = client.options(
                "/api/auth/register",
                headers={
                    "Origin": origin,
                    "Access-Control-Request-Method": "POST",
                    "Access-Control-Request-Headers": "authorization,content-type",
                },
            )
            allow_origin = res.headers.get("access-control-allow-origin")
            if should_succeed:
                if res.status_code == 200 and allow_origin == origin:
                    step2_details.append(f"Origin {origin} -> 200 OK (Allow-Origin: {allow_origin})")
                else:
                    step2_details.append(
                        f"Origin {origin} -> FAILED: HTTP {res.status_code}, Allow-Origin: {allow_origin}"
                    )
                    step2_passed = False
            else:
                # Should be rejected: status 400 or no allow-origin header matching evil.example
                if res.status_code == 400 or allow_origin != origin:
                    step2_details.append(
                        f"Origin {origin} (Unauthorized) -> Rejected properly (HTTP {res.status_code}, Allow-Origin: {allow_origin})"
                    )
                else:
                    step2_details.append(
                        f"Origin {origin} -> FAILED: Unauthorized origin was allowed! Allow-Origin: {allow_origin}"
                    )
                    step2_passed = False

        log_step("Step 2: Preflight OPTIONS on /api/auth/register", step2_passed, "\n".join(step2_details))
        if not step2_passed:
            all_passed = False

        # -----------------------------------------------------------------
        # Step 3: Registration with Origin header
        # -----------------------------------------------------------------
        test_email = f"verify.{int(time.time())}@example.com"
        test_password = "SecurePassword123!"
        test_origin = "http://localhost:8080"

        reg_payload = {
            "name": "Simulated Farmer",
            "email": test_email,
            "password": test_password,
            "role": "farmer",
            "organization": "Punjab Progressive Farmers Society",
        }

        try:
            res = client.post(
                "/api/auth/register",
                json=reg_payload,
                headers={"Origin": test_origin},
            )
            allow_origin = res.headers.get("access-control-allow-origin")
            body = res.json()
            token = body.get("accessToken") or body.get("access_token")

            if res.status_code == 201 and token and allow_origin == test_origin:
                created_accounts.append(test_email)
                log_step(
                    "Step 3: POST /api/auth/register with Origin",
                    True,
                    f"Created account: {test_email}\n"
                    f"HTTP 201 Created | Access-Control-Allow-Origin: {allow_origin}\n"
                    f"User ID: {body.get('user', {}).get('id')} | Role: {body.get('user', {}).get('role')}",
                )
            else:
                log_step(
                    "Step 3: POST /api/auth/register with Origin",
                    False,
                    f"HTTP {res.status_code} | Allow-Origin: {allow_origin} | Body: {res.text}",
                )
                all_passed = False
        except Exception as exc:
            log_step("Step 3: POST /api/auth/register with Origin", False, f"Request error: {exc}")
            all_passed = False

        # -----------------------------------------------------------------
        # Step 4: Login and Profile Restoration (/api/me)
        # -----------------------------------------------------------------
        try:
            # Login
            login_res = client.post(
                "/api/auth/session",
                json={"email": test_email, "password": test_password},
                headers={"Origin": test_origin},
            )
            login_allow_origin = login_res.headers.get("access-control-allow-origin")
            login_body = login_res.json()
            session_token = login_body.get("accessToken") or login_body.get("access_token")

            # Profile verification via /api/me
            me_res = client.get(
                "/api/me",
                headers={
                    "Authorization": f"Bearer {session_token}",
                    "Origin": test_origin,
                },
            )
            me_allow_origin = me_res.headers.get("access-control-allow-origin")
            me_body = me_res.json()

            if (
                login_res.status_code == 200
                and session_token
                and login_allow_origin == test_origin
                and me_res.status_code == 200
                and me_body.get("email") == test_email
                and me_body.get("role") == "farmer"
                and me_allow_origin == test_origin
            ):
                log_step(
                    "Step 4: POST /api/auth/session -> GET /api/me with Bearer token",
                    True,
                    f"Login HTTP 200 | Allow-Origin: {login_allow_origin}\n"
                    f"/api/me HTTP 200 | Allow-Origin: {me_allow_origin}\n"
                    f"Authenticated User: {me_body.get('name')} ({me_body.get('email')}) | Role: {me_body.get('role')}",
                )
            else:
                log_step(
                    "Step 4: POST /api/auth/session -> GET /api/me with Bearer token",
                    False,
                    f"Login HTTP {login_res.status_code} | /api/me HTTP {me_res.status_code}\n"
                    f"Login Origin: {login_allow_origin} | Me Origin: {me_allow_origin}\n"
                    f"Me Body: {me_res.text}",
                )
                all_passed = False
        except Exception as exc:
            log_step("Step 4: POST /api/auth/session -> GET /api/me with Bearer token", False, f"Request error: {exc}")
            all_passed = False

        # -----------------------------------------------------------------
        # Step 5: Deliberate 400/422 validation failure with CORS headers
        # -----------------------------------------------------------------
        try:
            bad_res = client.post(
                "/api/auth/register",
                json={
                    "name": "Bad Password User",
                    "email": f"bad.{int(time.time())}@example.com",
                    "password": "short",  # Less than 8 chars
                    "role": "farmer",
                },
                headers={"Origin": test_origin},
            )
            bad_allow_origin = bad_res.headers.get("access-control-allow-origin")
            if bad_res.status_code in (400, 422) and bad_allow_origin == test_origin:
                log_step(
                    "Step 5: Deliberate validation failure preserves CORS headers",
                    True,
                    f"HTTP {bad_res.status_code} (as expected for short password)\n"
                    f"Access-Control-Allow-Origin: {bad_allow_origin}\n"
                    f"Error Envelope: {bad_res.json()}",
                )
            else:
                log_step(
                    "Step 5: Deliberate validation failure preserves CORS headers",
                    False,
                    f"HTTP {bad_res.status_code} | Allow-Origin: {bad_allow_origin} | Body: {bad_res.text}",
                )
                all_passed = False
        except Exception as exc:
            log_step(
                "Step 5: Deliberate validation failure preserves CORS headers",
                False,
                f"Request error: {exc}",
            )
            all_passed = False

    print("===================================================================")
    if created_accounts:
        print("Note: The following real verification account was created (do NOT delete):")
        for acc in created_accounts:
            print(f"  - {acc}")
    print("===================================================================")

    if all_passed:
        print("\033[92mALL BROWSER FLOW & CORS VERIFICATION CHECKS PASSED SUCCESSFULLY!\033[0m")
        return 0
    else:
        print("\033[91mONE OR MORE VERIFICATION CHECKS FAILED.\033[0m")
        return 1

if __name__ == "__main__":
    sys.exit(main())
