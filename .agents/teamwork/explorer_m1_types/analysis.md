# Milestone 1: TypeScript Types & Error Abstractions Blueprint

**Author**: M1 Types Explorer (`teamwork_explorer`)  
**Target Milestone**: Milestone 1 (Central API Client & Network Infrastructure)  
**Date**: 2026-10-31  
**Verification Baseline**: `npx tsc --noEmit` (0 compilation errors, strict mode compliant)  

---

## 1. Executive Summary

This document specifies the exact TypeScript interfaces, classes, type guards, and error handling abstractions required for the central API client (`src/lib/api/client.ts` and `src/lib/api/types.ts`).

All definitions have been verified against the repository's strict TypeScript configuration in `tsconfig.json`:
- `"strict": true`
- `"noPropertyAccessFromIndexSignature": true`
- `"noUncheckedIndexedAccess": true`
- `"exactOptionalPropertyTypes": true`
- `"noImplicitOverride": true`
- `"noImplicitReturns": true`

The design guarantees **0 typecheck regressions** while seamlessly integrating with:
1. **FastAPI backend JSON responses** (`backend/app/schemas/common.py` and `backend/app/main.py`).
2. **Auth Context (M2)** for Bearer token injection and 401 handling.
3. **Domain Adapters & TerraLedger Store (M3)** for hydration and pagination.
4. **Domain Views (M4)** for UI error and loading state rendering.

---

## 2. Core Specification & Type Contracts

### 2.1 Backend Error Contract & `ErrorEnvelope`

In the backend (`backend/app/schemas/common.py` and exception handlers in `backend/app/main.py`), all errors return a frozen top-level JSON envelope:
```json
{
  "error": {
    "code": "STRING_ERROR_CODE",
    "message": "Human-readable explanation of error.",
    "details": null
  }
}
```

#### TypeScript Definition
```typescript
/**
 * Detailed error payload returned by FastAPI backend.
 * Defined in backend/app/schemas/common.py: ErrorDetail
 */
export interface ErrorDetail {
  code: string;
  message: string;
  details?: unknown | undefined;
}

/**
 * Standard backend JSON error envelope wrapper.
 * Defined in backend/app/schemas/common.py: ErrorEnvelope
 */
export interface ErrorEnvelope {
  error: ErrorDetail;
}

/**
 * Pydantic schema validation error item structure.
 * Occurs when HTTP 422 VALIDATION_ERROR is returned.
 */
export interface ValidationErrorItem {
  type: string;
  loc: (string | number)[];
  msg: string;
  input?: unknown | undefined;
  ctx?: Record<string, unknown> | undefined;
}
```

#### Backend Error Codes Reference Matrix
| Error Code | HTTP Status | Origin / Cause | `details` Type |
|---|---|---|---|
| `UNAUTHENTICATED` | 401 | Missing, malformed, or expired Bearer token | `null` |
| `NOT_FOUND` | 404 | Entity not found or caller role lacks permission (RBAC hide policy) | `null` |
| `FIELD_NOT_FOUND` | 404 | Referenced field ID missing during assessment/activity create | `null` |
| `VALIDATION_ERROR` | 422 | Payload failed Pydantic schema validation | `ValidationErrorItem[]` |
| `RATE_LIMITED` | 429 | Rate limit exceeded (auth: 5/min, explainer: 10/min) | `null` |
| `ALREADY_EXISTS` | 409 | Duplicate entity ID during create | `null` |
| `ALREADY_SUPERSEDED` | 409 | Attempting to supersede an already superseded evidence item | `null` |
| `EMPTY_FILE` | 400 | Uploaded multipart file has size 0 bytes | `null` |
| `FILE_TOO_LARGE` | 413 | Uploaded file exceeds 15 MB limit | `null` |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | File magic bytes do not match JPEG, PNG, PDF, or CSV | `null` |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled server exception | string trace in dev, else `null` |
| `NETWORK_ERROR` | 0 | Client-side fetch failure (connection refused, DNS, offline) | `Error` |

---

### 2.2 The `ApiError` Class

`ApiError` extends standard JavaScript `Error` to preserve the stack trace, while augmenting it with `status: number`, `code: string`, `details?: unknown`, and convenience inspection methods.

#### TypeScript Implementation
```typescript
/**
 * Strongly typed error thrown by ApiClient upon non-2xx HTTP responses or network failures.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown | undefined;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    if (details !== undefined) {
      this.details = details;
    }

    // Maintain proper prototype chain for `instanceof ApiError` checks
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Returns true if error is HTTP 401 Unauthorized or UNAUTHENTICATED.
   */
  public isUnauthorized(): boolean {
    return this.status === 401 || this.code === 'UNAUTHENTICATED';
  }

  /**
   * Returns true if error is HTTP 403 Forbidden.
   */
  public isForbidden(): boolean {
    return this.status === 403 || this.code === 'FORBIDDEN';
  }

  /**
   * Returns true if error is HTTP 404 Not Found or FIELD_NOT_FOUND.
   */
  public isNotFound(): boolean {
    return this.status === 404 || this.code === 'NOT_FOUND' || this.code === 'FIELD_NOT_FOUND';
  }

  /**
   * Returns true if error is HTTP 409 Conflict (e.g. ALREADY_SUPERSEDED, ALREADY_EXISTS).
   */
  public isConflict(): boolean {
    return this.status === 409 || this.code === 'ALREADY_EXISTS' || this.code === 'ALREADY_SUPERSEDED';
  }

  /**
   * Returns true if error is HTTP 429 Rate Limited.
   */
  public isRateLimited(): boolean {
    return this.status === 429 || this.code === 'RATE_LIMITED';
  }

  /**
   * Returns true if error is HTTP 422 Unprocessable Entity / Schema Validation Error.
   */
  public isValidationError(): boolean {
    return this.status === 422 || this.code === 'VALIDATION_ERROR';
  }

  /**
   * Returns true if error represents a client-side network failure (status 0).
   */
  public isNetworkError(): boolean {
    return this.status === 0 || this.code === 'NETWORK_ERROR';
  }

  /**
   * Returns true if error is a 5xx server-side error.
   */
  public isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * Factory method to construct an ApiError from an HTTP status and parsed JSON response.
   */
  public static fromResponse(status: number, body: unknown, fallbackMessage?: string): ApiError {
    if (isErrorEnvelope(body)) {
      return new ApiError(
        status,
        body.error.code,
        body.error.message,
        body.error.details,
      );
    }

    if (typeof body === 'object' && body !== null) {
      const record = body as Record<string, unknown>;
      const code = typeof record['code'] === 'string' ? record['code'] : `HTTP_${status}`;
      const message =
        typeof record['message'] === 'string'
          ? record['message']
          : typeof record['detail'] === 'string'
          ? record['detail']
          : fallbackMessage ?? `Request failed with HTTP status ${status}`;
      const details = record['details'];
      return new ApiError(status, code, message, details);
    }

    return new ApiError(
      status,
      `HTTP_${status}`,
      fallbackMessage ?? `Request failed with HTTP status ${status}`,
      body,
    );
  }

  /**
   * Factory method to construct an ApiError from a caught client-side network error.
   */
  public static fromNetworkError(error: unknown): ApiError {
    const message = error instanceof Error ? error.message : 'Network request failed';
    return new ApiError(0, 'NETWORK_ERROR', message, error);
  }

  /**
   * Serializes error to a JSON-compatible plain object.
   */
  public toJSON(): {
    name: string;
    status: number;
    code: string;
    message: string;
    details?: unknown;
  } {
    const out: {
      name: string;
      status: number;
      code: string;
      message: string;
      details?: unknown;
    } = {
      name: this.name,
      status: this.status,
      code: this.code,
      message: this.message,
    };
    if (this.details !== undefined) {
      out.details = this.details;
    }
    return out;
  }
}
```

---

### 2.3 The `ListEnvelope<T>` Interface

In backend `backend/app/schemas/common.py`, paginated lists return:
```json
{
  "items": [ ... ],
  "total": 128,
  "limit": 50,
  "offset": 0
}
```

#### TypeScript Definition
```typescript
/**
 * Generic paginated list response envelope.
 * Defined in backend/app/schemas/common.py: ListEnvelope[T]
 */
export interface ListEnvelope<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
```

#### Pagination Helper Functions
```typescript
/**
 * Returns true if there are more items beyond the current page offset.
 */
export function hasNextPage<T>(envelope: ListEnvelope<T>): boolean {
  return envelope.offset + envelope.items.length < envelope.total;
}

/**
 * Returns true if the current page offset is greater than 0.
 */
export function hasPreviousPage<T>(envelope: ListEnvelope<T>): boolean {
  return envelope.offset > 0;
}

/**
 * Computes 1-based current page number.
 */
export function getCurrentPage<T>(envelope: ListEnvelope<T>): number {
  const limit = envelope.limit > 0 ? envelope.limit : 50;
  return Math.floor(envelope.offset / limit) + 1;
}

/**
 * Computes total number of pages available.
 */
export function getTotalPages<T>(envelope: ListEnvelope<T>): number {
  const limit = envelope.limit > 0 ? envelope.limit : 50;
  return Math.max(1, Math.ceil(envelope.total / limit));
}
```

---

### 2.4 The `RequestOptions` Interface

To support granular request configuration while keeping code concise:
```typescript
/**
 * Supported HTTP methods for ApiClient.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Options configuring an outgoing ApiClient request.
 */
export interface RequestOptions {
  /**
   * Additional HTTP headers to attach to the request.
   */
  headers?: Record<string, string> | undefined;

  /**
   * URL query parameters to append to the endpoint path.
   * Nullish values (null and undefined) are automatically omitted.
   */
  params?: Record<string, string | number | boolean | null | undefined> | URLSearchParams | undefined;

  /**
   * AbortSignal for request cancellation.
   */
  signal?: AbortSignal | undefined;

  /**
   * Explicit Bearer token override.
   * - If a string is provided: uses this token.
   * - If null is provided: suppresses Authorization header (public request).
   * - If undefined: retrieves stored token from localStorage.
   */
  token?: string | null | undefined;

  /**
   * If true, bypasses Authorization header completely.
   */
  skipAuth?: boolean | undefined;

  /**
   * Optional timeout in milliseconds. If exceeded, request aborts with ApiError('TIMEOUT').
   */
  timeoutMs?: number | undefined;
}
```

#### Query Parameter Serialization Utility
```typescript
/**
 * Serializes a params dictionary or URLSearchParams into a clean query string.
 * Omits keys with null or undefined values.
 */
export function buildQueryString(
  params?: Record<string, string | number | boolean | null | undefined> | URLSearchParams,
): string {
  if (!params) return '';
  if (params instanceof URLSearchParams) {
    const s = params.toString();
    return s ? `?${s}` : '';
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}
```

---

### 2.5 Safe Type Guards

With `"noPropertyAccessFromIndexSignature": true` and `"noUncheckedIndexedAccess": true`, type guards must use bracket notation and null checks:

```typescript
/**
 * Type guard checking if an unknown value conforms to ErrorEnvelope.
 */
export function isErrorEnvelope(value: unknown): value is ErrorEnvelope {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  const errorObj = record['error'];
  if (typeof errorObj !== 'object' || errorObj === null) {
    return false;
  }
  const detail = errorObj as Record<string, unknown>;
  return typeof detail['code'] === 'string' && typeof detail['message'] === 'string';
}

/**
 * Type guard checking if an unknown value conforms to ListEnvelope<T>.
 */
export function isListEnvelope<T = unknown>(value: unknown): value is ListEnvelope<T> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    Array.isArray(record['items']) &&
    typeof record['total'] === 'number' &&
    typeof record['limit'] === 'number' &&
    typeof record['offset'] === 'number'
  );
}

/**
 * Type guard checking if an error is an ApiError instance or compatible shape.
 */
export function isApiError(value: unknown): value is ApiError {
  if (value instanceof ApiError) {
    return true;
  }
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['status'] === 'number' &&
    typeof candidate['code'] === 'string' &&
    typeof candidate['message'] === 'string'
  );
}
```

---

## 3. Strict Mode Compatibility Matrix

| Compiler Rule in `tsconfig.json` | Risk / Failure Mode | Applied Protection Strategy |
|---|---|---|
| `"strict": true` | `null` / `undefined` assignment violations | Strict null checks applied; all constructor fields initialized. |
| `"noPropertyAccessFromIndexSignature": true` | `record.property` errors when accessing `Record<string, unknown>` | All dynamic property accesses use bracket notation `record['prop']`. |
| `"noUncheckedIndexedAccess": true` | Index access produces `T | undefined` | Proper nullish checks (`typeof ... === 'string'`) and default fallbacks applied. |
| `"exactOptionalPropertyTypes": true` | Explicit `{ optProp: undefined }` causes type error if `undefined` not in union | Optional interface properties explicitly typed with `| undefined` union (e.g. `signal?: AbortSignal | undefined`). |
| `"noImplicitOverride": true` | Subclasses overriding methods without `override` keyword cause error | `this.name = 'ApiError'` initialized inside constructor body, avoiding class field override collision. |
| `"noImplicitReturns": true` | Missing return on code branch | Every type guard and helper function returns on 100% of execution paths. |

---

## 4. Complete Code Blueprint for `src/lib/api/types.ts`

Below is the complete, self-contained TypeScript file content designed to be placed at `src/lib/api/types.ts`:

```typescript
/**
 * TerraLedger AI / VirsaFloww — Central API Client Type Definitions
 * 
 * Target: Milestone 1 (Central API Client & Network Infrastructure)
 * Compliant with tsconfig.json strict mode rules.
 */

// ============================================================================
// 1. Error Envelopes & ApiError Abstraction
// ============================================================================

export interface ErrorDetail {
  code: string;
  message: string;
  details?: unknown | undefined;
}

export interface ErrorEnvelope {
  error: ErrorDetail;
}

export interface ValidationErrorItem {
  type: string;
  loc: (string | number)[];
  msg: string;
  input?: unknown | undefined;
  ctx?: Record<string, unknown> | undefined;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown | undefined;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    if (details !== undefined) {
      this.details = details;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public isUnauthorized(): boolean {
    return this.status === 401 || this.code === 'UNAUTHENTICATED';
  }

  public isForbidden(): boolean {
    return this.status === 403 || this.code === 'FORBIDDEN';
  }

  public isNotFound(): boolean {
    return this.status === 404 || this.code === 'NOT_FOUND' || this.code === 'FIELD_NOT_FOUND';
  }

  public isConflict(): boolean {
    return this.status === 409 || this.code === 'ALREADY_EXISTS' || this.code === 'ALREADY_SUPERSEDED';
  }

  public isRateLimited(): boolean {
    return this.status === 429 || this.code === 'RATE_LIMITED';
  }

  public isValidationError(): boolean {
    return this.status === 422 || this.code === 'VALIDATION_ERROR';
  }

  public isNetworkError(): boolean {
    return this.status === 0 || this.code === 'NETWORK_ERROR';
  }

  public isServerError(): boolean {
    return this.status >= 500;
  }

  public static fromResponse(status: number, body: unknown, fallbackMessage?: string): ApiError {
    if (isErrorEnvelope(body)) {
      return new ApiError(
        status,
        body.error.code,
        body.error.message,
        body.error.details,
      );
    }

    if (typeof body === 'object' && body !== null) {
      const record = body as Record<string, unknown>;
      const code = typeof record['code'] === 'string' ? record['code'] : `HTTP_${status}`;
      const message =
        typeof record['message'] === 'string'
          ? record['message']
          : typeof record['detail'] === 'string'
          ? record['detail']
          : fallbackMessage ?? `Request failed with HTTP status ${status}`;
      const details = record['details'];
      return new ApiError(status, code, message, details);
    }

    return new ApiError(
      status,
      `HTTP_${status}`,
      fallbackMessage ?? `Request failed with HTTP status ${status}`,
      body,
    );
  }

  public static fromNetworkError(error: unknown): ApiError {
    const message = error instanceof Error ? error.message : 'Network request failed';
    return new ApiError(0, 'NETWORK_ERROR', message, error);
  }

  public toJSON(): {
    name: string;
    status: number;
    code: string;
    message: string;
    details?: unknown;
  } {
    const out: {
      name: string;
      status: number;
      code: string;
      message: string;
      details?: unknown;
    } = {
      name: this.name,
      status: this.status,
      code: this.code,
      message: this.message,
    };
    if (this.details !== undefined) {
      out.details = this.details;
    }
    return out;
  }
}

// ============================================================================
// 2. Paginated List Envelopes
// ============================================================================

export interface ListEnvelope<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export function hasNextPage<T>(envelope: ListEnvelope<T>): boolean {
  return envelope.offset + envelope.items.length < envelope.total;
}

export function hasPreviousPage<T>(envelope: ListEnvelope<T>): boolean {
  return envelope.offset > 0;
}

export function getCurrentPage<T>(envelope: ListEnvelope<T>): number {
  const limit = envelope.limit > 0 ? envelope.limit : 50;
  return Math.floor(envelope.offset / limit) + 1;
}

export function getTotalPages<T>(envelope: ListEnvelope<T>): number {
  const limit = envelope.limit > 0 ? envelope.limit : 50;
  return Math.max(1, Math.ceil(envelope.total / limit));
}

// ============================================================================
// 3. Request Options & HTTP Mechanics
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  headers?: Record<string, string> | undefined;
  params?: Record<string, string | number | boolean | null | undefined> | URLSearchParams | undefined;
  signal?: AbortSignal | undefined;
  token?: string | null | undefined;
  skipAuth?: boolean | undefined;
  timeoutMs?: number | undefined;
}

export function buildQueryString(
  params?: Record<string, string | number | boolean | null | undefined> | URLSearchParams,
): string {
  if (!params) return '';
  if (params instanceof URLSearchParams) {
    const s = params.toString();
    return s ? `?${s}` : '';
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

// ============================================================================
// 4. Type Guards
// ============================================================================

export function isErrorEnvelope(value: unknown): value is ErrorEnvelope {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  const errorObj = record['error'];
  if (typeof errorObj !== 'object' || errorObj === null) {
    return false;
  }
  const detail = errorObj as Record<string, unknown>;
  return typeof detail['code'] === 'string' && typeof detail['message'] === 'string';
}

export function isListEnvelope<T = unknown>(value: unknown): value is ListEnvelope<T> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    Array.isArray(record['items']) &&
    typeof record['total'] === 'number' &&
    typeof record['limit'] === 'number' &&
    typeof record['offset'] === 'number'
  );
}

export function isApiError(value: unknown): value is ApiError {
  if (value instanceof ApiError) {
    return true;
  }
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['status'] === 'number' &&
    typeof candidate['code'] === 'string' &&
    typeof candidate['message'] === 'string'
  );
}
```

---

## 5. Architectural Recommendations for Milestone Implementers

1. **Placement**:
   - Place definitions in `src/lib/api/types.ts`.
   - In `src/lib/api/client.ts`, re-export everything via:
     ```typescript
     export * from './types';
     ```
   - In `src/lib/api.ts`, re-export `api`, `client`, `ApiError`, `ListEnvelope`, `ErrorEnvelope`.
   - In `src/lib/terra-ledger/types.ts`, re-export `ApiError` from `@/lib/api/types` to ensure uniform typing across legacy and new consumers.

2. **Bearer Token Storage Key**:
   - Standardize on `localStorage.getItem('virsaflow_access_token')` and `localStorage.setItem('virsaflow_access_token', token)`.

3. **Multipart Upload Support**:
   - For `postMultipart<T>(path: string, formData: FormData, options?: RequestOptions)`, DO NOT set `'Content-Type': 'multipart/form-data'`. Let the browser automatically supply the boundary header.

4. **HTTP 401 Session Clearing**:
   - When any request receives HTTP 401 / `UNAUTHENTICATED`, the client should call `localStorage.removeItem('virsaflow_access_token')` and notify the auth context or dispatch an unauthorized event.
