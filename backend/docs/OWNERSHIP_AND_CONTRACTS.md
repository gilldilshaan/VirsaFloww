# TerraLedger AI — Backend Ownership, Architecture & Frozen API Contracts

**Document Version:** 1.0.0-phase1  
**Workstream:** Backend Owner (Blueprint "Bani" Workstream)  
**Status:** Frozen Contract Specification  

---

## 1. Ownership Boundaries & Directory Responsibilities

### 1.1 Backend Owner Responsibilities
The Backend Owner ("Bani") has exclusive ownership and write permissions over:
- `backend/**`: Complete Python FastAPI application, schemas, services, storage layer, rules engine, audit engine, CLI tooling, tests, and documentation.
- `agent/**`: Autonomous agent tools and integration points (future prompts).
- `data/seed_evidence.json`: Canonical evidence seed dataset for root demonstration.
- `data/marketplace_seed.json`: Canonical approved project marketplace seed dataset.

### 1.2 Boundary Invariants (Strictly Prohibited)
The Backend Owner does **NOT** own and must **NOT** create, modify, or delete:
- `src/**`: Frontend application codebase (TanStack Start, React 19, TypeScript routes and components). Frontend integration will be accomplished by teammates (Mankirat/Sana) via `backend/docs/frontend-handoff.md`.
- `geo/**`: Geospatial polygons and shapefiles.
- `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `routeTree.gen.ts`: Frontend build configuration and generated route trees.
- Root `.gitignore`: Root-level git configurations (runtime artifacts are ignored in `backend/.gitignore`).
- `data/observations.json`: Ground truth Sentinel-2 satellite observation data is owned exclusively by the Lead. The backend reads this file via configurable environment paths and never writes or fabricates observations.

---

## 2. Complete File Inventory

The following files constitute the backend subsystem:

```text
backend/
├── requirements.txt                         # Pinned dependencies (Python 3.13 compatible)
├── .env.example                             # Environment variable placeholders
├── .gitignore                               # Ignores runtime/, uploads/, audit/audit.jsonl
├── README.md                                # Setup, architecture, run instructions, and dev auth warning
├── docs/
│   ├── OWNERSHIP_AND_CONTRACTS.md           # This document (frozen API and ownership specification)
│   ├── rules.md                             # Specification of R1–R5 MRV deterministic evaluation rules
│   └── frontend-handoff.md                  # Handoff guide for Mankirat & Sana (endpoints, mappings, diffs)
├── app/
│   ├── __init__.py
│   ├── main.py                              # FastAPI app factory, CORS, exception handlers, Swagger
│   ├── cli.py                               # Administrative CLI (e.g., reset-demo)
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py                        # os.getenv configuration loader
│   │   └── constants.py                     # WINDOW_DAYS=10, PHOTO_BUFFER_M=15, etc.
│   ├── api/
│   │   ├── __init__.py
│   │   ├── router.py                        # Consolidated /api router
│   │   ├── deps.py                          # Dependency injection: auth, current_user, roles, storage
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── health.py                    # GET /api/health
│   │       ├── auth.py                      # POST /api/auth/session, GET /api/me
│   │       ├── projects.py                  # GET /api/projects, GET /api/projects/{id}, POST publish
│   │       ├── fields.py                    # GET /api/fields, GET /api/fields/{id}
│   │       ├── evidence.py                  # POST /api/evidence, GET, history, supersede
│   │       ├── seasons.py                   # POST/GET /api/seasons
│   │       ├── activities.py                # POST/GET /api/activities
│   │       ├── assessments.py               # POST /api/assessments/run, GET assessments
│   │       ├── reviews.py                   # GET /api/reviews, POST /api/reviews/{id}/decision
│   │       ├── notifications.py             # GET /api/notifications (farmer-visible)
│   │       ├── marketplace.py               # GET /api/marketplace, GET /api/buyer/projects/{id}
│   │       ├── buyer_enquiries.py           # POST/GET /api/buyer/enquiries, GET /api/enquiries
│   │       ├── satellite.py                 # GET /api/satellite/observations, fields/{id}
│   │       └── audit.py                     # GET /api/audit
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── common.py                        # Envelope, error, pagination, geo schemas
│   │   ├── user.py                          # User, UserRole, Session schemas
│   │   ├── project.py                       # Project, ProjectStatus, BuyerProjectSummary
│   │   ├── farmer.py                        # FarmerProfile
│   │   ├── field.py                         # Field, FieldCreate, Coordinates
│   │   ├── season.py                        # Season
│   │   ├── activity.py                      # Activity (sowing, AWD, irrigation, harvest)
│   │   ├── evidence.py                      # Evidence, Provenance, FileDetails, StatusEvent
│   │   ├── satellite.py                     # SatelliteObservation
│   │   ├── assessment.py                    # Assessment, RuleResult
│   │   ├── review.py                        # Review, ReviewDecisionRequest
│   │   ├── audit.py                         # AuditEvent
│   │   ├── buyer.py                         # BuyerEnquiry, BuyerProjectSummary
│   │   └── notification.py                  # Notification (correction requests)
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py                  # JWT issuance, scrypt hashing, login rate limiting
│   │   ├── audit_service.py                 # Append-only SHA-256 hash-chained JSONL engine
│   │   ├── evidence_service.py              # Raw byte hashing, magic bytes validation, supersession
│   │   └── satellite_service.py             # Lead observation reader (no synthetic math)
│   ├── storage/
│   │   ├── __init__.py
│   │   ├── json_storage.py                  # Generic thread-safe atomic JSON file repository
│   │   └── evidence_storage.py              # Append-only immutable repository (no update/delete)
│   ├── rules/
│   │   ├── __init__.py
│   │   ├── evaluator.py                     # Pure Python orchestrator of R1–R5 rules
│   │   ├── r1_completeness.py               # R1: Declaration, photo, log, weather, satellite
│   │   ├── r2_date_window.py                # R2: 10-day event window arithmetic
│   │   ├── r3_photo_distance.py             # R3: Boundary enclosure and polygon edge distance
│   │   ├── r4_irrigation.py                 # R4: 7-day pre-sowing irrigation and AWD water signal
│   │   └── r5_satellite.py                  # R5: Corroboration against real Sentinel-2 passes
│   └── utils/
│       ├── __init__.py
│       ├── crypto.py                        # SHA-256 canonical JSON and raw byte hashing
│       └── geo.py                           # Point-in-polygon and distance to boundary math
├── data/
│   ├── seed_files/                          # Real small sample images/docs hashed at load time
│   │   ├── sample_photo.jpg
│   │   └── sample_irrigation_log.csv
│   ├── uploads/                             # Actual binary storage (gitignored)
│   ├── audit/                               # Append-only audit.jsonl (gitignored)
│   ├── runtime/                             # Active JSON state (gitignored)
│   └── seed/                                # Factory baseline records
│       ├── users.json
│       ├── projects.json
│       ├── fields.json
│       ├── farmers.json
│       └── reviews.json
├── docs/
│   └── contracts/                           # Exported OpenAPI JSON & schema samples
│       ├── openapi.json
│       └── samples/
│           ├── project.json
│           ├── field.json
│           ├── evidence.json
│           ├── assessment.json
│           ├── buyer_project_summary.json
│           └── audit_event.json
└── tests/
    ├── __init__.py
    ├── conftest.py                          # Fixtures, test client, isolated test directory
    ├── test_health.py                       # M1: Health endpoint & app startup
    ├── test_crypto.py                       # M1: Known-vector SHA-256 test & canonical formatting
    ├── test_schemas.py                      # M1: Pydantic v2 validation, alias casing, camelCase wire
    ├── test_storage.py                      # M1: Atomic write, restart survival, reset-demo
    ├── test_audit.py                        # M1: Audit hash-chain verification & tamper detection
    ├── test_auth_rbac.py                    # M1: JWT, scrypt, role resolution, throttling, IDOR
    ├── test_evidence_storage.py             # M2: Immutability (no update/delete), raw SHA-256
    ├── test_evidence_upload.py              # M2: File validation, magic bytes, supersession
    ├── test_rules.py                        # M3: R1–R5 boundary conditions & determinism
    ├── test_e2e_demo.py                     # M3: Full journey: UNVERIFIED -> NEEDS_REVIEW -> READY
    ├── test_reviews_publish.py              # M4: Review decisions, notifications, project publish
    ├── test_marketplace_enquiry.py         # M4: Buyer-safe projection & company-scoped enquiries
    └── test_satellite.py                    # M4: Observations file ingestion & empty handling
```

---

## 3. Communication Contracts & Protocols

### 3.1 Serialization & Casing
- **Internal Python Representation:** Idiomatic Python `snake_case` (e.g., `field_id`, `captured_at`, `status_label`).
- **Wire Representation:** `camelCase` (e.g., `fieldId`, `capturedAt`, `statusLabel`).
- **Pydantic Model Configuration:** Configured with `populate_by_name=True` and camelCase serialization aliases so all API input and output seamlessly align with existing TypeScript definitions.
- **Dates:** ISO 8601 UTC strings terminating with `Z` (e.g., `"2026-06-15T08:42:00Z"`).
- **Physical Units:** Distances in metres (`m`), land areas in hectares (`ha`), masses in metric tonnes (`t`).

### 3.2 List Response Envelope
All collections return a standardized envelope. Single resource endpoints return the bare object.
```json
{
  "items": [],
  "total": 0,
  "limit": 50,
  "offset": 0
}
```
*Constraints:* `limit` defaults to 50, maximum allowed is 200.

### 3.3 Error Envelope & Codes
All errors return HTTP status $\ge 400$ formatted as:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Field parcel PB-FIELD-001 not found",
    "details": null
  }
}
```
Standardized error codes:
- `VALIDATION_ERROR` (HTTP 422): Schema validation failure or malformed payload.
- `UNAUTHENTICATED` (HTTP 401): Missing, expired, or invalid JWT session token.
- `FORBIDDEN` (HTTP 403): User authenticated but lacks required permission.
- `NOT_FOUND` (HTTP 404): Resource not found. Also used instead of 403 when returning 403 would leak the existence of a sensitive record to an unauthorized role.
- `CONFLICT` (HTTP 409): Concurrent modification, duplicate unique key, or attempting to supersede an already-superseded evidence record.
- `UPLOAD_REJECTED` (HTTP 400): File rejected due to MIME type mismatch, magic-byte mismatch, exceeding size limits, or path traversal detected in filename.
- `RATE_LIMITED` (HTTP 429): Authentication or request rate limit exceeded.

---

## 4. Domain Enums & Value Constraints

### 4.1 Project Status & Assessment Status
- Wire Enum: `"UNVERIFIED"` | `"NEEDS_REVIEW"` | `"READY_FOR_VERIFICATION"`
- Wire Status Label: `"Unverified"` | `"Needs review"` | `"Ready for verification"`
- Outstanding Verification List: `["Independent field visit", "Independent review"]`
- **Truth Rule Invariant:** The word `"Verified"`, `"Audited"`, or `"Certified"` must **never** appear as a status or claim anywhere in the codebase, responses, or seed data.

### 4.2 Evidence Status & Category
- **Status Enum:**
  - `received`: File uploaded and raw binary SHA-256 computed on the server.
  - `hash_recorded`: File verified and registered in the immutable evidence graph.
  - `self_reported`: Declarative farmer submission without independent instrument corroboration.
  - `flagged`: Rule evaluation flagged an anomaly (e.g., spatial mismatch or temporal offset).
  - `superseded`: An updated/corrected evidence record has replaced this record.
- **Category Enum:**
  - `supporting`: Corroborates the declared agricultural practice.
  - `contradicting`: Conflicts with the declared practice (e.g., evidence of burning or standing water during drydown).
  - `missing`: Required documentation has not yet been submitted.

### 4.3 Review & Enquiry Status
- **Review Decision:** `accepted` | `rejected` | `clarification_requested`
- **Buyer Enquiry Status:** `Active` | `Review Required` | `Approved` (Matches existing TypeScript enum strictly).
- **Enquiry Stage:** `Inquiry` | `Data Room Shared` | `Audit Underway` | `Term Sheet`

---

## 5. Security & Role-Based Access Control (RBAC) Matrix

### 5.1 Authentication Mechanism
- Stateless signed JWT (HS256) issued at `POST /api/auth/session`.
- Passwords hashed using Python standard library `hashlib.scrypt` with individual salt and constant-time comparison (`secrets.compare_digest`).
- Client-supplied role, status, or identity headers are completely ignored.
- The user's role and permissions are looked up from the server-side user store on **every request**.
- Login attempts are throttled (rate-limited) per IP/email.
- In `APP_MODE=demo` or `APP_ENV=development`, seed credentials are loaded from environment variables (never committed). Default secrets cause the server to refuse startup in production mode (`APP_ENV=production`).

### 5.2 Server-Side Role Permission Matrix
| Endpoint / Operation | `admin` | `project_developer` | `field_officer` | `reviewer` | `farmer` | `buyer` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `GET /api/health` | Public | Public | Public | Public | Public | Public |
| `POST /api/auth/session` | Public | Public | Public | Public | Public | Public |
| `GET /api/me` | Authenticated | Authenticated | Authenticated | Authenticated | Authenticated | Authenticated |
| `GET /api/audit` | ✅ Full | ❌ 404 | ❌ 404 | ✅ Read-only | ❌ 404 | ❌ 404 |
| `GET /api/projects` | ✅ All | ✅ Assigned | ❌ 404 | ✅ All | ❌ 404 | ❌ 404 |
| `POST /api/projects/{id}/publish` | ✅ Yes | ❌ 403 | ❌ 404 | ❌ 403 | ❌ 404 | ❌ 404 |
| `GET /api/fields` | ✅ All | ✅ In Project | ✅ Assigned | ✅ All | ✅ Own Only | ❌ 404 |
| `GET /api/fields/{id}` | ✅ All | ✅ In Project | ✅ Assigned | ✅ All | ✅ Own Only | ❌ 404 |
| `POST /api/evidence` | ✅ Yes | ✅ In Project | ✅ Assigned | ❌ 403 | ✅ Own Field | ❌ 404 |
| `GET /api/evidence/{id}` | ✅ All | ✅ In Project | ✅ Assigned | ✅ All | ✅ Own Only | ❌ 404 |
| `POST /api/evidence/{id}/supersede` | ✅ Yes | ✅ In Project | ✅ Assigned | ❌ 403 | ✅ Own Only | ❌ 404 |
| `POST /api/assessments/run` | ✅ Yes | ✅ In Project | ❌ 403 | ❌ 403 | ❌ 404 | ❌ 404 |
| `GET /api/assessments/{id}` | ✅ All | ✅ In Project | ❌ 404 | ✅ All | ❌ 404 | ❌ 404 |
| `GET /api/reviews` | ✅ All | ✅ In Project | ❌ 404 | ✅ All | ❌ 404 | ❌ 404 |
| `POST /api/reviews/{id}/decision` | ✅ Yes | ❌ 403 | ❌ 404 | ✅ Yes | ❌ 404 | ❌ 404 |
| `GET /api/notifications` | ✅ All | ✅ In Project | ✅ Assigned | ❌ 404 | ✅ Own Only | ❌ 404 |
| `GET /api/marketplace` | ✅ Published | ✅ Published | ❌ 404 | ❌ 404 | ❌ 404 | ✅ Published |
| `GET /api/buyer/projects/{id}` | ✅ Published | ✅ Published | ❌ 404 | ❌ 404 | ❌ 404 | ✅ Published |
| `POST /api/buyer/enquiries` | ❌ 403 | ❌ 403 | ❌ 404 | ❌ 404 | ❌ 404 | ✅ Own Company |
| `GET /api/buyer/enquiries` | ❌ 403 | ❌ 403 | ❌ 404 | ❌ 404 | ❌ 404 | ✅ Own Company |
| `GET /api/enquiries` | ✅ All | ✅ In Project | ❌ 404 | ❌ 404 | ❌ 404 | ❌ 404 |
| `GET /api/satellite/observations` | ✅ All | ✅ All | ✅ Assigned | ✅ All | ❌ 404 | ❌ 404 |

### 5.3 Inherent IDOR Protection & Information Hiding
- When a caller requests an entity that exists but is outside their assigned jurisdiction or ownership scope, the server responds with HTTP 404 (`NOT_FOUND`), preventing attackers from enumerating valid private resource IDs.
- Farmer names and contact details (`farmerName`, `farmerNameLocal`, `phoneMasked`) are dynamically redacted by the service layer if the caller lacks administrative or field-officer permissions.
- Buyer-safe projections (`BuyerProjectSummary`) structurally exclude farmer PII, farmer counts, raw evidence URIs, and unapproved financial claims.

---

## 6. Endpoints & Route Definitions

| Method | Path | Summary & Authorization |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check returning service status, name, and version. |
| `POST` | `/api/auth/session` | Exchanges credentials for a signed short-lived JWT session token. |
| `GET` | `/api/me` | Returns the current user profile, organization, and resolved roles. |
| `GET` | `/api/audit` | Paginated append-only audit trail with previous/event hash verification. |
| `GET` | `/api/projects` | List projects (scoped by role: admin sees all, dev sees assigned). |
| `GET` | `/api/projects/{id}` | Retrieve individual project record. |
| `POST` | `/api/projects/{id}/publish` | Admin action to approve and publish project to the marketplace. |
| `GET` | `/api/fields` | List field parcels (scoped by role/ownership). |
| `GET` | `/api/fields/{id}` | Retrieve parcel details and boundary polygon. |
| `POST` | `/api/evidence` | Multipart upload of field photo, log, or document; raw SHA-256 computed. |
| `GET` | `/api/evidence` | Filter evidence by field, activity, or supersession status. |
| `GET` | `/api/evidence/{id}` | Retrieve individual evidence metadata. |
| `GET` | `/api/evidence/{id}/history` | Retrieve full chronological supersession chain for an evidence record. |
| `POST` | `/api/evidence/{id}/supersede` | Atomically supersedes old evidence with a newly uploaded record. |
| `POST` | `/api/seasons` | Create crop season record (e.g., Kharif 2026). |
| `GET` | `/api/seasons` | List active crop seasons. |
| `POST` | `/api/activities` | Log agricultural activity (e.g., pre-sowing irrigation, direct seeding). |
| `GET` | `/api/activities` | List logged field activities. |
| `POST` | `/api/assessments/run` | Execute deterministic R1–R5 rules engine on an active field parcel. |
| `GET` | `/api/assessments` | List historical MRV assessment evaluations. |
| `GET` | `/api/assessments/{id}` | Retrieve individual assessment and granular rule results. |
| `GET` | `/api/reviews` | List pending exception queue tasks. |
| `GET` | `/api/reviews/{id}` | Retrieve review task details. |
| `POST` | `/api/reviews/{id}/decision` | Record append-only auditor decision and optional farmer notification. |
| `GET` | `/api/notifications` | Farmer-visible notifications and correction requests. |
| `GET` | `/api/marketplace` | Buyer-safe directory of approved, published agricultural carbon projects. |
| `GET` | `/api/buyer/projects/{id}` | Buyer-safe project dossier with zero farmer PII. |
| `POST` | `/api/buyer/enquiries` | Submit corporate due diligence enquiry or data room access request. |
| `GET` | `/api/buyer/enquiries` | List corporate buyer's own submitted enquiries. |
| `GET` | `/api/enquiries` | Project developer & admin inbox of received buyer enquiries. |
| `GET` | `/api/satellite/observations` | Ingested Sentinel-2 passes from Lead's `observations.json`. |
| `GET` | `/api/satellite/fields/{field_id}` | Sentinel-2 passes intersecting specified parcel boundary. |

---

## 7. Truth Rules, Demo Data & Financial Constraints

1. **Synthetic Indicator:** Every entity returned by the backend includes:
   ```json
   {
     "isDemo": true,
     "dataLabel": "Demo data"
   }
   ```
2. **No Fabricated Carbon Claims:** Fields such as `targetEmissionReductionTonnes` or `estimatedTonsCo2ePerYear` are initialized to `null`, accompanied by the note: `"Preliminary estimate: not computed"`.
3. **No Fabricated Pricing:** Prices (`indicativePricePerTonUsd`) are strictly `null`.
4. **No Synthetic Satellite Data:** Real satellite observations are read from Lead's `data/observations.json`. If this file is absent or empty, the backend returns an empty list with `"metadata": { "status": "no observations available" }`.
5. **No Verification Overstatement:** All outputs use `"READY_FOR_VERIFICATION"`, never `"VERIFIED"`.

---

## 8. Cryptographic Audit Engine Invariant

The audit log at `backend/data/audit/audit.jsonl` is strictly append-only:
- **Genesis Block:** `previous_hash` = `0000000000000000000000000000000000000000000000000000000000000000` (64 zeros).
- **Canonical Serialization:**
  ```python
  canonical_payload = json.dumps(
      {k: v for k, v in event_dict.items() if k != "event_hash"},
      sort_keys=True,
      separators=(",", ":"),
      ensure_ascii=False,
  ).encode("utf-8")
  event_hash = hashlib.sha256(canonical_payload).hexdigest()
  ```
- **Durability:** File opened in append mode (`"a"`), flushed, and synced to disk (`os.fsync`) within a concurrency lock.
- **Verification:** An integrity verification function (`verify_chain()`) parses every event sequentially, verifying that each event's hash matches its payload and matches the succeeding event's `previous_hash`.
- **Zero Truncation:** No code path exists to delete, truncate, or overwrite the audit log.
