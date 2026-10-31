import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { useAuth } from '@/lib/auth/auth-context';
import { Building2, ShieldCheck } from 'lucide-react';

export function BuyerProfileScreen() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Institutional Buyer Profile"
        description="Corporate identity, ESG compliance registry, and authorized due diligence auditor credentials."
      />

      <div className="bg-white border border-[#dfe6d9] rounded-xl p-6 shadow-xs space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">AUTHORIZED REPRESENTATIVE</span>
            <span className="font-semibold text-sm text-[#193b2a]">{user?.name || 'Marcus Vance'}</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">ORGANIZATION</span>
            <span className="font-semibold text-sm text-[#193b2a]">Aura Climate Asset Management Ltd.</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">ORGANIZATION ID</span>
            <span className="font-mono text-[#245b45]">AURA-CLIMATE-ASSETS</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">DATA ROOM CLEARANCE</span>
            <span className="font-semibold text-emerald-700">Tier-1 Institutional Clearance</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/buyers/profile')({
  component: BuyerProfileScreen,
});
