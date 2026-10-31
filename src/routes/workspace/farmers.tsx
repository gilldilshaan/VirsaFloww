import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import { FarmerRecord } from "@/lib/types/workspace";
import { useAuth } from "@/lib/auth/auth-context";
import { hasPermission } from "@/lib/auth/permissions";
import { UnauthorizedState } from "@/components/shared/unauthorized-state";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { pageHead } from "@/lib/earth/content";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Building,
  Phone,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function WorkspaceFarmersPage() {
  const { currentUser } = useAuth();
  const [farmers, setFarmers] = useState<FarmerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterKyc, setFilterKyc] = useState<string>("all");

  useEffect(() => {
    api.farmers.list().then((res) => {
      setFarmers(res);
      setLoading(false);
    });
  }, []);

  if (!hasPermission(currentUser, "workspace:farmers:read")) {
    return <UnauthorizedState requiredPermission="workspace:farmers:read" />;
  }

  const filtered = farmers.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.district.toLowerCase().includes(search.toLowerCase()) ||
      f.village.toLowerCase().includes(search.toLowerCase()) ||
      f.fpoName.toLowerCase().includes(search.toLowerCase());
    const matchesKyc = filterKyc === "all" || f.kycStatus === filterKyc;
    return matchesSearch && matchesKyc;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Internal Farmer Registry"
        icon={Users}
        title="Enrolled Farmer Partners"
        description="Comprehensive cadastral KYC registry, FPO aggregation memberships, and bank transfer verifications."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#5c7c46] bg-[#eef5e6] px-3 py-1.5 rounded-lg border border-[#cde0c5]">
              Active Farmers: {farmers.length}
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
            placeholder="Search farmer name, village, FPO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-[#f8faf6] border border-[#d8e1d4] rounded-lg text-[#193b2a] outline-none focus:border-[#245b45]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={13} className="text-[#5c7c46]" />
          <select
            value={filterKyc}
            onChange={(e) => setFilterKyc(e.target.value)}
            className="text-xs bg-[#f8faf6] border border-[#d8e1d4] rounded-lg px-2.5 py-1.5 text-[#193b2a] outline-none"
          >
            <option value="all">All KYC Statuses</option>
            <option value="Verified">Verified KYC</option>
            <option value="Pending Verification">Pending Verification</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading farmer registry..." />
      ) : (
        <div className="bg-white border border-[#dfe6d9] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8faf6] border-b border-[#dfe6d9] text-[#69816a] font-mono uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Farmer & ID</th>
                  <th className="px-4 py-3">Location & Village</th>
                  <th className="px-4 py-3">FPO Collective</th>
                  <th className="px-4 py-3">Enrolled Area</th>
                  <th className="px-4 py-3">Practice Adopted</th>
                  <th className="px-4 py-3">KYC Status</th>
                  <th className="px-4 py-3 text-right">Bank Linked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2e8]">
                {filtered.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-[#fafcf8] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-[#193b2a]">{farmer.name}</div>
                      <div className="text-[11px] text-[#72816f] font-mono" lang="pa">
                        {farmer.localName} · {farmer.id}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[#213c2b] flex items-center gap-1">
                        <MapPin size={11} className="text-[#5c7c46]" />
                        <span>
                          {farmer.village}, {farmer.tehsil}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#72816f]">{farmer.district}, Punjab</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[#213c2b] font-medium">{farmer.fpoName}</div>
                      <div className="text-[10px] text-[#72816f]">{farmer.phoneMasked}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-mono font-semibold text-[#193b2a]">
                        {farmer.enrolledHectares} ha
                      </div>
                      <div className="text-[10px] text-[#72816f]">
                        {farmer.totalParcels} parcel(s)
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[11px] text-[#245b45] font-medium bg-[#f0f6ec] px-2 py-0.5 rounded border border-[#d2e3ca]">
                        {farmer.practiceAdopted}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          farmer.kycStatus === "Verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {farmer.kycStatus === "Verified" ? (
                          <CheckCircle2 size={10} className="text-emerald-600" />
                        ) : (
                          <Clock size={10} className="text-amber-600" />
                        )}
                        {farmer.kycStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono">
                      {farmer.bankAccountVerified ? (
                        <span className="text-emerald-700 text-[11px] font-medium">✓ Verified</span>
                      ) : (
                        <span className="text-amber-700 text-[11px] font-medium">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/workspace/farmers")({
  head: () =>
    pageHead(
      "Farmer Registry | TerraLedger AI",
      "Internal smallholder farmer registry, KYC verification and FPO affiliation directory.",
      "/workspace/farmers",
    ),
  component: WorkspaceFarmersPage,
});
