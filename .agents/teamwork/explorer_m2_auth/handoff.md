# Milestone 2 Auth Architecture Handoff Report

**Agent**: M2 Auth Explorer (`explorer_m2_auth`)  
**Parent / Orchestrator**: `8a58b17c-6565-4a0b-8d2e-d3649ec4f95e`  
**Working Directory**: `C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m2_auth\`  
**Milestone**: Milestone 2: Authentication & Session Management  
**Date**: 2026-10-31  

---

## 1. Observation

1. **Current Auth Provider Architecture** (`src/lib/auth/auth-context.tsx:248-278`):
   - The login function currently checks `import.meta.env?.['VITE_MRV_API_BASE_URL']` and dispatches raw `fetch(`${apiBaseUrl}/api/v1/auth/login`, ...)` instead of using the central client (`src/lib/api/client.ts`).
   - Line 280-287 matches entered emails against `DEMO_IDENTITIES` and logs users in as demo without contacting the backend.
   - It does not store the JWT under `virsaflow_access_token` (`AUTH_TOKEN_KEY`), nor does it invoke `setStoredToken()`.
   - On component mount, there is no session restoration call to `GET /api/auth/me`. Session state relies solely on `localStorage.getItem('virsaflow_auth_session_v2')`.

2. **Central Client Infrastructure** (`src/lib/api/client.ts`):
   - Lines 87, 125-157 define `AUTH_TOKEN_KEY = 'virsaflow_access_token'`, `getStoredToken()`, `setStoredToken()`, and `clearStoredToken()`.
   - Lines 272-276 automatically inject `Authorization: Bearer <virsaflow_access_token>` into every request when a token is stored.
   - Line 391 exports `client.post<T>(path, body)` which routes `/api/...` to `VITE_API_BASE_URL`.
   - Line 387 exports `client.get<T>(path)` which also targets `VITE_API_BASE_URL` with Bearer auth.
   - Lines 19-30 export `ApiError` with helper methods `isUnauthorized()`, `isRateLimited()`, and `isNetworkError()`.

3. **FastAPI Backend Route Specifications**:
   - `backend/app/api/routes/auth.py:9-50`:
     - Route: `POST /api/auth/session` (and alias `/api/auth/login`).
     - Request: `LoginRequest` (`{"email": str, "password": str}`).
     - Response: `SessionResponse` (`{"accessToken": str, "tokenType": "Bearer", "expiresInSeconds": int, "user": User}`).
     - Errors: HTTP 401 (`UNAUTHENTICATED`), HTTP 429 (`RATE_LIMITED`).
   - `backend/app/api/routes/auth.py:52-55`:
     - Route: `GET /api/auth/me` with `Authorization: Bearer <token>`.
     - Response: `User` (`{"id": str, "email": str, "name": str, "role": UserRole, "organization": str | null, "assignedProjectIds": list, "assignedFieldIds": list, "buyerCompanyId": str | null, "isActive": bool}`).
     - Errors: HTTP 401 (`UNAUTHENTICATED`, `deps.py:230-242`).

4. **Consumer Dependencies**:
   - `src/components/auth/protected-route.tsx:23-45`:
     - Checks `const { user, isAuthenticated, isLoading } = useAuth()`.
     - When `isLoading` is true, renders `<LoadingState />`.
     - When `!isLoading && !isAuthenticated`, redirects to `/login?next=...`.
     - If `isLoading` is false on mount before `GET /api/auth/me` resolves, `ProtectedRoute` would prematurely redirect authenticated reloaded sessions to `/login`.
   - `src/routes/login.tsx:46-53`:
     - Expects `login({ email, password })` to return `{ success: boolean, user?: AuthUser, error?: string }`.
     - Navigates on `res.success && res.user`, displays `res.error` on failure.

5. **Test Assertions and Contracts**:
   - `src/test/e2e/auth-session.test.ts:21-47`: Verifies `POST /api/auth/session` stores token in `virsaflow_access_token`.
   - `src/test/e2e/auth-session.test.ts:49-79`: Verifies `GET /api/auth/me` restores active session on reload when token is valid.
   - `src/test/e2e/auth-session.test.ts:81-120`: Verifies `GET /api/auth/me` 401 clears both `virsaflow_access_token` and `virsaflow_auth_session_v2`.
   - `src/test/e2e/demo-live-isolation.test.ts:33-40`: Verifies demo session never stores a live backend `virsaflow_access_token`.
   - `src/test/e2e/demo-live-isolation.test.ts:188-198`: Verifies logout cleanly wipes both `virsaflow_auth_session_v2` and `virsaflow_access_token`.

6. **Preservation Status**:
   - `git hash-object src/routeTree.gen.ts`: `07b4d2823f5c021f3b582d955f560298c2fb475f` (identical to HEAD).
   - Branch: `feature/frontend-backend-integration`.

---

## 2. Logic Chain

1. **Client Delegation**:
   - Currently, `auth-context.tsx` uses obsolete `fetch('${apiBaseUrl}/api/v1/auth/login')`.
   - By delegating all login requests to `client.post<SessionResponse>('/api/auth/session', { email, password })`, requests automatically route through `VITE_API_BASE_URL` with standard envelope unwrapping and typed `ApiError` exceptions.

2. **Token Management & Isolation**:
   - Upon receiving `SessionResponse`, `setStoredToken(accessToken)` writes to `virsaflow_access_token`, ensuring downstream client calls inject `Authorization: Bearer <token>`.
   - For demo users, `clearStoredToken()` is explicitly called during `loginAsDemo()` and `switchDemoRole()`, guaranteeing that `getStoredToken()` returns `null` and preventing mock identities from spoofing live JWTs.

3. **Mount Lifecycle & State Protection**:
   - If `getStoredToken()` is present on mount, `isLoading` must initialize to `true`.
   - An asynchronous `restoreSession()` hook queries `client.get<BackendUser>('/api/auth/me')`.
   - If 200 OK, `mapBackendUserToAuthUser()` maps the backend record, sets `user`, updates storage, and toggles `isLoading: false`.
   - If 401 or network token validation fails, `clearStoredToken()` and storage cleanup execute, leaving `user = null` and `isLoading = false`.
   - Because `isLoading` starts `true`, `ProtectedRoute` displays `<LoadingState />` during verification and only redirects if validation fails.
   - The session sync `useEffect` guards with `if (isLoading) return;` so it does not clear storage while verification is underway.

4. **Authoritative Error Handling**:
   - Catching `ApiError` allows specific handling:
     - `isUnauthorized()` (401) -> `"Invalid email or password."`
     - `isRateLimited()` (429) -> `"Too many failed attempts. Try again later."`
     - `isNetworkError()` (0) -> `"Network connection failed. Please check your network and try again."`
   - This satisfies the live error handling requirements without generic failure messages.

---

## 3. Caveats

- **Backend Seed Duplicate Key in test_migration_cli**: As documented in the test suite log, `test_migration_cli.py::test_migration_apply_and_idempotency` fails when re-applying the migration CLI against the existing Supabase test instance because `USR-ADMIN-01` is already present. Per project instructions, database schema and migrations must not be altered; all other 72 backend tests pass.
- **Demo Mode Isolation Boundary**: Demo mode relies on client-side state isolation (`isDemoUser: true`). Backend RBAC remains the authoritative boundary in live production.

---

## 4. Conclusion

The architectural investigation is complete. A drop-in replacement blueprint for `src/lib/auth/auth-context.tsx` has been developed and documented in `.agents/teamwork/explorer_m2_auth/analysis.md`. The design satisfies all Milestone 2 / Requirement R2 criteria:
1. `client.post('/api/auth/session', ...)` with `SessionResponse` parsing and `setStoredToken(accessToken)`.
2. Session restoration via `client.get('/api/auth/me')` on mount with `clearStoredToken()` fail-closed on 401 / network failure.
3. Clean logout wiping both `virsaflow_access_token` and `virsaflow_auth_session_v2`.
4. Specific `ApiError` mapping (401, 429, network).
5. Strict demo/live isolation with null token enforcement.
6. Full compatibility with existing routes and `ProtectedRoute`.

---

## 5. Verification Method

To independently verify the implementation blueprint once applied by the worker:

1. **TypeScript Typecheck**:
   ```bash
   npx tsc --noEmit
   ```
   Must exit with code 0.

2. **Frontend Test Suite**:
   ```bash
   npm test
   ```
   Must pass all 18 test files (including `src/test/e2e/auth-session.test.ts`, `src/test/e2e/demo-live-isolation.test.ts`, and `src/lib/auth/auth.test.ts`) with 204 tests passing and exit code 0.

3. **Frontend Production Build**:
   ```bash
   npm run build
   ```
   Must build Vite client and SSR Nitro server cleanly into `.output/` with exit code 0.

4. **`src/routeTree.gen.ts` Preservation**:
   ```bash
   git hash-object src/routeTree.gen.ts
   # Must return: 07b4d2823f5c021f3b582d955f560298c2fb475f
   ```
