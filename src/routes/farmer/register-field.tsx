import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { registerFarmerField } from '@/lib/farmer/farmer-service';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { FieldMap } from '@/components/geospatial/field-map';
import { api } from '@/lib/api/client';
import { MapPin, PlusCircle, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
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
  const [polygonCoords, setPolygonCoords] = useState<[number, number][]>([]);
  const [isMapDrawingOpen, setIsMapDrawingOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePolygonDrawn = (coords: [number, number][], ha: number, calculatedAcres: number) => {
    setPolygonCoords(coords);
    setAcres(calculatedAcres.toFixed(1));
    if (coords[0]) {
      setLng(coords[0][0].toFixed(4));
      setLat(coords[0][1].toFixed(4));
    }
    setIsMapDrawingOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const areaAcres = parseFloat(acres) || 4.0;
    const areaHa = parseFloat((areaAcres * 0.404686).toFixed(2));

    try {
      // Submit to FastAPI backend /api/fields
      await api.post('/fields', {
        id: code,
        name: name || `Gill Agro-Plot (${district})`,
        district,
        areaHectares: areaHa,
        coordinates: polygonCoords.length >= 3 ? polygonCoords : [
          [parseFloat(lng), parseFloat(lat)],
          [parseFloat(lng) + 0.005, parseFloat(lat)],
          [parseFloat(lng) + 0.005, parseFloat(lat) + 0.005],
          [parseFloat(lng), parseFloat(lat) + 0.005],
          [parseFloat(lng), parseFloat(lat)],
        ],
      });
    } catch {
      // offline fallback
    }

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

    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      router.navigate({ to: '/farmer/fields' as any });
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="ਖੇਤ ਦਰਜ ਕਰੋ · Register New Field"
        description="Add a new agricultural parcel to your Kharif 2026 DSR monitoring portfolio with automated boundary enclosure."
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
                  step="0.1"
                  required
                  value={acres}
                  onChange={(e) => setAcres(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>
            </div>

            {/* Interactive Cadastral Map Drawing Button & Drawer */}
            <div className="border border-[#dde4d9] rounded-xl p-4 bg-[#f9faf7] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#193b2a] block">Cadastral Boundary Mapping</span>
                  <span className="text-[11px] text-[#708071]">
                    {polygonCoords.length >= 3
                      ? `Mapped with ${polygonCoords.length} vertices (${acres} Acres calculated)`
                      : 'Draw parcel boundary on satellite map to verify spatial enclosure.'}
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={() => setIsMapDrawingOpen(!isMapDrawingOpen)}
                  variant="outline"
                  size="sm"
                  className="text-xs border-[#193b2a] text-[#193b2a] gap-1"
                >
                  <Layers size={13} />
                  {isMapDrawingOpen ? 'Close Map' : 'Open Parcel Drawing Tool'}
                </Button>
              </div>

              {isMapDrawingOpen && (
                <div className="pt-2">
                  <FieldMap
                    isDrawingMode={true}
                    onPolygonComplete={handlePolygonDrawn}
                    height="380px"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">Sowing & Water Practice</label>
                <select
                  value={practice}
                  onChange={(e) => setPractice(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                >
                  <option value="Direct Seeded Rice (DSR) + Alternate Wetting & Drying">
                    Direct Seeded Rice (DSR) + Alternate Wetting & Drying
                  </option>
                  <option value="AWD Irrigation with PVC Tube Monitoring">
                    AWD Irrigation with PVC Tube Monitoring
                  </option>
                  <option value="Crop Residue Management / Happy Seeder">
                    Crop Residue Management / Happy Seeder
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">Target Crop Variety</label>
                <input
                  type="text"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#dde4d9] flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.navigate({ to: '/farmer/fields' as any })}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                size="sm"
                className="bg-[#245b45] text-white hover:bg-[#1a4333] text-xs h-9 px-4"
              >
                {isSubmitting ? 'Registering Parcel...' : 'Save & Onboard Parcel'}
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
      'Register New Field | The Carbon Credit OS',
      'Onboard a new agricultural parcel with MapLibre GL polygon mapping and geodesic area calculation.',
      '/farmer/register-field'
    ),
  component: RegisterFieldPage,
});
