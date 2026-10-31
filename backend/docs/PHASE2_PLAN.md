# TerraLedger AI — Backend Phase 2 Implementation Plan

> **Scope:** Hardening (H1–H6), Evidence Graph (G), Terra Intelligence Explainer (`agent/` + T), and Resilience (R).  
> **Ownership Boundary:** Strictly `backend/**`, `agent/**`, `data/seed_evidence.json`, and `data/marketplace_seed.json`. No changes to `src/**`, `geo/**`, `package.json`, `routeTree.gen.ts`, or root `.gitignore`.  
> **Status:** Pending Review & Approval.

---

## 1. Architecture Overview & Milestone Breakdown

Phase 2 will be executed in four strict milestones, with tests run and verified after each milestone before proceeding:

```
[Phase 1 Baseline (28/28 tests passing)]
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ Milestone H: Hardening & Test Completeness             │
│ - H1: Secrets audit, scrypt hashes, no .env tracked    │
│ - H2: Sentinel-2 test fixture isolation under tests/   │
│ - H3: Cloud-cover constant (20.0%) & boundary tests    │
│ - H4: R1 and R5 individual missing/boundary tests      │
│ - H5: Dynamic SHA-256 for backend/data/seed_files/     │
│ - H6: Unified run conventions across CLI & docs       │
└────────────────────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ Milestone G: Deterministic Evidence Graph              │
│ - GET /api/fields/{field_id}/graph                     │
│ - GET /api/projects/{project_id}/graph                 │
│ - Deterministic node/edge builder (stable sorting)     │
│ - Superseded evidence isolation (no active rule link)  │
│ - PII redaction and strict role gating (buyers 404)    │
│ - Contract schema, sample JSON, and tests              │
└────────────────────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ Milestone T: Terra Intelligence Explainer              │
│ - Pure logic in agent/ (read-only, no write methods)   │
│ - POST /api/explanations                               │
│ - Strict pipeline: Context -> Cache -> LLM -> Template │
│ - 6-point output validator (hallucination guard)       │
│ - Content-addressed SHA-256 cache & CLI warm-cache     │
│ - Truthful mode badge: "LLM" | "Cached" | "Template"   │
│ - Comprehensive safety & prompt-injection tests        │
└────────────────────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ Milestone R: Resilience, Smoke Script & Docs           │
│ - Demo smoke script: backend/scripts/demo_smoke.py     │
│ - Resilience tests (LLM off, network timeout, etc.)    │
│ - Update frontend-handoff.md, rules.md, README.md      │
│ - Regenerate openapi.json and sample JSON contracts    │
└────────────────────────────────────────────────────────┘
```

---

## 2. Milestone H — Hardening (Specification & Plan)

### H1. Secrets & Credentials Hardening
- **Target:** Verify `backend/data/seed/users.json` contains only salted scrypt hashes. Confirm that no plaintext password exists in seed files.
- **Action:**
  - Audit `users.json`: all entries must use 128-char scrypt hex digests.
  - In `backend/.env.example`: add documentation for `DEFAULT_SEED_PASSWORD=...` explaining that during seed re-generation, demo passwords are read from the environment or default securely.
  - In `backend/docs/frontend-handoff.md` and `README.md`: replace literal curl passwords with placeholders (`$DEMO_PASSWORD` or reference to the credentials table) to avoid hardcoding credentials in copy-paste blocks.
  - Confirm with `git ls-files` that no `.env` file is tracked.

### H2. Satellite Provenance Isolation
- **Target:** Ensure the Sentinel-2 observation used in tests exists *only* as a clearly labelled test fixture.
- **Action:**
  - Create directory: `backend/tests/fixtures/`.
  - Store observation fixture at: `backend/tests/fixtures/sentinel2_observation_fixture.json`.
  - Verify that `data/observations.json` does not exist in repo root and that no synthetic observations exist in runtime or seed folders.
  - If `settings.LEAD_OBSERVATIONS_PATH` does not exist on disk, the application returns `{ "items": [], "total": 0, "metadata": { "status": "no_data_available" } }` without crashing.

### H3. Cloud-Cover Threshold Formalization
- **Target:** Move the 20% cloud-cover threshold into constants and document as pending team confirmation.
- **Action:**
  - In `backend/app/core/constants.py`: add `CLOUD_COVER_MAX_PERCENT: float = 20.0`.
  - In `backend/docs/rules.md`: document `CLOUD_COVER_MAX_PERCENT = 20.0` with the badge `> **STATUS: PENDING TEAM CONFIRMATION**`.
  - In `backend/tests/test_rules.py`: add explicit boundary tests:
    - Cloud cover = `20.0%` -> `PASS`
    - Cloud cover = `20.01%` -> `WARN`

### H4. Missing Test Suites for R1 & R5
- **Action:**
  - Create `backend/tests/test_rules_comprehensive.py`:
    - **R1 Breakdown:** Test each missing element individually:
      1. Missing farmer field declaration -> `FAIL` (reports "Farmer Field Declaration")
      2. Missing in-situ photo -> `FAIL` (reports "In-situ Practice Photograph")
      3. Missing activity log -> `FAIL` (reports "Field Activity Log")
      4. Missing weather record -> `FAIL` (reports "Weather Record")
      5. Missing satellite observation -> `FAIL` (reports "Satellite Observation")
    - **R5 Breakdown:**
      1. Missing observations file -> `FAIL` ("observations file ... not found")
      2. Observations file exists but no matching field ID -> `FAIL` ("No satellite observations exist for field")
      3. Observation date within 10 days -> `PASS`
      4. Observation date at 11 days -> `FAIL` (boundary check)
      5. Cloud cover at 20.0% -> `PASS`
      6. Cloud cover at 20.01% -> `WARN`

### H5. Real Seed Evidence Files with Load-Time SHA-256
- **Target:** Small realistic demonstration files in `backend/data/seed_files/` with dynamic SHA-256 calculation.
- **Action:**
  - Create `backend/data/seed_files/`:
    - `seed_field_photo_drift.jpg` (valid JPEG header: `0xFFD8FF...`)
    - `seed_field_photo_verified.jpg` (valid JPEG header: `0xFFD8FF...`)
    - `seed_irrigation_log.csv` (valid CSV content)
    - `seed_declaration.pdf` (valid PDF header: `%PDF-1.4...`)
  - Update `EvidenceRepository._initialize()` or seed loader: compute `sha256_bytes(open(path, 'rb').read())` at load time rather than using pre-typed hash strings.

### H6. Single Unified Run Convention
- Standardize throughout `README.md`, `frontend-handoff.md`, and `cli.py`:
  - Run server: `uvicorn backend.app.main:app --port 8000`
  - Run test suite: `python -m pytest backend/tests -v`
  - Reset demo state: `python -m backend.app.cli reset-demo`

---

## 3. Milestone G — Evidence Graph (Specification & Plan)

### 3.1 Endpoints
- `GET /api/fields/{field_id}/graph` — Generates evidence lineage graph for a specific field parcel.
- `GET /api/projects/{project_id}/graph` — Generates evidence lineage graph across all parcels in a project.

### 3.2 Authorization & RBAC
- **Admin & Reviewer:** Unrestricted access.
- **Project Developer:** Allowed for assigned projects/fields.
- **Field Officer:** Allowed for assigned fields.
- **Farmer:** Allowed only for assigned fields; farmer PII is restricted.
- **Buyer:** Returns `404 NOT FOUND` (never 403, preventing resource discovery).

### 3.3 Data Contracts & Schemas
Add to `backend/app/schemas/graph.py`:

```python
class GraphNodeType(str, Enum):
    PROJECT = "project"
    FIELD = "field"
    SEASON = "season"
    ACTIVITY = "activity"
    EVIDENCE = "evidence"
    SATELLITE_OBSERVATION = "satellite_observation"
    RULE_RESULT = "rule_result"
    REVIEW = "review"
    ASSESSMENT = "assessment"

class GraphRelation(str, Enum):
    HAS_FIELD = "has_field"
    HAS_ACTIVITY = "has_activity"
    SUPPORTS = "supports"
    CONTRADICTS = "contradicts"
    SUPERSEDES = "supersedes"
    EVALUATED_BY = "evaluated_by"
    RESULTED_IN = "resulted_in"
    REVIEWED_IN = "reviewed_in"

class GraphNode(BaseSchema):
    id: str
    type: GraphNodeType
    label: str
    status: Optional[str] = None
    is_demo: bool = Field(default=True, alias="isDemo")
    data_label: str = Field(default="Demo data", alias="dataLabel")
    meta: Dict[str, Any] = Field(default_factory=dict)

class GraphEdge(BaseSchema):
    id: str
    source: str
    target: str
    relation: GraphRelation

class EvidenceGraphResponse(BaseSchema):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    generated_at: str = Field(..., alias="generatedAt")
    assessment_id: Optional[str] = Field(default=None, alias="assessmentId")
```

### 3.4 Graph Generation Rules
1. **Zero Hallucination:** Nodes and edges are instantiated exclusively from persisted records in `fields.json`, `activities.json`, `evidence.json`, `assessments.json`, `reviews.json`, and fixture `observations.json`.
2. **Determinism:** `nodes` are stably sorted by `(type, id)` and `edges` by `id`. Given identical data, the resulting JSON is character-for-character deterministic.
3. **Supersession Isolation:**
   - Superseded evidence has node `status: "superseded"`.
   - Edge: `(new_evidence) -[supersedes]-> (old_evidence)`.
   - **Crucial Rule:** Superseded evidence has NO outgoing `supports` edges to any `rule_result` node.
4. **PII Redaction:** `label` and `meta` redact farmer name and contact info when requested by unprivileged roles.

---

## 4. Milestone T — Terra Intelligence Explainer (Specification & Plan)

### 4.1 Package Layout (`agent/` + route)
```
agent/
├── __init__.py          # Exports TerraExplainer, ExplainerContext, ExplainerMode
├── context.py           # Extracts and sanitizes context from DB (read-only)
├── prompts.py           # System prompts, few-shot templates, instructions
├── validator.py         # 6-point strict hallucination validation engine
├── cache.py             # Deterministic SHA-256 content-addressed cache
├── template.py          # Deterministic string-assembly fallback (zero AI)
└── explainer.py         # Pipeline orchestrator
backend/
└── app/
    └── api/
        └── routes/
            └── explanations.py  # POST /api/explanations
```

### 4.2 Endpoint Contract
- **Route:** `POST /api/explanations`
- **Request Body:**
```json
{
  "scopeType": "field",
  "scopeId": "PB-FIELD-001",
  "question": "Why is this field parcel marked Needs Review?"
}
```
- **Response Body:**
```json
{
  "id": "EXP-A1B2C3D4",
  "answer": "Field PB-FIELD-001 is currently in Needs review status due to an advisory warning on Rule R3 (Photo Spatial Proximity). Photograph EV-2026-001 was captured at a distance of 420.0m outside the parcel boundary...",
  "mode": "Template",
  "citations": [
    { "type": "rule", "id": "R3_PHOTO_DISTANCE" },
    { "type": "evidence", "id": "EV-2026-001" }
  ],
  "assessmentId": "ASM-2026-001",
  "rulesetVersion": "1.0.0-deterministic",
  "generatedAt": "2026-10-31T15:00:00Z",
  "notice": "Terra Intelligence explanations are assistive summaries for operational review. Status determinations are strictly computed by deterministic rules."
}
```

### 4.3 Pipeline Execution Sequence (Always in This Order)
```
1. Build Context
   - Fetch Assessment, RuleResults, Evidence metadata, Satellite observations
   - Redact all farmer PII
   - Treat descriptions, notes, and filenames as DATA (never prompt instructions)
   - Truncate text fields to max 250 chars

2. Check LLM Enabled
   - If settings.APP_LLM_ENABLED is False or APP_LLM_API_KEY is empty:
     -> Jump to Step 4 (Cache/Template)

3. LLM Generation & Strict Validation
   - Dispatch to configured LLM (via httpx) with strict system prompt
   - Parse JSON response
   - Run 6-Point Validator:
     [1] Strict schema match
     [2] Every citation ID exists in context
     [3] Every number in answer exists in context (distances, counts, dates)
     [4] Stated assessment status matches server status
     [5] Forbidden words absent (verified, certified, audited, guaranteed, minted)
     [6] At least one citation present
   - If ANY check fails -> Discard LLM response immediately, fall back to Step 4

4. Content-Addressed Cache
   - Key: sha256(assessment_id + ruleset_version + sha256(canonical_context) + normalized_question)
   - If key found in cache -> return answer with mode="Cached"

5. Deterministic Template Fallback
   - Assemble answer deterministically from rule results & evidence
   - Cites rule IDs and evidence IDs
   - States server status and remaining requirements ("Independent field visit")
   - Mode="Template"
```

### 4.4 Immutability & Safety Guarantee
- The `agent/` package is **strictly read-only**:
  - No imports of repository `insert`, `create`, `update`, `delete`, or `record_status_transition`.
  - No imports of rules evaluator status setters.
  - An automated AST-based inspection test will enforce this architectural invariant.
- Audit logging:
  - Logs `action="explanation.generated"`, `entity_type="EXPLANATION"`, `entity_id=exp.id`.
  - Audits `mode` and `citation_ids`.
  - **Does NOT store full free text in the audit log** (protecting log integrity and privacy).

---

## 5. Milestone R — Resilience & Smoke Testing

### 5.1 Demo-Day Smoke Script (`backend/scripts/demo_smoke.py`)
A self-contained script executing 5 sequential checks against a live or test server:
1. `GET /api/health` -> Verify status `ok`
2. `POST /api/auth/session` -> Verify token generation
3. `POST /api/assessments/run` -> Verify deterministic rule evaluation
4. `GET /api/fields/PB-FIELD-001/graph` -> Verify evidence graph generation
5. `POST /api/explanations` -> Verify Template-mode explanation and citations

Prints formatted `[PASS]` / `[FAIL]` indicators and exits with code 0 on complete pass.

### 5.2 Resilience Tests (`backend/tests/test_resilience.py`)
- LLM API offline / timeout simulation -> clean fallback to Template (HTTP 200).
- Corrupted observations JSON -> graceful degradation.
- Upload boundary stress tests (truncated payloads, oversized buffers).
- Error envelope uniformity across all failure modes.

---

## 6. Detailed File Modification & Creation Plan

| File Path | Action | Description / Purpose |
| :--- | :--- | :--- |
| `backend/docs/PHASE2_PLAN.md` | Create | Master Phase 2 blueprint and contracts. |
| `backend/app/core/constants.py` | Edit | Add `CLOUD_COVER_MAX_PERCENT = 20.0`. |
| `backend/app/core/config.py` | Edit | Add explainer settings (`APP_LLM_ENABLED`, `APP_LLM_API_KEY`, etc.). |
| `backend/data/seed_files/*` | Create | Binary test files for JPEG, CSV, PDF. |
| `backend/tests/fixtures/sentinel2_observation_fixture.json` | Create | Isolated test observation fixture. |
| `backend/app/schemas/graph.py` | Create | Node, Edge, and Graph schemas. |
| `backend/app/services/graph_service.py` | Create | Deterministic evidence graph generator. |
| `backend/app/api/routes/graphs.py` | Create | `/api/fields/{id}/graph` & `/api/projects/{id}/graph`. |
| `agent/__init__.py` | Create | Explainer agent entry point. |
| `agent/context.py` | Create | Context builder and prompt-injection sanitizer. |
| `agent/prompts.py` | Create | System prompts with citation and truth constraints. |
| `agent/validator.py` | Create | 6-point hallucination and citation validator. |
| `agent/cache.py` | Create | Content-addressed SHA-256 cache. |
| `agent/template.py` | Create | Deterministic fallback string builder. |
| `agent/explainer.py` | Create | Pipeline orchestrator. |
| `backend/app/api/routes/explanations.py` | Create | `POST /api/explanations`. |
| `backend/app/api/router.py` | Edit | Mount graph and explanation routers. |
| `backend/app/cli.py` | Edit | Add `warm-cache` command. |
| `backend/scripts/demo_smoke.py` | Create | Demo-day smoke test script. |
| `backend/tests/test_rules_comprehensive.py` | Create | R1/R5 breakdown & cloud cover boundary tests. |
| `backend/tests/test_graph.py` | Create | Evidence graph determinism and scoping tests. |
| `backend/tests/test_explainer.py` | Create | Safety, validation, injection, and AST immutability tests. |
| `backend/tests/test_resilience.py` | Create | Resilience, timeout, and degradation tests. |
| `backend/docs/frontend-handoff.md` | Edit | Add graph and explainer documentation. |
| `backend/docs/rules.md` | Edit | Document R5 cloud cover threshold status. |
| `backend/README.md` | Edit | Update operational commands and architecture notes. |
| `backend/docs/contracts/openapi.json` | Edit | Regenerated OpenAPI spec. |
| `backend/docs/contracts/samples/evidence_graph.json` | Create | Sample graph contract. |
| `backend/docs/contracts/samples/explanation.json` | Create | Sample explanation contract. |

---

## 7. Open Decisions Proposed for Confirmation

1. **Explainer Scope:**
   - Supported scopes: `"field"`, `"project"`, `"assessment"`.
   - Default question fallback: If question is empty or generic ("explain status"), the system explains the latest assessment status and outstanding verification items.
2. **LLM Provider Compatibility:**
   - Designed to support standard HTTP endpoints (e.g. Gemini API or OpenAI chat completions format) with clean fallback if unconfigured.
3. **Cache Storage Location:**
   - Persisted to `backend/data/runtime/explainer_cache.json` (gitignored), ensuring restarts preserve warmed cache without external caching services.

---

> **Awaiting Approval:** Please review the plan above. Upon your "go", implementation will commence with Milestone H (Hardening).
