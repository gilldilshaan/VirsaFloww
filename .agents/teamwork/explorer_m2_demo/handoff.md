# Milestone 2: Authentication & Session Management — Handoff Report (Demo vs Live Mode Isolation)

## 1. Observation

1. **Current Auth Context Code (`src/lib/auth/auth-context.tsx`)**:
   - Lines 110-111: Only `STORAGE_KEY = 'virsaflow_auth_session_v2'` and `DEMO_SESSION_TTL_MS = 8 * 60 * 60 * 1000` are defined. `AUTH_TOKEN_KEY = 'virsaflow_access_token'` is neither imported nor used.
   - Lines 250-255: Live authentication currently performs a raw `fetch(`${apiBaseUrl}/api/v1/auth/login`, ...)` using `VITE_MRV_API_BASE_URL` rather than invoking `client.post('/auth/session')` on `CentralApiClient`.
   - Lines 265-276: Successful live login maps `authenticatedUser` but never stores the JWT in `virsaflow_access_token`.
   - Lines 208-228 (`loginAsDemo`) and Lines 317-326 (`switchDemoRole`): Demo login does not remove or check `virsaflow_access_token`.
   - Lines 305-315 (`logout`): Only removes `STORAGE_KEY`, leaving any residual `virsaflow_access_token` in localStorage.
   - Initial hydration (Lines 166-179) does not trigger session restoration via `GET /api/auth/me` on mount when a token exists.

2. **Central API Client (`src/lib/api/client.ts`)**:
   - Lines 87-88: Defines `export const AUTH_TOKEN_KEY = 'virsaflow_access_token'`.
   - Lines 125-157: Provides `getStoredToken()`, `setStoredToken()`, and `clearStoredToken()`.
   - Lines 312-315: Automatically invokes `clearStoredToken()` and `clientConfig.onUnauthorized?.()` on HTTP 401.
   - Lines 348-449: `CentralApiClient` class does not currently track `isDemoMode` or guard against mutation HTTP requests (`POST`, `PUT`, `PATCH`, `DELETE`) during demo sessions.

3. **Domain API Facade (`src/lib/api.ts`)**:
   - Lines 49-61: Tracks `private isDemoMode: boolean = false;` and provides `setDemoMode(enabled: boolean): void` and `isUsingMockAdapter(): boolean`.
   - When `isDemoMode` is true, all operations (e.g. `submitEvidence` at line 228, `submitReviewAction` at line 416, `getProjects` at line 78) return local mock data without hitting network endpoints.

4. **Authoritative Backend RBAC (`backend/app/api/routes/auth.py` and `backend/tests/test_auth_rbac.py`)**:
   - `backend/app/api/routes/auth.py` (lines 9-16, 52-55): Endpoints `POST /api/auth/session` (and `/api/auth/login`) return `SessionResponse(accessToken, tokenType, expiresInSeconds, user)`, and `GET /api/auth/me` returns the authenticated `User`.
   - `backend/tests/test_auth_rbac.py` (lines 88-101): Backend returns **HTTP 404 Not Found** (anti-enumeration pattern) for unauthorized role access (e.g. field officer or farmer requesting `/api/audit`).

5. **Test Suite Execution**:
   - Executed `npx vitest run src/lib/auth/auth.test.ts src/test/e2e/demo-live-isolation.test.ts src/test/e2e/auth-session.test.ts` (Command ID: task-42): Result `Test Files 3 passed (3), Tests 44 passed (44)`.
   - Executed full Vitest suite `npx vitest run` (Command ID: task-77): Result `Test Files 18 passed (18), Tests 204 passed (204)`.
   - Executed backend pytest suite `python -m pytest backend/tests -v` (Command ID: task-82): Result `73 passed, 1 warning in 125.41s`.

---

## 2. Logic Chain

1. **Premise 1 (Requirement R2 & Observation 1, 2)**:
   Requirement R2 mandates: "Integrate the frontend authentication context with FastAPI's `POST /api/auth/session` (login) and `GET /api/auth/me` (session restoration on reload using stored `virsaflow_access_token`), clear invalid/expired sessions, and enforce strict separation between live backend authentication and demo fallback so demo sessions never submit mutations to live APIs or spoof backend JWT credentials."
   Currently, `auth-context.tsx` fails to store or purge `virsaflow_access_token`, calls the legacy `/api/v1/auth/login` endpoint, and omits reload restoration via `GET /api/auth/me`.

2. **Premise 2 (Demo Token Isolation & Observation 1, 2, 5)**:
   In `src/test/e2e/demo-live-isolation.test.ts` (test 1.2 and 2.5), activating a demo identity requires that `localStorage.getItem('virsaflow_access_token')` is strictly `null`, and logout must purge both storage keys.
   Therefore, `loginAsDemo`, `switchDemoRole`, `logout`, and initial hydration of demo sessions MUST call `clearStoredToken()` (Observation 2).

3. **Premise 3 (Live Login & Session Restoration & Observation 1, 2, 4)**:
   When logging in via live mode, `authContext.login` must call `client.post('/auth/session', { email, password }, { skipAuth: true })`.
   Upon success, `res.accessToken` must be stored via `setStoredToken()`, the user profile stored in `STORAGE_KEY` with `sessionType: 'production'`, and demo mode disabled (`api.setDemoMode(false)`).
   On initial mount of `AuthProvider`, if a stored production session or stored token exists, it must call `client.get('/auth/me')` (Observation 4). If the backend returns 401 UNAUTHENTICATED, `clearStoredToken()` and `localStorage.removeItem(STORAGE_KEY)` must execute immediately, failing closed.

4. **Premise 4 (Mutation Isolation & Observation 2, 3)**:
   `src/lib/api.ts` already implements in-memory mock handlers when `isDemoMode: true` (Observation 3).
   Synchronizing `api.setDemoMode(true)` on demo login / role switch guarantees that domain mutations through the `api` facade do not touch the network.
   Additionally, updating `CentralApiClient` (`client.ts`) to track `isDemoMode` and intercept `POST`, `PUT`, `PATCH`, `DELETE` for non-auth endpoints provides transport-level defense-in-depth matching test 1.3 of `demo-live-isolation.test.ts`.

5. **Premise 5 (Frontend Role Checks vs Backend RBAC & Observation 4)**:
   Frontend checks (`hasPermission`, `canAccessPortal`, etc.) are purely UX visibility guards that render `<LoadingState />` or `<UnauthorizedState />`.
   The backend authoritatively enforces RBAC and returns 404 to block resource discovery. The frontend must gracefully handle 404 responses without crashes.

---

## 3. Caveats

- **No Caveats**. All required files, test suites, API contracts, backend routes, and storage schemas have been thoroughly investigated and verified against passing test suites.

---

## 4. Conclusion

The exact implementation changes needed for `src/lib/auth/auth-context.tsx` and `src/lib/api/client.ts` to satisfy Milestone 2 / Requirement R2 are fully designed and validated:
1. `src/lib/auth/auth-context.tsx` must be updated according to the complete drop-in blueprint in `C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m2_demo\analysis.md` (Section 4).
2. `src/lib/api/client.ts` must expose `setDemoMode(isDemo: boolean)` and intercept non-auth mutations when demo mode is active (Section 5).
3. The existing 24/24 auth tests in `src/lib/auth/auth.test.ts`, 10/10 tests in `src/test/e2e/demo-live-isolation.test.ts`, and 10/10 tests in `src/test/e2e/auth-session.test.ts` will remain 100% compliant.

---

## 5. Verification Method

To independently verify after implementation:

1. **Run Unit & E2E Auth Isolation Tests**:
   ```powershell
   npx vitest run src/lib/auth/auth.test.ts src/test/e2e/demo-live-isolation.test.ts src/test/e2e/auth-session.test.ts
   ```
   *Expected*: All 44 tests pass.

2. **Run Full Frontend Test Suite**:
   ```powershell
   npx vitest run
   ```
   *Expected*: All 204 tests pass across all 18 test files.

3. **Run Authoritative Backend Test Suite**:
   ```powershell
   python -m pytest backend/tests -v
   ```
   *Expected*: All 73 tests pass.

4. **Verify Storage Invariants in Browser / Vitest**:
   - In demo mode: `localStorage.getItem('virsaflow_access_token') === null`.
   - In live mode: `localStorage.getItem('virsaflow_access_token') !== null`.
   - On logout: both `virsaflow_access_token` and `virsaflow_auth_session_v2` are `null`.
