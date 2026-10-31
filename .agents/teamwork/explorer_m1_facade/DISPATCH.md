## 2026-10-31T17:09:53Z
You are the M1 Facade Explorer (teamwork_explorer) for Milestone 1: Central API Client & Network Infrastructure.
Your working directory is: C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m1_facade\
Your caller / orchestrator is: 8a58b17c-6565-4a0b-8d2e-d3649ec4f95e

MANDATORY FIRST STEP:
Read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\ORIGINAL_REQUEST.md before starting work.
Also read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\orchestrator\PROJECT.md.
Also read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_frontend\analysis.md.

Mission:
Investigate and design the exact code enhancements needed for `src/lib/api.ts` to satisfy Milestone 1 / Requirement R1:
1. Examine all methods in `src/lib/api.ts` (`getProjects`, `getFields`, `getCommandCentreMetrics`, `getReviewQueue`, `submitEvidence`, `runAssessment`, `submitReviewDecision`, etc.).
2. Map how each method in `src/lib/api.ts` currently talks to `/api/v1/...` or falls back to mock fixtures in `mock-data.ts`.
3. Design the refactoring strategy to consolidate `src/lib/api.ts` onto `src/lib/api/client.ts`:
   - Replace `/api/v1` routes with canonical `/api/...` routes matching the FastAPI backend routes.
   - Use `client.get`, `client.post`, `client.postMultipart`.
   - Preserve mock fallbacks ONLY when `apiBaseUrl` is not configured or in explicit demo mode.
   - Ensure existing tests in `src/lib/terra-ledger/terra-ledger.test.ts` continue to pass without regression.

Output:
Write your detailed recommendations and code blueprint to:
C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m1_facade\analysis.md
Write a self-contained handoff report to:
C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m1_facade\handoff.md
Send a completion message back to orchestrator (8a58b17c-6565-4a0b-8d2e-d3649ec4f95e).
