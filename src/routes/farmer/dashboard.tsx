import { createFileRoute, Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { getFarmerProfile, getFarmerFields, getFarmerNotifications } from '@/lib/farmer/farmer-service';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Calendar,
  Upload,
  Bell,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  SunMedium,
  Sprout,
  FileCheck2,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function FarmerDashboardPage() {
  const profile = useMemo(() => getFarmerProfile(), []);
  const fields = useMemo(() => getFarmerFields(), []);
  const notifications = useMemo(() => getFarmerNotifications(), []);

  const totalAcres = fields.reduce((acc, f) => acc + f.areaAcres, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-[#173a27] to-[#245b45] text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-[#d6eaa6] uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
              Kharif 2026 · DSR Program
            </span>
            <DemoBadge size="xs" label="Farmer Portal Demo" className="bg-[#d6eaa6]/20 text-[#d6eaa6] border-[#d6eaa6]/40" />
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl text-[#f5f5e8] tracking-tight">
            ਜੀ ਆਇਆਂ ਨੂੰ, <span className="font-pa font-normal">{profile.nameLocal}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#bacabd] max-w-xl leading-relaxed">
            Welcome back, {profile.name}. Your Direct Seeded Rice parcel is actively monitored by ESA Sentinel-2 remote sensing.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <Button asChild size="sm" className="bg-[#d6eaa6] text-[#102e20] hover:bg-[#e2f3be] text-xs font-semibold h-9">
              <Link to={"/farmer/evidence" as any}>
                <Upload size={14} className="mr-1.5" />
                Upload Field Photo
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-[#d6eaa6]/40 text-[#f5f5e8] hover:bg-white/10 text-xs h-9">
              <Link to={"/farmer/register-field" as any}>
                <PlusCircle size={14} className="mr-1.5" />
                Register New Parcel
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metric Tiles (Mobile Touch Optimized) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#dde4d9] shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-[#708071] block">Total Land Enrolled</span>
          <span className="text-xl sm:text-2xl font-bold text-[#193b2a] mt-1 block">
            {totalAcres.toFixed(1)} <span className="text-xs font-normal text-[#708071]">Acres</span>
          </span>
          <span className="text-[10px] text-[#5c7c46] block mt-0.5">2 Verified Parcels</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#dde4d9] shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-[#708071] block">Practice Enrolled</span>
          <span className="text-sm sm:text-base font-bold text-[#193b2a] mt-1 block">
            DSR + AWD
          </span>
          <span className="text-[10px] text-[#5c7c46] block mt-0.5">Zero Puddle Nursery</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#dde4d9] shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-[#708071] block">Primary Parcel</span>
          <span className="text-sm sm:text-base font-bold text-[#245b45] mt-1 block">
            PB-LUD-042
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Ready for Verification</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#dde4d9] shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-[#708071] block">Farmer Benefit Share</span>
          <span className="text-xl sm:text-2xl font-bold text-[#193b2a] mt-1 block">
            80%
          </span>
          <span className="text-[10px] text-[#708071] block mt-0.5">Direct FPO Settlement</span>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-[#193b2a] uppercase tracking-wider font-mono">
          ਤੁਰੰਤ ਸੇਵਾਵਾਂ · Farmer Operations
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to={"/farmer/fields" as any}
            className="bg-white p-4 rounded-xl border border-[#dde4d9] hover:border-[#245b45] transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-lg bg-[#eef3eb] text-[#245b45] flex items-center justify-center mb-3 group-hover:bg-[#245b45] group-hover:text-white transition-colors">
              <MapPin size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#193b2a] block">My Fields</span>
              <span className="text-[11px] text-[#708071]">ਮੇਰੇ ਖੇਤ</span>
            </div>
          </Link>

          <Link
            to={"/farmer/activities" as any}
            className="bg-white p-4 rounded-xl border border-[#dde4d9] hover:border-[#245b45] transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-lg bg-[#eef3eb] text-[#245b45] flex items-center justify-center mb-3 group-hover:bg-[#245b45] group-hover:text-white transition-colors">
              <Calendar size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#193b2a] block">Log Practice</span>
              <span className="text-[11px] text-[#708071]">ਗਤੀਵਿਧੀ ਦਰਜ ਕਰੋ</span>
            </div>
          </Link>

          <Link
            to={"/farmer/evidence" as any}
            className="bg-white p-4 rounded-xl border border-[#dde4d9] hover:border-[#245b45] transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-lg bg-[#eef3eb] text-[#245b45] flex items-center justify-center mb-3 group-hover:bg-[#245b45] group-hover:text-white transition-colors">
              <Upload size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#193b2a] block">Evidence Upload</span>
              <span className="text-[11px] text-[#708071]">ਫੋਟੋ ਤੇ ਸਬੂਤ</span>
            </div>
          </Link>

          <Link
            to={"/farmer/notifications" as any}
            className="bg-white p-4 rounded-xl border border-[#dde4d9] hover:border-[#245b45] transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-lg bg-[#eef3eb] text-[#245b45] flex items-center justify-center mb-3 group-hover:bg-[#245b45] group-hover:text-white transition-colors">
              <Bell size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#193b2a] block">Alerts & Status</span>
              <span className="text-[11px] text-[#708071]">ਸੂਚਨਾਵਾਂ</span>
            </div>
          </Link>
        </div>
      </div>

      {/* My Active Parcels Section */}
      <div className="bg-white rounded-2xl p-6 border border-[#dde4d9] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-[#193b2a]">
            Active Field Parcels (Kharif 2026)
          </h3>
          <Button asChild variant="ghost" size="sm" className="text-xs text-[#245b45]">
            <Link to={"/farmer/fields" as any}>
              View All Fields <ArrowRight size={13} className="ml-1" />
            </Link>
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field) => (
            <div
              key={field.id}
              className="p-4 rounded-xl border border-[#dde4d9] bg-[#fafbf9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#b8cbb4] transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#193b2a]">{field.name}</span>
                  <span className="text-[10px] font-mono bg-[#e8efe5] text-[#245b45] px-1.5 py-0.5 rounded">
                    {field.code}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#708071] mt-1">
                  <span>{field.areaAcres} Acres ({field.areaHa} ha)</span>
                  <span>·</span>
                  <span>{field.practice}</span>
                  <span>·</span>
                  <span>{field.district}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                    field.status === 'READY_FOR_VERIFICATION'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-sky-100 text-sky-800 border border-sky-300'
                  }`}
                >
                  {field.status === 'READY_FOR_VERIFICATION' ? 'Ready for Verification' : 'Needs Review'}
                </span>
                <Button asChild size="sm" variant="outline" className="text-xs border-[#dce3d7] h-8">
                  <Link to={`/farmer/fields/${field.id}` as any}>
                    Details
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/dashboard')({
  head: () =>
    pageHead(
      'Farmer Dashboard | The Carbon Credit',
      'Farmer operations dashboard for Direct Seeded Rice MRV, field registration, and ground evidence.',
      '/farmer/dashboard'
    ),
  component: FarmerDashboardPage,
});
