import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { ALL_FIELDS } from '@/lib/terra-ledger/mock-data';
import { MapPin, ArrowRight } from 'lucide-react';

export function WorkspaceFieldsListScreen() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Field Parcel Registry"
        description="Audited agricultural parcels, cadastral boundary geometries, and verification statuses across Punjab."
      />

      <div className="bg-white border border-[#dfe6d9] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f9f5] text-[#72816f] font-mono text-[10px] uppercase border-b border-[#dfe6d9]">
              <tr>
                <th className="p-3.5">Parcel Code</th>
                <th className="p-3.5">Parcel Name</th>
                <th className="p-3.5">District</th>
                <th className="p-3.5">Area</th>
                <th className="p-3.5">Practice</th>
                <th className="p-3.5">Geometry Source</th>
                <th className="p-3.5">Audit Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0e7]">
              {ALL_FIELDS.map((f) => (
                <tr key={f.id} className="hover:bg-[#f9faf7] transition-colors">
                  <td className="p-3.5 font-mono font-semibold text-[#245b45]">{f.code}</td>
                  <td className="p-3.5 font-medium text-[#193b2a]">{f.name}</td>
                  <td className="p-3.5 text-[#72816f]">{f.district}</td>
                  <td className="p-3.5 font-mono">{f.areaHa} ha ({f.areaAcres} ac)</td>
                  <td className="p-3.5">{f.practice.split('+')[0]?.trim()}</td>
                  <td className="p-3.5 text-[#72816f]">{f.geometrySource}</td>
                  <td className="p-3.5">
                    <span
                      className={`font-mono text-[9px] px-2 py-0.5 rounded font-semibold ${
                        f.assessmentStatus === 'READY_FOR_VERIFICATION'
                          ? 'bg-emerald-100 text-emerald-800'
                          : f.assessmentStatus === 'NEEDS_REVIEW'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {f.assessmentStatus?.replace(/_/g, ' ') || 'UNVERIFIED'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      to="/workspace/fields/$fieldId"
                      params={{ fieldId: f.id }}
                      className="text-[#245b45] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/workspace/fields/')({
  component: WorkspaceFieldsListScreen,
});
