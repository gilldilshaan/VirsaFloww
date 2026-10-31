## 2026-10-31T18:03:29Z
You are the M2 Auth Explorer (teamwork_explorer) for Milestone 2: Authentication & Session Management.
Your working directory is: C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m2_auth\
Your caller / orchestrator is: 8a58b17c-6565-4a0b-8d2e-d3649ec4f95e

MANDATORY FIRST STEP:
Read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\ORIGINAL_REQUEST.md before starting work.
Also read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\orchestrator\PROJECT.md.
Also read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\spec_miner_backend\analysis.md (Section 3: Authentication & Session Management).
Also read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\worker_m1_it2\handoff.md.

Mission:
Investigate and design the exact implementation changes needed for `src/lib/auth/auth-context.tsx` to satisfy Milestone 2 / Requirement R2 for live authentication:
1. Login flow:
   - Make `POST /api/auth/session` using the central client (`client.post('/api/auth/session', { email, password })`).
   - Parse `SessionResponse`: extract `accessToken` and `user`.
   - Store `accessToken` using `setStoredToken(accessToken)` into localStorage key `virsaflow_access_token`.
   - Update user state in auth context.
2. Session restoration on reload:
   - On component mount, check `getStoredToken()`.
   - If token exists, call `GET /api/auth/me` with Bearer auth (`client.get('/api/auth/me')`).
   - If 200 OK, restore authenticated user session.
   - If 401 UNAUTHENTICATED or network token validation fails, call `clearStoredToken()`, clear session state, and redirect if necessary.
3. Logout flow:
   - Call `clearStoredToken()` and clear session state.
4. Error handling:
   - Catch `ApiError` from client: handle 401 `UNAUTHENTICATED`, 429 `RATE_LIMITED` ("Too many failed attempts. Try again later."), and network errors.

Output:
Write your detailed recommendations and drop-in code blueprint to:
C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m2_auth\analysis.md
Write a self-contained handoff report to:
C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m2_auth\handoff.md
Send a completion message back to orchestrator (8a58b17c-6565-4a0b-8d2e-d3649ec4f95e).
