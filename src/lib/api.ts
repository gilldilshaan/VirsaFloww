import {
  FieldParcel,
  MarketplaceProject,
  EvidenceItem,
  SatelliteObservation,
  ReviewQueueItem,
  ReviewActionPayload,
  CommandCentreMetrics,
  PhenologyDataPoint,
  ProjectFilters,
  FieldFilters,
  ApiResponse,
  ApiError,
} from './terra-ledger/types';

import {
  PRIMARY_FIELD,
  ALL_FIELDS,
  MARKETPLACE_PROJECTS,
  INITIAL_EVIDENCE_ITEMS,
  SATELLITE_OBSERVATIONS,
  REVIEW_QUEUE_ITEMS,
  COMMAND_CENTRE_METRICS_MOCK,
  PHENOLOGY_TIME_SERIES_MOCK,
} from './terra-ledger/mock-data';

/**
 * TerraLedger / VirsaFlow Typed API Client Adapter
 * 
 * Provides a typed interface for frontend modules (Portal B) to communicate
 * with the MRV verification backend. Uses mock fixtures until the live backend
 * API contract is finalized with the backend team.
 */
class ApiClient {
  private baseUrl: string;
  private isLiveBackendConfigured: boolean;

  constructor() {
    this.baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.['VITE_MRV_API_BASE_URL']) || '';
    this.isLiveBackendConfigured = Boolean(this.baseUrl && this.baseUrl.trim().length > 0);
  }

  public isUsingMockAdapter(): boolean {
    return !this.isLiveBackendConfigured;
  }

  private async mockLatency<T>(data: T, delayMs: number = 80): Promise<T> {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return data;
  }

  // --------------------------------------------------------------------------
  // Projects
  // --------------------------------------------------------------------------

  async getProjects(filters?: ProjectFilters): Promise<MarketplaceProject[]> {
    if (this.isLiveBackendConfigured) {
      const queryParams = new URLSearchParams();
      if (filters?.practice && filters.practice !== 'all') queryParams.set('practice', filters.practice);
      if (filters?.district && filters.district !== 'all') queryParams.set('district', filters.district);
      if (filters?.status && filters.status !== 'all') queryParams.set('status', filters.status);
      if (filters?.searchQuery) queryParams.set('q', filters.searchQuery);

      const res = await fetch(`${this.baseUrl}/api/v1/projects?${queryParams.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch projects (HTTP ${res.status})`);
      const body: ApiResponse<MarketplaceProject[]> = await res.json();
      return body.data;
    }

    let items = [...MARKETPLACE_PROJECTS];
    if (filters) {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        items = items.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.practice.toLowerCase().includes(q)
        );
      }
      if (filters.practice && filters.practice !== 'all') {
        items = items.filter((p) => p.practice.toLowerCase().includes(filters.practice!.toLowerCase()));
      }
      if (filters.district && filters.district !== 'all') {
        items = items.filter((p) => p.district.toLowerCase() === filters.district!.toLowerCase());
      }
      if (filters.status && filters.status !== 'all') {
        items = items.filter((p) => p.assessmentStatus === filters.status);
      }
    }
    return this.mockLatency(items);
  }

  async getProjectById(projectId: string): Promise<MarketplaceProject | null> {
    if (this.isLiveBackendConfigured) {
      const res = await fetch(`${this.baseUrl}/api/v1/projects/${encodeURIComponent(projectId)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Failed to fetch project ${projectId} (HTTP ${res.status})`);
      const body: ApiResponse<MarketplaceProject> = await res.json();
      return body.data;
    }

    const prj = MARKETPLACE_PROJECTS.find((p) => p.id === projectId || p.slug === projectId) || null;
    return this.mockLatency(prj);
  }

  // --------------------------------------------------------------------------
  // Fields
  // --------------------------------------------------------------------------

  async getFields(filters?: FieldFilters): Promise<FieldParcel[]> {
    if (this.isLiveBackendConfigured) {
      const queryParams = new URLSearchParams();
      if (filters?.projectId) queryParams.set('projectId', filters.projectId);
      if (filters?.district && filters.district !== 'all') queryParams.set('district', filters.district);
      if (filters?.practice && filters.practice !== 'all') queryParams.set('practice', filters.practice);
      if (filters?.status && filters.status !== 'all') queryParams.set('status', filters.status);
      if (filters?.searchQuery) queryParams.set('q', filters.searchQuery);

      const res = await fetch(`${this.baseUrl}/api/v1/fields?${queryParams.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch fields (HTTP ${res.status})`);
      const body: ApiResponse<FieldParcel[]> = await res.json();
      return body.data;
    }

    let items = [...ALL_FIELDS];
    if (filters) {
      if (filters.projectId) {
        items = items.filter((f) => f.projectId === filters.projectId);
      }
      if (filters.district && filters.district !== 'all') {
        items = items.filter((f) => f.district.toLowerCase() === filters.district!.toLowerCase());
      }
      if (filters.practice && filters.practice !== 'all') {
        items = items.filter((f) => f.practice.toLowerCase().includes(filters.practice!.toLowerCase()));
      }
      if (filters.status && filters.status !== 'all') {
        items = items.filter((f) => f.assessmentStatus === filters.status);
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        items = items.filter(
          (f) =>
            f.code.toLowerCase().includes(q) ||
            f.name.toLowerCase().includes(q) ||
            f.farmerName.toLowerCase().includes(q) ||
            f.district.toLowerCase().includes(q)
        );
      }
    }
    return this.mockLatency(items);
  }

  async getFieldById(fieldId: string): Promise<FieldParcel | null> {
    if (this.isLiveBackendConfigured) {
      const res = await fetch(`${this.baseUrl}/api/v1/fields/${encodeURIComponent(fieldId)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Failed to fetch field ${fieldId} (HTTP ${res.status})`);
      const body: ApiResponse<FieldParcel> = await res.json();
      return body.data;
    }

    const field = ALL_FIELDS.find((f) => f.id === fieldId || f.code === fieldId) || null;
    return this.mockLatency(field);
  }

  // --------------------------------------------------------------------------
  // Evidence
  // --------------------------------------------------------------------------

  async getEvidenceList(fieldId?: string): Promise<EvidenceItem[]> {
    if (this.isLiveBackendConfigured) {
      const url = fieldId
        ? `${this.baseUrl}/api/v1/fields/${encodeURIComponent(fieldId)}/evidence`
        : `${this.baseUrl}/api/v1/evidence`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch evidence (HTTP ${res.status})`);
      const body: ApiResponse<EvidenceItem[]> = await res.json();
      return body.data;
    }

    if (fieldId && fieldId !== PRIMARY_FIELD.id) {
      return this.mockLatency([
        {
          id: `EV-${fieldId}-01`,
          title: `Cadastral Registry Record for ${fieldId}`,
          type: 'document',
          category: 'supporting',
          status: 'verified',
          description: 'Verified land title deed from Punjab Revenue Portal.',
          timestamp: '2026-05-20 10:00 UTC',
          fieldId,
          fieldCode: fieldId,
          provenance: {
            author: 'Revenue Department, Govt of Punjab',
            source: 'Digital Jamabandi API',
            sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            reviewStatus: 'Verified by Agro-MRV Registrar',
          },
        },
      ]);
    }
    return this.mockLatency([...INITIAL_EVIDENCE_ITEMS]);
  }

  // --------------------------------------------------------------------------
  // Satellite & Earth Observation
  // --------------------------------------------------------------------------

  async getSatelliteObservations(fieldId?: string): Promise<SatelliteObservation[]> {
    if (this.isLiveBackendConfigured) {
      const url = fieldId
        ? `${this.baseUrl}/api/v1/fields/${encodeURIComponent(fieldId)}/satellite-observations`
        : `${this.baseUrl}/api/v1/satellite-observations`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch satellite observations (HTTP ${res.status})`);
      const body: ApiResponse<SatelliteObservation[]> = await res.json();
      return body.data;
    }

    return this.mockLatency([...SATELLITE_OBSERVATIONS]);
  }

  async getPhenologyTimeSeries(fieldId?: string): Promise<PhenologyDataPoint[]> {
    if (this.isLiveBackendConfigured) {
      const url = fieldId
        ? `${this.baseUrl}/api/v1/fields/${encodeURIComponent(fieldId)}/phenology`
        : `${this.baseUrl}/api/v1/phenology`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch phenology series (HTTP ${res.status})`);
      const body: ApiResponse<PhenologyDataPoint[]> = await res.json();
      return body.data;
    }

    return this.mockLatency([...PHENOLOGY_TIME_SERIES_MOCK]);
  }

  // --------------------------------------------------------------------------
  // Command Centre Metrics
  // --------------------------------------------------------------------------

  async getCommandCentreMetrics(): Promise<CommandCentreMetrics> {
    if (this.isLiveBackendConfigured) {
      const res = await fetch(`${this.baseUrl}/api/v1/command-centre/metrics`);
      if (!res.ok) throw new Error(`Failed to fetch Command Centre metrics (HTTP ${res.status})`);
      const body: ApiResponse<CommandCentreMetrics> = await res.json();
      return body.data;
    }

    return this.mockLatency(COMMAND_CENTRE_METRICS_MOCK);
  }

  // --------------------------------------------------------------------------
  // Review Queue
  // --------------------------------------------------------------------------

  async getReviewQueue(): Promise<ReviewQueueItem[]> {
    if (this.isLiveBackendConfigured) {
      const res = await fetch(`${this.baseUrl}/api/v1/review-queue`);
      if (!res.ok) throw new Error(`Failed to fetch Review Queue (HTTP ${res.status})`);
      const body: ApiResponse<ReviewQueueItem[]> = await res.json();
      return body.data;
    }

    return this.mockLatency([...REVIEW_QUEUE_ITEMS]);
  }

  async submitReviewAction(
    payload: ReviewActionPayload
  ): Promise<{ success: boolean; message: string; updatedItem: ReviewQueueItem }> {
    if (this.isLiveBackendConfigured) {
      const res = await fetch(`${this.baseUrl}/api/v1/review-queue/${encodeURIComponent(payload.reviewQueueItemId)}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed to submit review action (HTTP ${res.status})`);
      const body = await res.json();
      return body;
    }

    const item = REVIEW_QUEUE_ITEMS.find((r) => r.id === payload.reviewQueueItemId);
    const updatedItem: ReviewQueueItem = item
      ? {
          ...item,
          status: payload.action === 'approve' ? 'resolved' : 'in_review',
          assignedReviewer: payload.reviewer,
          reviewNotes: payload.comments,
          lastActionAt: new Date().toISOString(),
        }
      : {
          id: payload.reviewQueueItemId,
          evidenceId: payload.evidenceId,
          evidenceTitle: 'Reviewed Evidence Item',
          evidenceType: 'photo',
          fieldId: 'PB-LUD-042',
          fieldCode: 'PB-LUD-042',
          projectId: 'PRJ-PB-DSR-01',
          farmerName: 'Gurdev Singh Gill',
          submittedAt: new Date().toISOString(),
          status: 'resolved',
          priority: 'medium',
          rules: [],
          reviewNotes: payload.comments,
          lastActionAt: new Date().toISOString(),
        };

    const actionText =
      payload.action === 'approve'
        ? 'approved'
        : payload.action === 'flag'
        ? 'flagged'
        : 'correction requested for';

    return this.mockLatency({
      success: true,
      message: `Evidence ${payload.evidenceId} ${actionText} by ${payload.reviewer}. Timestamped action logged.`,
      updatedItem,
    });
  }

  async requestCorrection(payload: {
    reviewQueueItemId: string;
    requirement: string;
    reviewer: string;
  }): Promise<{ success: boolean; message: string; supersedingEvidenceId: string }> {
    if (this.isLiveBackendConfigured) {
      const res = await fetch(`${this.baseUrl}/api/v1/review-queue/${encodeURIComponent(payload.reviewQueueItemId)}/correction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Failed to request correction (HTTP ${res.status})`);
      return await res.json();
    }

    const newEvidenceId = `EV-CORR-MOCK-${Date.now().toString().slice(-4)}`;
    return this.mockLatency({
      success: true,
      message: `[MOCK ADAPTER] Correction requirement issued: "${payload.requirement}". New simulated record created with ID ${newEvidenceId} superseding original item.`,
      supersedingEvidenceId: newEvidenceId,
    });
  }
}

export const api = new ApiClient();
export default api;
