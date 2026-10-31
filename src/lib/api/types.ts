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

  constructor(
    statusOrMessage: number | string,
    codeOrStatus?: string | number,
    messageOrCode?: string,
    details?: unknown,
  ) {
    let status: number;
    let code: string;
    let message: string;

    if (typeof statusOrMessage === 'number') {
      // Signature: (status: number, code: string, message: string, details?: unknown)
      status = statusOrMessage;
      code = typeof codeOrStatus === 'string' ? codeOrStatus : 'API_ERROR';
      message = typeof messageOrCode === 'string' ? messageOrCode : `Request failed with status ${status}`;
    } else {
      // Signature: (message: string, code?: string, status?: number, details?: unknown)
      message = statusOrMessage;
      code = typeof codeOrStatus === 'string' ? codeOrStatus : 'API_ERROR';
      status = typeof codeOrStatus === 'number' ? codeOrStatus : (typeof messageOrCode === 'number' ? messageOrCode : 0);
    }

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

/**
 * Safely parses backend ErrorEnvelope format into a strongly typed ApiError instance.
 */
export function parseErrorEnvelope(status: number, responseBody: unknown): ApiError {
  const defaultMessage = `Request failed with status ${status}`;
  if (!responseBody || typeof responseBody !== 'object') {
    return new ApiError(status, 'API_ERROR', defaultMessage, responseBody);
  }

  const envelope = responseBody as Record<string, unknown>;
  if (envelope['error'] && typeof envelope['error'] === 'object') {
    const errorDetail = envelope['error'] as Record<string, unknown>;
    const code = String(errorDetail['code'] ?? 'API_ERROR');
    const message = String(errorDetail['message'] ?? defaultMessage);
    const details = errorDetail['details'];
    return new ApiError(status, code, message, details);
  }

  if (envelope['detail'] !== undefined) {
    if (typeof envelope['detail'] === 'object' && envelope['detail'] !== null) {
      const detailObj = envelope['detail'] as Record<string, unknown>;
      const code = String(detailObj['code'] ?? (envelope['code'] ?? 'API_ERROR'));
      const message = String(detailObj['message'] ?? defaultMessage);
      const details = detailObj['details'] ?? envelope['detail'];
      return new ApiError(status, code, message, details);
    }
    const message = String(envelope['detail']);
    const code = String(envelope['code'] ?? `HTTP_${status}`);
    return new ApiError(status, code, message, envelope['details']);
  }

  const code = String(envelope['code'] ?? 'API_ERROR');
  const message = String(envelope['message'] ?? defaultMessage);
  const details = envelope['details'];
  return new ApiError(status, code, message, details);
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

export function unwrapListEnvelope<T = unknown>(responseBody: unknown): ListEnvelope<T> {
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

export interface RequestOptions extends Omit<RequestInit, 'body' | 'headers' | 'signal'> {
  headers?: Record<string, string> | Headers | undefined;
  params?: Record<string, string | number | boolean | null | undefined> | URLSearchParams | undefined;
  signal?: AbortSignal | null | undefined;
  token?: string | null | undefined;
  skipAuth?: boolean | undefined;
  timeoutMs?: number | undefined;
}

export function buildQueryString(
  params?: Record<string, string | number | boolean | null | undefined> | URLSearchParams | undefined,
): string {
  if (!params) return '';
  if (params instanceof URLSearchParams) {
    const s = params.toString();
    return s ? `?${s}` : '';
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
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


export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  organization?: string | undefined;
  buyerCompanyId?: string | undefined;
}
