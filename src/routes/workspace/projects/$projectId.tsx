import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { MARKETPLACE_PROJECTS, ALL_FIELDS } from '@/lib/terra-ledger/mock-data';
import { ArrowLeft, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export function WorkspaceProjectDetailScreen() {
  const { projectId } = Route.useParams();
  const project = MARKETPLACE_PROJECTS.find((p) => p.id === projectId || p.slug === projectId) || MARKETPLACE_PROJECTS[0];
  const associatedFields = ALL_FIELDS.filter((f) => f.projectId === project?.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={project?.title || 'Project Details'}
        description={`${project?.methodology} · ${project?.location} · Developer: ${project?.developer}`}
        breadcrumbs={[
          { label: 'Project Registry', href: '/workspace/projects' },
          { label: project?.id || projectId },
        ]}
      />

      <div className="bg-white border border-[#dfe6d9] rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-[#193b2a]">Project Operational Parameters</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">TOTAL SCALE</span>
            <span className="font-semibold text-[#193b2a]">{project?.totalHectares} ha</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">ENROLLED FARMERS</span>
            <span className="font-semibold text-[#193b2a]">{project?.farmerCount} smallholders</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">VINTAGE</span>
            <span className="font-semibold text-[#193b2a]">{project?.vintage}</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">AUDIT STATUS</span>
            <span className="font-mono text-emerald-700 font-semibold">{project?.assessmentStatus.replace(/_/g, ' ')}</span>
          </div>
        </div>

        {/* Associated Fields Sub-table */}
        <div className="pt-4 border-t border-[#edf0e7]">
          <h4 className="text-xs font-semibold text-[#193b2a] mb-2 uppercase font-mono">
            Enrolled Parcels Sample ({associatedFields.length} Registered)
          </h4>
          <div className="divide-y divide-[#edf0e7] text-xs">
            {associatedFields.map((f) => (
              <div key={f.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-mono font-semibold text-[#245b45] mr-2">{f.code}</span>
                  <span className="text-[#193b2a]">{f.name} ({f.areaHa} ha)</span>
                </div>
                <Link
                  to="/workspace/fields/$fieldId"
                  params={{ fieldId: f.id }}
                  className="text-xs text-[#245b45] hover:underline"
                >
                  Inspect Parcel →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/workspace/projects/$projectId')({
  component: WorkspaceProjectDetailScreen,
});
