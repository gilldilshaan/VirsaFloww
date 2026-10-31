import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Shield,
  FolderKanban,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Lock,
  Layers,
  Database,
  Sliders,
  Building2,
  Factory,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System Administration & Platform Governance"
        description="Global system telemetry, role-based access control, cryptographic audit logging, and MRV threshold governance."
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge label="Role: Administrator" />
            <span className="text-xs font-mono bg-red-950 text-red-200 border border-red-800 px-2.5 py-1 rounded">
              Zero-Trust RBAC Active
            </span>
          </div>
        }
      />

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#dde4d9] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#708071] text-xs font-mono uppercase">
            <span>Registered Users</span>
            <Users size={16} className="text-[#193b2a]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#193b2a] mt-2">458</div>
          <div className="text-xs text-[#5c7c46] mt-1 flex items-center gap-1">
            <span>412 Farmers · 14 Staff · 4 Reviewers · 28 Buyers</span>
          </div>
        </div>

        <div className="bg-white border border-[#dde4d9] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#708071] text-xs font-mono uppercase">
            <span>Active Projects</span>
            <FolderKanban size={16} className="text-[#193b2a]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#193b2a] mt-2">3</div>
          <div className="text-xs text-[#5c7c46] mt-1 flex items-center gap-1">
            <span>2 Approved for Buyer Marketplace · 1 Staging</span>
          </div>
        </div>

        <div className="bg-white border border-[#dde4d9] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#708071] text-xs font-mono uppercase">
            <span>Audit Trail Events</span>
            <FileText size={16} className="text-[#193b2a]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#193b2a] mt-2">1,482</div>
          <div className="text-xs text-[#5c7c46] mt-1 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>Append-only SHA-256 ledger intact</span>
          </div>
        </div>

        <div className="bg-white border border-[#dde4d9] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#708071] text-xs font-mono uppercase">
            <span>Platform Health</span>
            <Activity size={16} className="text-emerald-700" />
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-800 mt-2">99.9%</div>
          <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1">
            <span>Sentinel-2 API & Telemetry Pipeline Online</span>
          </div>
        </div>
      </div>

      {/* Platform Security & Governance Banner */}
      <div className="bg-[#102e20] text-[#f5f5e8] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-[#d6eaa6]" />
            <h2 className="font-serif text-lg text-white font-semibold">
              Truth Constraints & Platform Rules Enforced
            </h2>
          </div>
          <p className="text-xs text-[#bacabd] max-w-2xl leading-relaxed">
            The Carbon Credit OS operates under strict verification invariants: status ceiling is strictly{' '}
            <code className="text-[#d6eaa6] bg-[#1a4230] px-1 py-0.5 rounded">READY_FOR_VERIFICATION</code>{' '}
            (never auto-verified), issued credits remain 0 tCO2e prior to accredited DOE verification, farmer PII is restricted to internal workspace only, and no speculative prices are shown to corporate buyers.
          </p>
        </div>
        <Link
          to={"/admin/roles" as any}
          className="bg-[#d6eaa6] text-[#102e20] hover:bg-[#c4dc90] text-xs font-semibold px-4 py-2 rounded-lg shrink-0 flex items-center gap-1.5 transition-colors"
        >
          <span>Inspect Role Matrix</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Administrative Quick Action Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#dde4d9] rounded-xl p-5 space-y-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#193b2a] flex items-center justify-center">
            <Users size={18} />
          </div>
          <h3 className="font-serif text-base text-[#193b2a] font-semibold">
            User Access & Account Directory
          </h3>
          <p className="text-xs text-[#708071] leading-relaxed">
            Manage credentials, assign roles across 6 security levels, and inspect login sessions and multi-factor authentication states.
          </p>
          <Link
            to={"/admin/users" as any}
            className="text-xs text-[#193b2a] font-semibold flex items-center gap-1 hover:underline pt-1 inline-flex"
          >
            Manage Users Directory &rarr;
          </Link>
        </div>

        <div className="bg-white border border-[#dde4d9] rounded-xl p-5 space-y-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#193b2a] flex items-center justify-center">
            <FolderKanban size={18} />
          </div>
          <h3 className="font-serif text-base text-[#193b2a] font-semibold">
            Project Publication & Approvals
          </h3>
          <p className="text-xs text-[#708071] leading-relaxed">
            Review staging projects, verify evidence completeness scores, and toggle project visibility in the Institutional Buyer Marketplace.
          </p>
          <Link
            to={"/admin/projects" as any}
            className="text-xs text-[#193b2a] font-semibold flex items-center gap-1 hover:underline pt-1 inline-flex"
          >
            Project Governance &rarr;
          </Link>
        </div>

        <div className="bg-white border border-[#dde4d9] rounded-xl p-5 space-y-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#193b2a] flex items-center justify-center">
            <Sliders size={18} />
          </div>
          <h3 className="font-serif text-base text-[#193b2a] font-semibold">
            MRV Threshold Parameters
          </h3>
          <p className="text-xs text-[#708071] leading-relaxed">
            Configure photo geotag bounding box tolerance (15m), Sentinel-2 NDWI soil water thresholds (0.30), and 80% farmer revenue sharing invariants.
          </p>
          <Link
            to={"/admin/settings" as any}
            className="text-xs text-[#193b2a] font-semibold flex items-center gap-1 hover:underline pt-1 inline-flex"
          >
            System Parameters &rarr;
          </Link>
        </div>
      </div>

      {/* Recent System Activity Logs */}
      <div className="bg-white border border-[#dde4d9] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#dde4d9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#193b2a]" />
            <h2 className="font-serif text-base text-[#193b2a] font-semibold">
              Recent Administrative Audit Trail
            </h2>
          </div>
          <Link
            to={"/admin/audit-logs" as any}
            className="text-xs text-[#5c7c46] hover:underline"
          >
            View Full Audit Trail &rarr;
          </Link>
        </div>

        <div className="divide-y divide-[#dde4d9] text-xs">
          <div className="p-4 flex items-center justify-between hover:bg-[#f9faf7]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] bg-[#f4f7f1] text-[#213c2b] px-2 py-0.5 rounded">
                ROLE_SWITCH
              </span>
              <div>
                <span className="font-semibold text-[#193b2a]">
                  Root administrator initialized session
                </span>
                <span className="text-[#708071] block">User: root@panjdhara.com (IP: 103.24.18.90)</span>
              </div>
            </div>
            <span className="font-mono text-[#708071] text-[11px]">2 mins ago</span>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-[#f9faf7]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                PARCEL_VERIFY
              </span>
              <div>
                <span className="font-semibold text-[#193b2a]">
                  Cadastral boundary verified for PB-LUD-042
                </span>
                <span className="text-[#708071] block">Polygon SHA-256: 72c3d105260...</span>
              </div>
            </div>
            <span className="font-mono text-[#708071] text-[11px]">28 mins ago</span>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-[#f9faf7]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded">
                PARTNERSHIP
              </span>
              <div>
                <span className="font-semibold text-[#193b2a]">
                  New industrial partnership registered: Vardhman Textiles
                </span>
                <span className="text-[#708071] block">Ref: TCC-IND-88410 · Assigned to Lead Partner</span>
              </div>
            </div>
            <span className="font-mono text-[#708071] text-[11px]">2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/admin/overview')({
  head: () =>
    pageHead(
      'System Administration | The Carbon Credit OS',
      'Administrative governance, platform security, user directory, and MRV rules management.',
      '/admin/overview'
    ),
  component: AdminOverviewPage,
});
