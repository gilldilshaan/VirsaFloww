/**
 * TerraLedger AI — Buyer Portal Data Service & Safe Projection
 *
 * TRUTH & PRIVACY CONSTRAINTS:
 * 1. Never expose farmer PII (names, phone numbers, exact residential coordinates).
 * 2. Never show uncomputed carbon quantities or fabricated prices.
 * 3. Issued credits = 0 for pre-verification pipeline.
 * 4. Assessment status tops out at READY_FOR_VERIFICATION.
 * 5. All data is visibly badged as demo/pre-issuance data.
 */

import type { BuyerProject, BuyerEnquiry, BuyerProfile } from '@/lib/types/buyer';
import { MARKETPLACE_PROJECTS, INITIAL_DUE_DILIGENCE_PIPELINE } from '@/lib/terra-ledger/mock-data';

/**
 * Transforms internal project records into buyer-safe representations.
 * Explicitly omits farmer PII, internal audit comments, and fabricated $/tonne prices.
 */
export function getApprovedBuyerProjects(): BuyerProject[] {
  return MARKETPLACE_PROJECTS.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    location: p.location,
    district: p.district,
    practice: p.practice,
    methodology: p.methodology,
    developer: p.developer,
    totalHectares: p.totalHectares,
    enrolledParcels: p.enrolledParcels,
    farmerCount: p.farmerCount,
    readinessScorePercent: p.readinessScorePercent,
    // Status ceiling: never shows VERIFIED in this build
    assessmentStatus: p.assessmentStatus === 'READY_FOR_VERIFICATION' ? 'READY_FOR_VERIFICATION' : 'NEEDS_REVIEW',
    description: p.description,
    highlights: p.highlights,
    evidenceDepth: {
      satellitePasses: p.evidenceDepth.satellitePasses,
      groundPhotos: p.evidenceDepth.groundPhotos,
      waterLogs: p.evidenceDepth.waterLogs,
    },
  }));
}

/** Get a single approved buyer project by ID */
export function getApprovedBuyerProjectById(id: string): BuyerProject | undefined {
  const all = getApprovedBuyerProjects();
  return all.find((p) => p.id === id || p.slug === id);
}

/** Initial default demo buyer profile */
export const DEFAULT_DEMO_BUYER_PROFILE: BuyerProfile = {
  id: 'BUYER-DEMO-001',
  name: 'Institutional Sustainability Lead',
  organization: 'Global Climate Procurement Corp',
  email: 'sustainability@climateprocurement.com',
  sector: 'Corporate Climate Strategy & Compliance',
  registeredAt: '2026-02-15',
};

const BUYER_ENQUIRIES_STORAGE_KEY = 'terraledger_buyer_enquiries_v1';
let memoryEnquiries: BuyerEnquiry[] | null = null;

/** Load buyer enquiries from local storage or default pipeline */
export function loadBuyerEnquiries(): BuyerEnquiry[] {
  if (memoryEnquiries) {
    return [...memoryEnquiries];
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(BUYER_ENQUIRIES_STORAGE_KEY);
      if (raw) {
        memoryEnquiries = JSON.parse(raw) as BuyerEnquiry[];
        return [...memoryEnquiries];
      }
    } catch {
      // fallback to initial
    }
  }

  const initial: BuyerEnquiry[] = INITIAL_DUE_DILIGENCE_PIPELINE.map((d) => ({
    id: d.id,
    buyerName: d.buyerName,
    buyerOrg: d.buyerOrg,
    projectId: 'PRJ-PB-DSR-01',
    projectTitle: d.projectTitle,
    inquiryDate: d.inquiryDate,
    stage: d.stage === 'Audit Underway' ? 'Under Review' : d.stage === 'Term Sheet' ? 'Response Sent' : (d.stage as any),
    volumeRequestedTons: d.volumeRequestedTons,
    targetRetirementYear: d.targetRetirementYear,
    status: d.status === 'Review Required' ? 'Pending Response' : 'Active',
    message: 'Request for cadastral polygon validation and Sentinel-2 optical coverage logs.',
  }));

  memoryEnquiries = initial;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(BUYER_ENQUIRIES_STORAGE_KEY, JSON.stringify(initial));
    } catch {
      // storage not available
    }
  }

  return [...initial];
}

/** Save a newly submitted enquiry */
export function saveBuyerEnquiry(enquiry: Omit<BuyerEnquiry, 'id' | 'inquiryDate' | 'stage' | 'status'>): BuyerEnquiry {
  const existing = loadBuyerEnquiries();
  const newEnquiry: BuyerEnquiry = {
    ...enquiry,
    id: `DD-INQ-${Date.now().toString().slice(-5)}`,
    inquiryDate: new Date().toISOString().substring(0, 10),
    stage: 'Inquiry',
    status: 'Active',
  };

  const updated = [newEnquiry, ...existing];
  memoryEnquiries = updated;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(BUYER_ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  return newEnquiry;
}

/** Update an existing buyer enquiry (internal triage) */
export function updateBuyerEnquiry(id: string, updates: Partial<BuyerEnquiry>): boolean {
  const current = loadBuyerEnquiries();
  const idx = current.findIndex((e) => e.id === id);
  if (idx === -1) return false;

  const updatedItem: BuyerEnquiry = {
    ...current[idx]!,
    ...updates,
  };

  current[idx] = updatedItem;
  memoryEnquiries = [...current];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(BUYER_ENQUIRIES_STORAGE_KEY, JSON.stringify(memoryEnquiries));
    } catch {
      // ignore
    }
  }

  return true;
}
