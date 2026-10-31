import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import {
  getPartnershipEnquiries,
  updatePartnershipEnquiryStatus,
} from '@/lib/partnerships/partnerships-service';
import type { PartnershipEnquiry } from '@/lib/partnerships/types';
import {
  Factory,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  Shield,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function AdminPartnershipsGovernancePage() {
  const [enquiries, setEnquiries] = useState<PartnershipEnquiry[]>(() => getPartnershipEnquiries());
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleApproveMoU = (id: string) => {
    updatePartnershipEnquiryStatus(id, 'Approved', 'Executive Governance Committee', 'Executive MoU sign-off granted by Administrator.');
    const fresh = getPartnershipEnquiries();
    setEnquiries(fresh);
    setFeedback(`MoU approved for enquiry ${id}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Industrial MoUs & Executive Governance"
        description="Executive sign-off, corporate ESG compliance review, and institutional partnership agreements."
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge label="Executive Review" />
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

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 size={14} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Institutional Pipelines</div>
          <div className="text-2xl font-serif text-[#193b2a] font-bold mt-1">{enquiries.length}</div>
          <div className="text-xs text-[#5c7c46] mt-1">Total active institutional dossiers</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Executive Approved</div>
          <div className="text-2xl font-serif text-emerald-800 font-bold mt-1">
            {enquiries.filter((e) => e.status === 'Approved').length}
          </div>
          <div className="text-xs text-emerald-600 mt-1">Signed institutional MoUs</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Under Review</div>
          <div className="text-2xl font-serif text-amber-700 font-bold mt-1">
            {enquiries.filter((e) => e.status !== 'Approved' && e.status !== 'Closed').length}
          </div>
          <div className="text-xs text-amber-600 mt-1">Commercial & technical evaluation</div>
        </div>
      </div>

      {/* Enquiries Governance Table */}
      <div className="bg-white border border-[#dde4d9] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#dde4d9] flex items-center justify-between">
          <h2 className="font-serif text-base text-[#193b2a]">Institutional Partnerships ({enquiries.length})</h2>
          <span className="text-xs text-[#708071]">Executive sign-off queue</span>
        </div>

        <div className="divide-y divide-[#dde4d9]">
          {enquiries.map((e) => (
            <div key={e.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f9faf7]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#193b2a]">{e.id}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      e.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : e.status === 'New'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {e.status}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-[#193b2a] mt-1">{e.organisationName}</h3>
                <div className="text-xs text-[#708071] mt-0.5">
                  {e.organisationType} · Location: {e.city}, {e.state} · Lead: {e.contactPerson} ({e.email})
                </div>
                <div className="text-xs text-[#5c7c46] mt-0.5">
                  Interest: {e.interest} · Scale: {e.estimatedScale || 'Standard'}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {e.status !== 'Approved' && (
                  <Button
                    onClick={() => handleApproveMoU(e.id)}
                    className="bg-[#193b2a] text-[#f5f5e8] hover:bg-[#224e37] text-xs py-1.5 px-3"
                  >
                    Executive Sign-off
                  </Button>
                )}
                {e.status === 'Approved' && (
                  <span className="text-xs text-emerald-800 font-medium flex items-center gap-1 font-mono">
                    <CheckCircle2 size={13} />
                    MoU Executed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/admin/partnerships')({
  head: () =>
    pageHead(
      'Industrial MoUs | The Carbon Credit OS Admin',
      'Executive governance, institutional partnerships, and corporate agreements.',
      '/admin/partnerships'
    ),
  component: AdminPartnershipsGovernancePage,
});
