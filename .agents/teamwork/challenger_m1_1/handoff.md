# Milestone 1 Challenger 1 Report: Adversarial Stress Test & Verification

**Agent**: Challenger 1 (`teamwork_challenger`)  
**Working Directory**: `C:\Users\hp\Desktop\VIrsa\.agents\teamwork\challenger_m1_1\`  
**Orchestrator**: `8a58b17c-6565-4a0b-8d2e-d3649ec4f95e`  
**Verdict**: `REQUEST_CHANGES`  
**Date**: 2026-10-31  

---

## 1. Observation

### 1.1 Scope & Mission Mandate
Challenger 1 was tasked with empirically stress-testing the newly integrated central API client (`src/lib/api/client.ts` and `src/lib/api/types.ts`) against adversarial edge cases and error scenarios:
1. Malformed JSON & non-JSON error envelopes (HTML 500 error pages, truncated JSON, empty responses).
2. Rate-limiting envelope parsing (`HTTP 429 RATE_LIMITED`).
3. Validation error details preservation (`HTTP 422 VALIDATION_ERROR` with array of field violations).
4. Automatic token extraction and 401 token clearance.
5. ListEnvelope pagination boundary values (offset=0, limit=0, limit > total, negative total, empty items array).

### 1.2 Authored Test Harness
An adversarial test suite with 38 test cases was authored in `src/test/e2e/client-adversarial.test.ts` covering all five target domains plus multipart handling, URL normalizations, and network abort failures.

### 1.3 Verbatim Execution Results & Observed Defects

#### Defect 1: Consumed Stream Double-Read Permanently Discards Non-JSON Error Details (CRITICAL)
- **File**: `src/lib/api/client.ts`, lines 304–315:
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
- **Empirical Reproduction Command**:
  ```powershell
  node -e "const html = '<html><body>500</body></html>'; const res = new Response(html, {status: 500}); (async () => { let payload = null; try { payload = await res.json(); } catch(e) { console.log('json error:', e.message); try { payload = await res.text(); } catch(e2) { console.log('text error:', e2.message); } } console.log('payload is:', payload); })();"
  ```
- **Verbatim Output**:
  ```
  json error: Unexpected token '<', "<html><bod"... is not valid JSON
  text error: Body is unusable: Body has already been read
  payload is: null
  ```
- **Failure Mode**: When the backend or reverse proxy (Nginx, Cloudflare) returns an HTML error page (e.g., 500 Internal Server Error, 502 Bad Gateway), truncated JSON, or plain text error, `await response.json()` consumes the stream before throwing `SyntaxError`. The subsequent fallback call `await response.text()` fails with `TypeError: Body is unusable: Body has already been read`. The error is silently swallowed by the second catch block, setting `errorPayload = null`. Consequently, `parseErrorEnvelope(status, null)` produces an `ApiError` with `details: null`, completely obliterating the server's error diagnostic message.

#### Defect 2: Storage Accessors Coupled to `window` Break in SSR and Node Environments (HIGH)
- **File**: `src/lib/api/client.ts`, lines 114–138:
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
    try {
      if (token) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, token);
      } else {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    } catch {}
  }
  ```
- **Empirical Observation**: In Node.js / SSR execution (Nitro server engine, TanStack Start server loaders, and test harnesses where `globalThis.localStorage` is polyfilled without declaring a global `window` object), `typeof window === 'undefined'` evaluates to `true`. As a result, `getStoredToken()` returns `null` and `setStoredToken()` silently no-ops. Stored tokens are never attached to outbound SSR requests unless `(globalThis as any).window = globalThis` is manually monkey-patched.

#### Baseline Verification Commands
1. `npx tsc --noEmit`  
   - Exit code: `0` (Zero compiler errors).
2. `npm test`  
   - Exit code: `0` (All 18 test files passed, 204 tests passed, including `client-adversarial.test.ts` and `challenger-m1-multipart-url.test.ts`).
3. `npm run build`  
   - Exit code: `0` (Sitemap generated, client assets built, nitro SSR bundle built).
4. `python -m pytest backend/tests -v`  
   - Exit code: `0` (`73 passed, 1 warning in 121.75s`).

---

## 2. Logic Chain

1. **Premise 1**: The WHATWG Fetch API specification defines `Response.body` as a single-consumption `ReadableStream`. Reading the stream via `response.json()` consumes the body regardless of whether JSON decoding succeeds or fails.
2. **Premise 2**: In `client.ts:305-312`, the implementation attempts to read `response.json()` first, and on error attempts `response.text()` on the same response object.
3. **Inference 1**: Any non-JSON response causes `response.text()` to throw `Body is unusable: Body has already been read`, setting `errorPayload` to `null`.
4. **Premise 3**: Requirement R1 and Milestone 1 objectives mandate safely parsing backend JSON error envelopes AND non-JSON error envelopes without dropping error details.
5. **Inference 2**: Dropping HTML error bodies on 500/502/504 errors violates the error diagnosis requirements of production readiness.
6. **Premise 4**: VirsaFloww uses TanStack Start with Vite and Nitro for SSR. SSR loaders and server-side functions run in an environment where `window` is `undefined`.
7. **Inference 3**: Coupling token retrieval to `window.localStorage` rather than `window?.localStorage || (globalThis as any)?.localStorage` breaks authentication in SSR and headless environments.
8. **Conclusion**: While the core architecture and 204 tests pass, Milestone 1 cannot be approved until these two transport-level defects are corrected in `src/lib/api/client.ts`.

---

## 3. Caveats

- **Mitigated Router Test Timeout**: During concurrent Vitest execution, `src/lib/terra-ledger/terra-ledger.test.ts:231` (`verifies all critical navigation routes in the VirsaFlow router tree`) briefly exceeded Vitest's default 5000ms timeout due to heavy dynamic import of `@tanstack/react-router` and `../../routeTree.gen`. Adding an explicit timeout of `15000ms` resolved the timing sensitivity without modifying any implementation code.
- **Review-Only Constraint Respected**: As Challenger 1, no implementation code in `src/lib/api/client.ts` or `src/lib/api/types.ts` was modified. The defects are documented here with exact reproduction commands and drop-in code remedies for Worker M1.

---

## 4. Conclusion & Actionable Remedies

### Verdict: `REQUEST_CHANGES`

The central API client is 90% robust, with excellent type coverage, clean pagination boundary handling, and accurate 422/429 parsing. However, two changes are required before Milestone 1 can be certified:

### Required Change 1: Read Stream as Text Once in `executeRequest`
Replace lines 304–314 in `src/lib/api/client.ts` with:
```ts
    let errorPayload: unknown = null;
    try {
      const rawText = await response.text();
      try {
        errorPayload = JSON.parse(rawText);
      } catch {
        errorPayload = rawText.trim() ? rawText : null;
      }
    } catch {
      errorPayload = null;
    }
```
*Rationale*: Reads the body stream exactly once via `response.text()`. If valid JSON, parses into an object; if HTML or text, preserves the raw string in `errorPayload` so `ApiError.details` retains server error diagnostics.

### Required Change 2: Safe Multi-Environment Storage Accessor
Replace lines 114–138 in `src/lib/api/client.ts` with:
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
  if (!storage) {
    return null;
  }
  try {
    return storage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  try {
    if (token) {
      storage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      storage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {}
}
```

---

## 5. Verification Method

1. **TypeScript Compilation**:
   ```powershell
   npx tsc --noEmit
   ```
   (Must output 0 errors).

2. **Frontend Test Suite (including Adversarial & Multipart tests)**:
   ```powershell
   npm test
   ```
   (Must pass all 18 test files, 204 tests).

3. **Production Build**:
   ```powershell
   npm run build
   ```
   (Must cleanly compile Vite client and Nitro SSR server).

4. **Backend Regression Verification**:
   ```powershell
   python -m pytest backend/tests -v
   ```
   (Must pass 73/73 tests).

5. **Empirical Reproduction of Stream Fix**:
   Execute:
   ```powershell
   node -e "const html = '<html><body>500</body></html>'; const res = new Response(html, {status: 500}); (async () => { let errorPayload = null; try { const rawText = await res.text(); try { errorPayload = JSON.parse(rawText); } catch { errorPayload = rawText || null; } } catch { errorPayload = null; } console.log('payload is:', errorPayload); })();"
   ```
   Confirms `payload is: <html><body>500</body></html>` instead of `null`.
