import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import {
  AssessmentStatus,
  DemoState,
  FieldParcel,
  EvidenceItem,
  SatelliteObservation,
  MarketplaceProject,
  DueDiligenceItem,
  ReviewQueueItem,
  ReviewActionPayload,
  CommandCentreMetrics,
  PhenologyDataPoint,
} from './types';
import {
  PRIMARY_FIELD,
  ALL_FIELDS,
  SATELLITE_OBSERVATIONS,
  INITIAL_EVIDENCE_ITEMS,
  ADDED_IRRIGATION_LOG,
  ADDED_IN_BOUNDARY_PHOTO,
  MARKETPLACE_PROJECTS,
  INITIAL_DUE_DILIGENCE_PIPELINE,
  REVIEW_QUEUE_ITEMS,
  COMMAND_CENTRE_METRICS_MOCK,
  PHENOLOGY_TIME_SERIES_MOCK,
} from './mock-data';
import { api } from '../api';

export interface TerraLedgerContextType {
  // Existing Demo State & Machine
  demoState: DemoState;
  setDemoState: (state: DemoState) => void;
  advanceDemoState: () => void;
  resetDemoState: () => void;
  addIrrigationLogAction: () => void;
  addInBoundaryPhotoAction: () => void;
  addCustomEvidenceAction: (item: Partial<EvidenceItem>) => void;

  // Single Active Parcel State (for backward compatibility & focused inspection)
  field: FieldParcel;
  selectedField: FieldParcel;
  selectedFieldId: string;
  setSelectedFieldId: (id: string) => void;
  allFields: FieldParcel[];

  // Projects Registry State
  projects: MarketplaceProject[];
  allProjects: MarketplaceProject[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedProject: MarketplaceProject | null;

  // Review Queue State & Actions
  reviewQueue: ReviewQueueItem[];
  submitReviewAction: (payload: ReviewActionPayload) => Promise<{ success: boolean; message: string }>;
  requestCorrection: (payload: {
    reviewQueueItemId: string;
    requirement: string;
    reviewer: string;
  }) => Promise<{ success: boolean; message: string; supersedingEvidenceId: string }>;

  // Command Centre Operational Metrics
  commandMetrics: CommandCentreMetrics;

  // Evidence, Satellite & Telemetry
  satelliteObservations: SatelliteObservation[];
  phenologyData: PhenologyDataPoint[];
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

  // Buyer & Offtake Pipeline
  dueDiligenceList: DueDiligenceItem[];
  submitBuyerInquiry: (data: {
    buyerName: string;
    buyerOrg: string;
    projectTitle: string;
    volumeRequestedTons: number;
    targetRetirementYear: string;
  }) => { success: boolean; message: string };

  // Asynchronous status & API adapter flags
  isLoading: boolean;
  error: string | null;
  refetchAll: () => Promise<void>;
  isMockAdapter: boolean;
}

const TerraLedgerContext = createContext<TerraLedgerContextType | null>(null);

export function TerraLedgerProvider({ children }: { children: ReactNode }) {
  const [demoState, setDemoState] = useState<DemoState>('unverified');
  const [activeTab, setActiveTab] = useState<string>('command');
  const [customEvidence, setCustomEvidence] = useState<EvidenceItem[]>([]);
  const [dueDiligenceList, setDueDiligenceList] = useState<DueDiligenceItem[]>(INITIAL_DUE_DILIGENCE_PIPELINE);

  // Multi-entity selection state
  const [selectedFieldId, setSelectedFieldId] = useState<string>(PRIMARY_FIELD.id);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('PRJ-PB-DSR-01');
  const [allFields, setAllFields] = useState<FieldParcel[]>(ALL_FIELDS);
  const [projectsList, setProjectsList] = useState<MarketplaceProject[]>(MARKETPLACE_PROJECTS);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>(REVIEW_QUEUE_ITEMS);
  const [commandMetrics, setCommandMetrics] = useState<CommandCentreMetrics>(COMMAND_CENTRE_METRICS_MOCK);
  const [phenologyData] = useState<PhenologyDataPoint[]>(PHENOLOGY_TIME_SERIES_MOCK);

  // Loading & error state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Active field derived from selectedFieldId or fallback to PRIMARY_FIELD
  const selectedField = useMemo(() => {
    return allFields.find((f) => f.id === selectedFieldId || f.code === selectedFieldId) || PRIMARY_FIELD;
  }, [allFields, selectedFieldId]);

  // Active project derived from selectedProjectId
  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return projectsList.find((p) => p.id === selectedProjectId || p.slug === selectedProjectId) || null;
  }, [projectsList, selectedProjectId]);

  // Compute evidence list based on demoState for the primary field
  const evidenceList = useMemo(() => {
    let items: EvidenceItem[] = [];
    if (demoState === 'unverified') {
      items = [...INITIAL_EVIDENCE_ITEMS];
    } else if (demoState === 'needs-review') {
      // Replace missing AWD log with the actual verified log
      items = INITIAL_EVIDENCE_ITEMS.filter((i) => i.id !== 'EV-004').concat(ADDED_IRRIGATION_LOG);
    } else {
      // 'ready': include both verified irrigation log and verified in-boundary photo
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
      nextRequiredAction:
        'Compile digital project dossier for accredited VVB audit (automated assessment is not 3rd-party certification). Status: READY FOR VERIFICATION.',
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
        source: 'VirsaFlow Web Client Upload',
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

  // Review Queue actions
  const submitReviewAction = async (payload: ReviewActionPayload) => {
    setIsLoading(true);
    try {
      const res = await api.submitReviewAction(payload);
      setReviewQueue((prev) =>
        prev.map((item) => (item.id === payload.reviewQueueItemId ? res.updatedItem : item))
      );
      return { success: true, message: res.message };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to submit review action';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const requestCorrection = async (payload: {
    reviewQueueItemId: string;
    requirement: string;
    reviewer: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.requestCorrection(payload);
      // Mark review queue item as updated with requirement
      setReviewQueue((prev) =>
        prev.map((item) =>
          item.id === payload.reviewQueueItemId
            ? {
                ...item,
                status: 'in_review',
                assignedReviewer: payload.reviewer,
                reviewNotes: `Correction requested: ${payload.requirement}`,
                lastActionAt: new Date().toISOString(),
              }
            : item
        )
      );

      // Create superseding placeholder in evidence list
      const newPlaceholder: EvidenceItem = {
        id: res.supersedingEvidenceId,
        title: `Requested Correction: Replacement for Item in ${payload.reviewQueueItemId}`,
        type: 'photo',
        category: 'missing',
        status: 'pending',
        description: `Correction Requirement: ${payload.requirement}. Supersedes original evidence record.`,
        timestamp: new Date().toISOString(),
        fieldId: selectedFieldId,
        fieldCode: selectedField.code,
        supersedesId: payload.reviewQueueItemId,
        provenance: {
          author: payload.reviewer,
          source: 'Review Queue Correction Request',
          reviewStatus: 'Awaiting Farmer/Agent Re-upload',
        },
      };
      setCustomEvidence((prev) => [...prev, newPlaceholder]);

      return {
        success: true,
        message: res.message,
        supersedingEvidenceId: res.supersedingEvidenceId,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to request correction';
      setError(msg);
      return { success: false, message: msg, supersedingEvidenceId: '' };
    } finally {
      setIsLoading(false);
    }
  };

  const refetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prjs, flds, metrics, revs] = await Promise.all([
        api.getProjects(),
        api.getFields(),
        api.getCommandCentreMetrics(),
        api.getReviewQueue(),
      ]);
      setProjectsList(prjs);
      setAllFields(flds);
      setCommandMetrics(metrics);
      setReviewQueue(revs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching backend data');
    } finally {
      setIsLoading(false);
    }
  }, []);

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

        // Single & Multi-Field
        field: selectedField,
        selectedField,
        selectedFieldId,
        setSelectedFieldId,
        allFields,

        // Projects
        projects: projectsList,
        allProjects: projectsList,
        selectedProjectId,
        setSelectedProjectId,
        selectedProject,

        // Review Queue
        reviewQueue,
        submitReviewAction,
        requestCorrection,

        // Metrics
        commandMetrics,

        // Observations & Indices
        satelliteObservations: SATELLITE_OBSERVATIONS,
        phenologyData,

        // Evidence & AI Synthesis
        evidenceList,
        assessmentStatus,
        completenessPercent,
        aiExplanation,

        // Navigation
        activeTab,
        setActiveTab,

        // Due diligence pipeline
        dueDiligenceList,
        submitBuyerInquiry,

        // Async state
        isLoading,
        error,
        refetchAll,
        isMockAdapter: api.isUsingMockAdapter(),
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

export const VirsaFlowProvider = TerraLedgerProvider;
export const useVirsaFlow = useTerraLedger;
