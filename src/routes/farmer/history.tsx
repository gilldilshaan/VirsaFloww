import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { getFarmerActivities } from '@/lib/farmer/farmer-service';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Clock, CheckCircle2, Sprout, Calendar } from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function FarmerHistoryPage() {
  const activities = useMemo(() => getFarmerActivities(), []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="ਸੀਜ਼ਨ ਇਤਿਹਾਸ · Seasonal History"
        description="Historical crop seasons, baseline comparisons, and practice adherence across Kharif and Rabi."
        badge={<DemoBadge label="Multi-Year Audit Trail" />}
      />

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#dde4d9] shadow-2xs space-y-6">
        <div className="border-l-2 border-[#245b45] pl-4 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase bg-[#245b45] text-white px-2 py-0.5 rounded font-bold">
              Current · Kharif 2026
            </span>
            <h3 className="font-serif text-lg font-bold text-[#193b2a]">Direct Seeded Rice (DSR) Cluster #1</h3>
            <p className="text-xs text-[#708071]">
              4.8 hectares active. 100% enclosure checked. Multi-date Sentinel-2 observations show dry vegetative emergence.
            </p>
          </div>

          <div className="space-y-1 opacity-70">
            <span className="text-[10px] font-mono uppercase bg-[#708071] text-white px-2 py-0.5 rounded font-bold">
              Baseline · Kharif 2025
            </span>
            <h3 className="font-serif text-base font-bold text-[#193b2a]">Conventional Puddled Transplanted Rice</h3>
            <p className="text-xs text-[#708071]">
              Historical baseline established via historic Landsat-8 and Sentinel-2 NDWI flooding signatures. Continuous water standing for 45 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/history')({
  head: () =>
    pageHead(
      'Seasonal History | VirsaFlow',
      'Historical seasonal timeline and practice baselines for Punjab farmers.',
      '/farmer/history'
    ),
  component: FarmerHistoryPage,
});
