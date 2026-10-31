import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { getFarmerProfile } from '@/lib/farmer/farmer-service';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { User, ShieldCheck, CheckCircle2, Phone, MapPin, Globe, FileText } from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function FarmerProfilePage() {
  const profile = useMemo(() => getFarmerProfile(), []);
  const [phone, setPhone] = useState(profile.phone);
  const [lang, setLang] = useState<'pa' | 'en'>(profile.language);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ · Farmer Profile"
        description="Manage your producer registration, FPO cluster association, and digital consent credentials."
        badge={<DemoBadge label="Verified Producer" />}
      />

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#dde4d9] shadow-2xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#f0f3ec]">
          <div className="w-16 h-16 rounded-full bg-[#e8efe5] text-[#245b45] flex items-center justify-center font-serif text-2xl font-bold">
            GS
          </div>
          <div>
            <h2 className="font-serif text-2xl text-[#193b2a]">{profile.name}</h2>
            <p className="text-xs font-pa text-[#5c7c46] font-semibold">{profile.nameLocal}</p>
            <span className="text-[10px] font-mono text-[#708071] block mt-0.5">ID: {profile.id}</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-[#193b2a] block">Primary Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#193b2a] block">Preferred Language</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as 'pa' | 'en')}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
              >
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#193b2a] block">District / District Cluster</label>
              <input
                type="text"
                disabled
                value={`${profile.district}, ${profile.state}`}
                className="w-full text-xs bg-[#f0f3ec] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#708071]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#193b2a] block">Registration Date</label>
              <input
                type="text"
                disabled
                value={profile.registeredAt}
                className="w-full text-xs bg-[#f0f3ec] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#708071]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#f0f3ec] space-y-2">
            <h3 className="font-serif text-sm font-bold text-[#193b2a] flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#245b45]" />
              Digital Consent & Benefit Payout Framework
            </h3>
            <div className="bg-[#f7f9f5] rounded-xl p-4 border border-[#e5ebe0] text-[11px] text-[#526655] space-y-1">
              <p>
                <strong>Consent Status:</strong> Confirmed on {profile.consentDate}
              </p>
              <p>
                Authorizes Panjdhara Private Limited and project verifiers to cross-reference satellite observations and field records for Verra VM0042 MRV. Ensures 80% net carbon finance proceeds are paid directly to farmer account via Ludhiana FPO aggregate.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {isSaved ? (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 size={14} /> Profile preferences saved
              </span>
            ) : <span />}
            <Button type="submit" size="sm" className="bg-[#245b45] text-white hover:bg-[#1a4333] text-xs">
              Update Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/profile')({
  head: () =>
    pageHead(
      'Farmer Profile | The Carbon Credit',
      'Manage producer registration and digital consent records.',
      '/farmer/profile'
    ),
  component: FarmerProfilePage,
});
