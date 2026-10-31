import { createFileRoute } from '@tanstack/react-router';
import { useState, useId } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import {
  loadBuyerEnquiries,
  updateBuyerEnquiry,
} from '@/lib/buyer/buyer-service';
import type { BuyerEnquiry } from '@/lib/types/buyer';
import {
  Inbox,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Building,
  FileCheck,
  FolderLock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function WorkspaceBuyerEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<BuyerEnquiry[]>(() => loadBuyerEnquiries());
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<BuyerEnquiry | null>(null);
  const [editStage, setEditStage] = useState<BuyerEnquiry['stage']>('Inquiry');
  const [editStatus, setEditStatus] = useState<BuyerEnquiry['status']>('Active');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const searchInputId = useId();
  const stageFilterId = useId();

  const reloadData = () => {
    const data = loadBuyerEnquiries();
    setEnquiries(data);
    if (selectedEnquiry) {
      const refreshed = data.find((e) => e.id === selectedEnquiry.id);
      setSelectedEnquiry(refreshed ?? null);
    }
  };

  const filtered = enquiries.filter((e) => {
    const matchSearch =
      e.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.buyerOrg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStage = stageFilter === 'all' || e.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const handleSelect = (item: BuyerEnquiry) => {
    setSelectedEnquiry(item);
    setEditStage(item.stage);
    setEditStatus(item.status);
    setSaveSuccess(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    updateBuyerEnquiry(selectedEnquiry.id, {
      stage: editStage,
      status: editStatus,
    });

    setSaveSuccess(true);
    reloadData();
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Metrics
  const totalInquiries = enquiries.length;
  const pendingCount = enquiries.filter((e) => e.status === 'Pending Response').length;
  const dataRoomCount = enquiries.filter((e) => e.stage === 'Data Room Shared').length;
  const totalVolumeTons = enquiries.reduce((acc, curr) => acc + (curr.volumeRequestedTons || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buyer Due Diligence Enquiries"
        description="Triage institutional buyer inquiries, dispatch data room credentials, and manage pre-issuance offtake requests."
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge label="Buyer Pipeline" />
            <a
              href="/buyers/marketplace"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-[#193b2a] text-[#f5f5e8] px-3 py-1.5 rounded hover:bg-[#224e37] transition-colors"
            >
              Buyer Portal Marketplace
            </a>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Total Inquiries</div>
          <div className="text-2xl font-serif text-[#193b2a] font-bold mt-1">{totalInquiries}</div>
          <div className="text-xs text-[#5c7c46] mt-1">Verified institutional buyers</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Pending Response</div>
          <div className="text-2xl font-serif text-amber-700 font-bold mt-1">{pendingCount}</div>
          <div className="text-xs text-amber-600 mt-1">SLA target &lt; 24h</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Data Rooms Shared</div>
          <div className="text-2xl font-serif text-emerald-800 font-bold mt-1">{dataRoomCount}</div>
          <div className="text-xs text-emerald-600 mt-1">Cadastral & Sentinel logs</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Total Inquired Volume</div>
          <div className="text-2xl font-serif text-[#193b2a] font-bold mt-1">
            {totalVolumeTons.toLocaleString()} tCO2e
          </div>
          <div className="text-xs text-[#5c7c46] mt-1">Non-binding pipeline demand</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#dde4d9] rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3 top-3 text-[#708071]" />
          <input
            id={searchInputId}
            type="text"
            placeholder="Search buyer name, organization, project..."
            value={searchTerm}
            aria-label="Search buyer name, organization, project"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs focus:outline-none focus:border-[#193b2a]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor={stageFilterId} className="sr-only">Filter by inquiry stage</label>
          <select
            id={stageFilterId}
            value={stageFilter}
            aria-label="Filter by inquiry stage"
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs text-[#213c2b] focus:outline-none"
          >
            <option value="all">All Enquiry Stages</option>
            <option value="Inquiry">Inquiry</option>
            <option value="Data Room Shared">Data Room Shared</option>
            <option value="Under Review">Under Review</option>
            <option value="Response Sent">Response Sent</option>
          </select>
        </div>
      </div>

      {/* Split view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#dde4d9] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#dde4d9] flex items-center justify-between">
            <h2 className="font-serif text-lg text-[#193b2a]">
              Due Diligence Requests ({filtered.length})
            </h2>
            <span className="text-xs text-[#708071]">Select to review request dossier</span>
          </div>

          <div className="divide-y divide-[#dde4d9] max-h-[600px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#708071]">
                No due diligence inquiries found matching criteria.
              </div>
            ) : (
              filtered.map((item) => {
                const isSelected = selectedEnquiry?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
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
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              item.stage === 'Data Room Shared'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.stage === 'Under Review'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.stage}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded ${
                              item.status === 'Active'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm text-[#193b2a] mt-1">
                          {item.buyerOrg}
                        </h3>
                        <p className="text-xs text-[#708071]">
                          Contact: {item.buyerName} • Target: {item.projectTitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#193b2a] block">
                          {item.volumeRequestedTons
                            ? `${item.volumeRequestedTons.toLocaleString()} tCO2e`
                            : 'Volume Open'}
                        </span>
                        <span className="text-[10px] text-[#708071]">
                          Date: {item.inquiryDate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Inspector */}
        <div className="bg-white border border-[#dde4d9] rounded-xl p-5">
          {selectedEnquiry ? (
            <div className="space-y-4">
              <div className="border-b border-[#dde4d9] pb-3">
                <span className="font-mono text-xs text-[#708071]">
                  Inquiry: {selectedEnquiry.id}
                </span>
                <h3 className="font-serif text-lg text-[#193b2a] mt-0.5">
                  {selectedEnquiry.buyerOrg}
                </h3>
                <p className="text-xs text-[#5c7c46]">{selectedEnquiry.projectTitle}</p>
              </div>

              <div className="bg-[#f4f7f1] p-3 rounded-lg text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#708071]">Lead Contact:</span>
                  <span className="font-medium text-[#193b2a]">{selectedEnquiry.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#708071]">Requested Volume:</span>
                  <span className="font-mono font-bold text-[#193b2a]">
                    {selectedEnquiry.volumeRequestedTons
                      ? `${selectedEnquiry.volumeRequestedTons.toLocaleString()} tCO2e`
                      : 'Unspecified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#708071]">Retirement Year:</span>
                  <span className="font-mono text-[#193b2a]">
                    {selectedEnquiry.targetRetirementYear || 'Not Specified'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#708071] uppercase block mb-1">
                  Due Diligence Message
                </label>
                <div className="text-xs bg-[#f9faf7] border border-[#dde4d9] p-3 rounded-lg text-[#213c2b] leading-relaxed">
                  {selectedEnquiry.message || 'No additional note provided.'}
                </div>
              </div>

              {/* Status Update Form */}
              <form onSubmit={handleUpdate} className="space-y-3 pt-3 border-t border-[#dde4d9]">
                <div>
                  <label className="text-[11px] font-mono text-[#708071] uppercase block mb-1">
                    Pipeline Stage
                  </label>
                  <select
                    value={editStage}
                    onChange={(e) => setEditStage(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-[#f4f7f1] border border-[#dde4d9] rounded text-xs text-[#193b2a] font-medium focus:outline-none"
                  >
                    <option value="Inquiry">Inquiry</option>
                    <option value="Data Room Shared">Data Room Shared</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Response Sent">Response Sent</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#708071] uppercase block mb-1">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-[#f4f7f1] border border-[#dde4d9] rounded text-xs text-[#193b2a] font-medium focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending Response">Pending Response</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {saveSuccess && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    <span>Inquiry triage stage updated.</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#193b2a] text-[#f5f5e8] hover:bg-[#224e37] text-xs py-2"
                >
                  Update Stage & Triage
                </Button>
              </form>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#708071]">
              <Inbox size={36} className="text-[#a4b49c] mb-2" />
              <p className="text-xs">
                Select any institutional enquiry to review requested carbon volumes, update data room access, or log triage status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/workspace/enquiries')({
  head: () =>
    pageHead(
      'Buyer Enquiries | The Carbon Credit OS',
      'Institutional buyer due diligence and carbon credit pre-issuance enquiry triage.',
      '/workspace/enquiries'
    ),
  component: WorkspaceBuyerEnquiriesPage,
});
