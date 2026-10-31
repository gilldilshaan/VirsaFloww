import { createFileRoute } from '@tanstack/react-router';
import { useState, useId } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import {
  UserCheck,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  FileCheck2,
  Download,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

interface FarmerAdminItem {
  id: string;
  name: string;
  nameLocal: string;
  phone: string;
  village: string;
  district: string;
  agriStackUid: string;
  enrolledAreaAcres: number;
  parcelCount: number;
  jamabandiStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  revenueShareAgreed: boolean;
  registeredDate: string;
}

const FARMER_RECORDS: FarmerAdminItem[] = [
  {
    id: 'FAR-PB-001',
    name: 'Gurdev Singh Gill',
    nameLocal: 'ਗੁਰਦੇਵ ਸਿੰਘ ਗਿੱਲ',
    phone: '+91 98140 *****',
    village: 'Jodhan',
    district: 'Ludhiana',
    agriStackUid: 'PB-AGRI-4820-9912',
    enrolledAreaAcres: 11.86,
    parcelCount: 2,
    jamabandiStatus: 'VERIFIED',
    revenueShareAgreed: true,
    registeredDate: '2026-03-01',
  },
  {
    id: 'FAR-PB-002',
    name: 'Jaswant Singh Cheema',
    nameLocal: 'ਜਸਵੰਤ ਸਿੰਘ ਚੀਮਾ',
    phone: '+91 98722 *****',
    village: 'Sahnewal',
    district: 'Ludhiana',
    agriStackUid: 'PB-AGRI-5911-3042',
    enrolledAreaAcres: 18.5,
    parcelCount: 3,
    jamabandiStatus: 'VERIFIED',
    revenueShareAgreed: true,
    registeredDate: '2026-03-12',
  },
  {
    id: 'FAR-PB-003',
    name: 'Harpreet Singh Brar',
    nameLocal: 'ਹਰਪ੍ਰੀਤ ਸਿੰਘ ਬਰਾੜ',
    phone: '+91 98150 *****',
    village: 'Maur',
    district: 'Bathinda',
    agriStackUid: 'PB-AGRI-8830-1129',
    enrolledAreaAcres: 14.2,
    parcelCount: 2,
    jamabandiStatus: 'VERIFIED',
    revenueShareAgreed: true,
    registeredDate: '2026-03-24',
  },
  {
    id: 'FAR-PB-004',
    name: 'Harjit Kaur Sandhu',
    nameLocal: 'ਹਰਜੀਤ ਕੌਰ ਸੰਧੂ',
    phone: '+91 94631 *****',
    village: 'Bhawanigarh',
    district: 'Sangrur',
    agriStackUid: 'PB-AGRI-7712-4091',
    enrolledAreaAcres: 8.75,
    parcelCount: 1,
    jamabandiStatus: 'PENDING',
    revenueShareAgreed: true,
    registeredDate: '2026-04-05',
  },
];

export function AdminFarmersPage() {
  const [farmers, setFarmers] = useState<FarmerAdminItem[]>(FARMER_RECORDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const searchInputId = useId();
  const districtFilterId = useId();

  const filtered = farmers.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.agriStackUid.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDist = districtFilter === 'all' || f.district === districtFilter;
    return matchSearch && matchDist;
  });

  const totalAcres = farmers.reduce((sum, f) => sum + f.enrolledAreaAcres, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Farmer Registry & Land Tenancy Governance"
        description="Verify government AgriStack UIDs, Fard Jamabandi land records, and ensure 80% revenue benefit pass-through compliance."
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge label="Farmer Registry" />
            <span className="text-xs font-mono bg-[#193b2a] text-[#f5f5e8] px-3 py-1.5 rounded">
              {farmers.length} Enrolled Farmers
            </span>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Total Enrolled Area</div>
          <div className="text-2xl font-serif text-[#193b2a] font-bold mt-1">
            {totalAcres.toFixed(1)} Acres
          </div>
          <div className="text-xs text-[#5c7c46] mt-1">{(totalAcres * 0.404686).toFixed(1)} Hectares DSR/AWD</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Tenancy Verified</div>
          <div className="text-2xl font-serif text-emerald-800 font-bold mt-1">
            {farmers.filter((f) => f.jamabandiStatus === 'VERIFIED').length} / {farmers.length}
          </div>
          <div className="text-xs text-emerald-600 mt-1">Digital Jamabandi match</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">AgriStack Integration</div>
          <div className="text-2xl font-serif text-[#193b2a] font-bold mt-1">100%</div>
          <div className="text-xs text-[#5c7c46] mt-1">State UID registry linked</div>
        </div>
        <div className="bg-white border border-[#dde4d9] rounded-xl p-4">
          <div className="text-xs font-mono text-[#708071] uppercase">Revenue Agreement</div>
          <div className="text-2xl font-serif text-emerald-800 font-bold mt-1">80% Net</div>
          <div className="text-xs text-emerald-600 mt-1">Mandatory pass-through locked</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#dde4d9] rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3 top-3 text-[#708071]" />
          <input
            id={searchInputId}
            type="text"
            placeholder="Search farmer, village, UID..."
            value={searchTerm}
            aria-label="Search farmer, village, UID"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs focus:outline-none focus:border-[#193b2a]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor={districtFilterId} className="sr-only">Filter by district</label>
          <select
            id={districtFilterId}
            value={districtFilter}
            aria-label="Filter by district"
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs text-[#213c2b] focus:outline-none"
          >
            <option value="all">All Districts</option>
            <option value="Ludhiana">Ludhiana</option>
            <option value="Sangrur">Sangrur</option>
            <option value="Bathinda">Bathinda</option>
          </select>
        </div>
      </div>

      {/* Farmers Table */}
      <div className="bg-white border border-[#dde4d9] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f9faf7] border-b border-[#dde4d9] text-[#708071] font-mono uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Farmer Profile</th>
                <th className="px-5 py-3.5">AgriStack UID</th>
                <th className="px-5 py-3.5">Village / District</th>
                <th className="px-5 py-3.5">Enrolled Parcels</th>
                <th className="px-5 py-3.5">Tenancy Deed (Jamabandi)</th>
                <th className="px-5 py-3.5">80% Revenue Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dde4d9]">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-[#f9faf7] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-[#193b2a] flex items-center gap-2">
                      <span>{f.name}</span>
                      <span className="font-serif text-[#708071] font-normal text-[11px]">
                        ({f.nameLocal})
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-[#708071]">
                      ID: {f.id} · Phone: {f.phone}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-[#213c2b]">
                    {f.agriStackUid}
                  </td>
                  <td className="px-5 py-3.5 text-[#213c2b]">
                    {f.village}, {f.district}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-[#193b2a]">{f.enrolledAreaAcres} Acres</span>
                    <span className="text-[#708071] block text-[11px]">({f.parcelCount} Cadastral plots)</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                        f.jamabandiStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {f.jamabandiStatus === 'VERIFIED' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      {f.jamabandiStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
                      <CheckCircle2 size={12} />
                      FPO Signed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/admin/farmers')({
  head: () =>
    pageHead(
      'Farmer Registry | The Carbon Credit OS Admin',
      'Manage enrolled smallholder farmers, AgriStack IDs, and land records.',
      '/admin/farmers'
    ),
  component: AdminFarmersPage,
});
