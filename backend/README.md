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

### Resetting Demo State
```bash
# Restores all runtime JSON repositories to baseline seeds (demo mode only)
python -m backend.app.cli reset-demo
```

---

## 2. Seed Demo Accounts & Roles

Each demo role has a pre-configured account for testing:

| Role | Email | Demo Password | Primary Permissions |
| :--- | :--- | :--- | :--- |
| `admin` | `admin@terraledger.ai` | `admin12345` | Full internal access, audit log read, publication approval |
| `project_developer` | `developer@panjdhara.com` | `dev12345` | Assigned projects, fields, evidence, assessments, enquiries |
| `field_officer` | `officer@ludhiana-fpo.org` | `officer12345` | Assigned fields, evidence submissions, visit notes |
| `reviewer` | `reviewer@vvb-auditor.org` | `reviewer12345` | Review queue, evidence auditing, assessment attestation |
| `farmer` | `farmer@punjab-agri.in` | `farmer12345` | Own field, activity logs, evidence uploads, notifications |
| `buyer` | `buyer@auraclimate.com` | `buyer12345` | Buyer-safe marketplace projections, own company enquiries |

---

## 3. Truth Invariants

- **No Fabricated Satellite Measurements:** Real Sentinel-2 observations are loaded from Lead's `data/observations.json`. If missing, the backend returns empty observation lists with clear meta status; it never synthesizes NDVI/NDWI.
- **No Fabricated Financials / Carbon:** Carbon reduction estimates and $/tonne prices are set to `null` with `"Preliminary estimate: not computed"`.
- **Immutable Evidence:** Evidence items cannot be deleted or updated in place. Supersession creates a new record and appends a status transition event.
- **Append-Only Audit Log:** All events are cryptographically hashed using SHA-256 and chained into `backend/data/audit/audit.jsonl`.
