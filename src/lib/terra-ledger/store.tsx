import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  AssessmentStatus,
  DemoState,
  FieldParcel,
  EvidenceItem,
  SatelliteObservation,
  MarketplaceProject,
  DueDiligenceItem,
} from './types';
import {
  PRIMARY_FIELD,
  SATELLITE_OBSERVATIONS,
  INITIAL_EVIDENCE_ITEMS,
  ADDED_IRRIGATION_LOG,
  ADDED_IN_BOUNDARY_PHOTO,
  MARKETPLACE_PROJECTS,
  INITIAL_DUE_DILIGENCE_PIPELINE,
} from './mock-data';

interface TerraLedgerContextType {
  demoState: DemoState;
  setDemoState: (state: DemoState) => void;
  advanceDemoState: () => void;
  resetDemoState: () => void;
  addIrrigationLogAction: () => void;
  addInBoundaryPhotoAction: () => void;
  addCustomEvidenceAction: (item: Partial<EvidenceItem>) => void;

  field: FieldParcel;
  satelliteObservations: SatelliteObservation[];
  evidenceList: EvidenceItem[];
  assessmentStatus: AssessmentStatus;
  completenessPercent: number;
  aiExplanation: {
    headline: string;
    details: string;
    spatialStatus: string;
    temporalStatus: string;
    nextRequiredAction: string;
    isReady: boolean;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;

  projects: MarketplaceProject[];
  dueDiligenceList: DueDiligenceItem[];
  submitBuyerInquiry: (data: {
    buyerName: string;
    buyerOrg: string;
    projectTitle: string;
    volumeRequestedTons: number;
    targetRetirementYear: string;
  }) => { success: boolean; message: string };
}

const TerraLedgerContext = createContext<TerraLedgerContextType | null>(null);

export function TerraLedgerProvider({ children }: { children: ReactNode }) {
  const [demoState, setDemoState] = useState<DemoState>('unverified');
  const [activeTab, setActiveTab] = useState<string>('command');
  const [customEvidence, setCustomEvidence] = useState<EvidenceItem[]>([]);
  const [dueDiligenceList, setDueDiligenceList] = useState<DueDiligenceItem[]>(INITIAL_DUE_DILIGENCE_PIPELINE);

  // Compute evidence list based on demoState
  const evidenceList = useMemo(() => {
    let items: EvidenceItem[] = [];
    if (demoState === 'unverified') {
      items = [...INITIAL_EVIDENCE_ITEMS];
    } else if (demoState === 'needs-review') {
      // Replace missing AWD log with the actual verified log
      items = INITIAL_EVIDENCE_ITEMS.filter((i) => i.id !== 'EV-004').concat(ADDED_IRRIGATION_LOG);
    } else {
      // 'ready': include both the verified irrigation log and the newly verified in-boundary photo
      items = INITIAL_EVIDENCE_ITEMS.filter((i) => i.id !== 'EV-004' && i.id !== 'EV-005')
        .concat(ADDED_IRRIGATION_LOG)
        .concat(ADDED_IN_BOUNDARY_PHOTO);
    }
    return [...items, ...customEvidence];
  }, [demoState, customEvidence]);

  const assessmentStatus: AssessmentStatus = useMemo(() => {
    if (demoState === 'unverified') return 'UNVERIFIED';
    if (demoState === 'needs-review') return 'NEEDS_REVIEW';
    return 'READY_FOR_VERIFICATION';
  }, [demoState]);

  const completenessPercent = useMemo(() => {
    if (demoState === 'unverified') return 42;
    if (demoState === 'needs-review') return 71;
    return 94;
  }, [demoState]);

  const aiExplanation = useMemo(() => {
    if (demoState === 'unverified') {
      return {
        headline: 'Spatial Anomaly & Incomplete Water Records Detected',
        details:
          'Evidence completeness is currently at 42%. A critical spatial discrepancy exists: field seeding photograph EV-003 exhibits EXIF coordinates falling 420 meters outside Parcel PB-LUD-042. Additionally, mandatory in-situ PVC water tube (AWD) records are absent for early vegetative flushing.',
        spatialStatus: 'FLAGGED: Coordinate mismatch (+420m outside polygon)',
        temporalStatus: 'INCOMPLETE: AWD field water log missing',
        nextRequiredAction: 'Upload perforated tube AWD log and provide in-boundary geotagged photo replacement.',
        isReady: false,
      };
    }
    if (demoState === 'needs-review') {
      return {
        headline: 'Water Schedule Corroborated; Spatial Mismatch Persists',
        details:
          'Perforated PVC water tube log (EV-004-LOG) was successfully added. Pumping cessation intervals align with Sentinel-2 NDWI drying curves (June 28 to July 08). However, the original field drill photograph EV-003 remains unresolved (+420m offset). Status advanced to Needs Review.',
        spatialStatus: 'UNRESOLVED: Photo EV-003 still outside boundary',
        temporalStatus: 'VERIFIED: Pumping cycles corroborate Sentinel-2 NDWI drying curve',
        nextRequiredAction: 'Upload verified in-boundary geotagged emergence photograph with accuracy < 5m.',
        isReady: false,
      };
    }
    return {
      headline: 'All Required Evidence Corroborated · Ready for Verification',
      details:
        'New geotagged photograph (EV-005-PHOTO) was captured with 2.1m precision inside parcel bounds, confirming DSR drill row emergence. Pumping records correlate with remote sensing. All mandatory MRV criteria are satisfied. The dossier is now ready for third-party accredited verifier inspection.',
      spatialStatus: 'RESOLVED: Coordinates verified 100% within polygon (PB-LUD-042) · Ready for Verification',
      temporalStatus: 'CORROBORATED: AWD drying cycle confirmed across satellite & field logs',
      nextRequiredAction: 'Compile digital project dossier for accredited VVB audit (automated assessment is not 3rd-party certification). Status: READY FOR VERIFICATION.',
      isReady: true,
    };
  }, [demoState]);

  const advanceDemoState = () => {
    if (demoState === 'unverified') setDemoState('needs-review');
    else if (demoState === 'needs-review') setDemoState('ready');
    else setDemoState('unverified');
  };

  const resetDemoState = () => {
    setDemoState('unverified');
    setCustomEvidence([]);
  };

  const addIrrigationLogAction = () => {
    setDemoState('needs-review');
  };

  const addInBoundaryPhotoAction = () => {
    setDemoState('ready');
  };

  const addCustomEvidenceAction = (item: Partial<EvidenceItem>) => {
    const newItem: EvidenceItem = {
      id: `EV-USER-${Date.now()}`,
      title: item.title || 'Uploaded Field Evidence',
      type: item.type || 'document',
      category: item.category || 'supporting',
      status: item.status || 'verified',
      description: item.description || 'User submitted evidence record via demonstration upload.',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      provenance: {
        author: item.provenance?.author || 'Demonstration Reviewer',
        source: 'TerraLedger Web Client Upload',
        sha256: item.provenance?.sha256 || 'b849e7b2359483c6753c072d6778f8c47b5de9744cfd91a92a543ec27b1406d2',
        reviewStatus: 'Pending Verifier Attestation',
      },
      fileDetails: item.fileDetails || {
        name: 'uploaded-evidence.pdf',
        sizeKb: 128,
        mime: 'application/pdf',
      },
    };
    setCustomEvidence((prev) => [...prev, newItem]);
  };

  const submitBuyerInquiry = (data: {
    buyerName: string;
    buyerOrg: string;
    projectTitle: string;
    volumeRequestedTons: number;
    targetRetirementYear: string;
  }) => {
    const newEntry: DueDiligenceItem = {
      id: `DD-${String(Date.now()).slice(-4)}`,
      buyerName: data.buyerName,
      buyerOrg: data.buyerOrg,
      projectTitle: data.projectTitle,
      inquiryDate: new Date().toISOString().substring(0, 10),
      stage: 'Inquiry',
      volumeRequestedTons: data.volumeRequestedTons,
      targetRetirementYear: data.targetRetirementYear,
      status: 'Active',
    };
    setDueDiligenceList((prev) => [newEntry, ...prev]);
    return {
      success: true,
      message: `Enquiry submitted for ${data.volumeRequestedTons.toLocaleString()} tCO2e of ${data.projectTitle}. Data room link generated. (Demonstration interaction).`,
    };
  };

  return (
    <TerraLedgerContext.Provider
      value={{
        demoState,
        setDemoState,
        advanceDemoState,
        resetDemoState,
        addIrrigationLogAction,
        addInBoundaryPhotoAction,
        addCustomEvidenceAction,
        field: PRIMARY_FIELD,
        satelliteObservations: SATELLITE_OBSERVATIONS,
        evidenceList,
        assessmentStatus,
        completenessPercent,
        aiExplanation,
        activeTab,
        setActiveTab,
        projects: MARKETPLACE_PROJECTS,
        dueDiligenceList,
        submitBuyerInquiry,
      }}
    >
      {children}
    </TerraLedgerContext.Provider>
  );
}

export function useTerraLedger() {
  const context = useContext(TerraLedgerContext);
  if (!context) {
    throw new Error('useTerraLedger must be used within a TerraLedgerProvider');
  }
  return context;
}
