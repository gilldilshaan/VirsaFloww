import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { Calendar, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead } from '@/lib/earth/content';

export function FarmerSeasonScreen() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Crop Season Activities (Kharif 2026)"
        description="Track sowing schedule, direct-seeding dates, and alternate wetting & drying irrigation cessation logs."
        actions={
          <Button asChild size="sm" className="bg-[#193B2A] text-white hover:bg-[#245B45]">
            <Link to="/farmer/season/add" className="inline-flex items-center gap-1.5">
              <PlusCircle size={14} />
              <span>Log Practice Event</span>
            </Link>
          </Button>
        }
      />

      <div className="bg-white border border-[#dfe6d9] rounded-2xl p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider">
          Recorded Seasonal Events
        </h3>

        <div className="divide-y divide-[#edf0e7] text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <div>
                <strong className="text-[#193b2a] block">Direct Seeded Rice (DSR) Sowing</strong>
                <span className="text-[#72816f]">June 14, 2026 · Tractor drill with laser land leveling</span>
              </div>
            </div>
            <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              LOGGED
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <div>
                <strong className="text-[#193b2a] block">Perforated Tube AWD Water Level Log #1</strong>
                <span className="text-[#72816f]">July 02, 2026 · Water level -15cm recorded</span>
              </div>
            </div>
            <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              LOGGED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/season/')({
  head: () =>
    pageHead(
      'Crop Season | VirsaFlow',
      'Track Kharif 2026 Direct Seeded Rice and Alternate Wetting & Drying milestones.',
      '/farmer/season'
    ),
  component: FarmerSeasonScreen,
});
