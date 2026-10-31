# TCC OS — Supabase PostgreSQL + PostGIS Migration Report

**Product:** The Carbon Credit OS (VirsaFloww / TerraLedger AI)  
**Company:** Panjdhara Private Limited  
**Repository:** `gilldilshaan/VirsaFloww`  
**Branch:** `feature/supabase-postgres-migration`  
**Execution Environment:** Windows PowerShell, Python 3.13.2  
**Database Provider:** Supabase-hosted PostgreSQL 17.11 with PostGIS 3.3  
**Date:** 2026-10-31  

---

## 1. Executive Summary

This engineering mission successfully transitioned the persistence foundation of the VirsaFloww / TerraLedger AI backend from local JSON-file storage to production-grade PostgreSQL 17.11 with PostGIS 3.3 hosted on Supabase.

The migration strictly preserves all existing API contracts, camelCase response schemas, frozen verification rules (R1–R5), and truth-in-data standards. It introduces database-level immutability enforcement, cryptographic audit chaining, geospatial indexing via PostGIS geometries, and a zero-trust single-role security model designed to neutralize Supabase client key exposure risks.

The test suite expanded from **52 baseline tests to 73 fully automated tests**, with 100% pass rate covering unit logic, PostgreSQL CRUD repositories, database triggers, 20-thread concurrency contention, security boundaries, and full end-to-end API integration.

---

## 2. Target Database Environments & Isolation

Two completely independent, isolated Supabase projects were utilized:

| Environment | Supabase Project Ref | Region | Pooler Host & Port | Isolation & Safety Controls |
| :--- | :--- | :--- | :--- | :--- |
| **Production** | `qexekqcgiclylksgwkes` | `eu-west-1` | `aws-0-eu-west-1.pooler.supabase.com:5432` | Gated behind `CONFIRM_PRODUCTION_WRITE="I_APPROVE_PRODUCTION_WRITE"`. Zero unconfirmed writes. |
| **Test** | `vlsvyqmtuqgtfkeodbay` | `eu-west-3` | `aws-1-eu-west-3.pooler.supabase.com:5432` | Dedicated target for all DDL, DML, migration runs, and automated test suites. |

### Isolation Verification
- Both project references were verified to be distinct strings (`qexekqcgiclylksgwkes` != `vlsvyqmtuqgtfkeodbay`).
- Direct connection pooler port `5432` (session pooler) with `sslmode=require` is enforced; transaction pooler port `6543` is explicitly rejected.
- All credentials are read strictly from `backend/.env` with raw passwords and connection strings masked in all logs and outputs.

---

## 3. Database Schema & PostGIS Implementation

The database schema was implemented using SQLAlchemy 2.x declarative models and versioned via Alembic migration `0001_initial_schema`.

### 13 Application Tables

1. `users`: Administrative and role accounts (`admin`, `project_developer`, `field_officer`, `reviewer`, `farmer`, `buyer`) storing scrypt password hashes and JSONB metadata.
2. `projects`: Operational MRV projects with district, practice, publication status, and developer references.
3. `farmers`: Farmer profiles linked to `users.id` with masked telephone numbers.
4. `fields`: Agricultural land parcels with code, farmer reference, area in hectares, and PostGIS geometry.
5. `seasons`: Crop and verification seasons (`Kharif 2026`).
6. `activities`: Field management events (sowing, irrigation, harvest) linked to fields and seasons.
7. `evidence`: Immutable MRV evidence records with raw SHA-256 digests, submitter references, and status history.
8. `assessments`: Rule assessment runs storing ruleset version and status.
9. `reviews`: Reviewer attestation and audit queue entries with severity, due dates, and evidence references.
10. `buyer_enquiries`: Commercial credit inquiries linked to projects and buyer companies.
11. `notifications`: In-app notification queue for farmers and field officers.
12. `audit_events`: Cryptographic append-only event ledger.
13. `audit_chain_head`: Singleton table tracking the latest sequence number and SHA-256 chain hash.

### PostGIS & Coordinate Geometry
- **Schema Qualification:** PostGIS extension resides in schema `extensions`. The application sets `search_path=public,extensions`.
- **SRID 4326 Representation:** `fields.boundary` is stored as `geometry(Polygon, 4326)` with a spatial GiST index (`idx_fields_boundary`).
- **Coordinate Conversion & Topological Validity:** Coordinates in source JSON `[latitude, longitude]` are converted to WKT format `POLYGON((lon lat, ...))`, rings are closed (`p[0] == p[-1]`), and topology is verified via `ST_IsValid`. The original coordinate structure is preserved in the `payload` JSONB column.

---

## 4. Evidence Immutability & Cryptographic Audit Guarantees

### Database-Level Trigger Guards
To guarantee evidence and audit integrity even against rogue SQL queries:
- **`trg_evidence_immutability`:** Disallows SQL `DELETE` and blocks `UPDATE` on all 12 metadata columns (`id`, `field_id`, `activity_id`, `title`, `type`, `category`, `captured_at`, `submitted_at`, `submitter_id`, `sha256`, `supersedes_id`, `is_demo`). Only `status` and `payload` transitions are permitted.
- **`trg_audit_events_immutability`:** Strictly blocks all SQL `UPDATE` and `DELETE` operations on `audit_events`.

### Cryptographic Audit Hash Chaining
- Each audit event generates a canonical JSON representation containing `action`, `actor_id`, `details`, `entity_id`, `entity_type`, `event_id`, `previous_hash`, and ISO timestamp.
- The payload is hashed via SHA-256 (`event_hash`).
- The `audit_chain_head` singleton table is locked row-level using `SELECT ... FOR UPDATE WHERE id=1` during append operations.
- Under high-concurrency stress testing (20 concurrent worker threads), the audit chain remained strictly linear with zero forks or sequence collisions.

---

## 5. Security & Single-Role Architecture

The backend implements a single-role operational model tailored for Supabase environments:
1. **Administrative Table Owner:** The FastAPI backend authenticates as `postgres`.
2. **Row-Level Security (RLS) Active:** RLS is enabled on all 13 tables (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
3. **Zero Policies for Public Roles:** Zero policies are granted to Supabase's `anon` or `authenticated` roles.
4. **Revoked Privileges:** All database privileges (`SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER`) on all application tables and sequences are explicitly revoked from `anon` and `authenticated`.
5. **PostgREST Protection:** External client SDKs (supabase-js) or leaked `anon`/`service_role` client keys cannot read or tamper with application tables.

---

## 6. Migration CLI & Reconciliation Engine

The migration CLI (`python -m backend.app.cli migrate-json-to-postgres`) was engineered to provide deterministic, idempotent data migration:
- **Dependency Ordering:** `users` -> `projects` -> `farmers` -> `fields` -> `seasons` -> `activities` -> `evidence` -> `assessments` -> `reviews` -> `buyer_enquiries` -> `notifications` -> `audit_events`.
- **Atomic Transactions:** Operates inside a single transaction; in `--dry-run` mode, the transaction cleanly rolls back after validation, leaving the database unmodified.
- **Idempotency:** Existing primary keys are identified prior to insertion; repeated executions skip already-imported records without generating duplicates or errors.
- **Unbroken Audit Chain Import:** The 25 historical audit events from `backend/data/audit/audit.jsonl` were imported verbatim with original timestamps and hashes. The chain was verified valid up to the final chain head:
  `2df6686504a8acd6d93b3ee1978a1c8ba5529c1b2e0fd04060724878a924feed`.

### TEST Database Reconciliation Summary
```text
Entity             | Read  | Valid | Invalid | Existing | Would/Did
--------------------------------------------------------------------------------
users              | 6     | 6     | 0       | 6        | 0
projects           | 1     | 1     | 0       | 1        | 0
farmers            | 1     | 1     | 0       | 1        | 0
fields             | 1     | 1     | 0       | 1        | 0
seasons            | 0     | 0     | 0       | 0        | 0
activities         | 0     | 0     | 0       | 0        | 0
evidence           | 1     | 1     | 0       | 1        | 0
assessments        | 0     | 0     | 0       | 0        | 0
reviews            | 1     | 1     | 0       | 1        | 0
buyer_enquiries    | 0     | 0     | 0       | 0        | 0
notifications      | 0     | 0     | 0       | 0        | 0
audit_events       | 25    | 25    | 0       | 25       | 0
--------------------------------------------------------------------------------
Total Records Target Action : 0 (Idempotency verified on re-run)
Evidence Hashes Verified    : 1
Audit Chain Integrity Valid : True
Audit Final Chain Head Hash : 2df6686504a8acd6d93b3ee1978a1c8ba5529c1b2e0fd04060724878a924feed
```

---

## 7. Automated Test Suite Verification

The complete automated test suite was executed against both JSON storage and live PostgreSQL (TEST database):

```text
============================= test session starts =============================
platform win32 -- Python 3.13.2, pytest-8.3.5
rootdir: C:\Users\hp\Desktop\VIrsa
collected 73 items

backend\tests\test_audit.py ..                                           [  2%]
backend\tests\test_auth_rbac.py ....                                     [  8%]
backend\tests\test_crypto.py ...                                         [ 12%]
backend\tests\test_e2e_demo.py .                                         [ 13%]
backend\tests\test_evidence_upload.py ...                                [ 17%]
backend\tests\test_explainer.py .......                                  [ 27%]
backend\tests\test_graph.py .......                                      [ 36%]
backend\tests\test_hardening.py ....                                     [ 42%]
backend\tests\test_health.py .                                           [ 43%]
backend\tests\test_marketplace_enquiry.py ..                             [ 46%]
backend\tests\test_migration_cli.py ...                                  [ 50%]
backend\tests\test_postgres_audit.py ...                                 [ 54%]
backend\tests\test_postgres_e2e.py .....                                 [ 61%]
backend\tests\test_postgres_security.py .....                            [ 68%]
backend\tests\test_postgres_storage.py .....                             [ 75%]
backend\tests\test_resilience.py ....                                    [ 80%]
backend\tests\test_reviews_publish.py ..                                 [ 83%]
backend\tests\test_rules.py ...                                          [ 87%]
backend\tests\test_rules_comprehensive.py ..                             [ 90%]
backend\tests\test_satellite.py ..                                       [ 93%]
backend\tests\test_schemas.py ...                                        [ 97%]
backend\tests\test_storage.py ..                                         [100%]

================== 73 passed, 1 warning in 117.28s (0:01:57) ==================
```

---

## 8. Safety & Operational Checkpoints

- [x] **Zero Code Leakage to Client:** PostgREST access disabled via revoked privileges.
- [x] **Zero Plaintext Secrets:** No passwords or secrets committed or printed.
- [x] **Strict Scope Adherence:** Only `backend/**` touched. `src/**`, `geo/**`, `package.json`, `routeTree.gen.ts`, and root `.gitignore` remained pristine.
- [x] **Default Setting Preserved:** `STORAGE_BACKEND=json` remains the default until production cutover sign-off.
- [x] **Gated Production Migration:** Production DDL/DML requires explicit environment confirmation variable `CONFIRM_PRODUCTION_WRITE="I_APPROVE_PRODUCTION_WRITE"`.
