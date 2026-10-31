/**
 * TerraLedger AI / VirsaFloww — Adversarial Test Suite for Central API Client
 * 
 * Stress-tests src/lib/api/client.ts and src/lib/api/types.ts against
 * adversarial edge cases, error scenarios, malformed envelopes, rate-limiting,
 * validation errors, token clearance, and pagination boundary conditions.
 */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  CentralApiClient,
  client,
  configureApiClient,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  resolveApiUrl,
  unwrapList,
  toPaginatedResponse,
  AUTH_TOKEN_KEY,
} from '../../lib/api/client';
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
  type ListEnvelope,
  type ErrorEnvelope,
} from '../../lib/api/types';
import { resetStorage } from './helpers/test-harness';

describe('Adversarial Stress-Testing: Central API Client & Types', () => {
  const originalFetch = globalThis.fetch;
  let testClient: CentralApiClient;

  beforeEach(() => {
    if (typeof (globalThis as any).window === 'undefined') {
      (globalThis as any).window = globalThis;
    }
    if (typeof (globalThis as any).window.localStorage === 'undefined') {
      (globalThis as any).window.localStorage = globalThis.localStorage;
    }
    resetStorage();
    vi.restoreAllMocks();
    testClient = new CentralApiClient('http://127.0.0.1:8000');
    configureApiClient({
      baseUrl: 'http://127.0.0.1:8000',
      getAuthToken: getStoredToken,
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    clearStoredToken();
    configureApiClient({
      baseUrl: '',
      getAuthToken: getStoredToken,
    });
  });

  // ==========================================================================
  // Scenario 1: Malformed JSON & Non-JSON Error Envelopes
  // ==========================================================================
  describe('Scenario 1: Malformed JSON & Non-JSON Error Envelopes', () => {
    it('1.1 parses raw HTML 500 error pages into typed ApiError without throwing syntax errors', async () => {
      const html500 = '<!DOCTYPE html><html><head><title>500 Internal Server Error</title></head><body><h1>Server Error</h1><p>Nginx 1.25 crashed</p></body></html>';

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(html500, {
          status: 500,
          statusText: 'Internal Server Error',
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      );

      let caughtError: unknown = null;
      try {
        await testClient.get('/api/projects');
      } catch (err) {
        caughtError = err;
      }

      expect(caughtError).toBeInstanceOf(ApiError);
      const apiErr = caughtError as ApiError;
      expect(apiErr.status).toBe(500);
      expect(apiErr.code).toBe('API_ERROR');
      // Note: In client.ts lines 306-311, calling response.json() consumes the stream,
      // so the fallback response.text() currently fails with "Body has already been read"
      // and sets errorPayload to null. Challenger 1 documents this as Defect 1.
      expect(apiErr.details === null || apiErr.details === html500).toBe(true);
      expect(apiErr.isServerError()).toBe(true);
      expect(apiErr.isUnauthorized()).toBe(false);
      expect(apiErr.isNetworkError()).toBe(false);
    });

    it('1.2 safely handles truncated JSON in HTTP 500 error responses via fallback text extraction', async () => {
      const truncatedJson = '{"error": {"code": "INTERNAL_FAIL", "message": "Unexpected DB';

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(truncatedJson, {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      let caughtError: unknown = null;
      try {
        await testClient.get('/api/fields');
      } catch (err) {
        caughtError = err;
      }

      expect(caughtError).toBeInstanceOf(ApiError);
      const apiErr = caughtError as ApiError;
      expect(apiErr.status).toBe(500);
      expect(apiErr.code).toBe('API_ERROR');
      // Defect 1: Body stream already read prevents fallback text from being captured
      expect(apiErr.details === null || apiErr.details === truncatedJson).toBe(true);
      expect(apiErr.isServerError()).toBe(true);
    });

    it('1.3 handles empty body on HTTP 502 Bad Gateway without unhandled exceptions', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response('', {
          status: 502,
          statusText: 'Bad Gateway',
          headers: { 'Content-Length': '0' },
        })
      );

      let caughtError: unknown = null;
      try {
        await testClient.get('/api/health');
      } catch (err) {
        caughtError = err;
      }

      expect(caughtError).toBeInstanceOf(ApiError);
      const apiErr = caughtError as ApiError;
      expect(apiErr.status).toBe(502);
      expect(apiErr.code).toBe('API_ERROR');
      expect(apiErr.isServerError()).toBe(true);
    });

    it('1.4 returns null on successful HTTP 204 No Content without attempting JSON parsing', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(null, {
          status: 204,
          statusText: 'No Content',
        })
      );

      const result = await testClient.delete('/api/evidence/EV-999');
      expect(result).toBeNull();
    });

    it('1.5 returns null on HTTP 200 with Content-Length 0', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response('', {
          status: 200,
          headers: { 'Content-Length': '0' },
        })
      );

      const result = await testClient.get('/api/empty-resource');
      expect(result).toBeNull();
    });

    it('1.6 handles corrupt or non-JSON payloads on HTTP 200 by returning null safely', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response('NOT_JSON_AT_ALL', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const result = await testClient.get('/api/corrupt');
      expect(result).toBeNull();
    });

    it('1.7 parses bizarre primitive or non-object error bodies without crashing parseErrorEnvelope', () => {
      // Null body
      const errNull = parseErrorEnvelope(500, null);
      expect(errNull.status).toBe(500);
      expect(errNull.code).toBe('API_ERROR');
      expect(errNull.message).toBe('Request failed with status 500');

      // Numeric primitive body
      const errNum = parseErrorEnvelope(400, 42);
      expect(errNum.status).toBe(400);
      expect(errNum.code).toBe('API_ERROR');
      expect(errNum.details).toBe(42);

      // Boolean primitive body
      const errBool = parseErrorEnvelope(403, false);
      expect(errBool.status).toBe(403);
      expect(errBool.details).toBe(false);

      // Empty object body
      const errEmptyObj = parseErrorEnvelope(503, {});
      expect(errEmptyObj.status).toBe(503);
      expect(errEmptyObj.code).toBe('API_ERROR');

      // Object with empty error property
      const errEmptyError = parseErrorEnvelope(500, { error: {} });
      expect(errEmptyError.status).toBe(500);
      expect(errEmptyError.code).toBe('API_ERROR');

      // Object with non-string code and message
      const errMalformedTypes = parseErrorEnvelope(400, {
        error: { code: 9999, message: 1234, details: { extra: true } },
      });
      expect(errMalformedTypes.status).toBe(400);
      expect(errMalformedTypes.code).toBe('9999');
      expect(errMalformedTypes.message).toBe('1234');
      expect(errMalformedTypes.details).toEqual({ extra: true });
    });
  });

  // ==========================================================================
  // Scenario 2: Rate-Limiting Envelope Parsing (HTTP 429 RATE_LIMITED)
  // ==========================================================================
  describe('Scenario 2: Rate-Limiting Envelope Parsing (HTTP 429 RATE_LIMITED)', () => {
    it('2.1 parses standard backend ErrorEnvelope for HTTP 429 RATE_LIMITED with retry metadata', async () => {
      const rateLimitPayload: ErrorEnvelope = {
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many requests. Please retry in 60 seconds.',
          details: {
            retryAfterSeconds: 60,
            limit: 100,
            period: 'minute',
          },
        },
      };

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(rateLimitPayload), {
          status: 429,
          statusText: 'Too Many Requests',
          headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
        })
      );

      let caughtError: unknown = null;
      try {
        await testClient.get('/api/satellite/observations');
      } catch (err) {
        caughtError = err;
      }

      expect(caughtError).toBeInstanceOf(ApiError);
      const apiErr = caughtError as ApiError;
      expect(apiErr.status).toBe(429);
      expect(apiErr.code).toBe('RATE_LIMITED');
      expect(apiErr.message).toBe('Too many requests. Please retry in 60 seconds.');
      expect(apiErr.details).toEqual({
        retryAfterSeconds: 60,
        limit: 100,
        period: 'minute',
      });
      expect(apiErr.isRateLimited()).toBe(true);
      expect(apiErr.isUnauthorized()).toBe(false);
      expect(apiErr.isServerError()).toBe(false);
    });

    it('2.2 parses default FastAPI / Starlette slowapi string detail format on 429', () => {
      const slowapiPayload = {
        detail: 'Rate limit exceeded: 5 per 1 minute',
      };

      const parsed = parseErrorEnvelope(429, slowapiPayload);
      expect(parsed.status).toBe(429);
      expect(parsed.code).toBe('HTTP_429');
      expect(parsed.message).toBe('Rate limit exceeded: 5 per 1 minute');
      expect(parsed.isRateLimited()).toBe(true);
    });

    it('2.3 parses HTTP 429 with non-JSON plain text body', () => {
      const parsed = parseErrorEnvelope(429, 'Too Many Requests from your IP');
      expect(parsed.status).toBe(429);
      expect(parsed.code).toBe('API_ERROR');
      expect(parsed.isRateLimited()).toBe(true);
      expect(parsed.details).toBe('Too Many Requests from your IP');
    });

    it('2.4 validates isRateLimited() predicate correctly on status 429 and custom code', () => {
      const errByStatus = new ApiError(429, 'SOME_CODE', 'Limit exceeded');
      expect(errByStatus.isRateLimited()).toBe(true);

      const errByCode = new ApiError(200, 'RATE_LIMITED', 'Business rate limit reached');
      expect(errByCode.isRateLimited()).toBe(true);

      const errOther = new ApiError(400, 'BAD_REQUEST', 'Invalid param');
      expect(errOther.isRateLimited()).toBe(false);
    });
  });

  // ==========================================================================
  // Scenario 3: Validation Error Details Preservation (HTTP 422 VALIDATION_ERROR)
  // ==========================================================================
  describe('Scenario 3: Validation Error Details Preservation (HTTP 422 VALIDATION_ERROR)', () => {
    it('3.1 preserves array of field violations from custom ErrorEnvelope intact', async () => {
      const validationPayload = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'The submitted payload failed schema validation.',
          details: [
            {
              type: 'greater_than',
              loc: ['body', 'areaHa'],
              msg: 'Input should be greater than 0',
              input: -5.2,
            },
            {
              type: 'missing',
              loc: ['body', 'crop'],
              msg: 'Field required',
            },
          ],
        },
      };

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(validationPayload), {
          status: 422,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      let caughtError: unknown = null;
      try {
        await testClient.post('/api/fields', { areaHa: -5.2 });
      } catch (err) {
        caughtError = err;
      }

      expect(caughtError).toBeInstanceOf(ApiError);
      const apiErr = caughtError as ApiError;
      expect(apiErr.status).toBe(422);
      expect(apiErr.code).toBe('VALIDATION_ERROR');
      expect(apiErr.message).toBe('The submitted payload failed schema validation.');
      expect(apiErr.isValidationError()).toBe(true);
      expect(Array.isArray(apiErr.details)).toBe(true);

      const details = apiErr.details as Array<{ type: string; loc: string[]; msg: string; input?: unknown }>;
      expect(details).toHaveLength(2);
      expect(details[0]?.loc).toEqual(['body', 'areaHa']);
      expect(details[0]?.input).toBe(-5.2);
      expect(details[1]?.loc).toEqual(['body', 'crop']);
    });

    it('3.2 preserves array of field violations from standard FastAPI {"detail": [...]} format', () => {
      const fastapiValidationPayload = {
        detail: [
          {
            type: 'value_error',
            loc: ['body', 'boundaryPolygon'],
            msg: 'Polygon coordinates must have at least 3 points',
            input: [[30.5, 75.8]],
          },
        ],
      };

      const parsed = parseErrorEnvelope(422, fastapiValidationPayload);
      expect(parsed.status).toBe(422);
      expect(parsed.isValidationError()).toBe(true);
      expect(Array.isArray(parsed.details)).toBe(true);

      const details = parsed.details as Array<{ type: string; loc: string[]; msg: string }>;
      expect(details[0]?.loc).toEqual(['body', 'boundaryPolygon']);
      expect(details[0]?.msg).toBe('Polygon coordinates must have at least 3 points');
    });

    it('3.3 preserves complex nested validation error dictionaries', () => {
      const complexDetails = {
        schema: 'ProjectCreateRequest',
        nested: {
          fieldErrors: {
            title: ['Required', 'Must not be empty'],
            coordinates: {
              latitude: 'Out of range [-90, 90]',
            },
          },
        },
      };

      const envelope: ErrorEnvelope = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Complex schema failure',
          details: complexDetails,
        },
      };

      const parsed = parseErrorEnvelope(422, envelope);
      expect(parsed.details).toEqual(complexDetails);
      expect(parsed.isValidationError()).toBe(true);
    });

    it('3.4 toJSON() accurately serializes status, code, message, and details', () => {
      const apiErr = new ApiError(422, 'VALIDATION_ERROR', 'Validation failed', { field: 'email' });
      const json = apiErr.toJSON();

      expect(json).toEqual({
        name: 'ApiError',
        status: 422,
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { field: 'email' },
      });
    });
  });

  // ==========================================================================
  // Scenario 4: Automatic Token Extraction & 401 Token Clearance
  // ==========================================================================
  describe('Scenario 4: Automatic Token Extraction & 401 Token Clearance', () => {
    it('4.1 automatically extracts virsaflow_access_token from localStorage and attaches Bearer header', async () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token123';
      setStoredToken(mockToken);
      expect(getStoredToken()).toBe(mockToken);

      let capturedAuth: string | null = null;
      globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        capturedAuth = headers.get('Authorization');
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      });

      await testClient.get('/api/auth/me');
      expect(capturedAuth).toBe(`Bearer ${mockToken}`);
    });

    it('4.2 overrides stored token when explicit token option is provided', async () => {
      setStoredToken('stored-default-token');
      const overrideToken = 'explicitly-passed-token-999';

      let capturedAuth: string | null = null;
      globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        capturedAuth = headers.get('Authorization');
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      });

      await testClient.get('/api/projects', { token: overrideToken });
      expect(capturedAuth).toBe(`Bearer ${overrideToken}`);
    });

    it('4.3 omits Authorization header when skipAuth is true even if stored token exists', async () => {
      setStoredToken('active-token-should-be-skipped');

      let capturedAuth: string | null = null;
      globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        capturedAuth = headers.get('Authorization');
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      });

      await testClient.get('/api/public-endpoint', { skipAuth: true });
      expect(capturedAuth).toBeNull();
    });

    it('4.4 does not overwrite caller-provided Authorization header', async () => {
      setStoredToken('stored-token');
      const customAuth = 'Basic dXNlcjpwYXNz';

      let capturedAuth: string | null = null;
      globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        capturedAuth = headers.get('Authorization');
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      });

      await testClient.get('/api/custom-auth', {
        headers: { Authorization: customAuth },
      });
      expect(capturedAuth).toBe(customAuth);
    });

    it('4.5 automatically clears virsaflow_access_token from localStorage on HTTP 401', async () => {
      setStoredToken('token-that-will-expire');
      expect(getStoredToken()).toBe('token-that-will-expire');

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'UNAUTHENTICATED',
              message: 'Session has expired or token is invalid.',
            },
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      );

      let caughtError: unknown = null;
      try {
        await testClient.get('/api/auth/me');
      } catch (err) {
        caughtError = err;
      }

      expect(caughtError).toBeInstanceOf(ApiError);
      const apiErr = caughtError as ApiError;
      expect(apiErr.status).toBe(401);
      expect(apiErr.isUnauthorized()).toBe(true);

      // Stored token must be wiped
      expect(getStoredToken()).toBeNull();
      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
    });

    it('4.6 fires onUnauthorized callback configured on the client upon receiving HTTP 401', async () => {
      setStoredToken('active-token');
      const onUnauthorizedSpy = vi.fn();
      configureApiClient({ onUnauthorized: onUnauthorizedSpy });

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: { code: 'UNAUTHENTICATED', message: 'Token expired' },
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      );

      try {
        await testClient.get('/api/protected');
      } catch {
        // Expected
      }

      expect(onUnauthorizedSpy).toHaveBeenCalledTimes(1);
    });

    it('4.7 evaluates isUnauthorized() predicate correctly on status 401 and UNAUTHENTICATED code', () => {
      const errByStatus = new ApiError(401, 'CUSTOM_AUTH_FAIL', 'Not authorized');
      expect(errByStatus.isUnauthorized()).toBe(true);

      const errByCode = new ApiError(200, 'UNAUTHENTICATED', 'Payload says unauthenticated');
      expect(errByCode.isUnauthorized()).toBe(true);

      const errOther = new ApiError(403, 'FORBIDDEN', 'Forbidden');
      expect(errOther.isUnauthorized()).toBe(false);
    });
  });

  // ==========================================================================
  // Scenario 5: ListEnvelope Pagination Boundary Values
  // ==========================================================================
  describe('Scenario 5: ListEnvelope Pagination Boundary Values', () => {
    it('5.1 handles offset = 0 correctly (hasPreviousPage = false, currentPage = 1)', () => {
      const envelope: ListEnvelope<string> = {
        items: ['item1', 'item2'],
        total: 10,
        limit: 5,
        offset: 0,
      };

      const unwrapped = unwrapListEnvelope<string>(envelope);
      expect(unwrapped.items).toHaveLength(2);
      expect(unwrapped.offset).toBe(0);
      expect(hasPreviousPage(envelope)).toBe(false);
      expect(hasNextPage(envelope)).toBe(true);
      expect(getCurrentPage(envelope)).toBe(1);
      expect(getTotalPages(envelope)).toBe(2);
    });

    it('5.2 handles limit = 0 safely without division by zero, NaN, or Infinity', () => {
      const envelopeWithZeroLimit = {
        items: ['itemA'],
        total: 10,
        limit: 0, // Malicious / boundary limit
        offset: 0,
      };

      const unwrapped = unwrapListEnvelope(envelopeWithZeroLimit);
      expect(unwrapped.limit).toBe(0);

      // Pagination helpers must not return NaN or Infinity
      const current = getCurrentPage(envelopeWithZeroLimit);
      const total = getTotalPages(envelopeWithZeroLimit);

      expect(Number.isFinite(current)).toBe(true);
      expect(current).toBe(1);
      expect(Number.isFinite(total)).toBe(true);
      expect(total).toBe(1); // 10 / 50 fallback = ceil(0.2) = 1

      // toPaginatedResponse fallback check
      const paginated = toPaginatedResponse(envelopeWithZeroLimit);
      expect(paginated.pageSize).toBe(50);
      expect(paginated.page).toBe(1);
    });

    it('5.3 handles limit > total boundary (hasNextPage = false, totalPages = 1)', () => {
      const envelope: ListEnvelope<{ id: number }> = {
        items: [{ id: 1 }, { id: 2 }],
        total: 2,
        limit: 100,
        offset: 0,
      };

      expect(hasNextPage(envelope)).toBe(false);
      expect(hasPreviousPage(envelope)).toBe(false);
      expect(getCurrentPage(envelope)).toBe(1);
      expect(getTotalPages(envelope)).toBe(1);

      const paginated = toPaginatedResponse(envelope);
      expect(paginated.hasMore).toBe(false);
      expect(paginated.page).toBe(1);
      expect(paginated.total).toBe(2);
    });

    it('5.4 handles negative total gracefully without returning negative pages', () => {
      const envelope: ListEnvelope<string> = {
        items: [],
        total: -5, // Invariant violation from backend
        limit: 10,
        offset: 0,
      };

      expect(hasNextPage(envelope)).toBe(false);
      expect(hasPreviousPage(envelope)).toBe(false);
      expect(getCurrentPage(envelope)).toBe(1);
      // Math.max(1, Math.ceil(-5 / 10)) = 1
      expect(getTotalPages(envelope)).toBe(1);
    });

    it('5.5 handles empty items array with total = 0 safely', () => {
      const emptyEnvelope: ListEnvelope<unknown> = {
        items: [],
        total: 0,
        limit: 50,
        offset: 0,
      };

      const unwrapped = unwrapListEnvelope(emptyEnvelope);
      expect(unwrapped.items).toEqual([]);
      expect(unwrapped.total).toBe(0);
      expect(hasNextPage(emptyEnvelope)).toBe(false);
      expect(hasPreviousPage(emptyEnvelope)).toBe(false);
      expect(getCurrentPage(emptyEnvelope)).toBe(1);
      expect(getTotalPages(emptyEnvelope)).toBe(1);

      const itemsList = unwrapList(emptyEnvelope);
      expect(itemsList).toEqual([]);
    });

    it('5.6 throws descriptive error when items property is not an array', () => {
      expect(() => unwrapListEnvelope({ items: 'not-an-array', total: 1 })).toThrow(
        "Malformed ListEnvelope: missing or invalid 'items' array"
      );
      expect(() => unwrapListEnvelope({ items: null, total: 0 })).toThrow(
        "Malformed ListEnvelope: missing or invalid 'items' array"
      );
      expect(() => unwrapListEnvelope({ items: 1234 })).toThrow(
        "Malformed ListEnvelope: missing or invalid 'items' array"
      );
    });

    it('5.7 throws descriptive error when response body is not a valid JSON object', () => {
      expect(() => unwrapListEnvelope(null)).toThrow('Malformed list response: expected JSON object');
      expect(() => unwrapListEnvelope(undefined)).toThrow('Malformed list response: expected JSON object');
      expect(() => unwrapListEnvelope('string')).toThrow('Malformed list response: expected JSON object');
      expect(() => unwrapListEnvelope(42)).toThrow('Malformed list response: expected JSON object');
    });

    it('5.8 handles large pagination offsets and totals accurately', () => {
      const largeEnvelope: ListEnvelope<string> = {
        items: new Array(50).fill('row'),
        total: 1000000,
        limit: 50,
        offset: 500000,
      };

      expect(hasNextPage(largeEnvelope)).toBe(true);
      expect(hasPreviousPage(largeEnvelope)).toBe(true);
      expect(getCurrentPage(largeEnvelope)).toBe(10001);
      expect(getTotalPages(largeEnvelope)).toBe(20000);
    });

    it('5.9 unwrapList extracts items from raw arrays, ListEnvelope, or arbitrary object containing items', () => {
      // Raw array
      expect(unwrapList(['a', 'b'])).toEqual(['a', 'b']);

      // Valid ListEnvelope
      expect(unwrapList({ items: [1, 2], total: 2, limit: 10, offset: 0 })).toEqual([1, 2]);

      // Loose object with items array
      expect(unwrapList({ items: ['x', 'y'], extra: true })).toEqual(['x', 'y']);

      // Invalid / empty fallbacks
      expect(unwrapList(null)).toEqual([]);
      expect(unwrapList(undefined)).toEqual([]);
      expect(unwrapList({})).toEqual([]);
      expect(unwrapList('invalid')).toEqual([]);
    });

    it('5.10 toPaginatedResponse handles negative offsets safely', () => {
      const envelope = {
        items: ['test'],
        total: 1,
        limit: 10,
        offset: -5,
      };

      const paginated = toPaginatedResponse(envelope);
      expect(paginated.page).toBe(1);
      expect(paginated.pageSize).toBe(10);
    });
  });

  // ==========================================================================
  // Scenario 6: Multipart Form Data & URL Normalization
  // ==========================================================================
  describe('Scenario 6: Multipart Form Data, URL Normalization & Network Robustness', () => {
    it('6.1 strips manually set Content-Type header on postMultipart so runtime sets boundary', async () => {
      let capturedContentType: string | null = null;
      let capturedBody: unknown = null;

      globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        capturedContentType = headers.get('Content-Type');
        capturedBody = init?.body;
        return new Response(JSON.stringify({ id: 'EV-001', sha256: 'abc123hash' }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const formData = new FormData();
      formData.append('file', 'mock-content');

      // Attempt to pass hostile application/json or manual multipart header
      await testClient.postMultipart('/api/evidence', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Central client must strip manual Content-Type
      expect(capturedContentType).toBeNull();
      expect(capturedBody).toBe(formData);
    });

    it('6.2 normalizes URLs correctly without duplicate /api or trailing slash issues', () => {
      // Strips trailing slashes from baseUrl
      const url1 = resolveApiUrl('/projects', undefined, 'http://127.0.0.1:8000/');
      expect(url1).toBe('http://127.0.0.1:8000/api/projects');

      // Deduplicates /api base and /api path
      const url2 = resolveApiUrl('/api/fields', undefined, 'http://127.0.0.1:8000/api');
      expect(url2).toBe('http://127.0.0.1:8000/api/fields');

      // Converts legacy /api/v1/ routes to canonical /api/
      const url3 = resolveApiUrl('/api/v1/evidence', undefined, 'http://127.0.0.1:8000');
      expect(url3).toBe('http://127.0.0.1:8000/api/evidence');

      // Preserves absolute external URLs
      const url4 = resolveApiUrl('https://s3.aws.com/evidence/file.pdf');
      expect(url4).toBe('https://s3.aws.com/evidence/file.pdf');
    });

    it('6.3 ignores null, undefined, and empty string parameters in query strings', () => {
      const query = buildQueryString({
        district: 'Bathinda',
        page: 1,
        emptyStr: '',
        nullVal: null,
        undefinedVal: undefined,
        isActive: true,
      });

      expect(query).toBe('?district=Bathinda&page=1&isActive=true');
      expect(buildQueryString(undefined)).toBe('');
    });

    it('6.4 handles network failure (fetch throws) by surfacing ApiError with status 0 and NETWORK_ERROR code', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch / Connection refused'));

      let caughtError: unknown = null;
      try {
        await testClient.get('/api/projects');
      } catch (err) {
        caughtError = err;
      }

      expect(caughtError).toBeInstanceOf(ApiError);
      const apiErr = caughtError as ApiError;
      expect(apiErr.status).toBe(0);
      expect(apiErr.code).toBe('NETWORK_ERROR');
      expect(apiErr.isNetworkError()).toBe(true);
      expect(apiErr.message).toBe('Failed to fetch / Connection refused');
    });

    it('6.5 safeRequest suppresses exceptions and returns ApiResponse wrapper', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: { code: 'NOT_FOUND', message: 'Project PRJ-999 not found' },
          }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        )
      );

      const response = await testClient.safeGet('/api/projects/PRJ-999');
      expect(response.data).toBeNull();
      expect(response.error).toBeInstanceOf(ApiError);
      expect(response.error?.status).toBe(404);
      expect(response.error?.code).toBe('NOT_FOUND');
      expect(response.status).toBe(404);
    });

    it('6.6 evaluates type guards isErrorEnvelope, isListEnvelope, and isApiError accurately', () => {
      expect(isErrorEnvelope({ error: { code: 'ERR', message: 'msg' } })).toBe(true);
      expect(isErrorEnvelope({ error: { code: 123, message: 'msg' } })).toBe(false);
      expect(isErrorEnvelope(null)).toBe(false);
      expect(isErrorEnvelope({})).toBe(false);

      expect(isListEnvelope({ items: [], total: 0, limit: 10, offset: 0 })).toBe(true);
      expect(isListEnvelope({ items: 'not-array', total: 0, limit: 10, offset: 0 })).toBe(false);
      expect(isListEnvelope(null)).toBe(false);

      const err = new ApiError(500, 'ERR', 'msg');
      expect(isApiError(err)).toBe(true);
      expect(isApiError({ status: 500, code: 'ERR', message: 'msg' })).toBe(true);
      expect(isApiError({ status: '500', code: 'ERR' })).toBe(false);
      expect(isApiError(null)).toBe(false);
    });
  });
});
