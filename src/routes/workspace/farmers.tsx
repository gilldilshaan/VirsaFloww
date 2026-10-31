import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { Users, Search, MapPin, CheckCircle2, ShieldCheck, Phone } from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

const INITIAL_REGISTRY_FARMERS = [
  {
    id: 'FARMER-PB-042',
    name: 'Gurdev Singh Gill',
    nameLocal: 'ਗੁਰਦੇਵ ਸਿੰਘ ਗਿੱਲ',
    phone: '+91 98141 55678',
    district: 'Ludhiana',
    cluster: 'Ludhiana Central FPO',
    parcelsCount: 2,
    totalAreaAcres: 17.79,
    practice: 'DSR + AWD',
    consent: 'Verified (May 2026)',
    status: 'Active',
  },
  {
    id: 'FARMER-PB-043',
    name: 'Harpreet Singh Dhillon',
    nameLocal: 'ਹਰਪ੍ਰੀਤ ਸਿੰਘ ਢਿੱਲੋਂ',
    phone: '+91 98722 33445',
    district: 'Sangrur',
    cluster: 'Sangrur Progressive Farmers Society',
    parcelsCount: 3,
    totalAreaAcres: 24.50,
    practice: 'Direct Seeded Rice',
    consent: 'Verified (May 2026)',
    status: 'Active',
  },
  {
    id: 'FARMER-PB-044',
    name: 'Manjit Kaur Sandhu',
    nameLocal: 'ਮਨਜੀਤ ਕੌਰ ਸੰਧੂ',
    phone: '+91 98150 99881',
    district: 'Bathinda',
    cluster: 'Malwa Residue Cluster',
    parcelsCount: 1,
    totalAreaAcres: 9.80,
    practice: 'Happy Seeder Retention',
    consent: 'Verified (Apr 2026)',
    status: 'Active',
  },
  {
    id: 'FARMER-PB-045',
    name: 'Jagtar Singh Brar',
    nameLocal: 'ਜਗਤਾਰ ਸਿੰਘ ਬਰਾੜ',
    phone: '+91 99880 77665',
    district: 'Mansa',
    cluster: 'Mansa South Water Society',
    parcelsCount: 2,
    totalAreaAcres: 14.20,
    practice: 'AWD Irrigation',
    consent: 'Pending Renewal',
    status: 'In Review',
  },
];

export function WorkspaceFarmersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return INITIAL_REGISTRY_FARMERS;
    return INITIAL_REGISTRY_FARMERS.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.district.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.cluster.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Farmer Registry"
        description="Comprehensive directory of participating smallholders enrolled in Punjab agricultural MRV clusters."
        badge={<DemoBadge label="Smallholder Registry" />}
      />

      <div className="bg-white rounded-xl p-4 border border-[#dde4d9] shadow-2xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-[#708071]" size={15} />
          <input
            type="text"
            placeholder="Search by name, district, or farmer ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg text-[#193b2a] outline-none focus:border-[#245b45]"
          />
        </div>
        <div className="text-xs text-[#708071]">
          Enrolled Farmers: <strong className="text-[#193b2a]">{INITIAL_REGISTRY_FARMERS.length}</strong>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#dde4d9] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#fafbf9] border-b border-[#dde4d9] text-[10px] font-mono uppercase text-[#708071]">
              <tr>
                <th className="py-3 px-4">Farmer ID</th>
                <th className="py-3 px-4">Producer Name</th>
                <th className="py-3 px-4">District / FPO Cluster</th>
                <th className="py-3 px-4">Parcels</th>
                <th className="py-3 px-4">Enrolled Area</th>
                <th className="py-3 px-4">Practice</th>
                <th className="py-3 px-4">Consent Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3ec]">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-[#f7faf5] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#193b2a]">{f.id}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#193b2a] block">{f.name}</span>
                    <span className="text-[11px] font-pa text-[#5c7c46]">{f.nameLocal}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[#193b2a] font-medium block">{f.district}</span>
                    <span className="text-[10px] text-[#708071]">{f.cluster}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#193b2a]">{f.parcelsCount}</td>
                  <td className="py-3.5 px-4 font-mono font-medium">{f.totalAreaAcres} ac</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#e8efe5] text-[#245b45] text-[11px] font-medium">
                      {f.practice}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
                      <CheckCircle2 size={12} /> {f.consent}
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

export const Route = createFileRoute('/workspace/farmers')({
  head: () =>
    pageHead(
      'Farmer Registry | The Carbon Credit OS',
      'Smallholder producer registry and consent management.',
      '/workspace/farmers'
    ),
  component: WorkspaceFarmersPage,
});
