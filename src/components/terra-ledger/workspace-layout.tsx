import { useState, type ReactNode } from 'react';
import { Link, useRouterState, Outlet } from '@tanstack/react-router';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import { useAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/types';
import { DemoBanner } from './demo-banner';
import { DemoDataBadge, ErrorState } from './shared/status-states';
import {
  LayoutDashboard,
  Satellite,
  GitFork,
  FileCheck2,
  Store,
  ExternalLink,
  Menu,
  X,
  MapPin,
  Shield,
  Layers,
  FolderGit2,
  ClipboardCheck,
  ChevronDown,
  LogOut,
} from 'lucide-react';

export function WorkspaceLayout({ children }: { children?: ReactNode }) {
  const {
    activeTab,
    setActiveTab,
    field,
    allFields,
    setSelectedFieldId,
    assessmentStatus,
    completenessPercent,
    isMockAdapter,
    error,
    refetchAll,
  } = useTerraLedger();
  const { user, hasPermission: checkAuthPermission, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fieldPickerOpen, setFieldPickerOpen] = useState(false);

  // Safely detect active route path if inside TanStack Router context
  let currentPath = '';
  try {
    const routerState = useRouterState();
    currentPath = routerState.location.pathname;
  } catch {
    // If router state isn't available (e.g. standalone test harness), currentPath remains empty
  }

  const allNavItems: Array<{
    id: string;
    label: string;
    path: string;
    icon: any;
    badge: string;
    requiredPermission?: Permission;
  }> = [
    { id: 'command', label: 'Command Centre', path: '/workspace/command', icon: LayoutDashboard, badge: 'Live MRV', requiredPermission: 'dashboard.read' },
    { id: 'projects', label: 'Project Registry', path: '/workspace/projects', icon: FolderGit2, badge: 'Registry', requiredPermission: 'projects.read' },
    { id: 'fields', label: 'Field Parcels', path: '/workspace/fields', icon: MapPin, badge: 'Cadastral', requiredPermission: 'fields.read' },
    { id: 'evidence', label: 'Evidence Explorer', path: '/workspace/evidence', icon: GitFork, badge: 'Graph', requiredPermission: 'evidence.read' },
    { id: 'review', label: 'Review Queue', path: '/workspace/review', icon: ClipboardCheck, badge: 'Triage', requiredPermission: 'evidence.review' },
    { id: 'satellite', label: 'Terra Intelligence', path: '/workspace/terra-intelligence', icon: Satellite, badge: 'Map & EO', requiredPermission: 'satellite.read' },
    { id: 'dossier', label: 'Project Dossier', path: '/workspace/dossier', icon: FileCheck2, badge: 'Due Diligence', requiredPermission: 'projects.read' },
    { id: 'marketplace', label: 'Project Marketplace', path: '/marketplace', icon: Store, badge: 'Offtake' },
  ];

  const navItems = allNavItems.filter((item) => {
    if (!item.requiredPermission) return true;
    return checkAuthPermission ? checkAuthPermission(item.requiredPermission) : true;
  });

  return (
    <div className="min-h-screen bg-[#f4f6f0] text-[#213c2b] flex flex-col font-sans">
      {/* Top Demo Banner */}
      <DemoBanner />

      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#102e20] text-white">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl tracking-tight text-[#f5f5e8]">
              Virsa<strong className="text-[#d6eaa6] font-normal">Flow</strong>
            </span>
            <span className="text-[10px] bg-[#d6eaa6]/20 text-[#d6eaa6] px-1.5 py-0.5 rounded font-mono">
              PORTAL B
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
          <div className="hidden md:block pb-6 border-b border-[#ffffff15]">
            <a href="/" className="inline-block group" title="Back to VirsaFlow Public Home">
              <span className="font-serif text-2xl text-[#f5f5e8] flex items-baseline gap-1">
                Virsa<span className="text-[#d6eaa6] font-sans font-semibold text-lg">Flow</span>
              </span>
              <p className="font-mono text-[9px] text-[#809c88] tracking-widest mt-1 uppercase">
                Field MRV & Evidence Engine
              </p>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="mt-6">
            <p className="font-mono text-[10px] tracking-widest text-[#809c88] mb-3 uppercase px-3">
              Internal Workspace
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isPathActive = currentPath === item.path || (currentPath.startsWith('/workspace') && currentPath === item.path);
                const isTabActive = activeTab === item.id;
                const isActive = isPathActive || isTabActive;

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#d6eaa6] text-[#173a27] font-semibold shadow-sm'
                        : 'text-[#bacabd] hover:bg-[#ffffff10] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon size={16} className={`shrink-0 ${isActive ? 'text-[#173a27]' : 'text-[#809c88]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
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

          {/* Active Field Selector Card */}
          <div className="mt-8 bg-[#173a2b] border border-[#ffffff12] rounded-xl p-3.5 relative">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#809c88] mb-1.5">
              <span>ACTIVE PARCEL</span>
              <button
                type="button"
                onClick={() => setFieldPickerOpen(!fieldPickerOpen)}
                className="text-[#d6eaa6] hover:underline flex items-center gap-0.5"
                title="Switch active parcel"
              >
                <span>{allFields.length} parcels</span>
                <ChevronDown size={11} />
              </button>
            </div>
            <p className="text-xs font-semibold text-white truncate">{field.name}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#bacabd] mt-1">
              <MapPin size={11} className="text-[#d6eaa6] shrink-0" />
              <span className="truncate">
                {field.district}, {field.areaHa} ha ({field.areaAcres} ac)
              </span>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#ffffff10] flex items-center justify-between text-[10px]">
              <span className="text-[#809c88]">Practice:</span>
              <span className="text-[#d6eaa6] font-mono truncate max-w-[130px]">
                {field.practice.split('+')[0]?.trim() || field.practice}
              </span>
            </div>

            {/* Field Picker Dropdown */}
            {fieldPickerOpen && (
              <div className="absolute left-0 right-0 bottom-full mb-2 bg-[#0c2419] border border-[#2b503e] rounded-xl shadow-xl p-2 z-40 max-h-48 overflow-y-auto space-y-1">
                <span className="text-[10px] font-mono text-[#809c88] px-2 block mb-1">Select Field Parcel</span>
                {allFields.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFieldId(f.id);
                      setFieldPickerOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                      f.id === field.id
                        ? 'bg-[#d6eaa6] text-[#173a27] font-semibold'
                        : 'text-[#bacabd] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="font-mono text-[11px]">{f.code}</div>
                    <div className="text-[10px] opacity-80 truncate">{f.name} · {f.district}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bottom user profile & links */}
          <div className="mt-auto pt-6 border-t border-[#ffffff12] space-y-2">
            {user && (
              <div className="bg-[#0c2419] rounded-lg p-2.5 text-xs border border-[#1e4834] mb-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white truncate max-w-[130px]">{user.name}</span>
                  {user.isDemoUser && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 rounded font-mono">
                      DEMO
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#809c88] font-mono mt-0.5 capitalize">
                  {user.role.replace(/_/g, ' ')}
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="mt-2 text-[10px] text-red-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <LogOut size={11} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
            <a
              href="/"
              className="flex items-center justify-between text-xs text-[#809c88] hover:text-white px-2 py-1.5 rounded transition-colors"
            >
              <span>Back to Public Website</span>
              <ExternalLink size={12} />
            </a>
            <div className="text-[10px] text-[#637d6a] px-2 font-mono flex items-center justify-between">
              <span>Portal B · v2.4</span>
              <span>Audit Ready</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-[#dde4d9] px-6 lg:px-10 flex items-center justify-between gap-4 sticky top-0 md:top-12 z-20 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs text-[#72816f] hidden sm:inline">Scope:</span>
              <span className="text-xs font-semibold text-[#213c2b] flex items-center gap-1.5 truncate">
                <Shield size={14} className="text-[#347454] shrink-0" />
                {field.code} · {field.practice}
              </span>
              <DemoDataBadge isMock={isMockAdapter} className="hidden md:inline-flex" />
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

          {/* Screen Content Viewport: Render error state if API error exists, or child component / TanStack Router Outlet */}
          <div className="p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
            {error ? (
              <ErrorState
                title="MRV API Synchronization Error"
                message="A live backend error occurred while retrieving verification records. The application will not silently fall back to mock data."
                error={error}
                onRetry={refetchAll}
              />
            ) : (
              children ?? <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
