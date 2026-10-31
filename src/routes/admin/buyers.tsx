import { createFileRoute } from '@tanstack/react-router';
import { useState, useId } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Search,
  CheckCircle2,
  Lock,
  Unlock,
  ShieldCheck,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

interface BuyerAccountItem {
  id: string;
  contactName: string;
  organization: string;
  email: string;
  sector: string;
  kycTier: 'Tier 1 (Institutional)' | 'Tier 2 (Corporate)' | 'Tier 3 (Pending)';
  dataRoomGranted: boolean;
  inquiredVolumeTons: number;
  registeredDate: string;
}

const BUYER_ACCOUNTS: BuyerAccountItem[] = [
  {
    id: 'BUY-ACC-001',
    contactName: 'Sophia Lindqvist',
    organization: 'Global Climate Procurement Corp',
    email: 'sophia@climateprocurement.com',
    sector: 'Corporate Climate Strategy & Compliance',
    kycTier: 'Tier 1 (Institutional)',
    dataRoomGranted: true,
    inquiredVolumeTons: 15000,
    registeredDate: '2026-02-15',
  },
  {
    id: 'BUY-ACC-002',
    contactName: 'Marcus Vance',
    organization: 'Vance ESG Partners',
    email: 'm.vance@vance-esg.com',
    sector: 'European Net-Zero Offtake Fund',
    kycTier: 'Tier 1 (Institutional)',
    dataRoomGranted: true,
    inquiredVolumeTons: 25000,
    registeredDate: '2026-03-01',
  },
  {
    id: 'BUY-ACC-003',
    contactName: 'Arjun Singhal',
    organization: 'Tata Steel Sustainability Division',
    email: 'arjun.singhal@tatasteel.com',
    sector: 'Hard-to-Abate Industrial Decarbonisation',
    kycTier: 'Tier 2 (Corporate)',
    dataRoomGranted: false,
    inquiredVolumeTons: 8000,
    registeredDate: '2026-03-22',
  },
  {
    id: 'BUY-ACC-004',
    contactName: 'Elena Rostova',
    organization: 'Nordic Clean Energy Alliance',
    email: 'e.rostova@nordic-clean.eu',
    sector: 'Article 6.2 Bilateral ITMO Procurement',
    kycTier: 'Tier 3 (Pending)',
    dataRoomGranted: false,
    inquiredVolumeTons: 5000,
    registeredDate: '2026-04-10',
  },
];

export function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<BuyerAccountItem[]>(BUYER_ACCOUNTS);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputId = useId();

  const filtered = buyers.filter(
    (b) =>
      b.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDataRoom = (id: string) => {
    setBuyers((prev) =>
      prev.map((b) => (b.id === id ? { ...b, dataRoomGranted: !b.dataRoomGranted } : b))
    );
  };

  const totalDemand = buyers.reduce((sum, b) => sum + b.inquiredVolumeTons, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Buyer Registry & Due Diligence Access"
        description="Verify corporate KYC tiers, govern confidential data room access grants, and audit carbon volume demand pipelines."
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge label="Corporate Governance" />
            <span className="text-xs font-mono bg-[#193b2a] text-[#f5f5e8] px-3 py-1.5 rounded">
              {buyers.length} Institutional Buyers
            </span>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Total Demand Pipeline</div>
          <div className="text-2xl font-serif text-[#193b2a] font-bold mt-1">
            {totalDemand.toLocaleString()} tCO2e
          </div>
          <div className="text-xs text-[#5c7c46] mt-1">Non-binding offtake interest</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Data Rooms Granted</div>
          <div className="text-2xl font-serif text-emerald-800 font-bold mt-1">
            {buyers.filter((b) => b.dataRoomGranted).length} / {buyers.length}
          </div>
          <div className="text-xs text-emerald-600 mt-1">Authorized for raw telemetry review</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Price Protection</div>
          <div className="text-2xl font-serif text-[#193b2a] font-bold mt-1">100% Locked</div>
          <div className="text-xs text-[#5c7c46] mt-1">Speculative prices never displayed</div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white border border-[#dde4d9] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#dde4d9] flex items-center justify-between">
          <div className="relative w-80">
            <Search size={14} className="absolute left-3 top-3 text-[#708071]" />
            <input
              id={searchInputId}
              type="text"
              placeholder="Search buyer name, organization, email..."
              value={searchTerm}
              aria-label="Search buyer name, organization, email"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs focus:outline-none focus:border-[#193b2a]"
            />
          </div>
          <span className="text-xs text-[#708071]">NDA & KYC verification status</span>
        </div>

        <div className="divide-y divide-[#dde4d9]">
          {filtered.map((b) => (
            <div key={b.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f9faf7]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#193b2a]">{b.organization}</h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      b.kycTier.includes('Tier 1')
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.kycTier.includes('Tier 2')
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {b.kycTier}
                  </span>
                </div>
                <div className="text-xs text-[#708071] mt-1">
                  Lead: {b.contactName} ({b.email}) · Sector: {b.sector}
                </div>
                <div className="text-[11px] font-mono text-[#5c7c46] mt-0.5">
                  Requested Volume: {b.inquiredVolumeTons.toLocaleString()} tCO2e
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => toggleDataRoom(b.id)}
                  variant="outline"
                  className={`text-xs h-8 px-3 flex items-center gap-1.5 ${
                    b.dataRoomGranted
                      ? 'border-emerald-600 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {b.dataRoomGranted ? (
                    <>
                      <Unlock size={13} />
                      Data Room: Active
                    </>
                  ) : (
                    <>
                      <Lock size={13} />
                      Grant Data Room
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/admin/buyers')({
  head: () =>
    pageHead(
      'Institutional Buyers | VirsaFlow Admin',
      'Manage buyer accounts, KYC validation, and confidential data room access grants.',
      '/admin/buyers'
    ),
  component: AdminBuyersPage,
});
