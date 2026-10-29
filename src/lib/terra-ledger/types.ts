export type AssessmentStatus = 'UNVERIFIED' | 'NEEDS_REVIEW' | 'READY_FOR_VERIFICATION';

export type DemoState = 'unverified' | 'needs-review' | 'ready';

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
}

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
