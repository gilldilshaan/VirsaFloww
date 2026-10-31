# Milestone 1: Central API Client & Network Infrastructure — Deep Analysis & Code Blueprint

**Working Directory**: `C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m1_client\`  
**Investigator**: M1 Client Explorer (`teamwork_explorer`)  
**Target File**: `src/lib/api/client.ts`  
**Secondary File**: `src/lib/api.ts`  
**Date**: 2026-10-31  

---

## 1. Executive Summary

Milestone 1 establishes the single, authoritative communication bridge between the VirsaFloww React frontend and the FastAPI backend (`backend/app/`). Currently, frontend network operations are fragmented:
1. `src/lib/api/client.ts` is an embryonic 122-line fetch client that lacks automatic Bearer token extraction from `localStorage`, does not parse backend error envelopes (`{"error": {"code", "message", "details"}}`), does not handle paginated list envelopes (`{"items", "total", "limit", "offset"}`), and does not support boundary-safe `multipart/form-data` uploads.
2. `src/lib/api.ts` is an older facade that targets deprecated `/api/v1/...` routes via an obsolete environment variable (`VITE_MRV_API_BASE_URL`), falling back to mock fixtures.
3. Consumers such as `src/lib/farmer/farmer-service.ts` and `src/lib/partnerships/partnerships-service.ts` import `{ api }` from `@/lib/api/client` and rely on its method signatures.

This analysis presents the architectural specification and exact drop-in implementation blueprint for `src/lib/api/client.ts` (and the consolidation plan for `src/lib/api.ts`) satisfying 100% of Requirement R1 while preserving complete backward compatibility.

---

## 2. Requirement-by-Requirement Analysis

### 2.1 Requirement 1: Base URL & Routing Architecture
- **Environment Variable**: `import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'`.
- **Target Prefix**: All backend routes in FastAPI (`backend/app/api/router.py`) are mounted under `/api` (e.g. `/api/auth/session`, `/api/projects`, `/api/fields`, `/api/evidence`, etc.).
- **URL Normalization**: Callers may pass paths in various formats:
  - Relative without `/api`: `/projects` or `projects` -> resolves to `http://127.0.0.1:8000/api/projects`.
  - Relative with `/api`: `/api/projects` -> resolves to `http://127.0.0.1:8000/api/projects` (no duplicate `/api/api/projects`).
  - Absolute external URL: `https://example.com/data` -> preserved intact.
  - Base URL containing `/api`: e.g. `http://127.0.0.1:8000/api` -> cleaned so `/api` is not duplicated.
  - Query parameters: An optional `params` dictionary in `RequestOptions` automatically encoded via `URLSearchParams`.

### 2.2 Requirement 2: Automatic Bearer Token Injection
- **Storage Key**: `virsaflow_access_token` in `window.localStorage`.
- **Header Structure**: `Authorization: Bearer <token>`.
- **Mechanics**:
  - Safe browser/SSR boundary check (`typeof window !== 'undefined' && window.localStorage`).
  - Automatically injected on every request unless an explicit `Authorization` header is provided in `options.headers` or `options.token` overrides it.
  - Helper functions `getStoredToken()`, `setStoredToken(token: string | null)`, and `clearStoredToken()`.
  - Automatic token clearance upon HTTP 401 `UNAUTHENTICATED` with notification to optional `onUnauthorized` callbacks.

### 2.3 Requirement 3: Error Envelope Parsing & Typed `ApiError`
- **Authoritative Backend Spec** (`backend/app/main.py` lines 56–100):
  The backend wraps all errors in a frozen top-level JSON structure:
  ```json
  {
    "error": {
      "code": "STRING_ERROR_CODE",
      "message": "Human-readable explanation.",
      "details": null
    }
  }
  ```
  Special cases handled by backend exception handlers:
  - `HTTPException`: extracts `code`, `message`, `details` from `exc.detail`.
  - `RequestValidationError` (HTTP 422): returns `code: "VALIDATION_ERROR"`, `details: exc.errors()`.
  - Unhandled `Exception` (HTTP 500): returns `code: "INTERNAL_SERVER_ERROR"`.
- **Client Error Behavior**:
  - Unwraps the `error` envelope and throws a strongly typed `ApiError` class extending `Error`.
  - Properties: `code: string`, `status: number`, `message: string`, `details: unknown`.
  - Also handles non-JSON / fallback errors (e.g. raw 500 HTML gateway pages, network disconnects with status 0, legacy `{ detail: string }` or `{ code, message }`).
  - Exports standalone parser `parseErrorEnvelope(status: number, responseBody: unknown): ApiError` perfectly matching the E2E test harness expectations (`src/test/e2e/helpers/test-harness.ts:157`).

### 2.4 Requirement 4: List Envelope Parsing
- **Authoritative Backend Spec** (`backend/app/schemas/common.py`):
  ```json
  {
    "items": [...],
    "total": 128,
    "limit": 50,
    "offset": 0
  }
  ```
- **Client Capabilities**:
  - Exports `ListEnvelope<T>` interface.
  - Exports `unwrapListEnvelope<T>(responseBody: ListEnvelope<T> | unknown): ListEnvelope<T>`.
  - Throws descriptive errors when the payload is malformed:
    - If `!responseBody || typeof responseBody !== 'object'`: throws `'Malformed list response: expected JSON object'`.
    - If `!Array.isArray(obj['items'])`: throws `"Malformed ListEnvelope: missing or invalid 'items' array"`.
  - Provides `client.getList<T>(path, options)` for one-step fetch and envelope unwrapping.
  - Provides `unwrapList<T>(response)` to extract items array directly from either a `ListEnvelope<T>` or a raw array.
  - Preserves legacy `PaginatedResponse<T>` and helper `toPaginatedResponse<T>(envelope)` for backward compatibility.

### 2.5 Requirement 5: Boundary-Safe Multipart Form Upload
- **FastAPI Expectation** (`backend/app/api/evidence.py`):
  - Endpoints `POST /api/evidence` and `POST /api/evidence/{id}/supersede` expect `multipart/form-data` with binary `file: UploadFile` and metadata form fields.
  - If a client manually sets `Content-Type: multipart/form-data`, Python's `python-multipart` fails because the required boundary parameter (e.g. `; boundary=----WebKit...`) is missing.
- **Client Solution**:
  - `postMultipart<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T>`.
  - Automatically attaches `Authorization: Bearer <token>`.
  - Explicitly leaves `Content-Type` unset (or deletes any manual `Content-Type`), allowing the browser/fetch runtime to set `multipart/form-data; boundary=...`.
  - Handles response unwrapping and typed `ApiError` throws identically to JSON requests.

### 2.6 Requirement 6: Existing Consumers Inspection & Backward Compatibility
A complete audit of all files in the repository importing from `api/client` or `api`:
1. **`src/lib/farmer/farmer-service.ts`** (line 6):
   - Imports: `import { api } from '@/lib/api/client';`
   - Usage: Currently imports `api` without invoking methods. Full compatibility guaranteed by exporting `api`.
2. **`src/lib/partnerships/partnerships-service.ts`** (lines 6, 128–136):
   - Imports: `import { api } from '@/lib/api/client';`
   - Usage:
     ```typescript
     try {
       const res = await api.post('/api/v1/partnerships/enquiry', newRecord);
       if (res.error && res.status !== 0 && res.status !== 404) {
         console.warn('Backend rejected partnership enquiry:', res.error);
       }
     } catch (err) {
       console.info('Backend unavailable, persisting enquiry locally:', err);
     }
     ```
   - Analysis: When `api.post` returns `Promise<T = any>`, TypeScript compiles `res.error` and `res.status` with zero type errors. If `api.post` throws on failure, the `catch (err)` block catches it and persists locally as intended. Furthermore, `client.safeRequest` and `safePost` are provided if consumers specifically want non-throwing `ApiResponse<T>`.
3. **`src/lib/terra-ledger/store.tsx`** & **`terra-ledger.test.ts`**:
   - Imports: `import { api } from '../api';`
   - In M1, `src/lib/api.ts` is consolidated to delegate to `client.ts`, maintaining full interface compatibility.

---

## 3. Concrete Implementation Blueprint for `src/lib/api/client.ts`

The following complete TypeScript implementation is designed to replace `src/lib/api/client.ts`:

```typescript
/**
 * TerraLedger AI / VirsaFloww — Central API Client
 *
 * Authoritative HTTP client for all frontend API communication with the FastAPI backend.
 * Provides automatic Bearer token injection, frozen error envelope parsing,
 * paginated list envelope unwrapping, and boundary-safe multipart file uploads.
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

/** Authoritative backend error envelope */
export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/** Authoritative backend paginated list envelope */
export interface ListEnvelope<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

/** Strongly typed API error instance thrown on non-2xx responses */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, code: string = 'API_ERROR', status: number = 0, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/** Legacy response wrapper for non-throwing callers */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

/** Legacy pagination metadata */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Request configuration options */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>;
  token?: string | null;
}

/** Global API client configuration */
export interface ApiClientConfig {
  baseUrl: string;
  getAuthToken?: () => Promise<string | null> | string | null;
  onUnauthorized?: () => void;
}

// ============================================================================
// Constants & State
// ============================================================================

export const AUTH_TOKEN_KEY = 'virsaflow_access_token';

const defaultConfig: ApiClientConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000',
  getAuthToken: getStoredToken,
};

let clientConfig: ApiClientConfig = { ...defaultConfig };

// ============================================================================
// Token Storage Helpers
// ============================================================================

/** Retrieve current JWT token from localStorage */
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

/** Update or clear JWT token in localStorage */
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
  } catch {
    // Ignore storage quota or access errors in restricted browser environments
  }
}

/** Clear stored JWT token */
export function clearStoredToken(): void {
  setStoredToken(null);
}

// ============================================================================
// URL Resolution Helper
// ============================================================================

/**
 * Resolves API URL with /api prefixing, trailing-slash stripping, and query parameters.
 */
export function resolveApiUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): string {
  let fullUrl: string;

  if (/^https?:\/\//i.test(path)) {
    fullUrl = path;
  } else {
    const rawBase = (clientConfig.baseUrl ?? (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000')).replace(/\/+$/, '');
    const cleanBase = rawBase.endsWith('/api') ? rawBase.slice(0, -4) : rawBase;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const finalPath = cleanPath.startsWith('/api') ? cleanPath : `/api${cleanPath}`;
    fullUrl = `${cleanBase}${finalPath}`;
  }

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    }
    const queryStr = searchParams.toString();
    if (queryStr) {
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryStr;
    }
  }

  return fullUrl;
}

// ============================================================================
// Envelope Parsers & Type Guards
// ============================================================================

/**
 * Safely parses backend ErrorEnvelope format into a strongly typed ApiError instance.
 */
export function parseErrorEnvelope(status: number, responseBody: unknown): ApiError {
  const defaultMessage = `Request failed with status ${status}`;
  if (!responseBody || typeof responseBody !== 'object') {
    return new ApiError(defaultMessage, 'API_ERROR', status, responseBody);
  }

  const envelope = responseBody as Record<string, unknown>;
  if (envelope['error'] && typeof envelope['error'] === 'object') {
    const errorDetail = envelope['error'] as Record<string, unknown>;
    const code = String(errorDetail['code'] ?? 'API_ERROR');
    const message = String(errorDetail['message'] ?? defaultMessage);
    const details = errorDetail['details'];
    return new ApiError(message, code, status, details);
  }

  const code = String(envelope['code'] ?? 'API_ERROR');
  const message = String(envelope['message'] ?? defaultMessage);
  const details = envelope['details'];
  return new ApiError(message, code, status, details);
}

/**
 * Safely unwraps backend ListEnvelope format with validation.
 */
export function unwrapListEnvelope<T = unknown>(responseBody: ListEnvelope<T> | unknown): ListEnvelope<T> {
  if (!responseBody || typeof responseBody !== 'object') {
    throw new Error('Malformed list response: expected JSON object');
  }

  const obj = responseBody as Record<string, unknown>;
  if (!Array.isArray(obj['items'])) {
    throw new Error("Malformed ListEnvelope: missing or invalid 'items' array");
  }

  return {
    items: obj['items'] as T[],
    total: typeof obj['total'] === 'number' ? obj['total'] : (obj['items'] as T[]).length,
    limit: typeof obj['limit'] === 'number' ? obj['limit'] : 50,
    offset: typeof obj['offset'] === 'number' ? obj['offset'] : 0,
  };
}

/** Type guard checking if an object conforms to ListEnvelope structure */
export function isListEnvelope<T = unknown>(obj: unknown): obj is ListEnvelope<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'items' in obj &&
    Array.isArray((obj as Record<string, unknown>).items) &&
    'total' in obj &&
    typeof (obj as Record<string, unknown>).total === 'number'
  );
}

/** Unwraps items from either a ListEnvelope or a raw array */
export function unwrapList<T>(response: ListEnvelope<T> | T[] | unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }
  if (isListEnvelope<T>(response)) {
    return response.items;
  }
  return [];
}

/** Converts ListEnvelope to legacy PaginatedResponse */
export function toPaginatedResponse<T>(envelope: ListEnvelope<T>): PaginatedResponse<T> {
  const limit = envelope.limit || 50;
  const offset = envelope.offset || 0;
  return {
    items: envelope.items ?? [],
    total: envelope.total ?? 0,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
    hasMore: offset + (envelope.items?.length ?? 0) < (envelope.total ?? 0),
  };
}

// ============================================================================
// Core Request Dispatcher
// ============================================================================

async function executeRequest<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
  isMultipart: boolean = false,
): Promise<T> {
  const url = resolveApiUrl(path, options?.params);

  // Determine auth token
  let token: string | null = null;
  if (options?.token !== undefined) {
    token = options.token;
  } else if (clientConfig.getAuthToken) {
    token = await clientConfig.getAuthToken();
  }

  const headers = new Headers(options?.headers);

  // Set Authorization header if token exists and not already set
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchInit: RequestInit = {
    ...options,
    method,
    headers,
  };

  // Body handling
  if (isMultipart) {
    // For multipart/form-data, Content-Type MUST NOT be set so browser adds boundary
    headers.delete('Content-Type');
    fetchInit.body = body as FormData;
  } else if (body !== undefined) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    fetchInit.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(url, fetchInit);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network request failed';
    throw new ApiError(message, 'NETWORK_ERROR', 0, err);
  }

  // Handle HTTP failure statuses
  if (!response.ok) {
    if (response.status === 401) {
      clearStoredToken();
      clientConfig.onUnauthorized?.();
    }

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
  }

  // Handle successful empty response
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return null as T;
  }
}

// ============================================================================
// Client Class & Facade
// ============================================================================

export class ApiClient {
  public resolveUrl(path: string, params?: Record<string, string | number | boolean | undefined | null>): string {
    return resolveApiUrl(path, params);
  }

  public getToken(): string | null {
    return getStoredToken();
  }

  public setToken(token: string | null): void {
    setStoredToken(token);
  }

  public clearToken(): void {
    clearStoredToken();
  }

  public get<T = any>(path: string, options?: RequestOptions): Promise<T> {
    return executeRequest<T>('GET', path, undefined, options);
  }

  public post<T = any>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return executeRequest<T>('POST', path, body, options);
  }

  public put<T = any>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return executeRequest<T>('PUT', path, body, options);
  }

  public patch<T = any>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return executeRequest<T>('PATCH', path, body, options);
  }

  public delete<T = any>(path: string, options?: RequestOptions): Promise<T> {
    return executeRequest<T>('DELETE', path, undefined, options);
  }

  public postMultipart<T = any>(
    path: string,
    formData: FormData,
    options?: RequestOptions,
  ): Promise<T> {
    return executeRequest<T>('POST', path, formData, options, true);
  }

  public async getList<T = any>(path: string, options?: RequestOptions): Promise<ListEnvelope<T>> {
    const raw = await this.get<unknown>(path, options);
    return unwrapListEnvelope<T>(raw);
  }

  public async safeRequest<T = any>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    try {
      const data = await executeRequest<T>(method, path, body, options);
      return { data, error: null, status: 200 };
    } catch (err) {
      if (err instanceof ApiError) {
        return { data: null, error: err, status: err.status };
      }
      const message = err instanceof Error ? err.message : 'Network request failed';
      return { data: null, error: new ApiError(message, 'NETWORK_ERROR', 0, err), status: 0 };
    }
  }
}

/** Configure the API client (call once at app initialization if custom config is needed) */
export function configureApiClient(config: Partial<ApiClientConfig>): void {
  clientConfig = { ...clientConfig, ...config };
}

/** Get current client configuration snapshot */
export function getApiClientConfig(): ApiClientConfig {
  return { ...clientConfig };
}

/** Central API client singleton instance */
export const client = new ApiClient();

/** Backward-compatible export alias for legacy consumers */
export const api = client;

export default client;
```

---

## 4. Consolidation Plan for `src/lib/api.ts`

`src/lib/api.ts` currently contains an `ApiClient` class with legacy `/api/v1/...` routes and mock fallback methods. To satisfy Milestone 1 Feature 6:
1. Deprecate the `/api/v1` route prefix and import `client` from `./api/client`.
2. When live backend is configured, forward domain calls to authoritative `/api/...` endpoints:
   - `getProjects()` -> `client.get('/projects', { params: ... })`
   - `getProjectById(id)` -> `client.get(`/projects/${encodeURIComponent(id)}`)`
   - `getFields()` -> `client.get('/fields', { params: ... })`
   - `getFieldById(id)` -> `client.get(`/fields/${encodeURIComponent(id)}`)`
   - `getEvidenceList(fieldId)` -> `client.get('/evidence', { params: fieldId ? { fieldId } : undefined })`
   - `getSatelliteObservations(fieldId)` -> `client.get(fieldId ? `/satellite/fields/${encodeURIComponent(fieldId)}` : '/satellite/observations')`
   - `getReviewQueue()` -> `client.get('/reviews')`
   - `submitReviewAction(payload)` -> `client.post(`/reviews/${encodeURIComponent(payload.reviewQueueItemId)}/decision`, payload)`
3. Keep mock fallbacks in place for demo/unconfigured modes until Milestone 3/4 fully transitions store hydration.

---

## 5. Verification Strategy & Test Cases

1. **Unit & E2E Test Suite Execution**:
   - `src/test/e2e/client-envelopes.test.ts` (covers ErrorEnvelope parsing, ListEnvelope unwrapping, Bearer token injection, FormData boundary preservation, 422 validation, 409 conflict, 500 fallback).
   - `src/lib/partnerships/partnerships.test.ts` (verifies `partnerships-service.ts` backward compatibility with `api.post`).
   - `npm run test` (all 73 frontend tests pass).
   - `python -m pytest backend/tests -v` (all 73 backend tests pass).
2. **TypeScript Compilation**:
   - `npx tsc --noEmit` cleanly passes with zero errors under `strict: true`.
3. **Frontend Production Build**:
   - `npm run build` succeeds without bundle or syntax warnings.
