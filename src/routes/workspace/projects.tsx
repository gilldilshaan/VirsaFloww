import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import { ProjectRecord } from "@/lib/types/workspace";
import { useAuth } from "@/lib/auth/auth-context";
import { hasPermission } from "@/lib/auth/permissions";
import { UnauthorizedState } from "@/components/shared/unauthorized-state";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { pageHead } from "@/lib/earth/content";
import {
  FolderGit2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function WorkspaceProjectsPage() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");

  useEffect(() => {
    api.projects.list().then((res) => {
      setProjects(res);
      setLoading(false);
    });
  }, []);

  if (!hasPermission(currentUser, "workspace:projects:read")) {
    return <UnauthorizedState requiredPermission="workspace:projects:read" />;
  }

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.district.toLowerCase().includes(search.toLowerCase()) ||
      p.methodology.toLowerCase().includes(search.toLowerCase());
    const matchesStage = filterStage === "all" || p.pipelineStage === filterStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Internal Project Registry"
        icon={FolderGit2}
        title="Agricultural Carbon Projects"
        description="Institutional portfolio of active agricultural emission reduction programs across Punjab."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#5c7c46] bg-[#eef5e6] px-3 py-1.5 rounded-lg border border-[#cde0c5]">
              Total Enrolled:{" "}
              {projects.reduce((acc, curr) => acc + curr.totalHectares, 0).toLocaleString()} ha
            </span>
          </div>
        }
      />

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-3 text-[#788e7c]" />
          <input
            type="text"
            placeholder="Search by title, district or standard..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-[#f8faf6] border border-[#d8e1d4] rounded-lg text-[#193b2a] outline-none focus:border-[#245b45]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={13} className="text-[#5c7c46]" />
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="text-xs bg-[#f8faf6] border border-[#d8e1d4] rounded-lg px-2.5 py-1.5 text-[#193b2a] outline-none"
          >
            <option value="all">All Pipeline Stages</option>
            <option value="Verification Audit">Verification Audit</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Field Baseline">Field Baseline</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading registered projects..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs hover:border-[#b8cfb2] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f4f7f0] text-[#4f6453] border border-[#dce3d7]">
                    {proj.registryId}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium ${
                      proj.assessmentStatus === "READY_FOR_VERIFICATION"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {proj.pipelineStage}
                  </span>
                </div>

                <h3 className="font-serif text-xl text-[#193b2a] tracking-tight">{proj.title}</h3>
                <p className="text-xs text-[#72816f] mt-1 line-clamp-2">{proj.description}</p>

                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-[#edf2e8] text-xs">
                  <div>
                    <span className="text-[10px] text-[#788e7c] block uppercase font-mono">
                      Area
                    </span>
                    <strong className="text-[#193b2a] font-mono">{proj.totalHectares} ha</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#788e7c] block uppercase font-mono">
                      Farmers
                    </span>
                    <strong className="text-[#193b2a] font-mono">{proj.farmerCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#788e7c] block uppercase font-mono">
                      Mitigation
                    </span>
                    <strong className="text-[#245b45] font-mono">
                      {proj.estimatedTonsCo2ePerYear.toLocaleString()} t
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#edf2e8] flex items-center justify-between">
                <span className="text-[11px] text-[#5c7c46] font-medium flex items-center gap-1">
                  <Shield size={12} />
                  {proj.methodology}
                </span>

                <Link
                  to="/workspace/projects/$projectId"
                  params={{ projectId: proj.id }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#245b45] hover:text-[#193b2a]"
                >
                  Inspect Project Dossier
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/workspace/projects")({
  head: () =>
    pageHead(
      "Projects Registry | TerraLedger AI",
      "Institutional agricultural carbon project registry and monitoring pipeline.",
      "/workspace/projects",
    ),
  component: WorkspaceProjectsPage,
});
