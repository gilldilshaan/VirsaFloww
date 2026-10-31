import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { ALL_FIELDS } from '@/lib/terra-ledger/mock-data';
import { MapPin, PlusCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldMap, FieldFeature } from '@/components/geospatial/field-map';

export function FarmerFieldsListScreen() {
  const farmerFields = ALL_FIELDS.filter(
    (f) => f.code === 'PB-LUD-042' || (f.farmerName && f.farmerName.includes('Gill'))
  );

  const fieldFeatures: FieldFeature[] = farmerFields.map((field) => ({
    id: field.id,
    code: field.code,
    name: field.name,
    areaHa: field.areaHa,
    status: (field.assessmentStatus === 'READY_FOR_VERIFICATION' ? 'READY_FOR_VERIFICATION' : 'NEEDS_REVIEW') as any,
    coordinates:
      field.boundaryPolygon && field.boundaryPolygon.length >= 3
        ? (field.boundaryPolygon as [number, number][])
        : [
            [field.coordinates.lng - 0.003, field.coordinates.lat - 0.002],
            [field.coordinates.lng + 0.003, field.coordinates.lat - 0.002],
            [field.coordinates.lng + 0.002, field.coordinates.lat + 0.003],
            [field.coordinates.lng - 0.003, field.coordinates.lat + 0.003],
          ],
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="ਮੇਰੇ ਖੇਤ · Registered Field Parcels"
        description="Inspect cadastral boundaries, acreage measurements, and official land record Jamabandi attachments."
        actions={
          <Button asChild size="sm" className="bg-[#193B2A] text-white hover:bg-[#245B45]">
            <Link to="/farmer/fields/register">
              <PlusCircle size={14} className="mr-1.5" />
              <span>Register New Parcel</span>
            </Link>
          </Button>
        }
      />

      {/* Geospatial Map Overview */}
      <div className="bg-white border border-[#dde4d9] rounded-2xl p-4 sm:p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#245b45]" />
            <h3 className="font-serif text-base font-bold text-[#193b2a]">
              Farm Parcels & Boundary Boundaries
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-[#e8efe5] text-[#193b2a] font-semibold px-2 py-0.5 rounded">
            Ludhiana District, Punjab
          </span>
        </div>
        <FieldMap
          fields={fieldFeatures}
          height="350px"
          showSatellite={true}
        />
      </div>

      <div className="space-y-3">
        {farmerFields.map((field) => (
          <div
            key={field.id}
            className="bg-white border border-[#dfe6d9] rounded-2xl p-5 hover:border-[#245b45] transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#193b2a] bg-[#eef5ea] px-2 py-0.5 rounded">
                  {field.code}
                </span>
                <span className="text-xs text-[#72816f]">{field.district}, Punjab</span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#193b2a]">{field.name}</h3>
              <p className="text-xs text-[#72816f] mt-0.5">
                {field.areaHa} ha ({field.areaAcres} acres) · {field.practice}
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="border-[#193b2a] text-[#193b2a] hover:bg-[#f4f7f1]">
              <Link
                to="/farmer/fields/$fieldId"
                params={{ fieldId: field.id }}
                className="inline-flex items-center gap-1.5"
              >
                <span>View Parcel Map & History</span>
                <ArrowRight size={13} />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/fields/')({
  component: FarmerFieldsListScreen,
});
