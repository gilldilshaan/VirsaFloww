/**
 * The Carbon Credit — Farmer Portal Data & API Service
 * Mobile-first agricultural field records & evidence synchronization.
 */

import { api } from '@/lib/api/client';
import type {
  FarmerProfile,
  FarmerField,
  ActivityRecord,
  FarmerEvidenceUpload,
  FarmerNotification,
} from '@/lib/types/farmer';

export const DEMO_FARMER_PROFILE: FarmerProfile = {
  id: 'FARMER-PB-042',
  name: 'Gurdev Singh Gill',
  nameLocal: 'ਗੁਰਦੇਵ ਸਿੰਘ ਗਿੱਲ',
  phone: '+91 98141 55678',
  district: 'Ludhiana',
  state: 'Punjab',
  language: 'pa',
  consentGiven: true,
  consentDate: '2026-05-10',
  registeredAt: '2026-05-01',
};

export const INITIAL_FARMER_FIELDS: FarmerField[] = [
  {
    id: 'PB-LUD-042',
    name: 'Gill Agro-Plot 4 (Main DSR Parcel)',
    code: 'PB-LUD-042',
    district: 'Ludhiana',
    areaHa: 4.8,
    areaAcres: 11.86,
    practice: 'Direct Seeded Rice (DSR) + AWD',
    crop: 'PR-126 Basmati / Paddy',
    season: 'Kharif 2026',
    coordinates: { lat: 30.911, lng: 75.837 },
    status: 'READY_FOR_VERIFICATION',
  },
  {
    id: 'PB-LUD-043',
    name: 'Gill Agro-Plot 5 (Canal Side)',
    code: 'PB-LUD-043',
    district: 'Ludhiana',
    areaHa: 2.4,
    areaAcres: 5.93,
    practice: 'Alternate Wetting & Drying (AWD)',
    crop: 'Pusa 1121 Basmati',
    season: 'Kharif 2026',
    coordinates: { lat: 30.914, lng: 75.841 },
    status: 'NEEDS_REVIEW',
  },
];

export const INITIAL_ACTIVITIES: ActivityRecord[] = [
  {
    id: 'ACT-001',
    seasonId: 'KHARIF-2026',
    type: 'irrigation',
    date: '2026-06-12',
    description: 'Pre-sowing (Rauni) irrigation to establish optimal seedbed moisture for direct drilling.',
    evidenceIds: ['EV-004-LOG'],
  },
  {
    id: 'ACT-002',
    seasonId: 'KHARIF-2026',
    type: 'sowing',
    date: '2026-06-15',
    description: 'Direct drilling using tractor-mounted seed-cum-fertilizer drill with calibrated disc openers.',
    evidenceIds: ['EV-003'],
  },
  {
    id: 'ACT-003',
    seasonId: 'KHARIF-2026',
    type: 'other',
    date: '2026-07-14',
    description: 'In-field vegetative emergence inspection and perforated PVC tube installation.',
    evidenceIds: ['EV-005-PHOTO'],
  },
];

export const INITIAL_EVIDENCE_UPLOADS: FarmerEvidenceUpload[] = [
  {
    id: 'EV-005-PHOTO',
    fieldId: 'PB-LUD-042',
    type: 'photo',
    title: 'Geotagged Crop Emergence Photograph',
    fileName: 'IMG_20260714_InField_DSR_Emergence.jpg',
    uploadedAt: '2026-07-14 09:12 UTC',
    status: 'accepted',
    rejectionReason: null,
  },
  {
    id: 'EV-004-LOG',
    fieldId: 'PB-LUD-042',
    type: 'log',
    title: 'Perforated PVC Tube Field Irrigation & Pumping Log',
    fileName: 'PB-LUD-042-AWD-Irrigation-Log.csv',
    uploadedAt: '2026-07-29 11:20 UTC',
    status: 'accepted',
    rejectionReason: null,
  },
  {
    id: 'EV-003',
    fieldId: 'PB-LUD-042',
    type: 'photo',
    title: 'Field Seeding Drill Operation Photograph',
    fileName: 'IMG_20260615_Seeding_DSR.jpg',
    uploadedAt: '2026-06-15 14:10 UTC',
    status: 'correction_requested',
    rejectionReason: 'EXIF coordinates fell outside polygon buffer (+420m offset). Superseded by EV-005-PHOTO.',
  },
];

export const INITIAL_FARMER_NOTIFICATIONS: FarmerNotification[] = [
  {
    id: 'NOTIF-01',
    type: 'status_update',
    title: 'Parcel Assessment Status Updated',
    message: 'Your field PB-LUD-042 has satisfied all initial MRV criteria and is now marked "Ready for Verification".',
    fieldId: 'PB-LUD-042',
    read: false,
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'NOTIF-02',
    type: 'reminder',
    title: 'Mid-Season Sentinel-2 Satellite Observation Pass',
    message: 'ESA Sentinel-2 satellite pass completed successfully. NDWI drying cycle corroborated with irrigation log.',
    fieldId: 'PB-LUD-042',
    read: true,
    createdAt: '2026-07-28T16:30:00Z',
  },
];

const FIELDS_KEY = 'tcc_farmer_fields_v1';
const EVIDENCE_KEY = 'tcc_farmer_evidence_v1';

export function getFarmerProfile(): FarmerProfile {
  return DEMO_FARMER_PROFILE;
}

export function getFarmerFields(): FarmerField[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(FIELDS_KEY);
      if (stored) return JSON.parse(stored) as FarmerField[];
    } catch {}
  }
  return INITIAL_FARMER_FIELDS;
}

export function registerFarmerField(field: Omit<FarmerField, 'id' | 'status'>): FarmerField {
  const fields = getFarmerFields();
  const newField: FarmerField = {
    ...field,
    id: `PB-LUD-${Math.floor(100 + Math.random() * 900)}`,
    status: 'UNVERIFIED',
  };

  const updated = [newField, ...fields];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(FIELDS_KEY, JSON.stringify(updated));
    } catch {}
  }
  return newField;
}

export function getFarmerActivities(): ActivityRecord[] {
  return INITIAL_ACTIVITIES;
}

export function getFarmerEvidenceUploads(): FarmerEvidenceUpload[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(EVIDENCE_KEY);
      if (stored) return JSON.parse(stored) as FarmerEvidenceUpload[];
    } catch {}
  }
  return INITIAL_EVIDENCE_UPLOADS;
}

export function uploadFarmerEvidence(data: {
  fieldId: string;
  type: 'photo' | 'document' | 'log';
  title: string;
  fileName: string;
}): FarmerEvidenceUpload {
  const current = getFarmerEvidenceUploads();
  const newRecord: FarmerEvidenceUpload = {
    id: `EV-UPLOAD-${Date.now().toString().slice(-4)}`,
    fieldId: data.fieldId,
    type: data.type,
    title: data.title,
    fileName: data.fileName,
    uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    status: 'uploaded',
    rejectionReason: null,
  };

  const updated = [newRecord, ...current];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(EVIDENCE_KEY, JSON.stringify(updated));
    } catch {}
  }
  return newRecord;
}

export function getFarmerNotifications(): FarmerNotification[] {
  return INITIAL_FARMER_NOTIFICATIONS;
}
