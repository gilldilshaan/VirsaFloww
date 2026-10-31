import { useState, type ReactNode } from 'react';
import { Link, useRouterState, Outlet } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth/auth-context';
import { DemoDataBadge } from '@/components/terra-ledger/shared/status-states';
import {
  Sprout,
  MapPin,
  Calendar,
  Camera,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  Home,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FarmerLayout({ children }: { children?: ReactNode }) {
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
    { label: 'Home', path: '/farmer/home', icon: Home },
    { label: 'My Fields', path: '/farmer/fields', icon: MapPin },
    { label: 'Crop Season', path: '/farmer/season', icon: Calendar },
    { label: 'Evidence', path: '/farmer/evidence', icon: Camera },
    { label: 'Notifications', path: '/farmer/notifications', icon: Bell },
    { label: 'My Profile', path: '/farmer/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9f5] text-[#1c3926] flex flex-col font-sans pb-16 md:pb-0">
      {/* Top Banner for Farmer Portal */}
      <header className="bg-[#173a27] text-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/farmer/home" className="flex items-center gap-2">
              <span className="font-serif text-xl tracking-tight text-[#f5f5e8]">
                Virsa<strong className="text-[#d6eaa6] font-normal">Flow</strong>
              </span>
              <span className="text-[10px] bg-[#d6eaa6]/20 text-[#d6eaa6] px-1.5 py-0.5 rounded font-mono">
                FARMER
              </span>
            </Link>
            <DemoDataBadge isMock={true} sourceLabel="Punjab Farmer Mode" className="hidden sm:inline-flex" />
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] block text-[#a7c5b1]">
                Sat Sri Akal, <strong className="text-white">{user?.name || 'ਗੁਰਦੇਵ ਸਿੰਘ'}</strong>
                {user?.isDemoUser && (
                  <span className="ml-1 text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded font-mono">
                    DEMO
                  </span>
                )}
              </span>
              <span className="text-[10px] text-[#809c88] font-mono">
                {user?.farmerId ? `Parcel ${user.farmerId}` : 'Malwa FPO'}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              title="Sign Out"
              className="text-[#d6eaa6] hover:text-white hover:bg-white/10 text-xs px-2 h-8"
            >
              <LogOut size={14} className="sm:mr-1" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#bacabd] hover:text-white"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Desktop Nav Bar */}
        <nav className="hidden md:flex border-t border-white/10 bg-[#122e1f]">
          <div className="max-w-6xl mx-auto px-4 w-full flex items-center gap-1 py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (currentPath.startsWith(item.path) && item.path !== '/farmer/home');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-[#d6eaa6] text-[#173a27] font-semibold'
                      : 'text-[#c2d4c6] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#122e1f] px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-colors ${
                    isActive
                      ? 'bg-[#d6eaa6] text-[#173a27] font-semibold'
                      : 'text-[#c2d4c6] hover:bg-white/10 hover:text-white'
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

      {/* Main Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children ?? <Outlet />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#d8e1d4] h-14 flex items-center justify-around px-2 z-40 shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] ${
                isActive ? 'text-[#173a27] font-bold' : 'text-[#708071]'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-[#245b45]' : 'text-[#708071]'} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
