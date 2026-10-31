# TerraLedger / VirsaFloww Backend API Specification & Frontend Integration Blueprint

**Version**: 1.0.0  
**Authoritative Source**: `backend/app/` (FastAPI + Pydantic v2 + SQLAlchemy 2.x + GeoAlchemy2)  
**Investigation Timestamp**: 2026-10-31T17:05:00Z  
**Target Environment Variable**: `VITE_API_BASE_URL=http://127.0.0.1:8000`

---

## 1. Executive Architecture & Core Conventions

### 1.1 Base URL & Routing Architecture
- All API routes are mounted under the `/api` prefix (defined in `backend/app/api/router.py`).
- The frontend central API client must prefix all HTTP requests with `/api` relative to `VITE_API_BASE_URL` (e.g. `http://127.0.0.1:8000/api/auth/session`).
- The backend runs on port 8000 by default (`HOST=0.0.0.0`, `PORT=8000`).

### 1.2 Serialization & Wire Format Standard
- Models inherit from `BaseSchema` (`backend/app/schemas/common.py`), configured with:
  ```python
  model_config = ConfigDict(populate_by_name=True, from_attributes=True)
  ```
- **Serialization**: FastAPI and Pydantic serialize JSON responses using **`camelCase`** field aliases (e.g. `accessToken`, `fieldId`, `capturedAt`, `isDemo`, `dataLabel`).
- **Deserialization**: Payloads sent to endpoints can use either `camelCase` or `snake_case` due to `populate_by_name=True`, but frontend code must standardize on `camelCase` for consistency.

### 1.3 Identification & Primary Key Types
- All primary entity identifiers are **strings** (`str`), formatted with semantic category prefixes:
  - Users: `USR-<ROLE>-<NUM>` (e.g. `USR-ADMIN-01`, `USR-DEV-02`, `USR-FLD-03`, `USR-REV-04`, `USR-FAR-05`, `USR-BUY-06`)
  - Projects: `PRJ-<STATE>-<PRACTICE>-<NUM>` (e.g. `PRJ-PB-DSR-001`)
  - Fields: `PB-FIELD-<NUM>` (e.g. `PB-FIELD-001`)
  - Evidence: `EV-<HEX8>` or `EV-<YEAR>-<NUM>` (e.g. `EV-2026-001`, `EV-9F3B1A2C`)
  - Assessments: `ASM-<HEX8>` or `ASM-<YEAR>-<NUM>` (e.g. `ASM-2026-001`, `ASM-A1B2C3D4`)
  - Reviews: `REV-<YEAR>-<NUM>` (e.g. `REV-2026-001`)
  - Activities: `ACT-<YEAR>-<NUM>` (e.g. `ACT-2026-001`)
  - Seasons: `SEASON-<NAME>-<YEAR>` (e.g. `SEASON-KHARIF-2026`)
  - Notifications: `NOTIF-<HEX8>` or `NOTIF-<YEAR>-<NUM>` (e.g. `NOTIF-2026-001`)
  - Enquiries: `ENQ-<HEX8>` or `ENQ-<YEAR>-<NUM>` (e.g. `ENQ-2026-001`)
  - Audit Events: UUID string (`eventId`) with integer `sequence_num` in Postgres

### 1.4 Timestamp Format Standards
- Timestamps are formatted as ISO 8601 UTC strings:
  - Precise timestamps: `YYYY-MM-DDTHH:MM:SSZ` (e.g. `2026-06-15T09:10:00Z`)
  - Date-only strings: `YYYY-MM-DD` (e.g. `2026-06-15`, `2026-07-01`)
- Timestamps always reflect UTC. Frontend adapters must parse these safely using `new Date(...)` or date formatting utilities.

---

## 2. Standard JSON Response Envelopes

The backend enforces uniform top-level response envelope structures across all modules.

### 2.1 The Error Envelope (`ErrorEnvelope`)
Defined in `backend/app/schemas/common.py` and enforced globally by exception handlers in `backend/app/main.py`:
```json
{
  "error": {
    "code": "STRING_ERROR_CODE",
    "message": "Human-readable explanation of error.",
    "details": null
  }
}
```

#### Global Error Codes Matrix:
| Error Code | HTTP Status | Origin / Condition | `details` Contents |
|---|---|---|---|
| `UNAUTHENTICATED` | 401 | Missing/malformed Authorization header, or invalid/expired session token | `null` |
| `NOT_FOUND` | 404 | Entity not found OR caller lacks permission (RBAC hide-endpoint strategy) | `null` |
| `VALIDATION_ERROR` | 422 | Submitted payload failed Pydantic schema validation | Array of validation error objects `[{loc, msg, type}]` |
| `RATE_LIMITED` | 429 | Exceeded 5 login attempts/min or 10 explanation requests/min | `null` |
| `ALREADY_EXISTS` | 409 | Entity ID conflict on create | `null` |
| `ALREADY_SUPERSEDED` | 409 | Attempting to supersede an already superseded evidence record | `null` |
| `EMPTY_FILE` | 400 | Uploaded file binary size is 0 bytes | `null` |
| `FILE_TOO_LARGE` | 413 | Uploaded file exceeds 15 MB (`MAX_UPLOAD_SIZE_BYTES`) | `null` |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | File magic bytes do not match JPEG, PNG, PDF, or CSV | `null` |
| `FIELD_NOT_FOUND` | 404 | Referenced field ID does not exist during assessment or activity create | `null` |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled server exception | Exception trace if `APP_ENV==development`, else `null` |

### 2.2 The Paginated List Envelope (`ListEnvelope[T]`)
Defined in `backend/app/schemas/common.py`:
```json
{
  "items": [ /* array of entity objects */ ],
  "total": 128,
  "limit": 50,
  "offset": 0
}
```
- `items`: Array of serialized model objects of generic type `T`.
- `total`: Total count of matching records across all pages.
- `limit`: Query parameter specifying page size (default `50`, min `1`, max `100` or `200`).
- `offset`: Query parameter specifying index offset (default `0`).

### 2.3 Single Object & Specialized Envelopes
- Single resource endpoints return the bare model object directly (e.g. `GET /api/projects/{id}` returns `Project`, `GET /api/fields/{id}` returns `FieldModel`).
- Specialized endpoints return custom top-level schemas:
  - `GET /api/satellite/observations`: `SatelliteObservationsResponse` (`{"items": [...], "total": int, "metadata": {...}}`)
  - `GET /api/fields/{id}/graph` & `GET /api/projects/{id}/graph`: `EvidenceGraphResponse` (`{"nodes": [...], "edges": [...], "generatedAt": str, "assessmentId": str}`)
  - `GET /api/evidence/{id}/history`: `{"evidenceId": str, "currentStatus": str, "history": [...]}`
  - `GET /api/audit/verify`: `{"valid": bool, "error": str | null, "verifiedBy": str}`

---

## 3. Authentication & Session Management

### 3.1 Authentication Strategy & Header Mechanics
- **Mechanism**: JWT Bearer Token.
- **Authorization Header**:
  ```http
  Authorization: Bearer <token>
  ```
- **Storage Requirement**: The frontend client must store the token under the localStorage key `virsaflow_access_token`.
- **JWT Lifetime**: `JWT_EXPIRATION_MINUTES = 60` (1 hour) by default.
- **Token Validation**: The backend extracts `sub` from the JWT and re-fetches the user record from the database on every authenticated request. **Client claims (e.g. role in token) are never trusted for RBAC.**

### 3.2 Role-Based Access Control (RBAC) System
Six distinct user roles are defined in `backend/app/schemas/user.py`:
1. `admin` — Full platform authority, publish projects, verify audit chains.
2. `project_developer` — Manages assigned projects and field parcels.
3. `field_officer` — Enrolls fields, records activities, captures in-situ evidence.
4. `reviewer` — Audits assessments, verifies evidence, issues review decisions.
5. `farmer` — Views assigned field parcels, uploads evidence, declares activities.
6. `buyer` — Browses published marketplace projects, submits commercial enquiries.

**Critical RBAC Behavior**: When a user attempts to access an endpoint for which their role lacks permission, the backend returns **`HTTP 404 NOT FOUND`** rather than `403 FORBIDDEN`. This security design prevents leaking the existence of internal endpoints to unauthorized roles.

### 3.3 Auth Endpoints Reference

#### `POST /api/auth/session` (and alias `POST /api/auth/login`)
- **Description**: Authenticate user credentials and receive a signed JWT.
- **Rate Limit**: Max 5 failed attempts per 60 seconds per `email:ip`. Exceeding triggers HTTP 429 (`RATE_LIMITED`).
- **Request Body**:
  ```json
  {
    "email": "user@domain.com",
    "password": "plain_password"
  }
  ```
- **Response**: `200 OK` -> `SessionResponse`
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1Ni...",
    "tokenType": "Bearer",
    "expiresInSeconds": 3600,
    "user": {
      "id": "USR-ADMIN-01",
      "email": "admin@terraledger.ai",
      "name": "Dr. Inderjit Singh",
      "role": "admin",
      "organization": "TerraLedger Global MRV",
      "assignedProjectIds": [],
      "assignedFieldIds": [],
      "buyerCompanyId": null,
      "isActive": true
    }
  }
  ```

#### `GET /api/auth/me` (and alias `GET /api/me`)
- **Description**: Restore and verify user session upon page reload.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` -> `User`
  ```json
  {
    "id": "USR-ADMIN-01",
    "email": "admin@terraledger.ai",
    "name": "Dr. Inderjit Singh",
    "role": "admin",
    "organization": "TerraLedger Global MRV",
    "assignedProjectIds": [],
    "assignedFieldIds": [],
    "buyerCompanyId": null,
    "isActive": true
  }
  ```
- **Error Response**: If token is invalid or expired: `401 UNAUTHORIZED` with `{"error": {"code": "UNAUTHENTICATED", "message": "Invalid, expired, or revoked session token.", "details": null}}`.

---

## 4. Complete Module-by-Module API Reference

### 4.1 Projects Engine (`/api/projects`)

| Method | Endpoint | Allowed Roles | Description | Response Model |
|---|---|---|---|---|
| `GET` | `/api/projects` | `admin`, `project_developer`, `field_officer`, `reviewer` | List internal projects (scoped to assigned projects for developers) | `ListEnvelope[Project]` |
| `GET` | `/api/projects/{id}` | `admin`, `project_developer`, `field_officer`, `reviewer` | Get operational project detail | `Project` |
| `POST` | `/api/projects/{id}/publish` | `admin` only | Publish project to public marketplace | `Project` |

#### `Project` Schema Definition:
```typescript
interface Project {
  id: string; // e.g. "PRJ-PB-DSR-001"
  title: string;
  slug: string;
  location: string;
  district: string;
  practice: string; // default: "Direct Seeded Rice (DSR) + AWD"
  methodology: string; // default: "Methodology: pending confirmation"
  developer: string;
  totalHectares: number;
  enrolledParcels: number;
  farmerCount: number;
  estimatedTonsCo2ePerYear: number | null; // nullable!
  carbonEstimateNote: string; // "Preliminary estimate: not computed"
  readinessScorePercent: number | null; // nullable!
  assessmentStatus: "UNVERIFIED" | "NEEDS_REVIEW" | "READY_FOR_VERIFICATION";
  statusLabel: string; // "Unverified", "Needs review", "Ready for verification"
  outstandingVerification: string[]; // ["Independent field visit", "Independent review"]
  indicativePricePerTonUsd: number | null; // nullable!
  priceNote: string; // "Preliminary estimate: not computed"
  vintage: string; // "Kharif 2026"
  description: string;
  highlights: string[];
  evidenceDepth: {
    satellitePasses: number;
    groundPhotos: number;
    waterLogs: number;
  };
  isPublished: boolean;
  isDemo: boolean;
  dataLabel: string;
}
```

---

### 4.2 Field Parcels Engine (`/api/fields`)

| Method | Endpoint | Allowed Roles | Description | Response Model |
|---|---|---|---|---|
| `GET` | `/api/fields` | All except `buyer` (buyer gets 404) | List fields (scoped to assigned fields for farmers/officers) | `ListEnvelope[FieldModel]` |
| `GET` | `/api/fields/{id}` | All except `buyer` | Get details of a single field parcel | `FieldModel` |

**Query Parameters for `GET /api/fields`**:
- `projectId`: Optional string filter.
- `offset`: integer (default 0).
- `limit`: integer (default 50).

#### `FieldModel` Schema Definition:
```typescript
interface FieldModel {
  id: string; // e.g. "PB-FIELD-001"
  code: string; // e.g. "PB-FIELD-001"
  name: string; // e.g. "Gill Demonstration Parcel 1"
  farmerId: string; // e.g. "FARM-PB-001"
  farmerName: string | null;
  farmerNameLocal: string | null; // Punjabi Gurmukhi text e.g. "ਗੁਰਦੇਵ ਸਿੰਘ ਗਿੱਲ"
  district: string;
  state: string; // default: "Punjab"
  areaHa: number;
  areaAcres: number;
  practice: string; // "Direct Seeded Rice (DSR)"
  crop: string; // "PR-126 Basmati / Paddy"
  season: string; // "Kharif 2026"
  coordinates: {
    lat: number;
    lng: number;
  };
  boundaryPolygon: number[][]; // Array of [lat, lng] coordinate pairs! E.g. [[30.9135, 75.8345], ...]
  geometrySource: string; // "demo-placeholder"
  targetEmissionReductionTonnes: number | null;
  emissionReductionNote: string;
  assignedOfficerId: string | null;
  projectId: string | null;
  isDemo: boolean;
  dataLabel: string;
}
```

#### Spatial & PostGIS Rules:
- If a parcel has no boundary polygon, `boundaryPolygon` is an empty array `[]`.
- The frontend map component must safely render the polygon when `boundaryPolygon.length >= 3`. If empty, render a marker pin at `coordinates.lat` / `coordinates.lng`.

---

### 4.3 Evidence Engine (`/api/evidence`)

| Method | Endpoint | Allowed Roles | Description | Response Model |
|---|---|---|---|---|
| `POST` | `/api/evidence` | `admin`, `project_developer`, `field_officer`, `farmer` | Upload new evidence file (multipart/form-data) | `Evidence` (Status 201) |
| `GET` | `/api/evidence` | All except `buyer` | List evidence items with filter options | `ListEnvelope[Evidence]` |
| `GET` | `/api/evidence/{id}` | All except `buyer` | Get full evidence item details | `Evidence` |
| `GET` | `/api/evidence/{id}/history` | All except `buyer` | Get immutable append-only lifecycle history | `EvidenceHistoryResponse` |
| `POST` | `/api/evidence/{id}/supersede` | `admin`, `project_developer`, `field_officer`, `farmer` | Atomically supersede evidence with replacement | `Evidence` (Status 201) |

#### Multipart Upload Specifications:
- `POST /api/evidence` expects `multipart/form-data`:
  - `file`: Raw binary file (`UploadFile`).
  - `fieldId`: string (required)
  - `title`: string (required)
  - `type`: `"photo" | "satellite" | "document" | "log" | "sensor"` (required)
  - `category`: `"supporting" | "contradicting" | "missing"` (default: `"supporting"`)
  - `activityId`: string (optional)
  - `description`: string (optional, default: `""`)
  - `capturedAt`: ISO UTC string (required)
  - `author`: string (required)
  - `source`: string (default: `"mobile_app"`)
  - `device`: string (optional)
  - `lat`: float (optional)
  - `lng`: float (optional)
  - `accuracyMeters`: float (optional)
- **Content-Type**: The central API client must NOT manually set `Content-Type: multipart/form-data`; Axios or `fetch` must set the header automatically with the boundary delimiter.
- **Permitted File Formats**: JPEG (`.jpg`, `.jpeg`), PNG (`.png`), PDF (`.pdf`), CSV (`.csv`).
- **File Size Limit**: 15 MB (`MAX_UPLOAD_SIZE_BYTES = 15728640`). Exceeding returns `HTTP 413` (`FILE_TOO_LARGE`).
- **SHA-256 Calculation**: The server reads the raw binary bytes and computes `sha256 = hashlib.sha256(raw_bytes).hexdigest()`.

#### Evidence Immutability & Superseding:
- Existing evidence records **cannot be edited or deleted**.
- To update or correct evidence, clients must call `POST /api/evidence/{evidence_id}/supersede` with `multipart/form-data` containing `file` and `reason`.
- If the previous evidence is already in status `superseded`, the backend returns **`HTTP 409 CONFLICT`** with:
  ```json
  {
    "error": {
      "code": "ALREADY_SUPERSEDED",
      "message": "Evidence 'EV-...' has already been superseded.",
      "details": null
    }
  }
  ```
- Upon superseding:
  1. The existing record's `status` transitions to `"superseded"`, and a transition record is appended to its `statusHistory`.
  2. A new replacement `Evidence` record is created with `supersedesId = previous_id` and initial `status = "hash_recorded"`.

#### `Evidence` Schema Definition:
```typescript
interface Provenance {
  author: string;
  source: string;
  sha256: string; // 64-character lowercase hex digest
  device?: string | null;
  gpsCoordinates?: {
    lat: number;
    lng: number;
    accuracyMeters?: number | null;
  } | null;
  spatialDistanceMeters?: number | null;
  reviewStatus: string;
}

interface FileDetails {
  name: string;
  sizeKb: number;
  mime: string;
  storageUri?: string | null;
}

interface EvidenceStatusHistory {
  timestamp: string;
  previousStatus: "received" | "hash_recorded" | "self_reported" | "flagged" | "superseded";
  newStatus: "received" | "hash_recorded" | "self_reported" | "flagged" | "superseded";
  actorId: string;
  reason?: string | null;
}

interface Evidence {
  id: string; // e.g. "EV-2026-001"
  fieldId: string;
  activityId?: string | null;
  title: string;
  type: "photo" | "satellite" | "document" | "log" | "sensor";
  category: "supporting" | "contradicting" | "missing";
  status: "received" | "hash_recorded" | "self_reported" | "flagged" | "superseded";
  description: string;
  capturedAt: string;
  submittedAt: string;
  submitterId: string;
  provenance: Provenance;
  fileDetails?: FileDetails | null;
  supersedesId?: string | null;
  statusHistory: EvidenceStatusHistory[];
  isDemo: boolean;
  dataLabel: string;
}
```

---

### 4.4 MRV Assessments Engine (`/api/assessments`)

| Method | Endpoint | Allowed Roles | Description | Response Model |
|---|---|---|---|---|
| `POST` | `/api/assessments/run` | `admin`, `project_developer`, `field_officer`, `reviewer` | Run deterministic 5-rule MRV evaluation on a field | `Assessment` (Status 201) |
| `GET` | `/api/assessments` | All except `buyer` | List evaluations with filters | `ListEnvelope[Assessment]` |
| `GET` | `/api/assessments/{id}` | All except `buyer` | Fetch detailed rule evaluation breakdown | `Assessment` |

#### `RunAssessmentRequest` Body:
```json
{
  "fieldId": "PB-FIELD-001",
  "seasonId": "SEASON-KHARIF-2026",
  "triggerReason": "manual"
}
```

#### `Assessment` Schema Definition:
```typescript
interface RuleResult {
  ruleId: "R1_COMPLETENESS" | "R2_DATE_WINDOW" | "R3_PHOTO_DISTANCE" | "R4_IRRIGATION_PRACTICE" | "R5_SATELLITE_COVERAGE";
  result: "pass" | "warn" | "fail";
  explanation: string;
  sourceRecordIds: string[];
}

interface Assessment {
  id: string; // e.g. "ASM-2026-001"
  fieldId: string;
  seasonId: string;
  assessedAt: string;
  rulesetVersion: string; // "1.0.0-deterministic"
  status: "UNVERIFIED" | "NEEDS_REVIEW" | "READY_FOR_VERIFICATION";
  statusLabel: string; // "Unverified", "Needs review", "Ready for verification"
  outstandingVerification: string[]; // ["Independent field visit", "Independent review"]
  ruleResults: RuleResult[];
  isDemo: boolean;
  dataLabel: string;
}
```

---

### 4.5 Reviews Engine (`/api/reviews`)

| Method | Endpoint | Allowed Roles | Description | Response Model |
|---|---|---|---|---|
| `GET` | `/api/reviews` | All except `buyer` | List reviewer tasks/audits | `ListEnvelope[Review]` |
| `GET` | `/api/reviews/{id}` | All except `buyer` | Fetch review task detail | `Review` |
| `POST` | `/api/reviews/{id}/decision` | `admin`, `reviewer` only | Submit authoritative review verdict | `Review` |

#### `ReviewDecisionRequest` Body:
```json
{
  "decision": "accepted" | "rejected" | "clarification_requested",
  "comment": "Field photo EXIF confirmed matches parcel boundary.",
  "correctionRequest": "Please re-upload photo from northern ridge."
}
```
- `"accepted"` -> transitions `status` to `"resolved"`
- `"rejected"` -> transitions `status` to `"resolved"`
- `"clarification_requested"` -> transitions `status` to `"in_investigation"` and dispatches a `Notification` to the field officer/farmer!

#### `Review` Schema Definition:
```typescript
interface Review {
  id: string; // e.g. "REV-2026-001"
  parcelId: string;
  fieldId: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  status: "pending_review" | "in_investigation" | "resolved" | "escalated";
  reportedDate: string; // "YYYY-MM-DD"
  dueDate: string; // "YYYY-MM-DD"
  assignedTo: string;
  evidenceRefId?: string | null;
  decision?: "accepted" | "rejected" | "clarification_requested" | null;
  comment?: string | null;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
  isDemo: boolean;
  dataLabel: string;
}
```

---

### 4.6 Seasons & Activities (`/api/seasons`, `/api/activities`)

#### Seasons Endpoints:
| Method | Endpoint | Allowed Roles | Description | Response Model |
|---|---|---|---|---|
| `GET` | `/api/seasons` | All except `buyer` | List agricultural seasons | `ListEnvelope[Season]` |
| `POST` | `/api/seasons` | `admin`, `project_developer` | Create a new season | `Season` (Status 201) |

```typescript
interface Season {
  id: string; // "SEASON-KHARIF-2026"
  name: string; // "Kharif 2026"
  year: number; // 2026
  startDate: string; // "2026-05-15"
  endDate: string; // "2026-11-15"
  isActive: boolean;
  isDemo: boolean;
  dataLabel: string;
}
```

#### Activities Endpoints:
| Method | Endpoint | Allowed Roles | Description | Response Model |
|---|---|---|---|---|
| `GET` | `/api/activities` | All except `buyer` | List farming activities (filters: `fieldId`, `seasonId`, `activityType`) | `ListEnvelope[Activity]` |
| `POST` | `/api/activities` | `admin`, `project_developer`, `field_officer`, `farmer` | Record an agricultural practice activity | `Activity` (Status 201) |

```typescript
interface Activity {
  id: string; // e.g. "ACT-2026-001"
  fieldId: string;
  seasonId: string;
  activityType: "pre_sowing_irrigation" | "direct_seeding" | "awd_irrigation" | "fertilizer_application" | "harvest";
  declaredDate: string; // "YYYY-MM-DD"
  notes?: string | null;
  createdBy: string;
  createdAt: string;
  isDemo: boolean;
  dataLabel: string;
}
```

---

### 4.7 Notifications Engine (`/api/notifications`)

| Method | Endpoint | Allowed Roles | Description | Response Model |
|---|---|---|---|---|
| `GET` | `/api/notifications` | All authenticated users | List notifications addressed to caller | `ListEnvelope[Notification]` |

**Query Parameters**: `isRead` (boolean optional), `offset`, `limit`.

```typescript
interface Notification {
  id: string; // e.g. "NOTIF-2026-001"
  recipientId: string;
  fieldId?: string | null;
  type: "correction_request" | "status_update" | "evidence_flagged";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  isDemo: boolean;
  dataLabel: string;
}
```

---

### 4.8 Audit Trail Engine (`/api/audit`)

| Method | Endpoint | Allowed Roles | Description | Response Model |
|---|---|---|---|---|
| `GET` | `/api/audit` | `admin`, `reviewer` | Paginated append-only cryptographic event ledger | `ListEnvelope[AuditEvent]` |
| `GET` | `/api/audit/verify` | `admin`, `reviewer` | Verify cryptographic hash-chain continuity from genesis | `{"valid": bool, "error": str | null, "verifiedBy": str}` |

```typescript
interface AuditEvent {
  eventId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string; // ISO 8601 UTC ending in Z
  details?: Record<string, any> | null;
  previousHash: string; // 64-char SHA-256
  eventHash: string; // 64-char SHA-256
}
```

---

### 4.9 Buyer Marketplace & Commercial Enquiries (`/api/marketplace`, `/api/buyer/...`)

| Method | Endpoint | Allowed Roles | Description | Response Model |
|---|---|---|---|---|
| `GET` | `/api/marketplace` (and `/api/marketplace/projects`) | **Public** (no auth required) | Buyer-safe published carbon projects | `ListEnvelope[BuyerProjectSummary]` |
| `GET` | `/api/buyer/projects/{project_id}` | **Public** (no auth required) | Buyer-safe project detail | `BuyerProjectSummary` |
| `POST` | `/api/buyer/enquiries` | `buyer`, `admin` | Submit credit purchase enquiry | `BuyerEnquiry` (Status 201) |
| `GET` | `/api/buyer/enquiries` | `buyer`, `admin` | List enquiries for caller's company | `ListEnvelope[BuyerEnquiry]` |
| `GET` | `/api/enquiries` | `admin`, `project_developer` | Internal view of all buyer enquiries | `ListEnvelope[BuyerEnquiry]` |

#### Buyer Safety & PII Omission Guarantee:
- `BuyerProjectSummary` strictly omits all farmer names, phone numbers, farmer IDs, and field parcel coordinates to preserve producer privacy.

```typescript
interface BuyerProjectSummary {
  id: string;
  title: string;
  slug: string;
  location: string;
  district: string;
  practice: string;
  methodology: string;
  developer: string;
  enrolledHectares?: number | null;
  eligibleHectares?: number | null;
  enrolledParcels: number;
  assessmentStatus: "UNVERIFIED" | "NEEDS_REVIEW" | "READY_FOR_VERIFICATION";
  statusLabel: string;
  outstandingVerification: string[];
  vintage: string;
  description: string;
  highlights: string[];
  evidenceDepth: {
    satellitePasses: number;
    groundPhotos: number;
    waterLogs: number;
  };
  isDemo: boolean;
  dataLabel: string;
}

interface BuyerEnquiryCreate {
  projectId: string;
  volumeRequestedTons: number;
  targetRetirementYear: string;
  message?: string | null;
}

interface BuyerEnquiry {
  id: string; // e.g. "ENQ-2026-001"
  projectId: string;
  projectTitle: string;
  buyerCompanyId: string;
  buyerName: string;
  buyerOrg: string;
  ownerId: string;
  inquiryDate: string; // YYYY-MM-DD
  stage: "Inquiry" | "Data Room Shared" | "Audit Underway" | "Term Sheet";
  status: "Active" | "Review Required" | "Approved";
  volumeRequestedTons: number;
  targetRetirementYear: string;
  message?: string | null;
  isDemo: boolean;
  dataLabel: string;
}
```

---

### 4.10 Satellite Intelligence Engine (`/api/satellite`)

| Method | Endpoint | Allowed Roles | Description | Response Model |
|---|---|---|---|---|
| `GET` | `/api/satellite/observations` | All authenticated users | Sentinel-2 multi-spectral observations | `SatelliteObservationsResponse` |
| `GET` | `/api/satellite/fields/{field_id}` | All authenticated users | Observations for a specific field parcel | `SatelliteObservationsResponse` |

#### Graceful Degradation:
If `observations.json` is missing from disk, the backend does NOT crash or return an error code; it returns:
```json
{
  "items": [],
  "total": 0,
  "metadata": {
    "status": "no_data_available",
    "reason": "Observations dataset not yet supplied by Lead."
  }
}
```
Frontend components must handle `items: []` with an appropriate empty state display.

```typescript
interface SatelliteObservation {
  id: string;
  date: string;
  sensor: string; // "Copernicus Sentinel-2 MSI"
  resolutionMeters: number; // 10.0
  cloudCoverPercent: number;
  sunAzimuthDeg: number;
  meanNdvi?: number | null;
  meanNdwi?: number | null;
  qualityRating: string; // "Standard"
  surfaceWaterDetected?: boolean | null;
  notes: string;
  isDemo: boolean;
  dataLabel: string;
}

interface SatelliteObservationsResponse {
  items: SatelliteObservation[];
  total: number;
  metadata: Record<string, any>;
}
```

---

### 4.11 Evidence Graph Engine (`/api/.../graph`)

| Method | Endpoint | Allowed Roles | Description | Response Model |
|---|---|---|---|---|
| `GET` | `/api/fields/{field_id}/graph` | All except `buyer` | Directed evidence graph for a field | `EvidenceGraphResponse` |
| `GET` | `/api/projects/{project_id}/graph` | All except `buyer` | Directed evidence graph for a project | `EvidenceGraphResponse` |

```typescript
interface GraphNode {
  id: string;
  type: "project" | "field" | "season" | "activity" | "evidence" | "satellite_observation" | "rule_result" | "review" | "assessment";
  label: string;
  status?: string | null;
  isDemo: boolean;
  dataLabel: string;
  meta: Record<string, any>;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: "has_field" | "has_activity" | "supports" | "contradicts" | "supersedes" | "evaluated_by" | "resulted_in" | "reviewed_in";
}

interface EvidenceGraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
  generatedAt: string;
  assessmentId?: string | null;
}
```

---

### 4.12 AI Explanations Engine (`/api/explanations`)

| Method | Endpoint | Allowed Roles | Description | Response Model |
|---|---|---|---|---|
| `POST` | `/api/explanations` | `admin`, `project_developer`, `field_officer`, `reviewer` | Deterministic grounded AI explanation for an assessment | `ExplainerResponse` |

**Rate Limit**: 10 requests per minute per `user:ip`. Exceeding returns `HTTP 429` (`RATE_LIMITED`).

#### `ExplainerRequest` Body:
```json
{
  "assessmentId": "ASM-2026-001",
  "question": "Explain the assessment status and rule evaluation results.",
  "language": "en"
}
```

#### `ExplainerResponse` Schema:
```typescript
interface RuleExplanationItem {
  ruleId: string;
  status: string;
  explanation: string;
  sourceRecordIds: string[];
}

interface ExplainerResponse {
  assessmentId: string;
  fieldId: string;
  status: string;
  mode: "LLM" | "Cached" | "Template";
  summary: string;
  ruleBreakdowns: RuleExplanationItem[];
  citations: string[];
  generatedAt: string;
  confidence?: string | null; // "Deterministic Grounded"
}
```

---

## 5. MRV Calculation Engine Rules & Status Invariants

The backend executes a 5-rule deterministic evaluation engine (`backend/app/rules/evaluator.py`).

### 5.1 The 5 Physical & Temporal Rules
1. **R1: Completeness (`R1_COMPLETENESS`)**:
   - Mandatory evidence elements required:
     1. Field Declaration (`practice` declared)
     2. In-situ Practice Photo (non-superseded)
     3. Field Activity Log (`activities` exist)
     4. Weather Record
     5. Satellite Observation
   - If any element is missing -> Rule result: `FAIL`.
2. **R2: Date Window (`R2_DATE_WINDOW`)**:
   - Verifies that evidence `capturedAt` falls within `WINDOW_DAYS = 10` days of the declared activity date.
   - If `delta_days > 10.0` -> Rule result: `FAIL`.
3. **R3: Photo Spatial Distance (`R3_PHOTO_DISTANCE`)**:
   - Evaluates distance from photo GPS coordinates to field boundary polygon using ray casting and segment distance.
   - `dist <= 15m` (`PHOTO_BUFFER_M`) -> `PASS`
   - `15m < dist <= 2000m` (`PHOTO_FAIL_M`) -> `WARN` (Advisory, requires manual review)
   - `dist > 2000m` or no photo GPS -> `FAIL`
4. **R4: Irrigation Practice (`R4_IRRIGATION_PRACTICE`)**:
   - Confirms pre-sowing irrigation log exists before sowing.
   - Pre-sowing irrigation must be within `IRRIGATION_LAG_DAYS = 7` days before sowing. Lag > 7 days or irrigation after sowing -> `FAIL`.
   - Corroborates with satellite NDWI: `mean_ndwi >= 0.30` (`WATER_MIN_FRACTION`) -> `PASS`. If no satellite moisture available -> `WARN`. If NDWI < 0.30 -> `FAIL`.
5. **R5: Satellite Coverage (`R5_SATELLITE_COVERAGE`)**:
   - Requires Sentinel-2 observation within 10 days of declared target date.
   - Cloud cover must be `<= 20.0%` (`CLOUD_COVER_MAX_PERCENT`). If > 20.0% -> `WARN`. If no observation -> `FAIL`.

### 5.2 Deterministic Aggregation Matrix & Status Invariants
```
┌─────────────────────────────────────────────────────────────┐
│ Any rule == FAIL  ──> AssessmentStatus.UNVERIFIED           │
│                       statusLabel: "Unverified"             │
├─────────────────────────────────────────────────────────────┤
│ Any rule == WARN  ──> AssessmentStatus.NEEDS_REVIEW         │
│                       statusLabel: "Needs review"           │
├─────────────────────────────────────────────────────────────┤
│ All rules == PASS ──> AssessmentStatus.READY_FOR_VERIFICATION│
│                       statusLabel: "Ready for verification" │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Critical Negative Constraint
- **There is NO `VERIFIED` status in the backend.**
- Third-party VVB verification requires in-person physical field visits and audit committee review. The software platform's highest achievable assessment status is `READY_FOR_VERIFICATION`.
- **The frontend must NEVER fabricate or display a status of `VERIFIED`.**

---

## 6. Frontend Integration Guidelines

### 6.1 Central API Client Implementation
- Create a unified API client module (e.g. `src/lib/api/client.ts`) wrapping `fetch` or Axios.
- Base URL read dynamically from `import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'`.
- Request Interceptor: Automatically inject header `Authorization: Bearer ${localStorage.getItem('virsaflow_access_token')}` when token exists.
- Response Interceptor:
  - If response contains `{ error: { code, message, details } }`, throw a typed `ApiError` containing the exact code, message, and details.
  - On `401 UNAUTHORIZED`, automatically clear `virsaflow_access_token` and reset auth store state.
  - On `404 NOT FOUND`, surface user-friendly "Not Found or Access Denied" message without disclosing backend role permissions.

### 6.2 Multipart Form-Data Handling
- For `POST /api/evidence` and `POST /api/evidence/{id}/supersede`, create a `FormData` object and append parameters with exact wire keys:
  ```typescript
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fieldId', fieldId);
  formData.append('title', title);
  formData.append('type', type);
  formData.append('category', category);
  formData.append('capturedAt', capturedAt);
  formData.append('author', author);
  if (lat !== undefined) formData.append('lat', String(lat));
  if (lng !== undefined) formData.append('lng', String(lng));
  // DO NOT manually set Content-Type header! Let browser set boundary!
  ```

### 6.3 UI States Strategy
Every view communicating with the backend must handle five distinct states:
1. **Loading State**: Subtle skeletons or spinner indicators preserving layout geometry.
2. **Empty State**: Friendly illustration and contextual message (e.g. "No satellite passes recorded yet", "No evidence submitted for this field").
3. **Error State**: Banner displaying backend error `message` with a retry button.
4. **Unauthorized State**: Clear message explaining restricted access or prompt to log in.
5. **Live vs Demo Flag**: Clear visual distinction (e.g. "DEMO DATA" badge when `isDemo === true`).
