import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { getFarmerActivities } from '@/lib/farmer/farmer-service';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, CheckCircle2 } from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function FarmerActivitiesPage() {
  const initialActivities = useMemo(() => getFarmerActivities(), []);
  const [activities, setActivities] = useState(initialActivities);
  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState<'sowing' | 'irrigation' | 'fertilizer' | 'harvest' | 'other'>('irrigation');
  const [newDate, setNewDate] = useState('2026-08-05');
  const [newDesc, setNewDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    const newItem = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      seasonId: 'KHARIF-2026',
      type: newType,
      date: newDate,
      description: newDesc,
      evidenceIds: [],
    };

    setActivities([newItem, ...activities]);
    setIsAdding(false);
    setNewDesc('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="ਗਤੀਵਿਧੀਆਂ · Agricultural Activities Log"
        description="Record dated farming events, irrigation cycles, and emergence milestones for Kharif 2026."
        badge={<DemoBadge label="Seasonal Activity Ledger" />}
        actions={
          <Button
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            className="bg-[#245b45] text-white hover:bg-[#1a4333] text-xs"
          >
            <Plus size={14} className="mr-1.5" />
            {isAdding ? 'Cancel' : 'Log New Activity'}
          </Button>
        }
      />

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl p-6 border border-[#245b45] shadow-sm space-y-4 text-xs">
          <h3 className="font-serif text-base font-bold text-[#193b2a]">Log Farming Operation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-[#193b2a]">Operation Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a]"
              >
                <option value="irrigation">Irrigation / Pumping</option>
                <option value="sowing">Direct Seed Drilling</option>
                <option value="fertilizer">Fertilizer Application</option>
                <option value="harvest">Combine Harvest</option>
                <option value="other">Observation / Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-[#193b2a]">Date of Event</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a]"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-[#193b2a]">Description / Equipment Used</label>
            <input
              type="text"
              placeholder="e.g. 2nd vegetative flush; water applied for 4 hours from solar tubewell"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a]"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" className="bg-[#245b45] text-white text-xs">
              Save Activity Entry
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {activities.map((act) => (
          <div key={act.id} className="bg-white rounded-xl p-5 border border-[#dde4d9] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase bg-[#e8efe5] text-[#245b45] px-2 py-0.5 rounded">
                {act.type}
              </span>
              <span className="text-xs font-mono text-[#708071]">{act.date}</span>
            </div>
            <p className="text-xs text-[#213c2b] leading-relaxed">{act.description}</p>
            {act.evidenceIds.length > 0 && (
              <div className="pt-2 border-t border-[#f0f3ec] text-[10px] font-mono text-[#5c7c46]">
                Linked Evidence: {act.evidenceIds.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/activities')({
  head: () =>
    pageHead(
      'Farming Activities | The Carbon Credit',
      'Log agronomic practice events and irrigation schedules for Punjab rice MRV.',
      '/farmer/activities'
    ),
  component: FarmerActivitiesPage,
});
