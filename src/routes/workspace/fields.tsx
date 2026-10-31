import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import { FieldRecord } from "@/lib/types/workspace";
import { useAuth } from "@/lib/auth/auth-context";
import { hasPermission } from "@/lib/auth/permissions";
import { UnauthorizedState } from "@/components/shared/unauthorized-state";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { pageHead } from "@/lib/earth/content";
import {
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function WorkspaceFieldsPage() {
  const { currentUser } = useAuth();
  const [fields, setFields] = useState<FieldRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    api.fields.list().then((res) => {
      setFields(res);
      setLoading(false);
    });
  }, []);

  if (!hasPermission(currentUser, "workspace:fields:read")) {
    return <UnauthorizedState requiredPermission="workspace:fields:read" />;
  }

  const filtered = fields.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.code.toLowerCase().includes(search.toLowerCase()) ||
      f.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      f.district.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || f.activeStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Cadastral Field Parcels"
        icon={MapPin}
        title="Field Parcel Registry"
        description="Parcel-level cadastral GIS boundaries, agricultural practice adoption, and AWD sensor installations."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#5c7c46] bg-[#eef5e6] px-3 py-1.5 rounded-lg border border-[#cde0c5]">
              Total Monitored: {fields.reduce((acc, f) => acc + f.areaHa, 0).toFixed(1)} ha
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
            placeholder="Search parcel code, farmer, district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-[#f8faf6] border border-[#d8e1d4] rounded-lg text-[#193b2a] outline-none focus:border-[#245b45]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={13} className="text-[#5c7c46]" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-[#f8faf6] border border-[#d8e1d4] rounded-lg px-2.5 py-1.5 text-[#193b2a] outline-none"
          >
            <option value="all">All Parcel Statuses</option>
            <option value="Audit Approved">Audit Approved</option>
            <option value="Under Review">Under Review</option>
            <option value="Flagged Discrepancy">Flagged Discrepancy</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading field parcels..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map((fieldItem) => (
            <div
              key={fieldItem.id}
              className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs hover:border-[#b8cfb2] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-[#193b2a] bg-[#f0f6ec] px-2 py-0.5 rounded border border-[#d4e3cf]">
                    {fieldItem.code}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium ${
                      fieldItem.activeStatus === "Audit Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : fieldItem.activeStatus === "Under Review"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {fieldItem.activeStatus}
                  </span>
                </div>

                <h3 className="font-semibold text-base text-[#193b2a]">{fieldItem.name}</h3>
                <p className="text-xs text-[#72816f] mt-0.5">
                  Farmer: <strong className="text-[#193b2a]">{fieldItem.farmerName}</strong>
                </p>

                {/* Parcel Specs */}
                <div className="my-3 py-3 border-y border-[#edf2e8] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#788e7c]">Location:</span>
                    <span className="font-medium text-[#213c2b]">{fieldItem.district}, Punjab</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#788e7c]">Area:</span>
                    <span className="font-mono font-medium text-[#213c2b]">
                      {fieldItem.areaHa} ha ({fieldItem.areaAcres} ac)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#788e7c]">Crop Stage:</span>
                    <span className="font-medium text-[#245b45]">{fieldItem.currentCropStage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#788e7c]">AWD Tubes:</span>
                    <span className="font-mono font-medium text-[#213c2b]">
                      {fieldItem.awdTubeCount} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#788e7c]">Field Officer:</span>
                    <span className="text-[#526a57] text-[11px] truncate max-w-[140px]">
                      {fieldItem.assignedFieldOfficer}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#5c7c46] truncate max-w-[120px]">
                  {fieldItem.practice}
                </span>

                <Link
                  to="/workspace/fields/$fieldId"
                  params={{ fieldId: fieldItem.id }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#245b45] hover:text-[#193b2a]"
                >
                  Inspect Parcel
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

export const Route = createFileRoute("/workspace/fields")({
  head: () =>
    pageHead(
      "Field Parcels | TerraLedger AI",
      "Cadastral parcel registry, geospatial boundaries and water management installations.",
      "/workspace/fields",
    ),
  component: WorkspaceFieldsPage,
});
