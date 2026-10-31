import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import { ReviewTask } from "@/lib/types/workspace";
import { useAuth } from "@/lib/auth/auth-context";
import { hasPermission } from "@/lib/auth/permissions";
import { UnauthorizedState } from "@/components/shared/unauthorized-state";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { pageHead } from "@/lib/earth/content";
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  User,
  MapPin,
  FileCheck2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function WorkspaceReviewPage() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<ReviewTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    api.reviews.listQueue().then((res) => {
      setTasks(res);
      setLoading(false);
    });
  }, []);

  if (
    !hasPermission(currentUser, "workspace:evidence:review") &&
    currentUser?.role !== "project_developer" &&
    currentUser?.role !== "admin"
  ) {
    return <UnauthorizedState requiredPermission="workspace:evidence:review" />;
  }

  const handleResolve = (id: string) => {
    setResolvingId(id);
    setTimeout(() => {
      api.reviews
        .resolve(id, "Corroborated by auditor review. Verified replacement photo linked.")
        .then(() => {
          setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, status: "resolved" as const } : t)),
          );
          setResolvingId(null);
        });
    }, 600);
  };

  const filtered = tasks.filter((t) => {
    if (filterSeverity === "all") return true;
    return t.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Auditor Exception Desk"
        icon={CheckSquare}
        title="MRV Review Queue"
        description="Human-in-the-loop audit exception queue for spatial anomalies, missing ground observations, and boundary conflicts."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              Pending Exceptions: {tasks.filter((t) => t.status === "pending_review").length}
            </span>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-[#5c7c46]" />
          <span className="text-xs text-[#72816f]">Filter Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="text-xs bg-[#f8faf6] border border-[#d8e1d4] rounded-lg px-2.5 py-1 text-[#193b2a] outline-none"
          >
            <option value="all">All Severities</option>
            <option value="high">High Severity (Spatial/Integrity)</option>
            <option value="medium">Medium Severity (Logs/Docs)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading review tasks..." />
      ) : (
        <div className="space-y-4">
          {filtered.map((task) => (
            <div
              key={task.id}
              className={`bg-white border rounded-xl p-5 shadow-xs transition-all ${
                task.status === "resolved"
                  ? "border-emerald-200 bg-[#fafcf9]"
                  : task.severity === "high"
                    ? "border-amber-300"
                    : "border-[#dfe6d9]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f4f7f0] text-[#4f6453] border border-[#dce3d7]">
                      {task.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        task.severity === "high"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {task.severity} severity
                    </span>
                    <span className="text-[10px] font-mono text-[#788e7c]">
                      Parcel: <strong className="text-[#193b2a]">{task.parcelId}</strong>
                    </span>
                  </div>

                  <h3 className="font-semibold text-base text-[#193b2a]">{task.title}</h3>
                  <p className="text-xs text-[#526a57] leading-relaxed">{task.description}</p>

                  <div className="flex items-center gap-4 text-[11px] text-[#788e7c] pt-2">
                    <span className="flex items-center gap-1">
                      <User size={11} className="text-[#5c7c46]" />
                      Assigned: {task.assignedTo}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-[#5c7c46]" />
                      Due: {task.dueDate}
                    </span>
                  </div>
                </div>

                <div className="sm:self-center flex flex-col items-end gap-2 shrink-0">
                  {task.status === "resolved" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 size={13} />
                      Resolved & Attested
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleResolve(task.id)}
                      disabled={resolvingId === task.id}
                      className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333] h-8"
                    >
                      {resolvingId === task.id ? "Attesting..." : "Attest Resolution"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/workspace/review")({
  head: () =>
    pageHead(
      "Review Queue | TerraLedger AI",
      "Auditor exception desk and evidence dispute resolution queue.",
      "/workspace/review",
    ),
  component: WorkspaceReviewPage,
});
