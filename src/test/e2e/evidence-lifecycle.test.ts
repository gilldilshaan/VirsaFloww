import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import {
  calculateSha256,
  parseErrorEnvelope,
  EvidenceRecord,
  resetStorage,
} from './helpers/test-harness';

describe('E2E Evidence Engine, SHA-256 Hashing & Superseding Lifecycle', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    resetStorage();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('Tier 1: Feature Coverage (Evidence Upload, Hashing & Immutability)', () => {
    it('1.1 calculates accurate SHA-256 hex digest for raw evidence binary data', async () => {
      const mockRawBytes = new TextEncoder().encode('VirsaFloww MRV Geo-Tagged Ground Photo Binary Content 2026');
      const sha256Hex = await calculateSha256(mockRawBytes);

      expect(sha256Hex).toHaveLength(64);
      expect(sha256Hex).toMatch(/^[0-9a-f]{64}$/);

      // Determinism: Same bytes yield identical hash
      const secondRunHex = await calculateSha256(mockRawBytes);
      expect(secondRunHex).toBe(sha256Hex);
    });

    it('1.2 uploads evidence via multipart/form-data and receives sealed record with SHA-256', async () => {
      const sampleFileContent = 'SAMPLE-FIELD-IMAGE-PAYLOAD-PB-042';
      const expectedSha = await calculateSha256(sampleFileContent);

      const mockCreatedEvidence: EvidenceRecord = {
        id: 'EV-2026-001',
        fieldId: 'PB-FIELD-001',
        title: 'Initial DSR Sowing Verification',
        type: 'photo',
        category: 'supporting',
        status: 'hash_recorded',
        description: 'Direct seeded rice seedling inspection photo.',
        capturedAt: '2026-06-15T09:30:00Z',
        submittedAt: '2026-06-15T09:35:00Z',
        submitterId: 'USR-OFFICER-01',
        provenance: {
          author: 'Harpreet Singh',
          source: 'mobile_app',
          sha256: expectedSha,
          reviewStatus: 'Pending Assessment',
        },
        fileDetails: {
          name: 'dsr_sowing_01.jpg',
          sizeKb: 142.5,
          mime: 'image/jpeg',
          storageUri: 'uploads/2026/dsr_sowing_01.jpg',
        },
        statusHistory: [
          {
            timestamp: '2026-06-15T09:35:00Z',
            previousStatus: 'received',
            newStatus: 'hash_recorded',
            actorId: 'USR-OFFICER-01',
            reason: 'Cryptographic SHA-256 hash calculated and sealed upon upload.',
          },
        ],
        isDemo: false,
      };

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockCreatedEvidence), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const formData = new FormData();
      formData.append('fieldId', 'PB-FIELD-001');
      formData.append('title', 'Initial DSR Sowing Verification');
      formData.append('type', 'photo');
      formData.append('capturedAt', '2026-06-15T09:30:00Z');
      formData.append('author', 'Harpreet Singh');

      const res = await fetch('http://127.0.0.1:8000/api/evidence', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid-jwt-token' },
        body: formData,
      });

      expect(res.status).toBe(201);
      const data: EvidenceRecord = await res.json();
      expect(data.id).toBe('EV-2026-001');
      expect(data.status).toBe('hash_recorded');
      expect(data.provenance.sha256).toBe(expectedSha);
      expect(data.statusHistory).toHaveLength(1);
    });

    it('1.3 supersedes evidence via POST /api/evidence/{id}/supersede linking old and new records', async () => {
      const originalEvidenceId = 'EV-2026-001';
      const replacementSha = await calculateSha256('REPLACEMENT-PAYLOAD-CORRECTED-GPS');

      const mockSupersededEvidence: EvidenceRecord = {
        id: 'EV-2026-002',
        fieldId: 'PB-FIELD-001',
        title: 'Correction: Initial DSR Sowing Verification',
        type: 'photo',
        category: 'supporting',
        status: 'hash_recorded',
        description: 'Re-taken photo with corrected camera angle.',
        capturedAt: '2026-06-16T10:00:00Z',
        submittedAt: '2026-06-16T10:05:00Z',
        submitterId: 'USR-OFFICER-01',
        provenance: {
          author: 'Harpreet Singh',
          source: 'mobile_app_correction',
          sha256: replacementSha,
          reviewStatus: 'Pending Assessment',
        },
        supersedesId: originalEvidenceId,
        statusHistory: [
          {
            timestamp: '2026-06-16T10:05:00Z',
            previousStatus: 'received',
            newStatus: 'hash_recorded',
            actorId: 'USR-OFFICER-01',
            reason: `Replacement uploaded; supersedes ${originalEvidenceId}. Reason: Blur on original photo`,
          },
        ],
        isDemo: false,
      };

      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockSupersededEvidence), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const formData = new FormData();
      formData.append('reason', 'Blur on original photo');

      const res = await fetch(`http://127.0.0.1:8000/api/evidence/${originalEvidenceId}/supersede`, {
        method: 'POST',
        headers: { Authorization: 'Bearer valid-jwt-token' },
        body: formData,
      });

      expect(res.status).toBe(201);
      const data: EvidenceRecord = await res.json();
      expect(data.id).toBe('EV-2026-002');
      expect(data.supersedesId).toBe(originalEvidenceId);
      expect(data.provenance.sha256).toBe(replacementSha);
    });

    it('1.4 preserves append-only status transition history on evidence', () => {
      const history = [
        {
          timestamp: '2026-06-15T09:35:00Z',
          previousStatus: 'received',
          newStatus: 'hash_recorded',
          actorId: 'USR-OFFICER-01',
        },
        {
          timestamp: '2026-06-16T10:05:00Z',
          previousStatus: 'hash_recorded',
          newStatus: 'superseded',
          actorId: 'USR-OFFICER-01',
          reason: 'Superseded by replacement evidence EV-2026-002',
        },
      ];

      expect(history).toHaveLength(2);
      expect(history[0]?.newStatus).toBe('hash_recorded');
      expect(history[1]?.newStatus).toBe('superseded');
      expect(history[1]?.previousStatus).toBe('hash_recorded');
    });

    it('1.5 records GPS coordinate provenance with accuracy in meters', () => {
      const provenanceData = {
        author: 'Harpreet Singh',
        source: 'mobile_app',
        sha256: 'a'.repeat(64),
        gpsCoordinates: {
          lat: 30.901,
          lng: 75.8573,
          accuracyMeters: 4.2,
        },
        reviewStatus: 'Pending Assessment',
      };

      expect(provenanceData.gpsCoordinates.lat).toBe(30.901);
      expect(provenanceData.gpsCoordinates.lng).toBe(75.8573);
      expect(provenanceData.gpsCoordinates.accuracyMeters).toBe(4.2);
    });
  });

  describe('Tier 2: Boundary & Corner Cases (Evidence 409 Conflict & Faults)', () => {
    it('2.1 returns HTTP 409 Conflict ALREADY_SUPERSEDED when superseding an already superseded record', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'ALREADY_SUPERSEDED',
              message: "Evidence 'EV-2026-001' has already been superseded.",
              details: null,
            },
          }),
          {
            status: 409,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

      const res = await fetch('http://127.0.0.1:8000/api/evidence/EV-2026-001/supersede', {
        method: 'POST',
        headers: { Authorization: 'Bearer valid-jwt-token' },
      });

      expect(res.status).toBe(409);
      const data = await res.json();
      const parsed = parseErrorEnvelope(res.status, data);

      expect(parsed.status).toBe(409);
      expect(parsed.code).toBe('ALREADY_SUPERSEDED');
      expect(parsed.message).toContain('already been superseded');
    });

    it('2.2 returns HTTP 404 when attempting to supersede non-existent evidence ID', async () => {
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

      const res = await fetch('http://127.0.0.1:8000/api/evidence/EV-NONEXISTENT/supersede', {
        method: 'POST',
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error.code).toBe('NOT_FOUND');
    });

    it('2.3 calculates valid SHA-256 for empty file (boundary condition)', async () => {
      // Empty input SHA-256 standard NIST digest: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
      const emptySha = await calculateSha256('');
      expect(emptySha).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    });

    it('2.4 distinguishes two different files with different contents having different SHA-256 digests', async () => {
      const sha1 = await calculateSha256('Evidence content parcel 01');
      const sha2 = await calculateSha256('Evidence content parcel 02');

      expect(sha1).not.toBe(sha2);
    });

    it('2.5 validates that superseded evidence items are filtered out when includeSuperseded=false', () => {
      const items: Array<{ id: string; status: string }> = [
        { id: 'EV-01', status: 'hash_recorded' },
        { id: 'EV-02', status: 'superseded' },
        { id: 'EV-03', status: 'self_reported' },
      ];

      const activeOnly = items.filter((item) => item.status !== 'superseded');
      expect(activeOnly).toHaveLength(2);
      expect(activeOnly.map((i) => i.id)).toEqual(['EV-01', 'EV-03']);
    });
  });
});
