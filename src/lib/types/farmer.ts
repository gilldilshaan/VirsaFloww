export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  district: string;
  village: string;
  fpoMemberId: string;
  aadhaarConsentProvided: boolean;
  bankAccountLinked: boolean;
}

export interface FarmerActivityLog {
  id: string;
  fieldId: string;
  activityType: "seeding" | "irrigation" | "fertilizer" | "weeding" | "harvest";
  date: string;
  notes: string;
  photoUrl?: string;
}
