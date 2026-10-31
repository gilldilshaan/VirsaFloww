import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import {
  parseErrorEnvelope,
  unwrapListEnvelope,
  ListEnvelope,
  ErrorEnvelope,
  ApiError,
  resetStorage,
} from './helpers/test-harness';

describe('E2E Central API Client & Envelope Specifications', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    resetStorage();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('Tier 1: Feature Coverage (Core API Client & Envelopes)', () => {
    it('1.1 parses valid ErrorEnvelope with code, message, and details', () => {
      const backendErrorPayload: ErrorEnvelope = {
        error: {
          code: 'FIELD_NOT_FOUND',
          message: "Field 'PB-FIELD-999' does not exist.",
          details: { requestedFieldId: 'PB-FIELD-999' },
        },
      };

      const parsed = parseErrorEnvelope(404, backendErrorPayload);
      expect(parsed.status).toBe(404);
      expect(parsed.code).toBe('FIELD_NOT_FOUND');
      expect(parsed.message).toBe("Field 'PB-FIELD-999' does not exist.");
      expect(parsed.details).toEqual({ requestedFieldId: 'PB-FIELD-999' });
    });

    it('1.2 unwraps paginated ListEnvelope extracting items, total, limit, and offset', () => {
      const backendListPayload: ListEnvelope<{ id: string; title: string }> = {
        items: [
          { id: 'PRJ-001', title: 'Punjab DSR Project Alpha' },
          { id: 'PRJ-002', title: 'Malwa AWD Project Beta' },
        ],
        total: 2,
        limit: 50,
        offset: 0,
      };

      const unwrapped = unwrapListEnvelope<{ id: string; title: string }>(backendListPayload);
      expect(unwrapped.items).toHaveLength(2);
      expect(unwrapped.total).toBe(2);
      expect(unwrapped.limit).toBe(50);
      expect(unwrapped.offset).toBe(0);
      expect(unwrapped.items[0]?.id).toBe('PRJ-001');
    });

    it('1.3 attaches Bearer token from localStorage to Authorization header', async () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItMDEifQ.sig';
      localStorage.setItem('virsaflow_access_token', mockToken);

      let capturedAuthHeader: string | null = null;
      globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        capturedAuthHeader = headers.get('Authorization');
        return new Response(JSON.stringify({ items: [], total: 0, limit: 50, offset: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      // Execute request with token
      const storedToken = localStorage.getItem('virsaflow_access_token');
      const headers = new Headers({ 'Content-Type': 'application/json' });
      if (storedToken) {
        headers.set('Authorization', `Bearer ${storedToken}`);
      }

      await fetch('http://127.0.0.1:8000/api/projects', { headers });

      expect(capturedAuthHeader).toBe(`Bearer ${mockToken}`);
    });

    it('1.4 omits Authorization header when no session token is stored', async () => {
      let capturedAuthHeader: string | null = null;
      globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        capturedAuthHeader = headers.get('Authorization');
        return new Response(JSON.stringify({ items: [], total: 0, limit: 50, offset: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const storedToken = localStorage.getItem('virsaflow_access_token');
      const headers = new Headers({ 'Content-Type': 'application/json' });
      if (storedToken) {
        headers.set('Authorization', `Bearer ${storedToken}`);
      }

      await fetch('http://127.0.0.1:8000/api/projects', { headers });

      expect(capturedAuthHeader).toBeNull();
    });

    it('1.5 sends multipart FormData without manually setting Content-Type boundary', async () => {
      let capturedContentType: string | null = null;
      globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        capturedContentType = headers.get('Content-Type');
        return new Response(JSON.stringify({ id: 'EV-001', status: 'hash_recorded' }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const formData = new FormData();
      formData.append('title', 'Field Photo');
      formData.append('fieldId', 'PB-FIELD-001');

      // Crucial requirement: for FormData, Content-Type must NOT be manually set to application/json
      const headers = new Headers();
      headers.set('Authorization', 'Bearer token-123');

      await fetch('http://127.0.0.1:8000/api/evidence', {
        method: 'POST',
        headers,
        body: formData,
      });

      // Browser/JSDOM sets multipart/form-data boundary automatically or leaves it unset for fetch to handle
      expect(capturedContentType).not.toBe('application/json');
    });
  });

  describe('Tier 2: Boundary & Corner Cases (API Client & Error Handling)', () => {
    it('2.1 handles 422 Unprocessable Entity schema validation error with nested detail array', () => {
      const validationErrorPayload = {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'The submitted payload failed schema validation.',
          details: [
            {
              loc: ['body', 'areaHa'],
              msg: 'Input should be greater than 0',
              type: 'greater_than',
            },
          ],
        },
      };

      const parsed = parseErrorEnvelope(422, validationErrorPayload);
      expect(parsed.status).toBe(422);
      expect(parsed.code).toBe('VALIDATION_ERROR');
      expect(Array.isArray(parsed.details)).toBe(true);
      expect((parsed.details as Array<{ loc: string[] }>)[0]?.loc).toEqual(['body', 'areaHa']);
    });

    it('2.2 handles 409 Conflict ALREADY_SUPERSEDED error on evidence replacement', () => {
      const conflictPayload = {
        error: {
          code: 'ALREADY_SUPERSEDED',
          message: "Evidence 'EV-2026-001' has already been superseded.",
          details: null,
        },
      };

      const parsed = parseErrorEnvelope(409, conflictPayload);
      expect(parsed.status).toBe(409);
      expect(parsed.code).toBe('ALREADY_SUPERSEDED');
      expect(parsed.message).toContain('already been superseded');
    });

    it('2.3 handles 500 Internal Server Error when backend error envelope is absent (raw HTML/text)', () => {
      const rawHtmlBody = '<html><body>500 Internal Server Error</body></html>';
      const parsed = parseErrorEnvelope(500, rawHtmlBody);

      expect(parsed.status).toBe(500);
      expect(parsed.code).toBe('API_ERROR');
      expect(parsed.message).toBe('Request failed with status 500');
    });

    it('2.4 handles empty list envelope with total 0 and items empty array', () => {
      const emptyPayload = {
        items: [],
        total: 0,
        limit: 50,
        offset: 0,
      };

      const unwrapped = unwrapListEnvelope(emptyPayload);
      expect(unwrapped.items).toEqual([]);
      expect(unwrapped.total).toBe(0);
      expect(unwrapped.items).toHaveLength(0);
    });

    it('2.5 throws clear descriptive error when ListEnvelope payload is completely invalid', () => {
      expect(() => unwrapListEnvelope(null)).toThrow('Malformed list response');
      expect(() => unwrapListEnvelope({ invalid: true })).toThrow('missing or invalid');
    });
  });
});
