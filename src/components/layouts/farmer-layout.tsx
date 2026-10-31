import { useState, type ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { AcreonBrand } from '@/components/acreon-brand';
import { DemoBadge } from '@/components/shared/demo-badge';
import { useAuth } from '@/lib/auth-context';
import {
  Home,
  MapPin,
  Calendar,
  Upload,
  Bell,
  User,
  PlusCircle,
  Clock,
  Menu,
  X,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FarmerLayoutProps {
  children: ReactNode;
}

export function FarmerLayout({ children }: FarmerLayoutProps) {
const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { to: '/farmer/home', label: 'Home', labelPa: 'ਮੁੱਖ ਪੰਨਾ', icon: Home },
    { to: '/farmer/fields', label: 'My Fields', labelPa: 'ਮੇਰੇ ਖੇਤ', icon: MapPin },
    { to: '/farmer/register-field', label: 'Register Field', labelPa: 'ਖੇਤ ਸ਼ਾਮਲ ਕਰੋ', icon: PlusCircle },
    { to: '/farmer/season', label: 'Seasons & Activities', labelPa: 'ਸੀਜ਼ਨ ਤੇ ਗਤੀਵਿਧੀਆਂ', icon: Calendar },
    { to: '/farmer/evidence', label: 'Upload Evidence', labelPa: 'ਸਬੂਤ ਅਪਲੋਡ ਕਰੋ', icon: Upload },
    { to: '/farmer/evidence/history', label: 'History', labelPa: 'ਇਤਿਹਾਸ', icon: Clock },
    { to: '/farmer/notifications', label: 'Alerts', labelPa: 'ਸੂਚਨਾਵਾਂ', icon: Bell },
    { to: '/farmer/profile', label: 'Profile', labelPa: 'ਪ੍ਰੋਫਾਈਲ', icon: User },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#f7f9f5] text-[#193b2a] flex flex-col font-sans">
      {/* Top Bar with Demo Badge */}
      <div className="bg-[#1b4332] text-white px-4 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <DemoBadge label="Demo Farmer Mode" size="xs" className="bg-[#2d5a45] text-[#d6eaa6] border-[#407a5d]" />
          <span className="text-[11px] text-[#a3c9a8] hidden sm:inline">
            Demonstration environment · Kharif 2026 DSR Program
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-[11px] text-[#a3c9a8] hover:text-white flex items-center gap-1">
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

      {/* Main Farmer Header */}
      <header className="bg-white border-b border-[#e1e8dc] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AcreonBrand />
            <div className="hidden sm:block pl-3 border-l border-[#dce3d7]">
              <span className="text-xs font-semibold text-[#193b2a] block">ਕਿਸਾਨ ਪੋਰਟਲ · Farmer Portal</span>
              <span className="text-[10px] text-[#708071]">Direct Seeded Rice (DSR) Field Evidence</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.to || currentPath.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#245b45] text-white'
                      : 'text-[#415d43] hover:bg-[#edf2e8] hover:text-[#193b2a]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#245b45] hover:bg-[#edf2e8] rounded-md"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#e1e8dc] bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.to || currentPath.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-[#245b45] text-white'
                      : 'text-[#415d43] hover:bg-[#edf2e8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-xs opacity-70 font-pa">{item.labelPa}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#e1e8dc] mt-2">
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
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Mobile Bottom Quick Navigation */}
      <nav className="lg:hidden sticky bottom-0 bg-white border-t border-[#e1e8dc] px-2 py-1.5 flex items-center justify-around z-30 shadow-lg">
        <Link
          to="/farmer/home"
          className={`flex flex-col items-center py-1 px-2 rounded text-[10px] ${
            currentPath === '/farmer/home' ? 'text-[#245b45] font-semibold' : 'text-[#708071]'
          }`}
        >
          <Home size={18} />
          <span>Home</span>
        </Link>
        <Link
          to="/farmer/fields"
          className={`flex flex-col items-center py-1 px-2 rounded text-[10px] ${
            currentPath.startsWith('/farmer/fields') ? 'text-[#245b45] font-semibold' : 'text-[#708071]'
          }`}
        >
          <MapPin size={18} />
          <span>Fields</span>
        </Link>
        <Link
          to="/farmer/evidence"
          className={`flex flex-col items-center py-1 px-2 rounded text-[10px] ${
            currentPath === '/farmer/evidence' ? 'text-[#245b45] font-semibold' : 'text-[#708071]'
          }`}
        >
          <Upload size={18} />
          <span>Upload</span>
        </Link>
        <Link
          to="/farmer/notifications"
          className={`flex flex-col items-center py-1 px-2 rounded text-[10px] ${
            currentPath === '/farmer/notifications' ? 'text-[#245b45] font-semibold' : 'text-[#708071]'
          }`}
        >
          <Bell size={18} />
          <span>Alerts</span>
        </Link>
        <Link
          to="/farmer/profile"
          className={`flex flex-col items-center py-1 px-2 rounded text-[10px] ${
            currentPath === '/farmer/profile' ? 'text-[#245b45] font-semibold' : 'text-[#708071]'
          }`}
        >
          <User size={18} />
          <span>Profile</span>
        </Link>
      </nav>

      {/* Minimal Farmer Footer */}
      <footer className="bg-white border-t border-[#e1e8dc] py-4 px-4 text-center text-xs text-[#708071]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>The Carbon Credit · Panjdhara Private Limited</span>
          <span className="font-mono text-[11px]">ਕਿਸਾਨ ਸਹਾਇਤਾ ਹੈਲਪਲਾਈਨ: contact@thecarboncredit.in</span>
        </div>
      </footer>
    </div>
  );
}
