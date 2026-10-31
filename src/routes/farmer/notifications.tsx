import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { Bell, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function FarmerNotificationsScreen() {
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Notifications & Tasks"
        description="Verification requests, correction notices, and seasonal practice alerts."
      />

      <div className="space-y-3 text-xs">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-900 block font-semibold">
              Action Required: Boundary Coordinate Mismatch on EV-003
            </strong>
            <p className="text-amber-800 mt-0.5">
              Your seeding photograph was tagged 420m outside Parcel PB-LUD-042. Please upload a replacement in-boundary photo taken inside the field edge.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#193b2a] block font-semibold">
              Land Tenancy Verified
            </strong>
            <p className="text-[#72816f] mt-0.5">
              Digital Jamabandi API confirmed 4.8 hectares title registration in Ludhiana revenue circle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/notifications')({
  component: FarmerNotificationsScreen,
});
