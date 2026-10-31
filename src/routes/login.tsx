import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { AcreonBrand } from '@/components/acreon-brand';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  UserCheck,
  LogOut,
  Info,
  UserPlus,
  LogIn,
  Loader2,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';
import { useAuth, DEMO_IDENTITIES } from '@/lib/auth/auth-context';
import { UserRole } from '@/lib/auth/types';
import { sanitizeRedirectPath } from '@/lib/auth/redirect';

export function LoginPage() {
  const router = useRouter();
  const search = Route.useSearch();
  const nextTarget = sanitizeRedirectPath(search?.next, '');
  const { login, register, loginAsDemo, logout, user, isAuthenticated } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'register'>(
    search?.mode === 'register' ? 'register' : 'signin'
  );

  // Sign In fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('farmer');
  const [regOrg, setRegOrg] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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
    setAuthError(null);

    if (!email) {
      setAuthError('Please enter your email address, or choose a Demo Identity below.');
      return;
    }

    setIsSubmitting(true);
    const res = await login({ email, password });
    setIsSubmitting(false);

    if (res.success && res.user) {
      const destination = nextTarget || getRoleDefaultRoute(res.user.role);
      router.navigate({ to: destination as any });
    } else {
      setAuthError(res.error || 'Authentication failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!regName.trim() || regName.trim().length < 2) {
      setAuthError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!regPassword || regPassword.length < 8) {
      setAuthError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      role: regRole,
      organization: regOrg.trim() || undefined,
    });
    setIsSubmitting(false);

    if (res.success && res.user) {
      const destination = nextTarget || getRoleDefaultRoute(res.user.role);
      router.navigate({ to: destination as any });
    } else {
      setAuthError(res.error || 'Registration failed');
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setAuthError(null);
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

        {/* Tab Switcher between Sign In and Create Account */}
        <div className="flex border-b border-[#dfe6d9] mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setAuthError(null);
            }}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              authMode === 'signin'
                ? 'border-[#245b45] text-[#193b2a]'
                : 'border-transparent text-[#708071] hover:text-[#193b2a]'
            }`}
          >
            <LogIn size={13} />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setAuthError(null);
            }}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              authMode === 'register'
                ? 'border-[#245b45] text-[#193b2a]'
                : 'border-transparent text-[#708071] hover:text-[#193b2a]'
            }`}
          >
            <UserPlus size={13} />
            Create Account
          </button>
        </div>

        <h1 className="text-3xl font-serif text-[#193b2a]">
          {authMode === 'register' ? 'Create Account' : 'Sign In'}
        </h1>
        <p className="text-xs text-[#708071] mt-1 mb-6">
          {authMode === 'register'
            ? 'Register a verified account to access MRV telemetry, project development, or carbon credit procurement.'
            : 'Access the Farmer Portal, Internal MRV Workspace, or Industry Buyer Due Diligence Room.'}
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

        {/* Explicit Demo Role Selector Banner (Shown during Sign In) */}
        {authMode === 'signin' && (
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
        )}

        {authError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-xs">
            {authError}
          </div>
        )}

        {/* Mode 1: Sign In Form */}
        {authMode === 'signin' && (
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
                disabled={isSubmitting}
                className="w-full bg-[#245b45] text-white hover:bg-[#1a4333] text-xs font-semibold h-10 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-1.5" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In to VirsaFlow <ArrowRight size={14} className="ml-1.5" />
                  </>
                )}
              </Button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError(null);
                }}
                className="text-xs text-[#245b45] hover:underline font-medium"
              >
                Don't have an account? Create one now →
              </button>
            </div>
          </form>
        )}

        {/* Mode 2: Create Account Form */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-xs font-medium text-[#193b2a] block mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Jaswinder Singh"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#193b2a] block mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="jaswinder@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#193b2a] block mb-1">
                Password <span className="text-red-500">*</span> (min. 8 characters)
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#193b2a] block mb-1">
                Account Role <span className="text-red-500">*</span>
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as UserRole)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
              >
                <option value="farmer">Farmer / Landholder (Farmer Portal)</option>
                <option value="project_developer">Project Developer (Panjdhara Ops)</option>
                <option value="buyer">Corporate Buyer (Carbon Due Diligence Room)</option>
                <option value="field_officer">Field Officer (FPO Collector)</option>
                <option value="reviewer">Verifier / Auditor (VVB Reviewer)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#193b2a] block mb-1">
                Organization / Farm / Cooperative (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Malwa Organic Producers / Punjab Agro"
                value={regOrg}
                onChange={(e) => setRegOrg(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#245b45] text-white hover:bg-[#1a4333] text-xs font-semibold h-10 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-1.5" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account & Continue <ArrowRight size={14} className="ml-1.5" />
                  </>
                )}
              </Button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError(null);
                }}
                className="text-xs text-[#245b45] hover:underline font-medium"
              >
                ← Already have an account? Sign in
              </button>
            </div>
          </form>
        )}

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
  validateSearch: (search: Record<string, unknown>): { next?: string; mode?: 'signin' | 'register' } => {
    const rawNext = search['next'];
    const next = sanitizeRedirectPath(rawNext, '');
    const mode = search['mode'] === 'register' ? 'register' : undefined;
    return {
      ...(next ? { next } : {}),
      ...(mode ? { mode } : {}),
    };
  },
  head: () =>
    pageHead(
      'Authentication | VirsaFlow Universal Portal',
      'Sign in or create an account to access VirsaFlow Farmer Portal, Internal Workspace, or Buyer Due Diligence Room.',
      '/login'
    ),
  component: LoginPage,
});
