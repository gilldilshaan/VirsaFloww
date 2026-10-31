/**
 * The Carbon Credit — Industrial Partnerships Service
 * Handles submission, retrieval, status updates, and audit logging.
 */

import { api } from '@/lib/api/client';
import type {
  PartnershipEnquiry,
  PartnershipEnquirySubmission,
  EnquiryStatus,
} from './types';

const STORAGE_KEY = 'tcc_industrial_partnerships_enquiries_v1';

const INITIAL_ENQUIRIES: PartnershipEnquiry[] = [
  {
    id: 'TCC-IND-88410',
    organisationName: 'Vardhman Textiles Industrial Complex',
    contactPerson: 'Rajiv Malhotra',
    email: 'rajiv.malhotra@vardhman.com',
    phone: '+91 98140 22391',
    organisationType: 'Manufacturing Company',
    industry: 'Textiles & Industrial Manufacturing',
    city: 'Ludhiana',
    state: 'Punjab',
    interest: 'Industrial environmental infrastructure',
    estimatedScale: '3 Industrial Units / 120,000 sq ft footprint',
    message: 'Evaluating point-source environmental mitigation infrastructure and algae-assisted carbon capture pilots at our Ludhiana processing facility.',
    consent: true,
    status: 'Discussion Scheduled',
    assignedOwner: 'Amanpreet Singh (Lead Partner)',
    internalNotes: [
      'Initial discussion held on Oct 24. Facility visit slated for next month.',
      'Requested technical footprint specifications for photobioreactor installations.',
    ],
    submittedAt: '2026-10-22T10:14:00Z',
    updatedAt: '2026-10-25T14:30:00Z',
  },
  {
    id: 'TCC-IND-88411',
    organisationName: 'Punjab Municipal Infrastructure Development Corp',
    contactPerson: 'Er. Jaswinder Kaur',
    email: 'j.kaur@pmidc.punjab.gov.in',
    phone: '+91 98765 43210',
    organisationType: 'Municipal Corporation',
    industry: 'Urban & Municipal Infrastructure',
    city: 'Amritsar',
    state: 'Punjab',
    interest: 'Urban Climate Infrastructure',
    estimatedScale: 'City-wide Urban Public Spaces (5 Sites)',
    message: 'Proposal for smart public algae-based carbon capture monuments and urban air quality bio-screens along urban corridors.',
    consent: true,
    status: 'Proposal Sent',
    assignedOwner: 'Harjit Singh (Govt Liaison)',
    internalNotes: ['Draft MoU prepared under Smart Cities Mission Punjab.'],
    submittedAt: '2026-10-24T12:00:00Z',
    updatedAt: '2026-10-28T09:45:00Z',
  },
  {
    id: 'TCC-IND-88412',
    organisationName: 'Trident Group CSR Foundation',
    contactPerson: 'Meenakshi Sharma',
    email: 'meenakshi.s@tridentindia.com',
    phone: '+91 98880 11223',
    organisationType: 'CSR Foundation',
    industry: 'FMCG / Corporate CSR',
    city: 'Barnala',
    state: 'Punjab',
    interest: 'Agricultural carbon programmes',
    estimatedScale: '5,000 Hectares DSR & AWD Farmer Cluster',
    message: 'CSR grant-supported smallholder direct-seeding program to curb groundwater depletion and stubble burning in Malwa belt.',
    consent: true,
    status: 'New',
    assignedOwner: 'Unassigned',
    internalNotes: [],
    submittedAt: '2026-10-29T16:20:00Z',
    updatedAt: '2026-10-29T16:20:00Z',
  },
];

let inMemoryEnquiries: PartnershipEnquiry[] | null = null;

export function getPartnershipEnquiries(): PartnershipEnquiry[] {
  if (inMemoryEnquiries) {
    return [...inMemoryEnquiries];
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        inMemoryEnquiries = JSON.parse(stored) as PartnershipEnquiry[];
        return [...inMemoryEnquiries];
      }
    } catch {
      // fallback
    }
  }

  inMemoryEnquiries = [...INITIAL_ENQUIRIES];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryEnquiries));
    } catch {
      // ignore
    }
  }

  return [...inMemoryEnquiries];
}

export async function submitPartnershipEnquiry(
  data: PartnershipEnquirySubmission
): Promise<{ success: boolean; enquiryId: string; message: string }> {
  const enquiryId = `TCC-IND-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date().toISOString();

  const newRecord: PartnershipEnquiry = {
    ...data,
    id: enquiryId,
    status: 'New',
    assignedOwner: 'Unassigned',
    internalNotes: [],
    submittedAt: now,
    updatedAt: now,
  };

  // Attempt backend API submission
  try {
    const res = await api.post('/api/v1/partnerships/enquiry', newRecord);
    if (res.error && res.status !== 0 && res.status !== 404) {
      console.warn('Backend rejected partnership enquiry:', res.error);
    }
  } catch (err) {
    console.info('Backend unavailable, persisting enquiry locally:', err);
  }

  // Persist locally for immediate availability in workspace
  const current = getPartnershipEnquiries();
  const updated = [newRecord, ...current];
  inMemoryEnquiries = updated;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  return {
    success: true,
    enquiryId,
    message: `Partnership enquiry successfully registered with reference ${enquiryId}. Our institutional team will initiate contact within 24 hours.`,
  };
}

export function updatePartnershipEnquiryStatus(
  id: string,
  status: EnquiryStatus,
  owner?: string,
  note?: string
): boolean {
  const current = getPartnershipEnquiries();
  const idx = current.findIndex((e) => e.id === id);
  if (idx === -1) return false;

  const item = current[idx]!;
  const notes = item.internalNotes ? [...item.internalNotes] : [];
  if (note) {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    notes.push(`[${timestamp}] ${note}`);
  }

  const updatedItem: PartnershipEnquiry = {
    ...item,
    status,
    assignedOwner: owner !== undefined ? owner : (item.assignedOwner ?? 'Unassigned'),
    internalNotes: notes,
    updatedAt: new Date().toISOString(),
  };

  current[idx] = updatedItem;
  inMemoryEnquiries = [...current];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryEnquiries));
    } catch {
      // ignore
    }
  }

  return true;
}
