import { createFileRoute } from '@tanstack/react-router';
import { useState, useId } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import {
  getPartnershipEnquiries,
  updatePartnershipEnquiryStatus,
} from '@/lib/partnerships/partnerships-service';
import {
  ORGANISATION_TYPES,
  PARTNERSHIP_INTERESTS,
  ENQUIRY_STATUSES,
  type PartnershipEnquiry,
  type EnquiryStatus,
  type OrganisationType,
  type PartnershipInterest,
} from '@/lib/partnerships/types';
import {
  Building2,
  Factory,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  UserCheck,
  Calendar,
  AlertCircle,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function WorkspacePartnershipsPage() {
  const [enquiries, setEnquiries] = useState<PartnershipEnquiry[]>(() => getPartnershipEnquiries());
  const [searchTerm, setSearchTerm] = useState('');
  const [orgFilter, setOrgFilter] = useState<string>('all');
  const [interestFilter, setInterestFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<PartnershipEnquiry | null>(null);
  const [newNote, setNewNote] = useState('');
  const [editStatus, setEditStatus] = useState<EnquiryStatus>('New');
  const [editOwner, setEditOwner] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const searchInputId = useId();
  const orgFilterId = useId();
  const statusFilterId = useId();

  const reloadData = () => {
    const fresh = getPartnershipEnquiries();
    setEnquiries(fresh);
    if (selectedEnquiry) {
      const updated = fresh.find((e) => e.id === selectedEnquiry.id);
      setSelectedEnquiry(updated ?? null);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.organisationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrg = orgFilter === 'all' || e.organisationType === orgFilter;
    const matchesInterest = interestFilter === 'all' || e.interest === interestFilter;
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;

    return matchesSearch && matchesOrg && matchesInterest && matchesStatus;
  });

  const handleSelect = (item: PartnershipEnquiry) => {
    setSelectedEnquiry(item);
    setEditStatus(item.status);
    setEditOwner(item.assignedOwner || 'Unassigned');
    setNewNote('');
    setSaveSuccess(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    updatePartnershipEnquiryStatus(
      selectedEnquiry.id,
      editStatus,
      editOwner,
      newNote.trim() ? newNote.trim() : undefined
    );

    setSaveSuccess(true);
    setNewNote('');
    reloadData();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Metrics
  const totalCount = enquiries.length;
  const inNegotiation = enquiries.filter(
    (e) => e.status === 'Under Negotiation' || e.status === 'Proposal Sent' || e.status === 'Discussion Scheduled'
  ).length;
  const newCount = enquiries.filter((e) => e.status === 'New').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Industrial Partnerships & Institutional Tie-ups"
        description="Manage corporate ESG, municipal climate infrastructure, and institutional DSR carbon programme partnerships."
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge label="Institutional Registry" />
            <a
              href="/industrial-partnerships"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-[#193b2a] text-[#f5f5e8] px-3 py-1.5 rounded hover:bg-[#224e37] transition-colors"
            >
              Public Ingestion Portal
            </a>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Total Inquiries</div>
          <div className="text-2xl font-serif text-[#193b2a] font-bold mt-1">{totalCount}</div>
          <div className="text-xs text-[#5c7c46] mt-1">Institutional pipelines</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">New Enquiries</div>
          <div className="text-2xl font-serif text-amber-700 font-bold mt-1">{newCount}</div>
          <div className="text-xs text-amber-600 mt-1">Requires initial outreach</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Active Discussions</div>
          <div className="text-2xl font-serif text-emerald-800 font-bold mt-1">{inNegotiation}</div>
          <div className="text-xs text-emerald-600 mt-1">Scheduled or proposal stage</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Target Scope</div>
          <div className="text-2xl font-serif text-[#193b2a] font-bold mt-1">15,000+ Ha</div>
          <div className="text-xs text-[#5c7c46] mt-1">Smallholder DSR & Industrial pilots</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#dde4d9] rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3 top-3 text-[#708071]" />
          <input
            id={searchInputId}
            type="text"
            placeholder="Search organisation, contact, ID..."
            value={searchTerm}
            aria-label="Search organisation, contact, ID"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs focus:outline-none focus:border-[#193b2a]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <label htmlFor={orgFilterId} className="sr-only">Filter by organisation type</label>
          <select
            id={orgFilterId}
            value={orgFilter}
            aria-label="Filter by organisation type"
            onChange={(e) => setOrgFilter(e.target.value)}
            className="px-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs text-[#213c2b] focus:outline-none"
          >
            <option value="all">All Organisation Types</option>
            {ORGANISATION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label htmlFor={statusFilterId} className="sr-only">Filter by status</label>
          <select
            id={statusFilterId}
            value={statusFilter}
            aria-label="Filter by status"
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs text-[#213c2b] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {ENQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split View: Table + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-2 bg-white border border-[#dde4d9] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#dde4d9] flex items-center justify-between">
            <h2 className="font-serif text-lg text-[#193b2a]">
              Pipeline Enquiries ({filteredEnquiries.length})
            </h2>
            <span className="text-xs text-[#708071]">Select an entry to view & update</span>
          </div>

          <div className="divide-y divide-[#dde4d9] max-h-[600px] overflow-y-auto">
            {filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#708071]">
                No partnership enquiries match the selected filters.
              </div>
            ) : (
              filteredEnquiries.map((e) => {
                const isSelected = selectedEnquiry?.id === e.id;
                return (
                  <div
                    key={e.id}
                    onClick={() => handleSelect(e)}
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
                            {e.id}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              e.status === 'New'
                                ? 'bg-amber-100 text-amber-800'
                                : e.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : e.status === 'Proposal Sent' || e.status === 'Under Negotiation'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {e.status}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm text-[#193b2a] mt-1">
                          {e.organisationName}
                        </h3>
                        <p className="text-xs text-[#708071] mt-0.5">
                          {e.organisationType} • {e.city}, {e.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-mono text-[#5c7c46] block">
                          {e.assignedOwner || 'Unassigned'}
                        </span>
                        <span className="text-[10px] text-[#708071]">
                          {e.submittedAt.substring(0, 10)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-[#506051] line-clamp-1 italic bg-[#f9faf7] p-1.5 rounded">
                      "{e.message}"
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail & Action Inspector */}
        <div className="bg-white border border-[#dde4d9] rounded-xl p-5 flex flex-col">
          {selectedEnquiry ? (
            <div className="space-y-4">
              <div className="border-b border-[#dde4d9] pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#708071]">
                    Ref: {selectedEnquiry.id}
                  </span>
                  <span className="text-[10px] text-[#708071]">
                    Updated: {selectedEnquiry.updatedAt.substring(0, 16).replace('T', ' ')}
                  </span>
                </div>
                <h3 className="font-serif text-lg text-[#193b2a] mt-1">
                  {selectedEnquiry.organisationName}
                </h3>
                <p className="text-xs text-[#5c7c46]">
                  {selectedEnquiry.interest}
                </p>
              </div>

              {/* Contact Information */}
              <div className="bg-[#f4f7f1] p-3 rounded-lg text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#708071]">Contact Person:</span>
                  <span className="font-medium text-[#193b2a]">{selectedEnquiry.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#708071]">Email:</span>
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="text-[#193b2a] underline font-mono"
                  >
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#708071]">Phone:</span>
                  <span className="font-mono text-[#193b2a]">{selectedEnquiry.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#708071]">Scale:</span>
                  <span className="text-[#193b2a]">{selectedEnquiry.estimatedScale || 'Standard deployment'}</span>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-[11px] font-mono text-[#708071] uppercase block mb-1">
                  Enquiry Statement
                </label>
                <div className="text-xs bg-white border border-[#dde4d9] p-3 rounded-lg text-[#213c2b] leading-relaxed">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Status Update Form */}
              <form onSubmit={handleUpdate} className="space-y-3 pt-2 border-t border-[#dde4d9]">
                <div>
                  <label className="text-[11px] font-mono text-[#708071] uppercase block mb-1">
                    Pipeline Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as EnquiryStatus)}
                    className="w-full px-3 py-1.5 bg-[#f4f7f1] border border-[#dde4d9] rounded text-xs text-[#193b2a] font-medium focus:outline-none"
                  >
                    {ENQUIRY_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#708071] uppercase block mb-1">
                    Assigned Account Lead
                  </label>
                  <input
                    type="text"
                    value={editOwner}
                    onChange={(e) => setEditOwner(e.target.value)}
                    placeholder="e.g. Amanpreet Singh"
                    className="w-full px-3 py-1.5 bg-[#f4f7f1] border border-[#dde4d9] rounded text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#708071] uppercase block mb-1">
                    Add Internal Note
                  </label>
                  <textarea
                    rows={2}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log discussion notes, next actions, or compliance feedback..."
                    className="w-full px-3 py-1.5 bg-[#f4f7f1] border border-[#dde4d9] rounded text-xs focus:outline-none"
                  />
                </div>

                {saveSuccess && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    <span>Record and status updated successfully.</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#193b2a] text-[#f5f5e8] hover:bg-[#224e37] text-xs py-2"
                >
                  Save Status & Internal Notes
                </Button>
              </form>

              {/* Internal Notes History */}
              {selectedEnquiry.internalNotes && selectedEnquiry.internalNotes.length > 0 && (
                <div className="space-y-1 pt-2">
                  <label className="text-[11px] font-mono text-[#708071] uppercase block">
                    Audit Log & Notes ({selectedEnquiry.internalNotes.length})
                  </label>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 text-[11px]">
                    {selectedEnquiry.internalNotes.map((note, idx) => (
                      <div key={idx} className="p-2 bg-[#f9faf7] border border-[#dde4d9] rounded text-[#445544]">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#708071]">
              <Factory size={36} className="text-[#a4b49c] mb-2" />
              <p className="text-xs">Select any partnership submission to inspect details, allocate account leads, or progress pipeline stage.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/workspace/partnerships')({
  head: () =>
    pageHead(
      'Industrial Partnerships | VirsaFlow',
      'Industrial, institutional, and CSR carbon infrastructure partnership management pipeline.',
      '/workspace/partnerships'
    ),
  component: WorkspacePartnershipsPage,
});
