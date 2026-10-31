## 2026-10-31T18:03:37Z
You are the M2 Demo Explorer (teamwork_explorer) for Milestone 2: Authentication & Session Management.
Your working directory is: C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m2_demo\
Your caller / orchestrator is: 8a58b17c-6565-4a0b-8d2e-d3649ec4f95e

MANDATORY FIRST STEP:
Read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\ORIGINAL_REQUEST.md before starting work.
Also read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\orchestrator\PROJECT.md.
Also read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\src\test\e2e\demo-live-isolation.test.ts (E2E test suite for demo vs live isolation).

Mission:
Investigate and design the exact implementation changes needed for `src/lib/auth/auth-context.tsx` and related auth files to satisfy Milestone 2 / Requirement R2 for live vs demo mode isolation:
1. Demo session handling:
   - When a demo identity (`DEMO_IDENTITIES`) is selected, mark the session user with `isDemoUser: true`.
   - Ensure demo sessions NEVER store a live JWT in `virsaflow_access_token` and never spoof backend JWT credentials.
   - Ensure demo sessions operate in isolated demo mode, with mutations intercepted or prevented from submitting to the live backend.
2. Frontend Role-Based UI Visibility:
   - Ensure frontend role checks (`hasRole`, `canAccessPortal`, `rolePermissions`) strictly serve UI visibility.
   - Respect authoritative backend RBAC (backend returns 404 for unauthorized role access).
3. Switching between Demo and Live:
   - When logging into a live account, clear any demo state, set `isDemoUser: false`, and attach the real JWT.
   - When switching to a demo user, clear `virsaflow_access_token` so demo calls never accidentally attach a stale live token.
4. Preserving existing UI and route compatibility:
   - Verify compatibility with `src/lib/auth/auth.test.ts` (24/24 tests) and `src/test/e2e/auth-session.test.ts` / `demo-live-isolation.test.ts`.

Output:
Write your detailed recommendations and drop-in code blueprint to:
C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m2_demo\analysis.md
Write a self-contained handoff report to:
C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m2_demo\handoff.md
Send a completion message back to orchestrator (8a58b17c-6565-4a0b-8d2e-d3649ec4f95e).
