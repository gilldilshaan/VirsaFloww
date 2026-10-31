# Frontend Architectural Analysis & Integration Specification

**Author**: Frontend Architecture Explorer (`teamwork_explorer`)  
**Target Repository**: VirsaFlow / The Carbon Credit OS (`c:\Users\hp\Desktop\VIrsa`)  
**Branch**: `feature/frontend-backend-integration`  
**Date**: 2026-10-31  

---

## 1. Executive Summary

This architectural analysis provides the technical blueprint for integrating the existing React 19 / TanStack Start frontend with the FastAPI backend. 

Currently, the frontend exhibits a split architecture:
1. **Network Communication**: Two separate client definitions exist: `src/lib/api/client.ts` (a minimal fetch wrapper configured for `VITE_API_BASE_URL`) and `src/lib/api.ts` (a domain-specific class with in-memory mock fixtures targeting `VITE_MRV_API_BASE_URL` at `/api/v1/...`). Several modules (`farmer-service.ts`, `buyer-service.ts`, `partnerships-service.ts`) also maintain independent `localStorage` mock stores.
2. **Authentication & Session**: A robust 6-role RBAC permission system (`src/lib/auth/`) is implemented with route guards and demo identities, but it does not store `virsaflow_access_token` or restore sessions via `GET /api/auth/me`. Its production login attempt targets `/api/v1/auth/login` instead of FastAPI's `POST /api/auth/session`.
3. **State Management**: The primary store `TerraLedgerProvider` (`src/lib/terra-ledger/store.tsx`) initializes all data from mock fixtures (`mock-data.ts`). Critical MRV properties (`evidenceList`, `assessmentStatus`, `completenessPercent`, `aiExplanation`) are strictly derived from a 3-step demo state machine (`'unverified'` -> `'needs-review'` -> `'ready'`), with no live backend synchronization.
4. **Domain Views**: Views across the three portals (Farmer, Internal Workspace, Buyer) directly reference mock data or service wrappers rather than loading from the store or central client. However, a polished set of status state components (`LoadingState`, `EmptyState`, `ErrorState`, `UnauthorizedState`, `DemoDataBadge`) is already implemented in `src/components/terra-ledger/shared/status-states.tsx`.
5. **Contract Boundaries**: The FastAPI backend serves responses wrapped in `ListEnvelope[T]` (`items`, `total`, `limit`, `offset`) and errors in `ErrorEnvelope` (`error: { code, message, details }`), while frontend consumers expect direct arrays or legacy `ApiResponse<T> { data }`.

The following sections define the consolidation strategy to achieve full production readiness without UI/UX regressions, preserving uncommitted work and Git safety.

---

## 2. Network Communication Architecture

### 2.1 Existing Client Implementations

| Attribute | `src/lib/api/client.ts` | `src/lib/api.ts` |
| :--- | :--- | :--- |
| **Class/Object** | Object `api` with `get`, `post`, `put`, `patch`, `delete` | Class `ApiClient` with domain methods (`getProjects`, `getFields`, etc.) |
| **Base URL Env** | `import.meta.env['VITE_API_BASE_URL'] ?? '/api'` | `import.meta.env?.['VITE_MRV_API_BASE_URL'] ?? ''` |
| **Endpoint Prefix** | Relies on caller to pass prefix (e.g. `/api/...`) | Hardcodes `/api/v1/...` in fetch calls |
| **Auth Token** | `clientConfig.getAuthToken()` injecting Bearer header | No token injection |
| **Response Format** | `ApiResponse<T> { data, error, status }` | Direct data extraction `body.data` |
| **Mock Fallback** | Returns network error | In-memory latency simulation with mock fixtures |
| **Consumers** | `farmer-service.ts`, `partnerships-service.ts` | `store.tsx`, `terra-ledger.test.ts` |

### 2.2 Central API Client Design Requirements (R1)

To satisfy Requirement R1, the central API client must be consolidated into `src/lib/api/client.ts` (or re-exported smoothly through `src/lib/api.ts`):

1. **Environment Configuration**:
   - The base URL must read from `import.meta.env['VITE_API_BASE_URL']` defaulting to `http://127.0.0.1:8000` (or `""` when proxying).
   - All backend routes are mounted under the `/api` prefix (e.g., `/api/auth/session`, `/api/projects`, `/api/fields`, `/api/evidence`).
   - The `/api/v1` prefix from earlier iterations must be updated to `/api`.

2. **Automatic JWT Token Injection**:
   - Read token from storage: `localStorage.getItem('virsaflow_access_token')`.
   - If present and non-empty, automatically attach header: `Authorization: Bearer <token>`.
   - In demo mode, NEVER attach spoofed or mock tokens to live requests.

3. **Backend Error Envelope Parsing**:
   - FastAPI errors are emitted in the frozen envelope:
     ```json
     {
       "error": {
         "code": "STRING_CODE",
         "message": "Human readable message",
         "details": null | object | array
       }
     }
     ```
   - Validation errors (HTTP 422) return `error.code = "VALIDATION_ERROR"` with Pydantic error details in `error.details`.
   - The client must reliably parse both JSON error envelopes and plain HTTP errors (e.g., reverse proxy gateway timeouts, 502/504) without throwing uncaught exceptions.

4. **Paginated List Response Handling**:
   - FastAPI list endpoints return `ListEnvelope[T]`:
     ```json
     {
       "items": [...],
       "total": 42,
       "limit": 50,
       "offset": 0
     }
     ```
   - The client must provide typed unwrapping utilities: `unwrapList<T>(res)` extracting `res.items` while preserving `total` metadata.

5. **Multipart Form-Data Uploads**:
   - When submitting files (e.g., `POST /api/evidence` or `POST /api/evidence/{id}/supersede`), the client must accept `FormData`.
   - **Crucial Rule**: When the body is an instance of `FormData`, the client must NOT set `Content-Type: application/json` or manually set `Content-Type: multipart/form-data`. It must delete the `Content-Type` header so the browser automatically computes the boundary delimiter (e.g., `multipart/form-data; boundary=----WebKitFormBoundary...`).

---

## 3. Authentication & Session Management Architecture

### 3.1 Canonical Roles & Permissions Matrix

The codebase strictly defines 6 canonical roles (no aliases such as `dev`, `rev`, or `officer` are permitted; arbitrary strings fail closed):

| Canonical Role | Target Portal | Granular Permissions Assigned |
| :--- | :--- | :--- |
| `admin` | Admin, Workspace, Buyers | All 17 permissions (`dashboard.read`, `projects.*`, `fields.*`, `evidence.*`, `assessments.*`, `satellite.read`, `marketplace.read`, `enquiries.*`, `users.manage`, etc.) |
| `project_developer` | Workspace, Buyers | `dashboard.read`, `projects.read`, `projects.manage`, `fields.read`, `fields.manage`, `farmers.read`, `evidence.read`, `evidence.upload`, `assessments.read`, `satellite.read`, `marketplace.read` (CANNOT review/approve own evidence) |
| `reviewer` | Workspace | `dashboard.read`, `projects.read`, `fields.read`, `evidence.read`, `evidence.review`, `assessments.read`, `satellite.read` (CANNOT manage projects or view unanonymized farmer PII) |
| `field_officer` | Workspace | `dashboard.read`, `projects.read`, `fields.read`, `fields.manage`, `farmers.read`, `evidence.read`, `evidence.upload`, `satellite.read` |
| `farmer` | Farmer Portal | `fields.read`, `evidence.read`, `evidence.upload` (Scoped strictly to own assigned field IDs; zero internal workspace access) |
| `buyer` | Buyer Portal | `marketplace.read`, `enquiries.create`, `enquiries.manage`, `buyer_profile.manage` (Zero access to internal workspace or farmer portal) |

### 3.2 Session Storage & Lifecycle

1. **Current Storage Mechanism**:
   - `localStorage` key: `virsaflow_auth_session_v2`.
   - Format:
     ```ts
     interface StoredSession {
       user: AuthUser;
       issuedAt: number;
       expiresAt: number;
       sessionType: 'demo' | 'production';
     }
     ```
   - Missing item: JWT token is not saved separately.

2. **Integration Plan (R2)**:
   - Dedicated JWT key: `virsaflow_access_token`.
   - Upon successful login to `POST /api/auth/session`:
     1. Store JWT token: `localStorage.setItem('virsaflow_access_token', res.data.accessToken)`.
     2. Map backend `User` to frontend `AuthUser`.
     3. Save `StoredSession` with `sessionType: 'production'`.
   - On application startup / reload:
     1. Check for `virsaflow_access_token`.
     2. If token exists and `sessionType === 'production'`, query `GET /api/auth/me`.
     3. If `GET /api/auth/me` succeeds (HTTP 200), hydrate active `AuthUser` with authoritative backend roles/claims.
     4. If `GET /api/auth/me` returns HTTP 401/403 or token expired, immediately execute `logout()`, remove `virsaflow_access_token` and `virsaflow_auth_session_v2`, and redirect to `/login` if on a protected route.
   - Upon logout:
     1. Remove `virsaflow_access_token`.
     2. Remove `virsaflow_auth_session_v2`.
     3. Set `user = null`.

### 3.3 Strict Isolation: Demo Mode vs Live Mode

To satisfy Acceptance Criteria R2 & R4:
- **Demo Mode**:
  - Initiated explicitly via `loginAsDemo(role)` or selecting a demo profile on `/login`.
  - Identity is pinned to `DEMO_IDENTITIES[role]`, marked with `isDemoUser: true`.
  - `sessionType` is `'demo'`.
  - **Hard Security Constraint**: Demo sessions MUST NOT send mock mutations to live backend endpoints. If a demo user clicks a mutation action while `isDemoMode` is true, it routes through the local simulated state machine without submitting bearer tokens or hitting PostgreSQL.
- **Live Mode**:
  - Initiated via email/password credentials authenticated by FastAPI.
  - Marked with `isDemoUser: false`.
  - `sessionType` is `'production'`.
  - All operations invoke live API endpoints; backend Authoritative RBAC verifies token signature and permissions.
  - UI role checks serve exclusively for UX routing convenience and element visibility; the server authoritatively enforces access control.

---

## 4. State Management (TerraLedger Store) Architecture

### 4.1 Store Structure & Public Contract

`TerraLedgerProvider` (`src/lib/terra-ledger/store.tsx`) exposes `useTerraLedger()` and `useVirsaFlow()` with the following public interface:

```ts
export interface TerraLedgerContextType {
  // Demo State Machine
  demoState: DemoState; // 'unverified' | 'needs-review' | 'ready'
  setDemoState: (state: DemoState) => void;
  advanceDemoState: () => void;
  resetDemoState: () => void;
  addIrrigationLogAction: () => void;
  addInBoundaryPhotoAction: () => void;
  addCustomEvidenceAction: (item: Partial<EvidenceItem>) => void;

  // Single & Multi-Field Parcels
  field: FieldParcel;
  selectedField: FieldParcel;
  selectedFieldId: string;
  setSelectedFieldId: (id: string) => void;
  allFields: FieldParcel[];

  // Projects Registry
  projects: MarketplaceProject[];
  allProjects: MarketplaceProject[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedProject: MarketplaceProject | null;

  // Review Queue
  reviewQueue: ReviewQueueItem[];
  submitReviewAction: (payload: ReviewActionPayload) => Promise<{ success: boolean; message: string }>;
  requestCorrection: (payload: {
    reviewQueueItemId: string;
    requirement: string;
    reviewer: string;
  }) => Promise<{ success: boolean; message: string; supersedingEvidenceId: string }>;

  // Command Centre Operational Metrics
  commandMetrics: CommandCentreMetrics;

  // Telemetry, Satellite & Evidence
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

  // Due Diligence Pipeline
  dueDiligenceList: DueDiligenceItem[];
  submitBuyerInquiry: (data: {
    buyerName: string;
    buyerOrg: string;
    projectTitle: string;
    volumeRequestedTons: number;
    targetRetirementYear: string;
  }) => { success: boolean; message: string };

  // Status & Synchronization Flags
  isLoading: boolean;
  error: string | null;
  refetchAll: () => Promise<void>;
  isMockAdapter: boolean;
}
```

### 4.2 Decoupling Demo State Machine from Live Mode

Currently in `store.tsx`:
- `evidenceList` is computed via `useMemo` based solely on `demoState`.
- `assessmentStatus` is computed as:
  ```ts
  if (demoState === 'unverified') return 'UNVERIFIED';
  if (demoState === 'needs-review') return 'NEEDS_REVIEW';
  return 'READY_FOR_VERIFICATION';
  ```
- `satelliteObservations` is hardcoded to `SATELLITE_OBSERVATIONS` fixture.

**Live Mode Integration Strategy**:
1. Check active user mode via `useAuth()`:
   ```ts
   const { user, isDemoMode, isAuthenticated } = useAuth();
   const isLiveMode = isAuthenticated && !isDemoMode;
   ```
2. When `isLiveMode` is active:
   - `refetchAll()` loads real records from:
     - `GET /api/projects` -> maps to `projects` / `allProjects`
     - `GET /api/fields` -> maps to `allFields`
     - `GET /api/evidence?fieldId=...` -> maps to `evidenceList`
     - `GET /api/assessments?fieldId=...` -> maps to `assessmentStatus` and rule results
     - `GET /api/reviews` -> maps to `reviewQueue`
     - `GET /api/satellite/observations?fieldId=...` -> maps to `satelliteObservations`
   - Store auto-refetches when `selectedFieldId` changes.
   - When evidence is uploaded or reviewed, store refreshes the relevant field's evidence and assessment status from the backend.
3. When `isDemoMode` is active (or unauthenticated demo inspection):
   - Retain current deterministic behavior using `mock-data.ts`.
   - Never mutate backend database.
4. **Zero External State Dependencies**:
   - Keep state within React Context and hooks (`useState`, `useCallback`, `useMemo`).
   - Do not add Zustand, Redux, or external store libraries.

---

## 5. Domain Views & UI Architecture

### 5.1 Route Inventory & View Architecture

The application is structured into three main authenticated portals under `src/routes/`:

```
src/routes/
├── __root.tsx                     # Root shell wrapping QueryClientProvider & AuthProvider
├── login.tsx                      # Universal login (Production credentials + Demo Selector)
├── auth.tsx                       # Redirect helper -> /login?next=...
├── dashboard.tsx                  # Legacy dashboard route wrapping TerraLedgerProvider
├── marketplace.tsx                # Public marketplace route
├── passport.tsx                   # Digital MRV passport route
│
├── workspace/                     # Internal MRV Workspace (Auditors, Developers, Field Officers)
│   ├── index.tsx                  # Redirects to /workspace/command
│   ├── command.tsx                # Command Centre Fleet Operational View
│   ├── projects/
│   │   ├── index.tsx              # Project Registry list
│   │   └── $projectId.tsx         # Project Operational Parameters & Parcel Sample
│   ├── fields/
│   │   ├── index.tsx              # Field Parcel Registry table
│   │   └── $fieldId.tsx           # Parcel verification record & boundary inspection
│   ├── evidence.tsx               # Evidence Explorer (Graph, Provenance, Upload)
│   ├── assessments.tsx            # MRV Assessments & 5-Rule Engine outputs
│   ├── review.tsx                 # Review Management & Decision Queue
│   ├── satellite.tsx              # Copernicus Sentinel-2 MSI Spectral Analysis
│   ├── terra-intelligence.tsx     # Geospatial multi-spectral investigation
│   ├── dossier.tsx                # Institutional Verification Dossier
│   ├── enquiries.tsx              # Internal triage of buyer credit enquiries
│   ├── reports.tsx                # Fleet-level MRV reporting
│   ├── farmers.tsx                # Smallholder roster overview
│   └── partnerships.tsx           # Industrial partnership inquiries
│
├── farmer/                        # Farmer Portal (Mobile-first smallholder interface)
│   ├── index.tsx                  # Redirects to /farmer/home
│   ├── home.tsx                   # Farmer landing & status overview
│   ├── dashboard.tsx              # Detailed parcel summary & action shortcuts
│   ├── fields/
│   │   ├── index.tsx              # "My Fields" list
│   │   ├── $fieldId.tsx           # Field parcel inspection
│   │   └── register.tsx           # Register new parcel form
│   ├── season/
│   │   ├── index.tsx              # Season activity timeline
│   │   └── add.tsx                # Log irrigation/sowing activity
│   ├── evidence/
│   │   ├── index.tsx              # Evidence submission & photo capture
│   │   └── history.tsx            # Upload history and status audit
│   ├── notifications.tsx          # Real-time parcel alerts and correction requests
│   └── profile.tsx                # Farmer identity & FPO affiliation
│
└── buyers/                        # Buyer Due Diligence Portal (Institutional Offtake)
    ├── index.tsx                  # Redirects to /buyers/marketplace
    ├── marketplace.tsx            # Directory of published, credit-safe projects
    ├── projects.$projectId.tsx    # Project due diligence room (omits all farmer PII)
    ├── enquiries.tsx              # Buyer's submitted credit enquiries
    ├── enquiry.tsx                # Credit reservation & term sheet inquiry form
    └── profile.tsx                # Corporate buyer profile & ESG parameters
```

### 5.2 UI State Patterns & Standards

All integrated views must support the five standard states using `src/components/terra-ledger/shared/status-states.tsx`:

1. **Loading State (`<LoadingState />`)**:
   - Displayed while fetching records over the network.
   - Shows spinning refresh icon, title, and descriptive message.
2. **Error State (`<ErrorState />`)**:
   - Displayed when an API request fails (e.g. network disconnect, 500 internal server error).
   - Renders alert icon, formatted error message, and a "Retry Request" button calling `refetch`.
3. **Empty State (`<EmptyState />`)**:
   - Displayed when query returns 0 items (e.g., no field parcels assigned, no notifications).
   - Includes contextual action button (e.g., "Register Parcel", "Submit Evidence").
4. **Unauthorized State (`<UnauthorizedState />`)**:
   - Displayed when user lacks portal access or specific permission.
   - Explains required role without exposing sensitive system internals.
5. **Demo Data Badge (`<DemoDataBadge />`)**:
   - Badges view as either `"Demo Data · [Source]"` (amber badge) or `"Live API Connection"` (emerald badge).
   - Prevents users/auditors from mistaking demo fixtures for real PostgreSQL data.

### 5.3 TanStack Router Tree Preservation Constraint

- **File**: `src/routeTree.gen.ts`
- **Current Git Status**: Uncommitted changes are present.
- **Rule**: This file is auto-generated by `@tanstack/router-plugin`. **DO NOT run `git checkout -- src/routeTree.gen.ts`, `git restore`, or trigger commands that overwrite or regenerate it.** It contains vital route imports and schema links that must remain preserved.

---

## 6. Type Adapters & Schema Contract Mappings

The backend Pydantic models in `backend/app/schemas/` differ from existing frontend interfaces in `src/lib/terra-ledger/types.ts` and `src/lib/types/`. The following adapters must be implemented to bridge the contracts cleanly.

### 6.1 Summary of Schema Discrepancies

| Domain | Backend Model (`backend/app/schemas/`) | Frontend Interface (`src/lib/`) | Key Differences & Adapters Required |
| :--- | :--- | :--- | :--- |
| **Envelopes** | `ListEnvelope[T]` (`items`, `total`, `limit`, `offset`) | `ApiResponse<T>` (`data`, `status`, `error`) | Frontend expects direct arrays; adapter must extract `.items` and expose pagination. |
| **Errors** | `ErrorEnvelope` (`error: {code, message, details}`) | `ApiError` (`code`, `message`, `details`) | Backend nests under `"error"`; client must unwrap `res.error.message`. |
| **Projects** | `Project` (`backend/app/schemas/project.py`) | `MarketplaceProject` (`terra-ledger/types.ts`) | `total_hectares` -> `totalHectares`; `estimated_tons_co2e_per_year` is `Optional[float]`; `outstanding_verification: List[str]`. |
| **Fields** | `FieldModel` (`backend/app/schemas/field.py`) | `FieldParcel` (`terra-ledger/types.ts`) | `coordinates: Coordinates {lat, lng}`; `boundary_polygon: List[List[float]]`; `target_emission_reduction_tonnes: Optional[float]` (can be null; frontend must not produce `NaN`). |
| **Evidence** | `Evidence` (`backend/app/schemas/evidence.py`) | `EvidenceItem` (`terra-ledger/types.ts`) | Status values: backend has `received`, `hash_recorded`, `self_reported`, `flagged`, `superseded`; frontend has `verified`, `flagged`, `pending`, `missing`. Timestamps: backend uses `captured_at` / `submitted_at`; frontend uses `timestamp`. |
| **Assessments** | `Assessment` (`backend/app/schemas/assessment.py`) | `RuleEvaluationResult[]` (`terra-ledger/types.ts`) | Backend has `rule_results` (`rule_id`, `result: pass/warn/fail`, `explanation`, `source_record_ids`); status ceiling is `UNVERIFIED`, `NEEDS_REVIEW`, `READY_FOR_VERIFICATION` (never `VERIFIED`). |
| **Reviews** | `Review` (`backend/app/schemas/review.py`) | `ReviewQueueItem` (`terra-ledger/types.ts`) | Backend status: `pending_review`, `in_investigation`, `resolved`, `escalated`; frontend status: `pending`, `in_review`, `resolved`. Decisions submitted via `POST /api/reviews/{id}/decision`. |
| **Activities** | `Activity` (`backend/app/schemas/activity.py`) | `ActivityRecord` (`types/farmer.ts`) | `activity_type` enum (`pre_sowing_irrigation`, `direct_seeding`, etc.) -> `type`; `declared_date` -> `date`. |
| **Enquiries** | `BuyerEnquiry` (`backend/app/schemas/buyer.py`) | `DueDiligenceItem` (`terra-ledger/types.ts`) | `volume_requested_tons` -> `volumeRequestedTons`; `buyer_org` -> `buyerOrg`. |
| **Satellite** | `SatelliteObservation` (`backend/app/schemas/satellite.py`) | `SatelliteObservation` (`terra-ledger/types.ts`) | `cloud_cover_percent` -> `cloudCoverPercent`; `mean_ndvi` is `Optional[float]`. |

### 6.2 Detailed Domain Mappings

#### 1. Projects Adapter
```ts
export function adaptBackendProject(p: BackendProject): MarketplaceProject {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    location: p.location,
    district: p.district,
    practice: p.practice || 'Direct Seeded Rice (DSR) + AWD',
    methodology: p.methodology || 'Methodology: pending confirmation',
    developer: p.developer,
    totalHectares: p.totalHectares ?? p.total_hectares ?? 0,
    enrolledParcels: p.enrolledParcels ?? p.enrolled_parcels ?? 0,
    farmerCount: p.farmerCount ?? p.farmer_count ?? 0,
    estimatedTonsCo2ePerYear: p.estimatedTonsCo2ePerYear ?? p.estimated_tons_co2e_per_year ?? 0,
    readinessScorePercent: p.readinessScorePercent ?? p.readiness_score_percent ?? 0,
    assessmentStatus: p.assessmentStatus ?? p.assessment_status ?? 'UNVERIFIED',
    indicativePricePerTonUsd: p.indicativePricePerTonUsd ?? p.indicative_price_per_ton_usd ?? 0,
    vintage: p.vintage || 'Kharif 2026',
    description: p.description || '',
    highlights: p.highlights || [],
    evidenceDepth: {
      satellitePasses: p.evidenceDepth?.satellitePasses ?? 0,
      groundPhotos: p.evidenceDepth?.groundPhotos ?? 0,
      waterLogs: p.evidenceDepth?.waterLogs ?? 0,
    },
    fieldIds: p.fieldIds || [],
  };
}
```

#### 2. Field Parcels Adapter (Handling PostGIS Boundaries & Nulls)
```ts
export function adaptBackendField(f: BackendField): FieldParcel {
  const boundary: Array<[number, number]> = Array.isArray(f.boundaryPolygon)
    ? (f.boundaryPolygon as Array<[number, number]>)
    : [];

  return {
    id: f.id,
    code: f.code || f.id,
    name: f.name || `Field ${f.code || f.id}`,
    farmerName: f.farmerName || 'Registered Smallholder',
    farmerNameLocal: f.farmerNameLocal || '',
    district: f.district || 'Punjab',
    state: f.state || 'Punjab',
    areaHa: f.areaHa ?? f.area_ha ?? 0,
    areaAcres: f.areaAcres ?? f.area_acres ?? (f.areaHa ? Number((f.areaHa * 2.47105).toFixed(2)) : 0),
    practice: f.practice || 'Direct Seeded Rice (DSR)',
    crop: f.crop || 'PR-126 Basmati / Paddy',
    season: f.season || 'Kharif 2026',
    coordinates: {
      lat: f.coordinates?.lat ?? 30.9,
      lng: f.coordinates?.lng ?? 75.8,
    },
    boundaryPolygon: boundary,
    targetEmissionReductionTonnes: f.targetEmissionReductionTonnes ?? f.target_emission_reduction_tonnes ?? 0,
    projectId: f.projectId ?? f.project_id,
    geometrySource: (f.geometrySource as any) || 'Cadastral Revenue Record',
    assessmentStatus: (f.assessmentStatus as any) || 'UNVERIFIED',
  };
}
```

#### 3. Evidence Adapter (Handling Hashes & Status Enums)
```ts
export function adaptBackendEvidence(e: BackendEvidence): EvidenceItem {
  // Map backend status to frontend status
  let mappedStatus: EvidenceItem['status'] = 'pending';
  if (e.status === 'hash_recorded' || e.status === 'received') mappedStatus = 'verified';
  else if (e.status === 'flagged') mappedStatus = 'flagged';
  else if (e.status === 'superseded') mappedStatus = 'pending';

  return {
    id: e.id,
    title: e.title,
    type: e.type as any,
    category: e.category as any,
    status: mappedStatus,
    description: e.description || '',
    timestamp: e.submittedAt || e.capturedAt || new Date().toISOString(),
    provenance: {
      author: e.provenance?.author || 'Unknown Submitter',
      source: e.provenance?.source || 'VirsaFlow Client',
      sha256: e.provenance?.sha256 || '',
      device: e.provenance?.device,
      gpsCoordinates: e.provenance?.gpsCoordinates,
      spatialDistanceMeters: e.provenance?.spatialDistanceMeters,
      reviewStatus: e.provenance?.reviewStatus || 'Pending Assessment',
    },
    fileDetails: e.fileDetails ? {
      name: e.fileDetails.name,
      sizeKb: e.fileDetails.sizeKb,
      mime: e.fileDetails.mime,
    } : undefined,
    supersedesId: e.supersedesId,
    fieldId: e.fieldId,
  };
}
```

#### 4. Review Queue Adapter
```ts
export function adaptBackendReview(r: BackendReview): ReviewQueueItem {
  let mappedStatus: ReviewQueueItem['status'] = 'pending';
  if (r.status === 'in_investigation') mappedStatus = 'in_review';
  else if (r.status === 'resolved') mappedStatus = 'resolved';

  return {
    id: r.id,
    evidenceId: r.evidenceRefId || r.id,
    evidenceTitle: r.title,
    evidenceType: 'photo',
    fieldId: r.fieldId,
    fieldCode: r.fieldId,
    projectId: 'PRJ-PB-DSR-01',
    farmerName: 'Registered Farmer',
    submittedAt: r.reportedDate,
    status: mappedStatus,
    priority: (r.severity as any) || 'medium',
    rules: [],
    assignedReviewer: r.assignedTo,
    reviewNotes: r.comment,
    lastActionAt: r.resolvedAt,
  };
}
```

---

## 7. Risk Analysis & Recommendations for Implementation

1. **Vite Proxy vs Direct URL**:
   - In development, Vite runs on `http://localhost:5173` (or similar) while FastAPI runs on `http://127.0.0.1:8000`.
   - To avoid cross-origin cookie / preflight latency and CORS issues, configure `VITE_API_BASE_URL` to point to `http://127.0.0.1:8000` (or configure a `/api` proxy in Vite if needed). The CORS middleware in `backend/app/main.py` permits requests from origins configured in `settings.CORS_ORIGINS`.

2. **Status Ceiling Verification**:
   - Under no circumstances should frontend components fabricate a `VERIFIED` status. The allowed statuses in this sprint are strictly:
     - `UNVERIFIED`
     - `NEEDS_REVIEW`
     - `READY_FOR_VERIFICATION`
   - Any project or field displaying `VERIFIED` is a critical MRV compliance violation.

3. **Non-Destructive Superseding History (HTTP 409)**:
   - When calling `POST /api/evidence/{id}/supersede`, if the target evidence was already superseded, backend returns `HTTP 409 CONFLICT` with code `ALREADY_SUPERSEDED`.
   - The UI must catch this error, present an informative message to the user, and reload the evidence history rather than crashing.

4. **Git Safety Check**:
   - Always verify `git status` before and after operations. Never stage or discard `.agents/` or `src/routeTree.gen.ts`.
