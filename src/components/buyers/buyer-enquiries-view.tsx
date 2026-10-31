import { useState, useMemo, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { loadBuyerEnquiries } from '@/lib/buyer/buyer-service';
import type { BuyerEnquiry } from '@/lib/types/buyer';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingState } from '@/components/shared/loading-state';
import { Button } from '@/components/ui/button';
import {
  Inbox,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

export function BuyerEnquiriesView() {
  const [enquiries, setEnquiries] = useState<BuyerEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<BuyerEnquiry | null>(null);

  useEffect(() => {
    const list = loadBuyerEnquiries();
    setEnquiries(list);
    setIsLoading(false);
  }, []);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        e.id.toLowerCase().includes(q) ||
        e.projectTitle.toLowerCase().includes(q) ||
        e.stage.toLowerCase().includes(q) ||
        e.buyerOrg.toLowerCase().includes(q)
      );
    });
  }, [enquiries, searchQuery]);

  if (isLoading) {
    return <LoadingState message="Loading your institutional due diligence enquiries…" />;
  }

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'Data Room Shared':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={10} />
            Data Room Open
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-sky-50 text-sky-800 border border-sky-200">
            <Clock size={10} />
            Under Evaluation
          </span>
        );
      case 'Response Sent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-800 border border-purple-200">
            <FileText size={10} />
            Response Ready
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <Clock size={10} />
            Inquiry Logged
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Due Diligence Enquiries"
        description="Track your formal requests for project data rooms, remote sensing manifests, and institutional collaboration."
        badge={<DemoBadge label="Buyer Pipeline Tracker" />}
        actions={
          <Button asChild size="sm" className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333]">
            <Link to="/buyers/enquiry" search={{ projectId: undefined }}>
              <Send size={13} className="mr-1.5" />
              Submit New Enquiry
            </Link>
          </Button>
        }
      />

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-[#dde4d9] shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 text-[#708071]" size={15} />
          <input
            type="text"
            placeholder="Search by ID, project, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg text-[#193b2a] placeholder-[#8a9b8b] outline-none focus:border-[#245b45]"
          />
        </div>
        <div className="text-xs text-[#708071] w-full sm:w-auto text-left sm:text-right">
          Total Requests: <strong className="text-[#193b2a]">{enquiries.length}</strong>
        </div>
      </div>

      {/* Table / List */}
      {filteredEnquiries.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No Due Diligence Enquiries Found"
          description={
            searchQuery
              ? 'No enquiries matched your search query.'
              : 'You have not submitted any project due diligence requests yet.'
          }
          action={
            <Button asChild size="sm" className="text-xs bg-[#245b45] text-white">
              <Link to="/buyers/enquiry" search={{ projectId: undefined }}>
                <Send size={13} className="mr-1.5" />
                Submit Due Diligence Request
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#dde4d9] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#fafbf9] border-b border-[#dde4d9] text-[10px] font-mono uppercase text-[#708071]">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Volume</th>
                  <th className="py-3 px-4">Vintage</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3ec]">
                {filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#f7faf5] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#193b2a]">
                      {enq.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#193b2a] block">{enq.projectTitle}</span>
                      <span className="text-[10px] text-[#708071]">{enq.buyerOrg}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#708071] font-mono text-[11px]">
                      {enq.inquiryDate}
                    </td>
                    <td className="py-3.5 px-4">{getStageBadge(enq.stage)}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-[#193b2a]">
                      {enq.volumeRequestedTons
                        ? `${enq.volumeRequestedTons.toLocaleString()} tCO2e`
                        : 'Custom'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#708071]">
                      {enq.targetRetirementYear || '2026'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedEnquiry(enq)}
                        className="text-xs text-[#245b45] hover:bg-[#edf2e9] h-7 px-2"
                      >
                        Details
                        <ChevronRight size={13} className="ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#dde4d9] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#5c7c46] uppercase font-bold">
                  {selectedEnquiry.id}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#193b2a]">
                  Due Diligence Request
                </h3>
              </div>
              <div>{getStageBadge(selectedEnquiry.stage)}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#f7f9f5] rounded-xl p-3 border border-[#e5ebe0] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#708071]">Target Project:</span>
                  <span className="font-semibold text-[#193b2a]">{selectedEnquiry.projectTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#708071]">Requested By:</span>
                  <span className="text-[#193b2a]">{selectedEnquiry.buyerName} ({selectedEnquiry.buyerOrg})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#708071]">Submission Date:</span>
                  <span className="font-mono">{selectedEnquiry.inquiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#708071]">Indicative Volume:</span>
                  <span className="font-mono font-medium">
                    {selectedEnquiry.volumeRequestedTons
                      ? `${selectedEnquiry.volumeRequestedTons.toLocaleString()} tCO2e`
                      : 'Unspecified'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#193b2a] block mb-1">
                  Scope & Requirements Noted:
                </span>
                <p className="text-[#526655] bg-[#fafbf9] p-3 rounded-lg border border-[#e5ebe0] text-[11px] leading-relaxed whitespace-pre-line">
                  {selectedEnquiry.message || 'Standard documentation package requested.'}
                </p>
              </div>

              <div className="rounded-lg bg-emerald-50/70 border border-emerald-200/60 p-2.5 text-[11px] text-emerald-900 flex items-start gap-2">
                <ShieldCheck size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  Our internal MRV team reviews data room access requests within 1-2 business days.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#dde4d9]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedEnquiry(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
