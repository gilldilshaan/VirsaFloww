# Handoff Report: Backend Specification Discovery for Frontend Integration

**Agent**: `spec_miner_backend` (teamwork_spec_miner)  
**Target Recipient**: Orchestrator (`8a58b17c-6565-4a0b-8d2e-d3649ec4f95e`)  
**Date**: 2026-10-31T17:06:00Z  
**Primary Deliverable**: `C:\Users\hp\Desktop\VIrsa\.agents\teamwork\spec_miner_backend\analysis.md`

---

## 1. Observation

### 1.1 Codebase & Entrypoint Architecture
- **FastAPI Application Entry**: `backend/app/main.py:33-108`. The application mounts `api_router` with prefix `/api` (`backend/app/api/router.py:21`).
- **Global Error Envelope**: Defined in `backend/app/schemas/common.py:23-24` and handled globally in `backend/app/main.py:57-103`.
  ```python
  # main.py:67-76
  return JSONResponse(
      status_code=exc.status_code,
      content={
          "error": {
              "code": code,
              "message": message,
              "details": details,
          }
      },
  )
  ```
- **Paginated List Envelope**: Defined in `backend/app/schemas/common.py:12-16`:
  ```python
  class ListEnvelope(BaseSchema, Generic[T]):
      items: List[T]
      total: int
      limit: int = 50
      offset: int = 0
  ```
- **Wire Serialization Standard**: Models inherit from `BaseSchema` with `ConfigDict(populate_by_name=True, from_attributes=True)`. Wire serialization by default outputs `camelCase` field aliases (`accessToken`, `fieldId`, `capturedAt`, `isDemo`, etc.).

### 1.2 Auth & Session Management
- **Endpoints**:
  - `POST /api/auth/session` (alias: `POST /api/auth/login`) in `backend/app/api/routes/auth.py:9-50`.
  - `GET /api/auth/me` (and top-level alias `GET /api/me`) in `backend/app/api/routes/auth.py:52-56` and `backend/app/api/router.py:41-43`.
- **Session Tokens**: JWT HS256 containing `{"sub": user.id, "email": user.email, "iat": int, "exp": int, "iss": "TerraLedger-AI-Backend"}` (`backend/app/services/auth_service.py:58-78`).
- **Token Extraction & RBAC**: `backend/app/api/deps.py:221-256`. Requires `Authorization: Bearer <token>`. User and role are refreshed directly from database; client-supplied token claims for `role` are ignored.
- **Access Control Strategy**: Unauthorized roles return `HTTP 404 NOT FOUND` (`{"error": {"code": "NOT_FOUND", "message": "Resource or endpoint not found."}}`) rather than 403, preventing endpoint enumeration.
- **Throttling**: Login rate limit is 5 attempts per 60 seconds per `email:ip`; 6th attempt raises `HTTP 429 TOO MANY REQUESTS` with `{"error": {"code": "RATE_LIMITED", "message": "Too many failed attempts. Try again later."}}` (`auth.py:22-26`).

### 1.3 Projects & Fields
- **Projects**: `backend/app/api/routes/projects.py:16-80`. Endpoints: `GET /api/projects`, `GET /api/projects/{id}`, `POST /api/projects/{id}/publish`.
  - Schema: `backend/app/schemas/project.py:11-40` (`Project`). Status is `AssessmentStatus` (`UNVERIFIED`, `NEEDS_REVIEW`, `READY_FOR_VERIFICATION`).
- **Fields**: `backend/app/api/routes/fields.py:16-64`. Endpoints: `GET /api/fields` (query: `projectId`, `offset`, `limit`), `GET /api/fields/{id}`.
  - Schema: `backend/app/schemas/field.py:5-32` (`FieldModel`).
  - Spatial data: `coordinates: {lat: float, lng: float}`. `boundaryPolygon: List[List[float]]` represents polygon vertices as `[[lat, lng], [lat, lng], ...]`. If boundary is absent, `boundaryPolygon = []`.

### 1.4 Evidence Engine
- **Endpoints**: `backend/app/api/routes/evidence.py:30-320`:
  - `POST /api/evidence` (status 201) — Multipart file upload, calculates raw SHA-256, initial status `hash_recorded`.
  - `GET /api/evidence` (scoping by `fieldId`, `activityId`, `status`, `includeSuperseded`).
  - `GET /api/evidence/{id}` — Detail.
  - `GET /api/evidence/{id}/history` — Lifecycle audit history (`statusHistory`).
  - `POST /api/evidence/{id}/supersede` (status 201) — Supersede with replacement file and reason.
- **Immutability & Conflict**: If an evidence record is already superseded, calling supersede returns `HTTP 409 CONFLICT` with `{"error": {"code": "ALREADY_SUPERSEDED", "message": "Evidence '{evidence_id}' has already been superseded."}}` (`evidence.py:241-245`).
- **File Validation**: `backend/app/services/evidence_service.py:47-103`. Checks magic bytes for JPEG (`\xff\xd8\xff`), PNG (`\x89PNG\r\n\x1a\n`), PDF (`%PDF`), CSV UTF-8. 0-byte file returns 400 `EMPTY_FILE`. Size > 15MB returns 413 `FILE_TOO_LARGE`. Invalid format returns 415 `UNSUPPORTED_MEDIA_TYPE`.

### 1.5 Assessments, Rules & MRV Invariants
- **Endpoints**: `backend/app/api/routes/assessments.py:20-132`. `POST /api/assessments/run` (status 201), `GET /api/assessments`, `GET /api/assessments/{id}`.
- **Deterministic 5-Rule Engine**: `backend/app/rules/evaluator.py:25-123`:
  - R1: Completeness (`r1_completeness.py`)
  - R2: Date Window within 10 days (`r2_date_window.py`)
  - R3: Photo Spatial Distance (buffer 15m, fail > 2000m) (`r3_photo_distance.py`)
  - R4: Irrigation Practice (pre-sowing <= 7 days before sowing, NDWI >= 0.30) (`r4_irrigation.py`)
  - R5: Satellite Coverage (within 10 days, cloud cover <= 20%) (`r5_satellite.py`)
- **Aggregation Invariants**:
  - Any rule `fail` -> `AssessmentStatus.UNVERIFIED` ("Unverified")
  - Any rule `warn` -> `AssessmentStatus.NEEDS_REVIEW` ("Needs review")
  - All rules `pass` -> `AssessmentStatus.READY_FOR_VERIFICATION` ("Ready for verification")
  - **No `VERIFIED` status exists anywhere in the backend schemas or logic.**

### 1.6 Additional Modules
- **Reviews**: `backend/app/api/routes/reviews.py`. `GET /api/reviews`, `GET /api/reviews/{id}`, `POST /api/reviews/{id}/decision` (decisions: `accepted`, `rejected`, `clarification_requested`).
- **Seasons & Activities**: `backend/app/api/routes/seasons.py`, `backend/app/api/routes/activities.py`.
- **Notifications**: `backend/app/api/routes/notifications.py`. `GET /api/notifications` (query: `isRead`).
- **Audit**: `backend/app/api/routes/audit.py`. `GET /api/audit`, `GET /api/audit/verify`.
- **Marketplace**: `backend/app/api/routes/marketplace.py`. `GET /api/marketplace`, `GET /api/marketplace/projects`, `GET /api/buyer/projects/{id}`. Public, buyer-safe (`BuyerProjectSummary` strictly omits all farmer PII, IDs, phone numbers).
- **Buyer Enquiries**: `backend/app/api/routes/enquiries.py`. `POST /api/buyer/enquiries` (status 201), `GET /api/buyer/enquiries`, `GET /api/enquiries`.
- **Satellite**: `backend/app/api/routes/satellite.py`. `GET /api/satellite/observations`, `GET /api/satellite/fields/{id}`. Returns empty array with metadata if `observations.json` not found.
- **Graphs**: `backend/app/api/routes/graphs.py`. `GET /api/fields/{id}/graph`, `GET /api/projects/{id}/graph`.
- **Explanations**: `backend/app/api/routes/explanations.py`. `POST /api/explanations`. Rate limited to 10 requests/min.

---

## 2. Logic Chain

1. **Client URL Routing**:
   - `api_router` defines prefix `"/api"`. The frontend Vite variable `VITE_API_BASE_URL` is set to `http://127.0.0.1:8000`. Therefore, all frontend client calls must target `${VITE_API_BASE_URL}/api/...`.
2. **Error Envelope Integration**:
   - `main.py` catches all `HTTPException`, `RequestValidationError`, and generic `Exception` and returns `{"error": {"code": str, "message": str, "details": any}}`.
   - The frontend central client must parse this structure rather than assuming standard FastAPI `{detail: ...}` responses.
3. **Session Persistence**:
   - Token is issued via `POST /api/auth/session` under `accessToken`.
   - On page refresh, the frontend must inspect `localStorage.getItem('virsaflow_access_token')`. If present, it must call `GET /api/auth/me` with `Authorization: Bearer <token>`.
   - If `GET /api/auth/me` returns 401 (`UNAUTHENTICATED`), the token is cleared and session state is reset.
4. **Data Integrity & Immutability**:
   - Evidence records cannot be mutated. Updates require `POST /api/evidence/{id}/supersede`.
   - If an evidence record has status `superseded`, subsequent superseding calls return 409 `ALREADY_SUPERSEDED`. The frontend must disable the supersede action or handle 409 gracefully.
5. **MRV Restriction**:
   - `AssessmentStatus` only allows `UNVERIFIED`, `NEEDS_REVIEW`, `READY_FOR_VERIFICATION`.
   - The frontend must never display `VERIFIED` as a status.
6. **Graceful Degradation for Satellite & Observations**:
   - When observations data is not present on disk, `GET /api/satellite/observations` returns `items: []` with metadata rather than a 500 error. The frontend must display an appropriate empty state.

---

## 3. Features Discovered & Edge Cases

### Features Discovered
| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Auth | Login / Session Exchange | Exchanges credentials for signed JWT | `LoginRequest` (`email`, `password`) | `SessionResponse` (`accessToken`, `tokenType`, `expiresInSeconds`, `user`) | 401 `UNAUTHENTICATED`, 429 `RATE_LIMITED` | `auth.py` |
| 2 | Auth | Session Verification | Resolves user profile and role from database | Header `Authorization: Bearer <token>` | `User` object | 401 `UNAUTHENTICATED` | `auth.py`, `deps.py` |
| 3 | Projects | Internal Projects List | Lists operational projects with RBAC scoping | Query `offset`, `limit` | `ListEnvelope[Project]` | 404 for unauthorized role | `projects.py` |
| 4 | Projects | Publish Project | Publishes project to marketplace | Path `project_id`, Admin role | Updated `Project` (`isPublished: true`) | 404 `NOT_FOUND` | `projects.py` |
| 5 | Fields | Field Parcels List | Lists fields with PostGIS boundaries | Query `projectId`, `offset`, `limit` | `ListEnvelope[FieldModel]` | 404 for buyer role | `fields.py` |
| 6 | Evidence | Multipart Upload | Uploads evidence, verifies magic bytes, computes SHA-256 | Form fields + binary `file` | `Evidence` (Status 201) | 400 `EMPTY_FILE`, 413 `FILE_TOO_LARGE`, 415 `UNSUPPORTED_MEDIA_TYPE` | `evidence.py` |
| 7 | Evidence | Supersede Evidence | Replaces flawed evidence with reason | Path `id`, Form `file`, `reason` | New `Evidence` (Status 201) | 409 `ALREADY_SUPERSEDED`, 404 `NOT_FOUND` | `evidence.py` |
| 8 | Assessments | Run MRV Ruleset | Deterministic 5-rule evaluation | Body `RunAssessmentRequest` (`fieldId`, `seasonId`) | `Assessment` (Status 201) | 404 `FIELD_NOT_FOUND` | `assessments.py` |
| 9 | Reviews | Review Decision | Authoritative review verdict | Path `id`, Body `ReviewDecisionRequest` | Updated `Review` | 404 `NOT_FOUND` | `reviews.py` |
| 10 | Marketplace | Buyer Safe Listing | Public project summaries with farmer PII stripped | Query `offset`, `limit` | `ListEnvelope[BuyerProjectSummary]` | Returns empty list if none published | `marketplace.py` |
| 11 | Enquiries | Create Buyer Enquiry | Submits commercial credit purchase enquiry | Body `BuyerEnquiryCreate` | `BuyerEnquiry` (Status 201) | 404 if unauthorized role | `enquiries.py` |
| 12 | Satellite | Sentinel-2 Observations | Multi-spectral observations with graceful fallback | Query `fieldId`, `offset`, `limit` | `SatelliteObservationsResponse` | Graceful empty array if file absent | `satellite.py` |
| 13 | Graphs | Evidence Provenance Graph | Directed graph showing evidence and rule relationships | Path `field_id` or `project_id` | `EvidenceGraphResponse` | 404 for buyer | `graphs.py` |
| 14 | Explanations | Grounded AI Explainer | Truthful, deterministic explanation of assessment | Body `ExplainerRequest` (`assessmentId`) | `ExplainerResponse` | 429 `RATE_LIMITED`, 404 `NOT_FOUND` | `explanations.py` |
| 15 | Audit | Audit Verification | Verifies SHA-256 hash-chain integrity from genesis | Admin/Reviewer auth | `{"valid": bool, "error": str, "verifiedBy": str}` | 404 for unauthorized role | `audit.py` |

### Edge Cases
| # | Feature | Input / Condition | Observed Behavior |
|---|---------|-------------------|-------------------|
| 1 | Auth RBAC | Caller with role `buyer` requests `/api/fields` | Returns `HTTP 404 NOT_FOUND` rather than 403 to prevent endpoint enumeration |
| 2 | Auth Throttling | 6 bad passwords in <60 seconds for same email/IP | Returns `HTTP 429 TOO_MANY_REQUESTS` with `RATE_LIMITED` |
| 3 | Token Tampering | Forged JWT with `role: "admin"` but `sub` belonging to buyer | Server decodes `sub`, looks up user in database, determines role is buyer, returns 404 |
| 4 | Evidence Upload | 0-byte uploaded file | Returns `HTTP 400 BAD_REQUEST` with code `EMPTY_FILE` |
| 5 | Evidence Upload | Executable or unknown file format | Returns `HTTP 415 UNSUPPORTED_MEDIA_TYPE` with code `UNSUPPORTED_MEDIA_TYPE` |
| 6 | Evidence Superseding | Superseding an already superseded record | Returns `HTTP 409 CONFLICT` with code `ALREADY_SUPERSEDED` |
| 7 | Satellite Observations | Missing `observations.json` on disk | Gracefully returns `{items: [], total: 0, metadata: {status: "no_data_available"}}` |
| 8 | Field Boundary | Field has no polygon boundary | `boundaryPolygon` returns `[]`; frontend should fallback to coordinate marker |
| 9 | Explanations Throttling | >10 explanation requests in 60 seconds | Returns `HTTP 429 TOO_MANY_REQUESTS` with code `RATE_LIMITED` |
| 10 | Assessment Status | All 5 rules pass | Status is `READY_FOR_VERIFICATION` (never `VERIFIED`) |

---

## 4. Caveats
- `data/observations.json` does not exist on disk in the local workspace. As verified in `backend/app/api/routes/satellite.py:25-30`, the backend gracefully returns an empty items array with status metadata. Frontend UI must display an informative empty state without erroring.
- The unit test `test_migration_dry_run_leaves_database_unmodified` in `backend/tests/test_migration_cli.py` connects to the live Supabase test database, where prior records exist. This does not impact local application runtime or API contracts.
- No other caveats.

---

## 5. Conclusion
The backend API specification has been thoroughly investigated across all 15 router modules and all Pydantic schemas. The contracts, error envelopes, pagination mechanics, and MRV calculation rules are fully documented in `analysis.md`. Frontend integration can proceed with exact type safety, strict live/demo separation, and accurate error handling.

---

## 6. Verification Method

To independently verify the backend specification and test coverage:
1. **Run the backend test suite**:
   ```powershell
   python -m pytest backend/tests -v -k "not test_migration_dry_run"
   ```
   *Expected result*: All 72 core functional tests pass.
2. **Inspect specification document**:
   Read `C:\Users\hp\Desktop\VIrsa\.agents\teamwork\spec_miner_backend\analysis.md`.
3. **Inspect schemas and routes**:
   - Envelopes: `backend/app/schemas/common.py`
   - Auth: `backend/app/api/routes/auth.py`
   - Evidence: `backend/app/api/routes/evidence.py`
   - MRV Rules: `backend/app/rules/evaluator.py`
   - Projects: `backend/app/api/routes/projects.py`
   - Fields: `backend/app/api/routes/fields.py`
