# Milestone 1 Facade Explorer Handoff Report

## 1. Observation
- `src/lib/api.ts` (lines 34–350) defines class `ApiClient` and exports `export const api = new ApiClient();`.
  - Line 39: `this.baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.['VITE_MRV_API_BASE_URL']) || '';`
  - Line 66: `fetch(`${this.baseUrl}/api/v1/projects?${queryParams.toString()}`)`
  - Lines 98, 122, 158, 176, 214, 229, 246, 261, 274, 330: Hardcode `/api/v1/...` routes in fetch calls.
  - Does not attach `Authorization: Bearer <token>`.
  - Unwraps response data assuming `body.data` (`ApiResponse<T>`).
- `backend/app/main.py` (lines 48–106) and `backend/app/api/router.py` (lines 21–38) mount all routers under prefix `api_router = APIRouter(prefix="/api")`.
  - Error envelope emitted at `backend/app/main.py:67-76`:
    ```json
    {
      "error": {
        "code": "STRING_CODE",
        "message": "Human readable message",
        "details": null
      }
    }
    ```
  - List endpoints return `ListEnvelope[T]` (`items: List[T]`, `total: int`, `limit: int`, `offset: int`).
  - Evidence upload is at `POST /api/evidence` taking `file: UploadFile = File(...)` with `multipart/form-data`.
  - Evidence superseding is at `POST /api/evidence/{id}/supersede` returning `HTTP 409 CONFLICT` with code `ALREADY_SUPERSEDED` if already superseded.
  - Review decisions are submitted to `POST /api/reviews/{id}/decision` accepting `ReviewDecisionRequest` (`decision`, `comment`, `correctionRequest`).
- `src/lib/api/client.ts` (lines 41–122) implements a basic `fetch` wrapper targeting `import.meta.env['VITE_API_BASE_URL'] ?? '/api'`.
  - Lacks boundary-safe `postMultipart` (currently always sets or defaults headers without deleting `Content-Type`).
  - Lacks `unwrapList` helper.
  - Lacks automatic sync with `virsaflow_access_token` in `localStorage`.
- `src/lib/terra-ledger/terra-ledger.test.ts` (lines 15, 104, 117, 128, 137, 144, 158, 204):
  - Imports `import { api } from '../api';`
  - Line 204: `expect(api.isUsingMockAdapter()).toBe(true);`
  - Executing `npx vitest run src/lib/terra-ledger/terra-ledger.test.ts` completed with 17 passed tests (0 failed).
- Git repository status: Branch `feature/frontend-backend-integration`, working tree clean except for pre-existing unstaged modifications to `public/sitemap.xml` and `src/routeTree.gen.ts`. Untracked directories: `.agents/` and `src/test/`.

---

## 2. Logic Chain
1. *Observation*: The FastAPI backend routes are exclusively mounted under `/api/...` (`/api/projects`, `/api/fields`, `/api/evidence`, `/api/reviews`, `/api/satellite/observations`), whereas `src/lib/api.ts` targets `/api/v1/...`.
   *Inference*: Calling `/api/v1/...` against FastAPI produces HTTP 404 Not Found. All routes in `src/lib/api.ts` must be updated to `/api/...`.
2. *Observation*: Requirement R1 mandates a single central API client configured via `VITE_API_BASE_URL` with automatic Bearer token injection and error/list envelope parsing.
   *Inference*: Network transport must be centralized in `src/lib/api/client.ts`. `src/lib/api.ts` must serve as a domain-level facade delegating its HTTP requests directly to `src/lib/api/client.ts`.
3. *Observation*: `src/lib/terra-ledger/terra-ledger.test.ts` directly asserts `api.isUsingMockAdapter() === true` and tests project filtering, review queue submission, and correction requests using in-memory mock data.
   *Inference*: In unconfigured environments (where `VITE_API_BASE_URL` is empty/undefined) or explicit demo mode (`isDemoMode === true`), `isUsingMockAdapter()` must evaluate to `true` and return mock fixtures without network dispatch, preserving vitest test execution.
4. *Observation*: File uploads (`/api/evidence` and `/api/evidence/{id}/supersede`) require the browser to automatically insert the multipart boundary header.
   *Inference*: `client.postMultipart` must ensure `Content-Type` is omitted from the request headers so `fetch` sets `multipart/form-data; boundary=...`.
5. *Observation*: Backend responses wrap items in `ListEnvelope[T]` (`items`, `total`), whereas frontend domain consumers expect unwrapped arrays or mapped models.
   *Inference*: The facade must unwrap `.items` and apply lightweight domain adapters to guarantee type safety and prevent UI breakage.

---

## 3. Caveats
- `backend/app/api/routes` does not include an explicit `/api/command-centre/metrics` endpoint. In live mode, `getCommandCentreMetrics` aggregates live counts from `/api/projects`, `/api/fields`, and `/api/reviews` in parallel, falling back to `COMMAND_CENTRE_METRICS_MOCK` if any call fails.
- Phenology data points are not a dedicated backend endpoint; `getPhenologyTimeSeries` synthesizes points from `getSatelliteObservations` in live mode or returns `PHENOLOGY_TIME_SERIES_MOCK`.
- Backend authentication is currently sprint-grade development authentication (`POST /api/auth/session` / `GET /api/auth/me`). The central client must support token injection without breaking when unauthenticated.

---

## 4. Conclusion
Consolidating `src/lib/api.ts` onto `src/lib/api/client.ts` requires:
1. Enhancing `src/lib/api/client.ts` with `CentralApiClient`:
   - Configurable `VITE_API_BASE_URL`.
   - Normalizing paths to `/api/...`.
   - Bearer token retrieval from `localStorage.getItem('virsaflow_access_token')`.
   - JSON error envelope parsing (`res.error`).
   - Boundary-safe `postMultipart`.
   - List unwrapping helper (`unwrapList`).
2. Refactoring `src/lib/api.ts` into a Domain Facade:
   - Replacing `/api/v1` routes with canonical `/api/...` routes.
   - Delegating to `client.get`, `client.post`, `client.postMultipart`.
   - Adding missing methods (`submitEvidence`, `supersedeEvidence`, `runAssessment`, `submitReviewDecision`, etc.).
   - Preserving mock fallbacks when `isUsingMockAdapter() === true`.
3. Verifying that all 17 vitest tests in `terra-ledger.test.ts` continue to pass without regression.

---

## 5. Verification Method
1. **Frontend Vitest Suite**:
   ```bash
   npx vitest run src/lib/terra-ledger/terra-ledger.test.ts
   ```
   *Expected outcome*: 17/17 tests pass. `api.isUsingMockAdapter()` evaluates to `true`.
2. **TypeScript Compilation Check**:
   ```bash
   npx tsc --noEmit
   ```
   *Expected outcome*: Zero type errors in `src/lib/api.ts` or `src/lib/api/client.ts`.
3. **Backend Test Suite Integrity**:
   ```bash
   python -m pytest backend/tests -v
   ```
   *Expected outcome*: 73/73 tests pass.
4. **Git Safety Check**:
   ```bash
   git status
   ```
   *Expected outcome*: `src/routeTree.gen.ts` remains intact with existing modifications; no unintentional file deletions.
