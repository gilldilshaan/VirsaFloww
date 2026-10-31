import {
  ProjectRecord,
  FarmerRecord,
  FieldRecord,
  ReviewTask,
  MrvAssessment,
  GeospatialLayer,
  OperationalReport,
} from "../types/workspace";
import {
  MARKETPLACE_PROJECTS,
  PRIMARY_FIELD,
  INITIAL_EVIDENCE_ITEMS,
  SATELLITE_OBSERVATIONS,
} from "../terra-ledger/mock-data";
import { EvidenceItem } from "../terra-ledger/types";

// Mock database records
const MOCK_PROJECTS: ProjectRecord[] = MARKETPLACE_PROJECTS.map((p, idx) => ({
  ...p,
  createdAt: "2026-01-15",
  updatedAt: "2026-10-28",
  complianceStandard: idx % 2 === 0 ? "Verra VM0042" : "Gold Standard SOC",
  registryId: `VCS-PRJ-2026-0${idx + 1}84`,
  pipelineStage: idx === 0 ? "Verification Audit" : idx === 1 ? "Monitoring" : "Field Baseline",
  leadDeveloper: p.developer,
  targetMethaneReductionPercent: idx === 0 ? 48 : idx === 1 ? 52 : 35,
}));

const MOCK_FARMERS: FarmerRecord[] = [
  {
    id: "FARM-PB-001",
    name: "Gurdev Singh Gill",
    localName: "ਗੁਰਦੇਵ ਸਿੰਘ ਗਿੱਲ",
    phoneMasked: "+91 98765-XXXX1",
    district: "Ludhiana",
    tehsil: "Samrala",
    village: "Gill Kalan",
    fpoName: "Malwa Progressive Rice FPO",
    enrolledHectares: 4.8,
    totalParcels: 2,
    kycStatus: "Verified",
    enrolmentDate: "2026-04-12",
    bankAccountVerified: true,
    baselineCrop: "Puddle Transplanted Paddy (PR-126)",
    practiceAdopted: "Direct Seeded Rice (DSR) + AWD",
    pensionOrDirectTransferId: "PM-KISAN-PB-88912",
  },
  {
    id: "FARM-PB-002",
    name: "Harbhajan Singh Dhillon",
    localName: "ਹਰਭਜਨ ਸਿੰਘ ਢਿੱਲੋਂ",
    phoneMasked: "+91 94172-XXXX8",
    district: "Sangrur",
    tehsil: "Sunam",
    village: "Dhillon Patti",
    fpoName: "Panjdhara Farmers Collective",
    enrolledHectares: 7.2,
    totalParcels: 3,
    kycStatus: "Verified",
    enrolmentDate: "2026-03-29",
    bankAccountVerified: true,
    baselineCrop: "Long Duration Puddled Rice (Pusa 44)",
    practiceAdopted: "Happy Seeder Wheat + Short DSR",
    pensionOrDirectTransferId: "PM-KISAN-PB-44120",
  },
  {
    id: "FARM-PB-003",
    name: "Kuldeep Kaur Brar",
    localName: "ਕੁਲਦੀਪ ਕੌਰ ਬਰਾੜ",
    phoneMasked: "+91 98144-XXXX3",
    district: "Bathinda",
    tehsil: "Talwandi Sabo",
    village: "Brar Kot",
    fpoName: "Malwa Clean Air Farmers Union",
    enrolledHectares: 3.5,
    totalParcels: 1,
    kycStatus: "Pending Verification",
    enrolmentDate: "2026-05-18",
    bankAccountVerified: false,
    baselineCrop: "Transplanted Basmati 1121",
    practiceAdopted: "Laser Land Leveling + AWD",
    pensionOrDirectTransferId: "PM-KISAN-PB-99432",
  },
  {
    id: "FARM-PB-004",
    name: "Balwinder Singh Sidhu",
    localName: "ਬਲਵਿੰਦਰ ਸਿੰਘ ਸਿੱਧੂ",
    phoneMasked: "+91 97800-XXXX5",
    district: "Patiala",
    tehsil: "Nabha",
    village: "Sidhuwala",
    fpoName: "Patiala Basin Water Conservation Society",
    enrolledHectares: 6.0,
    totalParcels: 2,
    kycStatus: "Verified",
    enrolmentDate: "2026-04-02",
    bankAccountVerified: true,
    baselineCrop: "Continuous Flooding Basmati",
    practiceAdopted: "AWD Piezometer Protocol",
    pensionOrDirectTransferId: "PM-KISAN-PB-66381",
  },
];

const MOCK_FIELDS: FieldRecord[] = [
  {
    ...PRIMARY_FIELD,
    fpoId: "FPO-MALWA-01",
    fpoName: "Malwa Progressive Rice FPO",
    soilType: "Sandy Loam (Alluvial)",
    irrigationSource: "Canal + Electric Tubewell",
    seedingDate: "2026-06-10",
    harvestProjectedDate: "2026-10-25",
    currentCropStage: "Panicle Initiation",
    awdTubeCount: 3,
    activeStatus: "Under Review",
    assignedFieldOfficer: "Harpreet Singh Gill",
  },
  {
    id: "PB-SAN-108",
    code: "PB-SAN-108",
    name: "Dhillon Estate North 2",
    farmerName: "Harbhajan Singh Dhillon",
    farmerNameLocal: "ਹਰਭਜਨ ਸਿੰਘ ਢਿੱਲੋਂ",
    district: "Sangrur",
    state: "Punjab",
    areaHa: 7.2,
    areaAcres: 17.79,
    practice: "Residue Retention + Happy Seeder",
    crop: "PBW 826 Wheat / PR-126 Basmati",
    season: "Kharif-Rabi 2026",
    coordinates: { lat: 30.245, lng: 75.842 },
    boundaryPolygon: [
      [30.247, 75.84],
      [30.248, 75.845],
      [30.242, 75.846],
      [30.241, 75.841],
    ],
    targetEmissionReductionTonnes: 34.56,
    fpoId: "FPO-PANJ-02",
    fpoName: "Panjdhara Farmers Collective",
    soilType: "Clay Loam",
    irrigationSource: "Solar Micro-irrigation",
    seedingDate: "2026-06-05",
    harvestProjectedDate: "2026-10-18",
    currentCropStage: "Grain Filling",
    awdTubeCount: 4,
    activeStatus: "Audit Approved",
    assignedFieldOfficer: "Jasbir Singh",
  },
  {
    id: "PB-BAT-089",
    code: "PB-BAT-089",
    name: "Brar Kot Parcel 1",
    farmerName: "Kuldeep Kaur Brar",
    farmerNameLocal: "ਕੁਲਦੀਪ ਕੌਰ ਬਰਾੜ",
    district: "Bathinda",
    state: "Punjab",
    areaHa: 3.5,
    areaAcres: 8.65,
    practice: "Laser Leveling + AWD",
    crop: "Pusa Basmati 1121",
    season: "Kharif 2026",
    coordinates: { lat: 30.082, lng: 75.012 },
    boundaryPolygon: [
      [30.084, 75.01],
      [30.085, 75.015],
      [30.08, 75.016],
      [30.079, 75.011],
    ],
    targetEmissionReductionTonnes: 16.8,
    fpoId: "FPO-BAT-03",
    fpoName: "Malwa Clean Air Farmers Union",
    soilType: "Silt Loam",
    irrigationSource: "Diesel Tubewell",
    seedingDate: "2026-06-18",
    harvestProjectedDate: "2026-11-05",
    currentCropStage: "Vegetative Tillering",
    awdTubeCount: 2,
    activeStatus: "Flagged Discrepancy",
    assignedFieldOfficer: "Manjit Singh",
  },
];

const MOCK_REVIEWS: ReviewTask[] = [
  {
    id: "REV-2026-091",
    title: "Spatial Anomaly in Seeding Photo EV-003",
    parcelId: "PB-LUD-042",
    farmerName: "Gurdev Singh Gill",
    severity: "high",
    type: "spatial_mismatch",
    status: "pending_review",
    reportedDate: "2026-06-16",
    dueDate: "2026-07-01",
    assignedTo: "Dr. Evelyn Martinez (Reviewer)",
    description:
      "EXIF coordinates fall 420m outside registered polygon. Corroboration required with in-boundary drill emergence photograph.",
    evidenceRefId: "EV-003",
  },
  {
    id: "REV-2026-088",
    title: "Missing Early-Season PVC Water Tube Log",
    parcelId: "PB-LUD-042",
    farmerName: "Gurdev Singh Gill",
    severity: "medium",
    type: "missing_awd_log",
    status: "in_investigation",
    reportedDate: "2026-06-25",
    dueDate: "2026-07-10",
    assignedTo: "Harpreet Singh Gill (Field Officer)",
    description:
      "Mandatory AWD drying interval records not logged for June 20-30 vegetative flushing phase.",
    evidenceRefId: "EV-004",
  },
  {
    id: "REV-2026-074",
    title: "Cadastral Boundary Overlap with Canal Right-of-Way",
    parcelId: "PB-BAT-089",
    farmerName: "Kuldeep Kaur Brar",
    severity: "medium",
    type: "boundary_conflict",
    status: "pending_review",
    reportedDate: "2026-06-20",
    dueDate: "2026-07-05",
    assignedTo: "Amrita Kaur (Project Developer)",
    description:
      "Southern boundary edge intercepts public canal bund drainage buffer by 6 meters. Parcel polygon adjustment required.",
  },
];

const MOCK_ASSESSMENTS: MrvAssessment[] = [
  {
    id: "ASM-2026-LUD-042",
    assessmentNumber: "ASM-2026-042",
    projectId: "PRJ-PB-DSR-01",
    projectTitle: "Punjab Direct Seeded Rice MRV Cluster #1",
    parcelCode: "PB-LUD-042",
    farmerName: "Gurdev Singh Gill",
    cropSeason: "Kharif 2026",
    status: "NEEDS_REVIEW",
    overallScorePercent: 71,
    evaluatedAt: "2026-10-24 14:30 UTC",
    leadAuditor: "Apex Climate Auditing & Verification (VVB)",
    criteriaChecks: {
      spatialCadastralBoundary: true,
      zeroPuddleVerification: true,
      awdDrydownSpectralMatch: true,
      fertilizerDosingLog: false,
      independentPeerInspection: true,
    },
    headlineFindings:
      "Demonstrated dry seeding corroborated via Sentinel-2 NDWI drying curve. Geotag photo EV-003 offset pending final resolution.",
    recommendations: [
      "Obtain calibrated in-boundary photo taken by registered field extension agent",
      "Attach farmer urea dosing voucher and purchase receipt for additionality cross-reference",
    ],
  },
  {
    id: "ASM-2026-SAN-108",
    assessmentNumber: "ASM-2026-108",
    projectId: "PRJ-PB-CRM-02",
    projectTitle: "Malwa Zero-Till & Residue Hub",
    parcelCode: "PB-SAN-108",
    farmerName: "Harbhajan Singh Dhillon",
    cropSeason: "Kharif 2026",
    status: "READY_FOR_VERIFICATION",
    overallScorePercent: 94,
    evaluatedAt: "2026-10-22 09:15 UTC",
    leadAuditor: "Bureau Veritas Agri-Carbon",
    criteriaChecks: {
      spatialCadastralBoundary: true,
      zeroPuddleVerification: true,
      awdDrydownSpectralMatch: true,
      fertilizerDosingLog: true,
      independentPeerInspection: true,
    },
    headlineFindings:
      "All MRV criteria met. Complete Happy Seeder telematics and Sentinel-2 NDVI spectral canopy closure matched.",
    recommendations: ["Ready for third-party accredited VVB audit dossier compile"],
  },
];

const MOCK_LAYERS: GeospatialLayer[] = [
  {
    id: "layer-s2-rgb",
    name: "Sentinel-2 True Color (RGB)",
    type: "optical_rgb",
    resolution: "10m / pixel",
    satellite: "Copernicus Sentinel-2B MSI",
    lastUpdated: "2026-08-15",
    opacity: 100,
    visible: true,
    cloudCoverPercent: 1.6,
  },
  {
    id: "layer-ndvi",
    name: "Normalized Difference Vegetation Index (NDVI)",
    type: "ndvi_spectral",
    resolution: "10m / pixel",
    satellite: "Copernicus Sentinel-2B Level-2A",
    lastUpdated: "2026-08-15",
    opacity: 85,
    visible: true,
    cloudCoverPercent: 1.6,
  },
  {
    id: "layer-ndwi",
    name: "Normalized Difference Water Index (NDWI)",
    type: "ndwi_moisture",
    resolution: "10m / pixel",
    satellite: "Copernicus Sentinel-2A Level-2A",
    lastUpdated: "2026-07-28",
    opacity: 80,
    visible: false,
    cloudCoverPercent: 4.5,
  },
  {
    id: "layer-cadastral",
    name: "Punjab Revenue Cadastral Boundaries",
    type: "cadastral_boundary",
    resolution: "Vector Polygon (< 1m)",
    satellite: "Punjab Land Records Agency API",
    lastUpdated: "2026-05-18",
    opacity: 100,
    visible: true,
    cloudCoverPercent: 0,
  },
];

const MOCK_REPORTS: OperationalReport[] = [
  {
    id: "REP-2026-Q3-01",
    title: "Punjab DSR Cluster #1 MRV Integrity & Evidence Dossier",
    period: "Kharif 2026 (June - Oct)",
    category: "audit_dossier",
    status: "Ready",
    format: "PDF",
    fileSizeKb: 4820,
    generatedBy: "TerraLedger Automated MRV Engine",
  },
  {
    id: "REP-2026-Q3-02",
    title: "Malwa FPO Enrolment & Cadastral Verification Export",
    period: "Q3 2026",
    category: "fpo_enrolment",
    status: "Ready",
    format: "GeoJSON",
    fileSizeKb: 1240,
    generatedBy: "Amrita Kaur (Project Developer)",
  },
  {
    id: "REP-2026-Q3-03",
    title: "Methane Abatement & Water Pumping Baseline Report",
    period: "Kharif 2026",
    category: "emissions_reduction",
    status: "Ready",
    format: "CSV",
    fileSizeKb: 380,
    generatedBy: "Dr. Inderjit Singh (Admin)",
  },
];

// Typed API Client
export const api = {
  projects: {
    list: async (): Promise<ProjectRecord[]> => {
      return [...MOCK_PROJECTS];
    },
    getById: async (id: string): Promise<ProjectRecord | null> => {
      const match = MOCK_PROJECTS.find((p) => p.id === id || p.slug === id);
      return match || null;
    },
  },
  farmers: {
    list: async (): Promise<FarmerRecord[]> => {
      return [...MOCK_FARMERS];
    },
    getById: async (id: string): Promise<FarmerRecord | null> => {
      const match = MOCK_FARMERS.find((f) => f.id === id);
      return match || null;
    },
  },
  fields: {
    list: async (): Promise<FieldRecord[]> => {
      return [...MOCK_FIELDS];
    },
    getById: async (id: string): Promise<FieldRecord | null> => {
      const match = MOCK_FIELDS.find((f) => f.id === id || f.code === id);
      return match || null;
    },
  },
  evidence: {
    list: async (category?: string): Promise<EvidenceItem[]> => {
      if (category && category !== "all") {
        return INITIAL_EVIDENCE_ITEMS.filter((item) => item.category === category);
      }
      return [...INITIAL_EVIDENCE_ITEMS];
    },
    getById: async (id: string): Promise<EvidenceItem | null> => {
      const match = INITIAL_EVIDENCE_ITEMS.find((e) => e.id === id);
      return match || null;
    },
  },
  reviews: {
    listQueue: async (): Promise<ReviewTask[]> => {
      return [...MOCK_REVIEWS];
    },
    getById: async (id: string): Promise<ReviewTask | null> => {
      const match = MOCK_REVIEWS.find((r) => r.id === id);
      return match || null;
    },
    resolve: async (id: string, notes: string): Promise<boolean> => {
      const match = MOCK_REVIEWS.find((r) => r.id === id);
      if (match) {
        match.status = "resolved";
        match.resolutionNotes = notes;
        return true;
      }
      return false;
    },
  },
  assessments: {
    list: async (): Promise<MrvAssessment[]> => {
      return [...MOCK_ASSESSMENTS];
    },
    getById: async (id: string): Promise<MrvAssessment | null> => {
      const match = MOCK_ASSESSMENTS.find((a) => a.id === id || a.assessmentNumber === id);
      return match || null;
    },
  },
  terraIntelligence: {
    getLayers: async (): Promise<GeospatialLayer[]> => {
      return [...MOCK_LAYERS];
    },
    getObservations: async () => {
      return [...SATELLITE_OBSERVATIONS];
    },
  },
  reports: {
    list: async (): Promise<OperationalReport[]> => {
      return [...MOCK_REPORTS];
    },
  },
};
