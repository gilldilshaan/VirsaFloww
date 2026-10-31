import { useState } from 'react';
import { DEFAULT_DEMO_BUYER_PROFILE } from '@/lib/buyer/buyer-service';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { LogOut, Mail, Building, Calendar, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function BuyerProfileView() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(DEFAULT_DEMO_BUYER_PROFILE);
  const [isSaved, setIsSaved] = useState(false);

  // Preference switches
  const [alertNewProjects, setAlertNewProjects] = useState(true);
  const [alertSatUpdates, setAlertSatUpdates] = useState(true);
  const [alertAuditReports, setAlertAuditReports] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Institutional Buyer Profile"
        description="Manage your institutional entity details, due diligence authorizations, and carbon portfolio notifications."
        badge={<DemoBadge label="Demonstration Profile" />}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-xs text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut size={13} className="mr-1.5" />
            Sign Out / Switch Role
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Account Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#dde4d9] shadow-2xs space-y-5 text-center">
          <div className="w-20 h-20 bg-[#e8efe5] text-[#245b45] rounded-full flex items-center justify-center mx-auto text-2xl font-bold font-serif">
            {profile.organization.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#193b2a]">{profile.organization}</h3>
            <p className="text-xs text-[#708071] mt-0.5">{profile.name}</p>
          </div>

          <div className="pt-3 border-t border-[#f0f3ec] text-left text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#526655]">
              <Mail size={13} className="text-[#245b45]" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-[#526655]">
              <Building size={13} className="text-[#245b45]" />
              <span>{profile.sector}</span>
            </div>
            <div className="flex items-center gap-2 text-[#526655]">
              <Calendar size={13} className="text-[#245b45]" />
              <span>Enrolled: {profile.registeredAt}</span>
            </div>
          </div>

          <div className="rounded-xl bg-[#f4f7f1] p-3 text-[11px] text-left border border-[#e5ebe0] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#193b2a]">
              <ShieldCheck size={14} className="text-[#245b45]" />
              <span>Due Diligence Access Level</span>
            </div>
            <p className="text-[#708071] text-[10px]">
              Tier 1 Institutional Access: Full remote sensing telemetry and PDD inspection.
            </p>
          </div>
        </div>

        {/* Right Card: Organization Settings & Preferences (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-[#dde4d9] shadow-2xs space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#193b2a]">Corporate Entity Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#193b2a] block">Organization Legal Name</label>
                <input
                  type="text"
                  value={profile.organization}
                  onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#193b2a] block">Primary Sustainability Officer</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#193b2a] block">Official Business Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#193b2a] block">Industry Classification</label>
                <input
                  type="text"
                  value={profile.sector}
                  onChange={(e) => setProfile({ ...profile, sector: e.target.value })}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="pt-4 border-t border-[#f0f3ec] space-y-3">
              <h4 className="text-xs font-semibold text-[#193b2a] uppercase tracking-wider font-mono">
                Telemetry & Pipeline Subscriptions
              </h4>

              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-[#e5ebe0] bg-[#fafbf9] cursor-pointer">
                  <span className="text-[#3b5440]">New publication-approved agricultural project alerts</span>
                  <input
                    type="checkbox"
                    checked={alertNewProjects}
                    onChange={(e) => setAlertNewProjects(e.target.checked)}
                    className="rounded text-[#245b45]"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-[#e5ebe0] bg-[#fafbf9] cursor-pointer">
                  <span className="text-[#3b5440]">Sentinel-2 10m NDVI/NDWI seasonal updates</span>
                  <input
                    type="checkbox"
                    checked={alertSatUpdates}
                    onChange={(e) => setAlertSatUpdates(e.target.checked)}
                    className="rounded text-[#245b45]"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-[#e5ebe0] bg-[#fafbf9] cursor-pointer">
                  <span className="text-[#3b5440]">Third-party accredited VVB audit milestone reports</span>
                  <input
                    type="checkbox"
                    checked={alertAuditReports}
                    onChange={(e) => setAlertAuditReports(e.target.checked)}
                    className="rounded text-[#245b45]"
                  />
                </label>
              </div>
            </div>

            {/* Compliance Acknowledgement */}
            <div className="rounded-xl bg-[#f7f9f5] p-3.5 border border-[#dde4d9] text-[11px] text-[#526655] space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-[#193b2a]">
                <Lock size={13} className="text-[#245b45]" />
                <span>Integrity & Governance Acknowledgement</span>
              </div>
              <p className="text-[10px] text-[#708071] leading-relaxed">
                By maintaining institutional due diligence access, you acknowledge that all pipeline projects are undergoing field and remote sensing evaluation. No carbon credits are traded or settled through this portal prior to registry issuance.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              {isSaved ? (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={14} /> Profile preferences updated
                </span>
              ) : (
                <span />
              )}
              <Button type="submit" size="sm" className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333]">
                Save Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
