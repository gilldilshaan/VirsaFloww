import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { MARKETPLACE_PROJECTS } from '@/lib/terra-ledger/mock-data';
import { FolderGit2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export function WorkspaceProjectsListScreen() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Registry"
        description="Consolidated registry of agricultural land management (ALM) carbon credit clusters in Punjab."
      />

      <div className="space-y-3">
        {MARKETPLACE_PROJECTS.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-[#dfe6d9] rounded-xl p-5 hover:border-[#245b45] transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#245b45] bg-[#eef5ea] px-2 py-0.5 rounded">
                  {project.id}
                </span>
                <span className="text-xs text-[#72816f]">{project.methodology}</span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#193b2a]">{project.title}</h3>
              <p className="text-xs text-[#72816f] mt-0.5">
                {project.location} · {project.totalHectares} ha ({project.enrolledParcels} parcels) · {project.practice}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`font-mono text-[10px] px-2.5 py-1 rounded font-semibold ${
                  project.assessmentStatus === 'READY_FOR_VERIFICATION'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-sky-100 text-sky-800 border border-sky-300'
                }`}
              >
                {project.assessmentStatus.replace(/_/g, ' ')}
              </span>

              <Link
                to="/workspace/projects/$projectId"
                params={{ projectId: project.id }}
                className="inline-flex items-center gap-1 text-xs text-[#245b45] font-semibold hover:underline"
              >
                <span>Project Details</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/workspace/projects/')({
  component: WorkspaceProjectsListScreen,
});
