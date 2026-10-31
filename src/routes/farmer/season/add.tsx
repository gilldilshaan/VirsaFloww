import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/earth/content';

export function FarmerSeasonAddScreen() {
  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader
        title="Log Season Activity"
        description="Record practice milestones: seed sowing, irrigation cycles, or harvesting."
        breadcrumbs={[
          { label: 'Crop Season', href: '/farmer/season' },
          { label: 'Add Event' },
        ]}
      />

      <div className="bg-white border border-[#dfe6d9] rounded-2xl p-6 shadow-2xs space-y-4 text-xs">
        <div>
          <label className="font-semibold text-[#193b2a] block mb-1">Activity Type</label>
          <select className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none">
            <option>AWD Water Depth Observation</option>
            <option>DSR Drill Sowing Event</option>
            <option>Fertilizer / Nutrient Application</option>
            <option>Residue Management (Happy Seeder)</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-[#193b2a] block mb-1">Date Observed</label>
          <input
            type="date"
            defaultValue="2026-07-15"
            className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button asChild variant="outline" size="sm" className="border-[#193b2a] text-[#193b2a] hover:bg-[#f4f7f1]">
            <Link to="/farmer/season">Cancel</Link>
          </Button>
          <Button size="sm" className="bg-[#193B2A] text-white hover:bg-[#245B45] font-semibold">
            Save Season Event
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/season/add')({
  head: () =>
    pageHead(
      'Log Season Event | VirsaFlow',
      'Record agronomic practice milestones and irrigation cycles.',
      '/farmer/season/add'
    ),
  component: FarmerSeasonAddScreen,
});
