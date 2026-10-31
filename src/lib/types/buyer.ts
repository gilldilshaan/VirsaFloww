/**
 * TerraLedger AI — Buyer Portal Types
 *
 * Types specific to the Industry Buyer portal.
 * Buyer-facing data is a SAFE PROJECTION of internal data.
 * NEVER expose farmer PII, internal review notes, or uncomputed metrics.
 */

/** Buyer profile */
export interface BuyerProfile {
  id: string;
  name: string;
  organization: string;
  email: string;
  sector: string;
  registeredAt: string;
}

/**
 * Project as visible to buyers — approved/published data ONLY.
 * This is a safe projection of the internal WorkspaceProject.
 *
 * IMPORTANT: Never show uncomputed carbon quantities or prices.
 * Use "Preliminary estimate: not computed." for any uncomputed metric.
 */
export interface BuyerProject {
  id: string;
  title: string;
  slug: string;
  location: string;
  district: string;
  practice: string;
  methodology: string;
  developer: string;
  totalHectares: number;
  enrolledParcels: number;
  farmerCount: number;
  readinessScorePercent: number;
  assessmentStatus: 'UNVERIFIED' | 'NEEDS_REVIEW' | 'READY_FOR_VERIFICATION';
  description: string;
  highlights: string[];
  /** Evidence depth summary — counts only, no raw evidence */
  evidenceDepth: {
    satellitePasses: number;
    groundPhotos: number;
    waterLogs: number;
  };
}

/** Buyer enquiry record */
export interface BuyerEnquiry {
  id: string;
  buyerName: string;
  buyerOrg: string;
  projectId: string;
  projectTitle: string;
  inquiryDate: string;
  stage: 'Inquiry' | 'Data Room Shared' | 'Under Review' | 'Response Sent';
  volumeRequestedTons: number | null;
  targetRetirementYear: string | null;
  status: 'Active' | 'Pending Response' | 'Closed';
  message: string;
}

/** Form data for submitting a new buyer enquiry */
export interface BuyerEnquirySubmission {
  projectId: string;
  buyerName: string;
  buyerOrg: string;
  message: string;
  volumeRequestedTons: number | null;
  targetRetirementYear: string | null;
}
