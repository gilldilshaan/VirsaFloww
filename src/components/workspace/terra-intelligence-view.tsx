import { useState } from "react";
import { useTerraLedger } from "@/lib/terra-ledger/store";
import {
  Globe2,
  Layers,
  Calendar,
  CloudSun,
  Eye,
  Sliders,
  Sparkles,
  Info,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Maximize2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/shared/demo-badge";

export function TerraIntelligenceView() {
  const { field, satelliteObservations, demoState } = useTerraLedger();

  const [activeLayer, setActiveLayer] = useState<"rgb" | "ndvi" | "ndwi" | "cadastral">("ndvi");
  const [activeDateIndex, setActiveDateIndex] = useState<number>(2); // 2026-07-28
  const [opacity, setOpacity] = useState<number>(85);
  const [showBoundary, setShowBoundary] = useState<boolean>(true);
  const [showGpsPins, setShowGpsPins] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const currentObservation = satelliteObservations[activeDateIndex] || satelliteObservations[0];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#e2e8dc]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider mb-1">
            <Globe2 size={13} />
            Terra Intelligence · Geospatial MRV Engine
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight">
            Geospatial Evidence Workspace
          </h1>
          <p className="text-xs text-[#72816f] mt-1">
            Cadastral parcel {field.code} · Copernicus Sentinel-2 MSI multi-spectral time series and
            ground telemetry synthesis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DemoBadge label="Synthetic Calibrated Feed · Demo" />
        </div>
      </div>

      {/* Synthetic Demonstration Disclaimer Banner */}
      <div className="bg-[#f0f6ec] border border-[#cde0c5] rounded-xl p-3.5 flex items-start gap-3 text-xs text-[#2a4d36]">
        <Info size={16} className="text-[#3a754c] shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block text-[#1a3824]">
            Notice: Synthetic Demonstration Geospatial Feed
          </strong>
          <span>
            Spectral values and parcel overlays demonstrate TerraLedger's automated remote-sensing
            pipeline (Verra VM0042 / AMS-III.AU protocols). Imagery and vegetation indices are
            simulated for demonstrative validation; this output does not constitute third-party
            accredited certificate issuance.
          </span>
        </div>
      </div>

      {/* Main Geospatial Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left Column: Layer Controls */}
        <div className="space-y-4">
          <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
            <h3 className="text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider flex items-center gap-2 mb-3">
              <Layers size={14} className="text-[#5c7c46]" />
              Spectral Map Layers
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setActiveLayer("ndvi")}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                  activeLayer === "ndvi"
                    ? "bg-[#eef5e6] border-[#729e5a] text-[#1c3e27] font-semibold"
                    : "bg-white border-[#e3ebd9] text-[#4f6453] hover:bg-[#fafbf8]"
                }`}
              >
                <div>
                  <div className="font-medium">NDVI (Vegetation Index)</div>
                  <div className="text-[10px] text-[#788e7c]">Biomass growth & row emergence</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  10m
                </span>
              </button>

              <button
                onClick={() => setActiveLayer("ndwi")}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                  activeLayer === "ndwi"
                    ? "bg-[#eef5e6] border-[#729e5a] text-[#1c3e27] font-semibold"
                    : "bg-white border-[#e3ebd9] text-[#4f6453] hover:bg-[#fafbf8]"
                }`}
              >
                <div>
                  <div className="font-medium">NDWI (Water/Moisture Index)</div>
                  <div className="text-[10px] text-[#788e7c]">AWD drying cycles & ponding</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                  10m
                </span>
              </button>

              <button
                onClick={() => setActiveLayer("rgb")}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                  activeLayer === "rgb"
                    ? "bg-[#eef5e6] border-[#729e5a] text-[#1c3e27] font-semibold"
                    : "bg-white border-[#e3ebd9] text-[#4f6453] hover:bg-[#fafbf8]"
                }`}
              >
                <div>
                  <div className="font-medium">True Color (RGB Ortho)</div>
                  <div className="text-[10px] text-[#788e7c]">Visual surface reflectance</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  MSI
                </span>
              </button>

              <button
                onClick={() => setActiveLayer("cadastral")}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                  activeLayer === "cadastral"
                    ? "bg-[#eef5e6] border-[#729e5a] text-[#1c3e27] font-semibold"
                    : "bg-white border-[#e3ebd9] text-[#4f6453] hover:bg-[#fafbf8]"
                }`}
              >
                <div>
                  <div className="font-medium">Revenue Cadastral Overlay</div>
                  <div className="text-[10px] text-[#788e7c]">Jamabandi tenancy polygon</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                  &lt;1m
                </span>
              </button>
            </div>

            {/* Layer Opacity */}
            <div className="mt-4 pt-4 border-t border-[#edf2e8]">
              <div className="flex items-center justify-between text-xs text-[#4f6453] mb-1.5">
                <span>Layer Opacity</span>
                <span className="font-mono font-semibold">{opacity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full h-1.5 bg-[#e0ebd7] rounded-lg appearance-none cursor-pointer accent-[#245b45]"
              />
            </div>

            {/* Vector Overlays */}
            <div className="mt-4 pt-4 border-t border-[#edf2e8] space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBoundary}
                  onChange={(e) => setShowBoundary(e.target.checked)}
                  className="rounded text-[#245b45] focus:ring-[#245b45]"
                />
                <span className="text-[#314a38]">Show Parcel Boundary ({field.code})</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGpsPins}
                  onChange={(e) => setShowGpsPins(e.target.checked)}
                  className="rounded text-[#245b45] focus:ring-[#245b45]"
                />
                <span className="text-[#314a38]">Show Geotagged Evidence Pins</span>
              </label>
            </div>
          </div>

          {/* Spectral Legend */}
          <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
            <h4 className="text-[11px] font-mono text-[#69816a] uppercase mb-2">
              {activeLayer === "ndvi"
                ? "NDVI Scale (Biomass)"
                : activeLayer === "ndwi"
                  ? "NDWI Scale (Water Content)"
                  : "Spectral Palette"}
            </h4>
            <div className="h-3 w-full rounded bg-gradient-to-r from-[#d73027] via-[#ffffbf] to-[#1a9850]" />
            <div className="flex justify-between text-[10px] font-mono text-[#788e7c] mt-1">
              <span>{activeLayer === "ndvi" ? "0.0 (Bare Soil)" : "-0.3 (Dry)"}</span>
              <span>{activeLayer === "ndvi" ? "0.4 (Emerging)" : "0.0 (Moist)"}</span>
              <span>{activeLayer === "ndvi" ? "0.8+ (Dense)" : "+0.3 (Flooded)"}</span>
            </div>
          </div>
        </div>

        {/* Middle Columns: Interactive Map Canvas (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#12281c] border border-[#234b35] rounded-xl overflow-hidden shadow-md relative min-h-[460px] flex flex-col justify-between p-4">
            {/* Top Canvas Badges */}
            <div className="flex items-center justify-between gap-2 z-10 flex-wrap">
              <div className="bg-[#0b1b13]/80 backdrop-blur border border-[#ffffff20] text-white text-[11px] font-mono px-2.5 py-1 rounded-md flex items-center gap-2">
                <MapPin size={12} className="text-[#d6eaa6]" />
                <span>
                  Lat: {field.coordinates.lat.toFixed(4)}°N, Lng: {field.coordinates.lng.toFixed(4)}
                  °E
                </span>
              </div>

              <div className="bg-[#0b1b13]/80 backdrop-blur border border-[#ffffff20] text-[#d6eaa6] text-[11px] font-mono px-2.5 py-1 rounded-md">
                Pass: {currentObservation?.date} · {activeLayer.toUpperCase()}
              </div>
            </div>

            {/* Simulated Geospatial Canvas Visual */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Background Satellite Surface Texture */}
              <div
                className="w-full h-full absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    activeLayer === "ndvi"
                      ? "radial-gradient(circle at 55% 45%, #2d7a46 0%, #154528 50%, #0d2919 100%)"
                      : activeLayer === "ndwi"
                        ? "radial-gradient(circle at 55% 45%, #1e5f74 0%, #0f3542 50%, #0d2919 100%)"
                        : "radial-gradient(circle at 55% 45%, #60583b 0%, #363a24 50%, #0d2919 100%)",
                  opacity: opacity / 100,
                }}
              />

              {/* Grid overlay */}
              <div
                className="w-full h-full absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Field Boundary Polygon representation */}
              {showBoundary && (
                <div className="relative w-64 h-52 border-2 border-[#d6eaa6] bg-[#d6eaa6]/15 rounded-md flex items-center justify-center transform -rotate-3 shadow-lg">
                  <div className="absolute top-2 left-2 text-[10px] font-mono bg-[#0b1b13]/90 text-[#d6eaa6] px-1.5 py-0.5 rounded border border-[#d6eaa6]/40">
                    {field.code} ({field.areaHa} ha)
                  </div>

                  {/* AWD Tube in-situ sensor pin */}
                  <div className="absolute bottom-6 right-8 flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-sky-400 animate-ping absolute" />
                    <span className="w-3 h-3 rounded-full bg-sky-500 border border-white relative z-10" />
                    <span className="text-[9px] font-mono bg-[#0b1b13]/90 text-sky-200 px-1 rounded ml-1">
                      AWD Tube #1
                    </span>
                  </div>

                  {/* In-boundary photo pin */}
                  {demoState !== "unverified" && showGpsPins && (
                    <div className="absolute top-8 right-12 flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
                      <span className="text-[9px] font-mono bg-[#0b1b13]/90 text-emerald-300 px-1 rounded ml-1">
                        EV-005 (In-Boundary 2.1m)
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Flagged Out-of-boundary photo pin (420m away) */}
              {showGpsPins && (
                <div className="absolute top-12 left-8 flex items-center gap-1 transform translate-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white animate-pulse" />
                  <span className="text-[9px] font-mono bg-[#0b1b13]/90 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/50">
                    EV-003 (+420m Offset)
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between text-xs text-[#bacabd] z-10 bg-[#0b1b13]/80 backdrop-blur p-2 rounded-lg border border-[#ffffff15]">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono">Scale: 1:5,000 (100m)</span>
                <span>·</span>
                <span className="text-[10px] font-mono">EPSG: 4326 (WGS84)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono text-white">
                  Cloud: {currentObservation?.cloudCoverPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Multi-temporal Timeline Slider */}
          <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[#5c7c46]" />
                <h3 className="text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider">
                  Spectral Pass Timeline (Kharif 2026)
                </h3>
              </div>
              <div className="text-[11px] font-mono text-[#5c7c46]">
                Pass {activeDateIndex + 1} of {satelliteObservations.length}
              </div>
            </div>

            {/* Timeline Steps Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {satelliteObservations.map((obs, idx) => (
                <button
                  key={obs.id}
                  onClick={() => setActiveDateIndex(idx)}
                  className={`p-2 rounded-lg border text-left text-xs transition-all ${
                    activeDateIndex === idx
                      ? "bg-[#245b45] text-white border-[#245b45] shadow-xs"
                      : "bg-[#f8faf6] border-[#e2e8dc] text-[#3d5341] hover:bg-[#edf2e8]"
                  }`}
                >
                  <div className="font-mono text-[10px] opacity-80">{obs.date}</div>
                  <div className="font-semibold text-xs mt-0.5 truncate">
                    NDVI: {obs.meanNdvi.toFixed(2)}
                  </div>
                  <div className="text-[9px] opacity-75 mt-0.5 truncate">
                    {obs.surfaceWaterDetected ? "Surface Water" : "Dry Surface"}
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-[#526a57] pt-1 italic">
              Observation Notes: {currentObservation?.notes}
            </p>
          </div>
        </div>

        {/* Right Column: Data Quality & Remote Sensing Indicators */}
        <div className="space-y-4">
          <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#5c7c46]" />
              Data Quality Indicators
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-[#f8faf6] rounded-lg border border-[#e2ebd9]">
                <div className="flex items-center justify-between text-[#69816a] font-mono text-[10px]">
                  <span>CLOUD CLEARANCE</span>
                  <span className="text-emerald-700 font-bold">OPTIMAL</span>
                </div>
                <div className="text-sm font-semibold text-[#193b2a] mt-0.5">
                  {currentObservation?.cloudCoverPercent}% Cloud Cover
                </div>
                <div className="text-[10px] text-[#788e7c] mt-0.5">
                  Under 5.0% threshold required for valid radiometric calculation.
                </div>
              </div>

              <div className="p-2.5 bg-[#f8faf6] rounded-lg border border-[#e2ebd9]">
                <div className="flex items-center justify-between text-[#69816a] font-mono text-[10px]">
                  <span>ATMOSPHERIC LEVEL</span>
                  <span className="text-[#245b45] font-bold">BOA LEVEL-2A</span>
                </div>
                <div className="text-sm font-semibold text-[#193b2a] mt-0.5">
                  Bottom-Of-Atmosphere
                </div>
                <div className="text-[10px] text-[#788e7c] mt-0.5">
                  Sen2Cor corrected surface reflectance with 10m spatial resolution.
                </div>
              </div>

              <div className="p-2.5 bg-[#f8faf6] rounded-lg border border-[#e2ebd9]">
                <div className="flex items-center justify-between text-[#69816a] font-mono text-[10px]">
                  <span>SENSOR SATELLITE</span>
                  <span className="text-purple-700 font-bold">SENTINEL-2 MSI</span>
                </div>
                <div className="text-sm font-semibold text-[#193b2a] mt-0.5">
                  {currentObservation?.sensor}
                </div>
                <div className="text-[10px] text-[#788e7c] mt-0.5">
                  Solar azimuth: {currentObservation?.sunAzimuthDeg}° · Calibrated.
                </div>
              </div>

              <div className="p-2.5 bg-[#f8faf6] rounded-lg border border-[#e2ebd9]">
                <div className="flex items-center justify-between text-[#69816a] font-mono text-[10px]">
                  <span>GROUND CORROBORATION</span>
                  <span className="text-sky-700 font-bold">ALIGNED</span>
                </div>
                <div className="text-sm font-semibold text-[#193b2a] mt-0.5">
                  AWD Drying Corroboration
                </div>
                <div className="text-[10px] text-[#788e7c] mt-0.5">
                  Piezometer drop coincides with negative NDWI signature.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Export */}
          <div className="bg-[#173a2b] text-white rounded-xl p-4 shadow-xs space-y-2.5">
            <h4 className="text-xs font-semibold uppercase font-mono text-[#d6eaa6]">
              GIS Layer Export
            </h4>
            <p className="text-[11px] text-[#bacabd]">
              Export geo-referenced multi-band GeoTIFF and cadastral GeoJSON files for third-party
              auditing.
            </p>
            <Button
              size="sm"
              className="w-full bg-[#d6eaa6] text-[#102e20] hover:bg-[#c2de8c] text-xs font-semibold h-8"
              onClick={() => alert("Synthetic demonstration GeoJSON parcel envelope downloaded.")}
            >
              Export Boundary GeoJSON
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
