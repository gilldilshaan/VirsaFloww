import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { PRIMARY_FIELD } from '@/lib/terra-ledger/mock-data';
import { MapPin, ShieldCheck, ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldMap } from '@/components/geospatial/field-map';

export function FarmerFieldDetailScreen() {
  const { fieldId } = Route.useParams();
  const field = PRIMARY_FIELD;

  const parcelFeature = {
    id: field.id,
    code: field.code,
    name: field.name,
    areaHa: field.areaHa,
    status: (field.assessmentStatus === 'READY_FOR_VERIFICATION' ? 'READY_FOR_VERIFICATION' : 'NEEDS_REVIEW') as any,
    coordinates: (field.boundaryPolygon && field.boundaryPolygon.length >= 3)
      ? (field.boundaryPolygon as [number, number][])
      : ([
          [field.coordinates.lng - 0.003, field.coordinates.lat - 0.002],
          [field.coordinates.lng + 0.003, field.coordinates.lat - 0.002],
          [field.coordinates.lng + 0.002, field.coordinates.lat + 0.003],
          [field.coordinates.lng - 0.003, field.coordinates.lat + 0.003],
        ] as [number, number][]),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`ਪਾਰਸਲ ${field.code} · ${field.name}`}
        description={`Cadastral parcel details for ${field.district}, Punjab. Verified land record Jamabandi attached.`}
        breadcrumbs={[
          { label: 'My Fields', href: '/farmer/fields' },
          { label: field.code },
        ]}
        actions={
          <Button asChild size="sm" className="bg-[#193B2A] text-white hover:bg-[#245B45]">
            <Link to="/farmer/evidence">
              <Upload size={14} className="mr-1.5" />
              Upload Field Evidence
            </Link>
          </Button>
        }
      />

      {/* Geospatial Map View */}
      <div className="bg-white border border-[#dde4d9] rounded-2xl p-4 sm:p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#245b45]" />
            <h3 className="font-serif text-base font-bold text-[#193b2a]">
              Georeferenced Parcel Boundaries
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-[#e8efe5] text-[#193b2a] font-semibold px-2 py-0.5 rounded">
            Cadastral Survey Corroborated
          </span>
        </div>
        <FieldMap
          fields={[parcelFeature]}
          selectedFieldId={parcelFeature.id}
          height="380px"
          showSatellite={true}
        />
      </div>

      <div className="bg-white border border-[#dfe6d9] rounded-2xl p-6 shadow-2xs space-y-4">
        <h3 className="font-serif text-base font-bold text-[#193b2a]">Parcel Overview & Geometry</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-[#fafbf9] rounded-xl border border-[#edf0e7]">
            <span className="text-[#72816f] block font-mono text-[10px]">TOTAL AREA</span>
            <span className="font-semibold text-base text-[#193b2a]">{field.areaHa} ha</span>
            <span className="text-[11px] text-[#5c7c46] block">{field.areaAcres} Acres</span>
          </div>
          <div className="p-3 bg-[#fafbf9] rounded-xl border border-[#edf0e7]">
            <span className="text-[#72816f] block font-mono text-[10px]">CROP & PRACTICE</span>
            <span className="font-semibold text-sm text-[#193b2a] block">{field.crop}</span>
            <span className="text-[11px] text-[#5c7c46] block">Direct Seeded Rice</span>
          </div>
          <div className="p-3 bg-[#fafbf9] rounded-xl border border-[#edf0e7]">
            <span className="text-[#72816f] block font-mono text-[10px]">CADASTRAL SOURCE</span>
            <span className="font-semibold text-xs text-[#193b2a] block">{field.geometrySource}</span>
            <span className="text-[10px] text-emerald-700 font-semibold block">Jamabandi Title Clear</span>
          </div>
          <div className="p-3 bg-[#fafbf9] rounded-xl border border-[#edf0e7]">
            <span className="text-[#72816f] block font-mono text-[10px]">CENTROID GPS</span>
            <span className="font-mono text-xs text-[#245b45] font-semibold block">{field.coordinates.lat}°N</span>
            <span className="font-mono text-xs text-[#245b45] font-semibold block">{field.coordinates.lng}°E</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#edf0e7] flex items-center justify-between text-xs">
          <Link to="/farmer/fields" className="text-[#193b2a] hover:underline flex items-center gap-1 font-semibold">
            <ArrowLeft size={13} />
            <span>Back to All Fields</span>
          </Link>
          <Link to="/farmer/evidence" className="text-[#193b2a] hover:underline font-semibold">
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
