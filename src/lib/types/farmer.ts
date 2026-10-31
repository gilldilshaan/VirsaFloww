/**
 * TerraLedger AI — Farmer Portal Types
 *
 * Types specific to the Farmer portal experience.
 * Shared field/evidence types are in terra-ledger/types.ts.
 */

/** Farmer profile as seen by the farmer themselves */
export interface FarmerProfile {
  id: string;
  name: string;
  nameLocal: string | null;
  phone: string;
  district: string;
  state: string;
  language: 'en' | 'pa';
  consentGiven: boolean;
  consentDate: string | null;
  registeredAt: string;
}

/** Farmer's view of their field (simplified from FieldParcel) */
export interface FarmerField {
  id: string;
  name: string;
  code: string;
  district: string;
  areaHa: number;
  areaAcres: number;
  practice: string;
  crop: string;
  season: string;
  coordinates: { lat: number; lng: number };
  /** Current assessment status — never shows 'Verified' in sprint */
  status: 'UNVERIFIED' | 'NEEDS_REVIEW' | 'READY_FOR_VERIFICATION';
}

/** Season record */
export interface SeasonRecord {
  id: string;
  fieldId: string;
  season: string;
  year: number;
  crop: string;
  sowingMethod: string;
  sowingDate: string | null;
  harvestDate: string | null;
  activities: ActivityRecord[];
}

/** Activity within a season */
export interface ActivityRecord {
  id: string;
  seasonId: string;
  type: 'sowing' | 'irrigation' | 'fertilizer' | 'pesticide' | 'harvest' | 'other';
  date: string;
  description: string;
  evidenceIds: string[];
}

/** Evidence upload as seen by the farmer */
export interface FarmerEvidenceUpload {
  id: string;
  fieldId: string;
  type: 'photo' | 'document' | 'log';
  title: string;
  fileName: string;
  uploadedAt: string;
  status: 'uploading' | 'uploaded' | 'processing' | 'accepted' | 'rejected' | 'correction_requested';
  rejectionReason: string | null;
}

/** Notification for the farmer */
export interface FarmerNotification {
  id: string;
  type: 'correction_request' | 'status_update' | 'reminder' | 'info';
  title: string;
  message: string;
  fieldId: string | null;
  read: boolean;
  createdAt: string;
}
