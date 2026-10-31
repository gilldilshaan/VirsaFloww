import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Shield,
  Layers,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function AdminSettingsPage() {
  const [photoBufferM, setPhotoBufferM] = useState(15);
  const [waterMinNdwi, setWaterMinNdwi] = useState(0.3);
  const [minAwdDryDays, setMinAwdDryDays] = useState(7);
  const [farmerRevenueShareMin, setFarmerRevenueShareMin] = useState(80);
  const [maxCloudCoverPct, setMaxCloudCoverPct] = useState(15);
  const [sowingLagDays, setSowingLagDays] = useState(10);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('MRV rule thresholds and protocol invariants saved successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleReset = () => {
    setPhotoBufferM(15);
    setWaterMinNdwi(0.3);
    setMinAwdDryDays(7);
    setFarmerRevenueShareMin(80);
    setMaxCloudCoverPct(15);
    setSowingLagDays(10);
    setFeedback('Reset to ISO 14064-2 & Verra VM0042 default values.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="MRV Rules Engine & Threshold Parameters"
        description="Configure deterministic validation rules, spatial tolerance buffers, and remote sensing thresholds across the portfolio."
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge label="Rule Parameters" />
            <span className="text-xs font-mono bg-[#193b2a] text-[#f5f5e8] px-3 py-1.5 rounded">
              VM0042 Protocol Active
            </span>
          </div>
        }
      />

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 size={14} />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-[#dde4d9] rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spatial buffer */}
          <div className="space-y-1.5 p-4 bg-[#f9faf7] rounded-xl border border-[#dde4d9]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#193b2a]">
                RULE-R3: Photo Geotag Buffer Tolerance
              </label>
              <span className="font-mono text-xs font-bold text-[#193b2a]">{photoBufferM} Meters</span>
            </div>
            <p className="text-[11px] text-[#708071]">
              Maximum allowed distance between EXIF photograph coordinates and registered parcel boundary.
            </p>
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={photoBufferM}
              onChange={(e) => setPhotoBufferM(Number(e.target.value))}
              className="w-full accent-[#193b2a]"
            />
          </div>

          {/* Sentinel-2 NDWI water detection */}
          <div className="space-y-1.5 p-4 bg-[#f9faf7] rounded-xl border border-[#dde4d9]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#193b2a]">
                RULE-R4: Sentinel-2 NDWI Water Threshold
              </label>
              <span className="font-mono text-xs font-bold text-[#193b2a]">{waterMinNdwi.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-[#708071]">
              Normalized Difference Water Index above which standing puddle water is flagged in DSR parcels.
            </p>
            <input
              type="range"
              min={0.1}
              max={0.5}
              step={0.02}
              value={waterMinNdwi}
              onChange={(e) => setWaterMinNdwi(Number(e.target.value))}
              className="w-full accent-[#193b2a]"
            />
          </div>

          {/* Sowing lag tolerance */}
          <div className="space-y-1.5 p-4 bg-[#f9faf7] rounded-xl border border-[#dde4d9]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#193b2a]">
                RULE-R2: Sowing Lag Tolerance
              </label>
              <span className="font-mono text-xs font-bold text-[#193b2a]">{sowingLagDays} Days</span>
            </div>
            <p className="text-[11px] text-[#708071]">
              Maximum allowable window between pre-sowing irrigation log and DSR drill sowing date.
            </p>
            <input
              type="range"
              min={3}
              max={21}
              step={1}
              value={sowingLagDays}
              onChange={(e) => setSowingLagDays(Number(e.target.value))}
              className="w-full accent-[#193b2a]"
            />
          </div>

          {/* Farmer revenue sharing floor */}
          <div className="space-y-1.5 p-4 bg-[#f9faf7] rounded-xl border border-[#dde4d9]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#193b2a]">
                RULE-R5: Smallholder Revenue Share Minimum
              </label>
              <span className="font-mono text-xs font-bold text-[#193b2a]">{farmerRevenueShareMin}%</span>
            </div>
            <p className="text-[11px] text-[#708071]">
              Mandatory net carbon finance pass-through percentage to participating farming households.
            </p>
            <input
              type="range"
              min={70}
              max={90}
              step={1}
              value={farmerRevenueShareMin}
              onChange={(e) => setFarmerRevenueShareMin(Number(e.target.value))}
              className="w-full accent-[#193b2a]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#dde4d9]">
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            className="text-xs border-[#dde4d9] flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            Reset to Standard Defaults
          </Button>

          <Button
            type="submit"
            className="bg-[#193b2a] text-[#f5f5e8] hover:bg-[#224e37] text-xs px-5 py-2 flex items-center gap-1.5"
          >
            <Save size={14} />
            Save Parameter Governance
          </Button>
        </div>
      </form>
    </div>
  );
}

export const Route = createFileRoute('/admin/settings')({
  head: () =>
    pageHead(
      'System Settings | The Carbon Credit OS Admin',
      'MRV rules engine parameters, spatial buffer tolerances, and platform thresholds.',
      '/admin/settings'
    ),
  component: AdminSettingsPage,
});
