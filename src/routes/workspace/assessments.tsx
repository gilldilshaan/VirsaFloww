import { createFileRoute } from '@tanstack/react-router';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Code2, Sparkles } from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function WorkspaceAssessmentsPage() {
  const { assessmentStatus, completenessPercent, aiExplanation, field } = useTerraLedger();

  const rules = [
    {
      id: 'RULE-R1',
      name: 'Readiness Completeness Check',
      description: 'Mandatory verification that all 5 readiness inputs exist (declaration, boundary, in-situ water log, geotagged emergence, satellite scene).',
      status: completenessPercent >= 80 ? 'PASS' : 'WARN',
      explanation: `Completeness evaluated at ${completenessPercent}%. Baseline declaration and remote sensing confirmed.`,
      sources: ['DECL-001', 'GEO-PARCEL-042', 'S2A_20260702_PB'],
    },
    {
      id: 'RULE-R2',
      name: 'Agronomic Date Window Consistency',
      description: 'Pre-sowing irrigation log must occur within 10 days prior to direct drill seeding.',
      status: 'PASS',
      explanation: 'Pre-sowing irrigation log dated 2026-06-12 aligns with June 15 DSR drill sowing date (lag: 3 days).',
      sources: ['EV-004-LOG', 'ACT-002'],
    },
    {
      id: 'RULE-R3',
      name: 'Field Boundary Enclosure Buffer (<= 15m)',
      description: 'Ground photograph EXIF GPS coordinates must fall inside cadastral polygon + 15m tolerance buffer.',
      status: assessmentStatus === 'READY_FOR_VERIFICATION' ? 'PASS' : 'WARN',
      explanation:
        assessmentStatus === 'READY_FOR_VERIFICATION'
          ? 'Replacement photo EV-005-PHOTO enclosed 100% inside PB-LUD-042 (precision 2.1m).'
          : 'Original photo EV-003 exhibited +420m offset outside boundary. Awaiting in-boundary replacement.',
      sources: assessmentStatus === 'READY_FOR_VERIFICATION' ? ['EV-005-PHOTO'] : ['EV-003'],
    },
    {
      id: 'RULE-R4',
      name: 'Sentinel-2 NDWI Soil Moisture Corroboration',
      description: 'Remote sensing NDWI index must verify absence of standing puddle water (> 0.30) during DSR vegetative window.',
      status: 'PASS',
      explanation: 'Sentinel-2 mean NDWI remained at -0.12, confirming dry vegetative direct-seeding baseline.',
      sources: ['S2A_20260614_PB', 'S2B_20260702_PB'],
    },
    {
      id: 'RULE-R5',
      name: 'Farmer Revenue-Sharing Framework',
      description: 'Mandatory 80% smallholder net carbon finance benefit distribution verified with FPO ledger.',
      status: 'PASS',
      explanation: 'Consortium agreement registered with Ludhiana FPO Consortium on 2026-05-10.',
      sources: ['FPO-AGR-2026-01'],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="MRV Assessments & Rules Engine"
        description="Deterministic methodology rule evaluations and multi-sensor corroboration for Punjab DSR."
        badge={<DemoBadge label="Rules Engine v2.4" />}
      />

      {/* AI Explanation Banner */}
      <div className="bg-[#102e20] text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#d6eaa6] font-semibold">
            <Sparkles size={15} />
            <span>AI Evidence Explanation (Audited & Source-Cited)</span>
          </div>
          <span className="text-[10px] font-mono text-[#a3c9a8] bg-white/10 px-2 py-0.5 rounded">
            Deterministic Rule Output
          </span>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl text-[#f5f5e8] font-bold">
          {aiExplanation.headline}
        </h3>
        <p className="text-xs sm:text-sm text-[#bacabd] leading-relaxed max-w-3xl">
          {aiExplanation.details}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="bg-[#173a2b] p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#a3c9a8] block">Spatial Assessment</span>
            <span className="font-semibold text-white">{aiExplanation.spatialStatus}</span>
          </div>
          <div className="bg-[#173a2b] p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#a3c9a8] block">Temporal Moisture Log</span>
            <span className="font-semibold text-white">{aiExplanation.temporalStatus}</span>
          </div>
        </div>
      </div>

      {/* Deterministic Rule Results Table */}
      <div className="bg-white rounded-2xl border border-[#dde4d9] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#dde4d9] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#193b2a]">Deterministic Methodology Rule Evaluations</h3>
            <p className="text-xs text-[#708071]">Pure code evaluation without LLM hallucination. All rules cite source records.</p>
          </div>
          <span className="text-xs font-mono text-[#245b45] font-bold">VERRA VM0042 SPEC</span>
        </div>

        <div className="divide-y divide-[#f0f3ec]">
          {rules.map((rule) => (
            <div key={rule.id} className="p-5 hover:bg-[#fafbf9] transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#193b2a]">{rule.id}:</span>
                  <span className="font-semibold text-xs text-[#193b2a]">{rule.name}</span>
                </div>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                    rule.status === 'PASS'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {rule.status}
                </span>
              </div>
              <p className="text-xs text-[#708071]">{rule.description}</p>
              <p className="text-xs text-[#213c2b] bg-[#f7f9f5] p-3 rounded-xl border border-[#e5ebe0]">
                {rule.explanation}
              </p>
              <div className="text-[10px] font-mono text-[#5c7c46] pt-1">
                Citing Evidence Record IDs: {rule.sources.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/workspace/assessments')({
  head: () =>
    pageHead(
      'MRV Assessments | The Carbon Credit OS',
      'Deterministic methodology rules engine and multi-sensor evaluations.',
      '/workspace/assessments'
    ),
  component: WorkspaceAssessmentsPage,
});
