import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { useAuth } from '@/lib/auth/auth-context';
import { User, Shield } from 'lucide-react';

export function FarmerProfileScreen() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ · Farmer Profile"
        description="FPO membership association, revenue village details, and benefit distribution preferences."
      />

      <div className="bg-white border border-[#dfe6d9] rounded-xl p-6 shadow-xs space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">NAME (OFFICIAL)</span>
            <span className="font-semibold text-sm text-[#193b2a]">{user?.name || 'Gurdev Singh Gill'}</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">NAME (LOCAL)</span>
            <span className="font-semibold text-sm text-[#193b2a]" lang="pa">ਗੁਰਦੇਵ ਸਿੰਘ ਗਿੱਲ</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">FPO COOPERATIVE</span>
            <span className="font-semibold text-[#193b2a]">Malwa Agro-Farmer Producer Org</span>
          </div>
          <div>
            <span className="text-[#72816f] block font-mono text-[10px]">BENEFIT SHARE</span>
            <span className="font-semibold text-emerald-700">80% Direct Carbon Share Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/profile')({
  component: FarmerProfileScreen,
});
