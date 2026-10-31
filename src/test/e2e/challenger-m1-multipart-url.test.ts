/**
 * Challenger 2 Stress Test Suite: Milestone 1
 * 
 * Empirically stress-tests:
 * 1. Multipart boundary handling & Content-Type suppression in CentralApiClient and ApiClient.
 * 2. Exhaustive URL resolution combinations and edge cases in resolveApiUrl.
 * 3. 409 Conflict handling on superseding evidence (ALREADY_SUPERSEDED).
 */

import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { resetStorage } from './helpers/test-harness';
import {
  CentralApiClient,
  resolveApiUrl,
  client,
  AUTH_TOKEN_KEY,
} from '../../lib/api/client';
import { ApiClient } from '../../lib/api';
import { ApiError, parseErrorEnvelope } from '../../lib/api/types';

describe('Challenger 2 Empirical Stress Test: Central API Client & Domain Facade', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    if (typeof (globalThis as any).window === 'undefined') {
      (globalThis as any).window = globalThis;
    }
    resetStorage();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  // ==========================================================================
  // 1. Multipart Boundary Handling & Content-Type Suppression
  // ==========================================================================
  describe('1. Multipart Upload & Boundary Handling', () => {
    it('1.1 postMultipart completely omits Content-Type header when no caller headers provided', async () => {
      let capturedHeaders: Headers | null = null;
      let capturedBody: unknown = null;

      globalThis.fetch = vi.fn().mockImplementation(async (_url: string, init?: RequestInit) => {
        capturedHeaders = new Headers(init?.headers);
        capturedBody = init?.body;
        return new Response(JSON.stringify({ id: 'EV-100', status: 'hash_recorded' }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const testClient = new CentralApiClient('http://127.0.0.1:8000');
      const formData = new FormData();
      formData.append('title', 'Ground Photo 1');
      formData.append('fieldId', 'PB-LUD-001');

      await testClient.postMultipart('/evidence', formData);

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(capturedHeaders).not.toBeNull();
      // Crucial: Content-Type MUST NOT be set in headers so browser/fetch sets boundary
      expect(capturedHeaders!.get('Content-Type')).toBeNull();
      expect(capturedHeaders!.has('Content-Type')).toBe(false);
      expect(capturedBody).toBe(formData);
    });

    it('1.2 postMultipart strips explicit caller-provided Content-Type: multipart/form-data', async () => {
      let capturedHeaders: Headers | null = null;

      globalThis.fetch = vi.fn().mockImplementation(async (_url: string, init?: RequestInit) => {
        capturedHeaders = new Headers(init?.headers);
        return new Response(JSON.stringify({ id: 'EV-101' }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const testClient = new CentralApiClient('http://127.0.0.1:8000');
      const formData = new FormData();
      formData.append('title', 'Field Photo');

      // Caller mistakenly provides manual Content-Type header
      await testClient.postMultipart('/evidence', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Custom-Trace': 'trace-12345',
        },
      });

      expect(capturedHeaders).not.toBeNull();
      // Must be stripped to prevent boundary suppression bug
      expect(capturedHeaders!.has('Content-Type')).toBe(false);
      expect(capturedHeaders!.get('Content-Type')).toBeNull();
      // Non-Content-Type headers must be retained
      expect(capturedHeaders!.get('X-Custom-Trace')).toBe('trace-12345');
    });

    it('1.3 postMultipart strips lowercase content-type: application/json', async () => {
      let capturedHeaders: Headers | null = null;

      globalThis.fetch = vi.fn().mockImplementation(async (_url: string, init?: RequestInit) => {
        capturedHeaders = new Headers(init?.headers);
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const testClient = new CentralApiClient('http://127.0.0.1:8000');
      const formData = new FormData();

      await testClient.postMultipart('/evidence', formData, {
        headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer direct-token',
        },
      });

      expect(capturedHeaders!.has('content-type')).toBe(false);
      expect(capturedHeaders!.get('content-type')).toBeNull();
      expect(capturedHeaders!.get('authorization')).toBe('Bearer direct-token');
    });

    it('1.4 postMultipart attaches Bearer token from localStorage to multipart request', async () => {
      localStorage.setItem(AUTH_TOKEN_KEY, 'jwt-token-multipart-test');
      let capturedHeaders: Headers | null = null;

      globalThis.fetch = vi.fn().mockImplementation(async (_url: string, init?: RequestInit) => {
        capturedHeaders = new Headers(init?.headers);
        return new Response(JSON.stringify({ id: 'EV-AUTH' }), { status: 201 });
      });

      const testClient = new CentralApiClient('http://127.0.0.1:8000');
      const formData = new FormData();

      await testClient.postMultipart('/evidence', formData);

      expect(capturedHeaders!.get('Authorization')).toBe('Bearer jwt-token-multipart-test');
      expect(capturedHeaders!.has('Content-Type')).toBe(false);
    });

    it('1.5 postMultipart preserves File attachments and Form text fields in body', async () => {
      let receivedFormData: FormData | null = null;

      globalThis.fetch = vi.fn().mockImplementation(async (_url: string, init?: RequestInit) => {
        receivedFormData = init?.body as FormData;
        return new Response(JSON.stringify({ id: 'EV-FILE' }), { status: 201 });
      });

      const testClient = new CentralApiClient('http://127.0.0.1:8000');
      const formData = new FormData();
      const mockFile = new File(['mock binary image content'], 'photo.jpg', { type: 'image/jpeg' });
      formData.append('file', mockFile);
      formData.append('fieldId', 'PB-FIELD-042');
      formData.append('capturedAt', '2026-06-15T10:00:00Z');
      formData.append('lat', '30.9010');
      formData.append('lng', '75.8573');

      await testClient.postMultipart('/evidence', formData);

      expect(receivedFormData).toBe(formData);
      expect(receivedFormData!.get('fieldId')).toBe('PB-FIELD-042');
      expect(receivedFormData!.get('lat')).toBe('30.9010');
      const retrievedFile = receivedFormData!.get('file') as File;
      expect(retrievedFile.name).toBe('photo.jpg');
      expect(retrievedFile.type).toBe('image/jpeg');
    });

    it('1.6 api.submitEvidence routes through postMultipart in live mode without manual Content-Type', async () => {
      let capturedHeaders: Headers | null = null;
      let capturedUrl: string = '';

      globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        capturedUrl = url;
        capturedHeaders = new Headers(init?.headers);
        return new Response(
          JSON.stringify({
            id: 'EV-SUBMITTED',
            fieldId: 'PB-01',
            title: 'Live Soil Test',
            type: 'document',
            category: 'supporting',
            status: 'hash_recorded',
            description: 'Lab results',
            capturedAt: '2026-05-01T00:00:00Z',
            submittedAt: '2026-05-01T01:00:00Z',
            submitterId: 'USR-01',
            provenance: {
              author: 'Agri Officer',
              source: 'portal',
              sha256: 'abc123sha256',
              reviewStatus: 'Pending',
            },
          }),
          { status: 201 }
        );
      });

      const central = new CentralApiClient('http://127.0.0.1:8000');
      const domainApi = new ApiClient(central);
      domainApi.setDemoMode(false);

      const formData = new FormData();
      formData.append('title', 'Live Soil Test');
      formData.append('fieldId', 'PB-01');

      const result = await domainApi.submitEvidence(formData);

      expect(capturedUrl).toBe('http://127.0.0.1:8000/api/evidence');
      expect(capturedHeaders!.has('Content-Type')).toBe(false);
      expect(result.id).toBe('EV-SUBMITTED');
      expect(result.provenance.sha256).toBe('abc123sha256');
    });
  });

  // ==========================================================================
  // 2. URL Resolution Edge Cases
  // ==========================================================================
  describe('2. URL Resolution Edge Cases (resolveApiUrl)', () => {
    const baseUrls = [
      'http://127.0.0.1:8000',
      'http://127.0.0.1:8000/',
      'http://127.0.0.1:8000/api',
      'http://127.0.0.1:8000/api/',
      'http://127.0.0.1:8000///',
      'http://127.0.0.1:8000/api///',
    ];

    const pathCases = [
      { path: '/projects', expectedSuffix: '/api/projects' },
      { path: 'projects', expectedSuffix: '/api/projects' },
      { path: '/api/projects', expectedSuffix: '/api/projects' },
      { path: 'api/projects', expectedSuffix: '/api/projects' },
      { path: '/fields/PB-01', expectedSuffix: '/api/fields/PB-01' },
      { path: 'fields/PB-01', expectedSuffix: '/api/fields/PB-01' },
      { path: '/api/evidence/EV-1/supersede', expectedSuffix: '/api/evidence/EV-1/supersede' },
      { path: 'evidence/EV-1/supersede', expectedSuffix: '/api/evidence/EV-1/supersede' },
    ];

    it('2.1 resolves all combinations of Base URL and Path to canonical /api/... without duplicates', () => {
      for (const base of baseUrls) {
        for (const { path, expectedSuffix } of pathCases) {
          const resolved = resolveApiUrl(path, undefined, base);
          const expected = `http://127.0.0.1:8000${expectedSuffix}`;
          expect(resolved).toBe(expected);
          // Strictly assert NO double /api/api/...
          expect(resolved).not.toContain('/api/api');
          expect(resolved).not.toContain('8000//');
        }
      }
    });

    it('2.2 resolves legacy /api/v1/ and api/v1/ paths to canonical /api/...', () => {
      const v1Paths = [
        '/api/v1/projects',
        'api/v1/projects',
        '/api/v1/fields/PB-01',
        'api/v1/fields/PB-01',
      ];

      for (const p of v1Paths) {
        const resolved = resolveApiUrl(p, undefined, 'http://127.0.0.1:8000');
        expect(resolved).not.toContain('/v1/');
        expect(resolved).not.toContain('/api/api');
        expect(resolved).toMatch(/^http:\/\/127\.0\.0\.1:8000\/api\/(projects|fields\/PB-01)$/);
      }
    });

    it('2.3 preserves absolute URLs without prefixing base URL or /api', () => {
      const absoluteUrls = [
        'https://s3.amazonaws.com/evidence-bucket/raw.jpg',
        'http://storage.internal/files/doc.pdf',
        'https://external-api.gov.in/cadastral/PB-042',
      ];

      for (const url of absoluteUrls) {
        const resolved = resolveApiUrl(url, undefined, 'http://127.0.0.1:8000');
        expect(resolved).toBe(url);
      }
    });

    it('2.4 formats query parameters with params object safely', () => {
      const resolved = resolveApiUrl(
        '/projects',
        { practice: 'DSR', page: 2, active: true, ignoredNull: null, ignoredUndef: undefined },
        'http://127.0.0.1:8000'
      );

      expect(resolved).toContain('http://127.0.0.1:8000/api/projects?');
      expect(resolved).toContain('practice=DSR');
      expect(resolved).toContain('page=2');
      expect(resolved).toContain('active=true');
      expect(resolved).not.toContain('ignoredNull');
      expect(resolved).not.toContain('ignoredUndef');
    });

    it('2.5 appends params using & when path already includes ?query=value', () => {
      const resolved = resolveApiUrl(
        '/projects?status=READY_FOR_VERIFICATION',
        { limit: 25, offset: 50 },
        'http://127.0.0.1:8000'
      );

      expect(resolved).toBe(
        'http://127.0.0.1:8000/api/projects?status=READY_FOR_VERIFICATION&limit=25&offset=50'
      );
      // Ensure only one question mark exists
      expect(resolved.split('?').length).toBe(2);
    });

    it('2.6 supports URLSearchParams instance in params', () => {
      const searchParams = new URLSearchParams();
      searchParams.set('crop', 'rice');
      searchParams.set('season', 'Kharif 2026');

      const resolved = resolveApiUrl('/fields', searchParams, 'http://127.0.0.1:8000');
      expect(resolved).toBe('http://127.0.0.1:8000/api/fields?crop=rice&season=Kharif+2026');
    });

    it('2.7 CentralApiClient.resolveUrl respects instance baseUrl', () => {
      const customClient = new CentralApiClient('https://api.virsaflow.com');
      const url1 = customClient.resolveUrl('/projects');
      const url2 = customClient.resolveUrl('evidence/EV-99');

      expect(url1).toBe('https://api.virsaflow.com/api/projects');
      expect(url2).toBe('https://api.virsaflow.com/api/evidence/EV-99');
    });
  });

  // ==========================================================================
  // 3. 409 Conflict Handling on Superseding Evidence (ALREADY_SUPERSEDED)
  // ==========================================================================
  describe('3. 409 Conflict Handling on Superseding Evidence', () => {
    it('3.1 CentralApiClient.postMultipart throws typed ApiError with status 409 and code ALREADY_SUPERSEDED', async () => {
      const backendConflictResponse = {
        error: {
          code: 'ALREADY_SUPERSEDED',
          message: "Evidence 'EV-2026-001' has already been superseded.",
          details: null,
        },
      };

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(backendConflictResponse), {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const testClient = new CentralApiClient('http://127.0.0.1:8000');
      const formData = new FormData();
      formData.append('reason', 'Retake photo');

      let thrownError: unknown = null;
      try {
        await testClient.postMultipart('/evidence/EV-2026-001/supersede', formData);
      } catch (err) {
        thrownError = err;
      }

      expect(thrownError).toBeInstanceOf(ApiError);
      const apiErr = thrownError as ApiError;
      expect(apiErr.status).toBe(409);
      expect(apiErr.code).toBe('ALREADY_SUPERSEDED');
      expect(apiErr.message).toBe("Evidence 'EV-2026-001' has already been superseded.");
      expect(apiErr.isConflict()).toBe(true);
      expect(apiErr.isNotFound()).toBe(false);
      expect(apiErr.isValidationError()).toBe(false);
    });

    it('3.2 ApiClient.supersedeEvidence converts 409 ALREADY_SUPERSEDED to clear descriptive Error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'ALREADY_SUPERSEDED',
              message: "Evidence 'EV-PB-88' has already been superseded.",
              details: null,
            },
          }),
          {
            status: 409,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const central = new CentralApiClient('http://127.0.0.1:8000');
      const domainApi = new ApiClient(central);
      domainApi.setDemoMode(false);

      const formData = new FormData();
      formData.append('reason', 'Replacement upload');

      await expect(domainApi.supersedeEvidence('EV-PB-88', formData)).rejects.toThrow(
        'Evidence EV-PB-88 has already been superseded.'
      );
    });

    it('3.3 ApiClient.supersedeEvidence propagates non-409 errors (e.g. 404 NOT_FOUND) without converting to superseded message', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'NOT_FOUND',
              message: "Evidence 'EV-NONEXISTENT' not found.",
              details: null,
            },
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const central = new CentralApiClient('http://127.0.0.1:8000');
      const domainApi = new ApiClient(central);
      domainApi.setDemoMode(false);

      const formData = new FormData();
      formData.append('reason', 'Replacement upload');

      let thrown: unknown = null;
      try {
        await domainApi.supersedeEvidence('EV-NONEXISTENT', formData);
      } catch (err) {
        thrown = err;
      }

      expect(thrown).toBeInstanceOf(ApiError);
      const apiErr = thrown as ApiError;
      expect(apiErr.status).toBe(404);
      expect(apiErr.code).toBe('NOT_FOUND');
      expect(apiErr.isNotFound()).toBe(true);
    });

    it('3.4 ApiClient.supersedeEvidence returns sealed replacement record on 201 Created', async () => {
      const mockSupersededPayload = {
        id: 'EV-REPLACEMENT-01',
        fieldId: 'PB-01',
        title: 'Correction: Initial Sowing',
        type: 'photo',
        category: 'supporting',
        status: 'hash_recorded',
        description: 'Clear photo',
        capturedAt: '2026-06-16T10:00:00Z',
        submittedAt: '2026-06-16T10:05:00Z',
        submitterId: 'USR-01',
        supersedesId: 'EV-ORIGINAL-01',
        provenance: {
          author: 'Harpreet Singh',
          source: 'mobile_app_correction',
          sha256: '999abc888def777',
          reviewStatus: 'Pending Assessment',
        },
      };

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockSupersededPayload), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const central = new CentralApiClient('http://127.0.0.1:8000');
      const domainApi = new ApiClient(central);
      domainApi.setDemoMode(false);

      const formData = new FormData();
      formData.append('reason', 'Original was blurry');

      const result = await domainApi.supersedeEvidence('EV-ORIGINAL-01', formData);

      expect(result.id).toBe('EV-REPLACEMENT-01');
      expect(result.supersedesId).toBe('EV-ORIGINAL-01');
      expect(result.provenance.sha256).toBe('999abc888def777');
    });

    it('3.5 parseErrorEnvelope parses raw string or FastAPI detail format for 409 conflict', () => {
      // Test FastAPI HTTPException(status_code=409, detail="Direct string conflict")
      const errFromString = parseErrorEnvelope(409, { detail: 'Direct string conflict' });
      expect(errFromString.status).toBe(409);
      expect(errFromString.message).toBe('Direct string conflict');
      expect(errFromString.isConflict()).toBe(true);

      // Test raw HTML or text on 409
      const errFromHtml = parseErrorEnvelope(409, 'Conflict occurred');
      expect(errFromHtml.status).toBe(409);
      expect(errFromHtml.code).toBe('API_ERROR');
      expect(errFromHtml.isConflict()).toBe(true);
    });
  });

  // ==========================================================================
  // 4. Adversarial Edge Cases & Fault Injection
  // ==========================================================================
  describe('4. Adversarial Edge Cases & Fault Injection', () => {
    it('4.1 postMultipart gracefully wraps network disconnection into typed ApiError (status 0, NETWORK_ERROR)', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch (offline)'));

      const testClient = new CentralApiClient('http://127.0.0.1:8000');
      const formData = new FormData();

      let caught: unknown = null;
      try {
        await testClient.postMultipart('/evidence', formData);
      } catch (err) {
        caught = err;
      }

      expect(caught).toBeInstanceOf(ApiError);
      const apiErr = caught as ApiError;
      expect(apiErr.status).toBe(0);
      expect(apiErr.code).toBe('NETWORK_ERROR');
      expect(apiErr.isNetworkError()).toBe(true);
      expect(apiErr.message).toContain('Failed to fetch');
    });

    it('4.2 postMultipart clears stored JWT token and invokes onUnauthorized callback on 401', async () => {
      localStorage.setItem(AUTH_TOKEN_KEY, 'stale-token');
      const onUnauthorizedMock = vi.fn();

      const testClient = new CentralApiClient('http://127.0.0.1:8000');
      // Configure onUnauthorized callback via clientConfig
      const { configureApiClient } = await import('../../lib/api/client');
      configureApiClient({ onUnauthorized: onUnauthorizedMock });

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: { code: 'UNAUTHENTICATED', message: 'Token has expired.' },
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      );

      const formData = new FormData();
      await expect(testClient.postMultipart('/evidence', formData)).rejects.toThrow();

      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
      expect(onUnauthorizedMock).toHaveBeenCalledTimes(1);
    });

    it('4.3 postMultipart handles 502/503 HTML bad gateway pages without JSON parse explosion', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response('<html><body>502 Bad Gateway: nginx/1.24</body></html>', {
          status: 502,
          headers: { 'Content-Type': 'text/html' },
        })
      );

      const testClient = new CentralApiClient('http://127.0.0.1:8000');
      const formData = new FormData();

      let caught: unknown = null;
      try {
        await testClient.postMultipart('/evidence', formData);
      } catch (err) {
        caught = err;
      }

      expect(caught).toBeInstanceOf(ApiError);
      const apiErr = caught as ApiError;
      expect(apiErr.status).toBe(502);
      expect(apiErr.isServerError()).toBe(true);
    });

    it('4.4 resolveApiUrl handles root /api and / paths cleanly', () => {
      expect(resolveApiUrl('/api', undefined, 'http://127.0.0.1:8000')).toBe(
        'http://127.0.0.1:8000/api'
      );
      expect(resolveApiUrl('api', undefined, 'http://127.0.0.1:8000')).toBe(
        'http://127.0.0.1:8000/api'
      );
      expect(resolveApiUrl('/api/', undefined, 'http://127.0.0.1:8000')).toBe(
        'http://127.0.0.1:8000/api/'
      );
      expect(resolveApiUrl('/', undefined, 'http://127.0.0.1:8000')).toBe(
        'http://127.0.0.1:8000/api/'
      );
    });

    it('4.5 ApiError predicates correctly classify all HTTP status error classes', () => {
      const err401 = new ApiError(401, 'UNAUTHENTICATED', 'Unauthorized');
      expect(err401.isUnauthorized()).toBe(true);
      expect(err401.isForbidden()).toBe(false);

      const err403 = new ApiError(403, 'FORBIDDEN', 'Forbidden');
      expect(err403.isForbidden()).toBe(true);

      const err404 = new ApiError(404, 'NOT_FOUND', 'Not Found');
      expect(err404.isNotFound()).toBe(true);

      const err409 = new ApiError(409, 'ALREADY_SUPERSEDED', 'Conflict');
      expect(err409.isConflict()).toBe(true);

      const err422 = new ApiError(422, 'VALIDATION_ERROR', 'Validation Error', [{ loc: ['body'] }]);
      expect(err422.isValidationError()).toBe(true);
      expect(err422.details).toBeDefined();

      const err429 = new ApiError(429, 'RATE_LIMITED', 'Rate limited');
      expect(err429.isRateLimited()).toBe(true);

      const err500 = new ApiError(500, 'INTERNAL_SERVER_ERROR', 'Server error');
      expect(err500.isServerError()).toBe(true);

      const jsonRepr = err409.toJSON();
      expect(jsonRepr.status).toBe(409);
      expect(jsonRepr.code).toBe('ALREADY_SUPERSEDED');
    });
  });
});
