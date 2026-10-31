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

### Running the Development Server
```bash
python -m uvicorn backend.app.main:app --reload --port 8000
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
- **Append-Only Audit Log:** All events are cryptographically hashed using SHA-256 and chained into `backend/data/audit/audit.jsonl`.
