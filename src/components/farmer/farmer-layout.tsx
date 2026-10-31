import { useState, type ReactNode } from 'react';
import { Link, useRouterState, Outlet } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth/auth-context';
import { TccBrand } from '@/components/shared/tcc-brand';
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
  Clock,
  PlusCircle,
  Globe,
  FileCheck2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FarmerLayout({ children }: { children?: ReactNode }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'pa' | 'en' | 'hi'>('pa');

  let currentPath = '';
  try {
    const routerState = useRouterState();
    currentPath = routerState.location.pathname;
  } catch {
    // fallback
  }

  const translations = {
    pa: {
      home: 'ਮੁੱਖ ਪੰਨਾ',
      activities: 'ਗਤੀਵਿਧੀਆਂ',
      evidence: 'ਸਬੂਤ ਅਪਲੋਡ',
      registerField: 'ਖੇਤ ਸ਼ਾਮਲ ਕਰੋ',
      history: 'ਇਤਿਹਾਸ',
      notifications: 'ਸੂਚਨਾਵਾਂ',
      profile: 'ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ',
      signOut: 'ਬਾਹਰ ਜਾਓ',
      greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ',
    },
    en: {
      home: 'My Farm',
      activities: 'Activities Log',
      evidence: 'Upload Evidence',
      registerField: 'Register Parcel',
      history: 'History Trail',
      notifications: 'Alerts',
      profile: 'Farmer Profile',
      signOut: 'Sign Out',
      greeting: 'Welcome',
    },
    hi: {
      home: 'मुख्य पृष्ठ',
      activities: 'कृषि गतिविधियाँ',
      evidence: 'प्रमाण अपलोड',
      registerField: 'खेत जोड़ें',
      history: 'इतिहास',
      notifications: 'सूचनाएं',
      profile: 'मेरी प्रोफाइल',
      signOut: 'साइन आउट',
      greeting: 'नमस्ते',
    },
  };

  const t = translations[currentLang];

  const navItems = [
    { label: t.home, path: '/farmer/dashboard', icon: Home },
    { label: t.activities, path: '/farmer/activities', icon: Calendar },
    { label: t.evidence, path: '/farmer/evidence', icon: Camera },
    { label: t.registerField, path: '/farmer/register-field', icon: PlusCircle },
    { label: t.history, path: '/farmer/history', icon: Clock },
    { label: t.notifications, path: '/farmer/notifications', icon: Bell },
    { label: t.profile, path: '/farmer/profile', icon: User },
  ];

  const bottomNavItems = [
    { label: t.home, path: '/farmer/dashboard', icon: Home },
    { label: t.activities, path: '/farmer/activities', icon: Calendar },
    { label: t.evidence, path: '/farmer/evidence', icon: Camera },
    { label: t.history, path: '/farmer/history', icon: Clock },
    { label: t.profile, path: '/farmer/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8F3] text-[#1B2B23] flex flex-col font-sans pb-20 md:pb-0">
      {/* Top Bar for Farmer Portal */}
      <header className="bg-[#123C2B] text-white sticky top-0 z-30 shadow-sm border-b border-[#1E4834]">
        <div className="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TccBrand portalBadge="ਕਿਸਾਨ · FARMER" badgeVariant="farmer" theme="dark" size="sm" />
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="inline-flex rounded-lg bg-[#0B261C] border border-[#285C45] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setCurrentLang('pa')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  currentLang === 'pa'
                    ? 'bg-[#D6EAA6] text-[#0B261C] font-semibold'
                    : 'text-[#BACABD] hover:text-white'
                }`}
              >
                ਪੰਜਾਬੀ
              </button>
              <button
                type="button"
                onClick={() => setCurrentLang('en')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  currentLang === 'en'
                    ? 'bg-[#D6EAA6] text-[#0B261C] font-semibold'
                    : 'text-[#BACABD] hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setCurrentLang('hi')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  currentLang === 'hi'
                    ? 'bg-[#D6EAA6] text-[#0B261C] font-semibold'
                    : 'text-[#BACABD] hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs block text-[#D6EAA6]">
                {t.greeting}, <strong className="text-white">{user?.name || 'ਗੁਰਦੇਵ ਸਿੰਘ ਗਿੱਲ'}</strong>
              </span>
              <span className="text-[10px] text-[#8EA595] font-mono">
                {user?.farmerId ? `Parcel ${user.farmerId}` : 'Malwa Progressive FPO'}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              title={t.signOut}
              className="text-[#D6EAA6] hover:text-white hover:bg-white/10 text-xs px-2 h-8"
            >
              <LogOut size={14} className="sm:mr-1" />
              <span className="hidden sm:inline">{t.signOut}</span>
            </Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#BACABD] hover:text-white rounded-md"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Desktop Nav Bar */}
        <nav className="hidden md:flex border-t border-white/10 bg-[#0B261C]">
          <div className="max-w-6xl mx-auto px-4 w-full flex items-center gap-1 py-1.5 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (currentPath.startsWith(item.path) && item.path !== '/farmer/dashboard');
              return (
                <Link
                  key={item.path}
                  to={item.path as any}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
                    isActive
                      ? 'bg-[#D6EAA6] text-[#0B261C] font-semibold'
                      : 'text-[#BACABD] hover:bg-white/10 hover:text-white'
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
          <div className="md:hidden border-t border-white/10 bg-[#0B261C] px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.path}
                  to={item.path as any}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-[#D6EAA6] text-[#0B261C] font-semibold' : 'text-[#BACABD] hover:bg-white/10'
                  }`}
                >
                  <Icon size={16} />
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

      {/* Mobile-First Sticky Bottom Navigation Bar (Large touch targets for farmers) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B261C] border-t border-[#1E4834] z-40 px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-5 gap-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.path ||
              (currentPath.startsWith(item.path) && item.path !== '/farmer/dashboard');

            return (
              <Link
                key={item.path}
                to={item.path as any}
                className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-[#D6EAA6] font-semibold bg-white/10'
                    : 'text-[#8EA595] hover:text-[#BACABD]'
                }`}
              >
                <Icon size={18} className="mb-0.5" />
                <span className="truncate max-w-[60px] text-center">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
