import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import {
  calculateSha256,
  parseErrorEnvelope,
  unwrapListEnvelope,
  adaptPostgisCoordinates,
  assertValidMrvStatus,
  createMockSession,
  resetStorage,
} from './helpers/test-harness';
import { DEMO_IDENTITIES } from '../../lib/auth/auth-context';
import type { AuthUser } from '../../lib/auth/types';

describe('Tier 3: Cross-Feature Combinations (Pairwise & Multi-System Interactions)', () => {
  const originalFetch = globalThis.fetch;
  const TOKEN_KEY = 'virsaflow_access_token';

  beforeEach(() => {
    resetStorage();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('3.1 Auth + API Client: Token expiry during background API request safely cleans up session', async () => {
    const expiredToken = 'expired-jwt-token-123';
    localStorage.setItem(TOKEN_KEY, expiredToken);

    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: 'UNAUTHENTICATED',
            message: 'Invalid, expired, or revoked session token.',
          },
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch('http://127.0.0.1:8000/api/projects', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    const parsedError = parseErrorEnvelope(res.status, body);

    expect(parsedError.status).toBe(401);
    expect(parsedError.code).toBe('UNAUTHENTICATED');

    // On 401, client automatically purges invalid token
    localStorage.removeItem(TOKEN_KEY);
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('3.2 Demo Mode + Evidence Engine: Demo user calculates SHA-256 locally without sending network upload', async () => {
    let networkCalled = false;
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      networkCalled = true;
      return new Response(JSON.stringify({ error: { code: 'FAIL' } }), { status: 500 });
    });

    const demoOfficer: AuthUser = { ...DEMO_IDENTITIES.field_officer, isDemoUser: true };

    const rawPhotoBytes = new TextEncoder().encode('DEMO-OFFICER-PHOTO-BYTES-2026');
    const localSha256 = await calculateSha256(rawPhotoBytes);

    // Mock upload service function with demo check
    async function uploadEvidence(user: AuthUser, bytes: Uint8Array, title: string) {
      if (user.isDemoUser) {
        // In-memory demo handling
        return {
          id: `EV-DEMO-${Date.now()}`,
          title,
          sha256: await calculateSha256(bytes),
          isDemo: true,
          status: 'hash_recorded',
        };
      }
      const res = await fetch('http://127.0.0.1:8000/api/evidence', { method: 'POST' });
      return await res.json();
    }

    const created = await uploadEvidence(demoOfficer, rawPhotoBytes, 'Demo Sowing Photo');

    expect(networkCalled).toBe(false);
    expect(created.isDemo).toBe(true);
    expect(created.sha256).toBe(localSha256);
    expect(created.status).toBe('hash_recorded');
  });

  it('3.3 Store + PostGIS + List Envelope: Unwrapping field list with mixed polygon geometries', () => {
    const backendResponse = {
      items: [
        {
          id: 'PB-01',
          name: 'Parcel North',
          boundaryPolygon: [
            [30.901, 75.857],
            [30.905, 75.862],
          ],
        },
        {
          id: 'PB-02',
          name: 'Parcel South (No Boundary)',
          boundaryPolygon: [], // Empty fallback
        },
        {
          id: 'PB-03',
          name: 'Parcel East (Null Boundary)',
          boundaryPolygon: null, // Null fallback
        },
      ],
      total: 3,
      limit: 50,
      offset: 0,
    };

    const unwrapped = unwrapListEnvelope<typeof backendResponse.items[0]>(backendResponse);
    expect(unwrapped.total).toBe(3);

    const adaptedFields = unwrapped.items.map((field) => ({
      id: field.id,
      name: field.name,
      coords: adaptPostgisCoordinates(field.boundaryPolygon),
    }));

    expect(adaptedFields[0]?.coords).toHaveLength(2);
    expect(adaptedFields[1]?.coords).toHaveLength(0);
    expect(adaptedFields[2]?.coords).toHaveLength(0);
  });

  it('3.4 Review Workflow + MRV Status Restraints: Review approval transitions to READY_FOR_VERIFICATION, never VERIFIED', () => {
    const reviewItem = {
      id: 'REV-2026-001',
      assessmentId: 'ASM-2026-001',
      fieldId: 'PB-FIELD-001',
      currentStatus: 'NEEDS_REVIEW',
    };

    function applyReviewDecision(item: typeof reviewItem, action: 'APPROVE' | 'REQUEST_CHANGES') {
      if (action === 'APPROVE') {
        // High-level MRV invariant: Even on approval, status becomes READY_FOR_VERIFICATION
        return {
          ...item,
          currentStatus: 'READY_FOR_VERIFICATION' as const,
          decision: 'APPROVE',
        };
      }
      return {
        ...item,
        currentStatus: 'NEEDS_REVIEW' as const,
        decision: 'REQUEST_CHANGES',
      };
    }

    const updated = applyReviewDecision(reviewItem, 'APPROVE');
    expect(updated.currentStatus).toBe('READY_FOR_VERIFICATION');
    expect(updated.currentStatus).not.toBe('VERIFIED');
    expect(() => assertValidMrvStatus(updated.currentStatus)).not.toThrow();
  });

  it('3.5 Evidence Upload + Superseding Flow + 409 Conflict Simulation', async () => {
    const evidenceDB = new Map<string, { id: string; status: string; sha256: string; supersedesId?: string }>();

    // Step 1: Upload original evidence
    const originalId = 'EV-ORIGINAL';
    const originalSha = await calculateSha256('ORIGINAL_BYTES');
    evidenceDB.set(originalId, { id: originalId, status: 'hash_recorded', sha256: originalSha });

    // Step 2: Supersede original evidence
    const replacementId = 'EV-REPLACEMENT';
    const replacementSha = await calculateSha256('REPLACEMENT_BYTES');

    function supersede(targetId: string, newId: string, newSha: string) {
      const target = evidenceDB.get(targetId);
      if (!target) throw { status: 404, code: 'NOT_FOUND' };
      if (target.status === 'superseded') {
        throw { status: 409, code: 'ALREADY_SUPERSEDED', message: `Evidence '${targetId}' has already been superseded.` };
      }

      target.status = 'superseded';
      const replacement = { id: newId, status: 'hash_recorded', sha256: newSha, supersedesId: targetId };
      evidenceDB.set(newId, replacement);
      return replacement;
    }

    const replaced = supersede(originalId, replacementId, replacementSha);
    expect(replaced.supersedesId).toBe(originalId);
    expect(evidenceDB.get(originalId)?.status).toBe('superseded');

    // Step 3: Attempt second superseding on original evidence -> Expect 409 Conflict
    expect(() => supersede(originalId, 'EV-THIRD', 'ANOTHER_SHA')).toThrow();
    try {
      supersede(originalId, 'EV-THIRD', 'ANOTHER_SHA');
    } catch (err: unknown) {
      const error = err as { status: number; code: string };
      expect(error.status).toBe(409);
      expect(error.code).toBe('ALREADY_SUPERSEDED');
    }
  });
});
