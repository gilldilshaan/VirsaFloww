import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { AcreonBrand } from '@/components/acreon-brand';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('demo.auditor@terraledger.ai');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.navigate({ to: '/dashboard' });
  };

  return (
    <div className="account-page">
      <div className="account-card">
        <AcreonBrand />

        <div className="mt-6 mb-2 flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider">
          <Sparkles size={13} className="text-[#5c7c46]" />
          TerraLedger AI Workspace Access
        </div>

        <h1 className="text-3xl font-serif text-[#193b2a]">Sign in to Workspace</h1>
        <p className="text-xs text-[#708071] mt-1 mb-6">
          Access the field assessment command centre, satellite intelligence series, and project dossiers.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#193b2a] block mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#193b2a] block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
            />
          </div>

          <div className="pt-2 space-y-2">
            <Button
              type="submit"
              className="w-full bg-[#245b45] text-white hover:bg-[#1a4333] text-xs font-semibold h-10"
            >
              Enter TerraLedger Workspace <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-[#edf0e7] text-center">
          <p className="text-[11px] text-[#708071] mb-3">
            Demonstration Mode: Instant auditor access preconfigured without credentials.
          </p>
          <Link to="/" className="text-xs text-[#245b45] hover:underline font-medium">
            ← Return to Public Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/auth')({
  validateSearch: (search: Record<string, unknown>) => ({
    next: (search['next'] as string) || '/dashboard',
  }),
  head: () =>
    pageHead(
      'Sign In | TerraLedger AI Workspace',
      'Sign in to access TerraLedger AI agricultural MRV command centre and project dossiers.',
      '/auth'
    ),
  component: AuthPage,
});
