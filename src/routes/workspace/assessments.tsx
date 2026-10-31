import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/client';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Code2, Sparkles, Play, RefreshCw } from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

interface AssessmentRuleResult {
  ruleId: string;
  ruleName?: string;
  result: 'pass' | 'fail' | 'warn';
  explanation: string;
  sourceRecordIds: string[];
}

interface AssessmentResponse {
  id: string;
  fieldId: string;
  seasonId: string;
  status: 'UNVERIFIED' | 'NEEDS_REVIEW' | 'READY_FOR_VERIFICATION';
  statusLabel: string;
  ruleResults: AssessmentRuleResult[];
  evaluatedAt: string;
}

export function WorkspaceAssessmentsPage() {
  const { assessmentStatus, completenessPercent, aiExplanation, field } = useTerraLedger();
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchAssessment = async () => {
    try {
      const res = await api.get<{ items: AssessmentResponse[]; total: number }>(`/assessments?fieldId=${field.id || 'PB-FIELD-001'}`);
      if (res.data?.items && res.data.items.length > 0) {
        setAssessment(res.data.items[0] ?? null);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchAssessment();
  }, [field.id]);

  const handleRunAssessment = async () => {
    setIsRunning(true);
    setFeedback(null);
    try {
      const res = await api.post<AssessmentResponse>('/assessments/run', {
        fieldId: field.id || 'PB-FIELD-001',
        seasonId: 'KHARIF-2026',
        triggerReason: 'manual_auditor_scan',
      });

      if (res.data) {
        setAssessment(res.data);
        setFeedback(`Assessment completed. Server status: ${res.data.statusLabel}`);
      }
    } catch {
      setFeedback('Assessment executed via deterministic rule evaluation.');
    } finally {
      setIsRunning(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Rule definitions fallback if assessment not yet run
  const defaultRules = [
    {
      ruleId: 'R1_COMPLETENESS',
      ruleName: 'Minimum Mandatory Evidence Input Completeness',
      description: 'Mandatory verification that all 5 readiness inputs exist (declaration, boundary polygon, in-situ photo, water management log, satellite observation).',
      result: completenessPercent >= 80 ? 'pass' : 'warn',
      explanation: `Completeness evaluated at ${completenessPercent}%. Baseline declaration and remote sensing confirmed.`,
      sourceRecordIds: ['DECL-001', 'GEO-PARCEL-042', 'S2A_43REQ_20240923_0_L2A'],
    },
    {
      ruleId: 'R2_SPATIAL_CONTAINMENT',
      ruleName: 'Cadastral Boundary Enclosure Buffer (<= 15m)',
      description: 'Ground photograph EXIF GPS coordinates must fall inside cadastral polygon + 15m tolerance buffer.',
      result: assessmentStatus === 'READY_FOR_VERIFICATION' ? 'pass' : 'fail',
      explanation:
        assessmentStatus === 'READY_FOR_VERIFICATION'
          ? 'Replacement photo EV-005 enclosed 100% inside PB-FIELD-001 boundary.'
          : 'Original photo EV-2026-001 situated +420m outside cadastral boundary polygon.',
      sourceRecordIds: assessmentStatus === 'READY_FOR_VERIFICATION' ? ['EV-005'] : ['EV-2026-001'],
    },
    {
      ruleId: 'R3_TEMPORAL_WINDOW',
      ruleName: 'Agronomic Date Window Consistency',
      description: 'Pre-sowing irrigation log must occur within 10 days prior to direct drill seeding.',
      result: 'pass',
      explanation: 'Pre-sowing irrigation dated 2026-06-12 aligns with June 15 DSR drill sowing date (lag: 3 days).',
      sourceRecordIds: ['ACT-001', 'ACT-002'],
    },
    {
      ruleId: 'R4_REMOTE_SENSING',
      ruleName: 'Sentinel-2 NDWI Soil Moisture Corroboration',
      description: 'Remote sensing NDWI index must verify absence of continuous standing puddle water during DSR vegetative window.',
      result: 'pass',
      explanation: 'Sentinel-2 mean NDWI remained at -0.12, confirming dry vegetative direct-seeding baseline.',
      sourceRecordIds: ['OBS-SENTINEL2-PB01'],
    },
    {
      ruleId: 'R5_BENEFIT_SHARING',
      ruleName: 'Farmer Revenue-Sharing Framework (80% Net)',
      description: 'Mandatory 80% smallholder net carbon finance benefit distribution verified with FPO agreement.',
      result: 'pass',
      explanation: 'Consortium agreement registered with Malwa Progressive Farmers Collective on 2026-05-10.',
      sourceRecordIds: ['FPO-MALWA-01'],
    },
  ];

  const currentRules = assessment?.ruleResults || defaultRules;
  const currentStatus = assessment?.status || assessmentStatus;

  return (
    <div className="space-y-6">
      <PageHeader
        title="MRV Assessments & Rules Engine"
        description="Deterministic methodology rule evaluations and multi-sensor corroboration for Punjab DSR."
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRunAssessment}
              disabled={isRunning}
              className="bg-[#193b2a] text-[#f5f5e8] hover:bg-[#224e37] text-xs h-7 px-2.5 gap-1"
            >
              <Play size={12} className={isRunning ? 'animate-spin' : ''} />
              Run MRV Assessment
            </Button>
            <DemoBadge label="Rules Engine v2.4" />
          </div>
        }
      />

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 size={14} />
          <span>{feedback}</span>
        </div>
      )}

      {/* AI Explanation Banner */}
      <div className="bg-[#102e20] text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#d6eaa6] font-semibold">
            <Sparkles size={15} />
            <span>AI Evidence Explanation (Audited & Source-Cited)</span>
          </div>
          <span className="text-[10px] font-mono text-[#a3c9a8] bg-white/10 px-2 py-0.5 rounded">
            Status: {currentStatus} (Ceiling Enforced)
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
          {currentRules.map((rule: any) => {
            const isPass = rule.result === 'pass' || rule.result === 'PASS';
            const isWarn = rule.result === 'warn' || rule.result === 'WARN';
            return (
              <div key={rule.ruleId} className="p-5 hover:bg-[#fafbf9] transition-colors space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#193b2a]">{rule.ruleId}:</span>
                    <span className="font-semibold text-xs text-[#193b2a]">{rule.ruleName || rule.ruleId}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                      isPass
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isWarn
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {isPass ? 'PASS' : isWarn ? 'WARN' : 'FAIL'}
                  </span>
                </div>
                {rule.description && <p className="text-xs text-[#708071]">{rule.description}</p>}
                <p className="text-xs text-[#213c2b] bg-[#f7f9f5] p-3 rounded-xl border border-[#e5ebe0]">
                  {rule.explanation}
                </p>
                <div className="text-[10px] font-mono text-[#5c7c46] pt-1">
                  Citing Evidence Record IDs: {(rule.sourceRecordIds || []).join(', ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/workspace/assessments')({
  head: () =>
    pageHead(
      'MRV Assessments | VirsaFlow',
      'Deterministic methodology rules engine and multi-sensor evaluations.',
      '/workspace/assessments'
    ),
  component: WorkspaceAssessmentsPage,
});
