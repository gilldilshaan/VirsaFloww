import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import { Send, PlusCircle, ArrowRight } from 'lucide-react';

export function BuyerEnquiriesScreen() {
  const { dueDiligenceList } = useTerraLedger();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Offtake Pipeline & Data Room Enquiries"
        description="Track active institutional due diligence inquiries, data room NDA requests, and audit stages."
        actions={
          <Link
            to="/buyers/enquiry"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#245b45] text-white rounded-lg text-xs font-medium hover:bg-[#1a4333]"
          >
            <PlusCircle size={14} />
            <span>New Inquiry</span>
          </Link>
        }
      />

      <div className="bg-white border border-[#dfe6d9] rounded-xl overflow-hidden shadow-xs text-xs">
        <table className="w-full text-left">
          <thead className="bg-[#f7f9f5] text-[#72816f] font-mono text-[10px] uppercase border-b border-[#dfe6d9]">
            <tr>
              <th className="p-3.5">Reference ID</th>
              <th className="p-3.5">Project Target</th>
              <th className="p-3.5">Inquiry Date</th>
              <th className="p-3.5">Requested Volume</th>
              <th className="p-3.5">Vintage</th>
              <th className="p-3.5">Due Diligence Stage</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0e7]">
            {dueDiligenceList.map((item) => (
              <tr key={item.id} className="hover:bg-[#f9faf7]">
                <td className="p-3.5 font-mono font-semibold text-[#245b45]">{item.id}</td>
                <td className="p-3.5 font-medium text-[#193b2a]">{item.projectTitle}</td>
                <td className="p-3.5 text-[#72816f] font-mono">{item.inquiryDate}</td>
                <td className="p-3.5 font-mono font-semibold">{item.volumeRequestedTons.toLocaleString()} tCO2e</td>
                <td className="p-3.5 font-mono">{item.targetRetirementYear}</td>
                <td className="p-3.5">
                  <span className="bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded text-[10px] font-mono">
                    {item.stage}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-mono">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/buyers/enquiries')({
  component: BuyerEnquiriesScreen,
});
