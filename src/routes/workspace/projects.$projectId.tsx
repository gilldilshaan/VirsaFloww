import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import { ProjectRecord } from "@/lib/types/workspace";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { pageHead } from "@/lib/earth/content";
import {
  FolderGit2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Users,
  TrendingUp,
  ArrowLeft,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProjectDetailPage() {
  const { projectId } = useParams({ from: "/workspace/projects/$projectId" });
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.projects.getById(projectId).then((res) => {
      setProject(res);
      setLoading(false);
    });
  }, [projectId]);

  if (loading) {
    return <LoadingState message="Loading project specifications..." />;
  }

  if (!project) {
    return (
      <EmptyState
        title="Project Not Found"
        description={`The project reference ${projectId} could not be located in the registry.`}
        actionLabel="Back to Projects"
        onAction={() => window.history.back()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/workspace/projects"
        className="inline-flex items-center gap-1.5 text-xs text-[#5c7c46] hover:text-[#193b2a] font-medium"
      >
        <ArrowLeft size={13} />
        Back to Project Registry
      </Link>

      <PageHeader
        badge={project.registryId}
        icon={FolderGit2}
        title={project.title}
        description={project.description}
        actions={
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-3 py-1.5 rounded-lg font-mono font-medium ${
                project.assessmentStatus === "READY_FOR_VERIFICATION"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}
            >
              Stage: {project.pipelineStage}
            </span>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Total Area</span>
          <strong className="block text-2xl font-mono text-[#193b2a] mt-1">
            {project.totalHectares.toLocaleString()} ha
          </strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">
            {project.enrolledParcels} enrolled parcels
          </span>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Annual Mitigation</span>
          <strong className="block text-2xl font-mono text-[#245b45] mt-1">
            {project.estimatedTonsCo2ePerYear.toLocaleString()} tCO2e
          </strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">Estimated GHG reduction</span>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Farmer Collective</span>
          <strong className="block text-2xl font-mono text-[#193b2a] mt-1">
            {project.farmerCount}
          </strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">Aggregated smallholders</span>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Readiness Score</span>
          <strong className="block text-2xl font-mono text-[#193b2a] mt-1">
            {project.readinessScorePercent}%
          </strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">Evidence corroborated</span>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="font-serif text-xl text-[#193b2a]">Methodology & Key Interventions</h3>
          <p className="text-xs text-[#526a57] leading-relaxed">
            Intervention focuses on transitioning traditional flooded basin rice paddy to dry
            direct-seeding with tractor seed drills, combined with alternate wetting and drying
            (AWD) water management.
          </p>

          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-mono uppercase text-[#69816a]">Verification Highlights</h4>
            {project.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#213c2b]">
                <CheckCircle2 size={14} className="text-[#347454] shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#edf2e8]">
            <h4 className="text-xs font-mono uppercase text-[#69816a] mb-2">
              Evidence Depth Breakdown
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-[#f8faf6] rounded-lg border border-[#e2ebd9]">
                <span className="text-lg font-mono font-bold text-[#193b2a]">
                  {project.evidenceDepth.satellitePasses}
                </span>
                <span className="block text-[10px] text-[#72816f]">Sentinel-2 Passes</span>
              </div>
              <div className="p-3 bg-[#f8faf6] rounded-lg border border-[#e2ebd9]">
                <span className="text-lg font-mono font-bold text-[#193b2a]">
                  {project.evidenceDepth.groundPhotos}
                </span>
                <span className="block text-[10px] text-[#72816f]">Geotagged Photos</span>
              </div>
              <div className="p-3 bg-[#f8faf6] rounded-lg border border-[#e2ebd9]">
                <span className="text-lg font-mono font-bold text-[#193b2a]">
                  {project.evidenceDepth.waterLogs}
                </span>
                <span className="block text-[10px] text-[#72816f]">Piezometer AWD Logs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="font-serif text-lg text-[#193b2a]">Project Governance</h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-[#788e7c] block uppercase">
                Project Developer
              </span>
              <strong className="text-[#193b2a]">{project.developer}</strong>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#788e7c] block uppercase">
                Standard & Methodology
              </span>
              <strong className="text-[#193b2a]">{project.complianceStandard}</strong>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#788e7c] block uppercase">
                Jurisdiction & Location
              </span>
              <strong className="text-[#193b2a]">{project.location}</strong>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#788e7c] block uppercase">
                Crediting Vintage
              </span>
              <strong className="text-[#193b2a]">{project.vintage}</strong>
            </div>

            <div className="pt-3 border-t border-[#edf2e8]">
              <Link
                to="/workspace/dossier"
                className="w-full inline-flex items-center justify-center rounded-lg bg-[#245b45] text-white py-2 text-xs font-semibold hover:bg-[#1a4333]"
              >
                Inspect Full Dossier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/workspace/projects/$projectId")({
  head: () =>
    pageHead(
      "Project Dossier Detail | TerraLedger AI",
      "Detailed agricultural carbon project specifications, evidence records and audit readiness.",
      "/workspace/projects/$projectId",
    ),
  component: ProjectDetailPage,
});
