import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FarmerFieldRegisterScreen() {
  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Register New Agricultural Parcel"
        description="Enter village, khasra / khewat revenue numbers, and boundary coordinates for Punjab land registry verification."
        breadcrumbs={[
          { label: 'My Fields', href: '/farmer/fields' },
          { label: 'Register' },
        ]}
      />

      <div className="bg-white border border-[#dfe6d9] rounded-xl p-6 shadow-xs space-y-4 text-xs">
        <div>
          <label className="font-medium text-[#193b2a] block mb-1">Parcel Name / Local Name</label>
          <input
            type="text"
            placeholder="e.g. Canal Side Plot 2"
            className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-medium text-[#193b2a] block mb-1">District</label>
            <input
              type="text"
              defaultValue="Ludhiana"
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none"
            />
          </div>
          <div>
            <label className="font-medium text-[#193b2a] block mb-1">Area (Acres)</label>
            <input
              type="number"
              placeholder="e.g. 5.5"
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Link
            to="/farmer/fields"
            className="px-3 py-2 rounded-lg border border-[#d8e1d4] text-[#72816f] hover:text-[#193b2a]"
          >
            Cancel
          </Link>
          <Button size="sm" className="bg-[#245b45] text-white hover:bg-[#1a4333]">
            Submit Parcel for Registration
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/fields/register')({
  component: FarmerFieldRegisterScreen,
});
