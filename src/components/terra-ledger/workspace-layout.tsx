import { useState, type ReactNode } from 'react';
import { Link, useRouterState, Outlet } from '@tanstack/react-router';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import { useAuth } from '@/lib/auth/auth-context';
import { Permission } from '@/lib/auth/types';
import { TccBrand } from '@/components/shared/tcc-brand';
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
  Sliders,
  Send,
  Users,
} from 'lucide-react';

export function WorkspaceLayout({ children }: { children?: ReactNode }) {
  const {
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

  let currentPath = '';
  try {
    const routerState = useRouterState();
    currentPath = routerState.location.pathname;
  } catch {
    // fallback
  }

  const allNavItems: Array<{
    id: string;
    label: string;
    path: string;
    icon: any;
    badge?: string | null;
    requiredPermission?: Permission;
  }> = [
    { id: 'command', label: 'Command Centre', path: '/workspace/command', icon: LayoutDashboard, badge: 'Live MRV', requiredPermission: 'dashboard.read' },
    { id: 'projects', label: 'Project Registry', path: '/workspace/projects', icon: FolderGit2, badge: 'Registry', requiredPermission: 'projects.read' },
    { id: 'fields', label: 'Field Parcels', path: '/workspace/fields', icon: MapPin, badge: 'Cadastral', requiredPermission: 'fields.read' },
    { id: 'farmers', label: 'Farmer Directory', path: '/workspace/farmers', icon: Users, badge: null, requiredPermission: 'fields.read' },
    { id: 'evidence', label: 'Evidence Explorer', path: '/workspace/evidence', icon: GitFork, badge: 'Graph', requiredPermission: 'evidence.read' },
    { id: 'review', label: 'Review Queue', path: '/workspace/review', icon: ClipboardCheck, badge: 'Triage', requiredPermission: 'evidence.review' },
    { id: 'satellite', label: 'Satellite & EO', path: '/workspace/terra-intelligence', icon: Satellite, badge: 'Sentinel-2', requiredPermission: 'satellite.read' },
    { id: 'assessments', label: 'MRV Assessments', path: '/workspace/assessments', icon: Sliders, badge: 'R1-R5', requiredPermission: 'projects.read' },
    { id: 'dossier', label: 'Project Dossier', path: '/workspace/dossier', icon: FileCheck2, badge: 'Due Diligence', requiredPermission: 'projects.read' },
    { id: 'enquiries', label: 'Buyer Enquiries', path: '/workspace/enquiries', icon: Send, badge: 'Offtake' },
  ];

  const navItems = allNavItems.filter((item) => {
    if (!item.requiredPermission) return true;
    return checkAuthPermission ? checkAuthPermission(item.requiredPermission) : true;
  });

  return (
    <div className="min-h-screen bg-[#F7F8F3] text-[#1B2B23] flex flex-col font-sans">
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0B261C] text-white sticky top-0 z-40 border-b border-[#1E4834]">
          <TccBrand portalBadge="WORKSPACE" badgeVariant="default" theme="dark" size="sm" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#E8EEE5] hover:text-white rounded-md"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 bg-[#0B261C] text-[#BACABD] p-5 flex flex-col md:fixed md:top-0 md:bottom-0 z-30 overflow-y-auto border-r border-[#193B2A]`}
        >
          {/* Brand */}
          <div className="hidden md:block pb-4 border-b border-white/10">
            <TccBrand portalBadge="WORKSPACE" badgeVariant="default" theme="dark" size="md" />
          </div>

          {/* Navigation Items */}
          <nav className="mt-4 space-y-1">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#7E9985] mb-2 px-3">
              MRV Operations
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (currentPath.startsWith(item.path) && item.path !== '/workspace/command');

              return (
                <Link
                  key={item.id}
                  to={item.path as any}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#1E4834] text-[#F7F8F3] font-semibold border-l-2 border-[#D6EAA6]'
                      : 'text-[#BACABD] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className={isActive ? 'text-[#D6EAA6]' : 'text-[#7E9985]'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        isActive
                          ? 'bg-[#D6EAA6] text-[#0B261C] font-semibold'
                          : 'bg-white/10 text-[#BACABD]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Active Field Card & Parcel Switcher */}
          <div className="mt-6 bg-[#123C2B] border border-white/10 rounded-xl p-3 relative">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8EA595] mb-1">
              <span>ACTIVE PARCEL</span>
              <button
                type="button"
                onClick={() => setFieldPickerOpen(!fieldPickerOpen)}
                className="text-[#D6EAA6] hover:underline flex items-center gap-0.5 text-[10px] font-medium"
              >
                <span>Switch</span>
                <ChevronDown size={10} />
              </button>
            </div>
            <p className="text-xs font-semibold text-white truncate">{field.name}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#BACABD] mt-1">
              <MapPin size={11} className="text-[#D6EAA6] shrink-0" />
              <span className="truncate">{field.district}, {field.areaHa} ha ({field.areaAcres} ac)</span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
              <span className="text-[#8EA595]">Practice:</span>
              <span className="text-[#D6EAA6] font-mono truncate max-w-[130px]">
                {field.practice.split('+')[0]?.trim() || field.practice}
              </span>
            </div>

            {/* Field Picker Dropdown */}
            {fieldPickerOpen && (
              <div className="absolute left-0 right-0 bottom-full mb-2 bg-[#0B261C] border border-[#2B503E] rounded-xl shadow-xl p-2 z-40 max-h-48 overflow-y-auto space-y-1">
                <span className="text-[10px] font-mono text-[#8EA595] px-2 block mb-1">Select Field Parcel</span>
                {allFields.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFieldId(f.id);
                      setFieldPickerOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                      f.id === field.id
                        ? 'bg-[#D6EAA6] text-[#0B261C] font-semibold'
                        : 'text-[#BACABD] hover:bg-white/10 hover:text-white'
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
          <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
            {user && (
              <div className="bg-[#123C2B] rounded-lg p-2.5 text-xs border border-white/10 mb-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white truncate max-w-[130px]">{user.name}</span>
                  {user.isDemoUser && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 rounded font-mono">
                      DEMO
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#8EA595] font-mono mt-0.5 capitalize">
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
              className="flex items-center justify-between text-xs text-[#8EA595] hover:text-white px-2 py-1 rounded transition-colors"
            >
              <span>Public Platform</span>
              <ExternalLink size={12} />
            </a>
            <div className="text-[10px] text-[#637D6A] px-2 font-mono flex items-center justify-between">
              <span>TCC OS v3.0</span>
              <span>Audit Ready</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 flex flex-col min-w-0">
          {/* Top Contextual Header */}
          <header className="h-16 bg-white border-b border-[#DDE4D9] px-6 lg:px-10 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs text-[#718078] hidden sm:inline">Assessment Scope:</span>
              <span className="text-xs font-semibold text-[#1B2B23] flex items-center gap-1.5 truncate">
                <Shield size={14} className="text-[#285C45] shrink-0" />
                {field.code} · {field.practice}
              </span>
              <DemoDataBadge isMock={isMockAdapter} className="hidden md:inline-flex" />
            </div>

            {/* Assessment Status Pill & Completeness */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-[10px] font-mono text-[#718078]">EVIDENCE COMPLETENESS</span>
                <span className="text-xs font-bold text-[#1B2B23]">{completenessPercent}%</span>
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
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
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
