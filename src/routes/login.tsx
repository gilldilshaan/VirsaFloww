import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { AcreonBrand } from '@/components/acreon-brand';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, ShieldCheck, UserCheck, LogOut, Info } from 'lucide-react';
import { pageHead } from '@/lib/earth/content';
import { useAuth, DEMO_IDENTITIES } from '@/lib/auth/auth-context';
import { UserRole } from '@/lib/auth/types';
import { sanitizeRedirectPath } from '@/lib/auth/redirect';

export function LoginPage() {
  const router = useRouter();
  const search = Route.useSearch();
  const nextTarget = sanitizeRedirectPath(search?.next, '');
  const { login, loginAsDemo, logout, user, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const getRoleDefaultRoute = (role: UserRole): string => {
    switch (role) {
      case 'farmer':
        return '/farmer/home';
      case 'buyer':
        return '/buyers/marketplace';
      case 'project_developer':
        return '/workspace/projects';
      case 'reviewer':
      case 'field_officer':
      case 'admin':
      default:
        return '/workspace/command';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!email) {
      setLoginError('Please enter your email address, or choose a Demo Identity below.');
      return;
    }

    const res = await login({ email, password });
    if (res.success && res.user) {
      const destination = nextTarget || getRoleDefaultRoute(res.user.role);
      router.navigate({ to: destination as any });
    } else {
      setLoginError(res.error || 'Authentication failed');
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setLoginError(null);
    const res = await loginAsDemo(role);
    if (res.success && res.user) {
      const destination = nextTarget || getRoleDefaultRoute(res.user.role);
      router.navigate({ to: destination as any });
    }
  };

  return (
    <div className="account-page min-h-screen bg-[#f4f6f0] flex items-center justify-center p-4">
      <div className="account-card bg-white border border-[#dfe6d9] rounded-2xl p-8 max-w-lg w-full shadow-lg">
        <AcreonBrand />

        <div className="mt-6 mb-2 flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider">
          <Sparkles size={13} className="text-[#5c7c46]" />
          VirsaFlow Universal Authentication
        </div>

        <h1 className="text-3xl font-serif text-[#193b2a]">Sign In</h1>
        <p className="text-xs text-[#708071] mt-1 mb-6">
          Access the Farmer Portal, Internal MRV Workspace, or Industry Buyer Due Diligence Room.
        </p>

        {nextTarget && (
          <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-xs flex items-center gap-2">
            <Info size={14} className="shrink-0 text-amber-700" />
            <span>
              Authentication required to access: <code className="font-mono font-semibold">{nextTarget}</code>
            </span>
          </div>
        )}

        {isAuthenticated && user && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold block">{user.name}</span>
                <span className="text-[10px] font-mono text-emerald-800">
                  Role: {user.role} {user.isDemoUser && '(DEMO ACCOUNT)'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-xs border-emerald-300 text-emerald-900 hover:bg-emerald-100 h-8"
              >
                <LogOut size={12} className="mr-1.5" />
                Sign Out
              </Button>
            </div>
            <Link
              to={(nextTarget || getRoleDefaultRoute(user.role)) as any}
              className="inline-flex items-center gap-1 text-[#245b45] font-semibold hover:underline pt-1"
            >
              Continue to Portal <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Explicit Demo Role Selector Banner */}
        <div className="mb-6 bg-[#f0f5eb] border border-[#d6e3cd] rounded-xl p-4 text-xs text-[#245b45] space-y-3">
          <div className="flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-[#3b7e52] shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-[#173a27] font-semibold">Demo Identity Selector</strong>
                <span className="bg-[#245b45] text-white text-[9px] font-mono uppercase px-1.5 py-0.5 rounded">
                  DEMO ONLY
                </span>
              </div>
              <p className="text-[11px] text-[#556e50] mt-0.5">
                Select an explicitly labelled demo profile below to test route guards and permissions:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleDemoLogin('reviewer')}
              className="p-2 rounded-lg text-left border bg-white text-[#213c2b] border-[#d8e1d4] hover:bg-[#edf3e6] transition-all"
            >
              <span className="font-semibold block text-[11px]">Auditor (Reviewer)</span>
              <span className="text-[9px] text-[#556e50] block truncate">Internal Workspace</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('farmer')}
              className="p-2 rounded-lg text-left border bg-white text-[#213c2b] border-[#d8e1d4] hover:bg-[#edf3e6] transition-all"
            >
              <span className="font-semibold block text-[11px]">Farmer</span>
              <span className="text-[9px] text-[#556e50] block truncate">PB-LUD-042</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('buyer')}
              className="p-2 rounded-lg text-left border bg-white text-[#213c2b] border-[#d8e1d4] hover:bg-[#edf3e6] transition-all"
            >
              <span className="font-semibold block text-[11px]">Corporate Buyer</span>
              <span className="text-[9px] text-[#556e50] block truncate">ESG Data Room</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('project_developer')}
              className="p-2 rounded-lg text-left border bg-white text-[#213c2b] border-[#d8e1d4] hover:bg-[#edf3e6] transition-all"
            >
              <span className="font-semibold block text-[11px]">Project Developer</span>
              <span className="text-[9px] text-[#556e50] block truncate">Panjdhara Ops</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('field_officer')}
              className="p-2 rounded-lg text-left border bg-white text-[#213c2b] border-[#d8e1d4] hover:bg-[#edf3e6] transition-all"
            >
              <span className="font-semibold block text-[11px]">Field Officer</span>
              <span className="text-[9px] text-[#556e50] block truncate">FPO Malwa Lead</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="p-2 rounded-lg text-left border bg-white text-[#213c2b] border-[#d8e1d4] hover:bg-[#edf3e6] transition-all"
            >
              <span className="font-semibold block text-[11px]">Administrator</span>
              <span className="text-[9px] text-[#556e50] block truncate">Full System Scope</span>
            </button>
          </div>
        </div>

        {loginError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-xs">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#193b2a] block mb-1">Production Email Address</label>
            <input
              type="email"
              placeholder="user@organization.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#193b2a] block mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-[#245b45] text-white hover:bg-[#1a4333] text-xs font-semibold h-10"
            >
              Sign In to VirsaFlow <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-[#edf0e7] text-center">
          <p className="text-[11px] text-[#708071] mb-3">
            Active Session:{' '}
            <strong className="text-[#213c2b]">
              {user ? `${user.name} (${user.role})${user.isDemoUser ? ' [DEMO]' : ''}` : 'Unauthenticated (Guest)'}
            </strong>
          </p>
          <Link to="/" className="text-xs text-[#245b45] hover:underline font-medium">
            ← Return to Public Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => {
    const rawNext = search['next'];
    const next = sanitizeRedirectPath(rawNext, '');
    return { next };
  },
  head: () =>
    pageHead(
      'Sign In | VirsaFlow Universal Portal',
      'Sign in to access VirsaFlow Farmer Portal, Internal Workspace, or Buyer Due Diligence Room.',
      '/login'
    ),
  component: LoginPage,
});
