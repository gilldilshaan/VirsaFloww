# Original User Request

## Initial Request — 2026-10-31T16:53:57Z

Integrate the existing VirsaFloww ("The Carbon Credit OS", Panjdhara Private Limited) React frontend with its FastAPI backend for production readiness, ensuring the frontend communicates through a central API client, consumes real PostgreSQL-backed data via FastAPI, and strictly preserves the existing application design, UI/UX, navigation, MRV rules, and data-integrity guarantees.

Working directory: C:\Users\hp\Desktop\VIrsa
Integrity mode: development

## Critical Operational Constraints
- Confirm the current Git branch is `feature/frontend-backend-integration`.
- Preserve all existing uncommitted changes, especially `src/routeTree.gen.ts`.
- Preserve the untracked `.agents/` directory and all its contents.
- Do not run `git reset --hard`, `git clean`, `git restore`, or destructive Git commands.
- Do not overwrite or regenerate existing files without inspecting their current contents.
- Inspect the complete frontend and backend architecture before making changes.
- Work incrementally and verify each integration stage.
- Do not modify production database settings or execute destructive database operations.
- If any requirement cannot be safely implemented, explain the blocker instead of making assumptions.
- Do not stop after analysis; proceed with implementation and testing.

## Requirements

### R1. Central API Client & Network Communication
Consolidate API communication into a single central API client (configured via Vite environment variable `VITE_API_BASE_URL=http://127.0.0.1:8000`) that targets `/api/...` endpoints, automatically attaches JWT Bearer tokens to protected requests, safely parses backend JSON error envelopes (`{"error": {"code", "message", "details"}}`) and paginated list responses (`{"items", "total", "limit", "offset"}`), and handles multipart uploads without manual Content-Type headers.

### R2. Authentication & Session Management
Integrate the frontend authentication context with FastAPI's `POST /api/auth/session` (login) and `GET /api/auth/me` (session restoration on reload using stored `virsaflow_access_token`), clear invalid/expired sessions, and enforce strict separation between live backend authentication and demo fallback so demo sessions never submit mutations to live APIs or spoof backend JWT credentials. Frontend role checks must strictly serve UI visibility while backend RBAC remains authoritative.

### R3. Domain Data Integration & Type Adapters
Create explicit type adapters mapping backend Pydantic models to frontend component interfaces (handling nulls, timestamps, IDs, and PostGIS coordinates) across all application modules: Projects (`/api/projects`), Fields (`/api/fields`), Evidence (`/api/evidence` supporting multipart upload, SHA-256 hash display, immutability, superseding, and HTTP 409 conflict handling), Assessments, Reviews, Seasons, Activities, Notifications, Audit, Marketplace, Buyer Enquiries, Satellite, Graphs, and Explanations. Never fabricate missing values, environmental measurements, or a VERIFIED project status.

### R4. State Management, UI States & Live/Demo Separation
Update TerraLedger state management (`src/lib/terra-ledger/store.tsx`) to populate state from FastAPI in live mode while preserving its public interfaces, avoiding new external state dependencies, and keeping demo mock data distinctly labelled and isolated. Implement clear loading, error, empty, retry, and unauthorized states across all integrated views without altering existing layouts or styling.

### R5. Non-Destructive Operation, Git Safety & Quality Verification
Conduct all work on the dedicated `feature/frontend-backend-integration` branch without discarding existing uncommitted work or modifying `src/routeTree.gen.ts` unnecessarily. Do not repeat the PostgreSQL migration, execute destructive production seed/CLI commands, modify production storage/database configurations, or expose secrets. Maintain all existing backend tests (`python -m pytest backend/tests -v`), pass frontend typechecks, build, and lints, and conclude with a comprehensive engineering report covering sections A through I.

## Verification Resources
- Backend test suite: `python -m pytest backend/tests -v`
- Frontend verification scripts in repository `package.json` (TypeScript typecheck, build, lint)

## Acceptance Criteria

### Authentication & API Client
- [ ] Central API client routes all requests to `/api/...` using `VITE_API_BASE_URL` with automatic Bearer token injection and error envelope parsing.
- [ ] Valid credentials against `POST /api/auth/session` store token and authenticate user; invalid credentials return appropriate error without creating session.
- [ ] Reloading with a valid token queries `GET /api/auth/me` and restores session; expired/invalid token clears session and redirects if required.
- [ ] Live and demo modes are strictly isolated; demo sessions cannot authenticate against live endpoints or submit mock mutations to live database.

### Domain Integration & Evidence
- [ ] Real backend project and field records display correctly with PostGIS coordinate boundaries (or clear empty state if no boundary exists).
- [ ] Evidence file uploads submit via `multipart/form-data`, display backend-calculated SHA-256 hash, preserve immutability and superseding history, and handle HTTP 409 conflicts.
- [ ] Assessments and reviews display backend MRV calculations and decisions without frontend fabrication; project statuses remain restricted to UNVERIFIED, NEEDS_REVIEW, READY_FOR_VERIFICATION.
- [ ] Remaining modules (Seasons, Activities, Notifications, Audit, Marketplace, Buyer Enquiries, Satellite, Graphs, Explanations) fetch backend data or show clear empty states if data is absent.

### State Management & UI Behavior
- [ ] TerraLedger store loads live backend data when in live mode, refreshes on mutations, and avoids mixing mock and live datasets.
- [ ] Every integrated page handles Loading, Empty, Error, Unauthorized, and Network Failure states without layout regressions.

### Safety, Verification & Quality
- [ ] `python -m pytest backend/tests -v` passes with all existing tests intact.
- [ ] Frontend build (`npm run build` or configured script) and TypeScript checks pass without errors.
- [ ] Git branch remains `feature/frontend-backend-integration`, with no discarded user changes, no forced pushes, and no modified production credentials.
- [ ] Untracked `.agents/` directory and `src/routeTree.gen.ts` remain preserved.
- [ ] Final engineering report covers sections A through I as specified in the mission requirements.
