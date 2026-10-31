import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useTerraLedger } from "@/lib/terra-ledger/store";
import { useAuth } from "@/lib/auth/auth-context";
import { canAccessWorkspaceRoute } from "@/lib/auth/permissions";
import { DemoBanner } from "@/components/terra-ledger/demo-banner";
import {
  LayoutDashboard,
  FolderGit2,
  Users,
  MapPin,
  GitFork,
  CheckSquare,
  FileBadge,
  FileCheck2,
  Satellite,
  Globe2,
  FileSpreadsheet,
  ExternalLink,
  Menu,
  X,
  Shield,
  UserCheck,
  ChevronDown,
} from "lucide-react";
import { WorkspaceRole } from "@/lib/types/workspace";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { field, assessmentStatus, completenessPercent } = useTerraLedger();
  const { currentUser, currentRole, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Get current path from router
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    {
      to: "/workspace/command",
      segment: "command",
      label: "Command Centre",
      icon: LayoutDashboard,
      badge: "Live MRV",
    },
    {
      to: "/workspace/projects",
      segment: "projects",
      label: "Projects Registry",
      icon: FolderGit2,
      badge: "VCS",
    },
    {
      to: "/workspace/farmers",
      segment: "farmers",
      label: "Farmer Registry",
      icon: Users,
      badge: "KYC",
    },
    {
      to: "/workspace/fields",
      segment: "fields",
      label: "Field Parcels",
      icon: MapPin,
      badge: "Cadastral",
    },
    {
      to: "/workspace/evidence",
      segment: "evidence",
      label: "Evidence Explorer",
      icon: GitFork,
      badge: "Graph",
    },
    {
      to: "/workspace/review",
      segment: "review",
      label: "Review Queue",
      icon: CheckSquare,
      badge: "Audits",
    },
    {
      to: "/workspace/assessments",
      segment: "assessments",
      label: "MRV Assessments",
      icon: FileBadge,
      badge: "Scores",
    },
    {
      to: "/workspace/dossier",
      segment: "dossier",
      label: "Project Dossier",
      icon: FileCheck2,
      badge: "Diligence",
    },
    {
      to: "/workspace/satellite",
      segment: "satellite",
      label: "Satellite Intelligence",
      icon: Satellite,
      badge: "S2 10m",
    },
    {
      to: "/workspace/terra-intelligence",
      segment: "terra-intelligence",
      label: "Terra Intelligence",
      icon: Globe2,
      badge: "GIS",
    },
    {
      to: "/workspace/reports",
      segment: "reports",
      label: "Reports & Export",
      icon: FileSpreadsheet,
      badge: "PDF",
    },
  ];

  const roles: { role: WorkspaceRole; label: string }[] = [
    { role: "admin", label: "Administrator (Full Access)" },
    { role: "project_developer", label: "Project Developer (Panjdhara)" },
    { role: "field_officer", label: "Field Officer (Extension)" },
    { role: "reviewer", label: "Reviewer / Auditor (VVB)" },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f0] text-[#213c2b] flex flex-col font-sans">
      {/* Top Demo Banner */}
      <DemoBanner />

      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#102e20] text-white">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl tracking-tight text-[#f5f5e8]">
              TerraLedger<strong className="text-[#d6eaa6] font-normal">AI</strong>
            </span>
            <span className="text-[10px] bg-[#d6eaa6]/20 text-[#d6eaa6] px-1.5 py-0.5 rounded font-mono uppercase">
              {currentRole}
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } md:block w-full md:w-64 bg-[#102e20] text-[#bacabd] p-5 flex flex-col md:fixed md:top-12 md:bottom-0 z-30 overflow-y-auto border-r border-[#1e4834]`}
        >
          {/* Brand */}
          <div className="hidden md:block pb-4 border-b border-[#ffffff15]">
            <Link
              to="/workspace/command"
              className="inline-block group"
              title="TerraLedger AI Workspace"
            >
              <span className="font-serif text-2xl text-[#f5f5e8] flex items-baseline gap-1">
                TerraLedger
                <span className="text-[#d6eaa6] font-sans font-semibold text-lg">AI</span>
              </span>
              <p className="font-mono text-[9px] text-[#809c88] tracking-widest mt-0.5 uppercase">
                Internal Operations Workspace
              </p>
            </Link>
          </div>

          {/* User Profile & Role Switcher */}
          <div className="my-4 p-3 bg-[#173a2b] border border-[#ffffff14] rounded-xl relative">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#809c88] mb-1">
              <span>AUTHENTICATED AS</span>
              <span className="text-[#d6eaa6] uppercase font-semibold">{currentRole}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="truncate pr-2">
                <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-[#bacabd] truncate">{currentUser?.organization}</p>
              </div>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="p-1 text-[#809c88] hover:text-[#d6eaa6] rounded bg-[#ffffff10]"
                title="Switch Operational Role for Testing"
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {roleDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#0c2419] border border-[#2a563f] rounded-lg shadow-xl z-50 p-2 space-y-1">
                <p className="text-[10px] font-mono text-[#809c88] px-2 py-1 uppercase">
                  Switch Role
                </p>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchRole(r.role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                      currentRole === r.role
                        ? "bg-[#d6eaa6] text-[#102e20] font-semibold"
                        : "text-[#bacabd] hover:bg-[#ffffff15]"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="mt-2 flex-1">
            <p className="font-mono text-[10px] tracking-widest text-[#809c88] mb-2 uppercase px-2">
              Operational Modules
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  currentPath === item.to ||
                  (item.to !== "/workspace/command" && currentPath.startsWith(item.to));
                const hasAccess = canAccessWorkspaceRoute(currentUser, item.segment);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#d6eaa6] text-[#173a27] font-semibold shadow-sm"
                        : hasAccess
                          ? "text-[#bacabd] hover:bg-[#ffffff10] hover:text-white"
                          : "text-[#566e5c] opacity-60 hover:opacity-100 hover:bg-[#ffffff08]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        size={15}
                        className={
                          isActive
                            ? "text-[#173a27]"
                            : hasAccess
                              ? "text-[#809c88]"
                              : "text-[#566e5c]"
                        }
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? "bg-[#173a27]/10 text-[#173a27]"
                            : "bg-[#ffffff10] text-[#809c88]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Active Field Mini-Card */}
          <div className="mt-4 bg-[#173a2b] border border-[#ffffff12] rounded-xl p-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#809c88] mb-1">
              <span>PRIMARY PARCEL</span>
              <span className="text-[#d6eaa6]">PUNJAB</span>
            </div>
            <p className="text-xs font-semibold text-white truncate">{field.name}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#bacabd] mt-0.5">
              <MapPin size={11} className="text-[#d6eaa6]" />
              <span>
                {field.district}, {field.areaHa} ha
              </span>
            </div>
            <div className="mt-2 pt-1.5 border-t border-[#ffffff10] flex items-center justify-between text-[10px]">
              <span className="text-[#809c88]">Status:</span>
              <span className="text-[#d6eaa6] font-mono text-[9px]">{assessmentStatus}</span>
            </div>
          </div>

          {/* Bottom links */}
          <div className="mt-auto pt-4 border-t border-[#ffffff12] space-y-1.5">
            <a
              href="/"
              className="flex items-center justify-between text-xs text-[#809c88] hover:text-white px-2 py-1 rounded transition-colors"
            >
              <span>Back to Public Site</span>
              <ExternalLink size={12} />
            </a>
            <div className="text-[10px] text-[#637d6a] px-2 font-mono">
              TerraLedger AI v2.4 · Operations
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 flex flex-col min-w-0">
          {/* Top Operational Header */}
          <header className="h-14 bg-white border-b border-[#dde4d9] px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 md:top-12 z-20 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs text-[#72816f] hidden sm:inline">Active Scope:</span>
              <span className="text-xs font-semibold text-[#213c2b] flex items-center gap-1.5 truncate">
                <Shield size={14} className="text-[#347454] shrink-0" />
                {field.code} · {field.practice}
              </span>
            </div>

            {/* Assessment Status Pill & Role Badge */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#72816f]">
                <UserCheck size={13} className="text-[#347454]" />
                <span className="font-mono text-[11px] font-semibold text-[#213c2b] uppercase">
                  {currentRole.replace(/_/g, " ")}
                </span>
              </div>

              <div className="hidden sm:flex flex-col items-end text-right border-l border-[#dde4d9] pl-3">
                <span className="text-[9px] font-mono text-[#72816f]">EVIDENCE</span>
                <span className="text-xs font-bold text-[#213c2b]">{completenessPercent}%</span>
              </div>

              <div
                className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
                  assessmentStatus === "READY_FOR_VERIFICATION"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : assessmentStatus === "NEEDS_REVIEW"
                      ? "bg-sky-100 text-sky-800 border border-sky-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    assessmentStatus === "READY_FOR_VERIFICATION"
                      ? "bg-emerald-600"
                      : assessmentStatus === "NEEDS_REVIEW"
                        ? "bg-sky-600"
                        : "bg-amber-600"
                  }`}
                />
                {assessmentStatus.replace(/_/g, " ")}
              </div>
            </div>
          </header>

          {/* Viewport content */}
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
