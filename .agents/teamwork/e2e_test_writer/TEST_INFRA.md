# VirsaFloww E2E Testing Infrastructure (TEST_INFRA.md)

## Executive Summary
This document defines the End-to-End (E2E) and Integration Testing Infrastructure for the **VirsaFloww** ("The Carbon Credit OS", Panjdhara Private Limited) platform integration between the React frontend and the FastAPI backend.

The testing track follows an **opaque-box, requirement-driven methodology**. Every test asserts observable behavior against authoritative requirements from `ORIGINAL_REQUEST.md` and `PROJECT.md`, validating data contracts, security invariants, error handling, and end-to-end workflows without tight coupling to volatile internal implementation details.

---

## 1. Test Harness Architecture & Tooling

### 1.1 Test Runner & Environment
- **Runner**: Vitest (v4.1.x) with native ESM support and fast in-memory execution.
- **Environment**: JSDOM / Node.js test environment with full DOM, `localStorage`, `sessionStorage`, `crypto.subtle`, and standard Web APIs (`FormData`, `Headers`, `Request`, `Response`, `fetch`).
- **Assertion Framework**: Vitest `expect` with TypeScript type-checking (`tsc --noEmit` / `tsconfig.json`).
- **Test Co-location & Path**: Executable tests reside in `src/test/e2e/`, discovered automatically by Vitest via glob pattern matching.

### 1.2 Test Isolation & Determinism
- **Self-Contained Setup**: Each test suite runs in isolation; `beforeEach` resets `localStorage`, `sessionStorage`, and mocked network dispatches.
- **Mock Service Interception**: Network requests to `/api/...` are intercepted at the fetch boundary to test live response parsing, envelope unwrapping, and HTTP error code handling in a strictly controlled, reproducible manner.
- **Time Freezing & Crypto**: Built-in deterministic timestamp generators and crypto utilities (`crypto.subtle` / Node `crypto` SHA-256) ensure byte-for-byte reproducibility across runs.

---

## 2. Authoritative Specifications & Oracle Sources

All expected outputs and verification assertions are derived from authoritative specification sources:

| Domain | Authoritative Specification / Oracle Source | Observable Invariant |
|---|---|---|
| **API Client Envelopes** | `backend/app/schemas/common.py` (`ListEnvelope`, `ErrorEnvelope`) | List envelopes unwrap `{items, total, limit, offset}`; errors parse `{error: {code, message, details}}`. |
| **Authentication & RBAC** | `backend/app/schemas/user.py`, `backend/app/api/deps.py`, RFC 7519 JWT | Bearer token format; `POST /api/auth/session` returns session; `GET /api/auth/me` validates token; 401 on expired. |
| **Demo vs Live Mode** | `PROJECT.md` § Live vs Demo Isolation, `src/lib/auth/auth-context.tsx` | Demo accounts (`isDemoUser: true`, `USR-DEMO-*`) never submit mutations to live API endpoints. |
| **Evidence & SHA-256** | `backend/app/schemas/evidence.py`, NIST FIPS 180-4, RFC 7578 multipart | Raw binary SHA-256 computed on upload; superseding emits 409 `ALREADY_SUPERSEDED` if already replaced. |
| **PostGIS Coordinates** | `backend/app/schemas/field.py`, GeoJSON RFC 7946, PostGIS 3.x | Coordinates `List[List[float]]`; empty or null fallback returns `[]` safely without throwing. |
| **MRV Status Invariants** | `backend/app/schemas/assessment.py`, `backend/app/schemas/project.py` | Status strictly restricted to `UNVERIFIED`, `NEEDS_REVIEW`, `READY_FOR_VERIFICATION`. Never `VERIFIED`. |

---

## 3. Four-Tier Test Suite Structure

The test suite covers all **23 inventoried features** from `PROJECT.md` organized into four hierarchical verification tiers:

### Tier 1: Feature Coverage (Happy Path, >=5 per Feature)
Validates standard functional operation under normal operating conditions for each of the 23 features:
1. **Central API Client Core**: Base URL targeting, `/api` prefix routing, JSON header attachment, GET/POST execution, HTTP 200/201 response unwrapping.
2. **Bearer Token Injection**: Reading `virsaflow_access_token` from storage, formatting `Authorization: Bearer <token>`, omitting header when unauthenticated, custom header merging, token refreshment.
3. **JSON Error Envelope Parsing**: Parsing `code`, parsing `message`, parsing structured `details` array/dict, preserving HTTP status code, converting to typed `ApiError`.
4. **Paginated List Envelope**: Unwrapping `items` array, parsing `total` count, preserving `limit` and `offset`, type safety over items, handling single-page full result sets.
5. **Multipart Upload Support**: Creating `FormData`, allowing browser to calculate boundary header, binary file attachment, form field aliasing (`fieldId`, `capturedAt`), HTTP 201 receipt.
6. **API Facade Consolidation**: Facade method delegation, backward compatibility for legacy calls, uniform error throwing, singleton lifecycle, zero deprecated direct fetch calls.
7. **Session Authentication**: `POST /api/auth/session` credential exchange, token storage in `localStorage`, user role population, session timestamping, authenticated state transition.
8. **Session Restoration on Reload**: Querying `GET /api/auth/me` on app load, auto-login with valid cached token, populating user profile, preserving permissions, non-blocking UI init.
9. **Live / Demo Separation**: Distinct `isDemoUser` flag, distinct mock fixtures for demo mode, live mode hitting `/api/...`, preventing cross-pollution, distinct demo UI badging.
10. **Frontend Role Visibility**: UI feature gates for `admin`, `project_developer`, `field_officer`, `reviewer`, `farmer`, `buyer`.
11. **Domain Type Adapters**: Pydantic wire snake_case/camelCase mapping to TypeScript camelCase interfaces across all entities.
12. **PostGIS Coordinate Adapter**: GeoJSON polygon parsing, coordinate pair normalization `[lat, lng]`, polygon ring closure verification, bounding box calculation, centroid derivation.
13. **TerraLedger Store Live Hydration**: Store hydration from live API in live mode, preserving public getters, refetch triggers on mutation, reactivity across subscribers, caching.
14. **Evidence Multipart & Immutability**: Evidence upload with SHA-256 seal, immutable record storage, provenance recording, status history appending, file metadata capture.
15. **Evidence Superseding & 409 Handling**: Superseding endpoint execution, reason recording, previous evidence marked `SUPERSEDED`, replacement linked via `supersedesId`, new SHA-256 calculated.
16. **Projects & Fields Views**: Rendering project list, displaying project detail, rendering field cards, rendering field boundaries, field detail inspection.
17. **MRV Invariants & Assessments View**: Displaying 5-rule MRV evaluation, status restricted to 3 non-verified enums, outstanding requirements listing, readiness score display, explanation text rendering.
18. **Reviews & Decision Workflow**: Queue hydration, item assignment check, reviewer decision submission (`APPROVE`, `REJECT`, `REQUEST_CHANGES`), decision reason recording, audit event logging.
19. **Satellite Observations & Fallback**: Satellite observation retrieval, vegetation index (NDVI) display, pass date ordering, cloud cover filtering, graceful empty state display.
20. **Remaining Modules Integration**: Seasons list, Activities timeline, Notifications unread badge, Audit log viewer, Marketplace listings, Buyer enquiries, Explanations query.
21. **UI Status States Coverage**: `<LoadingState />` during fetch, `<EmptyState />` when list is empty, `<ErrorState />` with retry button on failure, `<UnauthorizedState />` on 401/403, network offline banner.
22. **E2E Test Suite & Adversarial Hardening**: Automation runner execution, assertion completeness, zero false positives, test independence, clean tear-down.
23. **Engineering Report (Sections A-I)**: Traceability from requirements to tests, compliance matrices, coverage auditing, architecture documentation, security verification.

### Tier 2: Boundary & Corner Cases (>=5 per Feature)
Validates behavior at extreme boundaries, malformed inputs, and anomalous operating conditions:
- **Empty & Null Boundaries**: Empty lists (`items: []`, `total: 0`), null coordinates, empty string fields, undefined optional metadata.
- **Resource Limits & Extreme Values**: Zero-byte file upload, 100MB maximum upload limit enforcement, 10,000 polygon vertices, extreme latitude (+90.0, -90.0) and longitude (+180.0, -180.0).
- **Network & Protocol Anomalies**: HTTP 409 conflict on already-superseded evidence, HTTP 422 schema validation errors with deep Pydantic validation details, HTTP 401 token expiration, HTTP 500 server errors, network offline/timeout.
- **Security & Integrity Fuzzing**: Special characters in titles (`<script>`, SQL quotes, Unicode emojis, null bytes `\0`), tampered JWT claims, spoofed user roles, mismatched SHA-256 hashes.

### Tier 3: Cross-Feature Combinations (Pairwise & Multi-System Interactions)
Validates complex interactions between decoupled subsystems:
1. **Auth Session + API Client**: Expired token during background mutation cleanly triggers 401 error envelope parsing and purges stored session without crashing.
2. **Demo Mode + Evidence Engine**: Demo user attempting an evidence upload operates purely in-memory and never initiates HTTP dispatches to live `/api/evidence`.
3. **Store Live Hydration + PostGIS Adapter**: Live field records with a mix of valid polygons, empty polygons, and null geometries hydrate without throwing, rendering centroids for empty ones.
4. **Evidence Superseding + Review Queue**: When evidence is superseded, linked review items update their status and reference the new superseding evidence ID.
5. **MRV Evaluation + Assessment Status Restriction**: An assessment with 100% passing rules strictly evaluates to `READY_FOR_VERIFICATION` and never bypasses the restriction to emit `VERIFIED`.
6. **Multipart Upload + Audit Logging**: Binary upload atomically writes evidence record and triggers audit log event with matching SHA-256 hash.

### Tier 4: Real-World Application Workflows (End-to-End Scenarios)
Validates complete user journeys mirroring production field operations:
- **Workflow 1: Project Developer Project & Parcel Onboarding**:
  User logs in as `project_developer` -> fetches assigned projects -> creates/inspects field parcel with PostGIS boundary -> verifies boundary coordinates in store -> checks initial `UNVERIFIED` status.
- **Workflow 2: Field Officer Mobile Ground Photo & Superseding**:
  User logs in as `field_officer` -> uploads ground photo with GPS coordinates -> verifies SHA-256 seal and `HASH_RECORDED` status -> submits correction superseding the original -> verifies previous item marked `SUPERSEDED` -> confirms 409 Conflict if attempting to supersede the superseded record again.
- **Workflow 3: Reviewer Assessment & Decision Workflow**:
  User logs in as `reviewer` -> inspects pending review queue -> inspects MRV 5-rule evaluation (confirming status is `NEEDS_REVIEW` or `READY_FOR_VERIFICATION`) -> submits decision with remarks -> verifies status transition.
- **Workflow 4: Buyer Marketplace Enquiry & Offtake Request**:
  User logs in as `buyer` -> browses published marketplace projects -> verifies farmer PII is strictly redacted -> submits volume enquiry -> verifies confirmation and enquiry ID.
- **Workflow 5: Demo Evaluation & Role Switching**:
  Unauthenticated user enters Demo mode -> switches through Admin, Field Officer, and Reviewer personas -> verifies distinct demo state and lack of live API mutation.

---

## 4. Test Suite File Organization

```
src/test/e2e/
├── helpers/
│   ├── test-harness.ts            # Mock fetch handlers, envelope generators, crypto helpers, fixtures
│   └── mock-data-fixtures.ts      # Authoritative Pydantic-compliant mock responses
├── client-envelopes.test.ts       # Central API client, List/Error envelopes, multipart upload
├── auth-session.test.ts           # Login, session restoration via /api/auth/me, token expiry
├── demo-live-isolation.test.ts    # Strict demo vs live mode separation & security boundaries
├── evidence-lifecycle.test.ts     # Evidence upload, SHA-256 seal, immutability, 409 superseding
├── postgis-coordinates.test.ts    # PostGIS polygon parsing, coordinates adapter, empty fallbacks
├── mrv-invariants.test.ts         # MRV 5-rule evaluation, status restrictions (never VERIFIED)
├── cross-feature-combinations.test.ts # Tier 3 multi-feature pairwise interactions
└── real-world-workflows.test.ts   # Tier 4 full end-to-end user journeys
```

---

## 5. Execution Commands & Verification

### Running Vitest Suite
```bash
npx vitest run
```

### Running Dedicated E2E Test Suite
```bash
npx vitest run src/test/e2e
```

### Running with Typecheck
```bash
npx tsc --noEmit && npx vitest run
```

### Full Project Verification
```bash
npm test
```
*(Runs vitest suite followed by sitemap validation check)*

---

## 6. Pass/Fail Criteria & Quality Guarantees
1. **Zero Failures**: 100% of newly authored and existing tests must pass cleanly.
2. **Zero Facades**: Every test asserts concrete observable properties (HTTP status, error codes, SHA-256 hashes, status enum values).
3. **No Regressions**: All 73 existing frontend tests continue passing with zero modification.
4. **TypeScript Strict Mode**: Fully compliant with `strict: true` and `noImplicitOverride: true`.
