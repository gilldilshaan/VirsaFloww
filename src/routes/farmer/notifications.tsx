import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { getFarmerNotifications } from '@/lib/farmer/farmer-service';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Bell, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function FarmerNotificationsPage() {
  const notifs = useMemo(() => getFarmerNotifications(), []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="ਸੂਚਨਾਵਾਂ · Alerts & Field Status"
        description="Real-time updates regarding satellite passes, evidence review, and FPO notifications."
        badge={<DemoBadge label="Farmer Notification Feed" />}
      />

      <div className="space-y-3">
        {notifs.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-2xl border transition-all ${
              !n.read
                ? 'bg-white border-[#245b45] shadow-xs ring-1 ring-[#245b45]/10'
                : 'bg-[#fafbf9] border-[#dde4d9]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Bell size={15} className={!n.read ? 'text-[#245b45]' : 'text-[#708071]'} />
                <h3 className="font-serif text-sm font-bold text-[#193b2a]">{n.title}</h3>
              </div>
              <span className="text-[10px] font-mono text-[#708071]">
                {new Date(n.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs text-[#526655] leading-relaxed pl-5">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/notifications')({
  head: () =>
    pageHead(
      'Alerts & Notifications | VirsaFlow',
      'Field status updates and correction requests for Punjab farmers.',
      '/farmer/notifications'
    ),
  component: FarmerNotificationsPage,
});
