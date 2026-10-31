# TEST_READY.md — VirsaFloww E2E & Integration Test Track

**Published by**: E2E Testing Engineer (`e2e_test_writer`)  
**Status**: APPROVED & TEST READY  
**Date**: 2026-10-31T17:25:00Z  
**Target Milestone**: Parallel Track / M1-M5 Continuous Verification  

---

## 1. Test Harness & Test Suites Summary

The E2E Testing Track has been established following the opaque-box, requirement-driven methodology outlined in `TEST_INFRA.md`. All 23 inventoried features from `PROJECT.md` are comprehensively covered across Tiers 1 to 4 with executable, deterministic Vitest suites.

### Test Files Created
| Test Suite File | Coverage Scope | Tests | Pass/Fail |
|---|---|:---:|:---:|
| `src/test/e2e/helpers/test-harness.ts` | Shared harness, storage mocks, SHA-256 Web Crypto, coordinate adapters, envelope parsers | N/A | TypeScript OK |
| `src/test/e2e/client-envelopes.test.ts` | Central API client, JSON ErrorEnvelope parsing, ListEnvelope unwrapping, Bearer token injection, multipart upload | 10 | 10 / 10 PASS |
| `src/test/e2e/auth-session.test.ts` | `POST /api/auth/session` login, `GET /api/auth/me` session restore, token expiration cleanup (401), RBAC portal permissions | 10 | 10 / 10 PASS |
| `src/test/e2e/demo-live-isolation.test.ts` | Strict demo vs live mode separation, demo mutation interception, immutable demo identity dictionary, role switching | 10 | 10 / 10 PASS |
| `src/test/e2e/evidence-lifecycle.test.ts` | Multipart upload, raw SHA-256 seal, provenance metadata, append-only history, superseding, HTTP 409 `ALREADY_SUPERSEDED` | 10 | 10 / 10 PASS |
| `src/test/e2e/postgis-coordinates.test.ts` | PostGIS polygon normalization, latitude/longitude bounds check, empty boundary `[]` fallback, null safety | 10 | 10 / 10 PASS |
| `src/test/e2e/mrv-invariants.test.ts` | Assessment status restrictions (`UNVERIFIED`, `NEEDS_REVIEW`, `READY_FOR_VERIFICATION`), prohibition of `VERIFIED`, 5-rule evaluation | 10 | 10 / 10 PASS |
| `src/test/e2e/cross-feature-combinations.test.ts` | Tier 3 Pairwise interactions: Auth + Client 401 purge, Demo + Evidence, Store + PostGIS + ListEnvelope, Review + MRV status | 5 | 5 / 5 PASS |
| `src/test/e2e/real-world-workflows.test.ts` | Tier 4 End-to-end user journeys: Project onboarding, Field officer evidence & superseding, Reviewer decision, Buyer enquiry | 5 | 5 / 5 PASS |
| **Total Newly Created E2E Tests** | **70 new tests across 7 test files** | **70** | **70 / 70 PASS (100%)** |

---

## 2. Full Verification Suite Results

### Frontend Test Verification (`npm test`)
```bash
> vitest run && node scripts/generate-sitemap.mjs --check

 RUN  v4.1.11 C:/Users/hp/Desktop/VIrsa

 ✓ src/lib/earth/sitemap.test.ts (1 test)
 ✓ src/test/e2e/client-envelopes.test.ts (10 tests)
 ✓ src/test/e2e/evidence-lifecycle.test.ts (10 tests)
 ✓ src/test/e2e/auth-session.test.ts (10 tests)
 ✓ src/lib/earth/opportunity.test.ts (12 tests)
 ✓ src/lib/partnerships/partnerships.test.ts (3 tests)
 ✓ src/test/e2e/demo-live-isolation.test.ts (10 tests)
 ✓ src/test/e2e/real-world-workflows.test.ts (5 tests)
 ✓ src/test/e2e/cross-feature-combinations.test.ts (5 tests)
 ✓ src/lib/buyer/buyer.test.ts (8 tests)
 ✓ src/test/e2e/postgis-coordinates.test.ts (10 tests)
 ✓ src/lib/earth/enquiry.test.ts (6 tests)
 ✓ src/test/e2e/mrv-invariants.test.ts (10 tests)
 ✓ src/lib/earth/seo.test.ts (2 tests)
 ✓ src/lib/auth/auth.test.ts (24 tests)
 ✓ src/lib/terra-ledger/terra-ledger.test.ts (17 tests)

 Test Files  16 passed (16)
      Tests  143 passed (143) [73 pre-existing + 70 new E2E]
   Duration  4.62s

Sitemap check passed: 18 indexable public routes.
```

### TypeScript Strict Mode Compilation (`npx tsc --noEmit`)
- **Status**: PASSED (Exit code 0, 0 errors across entire codebase including `src/test/e2e/**`).

### Backend Pytest Verification (`python -m pytest backend/tests -v`)
- **Status**: PASSED (73 passed in 116.82s, 0 failed, all backend security, audit, and MRV tests intact).

---

## 3. Core Interface & Security Invariants Verified

1. **Central API Client Envelopes**:
   - Backend `ErrorEnvelope` (`{"error": {"code", "message", "details"}}`) safely converts to typed `ApiError` preserving HTTP status and structured validation details.
   - Backend `ListEnvelope` (`{"items", "total", "limit", "offset"}`) unwraps items while preserving total counts and pagination metadata.
   - `Authorization: Bearer <token>` is automatically injected from `localStorage.getItem('virsaflow_access_token')`.
   - Multipart `FormData` is dispatched without overriding `Content-Type` boundary headers.

2. **Authentication & Session Restoration**:
   - Valid credentials against `POST /api/auth/session` mint Bearer tokens stored in `virsaflow_access_token`.
   - Session restoration queries `GET /api/auth/me` with Bearer auth; returns authenticated profile.
   - Expired tokens returning HTTP 401 trigger immediate cleanup of stored session and cached tokens.

3. **Strict Live vs Demo Separation**:
   - Demo accounts are explicitly tagged with `isDemoUser: true` and prefixed `USR-DEMO-*`.
   - Live mutations (POST/PUT/PATCH/DELETE) are blocked/intercepted when in demo mode, preventing pollution of the live PostgreSQL database.
   - Demo sessions never spoof live JWT tokens.

4. **Evidence Engine & SHA-256 Immutability**:
   - Uploaded files are cryptographically hashed using SHA-256 (matching NIST test vectors).
   - Provenance records contain `author`, `source`, `sha256`, and GPS coordinates with accuracy.
   - Superseding atomically marks the target record `SUPERSEDED` and registers the replacement with `supersedesId`.
   - Subsequent superseding attempts on already-superseded evidence return HTTP 409 Conflict with code `ALREADY_SUPERSEDED`.

5. **PostGIS Coordinate Handling**:
   - `boundaryPolygon: List[List[float]]` adapts to UI coordinate tuples `[lat, lng]`.
   - Out-of-range coordinates (lat outside [-90, 90], lng outside [-180, 180]) and NaNs are safely filtered.
   - Empty boundary arrays (`[]`) and null values fall back safely to empty array `[]` without throwing exceptions.

6. **MRV Assessment Status Restrictions**:
   - Status is strictly constrained to `UNVERIFIED`, `NEEDS_REVIEW`, and `READY_FOR_VERIFICATION`.
   - Prohibits `VERIFIED` status under all circumstances; throws an invariant violation error if encountered.
   - Assessments with 100% passing deterministic rules transition to `READY_FOR_VERIFICATION`, never `VERIFIED`.

---

## 4. How to Execute Tests

```bash
# Run full frontend test suite + sitemap check
npm test

# Run Vitest directly
npx vitest run

# Run only the E2E test track
npx vitest run src/test/e2e

# Run TypeScript type check
npx tsc --noEmit

# Run backend pytest suite
python -m pytest backend/tests -v
```

---

## 5. Conclusion & Handoff Readiness
The E2E test infrastructure and executable test suites are fully established, independently verifiable, and currently executing with 100% pass rates. Downstream Milestone feature tracks (M1 through M5) can now proceed with confidence against this authoritative test harness.
