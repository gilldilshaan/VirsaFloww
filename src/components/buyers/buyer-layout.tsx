import { useState, type ReactNode } from 'react';
import { Link, useRouterState, Outlet } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth/auth-context';
import { DemoDataBadge } from '@/components/terra-ledger/shared/status-states';
import {
  Building2,
  Store,
  FileCheck2,
  Send,
  User,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BuyerLayout({ children }: { children?: ReactNode }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  let currentPath = '';
  try {
    const routerState = useRouterState();
    currentPath = routerState.location.pathname;
  } catch {
    // fallback
  }

  const navItems = [
    { label: 'Marketplace Directory', path: '/buyers/marketplace', icon: Store },
    { label: 'Offtake Enquiries', path: '/buyers/enquiries', icon: Send },
    { label: 'Submit Inquiry', path: '/buyers/enquiry', icon: FileCheck2 },
    { label: 'Corporate Profile', path: '/buyers/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf7] text-[#1a2f23] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/buyers/marketplace" className="flex items-center gap-2">
              <span className="font-serif text-2xl tracking-tight text-white">
                Virsa<strong className="text-emerald-400 font-normal">Flow</strong>
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                BUYER OFFTAKE
              </span>
            </Link>
            <DemoDataBadge isMock={true} sourceLabel="Institutional Due Diligence" className="hidden lg:inline-flex" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (currentPath.startsWith(item.path) && item.path !== '/buyers/marketplace');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User badge and logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-slate-100 flex items-center justify-end gap-1.5">
                {user?.name || 'Marcus Vance'}
                {user?.isDemoUser && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded font-mono">
                    DEMO
                  </span>
                )}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                {user?.buyerOrgId || 'Aura Climate Asset Management'}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-xs border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-8"
            >
              <LogOut size={13} className="mr-1.5" />
              Sign Out
            </Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Security Privacy Notice */}
      <div className="bg-emerald-950 text-emerald-200 border-b border-emerald-900/60 px-6 py-2 text-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
          <span>
            Institutional Due Diligence Mode: Data shown reflects approved, published MRV cluster statistics. Farmer PII is strictly protected.
          </span>
        </div>
        <Link to="/marketplace" className="text-[11px] underline text-emerald-300 hover:text-white">
          Public Marketplace Directory →
        </Link>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10 space-y-8">
        {children ?? <Outlet />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#dfe6d9] bg-white py-6 text-center text-xs text-[#72816f]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VirsaFlow Institutional Offtake Engine · Panjdhara</span>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/terms" className="hover:underline">Data Room Terms</Link>
            <Link to="/privacy" className="hover:underline">Information Governance</Link>
            <a href="/" className="hover:underline flex items-center gap-1">
              Public Portal <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
