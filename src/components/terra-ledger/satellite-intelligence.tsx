import { useState } from 'react';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import { SatelliteObservation } from '@/lib/terra-ledger/types';
import { FieldMap } from '@/components/geospatial/field-map';
import {
  Satellite,
  Calendar,
  CloudSun,
  Layers,
  TrendingUp,
  Droplets,
  Sprout,
  AlertCircle,
  RefreshCw,
  Sliders,
  Check,
  Eye,
  Info,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SatelliteIntelligence() {
  const { satelliteObservations, field } = useTerraLedger();

  const [selectedObsId, setSelectedObsId] = useState<string>(satelliteObservations[2]?.id || 'S2A_20260728_PB');
  const [compareObsId, setCompareObsId] = useState<string>(satelliteObservations[0]?.id || 'S2A_20260614_PB');
  const [activeSpectralIndex, setActiveSpectralIndex] = useState<'NDVI' | 'NDWI' | 'RGB'>('NDVI');
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [viewFormat, setViewFormat] = useState<'maplibre' | 'spectral'>('maplibre');
  const [uiState, setUiState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');

  const defaultObs = satelliteObservations[0] as SatelliteObservation;
  const selectedObs = satelliteObservations.find((o) => o.id === selectedObsId) ?? defaultObs;
  const compareObs = satelliteObservations.find((o) => o.id === compareObsId) ?? defaultObs;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider mb-1">
            <Satellite size={13} />
            Earth Observation & Spectral Analysis
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight">
            Satellite Intelligence
          </h1>
          <p className="text-xs text-[#72816f] mt-1">
            Copernicus Sentinel-2 MSI Level-2A multi-spectral time-series for Parcel {field.code}.
          </p>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-white border border-[#dfe6d9] rounded-lg p-1 flex items-center gap-1 text-[11px] font-mono">
            <button
              onClick={() => setViewFormat('maplibre')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewFormat === 'maplibre' ? 'bg-[#245b45] text-white font-medium' : 'text-[#72816f]'
              }`}
            >
              MapLibre WebGL
            </button>
            <button
              onClick={() => setViewFormat('spectral')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewFormat === 'spectral' ? 'bg-[#245b45] text-white font-medium' : 'text-[#72816f]'
              }`}
            >
              Spectral Raster
            </button>
          </div>
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="bg-slate-900 border border-emerald-900/40 rounded-xl p-3.5 text-slate-200 flex items-start gap-3 text-xs">
        <Info size={16} className="text-emerald-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <strong className="text-white block font-medium">
            Demonstration Earth Observation Engine
          </strong>
          <span className="text-slate-300">
            Observation scenes reflect actual Copernicus Sentinel-2 MSI phenology models for Punjab Kharif Direct Seeded Rice and Alternate Wetting & Drying cycles. Measurements are illustrative and clearly labeled.
          </span>
        </div>
      </div>

      {/* Main Viewport Handler */}
      {uiState === 'loading' && (
        <div className="bg-white border border-[#dfe6d9] rounded-xl p-16 text-center space-y-3">
          <RefreshCw size={28} className="animate-spin text-[#245b45] mx-auto" />
          <h3 className="font-serif text-lg text-[#193b2a]">Querying Copernicus Open Access Hub...</h3>
          <p className="text-xs text-[#72816f]">Processing Level-2A Bottom-Of-Atmosphere surface reflectance tile 43UFR</p>
        </div>
      )}

      {uiState === 'empty' && (
        <div className="bg-white border border-[#dfe6d9] rounded-xl p-16 text-center space-y-3">
          <Satellite size={28} className="text-[#809c88] mx-auto" />
          <h3 className="font-serif text-lg text-[#193b2a]">No Sentinel-2 Observations in Selected Date Window</h3>
          <p className="text-xs text-[#72816f]">Try widening your date window or adjusting the cloud-cover threshold filter.</p>
          <Button size="sm" onClick={() => setUiState('normal')} className="bg-[#245b45] text-white text-xs">
            Reset Date Filters
          </Button>
        </div>
      )}

      {uiState === 'error' && (
        <div className="bg-white border border-red-200 rounded-xl p-12 text-center space-y-3">
          <AlertCircle size={28} className="text-red-500 mx-auto" />
          <h3 className="font-serif text-lg text-red-900">Sentinel Hub API Service Unavailable</h3>
          <p className="text-xs text-[#72816f]">Failed to fetch raster spectral data for tile 43UFR. Error HTTP 503.</p>
          <Button size="sm" onClick={() => setUiState('normal')} className="bg-red-700 text-white text-xs">
            Retry Request
          </Button>
        </div>
      )}

      {uiState === 'normal' && (
        <>
          {/* Timeline & Date Selection Bar */}
          <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-mono text-[#72816f] uppercase mr-2">Observation Date:</span>
              {satelliteObservations.map((obs) => {
                const isSelected = selectedObs.id === obs.id;
                return (
                  <button
                    key={obs.id}
                    onClick={() => setSelectedObsId(obs.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#193b2a] text-[#d6eaa6] font-semibold shadow-xs'
                        : 'bg-[#f4f6f0] text-[#213c2b] hover:bg-[#edf0e7]'
                    }`}
                  >
                    <Calendar size={12} className={isSelected ? 'text-[#d6eaa6]' : 'text-[#72816f]'} />
                    {obs.date}
                  </button>
                );
              })}
            </div>

            {/* Comparison Mode Toggle */}
            <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-[#edf0e7]">
              <label className="text-xs text-[#72816f] flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={comparisonMode}
                  onChange={(e) => setComparisonMode(e.target.checked)}
                  className="rounded text-[#245b45] accent-[#245b45]"
                />
                <span className="font-medium text-[#213c2b]">Compare with Baseline</span>
              </label>

              {comparisonMode && (
                <select
                  value={compareObsId}
                  onChange={(e) => setCompareObsId(e.target.value)}
                  className="text-xs font-mono bg-[#f4f6f0] border border-[#d8e1d4] rounded px-2 py-1 text-[#213c2b] outline-none"
                >
                  {satelliteObservations.map((obs) => (
                    <option key={obs.id} value={obs.id}>
                      {obs.date} ({obs.id.slice(0, 3)})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Spectral Index Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Raster Map View (8 cols) */}
            <div className="lg:col-span-8 bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#edf0e7] mb-4 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#193b2a]">
                    {viewFormat === 'maplibre' ? 'Interactive MapLibre GL Layer' : `Spectral Visualizer: ${activeSpectralIndex}`}
                  </span>
                  <span className="text-[10px] font-mono bg-[#e8f4ea] text-[#245b45] px-2 py-0.5 rounded border border-[#c3e6cb]">
                    {selectedObs.date}
                  </span>
                  {comparisonMode && (
                    <span className="text-[10px] font-mono bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
                      vs {compareObs.date}
                    </span>
                  )}
                </div>

                {viewFormat === 'spectral' && (
                  <div className="inline-flex rounded-md p-0.5 bg-[#f4f6f0] border border-[#dfe6d9] text-xs font-mono">
                    <button
                      onClick={() => setActiveSpectralIndex('NDVI')}
                      className={`px-3 py-1 rounded transition-colors ${
                        activeSpectralIndex === 'NDVI'
                          ? 'bg-[#193b2a] text-[#d6eaa6] font-semibold'
                          : 'text-[#72816f] hover:text-[#213c2b]'
                      }`}
                    >
                      NDVI (Vegetation)
                    </button>
                    <button
                      onClick={() => setActiveSpectralIndex('NDWI')}
                      className={`px-3 py-1 rounded transition-colors ${
                        activeSpectralIndex === 'NDWI'
                          ? 'bg-[#193b2a] text-[#d6eaa6] font-semibold'
                          : 'text-[#72816f] hover:text-[#213c2b]'
                      }`}
                    >
                      NDWI (Moisture)
                    </button>
                    <button
                      onClick={() => setActiveSpectralIndex('RGB')}
                      className={`px-3 py-1 rounded transition-colors ${
                        activeSpectralIndex === 'RGB'
                          ? 'bg-[#193b2a] text-[#d6eaa6] font-semibold'
                          : 'text-[#72816f] hover:text-[#213c2b]'
                      }`}
                    >
                      True Color RGB
                    </button>
                  </div>
                )}
              </div>

              {/* Viewport: Either MapLibre GL WebGL or Spectral SVG */}
              {viewFormat === 'maplibre' ? (
                <FieldMap height="360px" showSatellite={true} />
              ) : (
                <div className="relative w-full aspect-16/10 rounded-lg overflow-hidden border border-[#2b503e] bg-slate-900 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{ backgroundImage: `url('/earth/platform-field-satellite.webp')` }}
                  />

                  <svg
                    viewBox="0 0 600 380"
                    className="relative z-10 w-full h-full p-4"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <linearGradient id="ndviGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#84cc16" stopOpacity="0.75" />
                        <stop offset="50%" stopColor="#22c55e" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#15803d" stopOpacity="0.85" />
                      </linearGradient>
                      <linearGradient id="ndwiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
                        <stop offset="60%" stopColor="#0284c7" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>

                    <polygon
                      points="160,70 440,90 410,310 130,270"
                      fill={
                        activeSpectralIndex === 'NDVI'
                          ? 'url(#ndviGradient)'
                          : activeSpectralIndex === 'NDWI'
                          ? 'url(#ndwiGradient)'
                          : 'rgba(255, 255, 255, 0.15)'
                      }
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    <rect x="200" y="150" width="200" height="70" rx="8" fill="rgba(16, 46, 32, 0.88)" stroke="#d6eaa6" strokeWidth="1" />
                    <text x="300" y="174" fill="#ffffff" fontSize="11" fontFamily="IBM Plex Mono" textAnchor="middle" fontWeight="bold">
                      {activeSpectralIndex === 'NDVI'
                        ? `NDVI: ${selectedObs.meanNdvi.toFixed(2)}`
                        : activeSpectralIndex === 'NDWI'
                        ? `NDWI: ${selectedObs.meanNdwi.toFixed(2)}`
                        : 'RGB BOA Reflectance'}
                    </text>
                    <text x="300" y="192" fill="#d6eaa6" fontSize="10" fontFamily="IBM Plex Mono" textAnchor="middle">
                      Tile: 43UFR · 10m Ground Res
                    </text>
                    <text x="300" y="208" fill="#a7f3d0" fontSize="9" fontFamily="IBM Plex Mono" textAnchor="middle">
                      Cloud Cover: {selectedObs.cloudCoverPercent}%
                    </text>

                    {comparisonMode && (
                      <g>
                        <rect x="20" y="20" width="180" height="50" rx="6" fill="rgba(0, 0, 0, 0.75)" stroke="#38bdf8" />
                        <text x="110" y="38" fill="#38bdf8" fontSize="10" fontFamily="IBM Plex Mono" textAnchor="middle">
                          Δ {activeSpectralIndex}: {activeSpectralIndex === 'NDVI' ? (selectedObs.meanNdvi - compareObs.meanNdvi).toFixed(2) : (selectedObs.meanNdwi - compareObs.meanNdwi).toFixed(2)}
                        </text>
                        <text x="110" y="54" fill="#ffffff" fontSize="9" fontFamily="IBM Plex Mono" textAnchor="middle">
                          Baseline: {compareObs.date}
                        </text>
                      </g>
                    )}
                  </svg>

                  <div className="absolute bottom-3 left-4 right-4 bg-black/80 backdrop-blur-xs rounded-md px-4 py-2 flex items-center justify-between text-[10px] text-white font-mono">
                    <span>-0.2 (Bare/Dry)</span>
                    <div
                      className="h-2 flex-1 mx-4 rounded-full"
                      style={{
                        background:
                          activeSpectralIndex === 'NDVI'
                            ? 'linear-gradient(to right, #ef4444, #eab308, #84cc16, #15803d)'
                            : 'linear-gradient(to right, #f97316, #e2e8f0, #38bdf8, #0369a1)',
                      }}
                    />
                    <span>+0.85 (High {activeSpectralIndex === 'NDVI' ? 'Canopy' : 'Moisture'})</span>
                  </div>
                </div>
              )}

              {/* Observation Scene Notes */}
              <div className="mt-3 p-3 bg-[#f9faf7] border border-[#edf0e7] rounded-lg text-xs text-[#213c2b]">
                <strong className="font-semibold text-[#193b2a] block mb-0.5">Observation Assessment:</strong>
                {selectedObs.notes}
              </div>
            </div>

            {/* Scene Metadata & Indices Time Series (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Scene Metadata Card */}
              <div className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs">
                <h3 className="text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider mb-3 flex items-center gap-1.5">
                  <CloudSun size={14} className="text-[#245b45]" />
                  Scene Acquisition Metadata
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#edf0e7]">
                    <span className="text-[#72816f]">Sensor Platform:</span>
                    <strong className="font-mono text-[#213c2b]">{selectedObs.sensor}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#edf0e7]">
                    <span className="text-[#72816f]">Acquisition Date:</span>
                    <strong className="font-mono text-[#213c2b]">{selectedObs.date}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#edf0e7]">
                    <span className="text-[#72816f]">Cloud Cover:</span>
                    <span className="font-mono text-emerald-700 font-semibold">{selectedObs.cloudCoverPercent}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#edf0e7]">
                    <span className="text-[#72816f]">Spatial Resolution:</span>
                    <span className="font-mono text-[#213c2b]">10m / Ground Sample</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#edf0e7]">
                    <span className="text-[#72816f]">Sun Azimuth / Angle:</span>
                    <span className="font-mono text-[#213c2b]">{selectedObs.sunAzimuthDeg}°</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#72816f]">Quality Rating:</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">
                      {selectedObs.qualityRating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time Series Phenology Trend */}
              <div className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs flex-1">
                <h3 className="text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider mb-2 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-[#245b45]" />
                  Seasonal Index Dynamics
                </h3>
                <p className="text-[11px] text-[#72816f] mb-3">
                  Demonstrating DSR vegetative growth curve (NDVI) alongside intermittent AWD aeration cycles (NDWI).
                </p>

                <div className="space-y-3">
                  {satelliteObservations.map((obs) => (
                    <div
                      key={obs.id}
                      onClick={() => setSelectedObsId(obs.id)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        selectedObs.id === obs.id
                          ? 'border-[#245b45] bg-[#e8f4ea]'
                          : 'border-[#edf0e7] hover:border-[#cbd7c5]'
                      }`}
                    >
                      <div className="flex justify-between font-mono text-[11px] font-semibold mb-1">
                        <span>{obs.date}</span>
                        <span className="text-[#245b45]">NDVI {obs.meanNdvi.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#e2e8f0] rounded-full overflow-hidden flex">
                          <div
                            className="bg-emerald-600 h-full"
                            style={{ width: `${Math.max(5, obs.meanNdvi * 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-sky-700">
                          NDWI {obs.meanNdwi > 0 ? `+${obs.meanNdwi.toFixed(2)}` : obs.meanNdwi.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
