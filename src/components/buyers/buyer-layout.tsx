import { useState, type ReactNode } from 'react';
import { Link, useRouterState, Outlet } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth/auth-context';
import { TccBrand } from '@/components/shared/tcc-brand';
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
  Lock,
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
    { label: 'Project Marketplace', path: '/buyers/marketplace', icon: Store },
    { label: 'Due Diligence Enquiries', path: '/buyers/enquiries', icon: Send },
    { label: 'Request Data Room', path: '/buyers/enquiry', icon: FileCheck2 },
    { label: 'Corporate Profile', path: '/buyers/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#F7F8F3] text-[#1B2B23] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-[#0B261C] text-white border-b border-[#1E4834] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TccBrand portalBadge="BUYER OFFTAKE" badgeVariant="buyer" theme="dark" size="sm" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (currentPath.startsWith(item.path) && item.path !== '/buyers/marketplace');
              return (
                <Link
                  key={item.path}
                  to={item.path as any}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'bg-[#1E4834] text-[#D6EAA6] font-semibold border border-[#366C50]'
                      : 'text-[#BACABD] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-[#D6EAA6]' : 'text-[#7E9985]'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User badge and logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-white flex items-center justify-end gap-1.5">
                {user?.name || 'Institutional Buyer'}
                {user?.isDemoUser && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded font-mono">
                    DEMO
                  </span>
                )}
              </span>
              <span className="text-[10px] text-[#7E9985] font-mono block">
                {user?.buyerOrgId || 'Aura Climate Asset Management'}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs border-[#285C45] text-[#D6EAA6] hover:bg-[#1E4834] hover:text-white h-8"
            >
              <LogOut size={13} className="mr-1.5" />
              Sign Out
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#BACABD] hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1E4834] bg-[#0B261C] px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.path}
                  to={item.path as any}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive ? 'bg-[#1E4834] text-[#D6EAA6]' : 'text-[#BACABD] hover:bg-white/5'
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children ?? <Outlet />}
      </main>

      {/* Corporate Buyer Footer */}
      <footer className="bg-white border-t border-[#DDE4D9] py-6 px-4 text-xs text-[#718078]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-semibold text-[#123C2B]">VirsaFlow</span>
            <span>·</span>
            <span>Panjdhara Private Limited</span>
            <span>·</span>
            <span>Punjab, India</span>
          </div>
          <div className="text-[11px] text-[#718078] text-center md:text-right">
            <span>Evidence-first agricultural carbon due diligence. No unverified credits issued.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
