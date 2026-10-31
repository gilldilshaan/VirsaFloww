# TCC OS  Supabase PostgreSQL + PostGIS Migration Progress Log

**Repository:** `gilldilshaan/VirsaFloww`  
**Branch:** `feature/supabase-postgres-migration`  
**Execution Environment:** Windows PowerShell, Python 3.13.2  
**Target Database Provider:** Supabase-hosted PostgreSQL 17.11 with PostGIS 3.3  
**Production Project Ref:** `qexekqcgiclylksgwkes` (eu-west-1, AWS session pooler port 5432)  
**Test Project Ref:** `vlsvyqmtuqgtfkeodbay` (eu-west-3, AWS-1 session pooler port 5432)  
**Started:** 2026-10-31T20:30:00+05:30  

---

## 1. Phase Status Summary Table

| Phase | Description | Status | Started | Completed | Notes / Test Results |
|---|---|---|---|---|---|
| **Phase 0** | Pre-flight Baseline & Verification | **DONE** | 2026-10-31 20:30 | 2026-10-31 20:40 | 52/52 baseline tests pass. Branch verified. |
| **Phase 1** | Foundation: Config, Models & Migrations (TEST DB) | **DONE** | 2026-10-31 20:40 | 2026-10-31 20:50 | 13 tables created, RLS enabled on all, downgrade/upgrade verified, 52/52 baseline tests pass. |
| **Phase 2** | PostgreSQL Repositories (TEST DB) | **PENDING** | - | - | - |
| **Phase 3** | Evidence & Audit Immutability Guarantees (TEST DB) | **PENDING** | - | - | - |
| **Phase 4** | JSON-to-PostgreSQL Migration CLI & Reconciliation | **PENDING** | - | - | - |
| **Phase 5** | Full Verification, Dual-Mode Testing & Documentation | **PENDING** | - | - | - |
| **Phase P** | Production Database Setup (Gated) | **PENDING** | - | - | Requires explicit precondition sign-off. |
| **Phase G** | GitHub Push & PR Submission | **PENDING** | - | - | Final verification & delivery. |

---

## 2. Safety Rails & Isolation Verification Checklist

- [x] **SR1 - Credential Safety:** Credentials read only from `backend/.env`. All passwords, tokens, and raw URLs masked in all outputs, logs, and artifacts (`postgresql+psycopg://postgres.<ref>:***@<host>:5432/postgres`).
- [x] **SR2 - Project Reference Isolation Guard:** Both URLs parsed using SQLAlchemy/urllib URL parsers. Refs compared: `qexekqcgiclylksgwkes` (prod) != `vlsvyqmtuqgtfkeodbay` (test). Ref check passes.
- [x] **SR3 - Test Database Isolation:** All DDL, DML, destructive tests, and schema migrations run against TEST DB (`vlsvyqmtuqgtfkeodbay`) only.
- [x] **SR4 - Code-Level Production Guard:** Enforced via `CONFIRM_PRODUCTION_WRITE="I_APPROVE_PRODUCTION_WRITE"`. Without this environment variable, all write commands and migrations against `DATABASE_URL` refuse execution with exit code 1.
- [x] **SR5 - Git Isolation:** Feature branch `feature/supabase-postgres-migration` active. `main` is never touched.
- [x] **SR6 - Code Ownership Boundary:** Editing strictly limited to `backend/**`, `agent/**` (persistence compatibility only), `data/seed_evidence.json`, and `data/marketplace_seed.json`. No changes to `src/**`, `geo/**`, `package.json`, `routeTree.gen.ts`, or root `.gitignore`.
- [x] **SR7 - Strict Business Logic Preservation:** Frozen rule logic R1-R5, endpoint routes, camelCase schemas, response shapes `{items, total, limit, offset}`, and 404/403 contracts preserved verbatim.
- [x] **SR8 - Truth in Data & Audit Logging:** No synthetic or fabricated claims. Unedited command outputs logged. SHA-256 canonical JSON hash chain intact.

---

## 3. Ambiguities & Decisions Log

1. **Test Project Pooler Host Resolution:**
   - *Observation:* In `backend/.env`, `TEST_DATABASE_URL` contained `aws-0-REGION.pooler.supabase.com`.
   - *Investigation:* Project `vlsvyqmtuqgtfkeodbay` is a valid, active Supabase project provisioned in `eu-west-3`. Its session pooler is located at `aws-1-eu-west-3.pooler.supabase.com:5432`.
   - *Decision (Conservative):* To strictly obey Safety Rail 1 ("Do not modify backend/.env"), `backend/.env` is NOT modified. Instead, `backend/app/core/config.py` normalizes `aws-0-REGION.pooler.supabase.com` to `aws-1-eu-west-3.pooler.supabase.com` for `vlsvyqmtuqgtfkeodbay` at runtime.
   - *Status:* **RESOLVED**.

2. **Single-Role Architecture vs Supabase Roles:**
   - *Context:* Supabase manages permissions via PostgreSQL roles (`postgres`, `anon`, `authenticated`, `service_role`).
   - *Decision:* Application connects as administrative user `postgres`. RLS is enabled on all application tables with ZERO policies for `anon` or `authenticated`. All privileges (`SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER`) are revoked from `anon` and `authenticated`. `FORCE ROW LEVEL SECURITY` is NOT used, ensuring table owner `postgres` has direct backend access while PostgREST / Supabase Data API access from client keys is blocked.
   - *Status:* **RESOLVED**.

3. **Coordinate Ordering & Polygon Topology:**
   - *Context:* Seed JSON files store `boundaryPolygon` as `[latitude, longitude]`. PostGIS expects `(longitude, latitude)`.
   - *Decision:* Storage repository and migration CLI convert coordinates `(lat, lon) -> (lon, lat)`, close the polygon ring (`p[0] == p[-1]`), and execute `ST_IsValid` validation. Original `boundaryPolygon` is preserved verbatim in the `payload` JSONB column.
   - *Status:* **RESOLVED**.

---

## 4. Raw Diagnostic Verification Output

### Command:
```powershell
python scratch/diagnose_supabase.py
```

### Unedited Output:
```text
--- SAFETY GUARD: COMPARING PROJECT REFERENCES ---
Production Project Ref: qexekqcgiclylksgwkes
Test Project Ref:       vlsvyqmtuqgtfkeodbay
[PASS] Project references are distinct. Proceeding with read-only diagnostics.

============================================================
 DIAGNOSING: PRODUCTION (DATABASE_URL)
============================================================
Target URL (Masked): postgresql+psycopg://postgres.qex...:***@aws-0-eu-wes...:5432/postgres
Port: 5432
Project Reference: qexekqcgiclylksgwkes
[SUCCESS] Connection established!
  - PostgreSQL Version: PostgreSQL 17.11 on aarch64-unknown-linux-gnu, compiled by gcc (GCC) 15.2.0, 64-bit
  - Current Database: postgres
  - Current User: postgres
  - Server Port in use: 5432
  - PostGIS Installed: True
  - PostGIS Extension Schema: extensions
  - PostGIS Version: 3.3 USE_GEOS=1 USE_PROJ=1 USE_STATS=1
  - Geometry Type Schema: extensions
  - Public Schema Tables (0): []

============================================================
 DIAGNOSING: TEST (TEST_DATABASE_URL)
============================================================
Target URL (Masked): postgresql+psycopg://postgres.vls...:***@aws-1-eu-wes...:5432/postgres
Port: 5432
Project Reference: vlsvyqmtuqgtfkeodbay
[SUCCESS] Connection established!
  - PostgreSQL Version: PostgreSQL 17.11 on x86_64-pc-linux-gnu, compiled by gcc (GCC) 15.2.0, 64-bit
  - Current Database: postgres
  - Current User: postgres
  - Server Port in use: 5432
  - PostGIS Installed: True
  - PostGIS Extension Schema: extensions
  - PostGIS Version: 3.3 USE_GEOS=1 USE_PROJ=1 USE_STATS=1
  - Geometry Type Schema: extensions
  - Public Schema Tables (0): []

[READY] Diagnostics complete. Both databases are reachable and isolated.
```
