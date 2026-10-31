export type AssessmentStatus = 'UNVERIFIED' | 'NEEDS_REVIEW' | 'READY_FOR_VERIFICATION';

export type DemoState = 'unverified' | 'needs-review' | 'ready';

export type RuleStatus = 'pass' | 'warn' | 'fail';

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  status: RuleStatus;
  message: string;
  timestamp: string;
  metricObserved?: string;
  thresholdApplied?: string;
}

export interface FieldParcel {
  id: string;
  name: string;
  code: string;
  farmerName: string;
  farmerNameLocal: string;
  district: string;
  state: string;
  areaHa: number;
  areaAcres: number;
  practice: string;
  crop: string;
  season: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  boundaryPolygon: Array<[number, number]>;
  targetEmissionReductionTonnes: number;
  // Extended fields for registry & MRV tracking
  projectId?: string;
  fpoName?: string;
  cropSeason?: string;
  geometrySource?: 'Cadastral Revenue Record' | 'DGPS Ground Survey' | 'Remote Sensing Delineation';
  evidenceCount?: number;
  assessmentStatus?: AssessmentStatus;
  lastObservationDate?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'photo' | 'satellite' | 'document' | 'log' | 'sensor';
  category: 'supporting' | 'contradicting' | 'missing';
  status: 'verified' | 'flagged' | 'pending' | 'missing';
  description: string;
  timestamp: string;
  provenance: {
    author: string;
    source: string;
    sha256?: string;
    device?: string;
    gpsCoordinates?: {
      lat: number;
      lng: number;
      accuracyMeters?: number;
    };
    spatialDistanceMeters?: number;
    reviewStatus: string;
  };
  fileDetails?: {
    name: string;
    sizeKb: number;
    mime: string;
  };
  // Non-destructive supersession audit trail
  supersedesId?: string;
  supersededById?: string;
  fieldId?: string;
  fieldCode?: string;
  ruleResults?: RuleEvaluationResult[];
}

export interface ReviewQueueItem {
  id: string;
  evidenceId: string;
  evidenceTitle: string;
  evidenceType: 'photo' | 'satellite' | 'document' | 'log' | 'sensor';
  fieldId: string;
  fieldCode: string;
  projectId: string;
  farmerName: string;
  submittedAt: string;
  status: 'pending' | 'in_review' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  rules: RuleEvaluationResult[];
  assignedReviewer?: string;
  reviewNotes?: string;
  lastActionAt?: string;
}

export interface ReviewActionPayload {
  reviewQueueItemId: string;
  evidenceId: string;
  action: 'approve' | 'flag' | 'request_correction';
  reviewer: string;
  comments: string;
  correctionRequirement?: string;
}

export interface SatelliteObservation {
  id: string;
  date: string;
  sensor: string;
  resolutionMeters: number;
  cloudCoverPercent: number;
  sunAzimuthDeg: number;
  meanNdvi: number;
  meanNdwi: number;
  qualityRating: 'High' | 'Medium' | 'Cloud-Affected';
  surfaceWaterDetected: boolean;
  notes: string;
  fieldId?: string;
}

export interface PhenologyDataPoint {
  date: string;
  ndvi: number;
  ndwi: number;
  baselineNdvi?: number;
  qualityFlag: 'High' | 'Medium' | 'Cloud-Affected';
}

export interface MarketplaceProject {
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
  estimatedTonsCo2ePerYear: number;
  readinessScorePercent: number;
  assessmentStatus: AssessmentStatus;
  indicativePricePerTonUsd: number;
  vintage: string;
  description: string;
  highlights: string[];
  evidenceDepth: {
    satellitePasses: number;
    groundPhotos: number;
    waterLogs: number;
  };
  fieldIds?: string[];
  owner?: string;
}

export type ProjectSummary = MarketplaceProject;

export interface DueDiligenceItem {
  id: string;
  buyerName: string;
  buyerOrg: string;
  projectTitle: string;
  inquiryDate: string;
  stage: 'Inquiry' | 'Data Room Shared' | 'Audit Underway' | 'Term Sheet';
  volumeRequestedTons: number;
  targetRetirementYear: string;
  status: 'Active' | 'Review Required' | 'Approved';
}

export interface ActionableTask {
  id: string;
  title: string;
  category: 'review' | 'spatial_anomaly' | 'missing_evidence' | 'dossier';
  priority: 'high' | 'medium' | 'low';
  fieldCode: string;
  projectId?: string;
  actionLabel: string;
  targetTab?: string;
  createdAt: string;
}

export interface CommandCentreMetrics {
  totalProjects: number;
  enrolledFarmers: number;
  enrolledFields: number;
  totalHectares: number;
  pendingReviewQueueCount: number;
  missingEvidenceCount: number;
  activeAnomaliesCount: number;
  readinessDistribution: {
    unverified: number;
    needsReview: number;
    readyForVerification: number;
  };
  actionableTasks: ActionableTask[];
}

export interface ProjectFilters {
  practice?: string;
  district?: string;
  status?: AssessmentStatus | 'all';
  searchQuery?: string;
}

export interface FieldFilters {
  projectId?: string;
  district?: string;
  practice?: string;
  status?: AssessmentStatus | 'all';
  searchQuery?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  status: number;
}
