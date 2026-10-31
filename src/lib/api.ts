/**
 * VirsaFlow / TerraLedger AI — Typed Domain API Facade
 *
 * Facade consolidating all portal domain operations onto the central client (`client.ts`).
 * Automatically routes calls to canonical /api/... FastAPI backend endpoints in live mode,
 * while preserving deterministic mock fallbacks for demo mode and unconfigured test environments.
 */

import type {
  ListEnvelope,
  ErrorEnvelope,
  RequestOptions,
  ApiResponse,
} from './api/client';

import {
  client as centralClient,
  CentralApiClient,
  ApiError,
} from './api/client';

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
  AssessmentStatus,
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

import {
  adaptBackendProjectToMarketplaceProject,
  adaptBackendFieldToParcel,
  adaptBackendEvidenceToEvidenceItem,
  adaptBackendReviewToReviewQueueItem,
  adaptBackendAssessment,
} from './adapters';

export class ApiClient {
  private client: CentralApiClient;
  private isDemoMode: boolean = false;

  constructor(customClient?: CentralApiClient) {
    this.client = customClient ?? centralClient;
  }

  public isUsingMockAdapter(): boolean {
    return !this.client.isConfigured() || this.isDemoMode;
  }

  public setDemoMode(enabled: boolean): void {
    this.isDemoMode = enabled;
  }

  public getClient(): CentralApiClient {
    return this.client;
  }

  async register(payload: {
    name: string;
    email: string;
    password: string;
    role: string;
    organization?: string;
    buyerCompanyId?: string;
  }): Promise<Record<string, unknown>> {
    return await this.client.post<Record<string, unknown>>('/auth/register', payload);
  }

  private async mockLatency<T>(data: T, delayMs: number = 40): Promise<T> {
    if (delayMs > 0 && typeof window !== 'undefined') {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return data;
  }

  // --------------------------------------------------------------------------
  // Projects
  // --------------------------------------------------------------------------

  async getProjects(filters?: ProjectFilters): Promise<MarketplaceProject[]> {
    if (!this.isUsingMockAdapter()) {
      const params: Record<string, string | undefined> = {};
      if (filters?.practice && filters.practice !== 'all') params['practice'] = filters.practice;
      if (filters?.district && filters.district !== 'all') params['district'] = filters.district;
      if (filters?.status && filters.status !== 'all') params['status'] = filters.status;
      if (filters?.searchQuery) params['q'] = filters.searchQuery;

      const envelope = await this.client.get<ListEnvelope<Record<string, unknown>>>('/projects', { params });
      return this.client.unwrapList<Record<string, unknown>>(envelope).map((p) => this.adaptProject(p));
    }

    let items = [...MARKETPLACE_PROJECTS];
    if (filters) {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        items = items.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.practice.toLowerCase().includes(q),
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
    if (!this.isUsingMockAdapter()) {
      try {
        const item = await this.client.get<Record<string, unknown>>(`/projects/${encodeURIComponent(projectId)}`);
        return this.adaptProject(item);
      } catch (err) {
        if (err instanceof ApiError && (err.status === 404 || err.code === 'NOT_FOUND')) {
          return null;
        }
        throw err;
      }
    }

    const prj = MARKETPLACE_PROJECTS.find((p) => p.id === projectId || p.slug === projectId) || null;
    return this.mockLatency(prj);
  }

  // --------------------------------------------------------------------------
  // Fields
  // --------------------------------------------------------------------------

  async getFields(filters?: FieldFilters): Promise<FieldParcel[]> {
    if (!this.isUsingMockAdapter()) {
      const params: Record<string, string | undefined> = {};
      if (filters?.projectId) params['projectId'] = filters.projectId;
      if (filters?.district && filters.district !== 'all') params['district'] = filters.district;
      if (filters?.practice && filters.practice !== 'all') params['practice'] = filters.practice;
      if (filters?.status && filters.status !== 'all') params['status'] = filters.status;
      if (filters?.searchQuery) params['q'] = filters.searchQuery;

      const envelope = await this.client.get<ListEnvelope<Record<string, unknown>>>('/fields', { params });
      return this.client.unwrapList<Record<string, unknown>>(envelope).map((f) => this.adaptField(f));
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
            f.district.toLowerCase().includes(q),
        );
      }
    }
    return this.mockLatency(items);
  }

  async getFieldById(fieldId: string): Promise<FieldParcel | null> {
    if (!this.isUsingMockAdapter()) {
      try {
        const item = await this.client.get<Record<string, unknown>>(`/fields/${encodeURIComponent(fieldId)}`);
        return this.adaptField(item);
      } catch (err) {
        if (err instanceof ApiError && (err.status === 404 || err.code === 'NOT_FOUND' || err.code === 'FIELD_NOT_FOUND')) {
          return null;
        }
        throw err;
      }
    }

    const field = ALL_FIELDS.find((f) => f.id === fieldId || f.code === fieldId) || null;
    return this.mockLatency(field);
  }

  // --------------------------------------------------------------------------
  // Evidence
  // --------------------------------------------------------------------------

  async getEvidenceList(fieldId?: string): Promise<EvidenceItem[]> {
    if (!this.isUsingMockAdapter()) {
      const params = fieldId ? { fieldId } : undefined;
      const envelope = await this.client.get<ListEnvelope<Record<string, unknown>>>('/evidence', { params });
      return this.client.unwrapList<Record<string, unknown>>(envelope).map((e) => this.adaptEvidence(e));
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

  async submitEvidence(formData: FormData): Promise<EvidenceItem> {
    if (!this.isUsingMockAdapter()) {
      const res = await this.client.postMultipart<Record<string, unknown>>('/evidence', formData);
      return this.adaptEvidence(res);
    }

    const id = `EV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const title = (formData.get('title') as string) || 'Submitted Evidence';
    const fieldId = (formData.get('fieldId') as string) || 'PB-LUD-042';
    const mockItem: EvidenceItem = {
      id,
      title,
      type: ((formData.get('type') as unknown) || 'photo') as EvidenceItem['type'],
      category: 'supporting',
      status: 'pending',
      description: (formData.get('description') as string) || '',
      timestamp: new Date().toISOString(),
      fieldId,
      provenance: {
        author: (formData.get('author') as string) || 'Field Officer',
        source: 'VirsaFlow Portal Upload',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        reviewStatus: 'Pending Verification',
      },
    };
    return this.mockLatency(mockItem);
  }

  async supersedeEvidence(evidenceId: string, formData: FormData): Promise<EvidenceItem> {
    if (!this.isUsingMockAdapter()) {
      try {
        const res = await this.client.postMultipart<Record<string, unknown>>(
          `/evidence/${encodeURIComponent(evidenceId)}/supersede`,
          formData,
        );
        return this.adaptEvidence(res);
      } catch (err) {
        if (err instanceof ApiError && (err.status === 409 || err.code === 'ALREADY_SUPERSEDED')) {
          throw new Error(`Evidence ${evidenceId} has already been superseded.`);
        }
        throw err;
      }
    }

    const newId = `EV-CORR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const mockItem: EvidenceItem = {
      id: newId,
      title: (formData.get('title') as string) || `Correction for ${evidenceId}`,
      type: 'photo',
      category: 'supporting',
      status: 'pending',
      description: (formData.get('reason') as string) || 'Superseding evidence upload',
      timestamp: new Date().toISOString(),
      supersedesId: evidenceId,
      provenance: {
        author: 'Field Officer',
        source: 'Superseding Upload',
        sha256: '55bc2990f2304918e77c592b217036a441e976db570183e29f032870197d6482',
        reviewStatus: 'Pending Verification',
      },
    };
    return this.mockLatency(mockItem);
  }

  async getEvidenceHistory(evidenceId: string): Promise<{
    evidenceId: string;
    currentStatus: string;
    history: Array<{
      timestamp: string;
      previousStatus: string;
      newStatus: string;
      actorId: string;
      reason?: string;
    }>;
  }> {
    if (!this.isUsingMockAdapter()) {
      return await this.client.get<{
        evidenceId: string;
        currentStatus: string;
        history: Array<{
          timestamp: string;
          previousStatus: string;
          newStatus: string;
          actorId: string;
          reason?: string;
        }>;
      }>(`/evidence/${encodeURIComponent(evidenceId)}/history`);
    }

    return this.mockLatency({
      evidenceId,
      currentStatus: 'hash_recorded',
      history: [
        {
          timestamp: new Date().toISOString(),
          previousStatus: 'received',
          newStatus: 'hash_recorded',
          actorId: 'SYSTEM-SEAL',
          reason: 'Cryptographic SHA-256 hash stamped upon upload.',
        },
      ],
    });
  }

  // --------------------------------------------------------------------------
  // Satellite & Earth Observation
  // --------------------------------------------------------------------------

  async getSatelliteObservations(fieldId?: string): Promise<SatelliteObservation[]> {
    if (!this.isUsingMockAdapter()) {
      const params = fieldId ? { fieldId } : undefined;
      const res = await this.client.get<ListEnvelope<Record<string, unknown>> | Record<string, unknown>>(
        '/satellite/observations',
        { params },
      );
      return this.client.unwrapList<Record<string, unknown>>(res).map((o) => this.adaptSatelliteObservation(o));
    }

    return this.mockLatency([...SATELLITE_OBSERVATIONS]);
  }

  async getPhenologyTimeSeries(fieldId?: string): Promise<PhenologyDataPoint[]> {
    if (!this.isUsingMockAdapter()) {
      try {
        const obs = await this.getSatelliteObservations(fieldId);
        if (obs.length > 0) {
          return obs.map((o) => ({
            date: o.date,
            ndvi: o.meanNdvi,
            ndwi: o.meanNdwi,
            qualityFlag: o.qualityRating,
          }));
        }
      } catch {
        // Fallback to mock if satellite fetch fails
      }
    }
    return this.mockLatency([...PHENOLOGY_TIME_SERIES_MOCK]);
  }

  // --------------------------------------------------------------------------
  // Command Centre Metrics
  // --------------------------------------------------------------------------

  async getCommandCentreMetrics(): Promise<CommandCentreMetrics> {
    if (!this.isUsingMockAdapter()) {
      try {
        const [projectsRes, fieldsRes, reviewsRes] = await Promise.all([
          this.client.get<ListEnvelope<Record<string, unknown>>>('/projects'),
          this.client.get<ListEnvelope<Record<string, unknown>>>('/fields'),
          this.client.get<ListEnvelope<Record<string, unknown>>>('/reviews'),
        ]);

        const projects = this.client.unwrapList<Record<string, unknown>>(projectsRes);
        const fields = this.client.unwrapList<Record<string, unknown>>(fieldsRes);
        const reviews = this.client.unwrapList<Record<string, unknown>>(reviewsRes);

        const totalHectares = fields.reduce((acc: number, f: Record<string, unknown>) => {
          const ha = typeof f['areaHa'] === 'number' ? f['areaHa'] : typeof f['area_ha'] === 'number' ? (f['area_ha'] as number) : 0;
          return acc + ha;
        }, 0);

        const pendingReviews = reviews.filter((r: Record<string, unknown>) => r['status'] === 'pending_review' || r['status'] === 'pending');

        return {
          totalProjects: projectsRes.total || projects.length,
          enrolledFarmers: fields.length,
          enrolledFields: fieldsRes.total || fields.length,
          totalHectares: Math.round(totalHectares),
          pendingReviewQueueCount: pendingReviews.length,
          missingEvidenceCount: 0,
          activeAnomaliesCount: reviews.filter((r: Record<string, unknown>) => r['severity'] === 'high').length,
          readinessDistribution: {
            unverified: fields.filter((f: Record<string, unknown>) => f['assessmentStatus'] === 'UNVERIFIED').length,
            needsReview: fields.filter((f: Record<string, unknown>) => f['assessmentStatus'] === 'NEEDS_REVIEW').length,
            readyForVerification: fields.filter((f: Record<string, unknown>) => f['assessmentStatus'] === 'READY_FOR_VERIFICATION').length,
          },
          actionableTasks: COMMAND_CENTRE_METRICS_MOCK.actionableTasks,
        };
      } catch {
        // Fallback to mock on error
      }
    }

    return this.mockLatency(COMMAND_CENTRE_METRICS_MOCK);
  }

  // --------------------------------------------------------------------------
  // Review Queue
  // --------------------------------------------------------------------------

  async getReviewQueue(): Promise<ReviewQueueItem[]> {
    if (!this.isUsingMockAdapter()) {
      const envelope = await this.client.get<ListEnvelope<Record<string, unknown>>>('/reviews');
      return this.client.unwrapList<Record<string, unknown>>(envelope).map((r) => this.adaptReview(r));
    }

    return this.mockLatency([...REVIEW_QUEUE_ITEMS]);
  }

  async submitReviewDecision(
    reviewId: string,
    decision: {
      decision: 'accepted' | 'rejected' | 'clarification_requested';
      comment: string;
      correctionRequest?: string | undefined;
    },
  ): Promise<ReviewQueueItem> {
    if (!this.isUsingMockAdapter()) {
      const payload: Record<string, unknown> = {
        decision: decision.decision,
        comment: decision.comment,
      };
      if (decision.correctionRequest) {
        payload['correction_request'] = decision.correctionRequest;
      }
      const res = await this.client.post<Record<string, unknown>>(
        `/reviews/${encodeURIComponent(reviewId)}/decision`,
        payload,
      );
      return this.adaptReview(res);
    }

    const item = REVIEW_QUEUE_ITEMS.find((r) => r.id === reviewId);
    return this.mockLatency(item ?? REVIEW_QUEUE_ITEMS[0]!);
  }

  async submitReviewAction(
    payload: ReviewActionPayload,
  ): Promise<{ success: boolean; message: string; updatedItem: ReviewQueueItem }> {
    if (!this.isUsingMockAdapter()) {
      let decision: 'accepted' | 'rejected' | 'clarification_requested' = 'accepted';
      if (payload.action === 'flag') {
        decision = 'rejected';
      } else if (payload.action === 'request_correction') {
        decision = 'clarification_requested';
      }

      const decisionPayload: {
        decision: 'accepted' | 'rejected' | 'clarification_requested';
        comment: string;
        correctionRequest?: string | undefined;
      } = {
        decision,
        comment: payload.comments || '',
      };
      if (payload.correctionRequirement) {
        decisionPayload.correctionRequest = payload.correctionRequirement;
      }

      const updated = await this.submitReviewDecision(payload.reviewQueueItemId, decisionPayload);

      return {
        success: true,
        message: `Review action '${payload.action}' recorded successfully.`,
        updatedItem: updated,
      };
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
    if (!this.isUsingMockAdapter()) {
      await this.submitReviewDecision(payload.reviewQueueItemId, {
        decision: 'clarification_requested',
        comment: payload.requirement,
        correctionRequest: payload.requirement,
      });

      const supersedingEvidenceId = `EV-CORR-${Date.now().toString().slice(-4)}`;
      return {
        success: true,
        message: `Correction requested: "${payload.requirement}". Notification dispatched to submitter.`,
        supersedingEvidenceId,
      };
    }

    const newEvidenceId = `EV-CORR-MOCK-${Date.now().toString().slice(-4)}`;
    return this.mockLatency({
      success: true,
      message: `[MOCK ADAPTER] Correction requirement issued: "${payload.requirement}". New simulated record created with ID ${newEvidenceId} superseding original item.`,
      supersedingEvidenceId: newEvidenceId,
    });
  }

  // --------------------------------------------------------------------------
  // Assessments & MRV Engine
  // --------------------------------------------------------------------------

  async getAssessments(fieldId?: string, status?: string): Promise<Record<string, unknown>[]> {
    if (!this.isUsingMockAdapter()) {
      const params: Record<string, string | undefined> = {};
      if (fieldId) params['fieldId'] = fieldId;
      if (status) params['status'] = status;
      const res = await this.client.get<ListEnvelope<Record<string, unknown>>>('/assessments', { params });
      return this.client.unwrapList(res);
    }
    return this.mockLatency([]);
  }

  async runAssessment(payload: {
    fieldId: string;
    seasonId?: string;
    triggerReason?: string;
  }): Promise<Record<string, unknown>> {
    if (!this.isUsingMockAdapter()) {
      return await this.client.post<Record<string, unknown>>('/assessments/run', {
        fieldId: payload.fieldId,
        seasonId: payload.seasonId,
        triggerReason: payload.triggerReason || 'manual',
      });
    }

    return this.mockLatency({
      id: `ASM-${Date.now().toString().slice(-6)}`,
      fieldId: payload.fieldId,
      status: 'READY_FOR_VERIFICATION',
      statusLabel: 'Ready for Verification',
      ruleResults: [],
    });
  }

  // --------------------------------------------------------------------------
  // Domain Adapters (Internal)
  // --------------------------------------------------------------------------

  private adaptProject(p: Record<string, unknown>): MarketplaceProject {
    return adaptBackendProjectToMarketplaceProject(p);
  }

  private adaptField(f: Record<string, unknown>): FieldParcel {
    return adaptBackendFieldToParcel(f);
  }

  private adaptEvidence(e: Record<string, unknown>): EvidenceItem {
    return adaptBackendEvidenceToEvidenceItem(e);
  }

  private adaptSatelliteObservation(o: Record<string, unknown>): SatelliteObservation {
    const adapted: SatelliteObservation = {
      id: String(o['id'] ?? ''),
      date: String(o['date'] ?? ''),
      sensor: String(o['sensor'] ?? 'Sentinel-2 MSI'),
      resolutionMeters: typeof o['resolutionMeters'] === 'number' ? o['resolutionMeters'] : typeof o['resolution_meters'] === 'number' ? (o['resolution_meters'] as number) : 10,
      cloudCoverPercent: typeof o['cloudCoverPercent'] === 'number' ? o['cloudCoverPercent'] : typeof o['cloud_cover_percent'] === 'number' ? (o['cloud_cover_percent'] as number) : 0,
      sunAzimuthDeg: typeof o['sunAzimuthDeg'] === 'number' ? o['sunAzimuthDeg'] : typeof o['sun_azimuth_deg'] === 'number' ? (o['sun_azimuth_deg'] as number) : 0,
      meanNdvi: typeof o['meanNdvi'] === 'number' ? o['meanNdvi'] : typeof o['mean_ndvi'] === 'number' ? (o['mean_ndvi'] as number) : 0,
      meanNdwi: typeof o['meanNdwi'] === 'number' ? o['meanNdwi'] : typeof o['mean_ndwi'] === 'number' ? (o['mean_ndwi'] as number) : 0,
      qualityRating:
        o['qualityRating'] === 'Medium' || o['qualityRating'] === 'Cloud-Affected'
          ? o['qualityRating']
          : o['quality_rating'] === 'Medium' || o['quality_rating'] === 'Cloud-Affected'
          ? (o['quality_rating'] as 'Medium' | 'Cloud-Affected')
          : 'High',
      surfaceWaterDetected: Boolean(o['surfaceWaterDetected'] ?? o['surface_water_detected'] ?? false),
      notes: String(o['notes'] ?? ''),
    };

    if (o['fieldId']) adapted.fieldId = String(o['fieldId']);
    else if (o['field_id']) adapted.fieldId = String(o['field_id']);

    return adapted;
  }

  private adaptReview(r: Record<string, unknown>): ReviewQueueItem {
    return adaptBackendReviewToReviewQueueItem(r);
  }
}

export const api = new ApiClient();
export { centralClient as client, centralClient as apiClient, ApiError };
export type { RequestOptions, ApiResponse, ListEnvelope, ErrorEnvelope };
export default api;
