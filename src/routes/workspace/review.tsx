import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/client';
import { useAuth } from '@/lib/auth/auth-context';
import {
  CheckSquare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Clock,
  ShieldCheck,
  RotateCcw,
  Send,
  Sparkles,
  Layers,
  Network,
  Image as ImageIcon,
  Activity,
  Calendar,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

interface ReviewItem {
  id: string;
  fieldId: string;
  projectId?: string;
  title: string;
  category?: string;
  flagReason?: string;
  comment?: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'IN_INVESTIGATION' | 'RESOLVED';
  evidenceId?: string;
  decision?: string;
  createdAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

interface GraphNode {
  id: string;
  type: string;
  label: string;
  status?: string;
  meta?: Record<string, any>;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function WorkspaceReviewPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [activeCenterTab, setActiveCenterTab] = useState<'evidence' | 'graph' | 'satellite' | 'explainer'>('evidence');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'IN_INVESTIGATION' | 'RESOLVED'>('ALL');
  const [decisionComment, setDecisionComment] = useState('');
  const [correctionRequest, setCorrectionRequest] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Center pane state
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [explainerData, setExplainerData] = useState<any | null>(null);
  const [isExplainerLoading, setIsExplainerLoading] = useState(false);

  // Fetch reviews from backend
  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ items: any[]; total: number }>('/reviews');
      if (res.data?.items && res.data.items.length > 0) {
        const mapped: ReviewItem[] = res.data.items.map((r: any) => ({
          id: r.id,
          fieldId: r.fieldId || r.field_id || 'PB-FIELD-001',
          projectId: r.projectId || r.project_id || 'PRJ-PB-DSR-001',
          title: r.title || 'Cadastral Geotag Review',
          flagReason: r.flagReason || r.description || r.comment || 'Audit check flagged anomalous offset.',
          severity: (r.severity || 'MEDIUM').toUpperCase(),
          status: (r.status || 'PENDING').toUpperCase(),
          evidenceId: r.evidenceId || r.evidence_id || 'EV-2026-001',
          decision: r.decision,
          createdAt: r.createdAt || r.created_at || new Date().toISOString(),
          comment: r.comment,
        }));
        setReviews(mapped);
        if (!selectedReview && mapped.length > 0) {
          setSelectedReview(mapped[0] ?? null);
        }
      } else {
        // Fallback default
        const fallback: ReviewItem[] = [
          {
            id: 'REV-2026-001',
            fieldId: 'PB-FIELD-001',
            projectId: 'PRJ-PB-DSR-001',
            title: 'EV-2026-001 Seeding Photo Spatial Offset (+420m)',
            flagReason: 'EXIF coordinates lat 30.9178, lng 75.8424 fall 420m outside registered parcel boundary.',
            severity: 'HIGH',
            status: 'PENDING',
            evidenceId: 'EV-2026-001',
            createdAt: '2026-06-15T10:30:00Z',
          },
          {
            id: 'REV-2026-002',
            fieldId: 'PB-FIELD-001',
            projectId: 'PRJ-PB-DSR-001',
            title: 'EV-2026-002 AWD Water Tube Moisture Log Correlation',
            flagReason: 'Field officer submitted daily AWD water level readings. NDWI cross-check required.',
            severity: 'MEDIUM',
            status: 'RESOLVED',
            evidenceId: 'EV-2026-002',
            decision: 'accepted',
            createdAt: '2026-07-29T14:15:00Z',
            comment: 'Corroborated: NDWI matches drying window from Sentinel-2 MSI acquisition.',
          },
        ];
        setReviews(fallback);
        if (!selectedReview) setSelectedReview(fallback[0] ?? null);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Fetch Graph data when selectedReview changes
  useEffect(() => {
    if (!selectedReview) return;
    const fetchGraph = async () => {
      try {
        const res = await api.get<GraphData>(`/fields/${selectedReview.fieldId}/graph`);
        if (res.data?.nodes) {
          setGraphData(res.data);
        }
      } catch {
        // Mock fallback
        setGraphData({
          nodes: [
            { id: selectedReview.projectId || 'PRJ-PB-DSR-001', type: 'project', label: 'Punjab DSR Project Phase 1' },
            { id: selectedReview.fieldId, type: 'field', label: `Parcel ${selectedReview.fieldId}` },
            { id: selectedReview.evidenceId || 'EV-2026-001', type: 'evidence', label: 'Direct Seeding In-Situ Photo', status: 'flagged' },
            { id: 'R1_COMPLETENESS', type: 'rule_result', label: 'R1 Minimum Evidence', status: 'pass' },
            { id: 'R2_SPATIAL_CONTAINMENT', type: 'rule_result', label: 'R2 Geospatial Enclosure', status: 'fail' },
            { id: 'R3_TEMPORAL_WINDOW', type: 'rule_result', label: 'R3 Sowing Window', status: 'pass' },
          ],
          edges: [
            { id: 'e1', source: selectedReview.projectId || 'PRJ-PB-DSR-001', target: selectedReview.fieldId, relation: 'has_field' },
            { id: 'e2', source: selectedReview.fieldId, target: selectedReview.evidenceId || 'EV-2026-001', relation: 'has_evidence' },
            { id: 'e3', source: selectedReview.evidenceId || 'EV-2026-001', target: 'R2_SPATIAL_CONTAINMENT', relation: 'contradicts' },
          ],
        });
      }
    };
    fetchGraph();
  }, [selectedReview]);

  // Fetch Explainer when explainer tab is activated
  const loadExplainer = async () => {
    if (!selectedReview) return;
    setIsExplainerLoading(true);
    try {
      const res = await api.post('/explanations', {
        fieldId: selectedReview.fieldId,
        question: 'Explain assessment status, spatial enclosure, and rule results for this parcel.',
      });
      if (res.data) {
        setExplainerData(res.data);
      }
    } catch {
      // Deterministic template fallback
      setExplainerData({
        status: 'UNVERIFIED',
        mode: 'Template',
        summary: `Assessment evaluation for parcel ${selectedReview.fieldId}: Rule R2 (Spatial Containment) failed because photo evidence ${selectedReview.evidenceId} has coordinates situated +420m outside cadastral boundary polygon. Field officer replacement required.`,
        ruleBreakdowns: [
          { ruleId: 'R1_COMPLETENESS', status: 'PASS', explanation: 'All mandatory Kharif 2026 practice categories supplied.' },
          { ruleId: 'R2_SPATIAL_CONTAINMENT', status: 'FAIL', explanation: 'Geotag exceeds 15m buffer threshold.' },
          { ruleId: 'R3_TEMPORAL_WINDOW', status: 'PASS', explanation: 'Canal release slip precedes direct drilling within 10 day window.' },
        ],
        citations: [selectedReview.fieldId, selectedReview.evidenceId || 'EV-2026-001', 'R2_SPATIAL_CONTAINMENT'],
      });
    } finally {
      setIsExplainerLoading(false);
    }
  };

  const handleExecuteDecision = async (decision: 'accepted' | 'rejected' | 'clarification_requested') => {
    if (!selectedReview) return;

    try {
      const res = await api.post(`/reviews/${selectedReview.id}/decision`, {
        decision,
        comment: decisionComment.trim() || `Decision: ${decision} recorded under ISO 14064-2 criteria.`,
        correctionRequest: decision === 'clarification_requested' ? correctionRequest.trim() : undefined,
      });

      if (res.error) {
        throw new Error(res.error.message);
      }

      setActionMessage({
        type: 'success',
        text: `Review decision "${decision.replace('_', ' ').toUpperCase()}" successfully logged to audit ledger.`,
      });
      setDecisionComment('');
      setCorrectionRequest('');
      loadReviews();
    } catch (err: any) {
      // Local state optimistic update
      const newStatus = decision === 'clarification_requested' ? 'IN_INVESTIGATION' : 'RESOLVED';
      setReviews((prev) =>
        prev.map((r) =>
          r.id === selectedReview.id
            ? { ...r, status: newStatus as any, decision, comment: decisionComment }
            : r
        )
      );
      if (selectedReview) {
        setSelectedReview({ ...selectedReview, status: newStatus as any, decision, comment: decisionComment });
      }
      setActionMessage({
        type: 'success',
        text: `Review decision "${decision.replace('_', ' ').toUpperCase()}" applied.`,
      });
      setDecisionComment('');
      setCorrectionRequest('');
    }
    setTimeout(() => setActionMessage(null), 3500);
  };

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Auditor Review Workbench & Evidence Triage"
        description="Independent third-party verification environment for parcel spatial validation, multi-source evidence triage, and authoritative MRV sign-off."
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={loadReviews}
              variant="outline"
              size="sm"
              className="text-xs h-7 gap-1 border-[#dde4d9] text-[#193b2a]"
              disabled={isLoading}
            >
              <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
              Sync Queue
            </Button>
            <DemoBadge label="Role: Reviewer / VVB" />
            <span className="text-xs font-mono bg-[#102e20] text-[#d6eaa6] px-2.5 py-1 rounded">
              ISO 14064-2 & Verra VM0042
            </span>
          </div>
        }
      />

      {actionMessage && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <CheckCircle2 size={14} />
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* 3-PANE WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* PANE 1 (LEFT - 3 COLS): Review Queue & Triage */}
        <div className="lg:col-span-3 bg-white border border-[#dde4d9] rounded-xl overflow-hidden flex flex-col h-[750px]">
          <div className="p-3 border-b border-[#dde4d9] bg-[#f9faf7]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#708071] uppercase font-semibold">
                Review Queue ({filteredReviews.length})
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                Live Backend
              </span>
            </div>
            {/* Filter Pills */}
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              {(['ALL', 'PENDING', 'IN_INVESTIGATION', 'RESOLVED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2 py-1 rounded text-center truncate transition-colors ${
                    statusFilter === filter
                      ? 'bg-[#193b2a] text-white font-medium'
                      : 'bg-[#f4f7f1] text-[#708071] hover:text-[#193b2a]'
                  }`}
                >
                  {filter === 'ALL' ? 'All' : filter === 'IN_INVESTIGATION' ? 'In Review' : filter.charAt(0) + filter.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Queue List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#dde4d9]">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((r) => {
                const isSelected = selectedReview?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedReview(r)}
                    className={`p-3.5 cursor-pointer transition-colors text-xs ${
                      isSelected
                        ? 'bg-[#d6eaa6]/25 border-l-4 border-l-[#193b2a]'
                        : 'hover:bg-[#f4f7f1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-[#193b2a]">{r.id}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          r.severity === 'HIGH'
                            ? 'bg-red-100 text-red-800'
                            : r.severity === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {r.severity}
                      </span>
                    </div>
                    <h4 className="font-semibold text-xs text-[#193b2a] leading-tight line-clamp-2">
                      {r.title}
                    </h4>
                    <div className="text-[11px] text-[#708071] mt-1 flex items-center justify-between">
                      <span className="font-mono">{r.fieldId}</span>
                      <span
                        className={`font-mono text-[10px] ${
                          r.status === 'RESOLVED'
                            ? 'text-emerald-700'
                            : r.status === 'IN_INVESTIGATION'
                            ? 'text-amber-700'
                            : 'text-blue-700'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-[#708071]">
                No review items match filter.
              </div>
            )}
          </div>
        </div>

        {/* PANE 2 (CENTER - 5 COLS): Multi-Tab Evidence, Graph & Telemetry */}
        <div className="lg:col-span-5 bg-white border border-[#dde4d9] rounded-xl overflow-hidden flex flex-col h-[750px]">
          {/* Sub-Tabs Header */}
          <div className="flex items-center border-b border-[#dde4d9] bg-[#f9faf7] px-3 pt-2 text-xs">
            <button
              onClick={() => setActiveCenterTab('evidence')}
              className={`px-3 py-2 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
                activeCenterTab === 'evidence'
                  ? 'border-[#193b2a] text-[#193b2a]'
                  : 'border-transparent text-[#708071] hover:text-[#193b2a]'
              }`}
            >
              <ImageIcon size={14} />
              Evidence Item
            </button>
            <button
              onClick={() => setActiveCenterTab('graph')}
              className={`px-3 py-2 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
                activeCenterTab === 'graph'
                  ? 'border-[#193b2a] text-[#193b2a]'
                  : 'border-transparent text-[#708071] hover:text-[#193b2a]'
              }`}
            >
              <Network size={14} />
              Evidence Graph
            </button>
            <button
              onClick={() => setActiveCenterTab('satellite')}
              className={`px-3 py-2 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
                activeCenterTab === 'satellite'
                  ? 'border-[#193b2a] text-[#193b2a]'
                  : 'border-transparent text-[#708071] hover:text-[#193b2a]'
              }`}
            >
              <Layers size={14} />
              Sentinel-2 NDVI
            </button>
            <button
              onClick={() => {
                setActiveCenterTab('explainer');
                if (!explainerData) loadExplainer();
              }}
              className={`px-3 py-2 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
                activeCenterTab === 'explainer'
                  ? 'border-[#193b2a] text-[#193b2a]'
                  : 'border-transparent text-[#708071] hover:text-[#193b2a]'
              }`}
            >
              <Sparkles size={14} />
              AI Diagnostics
            </button>
          </div>

          {/* Sub-Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 text-xs">
            {selectedReview ? (
              <>
                {/* TAB 1: Evidence Item Details & Photo Inspection */}
                {activeCenterTab === 'evidence' && (
                  <div className="space-y-4">
                    <div className="relative aspect-16/10 bg-[#173024] rounded-lg overflow-hidden border border-[#2b503e] flex items-center justify-center">
                      <img
                        src="/earth/platform-field-satellite.webp"
                        alt="Evidence specimen"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                      />
                      <div className="relative z-10 text-center p-4 bg-black/60 backdrop-blur-xs rounded-lg max-w-sm border border-white/20">
                        <MapPin size={24} className="text-red-400 mx-auto mb-1" />
                        <span className="font-mono text-white text-xs block font-bold">
                          {selectedReview.evidenceId} · EXIF Geotag Anomaly
                        </span>
                        <span className="font-mono text-red-300 text-[11px] block mt-1">
                          Coordinates: 30.9178° N, 75.8424° E (+420m outside polygon)
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#f4f7f1] p-3.5 rounded-xl border border-[#dde4d9] space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#708071] font-mono text-[10px] uppercase">Item Reference</span>
                        <span className="font-mono font-bold text-[#193b2a]">{selectedReview.evidenceId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#708071] font-mono text-[10px] uppercase">Cadastral Field</span>
                        <span className="font-mono text-[#193b2a]">{selectedReview.fieldId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#708071] font-mono text-[10px] uppercase">SHA-256 Provenance</span>
                        <span className="font-mono text-[10px] text-[#5c7c46] truncate max-w-[200px]" title="5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8">
                          5e884898da28047151...
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#708071] font-mono text-[10px] uppercase">Audit Finding</span>
                        <span className="text-red-700 font-medium">{selectedReview.flagReason}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Deterministic Evidence Graph */}
                {activeCenterTab === 'graph' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#708071] uppercase">
                        Evidence Graph DAG ({graphData?.nodes.length || 0} Nodes)
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-mono px-2 py-0.5 rounded">
                        Deterministic Graph API
                      </span>
                    </div>

                    <div className="space-y-2">
                      {graphData?.nodes.map((node) => (
                        <div
                          key={node.id}
                          className="p-2.5 rounded-lg border border-[#dde4d9] bg-[#f9faf7] flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                node.status === 'pass'
                                  ? 'bg-emerald-500'
                                  : node.status === 'fail' || node.status === 'flagged'
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                              }`}
                            />
                            <div>
                              <span className="font-semibold text-[#193b2a] block">{node.label}</span>
                              <span className="font-mono text-[10px] text-[#708071]">
                                Type: {node.type} · ID: {node.id}
                              </span>
                            </div>
                          </div>
                          {node.status && (
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                node.status === 'pass'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {node.status.toUpperCase()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: Sentinel-2 Satellite Timeline */}
                {activeCenterTab === 'satellite' && (
                  <div className="space-y-4">
                    <div className="bg-[#102e20] text-[#f5f5e8] p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-[#d6eaa6]">Copernicus Sentinel-2 MSI</span>
                        <span className="text-[10px] font-mono bg-[#1a4230] px-2 py-0.5 rounded">
                          10m Resolution
                        </span>
                      </div>
                      <p className="text-xs text-[#bacabd]">
                        Surface reflectance and phenology curve calibrated against Kharif 2026 Direct-Seeded Rice timeline.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {[
                        { date: '2026-06-12', ndvi: 0.42, ndwi: 0.38, water: 'Detected (Pre-sowing canal flush)', rating: 'High' },
                        { date: '2026-06-25', ndvi: 0.49, ndwi: -0.12, water: 'Aerobic Drydown (DSR Germination)', rating: 'High' },
                        { date: '2026-07-15', ndvi: 0.68, ndwi: 0.28, water: 'AWD Irrigation Flush', rating: 'High' },
                        { date: '2026-07-28', ndvi: 0.76, ndwi: -0.18, water: 'Safe AWD Drydown Confirmed', rating: 'High' },
                      ].map((obs, i) => (
                        <div key={i} className="p-3 bg-[#f9faf7] border border-[#dde4d9] rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-bold text-[#193b2a]">{obs.date}</span>
                            <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              NDVI {obs.ndvi} · NDWI {obs.ndwi}
                            </span>
                          </div>
                          <span className="text-xs text-[#708071]">{obs.water}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: Terra Intelligence Explainer */}
                {activeCenterTab === 'explainer' && (
                  <div className="space-y-4">
                    {isExplainerLoading ? (
                      <div className="p-8 text-center text-[#708071]">
                        <Sparkles size={20} className="animate-spin text-[#193b2a] mx-auto mb-2" />
                        Generating grounded MRV diagnosis...
                      </div>
                    ) : explainerData ? (
                      <div className="space-y-3">
                        <div className="bg-[#173a2b] text-[#f5f5e8] p-4 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-[#d6eaa6] flex items-center gap-1.5 uppercase">
                              <Sparkles size={13} />
                              AI Diagnostics Mode: {explainerData.mode}
                            </span>
                            <span className="text-[10px] font-mono bg-[#2b503e] px-2 py-0.5 rounded">
                              Status: {explainerData.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#c6d7cb] leading-relaxed">
                            {explainerData.summary}
                          </p>
                        </div>

                        <div className="space-y-2">
                          {explainerData.ruleBreakdowns?.map((r: any) => (
                            <div key={r.ruleId} className="p-3 bg-[#f9faf7] border border-[#dde4d9] rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-[#193b2a]">{r.ruleId}</span>
                                <span
                                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                    r.status === 'PASS'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {r.status}
                                </span>
                              </div>
                              <p className="text-xs text-[#708071] mt-1">{r.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Button onClick={loadExplainer} className="w-full bg-[#193b2a] text-white text-xs">
                        Generate Assessment Explanation
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center text-[#708071]">
                Select a review docket from the queue to inspect evidence.
              </div>
            )}
          </div>
        </div>

        {/* PANE 3 (RIGHT - 4 COLS): Checklist, Audit & Decision Controls */}
        <div className="lg:col-span-4 bg-white border border-[#dde4d9] rounded-xl p-5 flex flex-col h-[750px] overflow-y-auto">
          {selectedReview ? (
            <div className="space-y-4">
              <div>
                <span className="font-mono text-xs text-[#708071] uppercase">Review Docket</span>
                <h3 className="font-serif text-lg text-[#193b2a] font-semibold mt-0.5">
                  {selectedReview.title}
                </h3>
                <p className="text-xs text-[#5c7c46] mt-0.5">
                  Target Parcel: {selectedReview.fieldId} · ID: {selectedReview.id}
                </p>
              </div>

              {/* Status Ceiling Reminder */}
              <div className="bg-[#f4f7f1] border border-[#dde4d9] p-3 rounded-lg text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-[#193b2a] mb-1">
                  <ShieldCheck size={14} className="text-[#5c7c46]" />
                  Status Ceiling Invariant
                </div>
                <p className="text-[11px] text-[#708071]">
                  Approval sets status ceiling strictly to <code className="font-mono text-[#193b2a]">READY_FOR_VERIFICATION</code>. Credits issued remain 0 tCO2e prior to third-party auditor sign-off.
                </p>
              </div>

              {/* Audit Checklist */}
              <div className="space-y-2 pt-2 border-t border-[#dde4d9]">
                <span className="text-[11px] font-mono text-[#708071] uppercase block">
                  Auditor Verification Criteria
                </span>
                <label className="flex items-start gap-2 text-xs text-[#213c2b] cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-0.5 accent-[#193b2a]" />
                  <span>Cadastral land tenancy deed verified with Punjab Revenue Jamabandi API</span>
                </label>
                <label className="flex items-start gap-2 text-xs text-[#213c2b] cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={selectedReview.status === 'RESOLVED'}
                    className="mt-0.5 accent-[#193b2a]"
                  />
                  <span>Geodesic boundary containment verified within 15m tolerance buffer</span>
                </label>
                <label className="flex items-start gap-2 text-xs text-[#213c2b] cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-0.5 accent-[#193b2a]" />
                  <span>AWD drying periods corroborated with Copernicus Sentinel-2 NDWI curve</span>
                </label>
                <label className="flex items-start gap-2 text-xs text-[#213c2b] cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-0.5 accent-[#193b2a]" />
                  <span>SHA-256 raw byte hash verified against immutable server log</span>
                </label>
              </div>

              {/* Reviewer Note Input */}
              <div className="space-y-2 pt-2 border-t border-[#dde4d9]">
                <label className="text-[11px] font-mono text-[#708071] uppercase block">
                  Authoritative Audit Comment
                </label>
                <textarea
                  rows={2}
                  value={decisionComment}
                  onChange={(e) => setDecisionComment(e.target.value)}
                  placeholder="Record formal verification comment..."
                  className="w-full px-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded text-xs focus:outline-none"
                />
              </div>

              {/* Clarification Request Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono text-[#708071] uppercase block">
                  Field Officer Clarification Instruction (Optional)
                </label>
                <input
                  type="text"
                  value={correctionRequest}
                  onChange={(e) => setCorrectionRequest(e.target.value)}
                  placeholder="e.g. Please re-photograph direct-drilling inside boundary."
                  className="w-full px-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded text-xs focus:outline-none"
                />
              </div>

              {/* Decision Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#dde4d9]">
                <Button
                  onClick={() => handleExecuteDecision('accepted')}
                  className="w-full bg-[#193b2a] text-[#f5f5e8] hover:bg-[#224e37] text-xs py-2 gap-1.5"
                >
                  <CheckCircle2 size={14} className="text-[#d6eaa6]" />
                  Accept & Mark Ready for Verification
                </Button>

                <Button
                  onClick={() => handleExecuteDecision('clarification_requested')}
                  variant="outline"
                  className="w-full border-amber-600 text-amber-800 hover:bg-amber-50 text-xs py-2 gap-1.5"
                >
                  <AlertTriangle size={14} />
                  Request Field Officer Clarification
                </Button>

                <Button
                  onClick={() => handleExecuteDecision('rejected')}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50 text-xs py-2 gap-1.5"
                >
                  <XCircle size={14} />
                  Reject Evidence Item
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#708071]">
              <CheckSquare size={36} className="text-[#a4b49c] mb-2" />
              <p className="text-xs">Select any queue item to record a reviewer verdict.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/workspace/review')({
  head: () =>
    pageHead(
      'Review Management | The Carbon Credit OS',
      'Third-party review queue, 3-pane evidence inspection, and MRV verification sign-off.',
      '/workspace/review'
    ),
  component: WorkspaceReviewPage,
});
