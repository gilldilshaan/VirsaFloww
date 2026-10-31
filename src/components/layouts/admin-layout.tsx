import { useState, type ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth/auth-context';
import { TccBrand } from '@/components/shared/tcc-brand';
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
  ShieldCheck,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { to: '/admin/overview', label: 'Command Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/admin/roles', label: 'Role Permissions', icon: Shield },
    { to: '/admin/farmers', label: 'Farmer Accounts', icon: UserCheck },
    { to: '/admin/staff', label: 'Operating Staff', icon: Briefcase },
    { to: '/admin/buyers', label: 'Institutional Buyers', icon: Building2 },
    { to: '/admin/projects', label: 'Project Approvals', icon: FolderKanban },
    { to: '/admin/audit-logs', label: 'Cryptographic Audit Trail', icon: FileText },
    { to: '/admin/settings', label: 'MRV Parameters', icon: Sliders },
    { to: '/admin/partnerships', label: 'Industrial MoUs', icon: Factory },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#F7F8F3] text-[#1B2B23] flex flex-col font-sans">
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0B261C] text-white sticky top-0 z-40 border-b border-[#1E4834]">
          <TccBrand portalBadge="ADMIN" badgeVariant="admin" theme="dark" size="sm" />
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
          {/* Brand header */}
          <div className="hidden md:block pb-4 border-b border-white/10">
            <TccBrand portalBadge="ADMIN" badgeVariant="admin" theme="dark" size="md" />
          </div>

          {/* Navigation Links */}
          <div className="py-4 flex-1">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#7E9985] mb-2 px-3">
              Governance & Operations
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
                        ? 'bg-[#1E4834] text-[#F7F8F3] font-semibold border-l-2 border-[#D6EAA6]'
                        : 'text-[#BACABD] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isActive ? 'text-[#D6EAA6]' : 'text-[#7E9985]'} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Cross-Portal Switch */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#7E9985] mb-2 px-3">
                Connected Portals
              </div>
              <div className="space-y-1">
                <Link
                  to={"/workspace/command" as any}
                  className="flex items-center justify-between px-3 py-1.5 rounded text-xs text-[#BACABD] hover:bg-white/5 hover:text-white"
                >
                  <span>Company Workspace</span>
                  <ExternalLink size={12} className="text-[#7E9985]" />
                </Link>
                <Link
                  to={"/farmer/dashboard" as any}
                  className="flex items-center justify-between px-3 py-1.5 rounded text-xs text-[#BACABD] hover:bg-white/5 hover:text-white"
                >
                  <span>Farmer Portal</span>
                  <ExternalLink size={12} className="text-[#7E9985]" />
                </Link>
                <Link
                  to={"/buyers/marketplace" as any}
                  className="flex items-center justify-between px-3 py-1.5 rounded text-xs text-[#BACABD] hover:bg-white/5 hover:text-white"
                >
                  <span>Buyer Marketplace</span>
                  <ExternalLink size={12} className="text-[#7E9985]" />
                </Link>
              </div>
            </div>
          </div>

          {/* User Footnote */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-700/60 text-red-200 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left truncate">
                <div className="text-xs font-semibold text-[#F7F8F3] truncate">
                  {user?.name || 'Platform Administrator'}
                </div>
                <div className="text-[10px] text-[#7E9985] truncate font-mono">
                  {user?.email || 'admin@thecarboncredit.in'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#BACABD] hover:text-red-300 hover:bg-white/10 rounded-md transition-colors shrink-0 ml-2"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
