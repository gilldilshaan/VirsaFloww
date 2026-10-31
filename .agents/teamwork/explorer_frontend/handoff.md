# Frontend Architecture Exploration Handoff Report

**Agent**: Frontend Architecture Explorer (`teamwork_explorer`)  
**Target Directory**: `C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_frontend\`  
**Target Recipient**: Orchestrator (`8a58b17c-6565-4a0b-8d2e-d3649ec4f95e`)  
**Reference Analysis**: `C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_frontend\analysis.md`  
**Date**: 2026-10-31  

---

## 1. Observation

Direct code observations from the filesystem:

1. **Network Communication Clients**:
   - `src/lib/api/client.ts` (lines 46-49): `baseUrl` defaults to `import.meta.env['VITE_API_BASE_URL'] ?? '/api'`. Requests (lines 63-112) attach `Authorization: Bearer <token>` and expect errors formatted as `{ code, message, details }`. It lacks `FormData` handling (currently sets `'Content-Type': 'application/json'` on all requests unless modified).
   - `src/lib/api.ts` (lines 39-40, 66, 122, 175-177): Initializes `baseUrl` from `VITE_MRV_API_BASE_URL` and targets `/api/v1/...` endpoints. If `baseUrl` is empty, it falls back to synchronous mock fixtures from `src/lib/terra-ledger/mock-data.ts`.
   - Direct consumers of `src/lib/api.ts`: `src/lib/terra-ledger/store.tsx` (line 28), `src/lib/terra-ledger/terra-ledger.test.ts` (line 15).
   - Direct consumers of `src/lib/api/client.ts`: `src/lib/farmer/farmer-service.ts` (line 6), `src/lib/partnerships/partnerships-service.ts` (line 6). Both services fall back to local `localStorage` keys (`tcc_farmer_fields_v1`, `tcc_industrial_partnerships_enquiries_v1`).

2. **Authentication & Session Management**:
   - `src/lib/auth/auth-context.tsx` (lines 110, 167-177, 184-203): Uses `localStorage` key `'virsaflow_auth_session_v2'` with interface `StoredSession { user, issuedAt, expiresAt, sessionType }`.
   - Missing token: No storage or retrieval of `virsaflow_access_token` is present in `auth-context.tsx`.
   - Backend Login Call: Line 250 attempts `fetch(`${apiBaseUrl}/api/v1/auth/login`, ...)` which uses `VITE_MRV_API_BASE_URL` instead of `VITE_API_BASE_URL` and targets `/api/v1/auth/login` instead of `POST /api/auth/session`.
   - Reload Restoration: Does not invoke `GET /api/auth/me` on startup. Line 145 fails closed if `apiBaseUrl` is unconfigured.
   - Demo Identities: Line 19 defines `DEMO_IDENTITIES` covering the 6 canonical roles (`admin`, `reviewer`, `project_developer`, `field_officer`, `farmer`, `buyer`). Demo identities are marked with `isDemoUser: true`.

3. **State Management (TerraLedger Store)**:
   - `src/lib/terra-ledger/store.tsx` (lines 103-116): Initializes `allFields`, `projectsList`, `reviewQueue`, `commandMetrics`, and `phenologyData` directly from mock data fixtures in `mock-data.ts`.
   - Lines 133-147: `evidenceList` is derived via `useMemo` from `demoState` ('unverified' | 'needs-review' | 'ready') and `customEvidence`.
   - Lines 149-153: `assessmentStatus` is hardcoded to `'UNVERIFIED'` when `demoState === 'unverified'`, `'NEEDS_REVIEW'` when `demoState === 'needs-review'`, and `'READY_FOR_VERIFICATION'` when `demoState === 'ready'`.
   - Lines 339-358: `refetchAll()` exists and invokes `api.getProjects()`, `api.getFields()`, `api.getCommandCentreMetrics()`, `api.getReviewQueue()` from `src/lib/api.ts`, but is not automatically executed on mount.

4. **Domain Views & Existing Status States**:
   - `src/routes/workspace/projects/index.tsx` (line 15) and `$projectId.tsx` (line 8) directly iterate over `MARKETPLACE_PROJECTS` mock array instead of store `projects`.
   - `src/routes/workspace/fields/index.tsx` (line 30) and `$fieldId.tsx` (line 9) directly iterate over `ALL_FIELDS` mock array instead of store `allFields`.
   - `src/routes/workspace/assessments.tsx` (lines 12-56) defines a hardcoded array of 5 rules instead of reading rule evaluation results from the backend assessment response.
   - `src/routes/workspace/review.tsx` (lines 36-87, 91) maintains a local `useState` queue initialized from `INITIAL_QUEUE` instead of reading from `reviewQueue` in `store.tsx`.
   - `src/components/terra-ledger/shared/status-states.tsx` already implements reusable status components: `LoadingState` (line 11), `EmptyState` (line 38), `ErrorState` (line 72), `UnauthorizedState` (line 111), and `DemoDataBadge` (line 137).
   - Git status (`git status`): On branch `feature/frontend-backend-integration`. Uncommitted files: `src/routeTree.gen.ts`, `public/sitemap.xml`. Untracked: `.agents/`.

5. **FastAPI Backend Endpoints & Envelope Formats**:
   - `backend/app/main.py` (lines 57-76): Frozen error envelope format:
     `{"error": {"code": str, "message": str, "details": any}}`.
   - `backend/app/schemas/common.py` (lines 12-16): Frozen list envelope:
     `{"items": list, "total": int, "limit": int, "offset": int}`.
   - `backend/app/api/router.py`: Prefixes all routes with `/api`.
   - `backend/app/api/routes/auth.py`: `POST /api/auth/session` (and alias `/api/auth/login`) returns `{"accessToken", "tokenType", "expiresInSeconds", "user"}`. `GET /api/auth/me` returns `User`.
   - `backend/app/api/routes/evidence.py`: `POST /api/evidence` requires multipart form data (`file`, `fieldId`, `title`, `type`, `category`, etc.). `POST /api/evidence/{id}/supersede` returns HTTP 409 if already superseded.

---

## 2. Logic Chain

1. **Step 1 (API Client Disparity -> Consolidation)**: Because `src/lib/api.ts` targets `/api/v1` and falls back to mock fixtures, while `src/lib/api/client.ts` uses `VITE_API_BASE_URL` with JWT headers, frontend network calls must be consolidated into a single central client targeting `/api/...`. This client must support:
   - Reading `VITE_API_BASE_URL` (defaulting to `http://127.0.0.1:8000`).
   - Injecting `Authorization: Bearer <virsaflow_access_token>`.
   - Unwrapping `ListEnvelope` (`.items`) and `ErrorEnvelope` (`.error`).
   - Preserving browser-calculated `Content-Type` for `FormData` multipart uploads.
   *(References Observation 1, Observation 5)*

2. **Step 2 (Auth Context & Session Restoration)**: Because `auth-context.tsx` does not persist `virsaflow_access_token` and calls `/api/v1/auth/login`, it cannot authenticate against FastAPI or restore session on reload. Integrating `POST /api/auth/session` on login and `GET /api/auth/me` on startup with token storage in `virsaflow_access_token` fulfills R2 while keeping demo identities isolated with `isDemoUser: true`.
   *(References Observation 2, Observation 5)*

3. **Step 3 (TerraLedger Store Live Hydration)**: Because `store.tsx` currently derives evidence and assessment status strictly from `demoState` and initializes from `mock-data.ts`, live backend data is never presented. When the user is authenticated in live mode (`!isDemoUser`), `store.tsx` must hydrate from `api.getProjects()`, `api.getFields()`, `api.getEvidence()`, and `api.getAssessments()` while maintaining its existing public interface so downstream components don't break.
   *(References Observation 3)*

4. **Step 4 (Domain Views State & Type Adapters)**: Because domain views (`workspace/projects`, `workspace/fields`, `workspace/assessments`, `workspace/review`) currently read from static mock constants, they bypass live store state. Re-wiring them to consume store state with `<LoadingState />`, `<EmptyState />`, and `<ErrorState />` ensures smooth UX across network failures without modifying layouts.
   *(References Observation 4)*

5. **Step 5 (Non-Destructive Git Safety)**: Because `src/routeTree.gen.ts` contains uncommitted user modifications and is generated by TanStack Router, running generator scripts or destructive git commands will wipe user progress. It must be strictly left untouched.
   *(References Observation 4)*

---

## 3. Caveats

1. **Backend Database Seeding**: Investigation confirms the backend has SQLite / In-Memory / PostgreSQL fallback configured via environment; frontend tests should not rely on a live PostgreSQL database being online during unit tests (`vitest` mock passes).
2. **PostGIS Coordinate Boundary Display**: If a field parcel in PostgreSQL lacks boundary polygons, the coordinates array is empty `[]`. The frontend map component must safely handle `boundaryPolygon = []` by rendering an empty state or parcel centroid marker rather than throwing a polygon coordinate traversal error.
3. **No Code Written**: Per teamwork explorer constraints, this investigation is strictly read-only. No application code files in `src/` or `backend/` have been modified.

---

## 4. Conclusion

The React frontend has clean foundations (TanStack Router, established RBAC matrix, pre-built status state components in `status-states.tsx`, and clear layout boundaries). The integration path requires:
1. Consolidating the API client into `src/lib/api/client.ts` with `VITE_API_BASE_URL` targeting `/api/...`, `virsaflow_access_token` Bearer header injection, `ErrorEnvelope` unwrapping, and multipart form-data handling.
2. Updating `src/lib/auth/auth-context.tsx` to authenticate against `POST /api/auth/session`, store `virsaflow_access_token`, restore sessions via `GET /api/auth/me`, and strictly isolate demo logins (`isDemoUser: true`).
3. Augmenting `src/lib/terra-ledger/store.tsx` to fetch live data from FastAPI when in live mode, with type adapters mapping Pydantic schemas to frontend interfaces.
4. Hooking domain views to store state with loading/empty/error states.
5. Strictly preserving `src/routeTree.gen.ts` and the `feature/frontend-backend-integration` git branch.

---

## 5. Verification Method

Independent verification steps:

1. **Verify Git Branch & Uncommitted Safety**:
   ```bash
   git status
   ```
   *Expected result*: Branch is `feature/frontend-backend-integration`. `src/routeTree.gen.ts` and `public/sitemap.xml` remain modified and preserved; `.agents/` remains untracked.

2. **Verify Frontend Verification Scripts**:
   ```bash
   npm run test
   ```
   *Expected result*: Vitest test suite executes and passes existing tests (`auth.test.ts`, `terra-ledger.test.ts`).

3. **Verify FastAPI Backend Test Suite**:
   ```bash
   python -m pytest backend/tests -v
   ```
   *Expected result*: All existing backend tests pass.

4. **Verify Analysis Report Existence**:
   Inspect `C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_frontend\analysis.md` to confirm all 5 tasks and requirements R1-R5 are comprehensively documented.
