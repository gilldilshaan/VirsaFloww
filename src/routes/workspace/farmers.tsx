import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { ALL_FIELDS } from '@/lib/terra-ledger/mock-data';
import { Users, Shield } from 'lucide-react';

export function WorkspaceFarmersScreen() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrolled Farmer Directory"
        description="FPO aggregation registry and smallholder associations. Personal private attributes are protected under data governance policies."
      />

      <div className="bg-white border border-[#dfe6d9] rounded-xl overflow-hidden shadow-xs text-xs">
        <table className="w-full text-left">
          <thead className="bg-[#f7f9f5] text-[#72816f] font-mono text-[10px] uppercase border-b border-[#dfe6d9]">
            <tr>
              <th className="p-3.5">Farmer Name (Official)</th>
              <th className="p-3.5">Local Name</th>
              <th className="p-3.5">Primary Parcel</th>
              <th className="p-3.5">FPO Organization</th>
              <th className="p-3.5">District</th>
              <th className="p-3.5">Mitigation Plan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf0e7]">
            {ALL_FIELDS.map((f) => (
              <tr key={f.id} className="hover:bg-[#f9faf7]">
                <td className="p-3.5 font-semibold text-[#193b2a]">{f.farmerName}</td>
                <td className="p-3.5 font-medium" lang="pa">{f.farmerNameLocal}</td>
                <td className="p-3.5 font-mono text-[#245b45]">{f.code}</td>
                <td className="p-3.5 text-[#72816f]">{f.fpoName || 'Malwa Agro FPO'}</td>
                <td className="p-3.5">{f.district}</td>
                <td className="p-3.5 text-[#5c7c46] font-medium">{f.practice.split('+')[0]?.trim()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/workspace/farmers')({
  component: WorkspaceFarmersScreen,
});
