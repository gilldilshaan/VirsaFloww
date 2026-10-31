import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import { MrvAssessment } from "@/lib/types/workspace";
import { useAuth } from "@/lib/auth/auth-context";
import { hasPermission } from "@/lib/auth/permissions";
import { UnauthorizedState } from "@/components/shared/unauthorized-state";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { pageHead } from "@/lib/earth/content";
import {
  FileBadge,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  MapPin,
  Sparkles,
} from "lucide-react";

export function WorkspaceAssessmentsPage() {
  const { currentUser } = useAuth();
  const [assessments, setAssessments] = useState<MrvAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.assessments.list().then((res) => {
      setAssessments(res);
      setLoading(false);
    });
  }, []);

  if (!hasPermission(currentUser, "workspace:assessments:read")) {
    return <UnauthorizedState requiredPermission="workspace:assessments:read" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Independent Verification Engine"
        icon={FileBadge}
        title="MRV Assessments"
        description="Parcel-by-parcel quantitative compliance evaluations mapped against Verra VM0042 and Gold Standard agricultural protocols."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#5c7c46] bg-[#eef5e6] px-3 py-1.5 rounded-lg border border-[#cde0c5]">
              Total Evaluated: {assessments.length}
            </span>
          </div>
        }
      />

      {loading ? (
        <LoadingState message="Loading MRV assessments..." />
      ) : (
        <div className="space-y-4">
          {assessments.map((asm) => (
            <div
              key={asm.id}
              className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs hover:border-[#b8cfb2] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#edf2e8]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f4f7f0] text-[#4f6453] border border-[#dce3d7]">
                      {asm.assessmentNumber}
                    </span>
                    <span className="text-xs font-semibold text-[#193b2a]">
                      Parcel {asm.parcelCode}
                    </span>
                    <span className="text-xs text-[#72816f]">· {asm.farmerName}</span>
                  </div>
                  <h3 className="font-serif text-lg text-[#193b2a]">{asm.projectTitle}</h3>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-[#788e7c] block uppercase">
                      Completeness
                    </span>
                    <strong className="text-lg font-mono font-bold text-[#193b2a]">
                      {asm.overallScorePercent}%
                    </strong>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-3 py-1 rounded-full font-medium ${
                      asm.status === "READY_FOR_VERIFICATION"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {asm.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Criteria Check badges */}
              <div className="pt-3">
                <span className="text-[10px] font-mono uppercase text-[#788e7c] block mb-2">
                  Protocol Verification Checklist:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                  <div
                    className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                      asm.criteriaChecks.spatialCadastralBoundary
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                        : "bg-amber-50/60 border-amber-200 text-amber-900"
                    }`}
                  >
                    <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                    <span>Boundary Match</span>
                  </div>

                  <div
                    className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                      asm.criteriaChecks.zeroPuddleVerification
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                        : "bg-amber-50/60 border-amber-200 text-amber-900"
                    }`}
                  >
                    <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                    <span>Zero Puddle</span>
                  </div>

                  <div
                    className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                      asm.criteriaChecks.awdDrydownSpectralMatch
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                        : "bg-amber-50/60 border-amber-200 text-amber-900"
                    }`}
                  >
                    <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                    <span>AWD Drydown</span>
                  </div>

                  <div
                    className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                      asm.criteriaChecks.fertilizerDosingLog
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                        : "bg-amber-50/60 border-amber-200 text-amber-900"
                    }`}
                  >
                    <Clock
                      size={12}
                      className={
                        asm.criteriaChecks.fertilizerDosingLog
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }
                    />
                    <span>Fertilizer Log</span>
                  </div>

                  <div
                    className={`p-2 rounded-lg border flex items-center gap-1.5 ${
                      asm.criteriaChecks.independentPeerInspection
                        ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                        : "bg-amber-50/60 border-amber-200 text-amber-900"
                    }`}
                  >
                    <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                    <span>Peer Audit</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#edf2e8] flex items-center justify-between text-xs">
                <span className="text-[#788e7c]">Lead Auditor: {asm.leadAuditor}</span>
                <Link
                  to="/workspace/assessments/$assessmentId"
                  params={{ assessmentId: asm.id }}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#245b45] hover:text-[#193b2a]"
                >
                  View Assessment Findings
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

export const Route = createFileRoute("/workspace/assessments")({
  head: () =>
    pageHead(
      "MRV Assessments | TerraLedger AI",
      "Quantitative compliance evaluations, verification scoring and audit findings.",
      "/workspace/assessments",
    ),
  component: WorkspaceAssessmentsPage,
});
