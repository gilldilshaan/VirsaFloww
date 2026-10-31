# TerraLedger AI — Frontend Integration & API Handoff Document

> **Audience:** Frontend Engineers (Mankirat & Sana) connecting TanStack Start / React 19 portals (`/farmer/*`, `/workspace/*`, `/buyers/*`) to the backend API.
> **Backend Version:** 1.0.0
> **Date:** October 2026

---

## 1. Quick Start & Server Execution

### 1.1 Local Backend Execution
```bash
# In repo root:
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Base URL: `http://localhost:8000/api`
- Interactive OpenAPI / Swagger UI: `http://localhost:8000/docs`
- Health check: `GET http://localhost:8000/api/health`

### 1.2 Frontend Environment Variables
Add to your frontend `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 2. Standardized Response & Error Envelopes

### 2.1 List Endpoints Envelope
All listing endpoints return data wrapped in this envelope:
```json
{
  "items": [ ... ],
  "total": 42,
  "limit": 50,
  "offset": 0
}
```

### 2.2 Frozen Error Envelope
All error responses (4xx and 5xx) strictly follow this structure:
```json
{
  "error": {
    "code": "UNAUTHENTICATED",
    "message": "Invalid, expired, or revoked session token.",
    "details": null
  }
}
```
Common error codes:
- `UNAUTHENTICATED` (401)
- `NOT_FOUND` (404 — used for unauthorized/forbidden access to prevent discovery of hidden routes)
- `VALIDATION_ERROR` (422 — payload schema failure)
- `RATE_LIMITED` (429 — login attempt limit exceeded)
- `ALREADY_SUPERSEDED` (409 — attempting to supersede already superseded evidence)
- `UNSUPPORTED_MEDIA_TYPE` (415 — file does not match magic bytes for JPEG/PNG/PDF/CSV)
- `EMPTY_FILE` (400 — 0-byte upload rejected)

---

## 3. Demo Credentials & RBAC Matrix

| Role | Email | Password Reference | Allowed Portals / Scopes |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@terraledger.ai` | Configured via `DEMO_USER_PASSWORD` | Global internal workspace, publication, audits |
| **Project Developer** | `developer@panjdhara.com` | Configured via `DEMO_USER_PASSWORD` | Project-scoped workspace (`PRJ-PB-DSR-001`) |
| **Field Officer** | `officer@ludhiana-fpo.org` | Configured via `DEMO_USER_PASSWORD` | Field-scoped operations (`PB-FIELD-001`) |
| **Reviewer (VVB)** | `reviewer@vvb-auditor.org` | Configured via `DEMO_USER_PASSWORD` | Audit reviews, rule assessments, audit log |
| **Farmer** | `farmer@punjab-agri.in` | Configured via `DEMO_USER_PASSWORD` | Farmer portal, parcel `PB-FIELD-001` |
| **Buyer** | `buyer@auraclimate.com` | Configured via `DEMO_USER_PASSWORD` | Marketplace, commercial enquiries |

> **IMPORTANT ON RBAC & PASSWORDS:**
> - Plaintext passwords are NEVER stored in seed files; only salted scrypt hashes are persisted.
> - At seed generation time, demo accounts are created using the password provided in the `DEMO_USER_PASSWORD` environment variable.
> - The client token's `role` claim is purely informational.
> - The backend validates caller identity and resolves the live role directly from server storage on every request.
> - When an unauthorized role accesses a route (e.g. Buyer accessing `/api/evidence` or Farmer accessing `/api/audit`), the backend returns **404 NOT_FOUND** (not 403) to prevent endpoint enumeration.

---

## 4. Authentication Flow

### 4.1 Login / Session Creation
- **Endpoint:** `POST /api/auth/session`
- **Request:**
```json
{
  "email": "farmer@punjab-agri.in",
  "password": "<DEMO_USER_PASSWORD>"
}
```
- **Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
  "tokenType": "Bearer",
  "expiresInSeconds": 3600,
  "user": {
    "id": "USR-FAR-05",
    "email": "farmer@punjab-agri.in",
    "name": "Gurdev Singh Gill",
    "role": "farmer",
    "organization": "Gill Agro Farms",
    "buyerCompanyId": null,
    "assignedProjectIds": [],
    "assignedFieldIds": ["PB-FIELD-001"],
    "isDemo": true,
    "dataLabel": "Demo data"
  }
}
```

### 4.2 Making Authenticated Requests
Attach header:
```http
Authorization: Bearer <accessToken>
```

### 4.3 Get Authenticated Profile
- **Endpoint:** `GET /api/me`

---

## 5. Key Domain Endpoints Reference

### 5.1 Evidence Engine
- `GET /api/evidence?fieldId=PB-FIELD-001&includeSuperseded=false`
- `GET /api/evidence/{id}`
- `GET /api/evidence/{id}/history`
- `POST /api/evidence` (multipart upload)
  - Fields: `file` (binary), `fieldId`, `title`, `type` (`photo|satellite|document|log|sensor`), `category` (`supporting|contradicting|missing`), `capturedAt` (ISO UTC), `author`, `source`, `lat`, `lng`, `accuracyMeters`.
  - Server verifies magic bytes (JPEG `0xFFD8FF`, PNG `0x89504E47`, PDF `%PDF`, CSV text).
  - Server calculates raw binary SHA-256 and seals it into provenance.
- `POST /api/evidence/{id}/supersede` (multipart upload)
  - Fields: `file`, `reason`, `title`, `lat`, `lng`.
  - Atomically marks previous evidence as `superseded`.
  - Returns 409 if already superseded.

### 5.2 Deterministic MRV Engine & Assessments
- `POST /api/assessments/run`
  - Body: `{ "fieldId": "PB-FIELD-001", "seasonId": "KHARIF-2026", "triggerReason": "manual" }`
  - Evaluates rules R1 through R5 deterministically (no LLMs).
  - Status wire values: `"UNVERIFIED" | "NEEDS_REVIEW" | "READY_FOR_VERIFICATION"`.
  - Status labels: `"Unverified" | "Needs review" | "Ready for verification"`.
  - Note: `"Verified"` MUST NEVER appear as a project or assessment status!
- `GET /api/assessments?fieldId=PB-FIELD-001`
- `GET /api/assessments/{id}`

### 5.3 Auditor Reviews & Decisions
- `GET /api/reviews`
- `POST /api/reviews/{id}/decision`
  - Body:
```json
{
  "decision": "clarification_requested",
  "comment": "Geotag coordinate outside field parcel boundary.",
  "correctionRequest": "Please re-upload photo within boundary."
}
```
  - Allowed decisions: `"accepted" | "rejected" | "clarification_requested"`.
  - Automatically dispatches notifications to field officer/farmer.

### 5.4 Projects & Publication
- `GET /api/projects` (Internal workspace projects)
- `GET /api/projects/{id}`
- `POST /api/projects/{id}/publish` (Admin only)
  - Sets `isPublished: true` and logs audit event.

### 5.5 Buyer Marketplace (PII-Safe)
- `GET /api/marketplace`
  - Accessible to all buyers and public users.
  - Returns array of `BuyerProjectSummary`.
  - Guaranteed:
    - NO `farmerName`
    - NO `phone`
    - NO `farmerId`
    - NO `farmerCount`
    - `enrolledHectares` and `eligibleHectares` are separate nullable fields.
    - Prices and carbon estimates are `null` (never fabricated).
- `GET /api/buyer/projects/{id}`

### 5.6 Buyer Commercial Enquiries
- `POST /api/buyer/enquiries`
  - Body:
```json
{
  "projectId": "PRJ-PB-DSR-001",
  "volumeRequestedTons": 500.0,
  "targetRetirementYear": "2027",
  "message": "Interested in long-term Basmati rice carbon forward contract."
}
```
- `GET /api/buyer/enquiries` (Buyer's company enquiries)
- `GET /api/enquiries` (Internal workspace view of all buyer enquiries)

### 5.7 Satellite Intelligence
- `GET /api/satellite/observations`
- `GET /api/satellite/fields/{field_id}`
  - Reads Copernicus Sentinel-2 observations from Lead's dataset.
  - Gracefully returns `{ "items": [], "total": 0, "metadata": { "status": "no_data_available" } }` if data not yet provided.

### 5.8 Cryptographic Audit Log
- `GET /api/audit` (Admin and Reviewer only)
- `GET /api/audit/verify` (Admin and Reviewer only)
  - Returns `{ "valid": true, "error": null }`.
  - Verifies append-only SHA-256 hash chaining back to 64 zeros genesis block.

### 5.9 Deterministic Evidence Graph
- `GET /api/fields/{id}/graph` (Admin, Reviewer, Project Developer, Field Officer, Farmer [own parcel only])
- `GET /api/projects/{id}/graph` (Admin, Reviewer, Project Developer)
  - Returns DAG with deterministic node and edge ordering:
    - Nodes: `field`, `project`, `activity`, `evidence`, `satellite_observation`, `assessment`, `rule_result`, `review`.
    - Edges: `has_field`, `has_activity`, `supports`, `contradicts`, `supersedes`, `evaluated_by`, `resulted_in`, `reviewed_in`.
  - **Invariants:**
    - Superseded evidence is isolated: superseded nodes have a `supersedes` edge, but NEVER an active `supports` edge to any rule result.
    - Farmer privacy: when accessed by Farmer, review nodes and reviewer comments are strictly omitted, and farmer PII is redacted.
    - Buyer access: returns `404 NOT_FOUND`.

### 5.10 Terra Intelligence Explainer
- `POST /api/explanations`
  - Access: Admin, Reviewer, Project Developer (assigned), Field Officer (assigned). (Farmer and Buyer receive 404).
  - Request Body:
```json
{
  "assessmentId": "ASM-8C54680E",
  "question": "Explain assessment status and rule results"
}
```
  - Response Body:
```json
{
  "assessmentId": "ASM-8C54680E",
  "fieldId": "PB-FIELD-001",
  "status": "UNVERIFIED",
  "mode": "Template",
  "summary": "Assessment ASM-8C54680E for field PB-FIELD-001 has server status 'UNVERIFIED'...",
  "ruleBreakdowns": [ ... ],
  "citations": ["PB-FIELD-001", "R1_COMPLETENESS", "EV-2026-001"],
  "generatedAt": "2026-10-31T12:00:00Z"
}
```
  - **Mode Badges:** The frontend MUST display the truthful mode badge:
    - `"LLM"`: Generated by AI and passed 6-point deterministic verification (schema, citations, grounded numbers, status match, no forbidden words, at least 1 citation).
    - `"Cached"`: Fast retrieval from content-addressed SHA-256 cache.
    - `"Template"`: Deterministic rule-assembly fallback (offline/safe mode).
  - **Rate Limiting:** Maximum 10 requests / minute per user (`HTTP 429 RATE_LIMITED`).
  - **Audit Logging:** Every generation is logged in the hash-chain audit log with actor ID and cited IDs (full text is never logged).

---

## 6. Legacy Mock Behaviors to Drop

Please eliminate these legacy mock behaviors from the frontend when connecting to the API:
1. **Never fabricate carbon quantities:** Do not display invented values like `23.04 tCO2e`. When `estimatedTonsCo2ePerYear` is `null`, display `"Preliminary estimate: not computed"`.
2. **Never fabricate carbon prices:** Do not show `$32/tonne` or hardcoded prices. Indicative prices are `null` until accredited valuation.
3. **Never display "Verified" status:** The word `"Verified"` is strictly prohibited as a project or assessment status. Use `"Ready for verification"`, `"Needs review"`, or `"Unverified"`.
4. **Never show Farmer PII to Buyers:** In `/buyers/*`, never display farmer names, phone numbers, or farmer counts.
5. **Never hand-type SHA-256 hashes:** Hashes are computed server-side directly from raw uploaded file bytes.
