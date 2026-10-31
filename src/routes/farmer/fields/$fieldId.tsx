import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { PRIMARY_FIELD } from '@/lib/terra-ledger/mock-data';
import { MapPin, ShieldCheck, ArrowLeft } from 'lucide-react';

export function FarmerFieldDetailScreen() {
  const { fieldId } = Route.useParams();
  const field = PRIMARY_FIELD;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Parcel ${field.code} · ${field.name}`}
        description={`Cadastral parcel details for ${field.district}, Punjab. Verified land record Jamabandi attached.`}
        breadcrumbs={[
          { label: 'My Fields', href: '/farmer/fields' },
          { label: field.code },
        ]}
      />

      <div className="bg-white border border-[#dfe6d9] rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-[#193b2a]">Parcel Overview & Geometry</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">AREA</span>
            <span className="font-semibold text-[#193b2a]">{field.areaHa} ha ({field.areaAcres} ac)</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">CROP / VARIETY</span>
            <span className="font-semibold text-[#193b2a]">{field.crop}</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">CADASTRAL SOURCE</span>
            <span className="font-semibold text-[#193b2a]">{field.geometrySource}</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">COORDINATES</span>
            <span className="font-mono text-[#245b45]">{field.coordinates.lat}°N, {field.coordinates.lng}°E</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#edf0e7] flex items-center justify-between text-xs">
          <Link to="/farmer/fields" className="text-[#245b45] hover:underline flex items-center gap-1 font-medium">
            <ArrowLeft size={13} />
            <span>Back to All Fields</span>
          </Link>
          <Link to="/farmer/evidence" className="text-[#245b45] hover:underline font-medium">
            Upload Evidence for this Parcel →
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/fields/$fieldId')({
  component: FarmerFieldDetailScreen,
});
