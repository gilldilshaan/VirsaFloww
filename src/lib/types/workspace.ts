import {
  AssessmentStatus,
  FieldParcel,
  EvidenceItem,
  SatelliteObservation,
  MarketplaceProject,
} from "../terra-ledger/types";

export type WorkspaceRole =
  "admin" | "project_developer" | "field_officer" | "reviewer" | "buyer" | "farmer";

export type Permission =
  | "workspace:view"
  | "workspace:projects:read"
  | "workspace:projects:manage"
  | "workspace:farmers:read"
  | "workspace:farmers:manage"
  | "workspace:fields:read"
  | "workspace:fields:manage"
  | "workspace:evidence:read"
  | "workspace:evidence:upload"
  | "workspace:evidence:review"
  | "workspace:assessments:read"
  | "workspace:assessments:create"
  | "workspace:assessments:approve"
  | "workspace:geospatial:view"
  | "workspace:reports:view"
  | "workspace:reports:export";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  organization: string;
  fpoAffiliation?: string;
  district?: string;
  village?: string;
  avatarUrl?: string;
  permissions: Permission[];
}

export interface ProjectRecord extends MarketplaceProject {
  createdAt: string;
  updatedAt: string;
  complianceStandard:
    "Verra VM0042" | "Gold Standard SOC" | "Verra AMS-III.AU" | "Verra AR-ACM0003";
  registryId: string;
  pipelineStage:
    "Registration" | "Field Baseline" | "Monitoring" | "Verification Audit" | "Issuance Ready";
  leadDeveloper: string;
  targetMethaneReductionPercent: number;
}

export interface FarmerRecord {
  id: string;
  name: string;
  localName: string;
  phoneMasked: string;
  district: string;
  tehsil: string;
  village: string;
  fpoName: string;
  enrolledHectares: number;
  totalParcels: number;
  kycStatus: "Verified" | "Pending Verification" | "Clarification Requested";
  enrolmentDate: string;
  bankAccountVerified: boolean;
  baselineCrop: string;
  practiceAdopted: string;
  pensionOrDirectTransferId: string;
}

export interface FieldRecord extends FieldParcel {
  fpoId: string;
  fpoName: string;
  soilType: string;
  irrigationSource: "Canal + Electric Tubewell" | "Diesel Tubewell" | "Solar Micro-irrigation";
  seedingDate: string;
  harvestProjectedDate: string;
  currentCropStage:
    | "Land Prep"
    | "Direct Seeding"
    | "Vegetative Tillering"
    | "Panicle Initiation"
    | "Grain Filling"
    | "Harvest";
  awdTubeCount: number;
  activeStatus: "Active" | "Under Review" | "Flagged Discrepancy" | "Audit Approved";
  assignedFieldOfficer: string;
}

export interface ReviewTask {
  id: string;
  title: string;
  parcelId: string;
  farmerName: string;
  severity: "high" | "medium" | "low";
  type:
    | "spatial_mismatch"
    | "missing_awd_log"
    | "sensor_drift"
    | "stubble_burn_anomaly"
    | "boundary_conflict";
  status: "pending_review" | "in_investigation" | "resolved" | "escalated";
  reportedDate: string;
  dueDate: string;
  assignedTo: string;
  description: string;
  evidenceRefId?: string;
  resolutionNotes?: string;
}

export interface MrvAssessment {
  id: string;
  assessmentNumber: string;
  projectId: string;
  projectTitle: string;
  parcelCode: string;
  farmerName: string;
  cropSeason: string;
  status: AssessmentStatus;
  overallScorePercent: number;
  evaluatedAt: string;
  leadAuditor: string;
  criteriaChecks: {
    spatialCadastralBoundary: boolean;
    zeroPuddleVerification: boolean;
    awdDrydownSpectralMatch: boolean;
    fertilizerDosingLog: boolean;
    independentPeerInspection: boolean;
  };
  headlineFindings: string;
  recommendations: string[];
}

export interface GeospatialLayer {
  id: string;
  name: string;
  type:
    "optical_rgb" | "ndvi_spectral" | "ndwi_moisture" | "cadastral_boundary" | "radar_sar_water";
  resolution: string;
  satellite: string;
  lastUpdated: string;
  opacity: number;
  visible: boolean;
  cloudCoverPercent: number;
}

export interface OperationalReport {
  id: string;
  title: string;
  period: string;
  category: "mrv_integrity" | "fpo_enrolment" | "emissions_reduction" | "audit_dossier";
  status: "Ready" | "Generating" | "Scheduled";
  format: "PDF" | "GeoJSON" | "CSV" | "Audit ZIP";
  fileSizeKb: number;
  generatedBy: string;
  downloadUrl?: string;
}
