import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { useTerraLedger } from '@/lib/terra-ledger/store';
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
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

interface ReviewQueueItem {
  id: string;
  fieldId: string;
  farmerName: string;
  title: string;
  category: 'Spatial Boundary' | 'Agronomic Timing' | 'Water Log' | 'Tenancy Record';
  flagReason: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  submittedDate: string;
  evidenceId: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'CORRECTION_REQUESTED' | 'REJECTED';
  reviewerNote?: string;
}

const INITIAL_QUEUE: ReviewQueueItem[] = [
  {
    id: 'REV-2026-081',
    fieldId: 'PB-LUD-042',
    farmerName: 'Gurdev Singh Gill',
    title: 'EV-003 Seeding Photo Geotag Spatial Offset',
    category: 'Spatial Boundary',
    flagReason: 'EXIF coordinates lat 30.9178, lng 75.8424 fall +420m outside registered parcel boundary.',
    severity: 'HIGH',
    submittedDate: '2026-06-15',
    evidenceId: 'EV-003',
    status: 'CORRECTION_REQUESTED',
    reviewerNote: 'Automated geospatial containment check failed. Requested replacement photo from field officer.',
  },
  {
    id: 'REV-2026-082',
    fieldId: 'PB-LUD-042',
    farmerName: 'Gurdev Singh Gill',
    title: 'EV-004-LOG Perforated PVC Water Tube Log Correlation',
    category: 'Water Log',
    flagReason: 'Daily water level recordings submitted. Verification needed against Sentinel-2 NDWI drying curve.',
    severity: 'MEDIUM',
    submittedDate: '2026-07-29',
    evidenceId: 'EV-004-LOG',
    status: 'APPROVED',
    reviewerNote: 'Corroborated: NDWI values drop negative during reported drydown window between July 18-28.',
  },
  {
    id: 'REV-2026-083',
    fieldId: 'PB-BTI-108',
    farmerName: 'Harpreet Singh Brar',
    title: 'Pre-sowing canal irrigation slip date anomaly',
    category: 'Agronomic Timing',
    flagReason: 'Water release receipt dated 14 days prior to direct drill sowing (tolerance limit is 10 days).',
    severity: 'MEDIUM',
    submittedDate: '2026-06-22',
    evidenceId: 'EV-BTI-012',
    status: 'PENDING_REVIEW',
  },
  {
    id: 'REV-2026-084',
    fieldId: 'PB-SAN-019',
    farmerName: 'Jagjit Singh Dhillon',
    title: 'Fard Jamabandi Digital Signature Verification',
    category: 'Tenancy Record',
    flagReason: 'Punjab Revenue portal API digital signature key rollover requires re-verification.',
    severity: 'LOW',
    submittedDate: '2026-05-30',
    evidenceId: 'EV-SAN-001',
    status: 'PENDING_REVIEW',
  },
];

export function WorkspaceReviewPage() {
  const { assessmentStatus, addInBoundaryPhotoAction, addIrrigationLogAction, field } = useTerraLedger();
  const [queue, setQueue] = useState<ReviewQueueItem[]>(INITIAL_QUEUE);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'DECIDED'>('ALL');
  const [selectedItem, setSelectedItem] = useState<ReviewQueueItem | null>(queue[0] ?? null);
  const [decisionNote, setDecisionNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredItems = queue.filter((item) => {
    if (filter === 'PENDING') return item.status === 'PENDING_REVIEW';
    if (filter === 'DECIDED') return item.status !== 'PENDING_REVIEW';
    return true;
  });

  const handleDecision = (newStatus: ReviewQueueItem['status']) => {
    if (!selectedItem) return;

    const updatedQueue = queue.map((item) =>
      item.id === selectedItem.id
        ? {
            ...item,
            status: newStatus,
            reviewerNote: decisionNote.trim() || item.reviewerNote || `Decision recorded: ${newStatus}`,
          }
        : item
    );

    setQueue(updatedQueue);
    setSelectedItem({
      ...selectedItem,
      status: newStatus,
      reviewerNote: decisionNote.trim() || selectedItem.reviewerNote || `Decision recorded: ${newStatus}`,
    });

    // If resolving EV-003 replacement, trigger store sync
    if (selectedItem.evidenceId === 'EV-003' && newStatus === 'APPROVED') {
      addInBoundaryPhotoAction();
    }

    setActionSuccess(`Decision recorded: ${newStatus.replace('_', ' ')}`);
    setDecisionNote('');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const pendingCount = queue.filter((q) => q.status === 'PENDING_REVIEW').length;
  const approvedCount = queue.filter((q) => q.status === 'APPROVED').length;
  const correctionCount = queue.filter((q) => q.status === 'CORRECTION_REQUESTED').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Review Management & Evidence Queue"
        description="Independent third-party reviewer queue for contradictory evidence triage, spatial validation, and MRV verification sign-off."
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge label="Role: Reviewer" />
            <span className="text-xs font-mono bg-[#102e20] text-[#d6eaa6] px-2.5 py-1 rounded">
              ISO 14064-2 Review Protocol
            </span>
          </div>
        }
      />

      {/* KPI summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Pending Decisions</div>
          <div className="text-2xl font-serif text-amber-700 font-bold mt-1">{pendingCount}</div>
          <div className="text-xs text-amber-600 mt-1">Awaiting reviewer action</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Approved Items</div>
          <div className="text-2xl font-serif text-emerald-800 font-bold mt-1">{approvedCount}</div>
          <div className="text-xs text-emerald-600 mt-1">Validated for verification</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Correction Requests</div>
          <div className="text-2xl font-serif text-red-700 font-bold mt-1">{correctionCount}</div>
          <div className="text-xs text-red-600 mt-1">Dispatched to field team</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Primary Assessment</div>
          <div className="text-sm font-bold text-[#193b2a] mt-2 font-mono">
            {assessmentStatus === 'READY_FOR_VERIFICATION' ? 'READY_FOR_VERIFICATION' : 'NEEDS_REVIEW'}
          </div>
          <div className="text-xs text-[#5c7c46] mt-1">Status ceiling enforced</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white border border-[#dde4d9] rounded-xl p-2 px-3">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'ALL'
                ? 'bg-[#193b2a] text-[#f5f5e8]'
                : 'text-[#506051] hover:bg-[#f4f7f1]'
            }`}
          >
            All Items ({queue.length})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'PENDING'
                ? 'bg-[#193b2a] text-[#f5f5e8]'
                : 'text-[#506051] hover:bg-[#f4f7f1]'
            }`}
          >
            Pending Queue ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('DECIDED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === 'DECIDED'
                ? 'bg-[#193b2a] text-[#f5f5e8]'
                : 'text-[#506051] hover:bg-[#f4f7f1]'
            }`}
          >
            Resolved ({queue.length - pendingCount})
          </button>
        </div>

        <span className="text-[11px] font-mono text-[#708071]">
          Deterministic MRV Audit Trail
        </span>
      </div>

      {/* Main Split Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Review list */}
        <div className="lg:col-span-2 bg-white border border-[#dde4d9] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#dde4d9] flex items-center justify-between">
            <h2 className="font-serif text-lg text-[#193b2a]">Review Items</h2>
            <span className="text-xs text-[#708071]">Select item to execute reviewer action</span>
          </div>

          <div className="divide-y divide-[#dde4d9]">
            {filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#d6eaa6]/20 border-l-4 border-l-[#193b2a]'
                      : 'hover:bg-[#f4f7f1]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#193b2a]">
                          {item.id}
                        </span>
                        <span className="text-[10px] bg-[#f4f7f1] text-[#213c2b] px-1.5 py-0.5 rounded font-mono">
                          {item.fieldId}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                            item.severity === 'HIGH'
                              ? 'bg-red-100 text-red-800'
                              : item.severity === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {item.severity} SEVERITY
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm text-[#193b2a] mt-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#708071] mt-0.5">
                        Farmer: {item.farmerName} • Type: {item.category}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                          item.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'CORRECTION_REQUESTED'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-[#445544] bg-[#f9faf7] p-2 rounded border border-[#dde4d9]">
                    <span className="font-medium text-[#193b2a]">Audit Trigger:</span> {item.flagReason}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white border border-[#dde4d9] rounded-xl p-5">
          {selectedItem ? (
            <div className="space-y-4">
              <div className="border-b border-[#dde4d9] pb-3">
                <span className="font-mono text-xs text-[#708071]">
                  Review Docket: {selectedItem.id}
                </span>
                <h3 className="font-serif text-lg text-[#193b2a] mt-1">
                  {selectedItem.title}
                </h3>
                <p className="text-xs text-[#5c7c46]">
                  Target Parcel: {selectedItem.fieldId} ({selectedItem.farmerName})
                </p>
              </div>

              <div className="bg-[#f4f7f1] p-3 rounded-lg text-xs space-y-2">
                <div>
                  <span className="text-[#708071] block font-mono text-[10px] uppercase">
                    Flagged Discrepancy
                  </span>
                  <p className="text-[#193b2a] font-medium mt-0.5">{selectedItem.flagReason}</p>
                </div>
                <div className="flex justify-between border-t border-[#dde4d9] pt-2">
                  <span className="text-[#708071]">Evidence Reference:</span>
                  <span className="font-mono font-bold text-[#193b2a]">
                    {selectedItem.evidenceId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#708071]">Protocol Tolerance:</span>
                  <span className="font-mono text-[#193b2a]">Buffer &le; 15m</span>
                </div>
              </div>

              {selectedItem.reviewerNote && (
                <div className="p-3 bg-[#fdfdfb] border border-[#dde4d9] rounded-lg text-xs">
                  <span className="text-[10px] font-mono text-[#708071] uppercase block mb-1">
                    Previous Reviewer Log
                  </span>
                  <p className="text-[#334433] italic">"{selectedItem.reviewerNote}"</p>
                </div>
              )}

              {/* Reviewer Action Area */}
              <div className="space-y-3 pt-2 border-t border-[#dde4d9]">
                <label className="text-[11px] font-mono text-[#708071] uppercase block">
                  Reviewer Decision Note & Justification
                </label>
                <textarea
                  rows={3}
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="Record justification conforming with ISO 14064-2 & Verra VM0042 criteria..."
                  className="w-full px-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded text-xs text-[#213c2b] focus:outline-none"
                />

                {actionSuccess && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    <span>{actionSuccess}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    onClick={() => handleDecision('APPROVED')}
                    className="w-full bg-[#193b2a] text-[#f5f5e8] hover:bg-[#224e37] text-xs py-2 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={14} className="text-[#d6eaa6]" />
                    Approve for Verification
                  </Button>

                  <Button
                    onClick={() => handleDecision('CORRECTION_REQUESTED')}
                    variant="outline"
                    className="w-full border-amber-600 text-amber-800 hover:bg-amber-50 text-xs py-2 flex items-center justify-center gap-2"
                  >
                    <AlertTriangle size={14} />
                    Request Field Officer Correction
                  </Button>

                  <Button
                    onClick={() => handleDecision('REJECTED')}
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50 text-xs py-2 flex items-center justify-center gap-2"
                  >
                    <XCircle size={14} />
                    Reject Evidence Item
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#708071]">
              <CheckSquare size={36} className="text-[#a4b49c] mb-2" />
              <p className="text-xs">Select any queue item to evaluate spatial logs or register a reviewer verdict.</p>
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
      'Third-party review queue and evidence discrepancy resolution workflow.',
      '/workspace/review'
    ),
  component: WorkspaceReviewPage,
});
