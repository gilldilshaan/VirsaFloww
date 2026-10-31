/**
 * The Carbon Credit — Industrial & Institutional Partnerships Types
 * Panjdhara Private Limited
 */

export const PARTNERSHIP_INTERESTS = [
  'Industrial environmental infrastructure',
  'Algae-based installations',
  'Agricultural carbon programmes',
  'Urban Climate Infrastructure',
  'CSR partnerships',
  'Government / municipal partnerships',
  'Technology and MRV collaboration',
  'Other',
] as const;

export type PartnershipInterest = (typeof PARTNERSHIP_INTERESTS)[number];

export const ORGANISATION_TYPES = [
  'Manufacturing Company',
  'Industrial Group',
  'Municipal Corporation',
  'Government Department',
  'Infrastructure Company',
  'CSR Foundation',
  'Sustainability / ESG Team',
  'Large Corporate Campus',
  'Smart City / Urban Development Project',
  'Other',
] as const;

export type OrganisationType = (typeof ORGANISATION_TYPES)[number];

export const ENQUIRY_STATUSES = [
  'New',
  'Contacted',
  'Discussion Scheduled',
  'Proposal Sent',
  'Under Negotiation',
  'Approved',
  'Rejected',
  'Closed',
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export interface PartnershipEnquiry {
  id: string; // e.g. TCC-IND-48201
  organisationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  organisationType: OrganisationType;
  industry: string;
  city: string;
  state: string;
  interest: PartnershipInterest;
  estimatedScale: string;
  message: string;
  consent: boolean;
  status: EnquiryStatus;
  assignedOwner?: string;
  internalNotes?: string[];
  submittedAt: string;
  updatedAt: string;
}

export type PartnershipEnquirySubmission = Omit<
  PartnershipEnquiry,
  'id' | 'status' | 'assignedOwner' | 'internalNotes' | 'submittedAt' | 'updatedAt'
>;
