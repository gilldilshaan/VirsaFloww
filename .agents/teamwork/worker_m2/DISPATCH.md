## 2026-10-31T18:14:57Z
You are the M2 Implementation Worker (teamwork_worker) for Milestone 2: Authentication & Session Management.
Your working directory is: C:\Users\hp\Desktop\VIrsa\.agents\teamwork\worker_m2\
Your caller / orchestrator is: 8a58b17c-6565-4a0b-8d2e-d3649ec4f95e

MANDATORY FIRST STEP:
Read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\ORIGINAL_REQUEST.md before starting work.
Also read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\orchestrator\PROJECT.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Primary Blueprints:
Read and apply the detailed blueprints from the M2 Explorers:
1. Live auth blueprint: C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m2_auth\analysis.md
2. Demo mode isolation blueprint: C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m2_demo\analysis.md

Exclusive Write Ownership:
You own and may edit:
- `src/lib/auth/auth-context.tsx` (and any related helper in `src/lib/auth/`)
DO NOT modify `src/routeTree.gen.ts`, DO NOT modify backend files, DO NOT run destructive git commands.

Implementation Requirements (R2):
1. Integrate `POST /api/auth/session` (login) via the central API client (`client.post('/api/auth/session', { email, password })`).
2. Store the returned `accessToken` in localStorage key `virsaflow_access_token` using `setStoredToken(accessToken)`.
3. Session restoration on reload: Query `GET /api/auth/me` with stored Bearer token on component mount/initialization. If valid, restore authenticated user. If 401 UNAUTHENTICATED or invalid, call `clearStoredToken()`, clear session state, and fail closed.
4. Live vs Demo Separation:
   - For demo logins (`DEMO_IDENTITIES`), tag user with `isDemoUser: true`, ensure `virsaflow_access_token` is cleared, and activate demo isolation so demo sessions never submit mutations to live APIs or spoof backend JWT credentials.
   - For live logins, set `isDemoUser: false` and attach the real JWT.
5. Role Checks: Frontend role checks (`hasRole`, `canAccessPortal`) strictly serve UI visibility while backend RBAC remains authoritative.

Verification Requirements:
After editing, you MUST run:
1. `npx tsc --noEmit` (MUST pass with 0 errors)
2. `npx vitest run src/test/e2e/auth-session.test.ts src/test/e2e/demo-live-isolation.test.ts` (MUST pass 20/20 tests)
3. `npm test` (MUST pass all 18 test files, 204+ tests)
4. `npm run build` (MUST build cleanly)
5. `python -m pytest backend/tests -v` (MUST pass 73/73 tests)

Output:
Write your full implementation and verification report to:
C:\Users\hp\Desktop\VIrsa\.agents\teamwork\worker_m2\handoff.md
Send a completion message back to orchestrator (8a58b17c-6565-4a0b-8d2e-d3649ec4f95e).

## 2026-10-31T18:28:46Z
**Context**: Milestone 2 Implementation (Authentication & Session Management)
**Content**: Requesting status update on your implementation of `src/lib/auth/auth-context.tsx` and verification tests.
**Action**: Please report your current step and update progress.md.
