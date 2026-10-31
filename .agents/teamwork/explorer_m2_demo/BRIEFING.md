# BRIEFING — 2026-10-31T18:10:30Z

## Mission
Investigate and design exact implementation changes for `src/lib/auth/auth-context.tsx` and related auth files for Milestone 2 / Requirement R2 (Live vs Demo mode isolation, demo session handling, frontend UI visibility vs backend RBAC, switching between demo and live, preserving tests).

## 🔒 My Identity
- Archetype: teamwork_explorer
- Roles: investigator, analyzer, synthesizer
- Working directory: C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m2_demo\
- Original parent: 8a58b17c-6565-4a0b-8d2e-d3649ec4f95e
- Milestone: Milestone 2 (Authentication & Session Management - Demo vs Live Mode Isolation)

## 🔒 Key Constraints
- Read-only investigation — do NOT implement or modify source code directly
- Must keep findings strictly documented in working directory files
- No mock credentials in live storage; demo sessions must never store live JWT or spoof backend JWT credentials
- Frontend role checks strictly serve UI visibility; backend RBAC is authoritative (backend 404 for unauthorized role access)
- Preserve compatibility with `src/lib/auth/auth.test.ts` (24/24 tests) and E2E test suites

## Current Parent
- Conversation ID: 8a58b17c-6565-4a0b-8d2e-d3649ec4f95e
- Updated: 2026-10-31T18:10:30Z

## Investigation State
- **Explored paths**:
  - `src/lib/auth/auth-context.tsx`: analyzed session storage, `validateStoredSession`, `login`, `loginAsDemo`, `logout`, `switchDemoRole`.
  - `src/lib/auth/types.ts`: verified `AuthUser`, `UserRole`, `Permission`, `StoredSession`.
  - `src/lib/auth/permissions.ts`: verified `ROLE_PERMISSIONS`, `hasPermission`, `canAccessPortal`, resource-scoping functions.
  - `src/lib/api/client.ts`: analyzed `AUTH_TOKEN_KEY = 'virsaflow_access_token'`, token storage helpers, `executeRequest`, error envelopes.
  - `src/lib/api.ts`: analyzed `ApiClient` facade, `isDemoMode`, `setDemoMode`, mock fallbacks for all domain resources.
  - `backend/app/api/routes/auth.py`: confirmed `/api/auth/session` and `/api/auth/me` endpoints and `SessionResponse` schema.
  - `backend/tests/test_auth_rbac.py`: verified backend returns 404 for unauthorized RBAC attempts to prevent endpoint discovery.
  - Vitest test suites: ran and verified 204/204 frontend tests passing.
  - Pytest test suites: ran and verified 73/73 backend tests passing.
- **Key findings**:
  1. `auth-context.tsx` currently does not integrate `virsaflow_access_token` (`AUTH_TOKEN_KEY`), calling a legacy `/api/v1/auth/login` instead of `POST /api/auth/session` and lacking reload validation against `GET /api/auth/me`.
  2. Demo logins (`loginAsDemo`, `switchDemoRole`) must explicitly purge `virsaflow_access_token` so demo calls never attach stale bearer tokens.
  3. `api.setDemoMode(true)` must be synchronized whenever a demo session is activated, and `api.setDemoMode(false)` when a live session is activated.
  4. CentralApiClient can additionally enforce mutation blocking (`POST/PUT/PATCH/DELETE` for non-auth endpoints) when demo mode is active as defense-in-depth.
  5. Authoritative backend RBAC returns 404 for unauthorized role access, and frontend role checks are purely UI visibility guardrails.
- **Unexplored areas**: None.

## Key Decisions Made
- Fully specified the drop-in replacement blueprint for `src/lib/auth/auth-context.tsx` and defense-in-depth additions to `src/lib/api/client.ts`.

## Artifact Index
- DISPATCH.md — Initial dispatch instructions
- BRIEFING.md — Persistent working memory
- progress.md — Real-time progress and heartbeat
- analysis.md — Detailed recommendations and drop-in code blueprint
- handoff.md — Self-contained handoff report for Milestone 2 implementer
