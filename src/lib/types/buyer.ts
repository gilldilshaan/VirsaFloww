export interface BuyerInquiryPayload {
  buyerName: string;
  buyerOrg: string;
  projectTitle: string;
  volumeRequestedTons: number;
  targetRetirementYear: string;
}

export interface BuyerProfile {
  id: string;
  organizationName: string;
  contactEmail: string;
  esgTargetYear: string;
  jurisdiction: string;
  accreditedRegistries: string[];
}
