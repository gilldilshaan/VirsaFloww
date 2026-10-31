import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { Sprout, MapPin, Calendar, Camera, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FarmerHomeScreen() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ · Farmer Overview"
        description="Welcome to your agricultural MRV portal. Manage field parcels, log irrigation practices, and upload verified geotagged evidence."
      />

      {/* Primary Parcel Status Card */}
      <div className="bg-[#173a27] text-white rounded-2xl p-6 shadow-md border border-[#2b503e]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-[#d6eaa6] uppercase tracking-wider block mb-1">
              Active Registered Parcel
            </span>
            <h2 className="text-2xl font-serif">Gill Agro-Plot 4 (PB-LUD-042)</h2>
            <p className="text-xs text-[#a7c5b1] mt-1">
              Ludhiana District · 4.8 Hectares (11.86 Acres) · Practice: DSR + AWD
            </p>
          </div>
          <Link
            to="/farmer/fields/$fieldId"
            params={{ fieldId: 'PB-LUD-042' }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#d6eaa6] text-[#173a27] rounded-xl text-xs font-semibold hover:bg-white transition-colors self-start sm:self-auto"
          >
            <span>Parcel Details</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[#809c88] text-[10px] uppercase font-mono block">Status</span>
            <span className="font-semibold text-amber-300">NEEDS REVIEW</span>
          </div>
          <div>
            <span className="text-[#809c88] text-[10px] uppercase font-mono block">Crop</span>
            <span className="font-semibold text-white">PR-126 Basmati</span>
          </div>
          <div>
            <span className="text-[#809c88] text-[10px] uppercase font-mono block">Season</span>
            <span className="font-semibold text-white">Kharif 2026</span>
          </div>
          <div>
            <span className="text-[#809c88] text-[10px] uppercase font-mono block">Mitigation Target</span>
            <span className="font-semibold text-[#d6eaa6]">23.04 tCO2e</span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/farmer/evidence"
          className="bg-white border border-[#dfe6d9] rounded-xl p-5 hover:border-[#245b45] transition-all hover:shadow-xs group"
        >
          <Camera size={22} className="text-[#245b45] mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="font-serif text-base font-semibold text-[#193b2a]">Upload Evidence</h3>
          <p className="text-xs text-[#72816f] mt-1">Submit geotagged crop emergence photos or AWD tube logs.</p>
        </Link>

        <Link
          to="/farmer/season"
          className="bg-white border border-[#dfe6d9] rounded-xl p-5 hover:border-[#245b45] transition-all hover:shadow-xs group"
        >
          <Calendar size={22} className="text-[#5c7c46] mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="font-serif text-base font-semibold text-[#193b2a]">Season Activity</h3>
          <p className="text-xs text-[#72816f] mt-1">View sowing timeline, irrigation cessation dates, and harvest schedule.</p>
        </Link>

        <Link
          to="/farmer/fields"
          className="bg-white border border-[#dfe6d9] rounded-xl p-5 hover:border-[#245b45] transition-all hover:shadow-xs group"
        >
          <MapPin size={22} className="text-[#3b7e52] mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="font-serif text-base font-semibold text-[#193b2a]">My Parcels</h3>
          <p className="text-xs text-[#72816f] mt-1">Inspect cadastral boundary maps, revenue title deeds, and area records.</p>
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/home')({
  component: FarmerHomeScreen,
});
