import { useState, type ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { AcreonBrand } from '@/components/acreon-brand';
import { DemoBadge } from '@/components/shared/demo-badge';
import { useAuth } from '@/lib/auth-context';
import {
  Store,
  FileQuestion,
  Inbox,
  User,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BuyerLayoutProps {
  children: ReactNode;
}

export function BuyerLayout({ children }: BuyerLayoutProps) {
  const { clearDemoLogin, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { to: '/buyers/marketplace', label: 'Project Marketplace', icon: Store },
    { to: '/buyers/enquiry', label: 'Request Due Diligence', icon: FileQuestion },
    { to: '/buyers/enquiries', label: 'My Enquiries', icon: Inbox },
    { to: '/buyers/profile', label: 'Buyer Profile', icon: User },
  ];

  const handleLogout = () => {
    clearDemoLogin();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#f8faf7] text-[#1c2e24] flex flex-col font-sans">
      {/* Top Buyer Notice Banner */}
      <div className="bg-[#14281d] text-white px-4 py-1.5 flex items-center justify-between text-xs border-b border-[#223d2e]">
        <div className="flex items-center gap-2">
          <DemoBadge label="Institutional Buyer View" size="xs" className="bg-[#244231] text-[#d6eaa6] border-[#365e47]" />
          <span className="text-[11px] text-[#9bb3a4] hidden sm:inline">
            Approved project pipeline · Issued credits: 0 · Preliminary estimates: Not computed
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-[11px] text-[#9bb3a4] hover:text-white flex items-center gap-1">
            <span>Public Site</span>
            <ExternalLink size={10} />
          </Link>
          <button
            onClick={handleLogout}
            className="text-[11px] text-[#d6eaa6] hover:underline flex items-center gap-1"
          >
            <LogOut size={11} />
            <span>Switch Role</span>
          </button>
        </div>
      </div>

      {/* Main Corporate Header */}
      <header className="bg-white border-b border-[#e2e8df] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AcreonBrand />
            <div className="hidden sm:block pl-4 border-l border-[#dce3d7]">
              <span className="text-xs font-semibold text-[#193b2a] flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#245b45]" />
                Institutional Buyer Portal
              </span>
              <span className="text-[10px] text-[#708071]">
                Evidence-backed agricultural project due diligence
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.to || (item.to !== '/buyers/marketplace' && currentPath.startsWith(`${item.to}/`));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#193b2a] text-white shadow-xs'
                      : 'text-[#4a6352] hover:bg-[#edf2e9] hover:text-[#193b2a]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex bg-[#245b45] text-white hover:bg-[#1a4333] text-xs h-8"
            >
              <Link to="/buyers/enquiry" search={{ projectId: undefined }}>
                Request Data Room
              </Link>
            </Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#245b45] hover:bg-[#edf2e8] rounded-md"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#e2e8df] bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.to || currentPath.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-[#193b2a] text-white'
                      : 'text-[#4a6352] hover:bg-[#edf2e9]'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#e2e8df] mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full text-xs text-[#245b45] border-[#dce3d7]"
              >
                <LogOut size={13} className="mr-1.5" /> Sign out / Switch role
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10">
        {children}
      </main>

      {/* Corporate Buyer Footer */}
      <footer className="bg-white border-t border-[#e2e8df] py-6 px-4 text-xs text-[#708071]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#193b2a]">TerraLedger AI</span>
            <span>·</span>
            <span>Panjdhara Private Limited</span>
            <span>·</span>
            <span>Punjab, India</span>
          </div>
          <div className="text-[11px] text-[#839688] text-center md:text-right">
            <span>Evidence-first agricultural climate diligence. No unverified credits issued.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
