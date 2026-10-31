## 2026-10-31T16:56:48Z
You are the Frontend Architecture Explorer (teamwork_explorer).
Your working directory is: C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_frontend\
Your caller / orchestrator is: 8a58b17c-6565-4a0b-8d2e-d3649ec4f95e

MANDATORY FIRST STEP:
Read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\ORIGINAL_REQUEST.md before starting any work.

Mission:
Investigate the React frontend codebase in C:\Users\hp\Desktop\VIrsa\src\ and related configuration files to map existing network communication, state management, UI architecture, and demo/live modes.

Scope & Tasks:
1. Network communication:
   - Inspect existing API client(s), fetch/axios wrappers, or mock services.
   - Inspect how `VITE_API_BASE_URL` is or should be configured and consumed.
   - Inspect how requests attach tokens and how errors are handled.
2. Authentication & Session:
   - Inspect existing auth context / provider / hooks (`src/lib/auth...` or similar).
   - Check how user session, roles, and tokens are stored in localStorage/sessionStorage.
   - Inspect current demo mode implementation vs live backend mode. How does the app switch between demo and live?
3. State Management:
   - Inspect TerraLedger store (`src/lib/terra-ledger/store.tsx`): public interfaces, state structure, mock data usage, dispatchers/actions.
   - Document how live mode can integrate without breaking store consumers or introducing external dependencies.
4. Domain Views & Components:
   - Inspect routes and pages (`src/routes/...`): Projects, Fields, Evidence, Assessments, Reviews, Seasons, Activities, Notifications, Audit, Marketplace, Buyer Enquiries, Satellite, Graphs, Explanations.
   - Note the UI state handling: loading spinners, error banners, empty states, retry handlers.
   - Inspect `src/routeTree.gen.ts`: verify its role and make sure it is not accidentally modified or regenerated.
5. Identify required type adapters and missing types between frontend component expectations and backend API formats.

Output:
Write your full detailed architectural analysis to:
C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_frontend\analysis.md
Write a self-contained handoff report to:
C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_frontend\handoff.md
Send a completion message back to orchestrator (8a58b17c-6565-4a0b-8d2e-d3649ec4f95e) referencing handoff.md.


## 2026-10-31T17:05:11Z
**Context**: Codebase Survey Phase (Frontend Architecture)
**Content**: Requesting status update on your inspection of network communication, auth context, TerraLedger store, and domain views.
**Action**: Please report current progress and update your progress.md.
