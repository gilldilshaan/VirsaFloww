import { useState, type ReactNode } from 'react';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import { DemoBanner } from './demo-banner';
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
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WorkspaceLayout({ children }: { children: ReactNode }) {
  const { activeTab, setActiveTab, field, assessmentStatus, completenessPercent } = useTerraLedger();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'command', label: 'Command Centre', icon: LayoutDashboard, badge: 'Live MRV' },
    { id: 'satellite', label: 'Satellite Intelligence', icon: Satellite, badge: 'S2 10m' },
    { id: 'evidence', label: 'Evidence Explorer', icon: GitFork, badge: 'Graph' },
    { id: 'dossier', label: 'Buyer View / Dossier', icon: FileCheck2, badge: 'Due Diligence' },
    { id: 'marketplace', label: 'Project Marketplace', icon: Store, badge: 'Projects' },
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
            <span className="text-[10px] bg-[#d6eaa6]/20 text-[#d6eaa6] px-1.5 py-0.5 rounded font-mono">WORKSPACE</span>
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
            <a href="/" className="inline-block group" title="Back to The Carbon Credit Public Home">
              <span className="font-serif text-2xl text-[#f5f5e8] flex items-baseline gap-1">
                TerraLedger<span className="text-[#d6eaa6] font-sans font-semibold text-lg">AI</span>
              </span>
              <p className="font-mono text-[9px] text-[#809c88] tracking-widest mt-1 uppercase">
                Field MRV & Evidence Engine
              </p>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="mt-6">
            <p className="font-mono text-[10px] tracking-widest text-[#809c88] mb-3 uppercase px-3">
              Application Modules
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
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
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-[#173a27]' : 'text-[#809c88]'} />
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
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Active Field Card */}
          <div className="mt-8 bg-[#173a2b] border border-[#ffffff12] rounded-xl p-3.5">
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
            <a
              href="/"
              className="flex items-center justify-between text-xs text-[#809c88] hover:text-white px-2 py-1.5 rounded transition-colors"
            >
              <span>Back to Public Website</span>
              <ExternalLink size={12} />
            </a>
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
