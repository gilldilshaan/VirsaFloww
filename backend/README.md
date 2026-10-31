# TerraLedger AI — Python Backend Service

**Service:** Agricultural MRV Evidence Engine & REST API  
**Language:** Python 3.11+ (Validated on Python 3.13)  
**Framework:** FastAPI, Pydantic v2, Uvicorn  

---

> [!WARNING]
> ### DEV AUTH — SPRINT-GRADE DEMONSTRATION AUTHENTICATION
> The authentication and authorization mechanisms implemented in this backend are designed strictly for **sprint demonstration and internal contract verification**. This system is **NOT PRODUCTION READY**. Do not expose this service to the public internet without replacing the session engine with an enterprise OIDC/OAuth2 identity provider.

---

## 1. Quickstart & Execution Commands

### Prerequisites
- Python 3.11+ installed.

### Installation
```bash
# From repository root or backend/
python -m venv backend/venv
# Windows
.\backend\venv\Scripts\activate
# Linux/macOS
source backend/venv/bin/activate

# Install pinned dependencies
python -m pip install -r backend/requirements.txt
```

### Running the Development Server (Recommended PowerShell Script)
The repository includes a dedicated development launcher (`backend/scripts/dev_start.ps1`) that automatically activates `.venv`, detects and frees port 8000 by terminating any stale process tree, and launches Uvicorn on `127.0.0.1:8000`:

```powershell
# Standard run from repository root:
.\backend\scripts\dev_start.ps1

# Run with auto-reload enabled:
.\backend\scripts\dev_start.ps1 -Reload
```

Alternatively, run Uvicorn directly:
```bash
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```
- Interactive Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- OpenAPI Specification: [http://localhost:8000/api/openapi.json](http://localhost:8000/api/openapi.json)

### Running Automated Test Suite
```bash
# Run all backend tests
python -m pytest backend/tests -v
```

### Running the End-to-End Demo Smoke Script
```bash
# Set your demo password in env, then run smoke test
$env:DEMO_USER_PASSWORD="YourPassword123"
python backend/scripts/demo_smoke.py
```

### CLI Utilities (`backend/app/cli.py`)
```bash
# Restores all runtime JSON repositories to baseline seeds (demo mode only)
python -m backend.app.cli reset-demo

# Updates seed users password hashes from DEMO_USER_PASSWORD env variable
python -m backend.app.cli reseed-users

# Populates explainer cache with pre-validated explanations for demo assessments
python -m backend.app.cli warm-cache
```

---

## 2. Seed Demo Accounts & Roles

Demo accounts are pre-configured in `backend/data/seed/users.json` using salted scrypt hashes (no plaintext passwords are stored). At seed time, passwords are read from the `DEMO_USER_PASSWORD` environment variable (documented in `backend/.env.example`).

| Role | Email | Password Source | Primary Permissions |
| :--- | :--- | :--- | :--- |
| `admin` | `admin@terraledger.ai` | `env: DEMO_USER_PASSWORD` | Full internal access, audit log read, publication approval |
| `project_developer` | `developer@panjdhara.com` | `env: DEMO_USER_PASSWORD` | Assigned projects, fields, evidence, assessments, enquiries |
| `field_officer` | `officer@ludhiana-fpo.org` | `env: DEMO_USER_PASSWORD` | Assigned fields, evidence submissions, visit notes |
| `reviewer` | `reviewer@vvb-auditor.org` | `env: DEMO_USER_PASSWORD` | Review queue, evidence auditing, assessment attestation |
| `farmer` | `farmer@punjab-agri.in` | `env: DEMO_USER_PASSWORD` | Own field, activity logs, evidence uploads, notifications |
| `buyer` | `buyer@auraclimate.com` | `env: DEMO_USER_PASSWORD` | Buyer-safe marketplace projections, own company enquiries |

---

## 3. Truth Invariants

- **No Fabricated Satellite Measurements:** Real Sentinel-2 observations are loaded from Lead's `data/observations.json`. If missing, the backend returns empty observation lists with clear meta status; it never synthesizes NDVI/NDWI.
- **No Fabricated Financials / Carbon:** Carbon reduction estimates and $/tonne prices are set to `null` with `"Preliminary estimate: not computed"`.
- **Immutable Evidence:** Evidence items cannot be deleted or updated in place. Supersession creates a new record and appends a status transition event.
- **Append-Only Audit Log:** All events are cryptographically hashed using SHA-256 and chained into `backend/data/audit/audit.jsonl` (or the `audit_events` and `audit_chain_head` tables in PostgreSQL mode).

---

## 4. PostgreSQL + PostGIS Persistence Architecture (Supabase)

The backend supports dual-mode persistence controlled by `STORAGE_BACKEND`:
- `STORAGE_BACKEND=json` (default): Uses file-based JSON storage under `backend/data/runtime/` and append-only JSONL audit logs.
- `STORAGE_BACKEND=postgres`: Connects to Supabase-hosted PostgreSQL 17.11 with PostGIS 3.3.

### Connection Architecture & Pooler Requirements
- **Session Pooler (Port 5432 Required):** Connections must target the Supabase AWS Session Pooler on port `5432` (`aws-0-REGION.pooler.supabase.com:5432` or `aws-1-REGION.pooler.supabase.com:5432`) with `sslmode=require`.
- **Transaction Pooler Rejection:** The transaction pooler on port `6543` is explicitly rejected at initialization because prepared statements, session-level variables, and row-level locking (`SELECT ... FOR UPDATE`) are incompatible with transaction pooling.
- **Search Path:** Configured with `search_path=public,extensions` to resolve PostGIS spatial functions and geometry types cleanly.

### Single-Role Database Security Model
- **Role Isolation:** The FastAPI backend connects using the administrative `postgres` user.
- **Zero-Policy Row-Level Security (RLS):** RLS is enabled on all 13 application tables with ZERO policies for Supabase's `anon` and `authenticated` roles.
- **Privilege Revocation:** All permissions (`SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER`) are revoked from `anon` and `authenticated` roles. This prevents external API keys, PostgREST, or the Supabase client SDK from accessing application data.
- **Table Owner Direct Access:** As the table owner, the backend `postgres` user retains direct, unbypassed access without requiring `FORCE ROW LEVEL SECURITY`.

### Database Immutability & Cryptographic Audit Guarantees
- **Evidence Immutability Trigger (`trg_evidence_immutability`):** Database engine-level trigger that strictly blocks SQL `DELETE` and blocks `UPDATE` on all 12 metadata columns (`id`, `field_id`, `activity_id`, `title`, `type`, `category`, `captured_at`, `submitted_at`, `submitter_id`, `sha256`, `supersedes_id`, `is_demo`). Only `status` and `payload` transitions are permitted.
- **Audit Event Immutability Trigger (`trg_audit_events_immutability`):** Strictly rejects all `UPDATE` and `DELETE` operations on `audit_events`.
- **Audit Chain Singleton (`audit_chain_head`):** Tracks `last_sequence_num` and `last_event_hash`. Concurrency is protected using `SELECT ... FOR UPDATE WHERE id=1`, guaranteeing a single, linear, unforked SHA-256 canonical JSON hash chain even under high-concurrency workloads.

### Database Operations & Migrations

#### Alembic Schema Migrations
```bash
# Apply schema migrations to TEST database
alembic -c backend/alembic.ini upgrade head

# Downgrade schema on TEST database
alembic -c backend/alembic.ini downgrade base

# Production execution is strictly gated behind confirmation:
# $env:CONFIRM_PRODUCTION_WRITE="I_APPROVE_PRODUCTION_WRITE"
# alembic -c backend/alembic.ini -x target=production upgrade head
```

#### JSON-to-PostgreSQL Data Migration CLI
```bash
# Dry-run validation against TEST database (rolls back transaction, writes 0 rows)
python -m backend.app.cli migrate-json-to-postgres --dry-run --target test

# Apply idempotent migration to TEST database
python -m backend.app.cli migrate-json-to-postgres --apply --target test

# Production migration (strictly gated behind confirmation):
# $env:CONFIRM_PRODUCTION_WRITE="I_APPROVE_PRODUCTION_WRITE"
# python -m backend.app.cli migrate-json-to-postgres --apply --target production
```

