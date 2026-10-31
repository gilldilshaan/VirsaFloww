## 2026-10-31T17:09:39Z
You are the E2E Testing Engineer (teamwork_test_writer) for VirsaFloww Frontend-Backend Integration.
Your working directory is: C:\Users\hp\Desktop\VIrsa\.agents\teamwork\e2e_test_writer\
Your caller / orchestrator is: 8a58b17c-6565-4a0b-8d2e-d3649ec4f95e

MANDATORY FIRST STEP:
Read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\ORIGINAL_REQUEST.md before starting work.
Also read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\orchestrator\PROJECT.md.

Mission:
Establish the E2E Testing Track for the project. Create TEST_INFRA.md and design an opaque-box, requirement-driven E2E test suite covering all 23 inventoried features across Tiers 1-4:
- Tier 1: Feature Coverage (>=5 per feature)
- Tier 2: Boundary & Corner Cases (>=5 per feature)
- Tier 3: Cross-Feature Combinations (pairwise interactions)
- Tier 4: Real-World Application Scenarios (end-to-end workflows)

Implementation Requirements:
1. Write C:\Users\hp\Desktop\VIrsa\.agents\teamwork\e2e_test_writer\TEST_INFRA.md adhering to the template in PROJECT.md and the methodology.
2. Implement executable tests in `src/test/e2e/` (or extend vitest suite in `src/lib/` or `tests/`) that verify:
   - Central API client error envelope parsing and list envelope unwrapping
   - Auth session restoration via GET /api/auth/me and token expiry behavior
   - Strict demo vs live mode separation (demo never mutating live APIs)
   - Evidence file upload, SHA-256 calculation, and 409 conflict handling on superseding
   - PostGIS coordinate handling with empty fallback
   - MRV status restrictions (never VERIFIED, only UNVERIFIED, NEEDS_REVIEW, READY_FOR_VERIFICATION)
3. Run the test suite using `npm test` or `npx vitest run` to verify that newly created tests execute and pass cleanly without breaking existing tests.
4. When test cases are fully implemented and passing, publish `TEST_READY.md` to:
   C:\Users\hp\Desktop\VIrsa\.agents\teamwork\orchestrator\TEST_READY.md
5. Author a detailed handoff report to:
   C:\Users\hp\Desktop\VIrsa\.agents\teamwork\e2e_test_writer\handoff.md
Send a completion message back to orchestrator (8a58b17c-6565-4a0b-8d2e-d3649ec4f95e).
