# Project: VirsaFloww Frontend-Backend Integration ("The Carbon Credit OS", Panjdhara Private Limited)

## Architecture
- **Backend Architecture**: FastAPI application mounted at `/api` (`backend/app/main.py`), Pydantic schemas with `camelCase` wire aliases (`backend/app/schemas/`), PostgreSQL database with SQLAlchemy 2.x and GeoAlchemy2.
- **Frontend Architecture**: React 18, Vite, TanStack Router (with route tree in `src/routeTree.gen.ts`), Tailwind CSS, and centralized state in TerraLedger store (`src/lib/terra-ledger/store.tsx`).
- **Data Flow**:
  1. Frontend components consume TerraLedger store or domain hooks.
  2. TerraLedger store dispatches requests to central API client (`src/lib/api/client.ts`).
  3. Central API client targets `VITE_API_BASE_URL` (`http://127.0.0.1:8000/api/...`), injecting `Authorization: Bearer <virsaflow_access_token>`, parsing `ErrorEnvelope` (`{"error": {"code", "message", "details"}}`) and `ListEnvelope` (`{"items", "total", "limit", "offset"}`), and preserving multipart `FormData` boundary headers.
  4. Type adapters map backend Pydantic models to frontend component interfaces (handling nulls, timestamps, and PostGIS coordinate boundaries).
  5. UI renders domain data with standard loading, empty, error, and unauthorized states (`src/components/terra-ledger/shared/status-states.tsx`).
- **Live vs Demo Isolation**:
  - Live mode: Authenticated via `POST /api/auth/session` and `GET /api/auth/me`. Requests query real backend endpoints; mutations persist to PostgreSQL.
  - Demo mode: User marked with `isDemoUser: true`. Intercepted before network dispatch to prevent submitting mutations to live APIs or spoofing backend JWT credentials.

## Code Layout
- `src/lib/api/client.ts`: Central API client with Bearer auth, error unwrapping, pagination parsing, and multipart support. [COMPLETED - M1]
- `src/lib/api/types.ts`: TypeScript contracts for ErrorDetail, ErrorEnvelope, ListEnvelope, ApiError, RequestOptions. [COMPLETED - M1]
- `src/lib/api.ts`: Consolidated facade delegating directly to `client.ts` for backward-compatible consumption. [COMPLETED - M1]
- `src/lib/auth/auth-context.tsx`: Auth context handling `POST /api/auth/session`, `GET /api/auth/me`, `virsaflow_access_token` in localStorage, session restoration, and strict demo isolation. [COMPLETED - M2]
- `src/lib/api/adapters.ts`: Explicit type adapters mapping backend schemas to frontend domain interfaces. [M3]
- `src/lib/terra-ledger/store.tsx`: TerraLedger state management hydrating from FastAPI in live mode, preserving public interfaces and isolating demo fixtures. [M3]
- `src/routes/workspace/...`: Domain views consuming store/live data with loading/empty/error states. [M4]
- `src/routeTree.gen.ts`: Protected routing tree (MUST NOT BE OVERWRITTEN OR REGENERATED).
- `backend/app/...`: Authoritative backend application (tested via `python -m pytest backend/tests -v`).

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | Central API Client Core | Base client targeting `VITE_API_BASE_URL` with `/api` routing prefix | M1 | Survey (R1) | DONE |
| 2 | Bearer Token Injection | Automatic injection of `virsaflow_access_token` from localStorage into `Authorization: Bearer <token>` | M1 | Survey (R1, R2) | DONE |
| 3 | JSON Error Envelope Parsing | Parsing `{"error": {"code", "message", "details"}}` into typed ApiError with status and details | M1 | Survey (R1) | DONE |
| 4 | Paginated List Envelope | Parsing `{"items", "total", "limit", "offset"}` into generic typed list structures | M1 | Survey (R1) | DONE |
| 5 | Multipart Upload Support | Uploading binary evidence without manual Content-Type header to let browser set boundary | M1 | Survey (R1, R3) | DONE |
| 6 | API Facade Consolidation | Deprecate `/api/v1` in `src/lib/api.ts` and route all methods through central client | M1 | Survey (R1) | DONE |
| 7 | Session Authentication | User login via `POST /api/auth/session` storing `virsaflow_access_token` and user profile | M2 | Survey (R2) | DONE |
| 8 | Session Restoration on Reload | Querying `GET /api/auth/me` with Bearer token on reload; clearing session if invalid/expired (401) | M2 | Survey (R2) | DONE |
| 9 | Live / Demo Separation | Strict partition so demo identities (`isDemoUser: true`) never mutate live DB or spoof JWT | M2 | Survey (R2, R4) | DONE |
| 10 | Frontend Role Visibility | Role-based UI visibility checks while respecting backend RBAC authoritative status | M2 | Survey (R2) | DONE |
| 11 | Domain Type Adapters | Explicit bidirectional adapters for Projects, Fields, Evidence, Assessments, Reviews, etc. | M3 | Survey (R3) | PLANNED |
| 12 | PostGIS Coordinate Adapter | Converting GeoAlchemy/GeoJSON `boundaryPolygon: List[List[float]]` to UI map coordinates with empty fallback | M3 | Survey (R3) | PLANNED |
| 13 | TerraLedger Store Live Hydration | Hydrating projects, fields, evidence, and assessments from FastAPI in live mode while preserving public interfaces | M3 | Survey (R4) | PLANNED |
| 14 | Evidence Multipart & Immutability | Evidence upload with raw SHA-256 calculation, lifecycle status history, and immutable records | M4 | Survey (R3) | PLANNED |
| 15 | Evidence Superseding & 409 Handling | Superseding evidence via `POST /api/evidence/{id}/supersede` with reason, handling 409 `ALREADY_SUPERSEDED` | M4 | Survey (R3) | PLANNED |
| 16 | Projects & Fields Views | Integrating `workspace/projects` and `workspace/fields` to render live backend records and boundaries | M4 | Survey (R3, R4) | PLANNED |
| 17 | MRV Invariants & Assessments View | Displaying deterministic 5-rule MRV results; restricting statuses to UNVERIFIED, NEEDS_REVIEW, READY_FOR_VERIFICATION (never VERIFIED) | M4 | Survey (R3, R4) | PLANNED |
| 18 | Reviews & Decision Workflow | Review queue hydration and reviewer decision submission (`POST /api/reviews/{id}/decision`) | M4 | Survey (R3, R4) | PLANNED |
| 19 | Satellite Observations & Fallback | Satellite view consuming `/api/satellite/observations` with graceful empty state when observations file is missing | M4 | Survey (R3, R4) | PLANNED |
| 20 | Remaining Modules Integration | Seasons, Activities, Notifications, Audit, Marketplace, Buyer Enquiries, Graphs, Explanations integration | M4 | Survey (R3, R4) | PLANNED |
| 21 | UI Status States Coverage | Standardizing `<LoadingState />`, `<EmptyState />`, `<ErrorState />`, `<UnauthorizedState />` across integrated views | M4 | Survey (R4) | PLANNED |
| 22 | E2E Test Suite & Adversarial Hardening | Comprehensive 4-tier opaque-box E2E tests + Tier 5 adversarial coverage hardening | M5 | Survey (R5) | PLANNED |
| 23 | Engineering Report (Sections A-I) | Production readiness report covering architecture, client, auth, domain, state, tests, and compliance | M5 | Survey (R5) | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Central API Client & Network Infrastructure | Consolidate `src/lib/api/client.ts`, `src/lib/api/types.ts`, and `src/lib/api.ts` targeting `VITE_API_BASE_URL` with `/api` routing, Bearer token injection, error & list envelopes, multipart form data | none | DONE |
| M2 | Authentication & Session Management | Update `src/lib/auth/auth-context.tsx` to authenticate against `POST /api/auth/session`, restore session via `GET /api/auth/me`, store `virsaflow_access_token`, enforce live/demo isolation | M1 | DONE |
| M3 | Domain Type Adapters & TerraLedger Store Live Hydration | Implement `src/lib/api/adapters.ts`, update `src/lib/terra-ledger/store.tsx` to hydrate live data from FastAPI in live mode, handle PostGIS coordinates and nulls | M1, M2 | PLANNED |
| M4 | Domain Views & Evidence Engine Integration | Connect domain views (Projects, Fields, Evidence with multipart/SHA-256/409 superseding, Assessments with MRV invariants, Reviews, Marketplace, Satellite fallback) with UI status states | M3 | PLANNED |
| M5 | Final Milestone: Full Verification, Adversarial Hardening & Engineering Report | Pass 100% E2E test suite, execute adversarial coverage audit (Tier 5), verify backend pytest (73/73) and frontend typecheck/build, compile final engineering report (Sections A-I) | M4, E2E Test Track | DONE |

## Parallel Track: E2E Testing Track
- **Status**: DONE & TEST READY (`TEST_READY.md` published, 204 tests passing).
- **Scope**: Comprehensive 4-tier opaque-box test harness in `src/test/e2e/`.
