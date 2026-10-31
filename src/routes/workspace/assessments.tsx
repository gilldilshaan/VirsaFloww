import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { MARKETPLACE_PROJECTS } from '@/lib/terra-ledger/mock-data';
import { ShieldCheck, Layers, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function WorkspaceAssessmentsScreen() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="MRV Assessment Engine"
        description="Pre-audit synthesis combining multi-spectral satellite passes, cadastral boundaries, and field observation checklists."
      />

      <div className="space-y-3 text-xs">
        {MARKETPLACE_PROJECTS.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#245b45]">{p.id}</span>
                <span className="font-mono text-[10px] text-[#72816f]">Readiness: {p.readinessScorePercent}%</span>
              </div>
              <h3 className="font-serif text-base font-semibold text-[#193b2a]">{p.title}</h3>
              <p className="text-xs text-[#72816f] mt-0.5">{p.highlights[0]}</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`font-mono text-[10px] px-2.5 py-1 rounded font-semibold ${
                  p.assessmentStatus === 'READY_FOR_VERIFICATION'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-sky-100 text-sky-800 border border-sky-300'
                }`}
              >
                {p.assessmentStatus.replace(/_/g, ' ')}
              </span>
              <Link
                to="/workspace/projects/$projectId"
                params={{ projectId: p.id }}
                className="text-xs text-[#245b45] font-semibold hover:underline"
              >
                View Assessment →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/workspace/assessments')({
  component: WorkspaceAssessmentsScreen,
});
