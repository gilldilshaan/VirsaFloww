import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { registerFarmerField } from '@/lib/farmer/farmer-service';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { MapPin, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function RegisterFieldPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [code, setCode] = useState(`PB-LUD-${Math.floor(100 + Math.random() * 900)}`);
  const [district, setDistrict] = useState('Ludhiana');
  const [acres, setAcres] = useState('4.0');
  const [practice, setPractice] = useState('Direct Seeded Rice (DSR) + Alternate Wetting & Drying');
  const [crop, setCrop] = useState('PR-126 Basmati / Paddy');
  const [lat, setLat] = useState('30.9125');
  const [lng, setLng] = useState('75.8360');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const areaAcres = parseFloat(acres) || 4.0;
    const areaHa = parseFloat((areaAcres * 0.404686).toFixed(2));

    registerFarmerField({
      name: name || `Gill Agro-Plot (${district})`,
      code,
      district,
      areaHa,
      areaAcres,
      practice,
      crop,
      season: 'Kharif 2026',
      coordinates: {
        lat: parseFloat(lat) || 30.912,
        lng: parseFloat(lng) || 75.836,
      },
    });

    setIsSuccess(true);
    setTimeout(() => {
      router.navigate({ to: '/farmer/fields' as any });
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="ਖੇਤ ਦਰਜ ਕਰੋ · Register New Field"
        description="Add a new agricultural plot to your Kharif 2026 DSR monitoring portfolio."
        badge={<DemoBadge label="Parcel Onboarding" />}
      />

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#dde4d9] shadow-2xs space-y-6">
        {isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 size={40} className="text-emerald-600 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#193b2a]">ਖੇਤ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਹੋ ਗਿਆ</h3>
            <p className="text-xs text-[#708071]">Field registered successfully. Redirecting to fields list...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#193b2a] block">Plot Identification / Nickname</label>
              <input
                type="text"
                required
                placeholder="e.g. Gill Agro-Plot 6 (Tubewell Side)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">District (Punjab)</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                >
                  <option value="Ludhiana">Ludhiana (ਲੁਧਿਆਣਾ)</option>
                  <option value="Sangrur">Sangrur (ਸੰਗਰੂਰ)</option>
                  <option value="Bathinda">Bathinda (ਬਠਿੰਡਾ)</option>
                  <option value="Patiala">Patiala (ਪਟਿਆਲਾ)</option>
                  <option value="Amritsar">Amritsar (ਅੰਮ੍ਰਿਤਸਰ)</option>
                  <option value="Mansa">Mansa (ਮਾਨਸਾ)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">Parcel Area (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={acres}
                  onChange={(e) => setAcres(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">Latitude Coordinate</label>
                <input
                  type="text"
                  required
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">Longitude Coordinate</label>
                <input
                  type="text"
                  required
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#193b2a] block">Enrolled Agronomic Practice</label>
              <select
                value={practice}
                onChange={(e) => setPractice(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
              >
                <option value="Direct Seeded Rice (DSR) + Alternate Wetting & Drying">
                  Direct Seeded Rice (DSR) + Alternate Wetting & Drying
                </option>
                <option value="Alternate Wetting & Drying (AWD) Only">
                  Alternate Wetting & Drying (AWD) Only
                </option>
                <option value="Crop Residue Retention / Happy Seeder">
                  Crop Residue Retention / Happy Seeder
                </option>
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" size="sm" className="bg-[#245b45] text-white hover:bg-[#1a4333] text-xs h-10 px-6">
                <PlusCircle size={14} className="mr-1.5" />
                Register Parcel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/register-field')({
  head: () =>
    pageHead(
      'Register Field | The Carbon Credit',
      'Onboard new field parcels for direct seeding and AWD monitoring in Punjab.',
      '/farmer/register-field'
    ),
  component: RegisterFieldPage,
});
