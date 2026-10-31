import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import { MrvAssessment } from "@/lib/types/workspace";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { pageHead } from "@/lib/earth/content";
import {
  FileBadge,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Shield,
  FileCheck2,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssessmentDetailPage() {
  const { assessmentId } = useParams({ from: "/workspace/assessments/$assessmentId" });
  const [assessment, setAssessment] = useState<MrvAssessment[] | null>(null);
  const [current, setCurrent] = useState<MrvAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.assessments.getById(assessmentId).then((res) => {
      setCurrent(res);
      setLoading(false);
    });
  }, [assessmentId]);

  if (loading) {
    return <LoadingState message="Loading MRV audit assessment details..." />;
  }

  if (!current) {
    return (
      <EmptyState
        title="Assessment Not Found"
        description={`Assessment record ${assessmentId} could not be retrieved.`}
        actionLabel="Back to Assessments"
        onAction={() => window.history.back()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/workspace/assessments"
        className="inline-flex items-center gap-1.5 text-xs text-[#5c7c46] hover:text-[#193b2a] font-medium"
      >
        <ArrowLeft size={13} />
        Back to MRV Assessments
      </Link>

      <PageHeader
        badge={`Assessment Record: ${current.assessmentNumber}`}
        icon={FileBadge}
        title={`Audit Report: Parcel ${current.parcelCode}`}
        description={`Evaluated for ${current.projectTitle} · ${current.cropSeason}`}
        actions={
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-3 py-1.5 rounded-lg font-mono font-medium ${
                current.status === "READY_FOR_VERIFICATION"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}
            >
              Status: {current.status.replace(/_/g, " ")}
            </span>
          </div>
        }
      />

      {/* Summary card */}
      <div className="bg-white border border-[#dfe6d9] rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#edf2e8]">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#788e7c]">
              Overall Audit Completeness
            </span>
            <div className="text-3xl font-mono font-bold text-[#193b2a] mt-1">
              {current.overallScorePercent}%
            </div>
            <p className="text-xs text-[#72816f] mt-0.5">Evaluated at: {current.evaluatedAt}</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono uppercase text-[#788e7c]">
              Lead Accredited Auditor
            </span>
            <div className="text-sm font-semibold text-[#193b2a] mt-1">{current.leadAuditor}</div>
            <p className="text-xs text-[#5c7c46] mt-0.5">ISO 14065 / Verra VVB Accredited</p>
          </div>
        </div>

        {/* Headline findings */}
        <div>
          <h3 className="text-xs font-mono uppercase text-[#69816a] mb-2 font-bold">
            Headline Audit Findings
          </h3>
          <p className="text-xs text-[#213c2b] bg-[#f8faf6] p-4 rounded-xl border border-[#e2ebd9] leading-relaxed">
            {current.headlineFindings}
          </p>
        </div>

        {/* Auditor Recommendations */}
        <div className="pt-2">
          <h3 className="text-xs font-mono uppercase text-[#69816a] mb-2 font-bold">
            Auditor Recommendations
          </h3>
          <div className="space-y-2">
            {current.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-[#213c2b] p-2.5 rounded-lg bg-[#fffdf5] border border-[#f5ecd0]"
              >
                <Clock size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-[#edf2e8] flex justify-end gap-3">
          <Link
            to="/workspace/dossier"
            className="rounded-lg bg-[#245b45] text-white px-4 py-2 text-xs font-semibold hover:bg-[#1a4333]"
          >
            Review Project Dossier
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/workspace/assessments/$assessmentId")({
  head: () =>
    pageHead(
      "Assessment Findings | TerraLedger AI",
      "Quantitative compliance evaluation and accredited auditor findings.",
      "/workspace/assessments/$assessmentId",
    ),
  component: AssessmentDetailPage,
});
