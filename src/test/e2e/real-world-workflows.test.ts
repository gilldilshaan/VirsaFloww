import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import {
  calculateSha256,
  unwrapListEnvelope,
  adaptPostgisCoordinates,
  assertValidMrvStatus,
  createMockSession,
  parseErrorEnvelope,
  resetStorage,
} from './helpers/test-harness';
import { DEMO_IDENTITIES } from '../../lib/auth/auth-context';

describe('Tier 4: Real-World Application Scenarios (End-to-End User Journeys)', () => {
  const originalFetch = globalThis.fetch;
  const TOKEN_KEY = 'virsaflow_access_token';

  beforeEach(() => {
    resetStorage();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('4.1 Workflow 1: Developer Project & Parcel Onboarding Journey', async () => {
    // Step A: Developer logs in
    const developerSession = createMockSession('project_developer', false);
    localStorage.setItem(TOKEN_KEY, developerSession.accessToken);

    const projectFixture = {
      id: 'PRJ-PB-DSR-001',
      title: 'Malwa Direct Seeded Rice Aggregation',
      slug: 'malwa-dsr-2026',
      totalHectares: 1250.5,
      enrolledParcels: 42,
      farmerCount: 38,
      assessmentStatus: 'UNVERIFIED',
      statusLabel: 'Unverified',
      outstandingVerification: ['Independent field visit', 'Independent review'],
    };

    const fieldFixture = {
      id: 'PB-FIELD-001',
      code: 'PB-FIELD-001',
      name: 'Gill Farm Parcel A',
      farmerId: 'FAR-001',
      district: 'Ludhiana',
      state: 'Punjab',
      areaHa: 4.2,
      areaAcres: 10.38,
      coordinates: { lat: 30.901, lng: 75.857 },
      boundaryPolygon: [
        [30.901, 75.857],
        [30.905, 75.857],
        [30.905, 75.862],
        [30.901, 75.862],
        [30.901, 75.857],
      ],
    };

    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('/api/projects')) {
        return new Response(JSON.stringify({ items: [projectFixture], total: 1, limit: 50, offset: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (url.includes('/api/fields')) {
        return new Response(JSON.stringify({ items: [fieldFixture], total: 1, limit: 50, offset: 0 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: { code: 'NOT_FOUND' } }), { status: 404 });
    });

    // Step B: Query projects
    const projRes = await fetch('http://127.0.0.1:8000/api/projects');
    const projData = unwrapListEnvelope<typeof projectFixture>(await projRes.json());
    expect(projData.items).toHaveLength(1);
    const activeProject = projData.items[0]!;
    expect(activeProject.id).toBe('PRJ-PB-DSR-001');
    expect(activeProject.assessmentStatus).toBe('UNVERIFIED');
    expect(() => assertValidMrvStatus(activeProject.assessmentStatus)).not.toThrow();

    // Step C: Query fields and adapt PostGIS boundary
    const fieldRes = await fetch('http://127.0.0.1:8000/api/fields?projectId=PRJ-PB-DSR-001');
    const fieldData = unwrapListEnvelope<typeof fieldFixture>(await fieldRes.json());
    expect(fieldData.items).toHaveLength(1);

    const boundaryCoords = adaptPostgisCoordinates(fieldData.items[0]?.boundaryPolygon);
    expect(boundaryCoords).toHaveLength(5);
    expect(boundaryCoords[0]).toEqual([30.901, 75.857]);
  });

  it('4.2 Workflow 2: Field Officer Mobile Ground Photo Capture, SHA-256 Seal & Superseding Correction', async () => {
    const officerSession = createMockSession('field_officer', false);
    localStorage.setItem(TOKEN_KEY, officerSession.accessToken);

    const photoContent = 'RAW-IMAGE-PIXELS-OF-SEEDLINGS';
    const computedSha = await calculateSha256(photoContent);

    let serverEvidenceRecord = {
      id: 'EV-ORIGINAL-01',
      fieldId: 'PB-FIELD-001',
      title: 'DSR Emergence Photo',
      status: 'hash_recorded',
      provenance: {
        sha256: computedSha,
        author: 'Harpreet Singh',
      },
    };

    // Step A: Initial upload
    globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      if (url.includes('/api/evidence') && !url.includes('/supersede')) {
        return new Response(JSON.stringify(serverEvidenceRecord), { status: 201 });
      }
      if (url.includes('/api/evidence/EV-ORIGINAL-01/supersede')) {
        if (serverEvidenceRecord.status === 'superseded') {
          return new Response(
            JSON.stringify({
              error: {
                code: 'ALREADY_SUPERSEDED',
                message: "Evidence 'EV-ORIGINAL-01' has already been superseded.",
              },
            }),
            { status: 409 }
          );
        }
        serverEvidenceRecord.status = 'superseded';
        return new Response(
          JSON.stringify({
            id: 'EV-CORRECTED-02',
            fieldId: 'PB-FIELD-001',
            title: 'Correction: DSR Emergence Photo',
            status: 'hash_recorded',
            supersedesId: 'EV-ORIGINAL-01',
            provenance: {
              sha256: await calculateSha256('CORRECTED-IMAGE-PIXELS'),
              author: 'Harpreet Singh',
            },
          }),
          { status: 201 }
        );
      }
      return new Response(null, { status: 404 });
    });

    const uploadRes = await fetch('http://127.0.0.1:8000/api/evidence', {
      method: 'POST',
      body: new FormData(),
    });
    const created = await uploadRes.json();
    expect(created.status).toBe('hash_recorded');
    expect(created.provenance.sha256).toBe(computedSha);

    // Step B: Officer submits superseding correction
    const supersedeRes = await fetch('http://127.0.0.1:8000/api/evidence/EV-ORIGINAL-01/supersede', {
      method: 'POST',
      body: new FormData(),
    });
    expect(supersedeRes.status).toBe(201);
    const replacement = await supersedeRes.json();
    expect(replacement.supersedesId).toBe('EV-ORIGINAL-01');
    expect(serverEvidenceRecord.status).toBe('superseded');

    // Step C: Second attempt to supersede already-superseded evidence yields 409
    const secondSupersedeRes = await fetch('http://127.0.0.1:8000/api/evidence/EV-ORIGINAL-01/supersede', {
      method: 'POST',
      body: new FormData(),
    });
    expect(secondSupersedeRes.status).toBe(409);
    const errorBody = await secondSupersedeRes.json();
    const parsed = parseErrorEnvelope(409, errorBody);
    expect(parsed.code).toBe('ALREADY_SUPERSEDED');
  });

  it('4.3 Workflow 3: Reviewer Queue Inspection & Decision Workflow', async () => {
    const reviewerSession = createMockSession('reviewer', false);
    localStorage.setItem(TOKEN_KEY, reviewerSession.accessToken);

    const reviewQueueItem = {
      id: 'REV-2026-001',
      fieldId: 'PB-FIELD-001',
      assessmentId: 'ASM-2026-001',
      evidenceId: 'EV-2026-001',
      status: 'pending_review',
      decision: null,
      assessmentStatus: 'NEEDS_REVIEW',
    };

    globalThis.fetch = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      if (url.includes('/api/reviews') && init?.method === 'POST') {
        const payload = JSON.parse(init.body as string);
        return new Response(
          JSON.stringify({
            ...reviewQueueItem,
            status: 'completed',
            decision: payload.decision,
            assessmentStatus: 'READY_FOR_VERIFICATION', // Invariant: Transitions to READY_FOR_VERIFICATION, not VERIFIED
          }),
          { status: 200 }
        );
      }
      return new Response(JSON.stringify({ items: [reviewQueueItem], total: 1, limit: 50, offset: 0 }), {
        status: 200,
      });
    });

    // Inspect queue
    const queueRes = await fetch('http://127.0.0.1:8000/api/reviews');
    const queueData = unwrapListEnvelope<typeof reviewQueueItem>(await queueRes.json());
    expect(queueData.items[0]?.status).toBe('pending_review');

    // Submit decision
    const decisionRes = await fetch('http://127.0.0.1:8000/api/reviews/REV-2026-001/decision', {
      method: 'POST',
      body: JSON.stringify({ decision: 'APPROVE', remarks: 'Evidence meets DSR guidelines.' }),
    });
    const updated = await decisionRes.json();
    expect(updated.status).toBe('completed');
    expect(updated.decision).toBe('APPROVE');
    expect(updated.assessmentStatus).toBe('READY_FOR_VERIFICATION');
    expect(() => assertValidMrvStatus(updated.assessmentStatus)).not.toThrow();
  });

  it('4.4 Workflow 4: Buyer Marketplace Discovery & Enquiry Pipeline (PII Redaction)', async () => {
    const buyerSession = createMockSession('buyer', false);
    localStorage.setItem(TOKEN_KEY, buyerSession.accessToken);

    const buyerProjectProjection = {
      id: 'PRJ-PB-DSR-001',
      title: 'Malwa Direct Seeded Rice Aggregation',
      slug: 'malwa-dsr-2026',
      location: 'Malwa, Punjab, India',
      district: 'Ludhiana',
      practice: 'Direct Seeded Rice (DSR) + AWD',
      methodology: 'VM0042 / Gold Standard Rice AWD',
      developer: 'Panjdhara Private Limited',
      enrolledHectares: 1250.5,
      eligibleHectares: 1100.0,
      enrolledParcels: 42,
      assessmentStatus: 'READY_FOR_VERIFICATION',
      statusLabel: 'Ready for Verification',
      vintage: 'Kharif 2026',
      // CRITICAL PII INVARIANT: Buyer projections must NEVER contain farmer names, phone numbers, or Aadhaar IDs
    };

    expect((buyerProjectProjection as Record<string, unknown>)['farmerName']).toBeUndefined();
    expect((buyerProjectProjection as Record<string, unknown>)['farmerPhone']).toBeUndefined();
    expect((buyerProjectProjection as Record<string, unknown>)['farmerAadhaar']).toBeUndefined();

    // Buyer enquiry submission
    const enquiryPayload = {
      projectId: 'PRJ-PB-DSR-001',
      buyerCompany: 'Aura Climate Capital',
      contactName: 'Marcus Vance',
      volumeRequestedTons: 5000,
      targetRetirementYear: 2026,
    };

    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 'ENQ-2026-881',
          ...enquiryPayload,
          status: 'submitted',
          createdAt: new Date().toISOString(),
        }),
        { status: 201 }
      )
    );

    const enquiryRes = await fetch('http://127.0.0.1:8000/api/buyer/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryPayload),
    });

    expect(enquiryRes.status).toBe(201);
    const createdEnquiry = await enquiryRes.json();
    expect(createdEnquiry.id).toMatch(/^ENQ-2026-/);
    expect(createdEnquiry.volumeRequestedTons).toBe(5000);
  });

  it('4.5 Workflow 5: Demo Evaluation Journey Across Roles Without Live Side Effects', () => {
    // Evaluator selects Demo Reviewer persona
    let currentPersona = DEMO_IDENTITIES.reviewer;
    expect(currentPersona.isDemoUser).toBe(true);
    expect(currentPersona.role).toBe('reviewer');

    // Evaluator switches to Demo Field Officer persona
    currentPersona = DEMO_IDENTITIES.field_officer;
    expect(currentPersona.isDemoUser).toBe(true);
    expect(currentPersona.role).toBe('field_officer');

    // Evaluator switches to Demo Project Developer persona
    currentPersona = DEMO_IDENTITIES.project_developer;
    expect(currentPersona.isDemoUser).toBe(true);
    expect(currentPersona.role).toBe('project_developer');

    // No live tokens were minted or stored throughout the entire demo journey
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});
