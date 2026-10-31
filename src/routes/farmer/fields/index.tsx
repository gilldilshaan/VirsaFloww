import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { ALL_FIELDS } from '@/lib/terra-ledger/mock-data';
import { MapPin, PlusCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FarmerFieldsListScreen() {
  // Scoped to the farmer's registered fields
  const farmerFields = ALL_FIELDS.filter((f) => f.code === 'PB-LUD-042');

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Registered Field Parcels"
        description="Inspect cadastral boundaries, acreage measurements, and verified land title records."
        actions={
          <Link
            to="/farmer/fields/register"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#245b45] text-white rounded-lg text-xs font-medium hover:bg-[#1a4333]"
          >
            <PlusCircle size={14} />
            <span>Register New Parcel</span>
          </Link>
        }
      />

      <div className="space-y-3">
        {farmerFields.map((field) => (
          <div
            key={field.id}
            className="bg-white border border-[#dfe6d9] rounded-xl p-5 hover:border-[#245b45] transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#245b45] bg-[#eef5ea] px-2 py-0.5 rounded">
                  {field.code}
                </span>
                <span className="text-xs text-[#72816f]">{field.district}, Punjab</span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#193b2a]">{field.name}</h3>
              <p className="text-xs text-[#72816f] mt-0.5">
                {field.areaHa} ha ({field.areaAcres} acres) · {field.practice}
              </p>
            </div>

            <Link
              to="/farmer/fields/$fieldId"
              params={{ fieldId: field.id }}
              className="inline-flex items-center gap-1 text-xs text-[#245b45] font-semibold hover:underline"
            >
              <span>View Parcel Map & History</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/fields/')({
  component: FarmerFieldsListScreen,
});
