import { useState, type ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { TerraLedgerProvider, useTerraLedger } from '@/lib/terra-ledger/store';
import { DemoBanner } from '@/components/terra-ledger/demo-banner';
import { useAuth } from '@/lib/auth-context';
import { ROLE_LABELS } from '@/lib/auth/roles';
import {
  LayoutDashboard,
  Satellite,
  GitFork,
  FileCheck2,
  FolderKanban,
  MapPin,
  Users,
  CheckSquare,
  ShieldAlert,
  Compass,
  Menu,
  X,
  Shield,
  ExternalLink,
  LogOut,
} from 'lucide-react';

interface WorkspaceLayoutShellProps {
  children: ReactNode;
}

function WorkspaceInternalLayout({ children }: { children: ReactNode }) {
  const { field, assessmentStatus, completenessPercent } = useTerraLedger();
  const { logout, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { to: '/workspace/command', label: 'Command Centre', icon: LayoutDashboard, badge: 'Live MRV' },
    { to: '/workspace/terra-intelligence', label: 'Terra Intelligence', icon: Compass, badge: 'S2 10m' },
    { to: '/workspace/satellite', label: 'Satellite Observations', icon: Satellite, badge: 'Scenes' },
    { to: '/workspace/evidence', label: 'Evidence Explorer', icon: GitFork, badge: 'Graph' },
    { to: '/workspace/projects', label: 'Project Registry', icon: FolderKanban, badge: null },
    { to: '/workspace/fields', label: 'Field Registry', icon: MapPin, badge: null },
    { to: '/workspace/farmers', label: 'Farmer Registry', icon: Users, badge: null },
    { to: '/workspace/review', label: 'Review Queue', icon: CheckSquare, badge: 'Queue' },
    { to: '/workspace/assessments', label: 'MRV Assessments', icon: ShieldAlert, badge: 'Rules' },
    { to: '/workspace/dossier', label: 'Internal Dossier', icon: FileCheck2, badge: 'Due Diligence' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const roleLabel = role ? (ROLE_LABELS[role] ?? role) : 'Internal User';

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
            <span className="text-[10px] bg-[#d6eaa6]/20 text-[#d6eaa6] px-1.5 py-0.5 rounded font-mono">
              WORKSPACE
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
            mobileMenuOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 bg-[#102e20] text-[#bacabd] p-6 flex flex-col md:fixed md:top-12 md:bottom-0 z-30 overflow-y-auto border-r border-[#1e4834]`}
        >
          {/* Brand */}
          <div className="hidden md:block pb-4 border-b border-[#ffffff15]">
            <Link to="/workspace/command" className="inline-block group" title="Workspace Home">
              <span className="font-serif text-2xl text-[#f5f5e8] flex items-baseline gap-1">
                TerraLedger<span className="text-[#d6eaa6] font-sans font-semibold text-lg">AI</span>
              </span>
              <p className="font-mono text-[9px] text-[#809c88] tracking-widest mt-1 uppercase">
                Field MRV & Evidence Engine
              </p>
            </Link>
            <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 bg-[#173a2b] rounded-md border border-[#ffffff10]">
              <span className="text-[10px] font-mono text-[#809c88] uppercase">Role:</span>
              <span className="text-[11px] font-semibold text-[#d6eaa6]">{roleLabel}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-5">
            <p className="font-mono text-[10px] tracking-widest text-[#809c88] mb-2 uppercase px-3">
              Workspace Modules
            </p>
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.to || (item.to !== '/workspace/command' && currentPath.startsWith(`${item.to}/`));
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#d6eaa6] text-[#173a27] font-semibold shadow-sm'
                        : 'text-[#bacabd] hover:bg-[#ffffff10] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isActive ? 'text-[#173a27]' : 'text-[#809c88]'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-[#173a27]/10 text-[#173a27]'
                            : 'bg-[#ffffff10] text-[#809c88]'
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

          {/* Active Field Card */}
          <div className="mt-6 bg-[#173a2b] border border-[#ffffff12] rounded-xl p-3.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#809c88] mb-1.5">
              <span>ACTIVE PARCEL</span>
              <span className="text-[#d6eaa6]">PUNJAB</span>
            </div>
            <p className="text-xs font-semibold text-white truncate">{field.name}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#bacabd] mt-1">
              <MapPin size={11} className="text-[#d6eaa6]" />
              <span>{field.district}, {field.areaHa} ha ({field.areaAcres} ac)</span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#ffffff10] flex items-center justify-between text-[10px]">
              <span className="text-[#809c88]">Practice:</span>
              <span className="text-[#d6eaa6] font-mono">DSR + AWD</span>
            </div>
          </div>

          {/* Bottom links */}
          <div className="mt-auto pt-6 border-t border-[#ffffff12] space-y-2">
            <Link
              to="/buyers/marketplace"
              className="flex items-center justify-between text-xs text-[#809c88] hover:text-white px-2 py-1.5 rounded transition-colors"
            >
              <span>View Buyer Portal</span>
              <ExternalLink size={12} />
            </Link>
            <Link
              to="/"
              className="flex items-center justify-between text-xs text-[#809c88] hover:text-white px-2 py-1.5 rounded transition-colors"
            >
              <span>Public Website</span>
              <ExternalLink size={12} />
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between text-xs text-[#d6eaa6] hover:text-white px-2 py-1.5 rounded transition-colors text-left"
            >
              <span>Switch User Role</span>
              <LogOut size={12} />
            </button>
            <div className="text-[10px] text-[#637d6a] px-2 font-mono">
              TerraLedger AI v2.4 · Panjdhara
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-[#dde4d9] px-6 lg:px-10 flex items-center justify-between gap-4 sticky top-0 md:top-12 z-20 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs text-[#72816f] hidden sm:inline">Assessment Scope:</span>
              <span className="text-xs font-semibold text-[#213c2b] flex items-center gap-1.5 truncate">
                <Shield size={14} className="text-[#347454] shrink-0" />
                {field.code} · {field.practice}
              </span>
            </div>

            {/* Assessment Status Pill & Completeness */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-[10px] font-mono text-[#72816f]">COMPLETENESS</span>
                <span className="text-xs font-bold text-[#213c2b]">{completenessPercent}%</span>
              </div>

              <div
                className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
                  assessmentStatus === 'READY_FOR_VERIFICATION'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : assessmentStatus === 'NEEDS_REVIEW'
                    ? 'bg-sky-100 text-sky-800 border border-sky-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    assessmentStatus === 'READY_FOR_VERIFICATION'
                      ? 'bg-emerald-600'
                      : assessmentStatus === 'NEEDS_REVIEW'
                      ? 'bg-sky-600'
                      : 'bg-amber-600'
                  }`}
                />
                {assessmentStatus.replace(/_/g, ' ')}
              </div>
            </div>
          </header>

          {/* Screen Content Viewport */}
          <div className="p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function WorkspaceLayoutShell({ children }: WorkspaceLayoutShellProps) {
  return (
    <TerraLedgerProvider>
      <WorkspaceInternalLayout>
        {children}
      </WorkspaceInternalLayout>
    </TerraLedgerProvider>
  );
}
