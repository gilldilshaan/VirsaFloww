import { useState, type ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { DemoBanner } from '@/components/terra-ledger/demo-banner';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Users,
  Shield,
  UserCheck,
  Briefcase,
  Building2,
  FolderKanban,
  FileText,
  Sliders,
  Factory,
  Menu,
  X,
  LogOut,
  ExternalLink,
  Lock,
  ChevronRight,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { clearDemoLogin, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { to: '/admin/overview', label: 'System Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/admin/roles', label: 'Role Permissions', icon: Shield },
    { to: '/admin/farmers', label: 'Farmer Accounts', icon: UserCheck },
    { to: '/admin/staff', label: 'Operating Staff', icon: Briefcase },
    { to: '/admin/buyers', label: 'Institutional Buyers', icon: Building2 },
    { to: '/admin/projects', label: 'Project Approvals', icon: FolderKanban },
    { to: '/admin/audit-logs', label: 'Audit Trail Logs', icon: FileText },
    { to: '/admin/settings', label: 'MRV Parameters', icon: Sliders },
    { to: '/admin/partnerships', label: 'Industrial MoUs', icon: Factory },
  ];

  const handleLogout = () => {
    clearDemoLogin();
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-[#f4f6f0] text-[#193b2a] flex flex-col font-sans">
      {/* Top Demo Banner */}
      <DemoBanner />

      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0d2218] text-white">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl tracking-tight text-[#f5f5e8]">
              The Carbon Credit<strong className="text-[#d6eaa6] font-normal"> OS</strong>
            </span>
            <span className="text-[10px] bg-red-900/60 text-red-200 border border-red-700/50 px-1.5 py-0.5 rounded font-mono">
              ADMIN
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
          } md:block w-full md:w-64 bg-[#0d2218] text-[#bacabd] p-6 flex flex-col md:fixed md:top-12 md:bottom-0 z-30 overflow-y-auto border-r border-[#193b2a]`}
        >
          {/* Brand header */}
          <div className="hidden md:block pb-4 border-b border-[#ffffff15]">
            <Link to={"/admin/overview" as any} className="inline-block group" title="Admin Overview">
              <span className="font-serif text-2xl text-[#f5f5e8] flex items-baseline gap-1">
                The Carbon Credit<span className="text-[#d6eaa6] font-sans font-semibold text-lg">OS</span>
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-mono uppercase bg-red-950 text-red-300 border border-red-800/60 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                  <Lock size={10} />
                  ADMINISTRATION
                </span>
                <span className="text-[10px] text-[#819b88]">Panjdhara Pvt Ltd</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="py-4 flex-1">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#637d6a] mb-2 px-3">
              Governance & Access
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.to || currentPath.startsWith(`${item.to}/`);

                return (
                  <Link
                    key={item.to}
                    to={item.to as any}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1b4330] text-[#f5f5e8] border-l-2 border-[#d6eaa6]'
                        : 'text-[#9eb1a4] hover:bg-[#133022] hover:text-[#f5f5e8]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isActive ? 'text-[#d6eaa6]' : 'text-[#7e9985]'} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Portals Links */}
            <div className="mt-6 pt-4 border-t border-[#ffffff15]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#637d6a] mb-2 px-3">
                Cross-Portal Switch
              </div>
              <div className="space-y-1">
                <Link
                  to={"/workspace/command" as any}
                  className="flex items-center justify-between px-3 py-1.5 rounded text-xs text-[#9eb1a4] hover:bg-[#133022] hover:text-white"
                >
                  <span>Company Workspace</span>
                  <ExternalLink size={12} className="text-[#637d6a]" />
                </Link>
                <Link
                  to={"/farmer/dashboard" as any}
                  className="flex items-center justify-between px-3 py-1.5 rounded text-xs text-[#9eb1a4] hover:bg-[#133022] hover:text-white"
                >
                  <span>Farmer Portal</span>
                  <ExternalLink size={12} className="text-[#637d6a]" />
                </Link>
                <Link
                  to={"/buyers/marketplace" as any}
                  className="flex items-center justify-between px-3 py-1.5 rounded text-xs text-[#9eb1a4] hover:bg-[#133022] hover:text-white"
                >
                  <span>Buyer Marketplace</span>
                  <ExternalLink size={12} className="text-[#637d6a]" />
                </Link>
              </div>
            </div>
          </div>

          {/* User Footnote */}
          <div className="pt-4 border-t border-[#ffffff15] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-red-950 border border-red-800 text-red-300 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-[#f5f5e8]">System Admin</div>
                <div className="text-[10px] text-[#7e9985]">root@panjdhara.com</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#9eb1a4] hover:text-red-400 hover:bg-[#133022] rounded transition-colors"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-48px)]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
