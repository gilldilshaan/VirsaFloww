import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState, useEffect } from 'react';
import { getFarmerActivities } from '@/lib/farmer/farmer-service';
import { api } from '@/lib/api/client';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Plus,
  Droplets,
  Sprout,
  FlaskConical,
  Scissors,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

interface ActivityItem {
  id: string;
  fieldId: string;
  seasonId: string;
  activityType: 'pre_sowing_irrigation' | 'direct_seeding' | 'awd_irrigation' | 'fertilizer_application' | 'harvest';
  declaredDate: string;
  notes?: string;
  evidenceIds?: string[];
  isDemo?: boolean;
}

const TYPE_CONFIG = {
  direct_seeding: {
    label: 'Direct Seed Drilling (DSR)',
    labelPa: 'ਸਿੱਧੀ ਬਿਜਾਈ',
    icon: Sprout,
    badgeBg: 'bg-[#eef5ea] text-[#193b2a] border-[#d6eaa6]',
  },
  awd_irrigation: {
    label: 'AWD Irrigation Cycle',
    labelPa: 'ਪਾਣੀ ਲਾਉਣਾ (AWD)',
    icon: Droplets,
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  pre_sowing_irrigation: {
    label: 'Pre-Sowing Irrigation (Rauni)',
    labelPa: 'ਰੌਣੀ ਸਿੰਚਾਈ',
    icon: Droplets,
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  fertilizer_application: {
    label: 'Targeted Nutrient Application',
    labelPa: 'ਖਾਦ ਪਾਉਣਾ',
    icon: FlaskConical,
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  harvest: {
    label: 'Combine Harvesting',
    labelPa: 'ਵਾਢੀ',
    icon: Scissors,
    badgeBg: 'bg-stone-100 text-stone-800 border-stone-200',
  },
};

export function FarmerActivitiesPage() {
  const initialActivities = useMemo(() => getFarmerActivities(), []);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [newType, setNewType] = useState<ActivityItem['activityType']>('awd_irrigation');
  const [newDate, setNewDate] = useState('2026-08-05');
  const [newNotes, setNewNotes] = useState('');

  // Fetch activities from backend or fallback to initial records
  useEffect(() => {
    async function loadActivities() {
      try {
        const res = await api.get<{ items: any[] }>('/activities?fieldId=PB-LUD-042');
        if (res.data && Array.isArray(res.data.items) && res.data.items.length > 0) {
          const mapped: ActivityItem[] = res.data.items.map((item) => ({
            id: item.id,
            fieldId: item.fieldId || item.field_id,
            seasonId: item.seasonId || item.season_id,
            activityType: item.activityType || item.activity_type,
            declaredDate: item.declaredDate || item.declared_date,
            notes: item.notes,
            evidenceIds: item.evidenceIds || [],
            isDemo: item.isDemo,
          }));
          setActivities(mapped);
          return;
        }
      } catch {}

      // Fallback
      setActivities([
        {
          id: 'ACT-001',
          fieldId: 'PB-LUD-042',
          seasonId: 'KHARIF-2026',
          activityType: 'pre_sowing_irrigation',
          declaredDate: '2026-06-12',
          notes: 'Pre-sowing (Rauni) irrigation to establish optimal seedbed moisture for direct drilling.',
          evidenceIds: ['EV-004-LOG'],
        },
        {
          id: 'ACT-002',
          fieldId: 'PB-LUD-042',
          seasonId: 'KHARIF-2026',
          activityType: 'direct_seeding',
          declaredDate: '2026-06-15',
          notes: 'Direct drilling using tractor-mounted seed drill with calibrated disc openers.',
          evidenceIds: ['EV-003'],
        },
        {
          id: 'ACT-003',
          fieldId: 'PB-LUD-042',
          seasonId: 'KHARIF-2026',
          activityType: 'awd_irrigation',
          declaredDate: '2026-07-28',
          notes: 'Vegetative drying cycle completed; solar tubewell pumping for 4.5 hours.',
          evidenceIds: ['EV-005-PHOTO'],
        },
      ]);
    }

    loadActivities();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotes.trim()) return;

    setIsSubmitting(true);
    const activityId = `ACT-${Date.now().toString().slice(-4)}`;

    const payload = {
      id: activityId,
      fieldId: 'PB-LUD-042',
      seasonId: 'KHARIF-2026',
      activityType: newType,
      declaredDate: newDate,
      notes: newNotes,
      createdBy: 'FARMER-PB-042',
      createdAt: new Date().toISOString(),
      isDemo: false,
      dataLabel: 'Live Farmer Submission',
    };

    try {
      const res = await api.post('/activities', payload);
      const newEntry: ActivityItem = {
        id: activityId,
        fieldId: 'PB-LUD-042',
        seasonId: 'KHARIF-2026',
        activityType: newType,
        declaredDate: newDate,
        notes: newNotes,
        evidenceIds: [],
        isDemo: false,
      };

      setActivities([newEntry, ...activities]);
      setIsAdding(false);
      setNewNotes('');
      setSuccessMsg('Farming activity recorded and synchronized to MRV evidence chain.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch {
      // Local fallback
      const fallbackEntry: ActivityItem = {
        id: activityId,
        fieldId: 'PB-LUD-042',
        seasonId: 'KHARIF-2026',
        activityType: newType,
        declaredDate: newDate,
        notes: newNotes,
        evidenceIds: [],
        isDemo: false,
      };
      setActivities([fallbackEntry, ...activities]);
      setIsAdding(false);
      setNewNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = activities.filter((act) => {
    if (filterType === 'all') return true;
    return act.activityType === filterType;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="ਖੇਤੀ ਗਤੀਵਿਧੀਆਂ · Farming Activities Ledger"
        description="Record dated agronomic operations, irrigation cycles, and emergence milestones for Kharif 2026 Direct Seeded Rice."
        badge={<DemoBadge label="Seasonal Practice Record" />}
        actions={
          <Button
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            className="bg-[#193B2A] text-white hover:bg-[#245B45] text-xs font-semibold"
          >
            <Plus size={14} className="mr-1.5" />
            {isAdding ? 'Close Form' : 'Log New Operation'}
          </Button>
        }
      />

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl p-6 sm:p-7 border border-[#245b45] shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#edf0e7] pb-3">
            <h3 className="font-serif text-base font-bold text-[#193b2a]">Log Farming Operation</h3>
            <span className="text-[10px] font-mono text-[#5c7c46] bg-[#eef5ea] px-2 py-0.5 rounded">
              Parcel PB-LUD-042
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#193b2a]">Operation Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] font-medium"
              >
                <option value="awd_irrigation">AWD Irrigation Cycle</option>
                <option value="direct_seeding">Direct Seed Drilling (DSR)</option>
                <option value="pre_sowing_irrigation">Pre-Sowing Irrigation (Rauni)</option>
                <option value="fertilizer_application">Nutrient / Fertilizer Application</option>
                <option value="harvest">Combine Harvest</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#193b2a]">Date of Operation</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[#193b2a]">Observation / Equipment Details</label>
            <input
              type="text"
              required
              placeholder="e.g. 2nd vegetative drying flush; water applied for 4.5 hours from solar tubewell"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a]"
            />
          </div>

          <div className="flex justify-end pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(false)}
              className="border-[#193b2a] text-[#193b2a] hover:bg-[#f4f7f1] text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#193B2A] text-white hover:bg-[#245B45] text-xs font-semibold px-5"
            >
              {isSubmitting ? 'Saving...' : 'Save Activity Entry'}
            </Button>
          </div>
        </form>
      )}

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={13} className="text-[#72816f] mr-1" />
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filterType === 'all'
              ? 'bg-[#193b2a] text-white'
              : 'bg-white border border-[#dde4d9] text-[#708071] hover:bg-[#f4f7f1]'
          }`}
        >
          All Operations ({activities.length})
        </button>
        {Object.entries(TYPE_CONFIG).map(([k, cfg]) => (
          <button
            key={k}
            onClick={() => setFilterType(k)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterType === k
                ? 'bg-[#193b2a] text-white'
                : 'bg-white border border-[#dde4d9] text-[#708071] hover:bg-[#f4f7f1]'
            }`}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Activities Timeline */}
      <div className="space-y-3">
        {filtered.map((act) => {
          const cfg = TYPE_CONFIG[act.activityType] || TYPE_CONFIG.awd_irrigation;
          const Icon = cfg.icon;

          return (
            <div
              key={act.id}
              className="bg-white rounded-2xl p-5 border border-[#dde4d9] shadow-2xs hover:border-[#b8cbb4] transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#eef5ea] text-[#193b2a] flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={18} />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#193b2a]">{cfg.label}</span>
                    <span className="text-[10px] text-[#708071] font-pa">{cfg.labelPa}</span>
                  </div>
                  <span className="text-xs font-mono text-[#708071] bg-[#fafbf9] px-2 py-0.5 rounded border border-[#edf0e7]">
                    {act.declaredDate}
                  </span>
                </div>

                <p className="text-xs text-[#213c2b] leading-relaxed pt-0.5">{act.notes}</p>

                <div className="pt-2 flex items-center gap-3 text-[10px] text-[#708071] font-mono">
                  <span>Parcel: {act.fieldId}</span>
                  <span>·</span>
                  <span>Season: {act.seasonId}</span>
                  {act.evidenceIds && act.evidenceIds.length > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-[#245b45] font-semibold">
                        Linked Evidence: {act.evidenceIds.join(', ')}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/activities')({
  head: () =>
    pageHead(
      'Farming Activities | VirsaFlow',
      'Log agronomic practice events and irrigation schedules for Punjab rice MRV.',
      '/farmer/activities'
    ),
  component: FarmerActivitiesPage,
});
