import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { INITIAL_EVIDENCE_ITEMS } from '@/lib/terra-ledger/mock-data';
import { Camera, Clock, FileText, ArrowLeft } from 'lucide-react';

export function FarmerEvidenceHistoryScreen() {
  const items = INITIAL_EVIDENCE_ITEMS.slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence History & Audit Trail"
        description="Review previously submitted records, automated boundary enclosure checks, and verifier remarks."
        breadcrumbs={[
          { label: 'Evidence', href: '/farmer/evidence' },
          { label: 'History' },
        ]}
      />

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] text-[#72816f]">{item.id}</span>
                <span className="text-[10px] text-[#72816f]">{item.timestamp}</span>
              </div>
              <strong className="text-sm text-[#193b2a] block">{item.title}</strong>
              <p className="text-xs text-[#526451] mt-0.5">{item.description}</p>
            </div>

            <div className="self-start sm:self-auto">
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                  item.status === 'verified'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {item.provenance.reviewStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/evidence/history')({
  component: FarmerEvidenceHistoryScreen,
});
