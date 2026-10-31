import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { ALL_FIELDS, PRIMARY_FIELD } from '@/lib/terra-ledger/mock-data';
import { MapPin, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WorkspaceFieldDetailScreen() {
  const { fieldId } = Route.useParams();
  const field = ALL_FIELDS.find((f) => f.id === fieldId || f.code === fieldId) || PRIMARY_FIELD;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Parcel ${field.code} · ${field.name}`}
        description={`${field.district}, Punjab · Area: ${field.areaHa} ha (${field.areaAcres} acres) · Practice: ${field.practice}`}
        breadcrumbs={[
          { label: 'Field Parcels', href: '/workspace/fields' },
          { label: field.code },
        ]}
        actions={
          <Link
            to="/workspace/command"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#245b45] text-white rounded-lg text-xs font-medium hover:bg-[#1a4333]"
          >
            <span>Open in Command Centre</span>
            <ArrowRight size={13} />
          </Link>
        }
      />

      <div className="bg-white border border-[#dfe6d9] rounded-xl p-6 shadow-xs space-y-4 text-xs">
        <h3 className="text-sm font-semibold text-[#193b2a]">Parcel Verification Record</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">CADASTRAL SOURCE</span>
            <span className="font-semibold text-[#193b2a]">{field.geometrySource}</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">COORDINATES</span>
            <span className="font-mono text-[#245b45]">{field.coordinates.lat}°N, {field.coordinates.lng}°E</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">FPO PARTNER</span>
            <span className="font-semibold text-[#193b2a]">{field.fpoName || 'Malwa Agro FPO'}</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">AUDIT STATUS</span>
            <span className="font-mono font-semibold text-emerald-700">
              {field.assessmentStatus?.replace(/_/g, ' ') || 'UNVERIFIED'}
            </span>
          </div>
        </div>

        {/* Boundary Polygon coordinates inspection */}
        <div className="pt-4 border-t border-[#edf0e7]">
          <h4 className="text-xs font-semibold text-[#193b2a] mb-2 uppercase font-mono">
            Boundary Polygon Vertices ({field.boundaryPolygon.length} Points)
          </h4>
          <div className="bg-[#102e20] text-emerald-300 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
            {JSON.stringify(field.boundaryPolygon)}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/workspace/fields/$fieldId')({
  component: WorkspaceFieldDetailScreen,
});
