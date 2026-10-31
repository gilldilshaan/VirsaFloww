/**
 * TerraLedger AI / VirsaFloww — Central API Client
 *
 * Authoritative HTTP client for all frontend API communication with FastAPI backend.
 * Provides automatic Bearer token injection, frozen error envelope parsing,
 * paginated list envelope unwrapping, and boundary-safe multipart file uploads.
 */

import type {
  ErrorDetail,
  ErrorEnvelope,
  ValidationErrorItem,
  ListEnvelope,
  HttpMethod,
  RequestOptions,
  RegisterRequest,
} from './types';

import {
  ApiError,
  parseErrorEnvelope,
  unwrapListEnvelope,
  hasNextPage,
  hasPreviousPage,
  getCurrentPage,
  getTotalPages,
  buildQueryString,
  isErrorEnvelope,
  isListEnvelope,
  isApiError,
} from './types';

// Re-export types and values from ./types
export type {
  ErrorDetail,
  ErrorEnvelope,
  ValidationErrorItem,
  ListEnvelope,
  HttpMethod,
  RequestOptions,
  RegisterRequest,
};

export {
  ApiError,
  parseErrorEnvelope,
  unwrapListEnvelope,
  hasNextPage,
  hasPreviousPage,
  getCurrentPage,
  getTotalPages,
  buildQueryString,
  isErrorEnvelope,
  isListEnvelope,
  isApiError,
};

// ============================================================================
// Legacy & Compatibility Types
// ============================================================================

/** Standard API response wrapper for non-throwing callers */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

/** Pagination metadata */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
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
  baseUrl:
    (typeof import.meta !== 'undefined' &&
      (import.meta.env?.['VITE_API_BASE_URL'] || import.meta.env?.['VITE_MRV_API_BASE_URL'])) ||
    '',
  getAuthToken: getStoredToken,
};

let clientConfig: ApiClientConfig = { ...defaultConfig };

/** Configure the API client (call once at app initialization if custom config is needed) */
export function configureApiClient(config: Partial<ApiClientConfig>): void {
  clientConfig = { ...clientConfig, ...config };
}

/** Get current client configuration snapshot */
export function getApiClientConfig(): ApiClientConfig {
  return { ...clientConfig };
}

// ============================================================================
// Token Storage Helpers
// ============================================================================

function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    const g = globalThis as unknown as { localStorage?: Storage };
    if (typeof globalThis !== 'undefined' && g.localStorage) return g.localStorage;
  } catch {
    return null;
  }
  return null;
}

/** Retrieve current JWT token from localStorage */
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

/** Update or clear JWT token in localStorage */
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
  params?: RequestOptions['params'],
  customBaseUrl?: string,
): string {
  let fullUrl: string;

  if (/^https?:\/\//i.test(path)) {
    fullUrl = path;
  } else {
    const configuredBase =
      customBaseUrl !== undefined && customBaseUrl !== ''
        ? customBaseUrl
        : clientConfig.baseUrl ||
          (typeof import.meta !== 'undefined' &&
            (import.meta.env?.['VITE_API_BASE_URL'] || import.meta.env?.['VITE_MRV_API_BASE_URL'])) ||
          'http://127.0.0.1:8000';
    const rawBase = configuredBase.replace(/\/+$/, '');
    const cleanBase = rawBase.endsWith('/api') ? rawBase.slice(0, -4) : rawBase;
    let cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (cleanPath.startsWith('/api/v1/')) {
      cleanPath = cleanPath.replace(/^\/api\/v1\//, '/api/');
    }
    const finalPath = cleanPath.startsWith('/api') ? cleanPath : `/api${cleanPath}`;
    fullUrl = `${cleanBase}${finalPath}`;
  }

  if (params) {
    const query = buildQueryString(params);
    if (query) {
      const separator = fullUrl.includes('?') ? '&' : '?';
      const cleanQuery = query.startsWith('?') ? query.slice(1) : query;
      fullUrl += `${separator}${cleanQuery}`;
    }
  }

  return fullUrl;
}

// ============================================================================
// Envelope Unwrappers & Conversions
// ============================================================================

/** Unwraps items from either a ListEnvelope or a raw array */
export function unwrapList<T>(response: ListEnvelope<T> | T[] | unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }
  if (isListEnvelope<T>(response)) {
    return response.items;
  }
  if (response && typeof response === 'object' && 'items' in response && Array.isArray((response as Record<string, unknown>)['items'])) {
    return (response as Record<string, unknown>)['items'] as T[];
  }
  return [];
}

/** Converts ListEnvelope to legacy PaginatedResponse */
export function toPaginatedResponse<T>(envelope: ListEnvelope<T>): PaginatedResponse<T> {
  const limit = envelope.limit > 0 ? envelope.limit : 50;
  const offset = envelope.offset >= 0 ? envelope.offset : 0;
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
  customBaseUrl?: string,
): Promise<T> {
  const url = resolveApiUrl(path, options?.params, customBaseUrl);

  // Determine auth token
  let token: string | null = null;
  if (options?.token !== undefined) {
    token = options.token;
  } else if (options?.skipAuth) {
    token = null;
  } else if (clientConfig.getAuthToken) {
    token = await clientConfig.getAuthToken();
  } else {
    token = getStoredToken();
  }

  const headers = new Headers(options?.headers);

  // Set Authorization header if token exists and not already set
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const {
    params: _params,
    token: _token,
    skipAuth: _skipAuth,
    timeoutMs,
    signal,
    headers: _headers,
    ...restOptions
  } = options ?? {};

  const fetchInit: RequestInit = {
    ...restOptions,
    method,
    headers,
  };

  if (signal !== undefined && signal !== null) {
    fetchInit.signal = signal;
  } else if (timeoutMs && typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) {
    fetchInit.signal = AbortSignal.timeout(timeoutMs);
  }

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
    throw ApiError.fromNetworkError(err);
  }

  // Handle HTTP failure statuses
  if (!response.ok) {
    if (response.status === 401) {
      clearStoredToken();
      clientConfig.onUnauthorized?.();
    }

    let errorPayload: unknown = null;
    try {
      const rawText = await response.text();
      try {
        errorPayload = JSON.parse(rawText);
      } catch {
        errorPayload = rawText || null;
      }
    } catch {
      errorPayload = null;
    }

    throw parseErrorEnvelope(response.status, errorPayload);
  }

  // Handle successful empty response (e.g. 204 No Content)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null as unknown as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return null as unknown as T;
  }
}

// ============================================================================
// Central Client Class
// ============================================================================

export class CentralApiClient {
  private baseUrl: string;

  constructor(customBaseUrl?: string) {
    const envUrl =
      (typeof import.meta !== 'undefined' &&
        (import.meta.env?.['VITE_API_BASE_URL'] || import.meta.env?.['VITE_MRV_API_BASE_URL'])) ||
      '';
    this.baseUrl = customBaseUrl !== undefined ? customBaseUrl : envUrl;
  }

  public isConfigured(): boolean {
    return Boolean(this.baseUrl && this.baseUrl.trim().length > 0);
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url;
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

  public resolveUrl(path: string, params?: RequestOptions['params']): string {
    return resolveApiUrl(path, params, this.baseUrl);
  }

  public get<T = any>(path: string, options?: RequestOptions): Promise<T> {
    return executeRequest<T>('GET', path, undefined, options, false, this.baseUrl);
  }

  public post<T = any>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return executeRequest<T>('POST', path, body, options, false, this.baseUrl);
  }

  public put<T = any>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return executeRequest<T>('PUT', path, body, options, false, this.baseUrl);
  }

  public patch<T = any>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return executeRequest<T>('PATCH', path, body, options, false, this.baseUrl);
  }

  public delete<T = any>(path: string, options?: RequestOptions): Promise<T> {
    return executeRequest<T>('DELETE', path, undefined, options, false, this.baseUrl);
  }

  public postMultipart<T = any>(
    path: string,
    formData: FormData,
    options?: RequestOptions,
  ): Promise<T> {
    return executeRequest<T>('POST', path, formData, options, true, this.baseUrl);
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
      const data = await executeRequest<T>(method, path, body, options, false, this.baseUrl);
      return { data, error: null, status: 200 };
    } catch (err) {
      if (err instanceof ApiError) {
        return { data: null, error: err, status: err.status };
      }
      const message = err instanceof Error ? err.message : 'Network request failed';
      return { data: null, error: new ApiError(0, 'NETWORK_ERROR', message, err), status: 0 };
    }
  }

  public safeGet<T = any>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.safeRequest<T>('GET', path, undefined, options);
  }

  public safePost<T = any>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.safeRequest<T>('POST', path, body, options);
  }

  public async register<T = any>(payload: unknown, options?: RequestOptions): Promise<T> {
    const res = await this.post<T>('/auth/register', payload, options);
    if (res && typeof res === 'object' && 'accessToken' in res) {
      const token = (res as { accessToken?: string }).accessToken;
      if (token) setStoredToken(token);
    }
    return res;
  }

  public unwrapList<T>(envelope: ListEnvelope<T> | T[] | unknown): T[] {
    return unwrapList<T>(envelope);
  }
}

/** Singleton instance of central client */
export const client = new CentralApiClient();

/** Alias for legacy consumers expecting `api` */
/** Backwards-compatible facade for consumers expecting { data, error, status } response wrapper */
export interface LegacyApiFacade {
  get: <T = any>(path: string, options?: RequestOptions) => Promise<ApiResponse<T>>;
  post: <T = any>(path: string, body?: unknown, options?: RequestOptions) => Promise<ApiResponse<T>>;
  put: <T = any>(path: string, body?: unknown, options?: RequestOptions) => Promise<ApiResponse<T>>;
  patch: <T = any>(path: string, body?: unknown, options?: RequestOptions) => Promise<ApiResponse<T>>;
  delete: <T = any>(path: string, options?: RequestOptions) => Promise<ApiResponse<T>>;
  upload: <T = any>(path: string, formData: FormData, options?: RequestOptions) => Promise<ApiResponse<T>>;
  isConfigured: () => boolean;
  getBaseUrl: () => string;
  setBaseUrl: (url: string) => void;
  getToken: () => string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
  resolveUrl: (path: string, params?: RequestOptions['params']) => string;
  postMultipart: <T = any>(path: string, formData: FormData, options?: RequestOptions) => Promise<T>;
  getList: <T = any>(path: string, options?: RequestOptions) => Promise<ListEnvelope<T>>;
  safeRequest: <T = any>(method: string, path: string, body?: unknown, options?: RequestOptions) => Promise<ApiResponse<T>>;
  safeGet: <T = any>(path: string, options?: RequestOptions) => Promise<ApiResponse<T>>;
  safePost: <T = any>(path: string, body?: unknown, options?: RequestOptions) => Promise<ApiResponse<T>>;
  register: <T = any>(payload: unknown, options?: RequestOptions) => Promise<T>;
  unwrapList: <T>(envelope: ListEnvelope<T> | T[] | unknown) => T[];
}

export const api: LegacyApiFacade = {
  get: <T = any>(path: string, options?: RequestOptions) => client.safeGet<T>(path, options),
  post: <T = any>(path: string, body?: unknown, options?: RequestOptions) => client.safePost<T>(path, body, options),
  put: <T = any>(path: string, body?: unknown, options?: RequestOptions) => client.safeRequest<T>('PUT', path, body, options),
  patch: <T = any>(path: string, body?: unknown, options?: RequestOptions) => client.safeRequest<T>('PATCH', path, body, options),
  delete: <T = any>(path: string, options?: RequestOptions) => client.safeRequest<T>('DELETE', path, undefined, options),
  upload: async <T = any>(path: string, formData: FormData, options?: RequestOptions): Promise<ApiResponse<T>> => {
    try {
      const data = await client.postMultipart<T>(path, formData, options);
      return { data, error: null, status: 200 };
    } catch (err) {
      if (err instanceof ApiError) {
        return { data: null, error: err, status: err.status };
      }
      return {
        data: null,
        error: new ApiError(0, 'UPLOAD_ERROR', err instanceof Error ? err.message : 'Upload failed', err),
        status: 0,
      };
    }
  },
  isConfigured: () => client.isConfigured(),
  getBaseUrl: () => client.getBaseUrl(),
  setBaseUrl: (url: string) => client.setBaseUrl(url),
  getToken: () => client.getToken(),
  setToken: (token: string | null) => client.setToken(token),
  clearToken: () => client.clearToken(),
  resolveUrl: (path: string, params?: RequestOptions['params']) => client.resolveUrl(path, params),
  postMultipart: <T = any>(path: string, formData: FormData, options?: RequestOptions) => client.postMultipart<T>(path, formData, options),
  getList: <T = any>(path: string, options?: RequestOptions) => client.getList<T>(path, options),
  safeRequest: <T = any>(method: string, path: string, body?: unknown, options?: RequestOptions) => client.safeRequest<T>(method, path, body, options),
  safeGet: <T = any>(path: string, options?: RequestOptions) => client.safeGet<T>(path, options),
  safePost: <T = any>(path: string, body?: unknown, options?: RequestOptions) => client.safePost<T>(path, body, options),
  register: <T = any>(payload: unknown, options?: RequestOptions) => client.register<T>(payload, options),
  unwrapList: <T>(envelope: ListEnvelope<T> | T[] | unknown) => client.unwrapList<T>(envelope),
};

/** Alias for `apiClient` */
export const apiClient = client;

export { CentralApiClient as ApiClient };
export default client;
