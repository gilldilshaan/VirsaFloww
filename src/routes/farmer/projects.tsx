import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Award, ShieldCheck, CheckCircle2, Sprout } from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function FarmerProjectsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="ਪ੍ਰੋਗਰਾਮ ਭਾਗੀਦਾਰੀ · Project Participation"
        description="Your enrollment in regional carbon reduction programs and farmer revenue-sharing frameworks."
        badge={<DemoBadge label="Program Agreement" />}
      />

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#dde4d9] shadow-2xs space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase bg-[#e8efe5] text-[#245b45] px-2 py-0.5 rounded font-bold">
              VERRA VM0042 CLUSTER
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#193b2a] mt-2">
              Punjab Direct Seeded Rice MRV Cluster #1
            </h2>
            <p className="text-xs text-[#708071] mt-1">
              Operated by Panjdhara Private Limited in collaboration with Ludhiana FPO Consortium.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Enrolled & Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#f0f3ec] text-xs">
          <div className="bg-[#f7f9f5] p-4 rounded-xl border border-[#e5ebe0]">
            <span className="text-[10px] font-mono uppercase text-[#708071] block">Producer Share</span>
            <span className="text-xl font-bold text-[#245b45] mt-1 block">80% Net Proceeds</span>
            <span className="text-[10px] text-[#708071]">Direct bank account distribution</span>
          </div>
          <div className="bg-[#f7f9f5] p-4 rounded-xl border border-[#e5ebe0]">
            <span className="text-[10px] font-mono uppercase text-[#708071] block">Participating Area</span>
            <span className="text-xl font-bold text-[#193b2a] mt-1 block">1,450 Hectares</span>
            <span className="text-[10px] text-[#708071]">164 Enrolled farmers</span>
          </div>
          <div className="bg-[#f7f9f5] p-4 rounded-xl border border-[#e5ebe0]">
            <span className="text-[10px] font-mono uppercase text-[#708071] block">Audit Stage</span>
            <span className="text-sm font-bold text-[#193b2a] mt-2 block">Ready for VVB</span>
            <span className="text-[10px] text-emerald-700 font-semibold">Pre-issuance pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/projects')({
  head: () =>
    pageHead(
      'Project Participation | The Carbon Credit',
      'Enrolled agricultural carbon programs and smallholder benefit agreements.',
      '/farmer/projects'
    ),
  component: FarmerProjectsPage,
});
