/**
 * TerraLedger AI — Typed API Client
 *
 * Centralized HTTP client for all portal API calls.
 * In the current sprint, the backend uses in-memory JSON.
 * This client establishes the typed contract boundary so that
 * when PostgreSQL + PostGIS replaces the in-memory store,
 * only this file needs to change.
 *
 * SECURITY: The API client sends the auth token with every request.
 * The backend MUST independently verify authorization.
 */

/** Standard API response wrapper */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

/** Pagination metadata */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * API client configuration.
 * In production, baseUrl comes from environment.
 * Auth token is injected from the active session.
 */
interface ApiClientConfig {
  baseUrl: string;
  getAuthToken: () => Promise<string | null>;
}

const defaultConfig: ApiClientConfig = {
  baseUrl: import.meta.env['VITE_API_BASE_URL'] ?? '/api',
  getAuthToken: async () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('virsaflow_access_token');
    }
    return null;
  },
};

let clientConfig = defaultConfig;

/** Configure the API client (call once at app initialization) */
export function configureApiClient(config: Partial<ApiClientConfig>): void {
  clientConfig = { ...defaultConfig, ...config };
}

/** Make an authenticated API request */
async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const token = await clientConfig.getAuthToken();
  const url = `${clientConfig.baseUrl}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const fetchInit: RequestInit = {
      method,
      headers,
    };

    if (body !== undefined) {
      fetchInit.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchInit);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({})) as Record<string, unknown>;
      return {
        data: null,
        error: {
          code: String(errorBody['code'] ?? 'API_ERROR'),
          message: String(errorBody['message'] ?? `Request failed with status ${response.status}`),
          details: errorBody['details'] ? String(errorBody['details']) : '',
        },
        status: response.status,
      };
    }

    const data = (await response.json()) as T;
    return { data, error: null, status: response.status };
  } catch (err) {
    return {
      data: null,
      error: {
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Network request failed',
      },
      status: 0,
    };
  }
}

/** Typed API methods */
export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
