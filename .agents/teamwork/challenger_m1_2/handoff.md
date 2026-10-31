# Milestone 1: Challenger 2 Empirical Stress Test Report

**Agent**: Challenger 2 (`challenger_m1_2`, empirical_challenger)  
**Working Directory**: `C:\Users\hp\Desktop\VIrsa\.agents\teamwork\challenger_m1_2\`  
**Target Files**: `src/lib/api/client.ts`, `src/lib/api.ts`, `src/lib/api/types.ts`  
**Date**: 2026-10-31  
**Verdict**: **`REQUEST_CHANGES`**

---

## 1. Observation

### 1.1 Empirical Stress-Test Execution (`src/test/e2e/challenger-m1-multipart-url.test.ts`)
Created and executed a dedicated 23-test empirical verification suite in `src/test/e2e/challenger-m1-multipart-url.test.ts`:
- **Execution Command**: `npx vitest run src/test/e2e/challenger-m1-multipart-url.test.ts`
- **Result**: `✓ src/test/e2e/challenger-m1-multipart-url.test.ts (23 tests) 61ms — Test Files: 1 passed (1), Tests: 23 passed (23)`.

#### Detailed Results by Area:
1. **Multipart Boundary Handling**:
   - `postMultipart` completely omits `Content-Type` header when none is provided, allowing fetch/browser runtime to generate the boundary parameter (`multipart/form-data; boundary=...`). (Test 1.1)
   - When caller explicitly passes `Content-Type: multipart/form-data` or `content-type: application/json` in `options.headers`, `headers.delete('Content-Type')` case-insensitively strips it from the `Headers` instance, avoiding boundary suppression bugs. (Tests 1.2, 1.3)
   - Non-content-type custom headers (`X-Custom-Trace`, `Authorization`) are preserved intact. (Tests 1.2, 1.4)
   - Binary attachments (`File`, `Blob`) and form text fields are passed intact in `body: FormData`. (Test 1.5)
   - `api.submitEvidence(formData)` and `api.supersedeEvidence(id, formData)` in `src/lib/api.ts` correctly route to `client.postMultipart(...)` in live mode without setting manual `Content-Type`. (Tests 1.6, 3.4)

2. **URL Resolution Edge Cases (`resolveApiUrl`)**:
   - Exhaustively tested 48 permutations: 6 Base URL variants (`http://127.0.0.1:8000`, `http://127.0.0.1:8000/`, `http://127.0.0.1:8000/api`, `http://127.0.0.1:8000/api/`, `http://127.0.0.1:8000///`, `http://127.0.0.1:8000/api///`) × 8 Path variants (`/projects`, `projects`, `/api/projects`, `api/projects`, `/fields/PB-01`, `fields/PB-01`, `/api/evidence/EV-1/supersede`, `evidence/EV-1/supersede`). (Test 2.1)
   - **Double Prefix Prevention**: Zero occurrences of `/api/api/...` generated across all 48 permutations.
   - **Legacy Rewriting**: `/api/v1/...` and `api/v1/...` correctly rewrite to `/api/...`. (Test 2.2)
   - **Absolute URLs**: Preserves `https://...` and external origins without prepending base URL or `/api`. (Test 2.3)
   - **Query String Formatting**: Correctly handles query parameters via object and `URLSearchParams`, safely handling existing `?` with `&`, and ignoring `null`/`undefined`/empty values. (Tests 2.4, 2.5, 2.6)

3. **409 Conflict Handling on Superseding Evidence (`ALREADY_SUPERSEDED`)**:
   - Server response with HTTP 409 and `{"error": {"code": "ALREADY_SUPERSEDED", "message": "..."}}` throws typed `ApiError` with `status: 409`, `code: 'ALREADY_SUPERSEDED'`, `isConflict() === true`. (Test 3.1)
   - `api.supersedeEvidence` in `src/lib/api.ts` catches 409 `ALREADY_SUPERSEDED` and converts it into a clear, descriptive Error: `"Evidence EV-PB-88 has already been superseded."`. (Test 3.2)
   - Non-409 errors (404 `NOT_FOUND`, 403 `FORBIDDEN`, 422 `VALIDATION_ERROR`, network failures) propagate through cleanly as `ApiError`. (Tests 3.3, 4.1)
   - On HTTP 201 Created, `supersedeEvidence` returns the newly created record with `supersedesId` mapped correctly. (Test 3.4)

---

### 1.2 Regressions & Defects Discovered During Full Test Suite Run (`npm test`)
Running `npm test` (`vitest run && node scripts/generate-sitemap.mjs --check`) revealed **4 test failures** in `src/test/e2e/client-adversarial.test.ts`:

```
FAIL src/test/e2e/client-adversarial.test.ts (38 tests | 4 failed)
  × 1.1 parses raw HTML 500 error pages into typed ApiError without throwing syntax errors
    AssertionError: expected null to be '<!DOCTYPE html><html>...' (apiErr.details was null)
  × 1.2 safely handles truncated JSON in HTTP 500 error responses via fallback text extraction
    AssertionError: expected null to be '{"error": {"code": "INTERNAL_FAIL"...' (apiErr.details was null)
  × 4.1 automatically extracts virsaflow_access_token from localStorage and attaches Bearer header
    AssertionError: expected null to be 'eyJhbGciOiJIUzI1Ni...'
  × 4.5 automatically clears virsaflow_access_token from localStorage on HTTP 401
    AssertionError: expected null to be 'token-that-will-expire'
```

#### Defect 1: Consumed Response Stream on Non-JSON Server Responses
- **File & Lines**: `src/lib/api/client.ts:304-315`
- **Verbatim Code**:
  ```ts
  let errorPayload: unknown = null;
  try {
    errorPayload = await response.json();
  } catch {
    try {
      errorPayload = await response.text();
    } catch {
      errorPayload = null;
    }
  }

  throw parseErrorEnvelope(response.status, errorPayload);
  ```
- **Direct Observation**: In the WHATWG Fetch API specification, a `Response` body stream is single-use (`bodyUsed = true`). When `await response.json()` throws because the server returned an HTML error page (e.g. 500/502/504) or truncated JSON, `response.bodyUsed` is already `true`. The subsequent `await response.text()` immediately rejects with `TypeError: Body has already been consumed`. The inner catch executes `errorPayload = null`. Consequently, `parseErrorEnvelope` receives `null` instead of the raw text body, discarding error text and diagnostic information.

#### Defect 2: Storage Check Incompatible with Test and Non-Window Environments
- **File & Lines**: `src/lib/api/client.ts:114-138`
- **Verbatim Code**:
  ```ts
  export function getStoredToken(): string | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    try {
      return window.localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  export function setStoredToken(token: string | null): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    ...
  ```
- **Direct Observation**: Both functions strictly check `typeof window === 'undefined'`. In Node/Vitest test environments and SSR contexts where `globalThis.localStorage` is provided (e.g., via `resetStorage()` test harness, Node 22 `--experimental-webstorage`, or jsdom without global `window`), `getStoredToken()` and `setStoredToken()` silently return `null` and do not store tokens. This causes tests 4.1 and 4.5 to fail when `setStoredToken` is called.

#### Defect 3 (Minor): Inexact Path Prefix Matching in URL Normalizer
- **File & Lines**: `src/lib/api/client.ts:176`
- **Verbatim Code**:
  ```ts
  const finalPath = cleanPath.startsWith('/api') ? cleanPath : `/api${cleanPath}`;
  ```
- **Direct Observation**: Any path beginning with `/api` followed by non-slash characters (e.g., `/apikeys`, `/apiview`) matches `.startsWith('/api')`, causing it to NOT be prefixed with `/api`, yielding `http://127.0.0.1:8000/apikeys` instead of `http://127.0.0.1:8000/api/apikeys`. It should check `cleanPath === '/api' || cleanPath.startsWith('/api/')`.

---

## 2. Logic Chain

1. **Mission Mandate**:
   - The mission requires verifying that multipart boundary handling, URL resolution, and 409 Conflict handling are robust, that no project files are broken, and that a clear verdict (`APPROVE` or `REQUEST_CHANGES`) is provided.
2. **Feature Correctness**:
   - Observations in Section 1.1 confirm that the core requirements for Milestone 1 (multipart boundary omission, URL normalization across standard base/path permutations, and 409 `ALREADY_SUPERSEDED` translation) are correctly implemented.
3. **Build & Test Gate Failure**:
   - Per Requirement R5 and Acceptance Criteria: all frontend tests must pass (`npm test`).
   - Running `npm test` fails with 4 errors in `src/test/e2e/client-adversarial.test.ts`.
   - Trace analysis proves these 4 test failures are caused directly by Defect 1 (Fetch stream consumption bug in `executeRequest`) and Defect 2 (`typeof window === 'undefined'` check in `getStoredToken`/`setStoredToken`) inside `src/lib/api/client.ts`.
4. **Conclusion Derivation**:
   - Because implementation code in `src/lib/api/client.ts` contains these two reproducible defects that break the test suite, Milestone 1 cannot be approved in its current state.
   - Therefore, the required verdict is `REQUEST_CHANGES`.

---

## 3. Caveats

- **Remote Database Test Flake**: In `backend/tests/test_postgres_audit.py::test_audit_concurrent_append_20_threads`, 20 concurrent threads attempting to connect to the remote Supabase PostgreSQL pooler triggered `(EMAXCONNSESSION) max clients reached in session mode - max clients are limited to pool_size: 15`. This is an external infrastructure quota constraint on the remote database, not a regression caused by Milestone 1 frontend code.
- **Review-Only Constraint**: As an adversarial reviewer/challenger, I did not modify `src/lib/api/client.ts` directly. The fixes are detailed below for the worker agent to apply.

---

## 4. Conclusion

**Verdict: `REQUEST_CHANGES`**

While Multipart handling, URL normalization for standard endpoints, and 409 Conflict handling are functioning correctly, two concrete defects in `src/lib/api/client.ts` must be addressed by the implementation worker:

### Required Action Items for Worker:

1. **Fix Response Body Stream Double-Consumption (`src/lib/api/client.ts:304-315`)**:
   Read `await response.text()` first, then attempt `JSON.parse(text)`. If JSON parsing fails, retain the raw text string as `errorPayload`:
   ```ts
   let errorPayload: unknown = null;
   try {
     const rawText = await response.text();
     try {
       errorPayload = JSON.parse(rawText);
     } catch {
       errorPayload = rawText && rawText.trim().length > 0 ? rawText : null;
     }
   } catch {
     errorPayload = null;
   }
   ```

2. **Fix Storage Helper for Node/Test/SSR Compatibility (`src/lib/api/client.ts:114-138`)**:
   Support `globalThis.localStorage` fallback when `window` is not defined:
   ```ts
   function getStorage(): Storage | null {
     if (typeof window !== 'undefined' && window.localStorage) {
       return window.localStorage;
     }
     if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
       return (globalThis as any).localStorage;
     }
     return null;
   }

   export function getStoredToken(): string | null {
     const storage = getStorage();
     if (!storage) return null;
     try {
       return storage.getItem(AUTH_TOKEN_KEY);
     } catch {
       return null;
     }
   }

   export function setStoredToken(token: string | null): void {
     const storage = getStorage();
     if (!storage) return;
     try {
       if (token) {
         storage.setItem(AUTH_TOKEN_KEY, token);
       } else {
         storage.removeItem(AUTH_TOKEN_KEY);
       }
     } catch {
       // Ignore storage quota or access errors in restricted browser environments
     }
   }
   ```

3. **Harden Path Normalization (`src/lib/api/client.ts:176`)**:
   ```ts
   const finalPath =
     cleanPath === '/api' || cleanPath.startsWith('/api/')
       ? cleanPath
       : `/api${cleanPath}`;
   ```

---

## 5. Verification Method

To independently reproduce and verify this assessment:

1. **Run Challenger 2 Empirical Test Suite**:
   ```bash
   npx vitest run src/test/e2e/challenger-m1-multipart-url.test.ts
   ```
   (Expected: 23 passed)

2. **Run Full Test Suite to Reproduce 4 Failures**:
   ```bash
   npm test
   ```
   (Expected: Exits with code 1, reporting 4 failures in `client-adversarial.test.ts`)

3. **Verify Type Checking & Build**:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
   (Expected: Both pass cleanly with 0 errors)
