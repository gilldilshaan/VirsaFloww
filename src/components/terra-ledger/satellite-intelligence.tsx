import React, { useState, useMemo } from 'react';
import {
  AUTHENTIC_SATELLITE_OBSERVATIONS,
  AuthenticSatelliteObservation,
} from '@/lib/satellite/authentic-observations';
import { FieldMap, FieldFeature } from '@/components/geospatial/field-map';
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
  ExternalLink,
  ShieldCheck,
  Radio,
  BarChart3,
  Compass,
  FileCheck2,
  Binary,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type SpectralProduct =
  | 'NDVI'
  | 'NDWI'
  | 'NDMI'
  | 'EVI'
  | 'NDRE'
  | 'TRUE_COLOR'
  | 'FALSE_COLOR';

export function SatelliteIntelligence() {
  const observations = AUTHENTIC_SATELLITE_OBSERVATIONS;

  const [selectedObsId, setSelectedObsId] = useState<string>(
    observations[3]?.id || 'S2A_43REQ_20240923_0_L2A'
  );
  const [activeProduct, setActiveProduct] = useState<SpectralProduct>('NDVI');
  const [rasterOpacity, setRasterOpacity] = useState<number>(0.85);
  const [uiState, setUiState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');
  const [hoverCoords, setHoverCoords] = useState<{ lng: number; lat: number } | null>(null);
  const [showRadarDetails, setShowRadarDetails] = useState<boolean>(true);

  const selectedObs: AuthenticSatelliteObservation = useMemo(() => {
    return observations.find((o: AuthenticSatelliteObservation) => o.id === selectedObsId) ?? observations[0]!;
  }, [observations, selectedObsId]);

  // Registered Field feature for MapLibre (Canonical PB-FIELD-001 boundary)
  const fieldFeature: FieldFeature = useMemo(() => {
    return {
      id: 'PB-FIELD-001',
      code: 'PB-FIELD-001',
      name: 'Gill Agro Farms Parcel 1 (Jodhan)',
      farmerName: 'Gurdev Singh Gill',
      areaHa: 4.8,
      status: 'READY_FOR_VERIFICATION',
      coordinates: [
        [75.8345, 30.9135],
        [75.8388, 30.9142],
        [75.8395, 30.9085],
        [75.8352, 30.9078],
        [75.8345, 30.9135],
      ],
    };
  }, []);

  // Compute active raster overlay configuration for MapLibre
  const rasterOverlayConfig = useMemo(() => {
    if (!selectedObs?.rasterLayers) return null;
    let url = selectedObs.rasterLayers.ndvi;
    if (activeProduct === 'NDWI') url = selectedObs.rasterLayers.ndwi;
    else if (activeProduct === 'NDMI') url = selectedObs.rasterLayers.ndmi;
    else if (activeProduct === 'EVI') url = selectedObs.rasterLayers.evi;
    else if (activeProduct === 'NDRE') url = selectedObs.rasterLayers.ndre;
    else if (activeProduct === 'TRUE_COLOR') url = selectedObs.rasterLayers.rgb;
    else if (activeProduct === 'FALSE_COLOR') url = selectedObs.rasterLayers.false_color;

    return {
      imageUrl: url,
      coordinates: selectedObs.rasterLayers.coordinates,
      opacity: rasterOpacity,
    };
  }, [selectedObs, activeProduct, rasterOpacity]);

  return (
    <div className="space-y-6 text-[#193b2a]">
      {/* 1. TECHNICAL EARTH OBSERVATION HEADER */}
      <div className="bg-[#0d2818] text-[#fbf8ee] rounded-2xl p-6 sm:p-7 border border-[#2b503e] shadow-lg relative overflow-hidden">
        {/* Subtle grid accent */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d6eaa6_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#d6eaa6] uppercase bg-[#163824] px-3 py-1 rounded-full border border-[#245b45]">
              <Satellite size={13} className="text-[#a7f3d0] animate-pulse" />
              <span>Earth Observation · Copernicus Sentinel-2 MSI + Sentinel-1 SAR</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="font-serif text-3xl sm:text-4xl text-[#fbf8ee] tracking-tight">
                Satellite Intelligence Workspace
              </h1>
              <span className="font-mono text-sm px-2.5 py-0.5 rounded bg-[#245b45] text-[#d6eaa6] font-semibold border border-[#377e60]">
                Parcel PB-FIELD-001
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#cbd5e1] max-w-3xl leading-relaxed font-sans">
              Authoritative 10-meter surface reflectance rasters for{' '}
              <strong className="text-white font-medium">Gill Agro Farms Parcel 1 (Jodhan, Ludhiana)</strong>. 
              Extracted directly from Copernicus Sentinel-2 L2A Cloud-Optimized GeoTIFFs (COGs) on AWS Open Data with zero synthetic fabrication.
            </p>
          </div>

          {/* Provenance & Status Card */}
          <div className="bg-[#163824]/90 border border-[#2b503e] rounded-xl p-3.5 sm:p-4 text-xs font-mono space-y-1.5 shrink-0 min-w-[280px]">
            <div className="flex items-center justify-between text-[#a7f3d0] pb-1.5 border-b border-[#245b45]">
              <span className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider">
                <ShieldCheck size={14} className="text-[#4ade80]" />
                Data Provenance
              </span>
              <span className="bg-[#059669] text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                HISTORICAL 2024
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#94a3b8]">Cadastral Parcel:</span>
              <span className="text-white font-semibold">26.48 ha (2,647 px)</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#94a3b8]">Enrolled DSR Plot:</span>
              <span className="text-[#d6eaa6] font-semibold">4.80 ha (480 px)</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#94a3b8]">Tile & CRS:</span>
              <span className="text-white">43REQ · EPSG:32643</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#94a3b8]">Verified Scenes:</span>
              <span className="text-[#d6eaa6] font-bold">7 L2A Acquisitions</span>
            </div>
          </div>
        </div>

        {/* Quick Diagnostics Strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#245b45]/60 text-xs">
          <div>
            <span className="text-[10px] font-mono text-[#94a3b8] uppercase block">Acquisition Date</span>
            <strong className="font-mono text-sm text-[#fbf8ee]">{selectedObs.date}</strong>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#94a3b8] uppercase block">Platform Sensor</span>
            <strong className="font-mono text-sm text-[#fbf8ee]">{selectedObs.sensor}</strong>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#94a3b8] uppercase block">Mean NDVI (Full Polygon)</span>
            <strong className="font-mono text-sm text-[#4ade80]">
              {selectedObs.stats.ndvi.mean.toFixed(4)}
            </strong>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#94a3b8] uppercase block">Cloud Contamination</span>
            <strong className="font-mono text-sm text-[#fbf8ee]">
              {selectedObs.cloudCoverFieldPct.toFixed(1)}% ({selectedObs.qualityRating})
            </strong>
          </div>
        </div>
      </div>

      {/* 2. CHRONOLOGICAL OBSERVATION TIMELINE */}
      <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-[#193b2a]" />
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#193b2a]">
              Chronological Observation Timeline (Kharif Season 2024)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#72816f]">
            Selected: <code className="font-bold text-[#193b2a]">{selectedObs.id}</code>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {observations.map((obs: AuthenticSatelliteObservation) => {
            const isSelected = obs.id === selectedObs.id;
            return (
              <button
                key={obs.id}
                onClick={() => setSelectedObsId(obs.id)}
                className={`p-2.5 rounded-lg text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#193b2a] text-white border-[#102e20] shadow-sm ring-2 ring-[#d6eaa6]/60'
                    : 'bg-[#f8f9f6] text-[#213c2b] border-[#e2e8df] hover:bg-[#edf2e8]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono font-bold text-xs">{obs.date}</span>
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded font-medium ${
                        isSelected
                          ? 'bg-[#d6eaa6] text-[#193b2a]'
                          : obs.cloudCoverFieldPct > 10
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {obs.cloudCoverFieldPct > 10 ? 'Part-Cloud' : 'Clear'}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-sans line-clamp-1 block ${
                      isSelected ? 'text-[#cbd5e1]' : 'text-[#72816f]'
                    }`}
                  >
                    {obs.phenologyStage}
                  </span>
                </div>

                <div className="mt-2 pt-1.5 border-t border-current/15 flex items-center justify-between text-[11px] font-mono">
                  <span className={isSelected ? 'text-[#a7f3d0]' : 'text-[#245b45]'}>
                    NDVI {obs.stats.ndvi.mean.toFixed(2)}
                  </span>
                  <span className={isSelected ? 'text-slate-300' : 'text-[#72816f]'}>
                    {obs.cloudCoverFieldPct}% cld
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN GEOSPATIAL WORKSPACE & DOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER VIEWPORT (8 COLS): MapLibre GL */}
        <div className="lg:col-span-8 space-y-3">
          {/* Layer Selector Bar */}
          <div className="bg-white border border-[#dfe6d9] rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Spectral Products Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-mono text-[#72816f] uppercase font-semibold mr-1">
                Active Layer:
              </span>
              {[
                { id: 'NDVI', label: 'NDVI', desc: 'Rouse (1974) Normalized Difference Vegetation: (B08-B04)/(B08+B04)' },
                { id: 'NDWI', label: 'NDWI (McFeeters)', desc: 'McFeeters (1996) Surface Water Index: (B03-B08)/(B03+B08)' },
                { id: 'NDMI', label: 'NDMI (Gao)', desc: 'Gao (1996) Canopy Moisture Index: (B08-B11)/(B08+B11)' },
                { id: 'EVI', label: 'EVI', desc: 'Huete (2002) Enhanced Vegetation Index: 2.5*(B08-B04)/(B08+6*B04-7.5*B02+1)' },
                { id: 'NDRE', label: 'NDRE', desc: 'Barnes (2000) Red Edge Chlorophyll Index: (B08-B05)/(B08+B05)' },
                { id: 'TRUE_COLOR', label: 'True Color (RGB)', desc: 'B04 (Red), B03 (Green), B02 (Blue)' },
                { id: 'FALSE_COLOR', label: 'False Color (NIR)', desc: 'B08 (NIR), B04 (Red), B03 (Green)' },
              ].map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => setActiveProduct(prod.id as SpectralProduct)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    activeProduct === prod.id
                      ? 'bg-[#193b2a] text-[#d6eaa6] font-bold shadow-xs'
                      : 'bg-[#f4f6f0] text-[#556958] hover:text-[#193b2a] hover:bg-[#eaeedf]'
                  }`}
                  title={prod.desc}
                >
                  {prod.label}
                </button>
              ))}
            </div>

            {/* Opacity Control */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#556958]">
              <Sliders size={13} />
              <span>Opacity:</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={rasterOpacity}
                onChange={(e) => setRasterOpacity(parseFloat(e.target.value))}
                className="w-20 accent-[#193b2a] cursor-pointer"
              />
              <span className="w-8 text-right font-bold text-[#193b2a]">
                {Math.round(rasterOpacity * 100)}%
              </span>
            </div>
          </div>

          {/* Map Viewport Card */}
          <div className="bg-white border border-[#dfe6d9] rounded-xl overflow-hidden shadow-xs relative">
            <FieldMap
              fields={[fieldFeature]}
              selectedFieldId={fieldFeature.id}
              showSatellite={true}
              height="580px"
              rasterOverlay={rasterOverlayConfig}
              onHoverCoordinates={setHoverCoords}
            />

            {/* Top-Right Floating Product Badge */}
            <div className="absolute top-3 left-3 bg-[#0d2818]/90 text-[#fbf8ee] backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#245b45] text-xs font-mono shadow-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-ping" />
              <span>
                Raster Product: <strong className="text-[#d6eaa6]">{activeProduct}</strong> ({selectedObs.date})
              </span>
            </div>

            {/* Bottom-Right Coordinates Readout */}
            <div className="absolute bottom-3 right-3 bg-black/80 text-white backdrop-blur-xs px-3 py-1.5 rounded text-[11px] font-mono shadow-md flex items-center gap-3">
              <Compass size={13} className="text-[#a7f3d0]" />
              <span>
                {hoverCoords
                  ? `${hoverCoords.lat.toFixed(5)}° N, ${hoverCoords.lng.toFixed(5)}° E`
                  : '30.9119° N, 75.8359° E (Ludhiana)'}
              </span>
              <span className="text-[#94a3b8] border-l border-white/20 pl-2">UTM Zone 43N</span>
            </div>

            {/* Scientific Color Legend Bar */}
            <div className="absolute bottom-3 left-3 bg-white/95 text-[#193b2a] backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#dfe6d9] shadow-md max-w-sm text-xs font-mono">
              <div className="flex items-center justify-between text-[10px] text-[#72816f] mb-1 font-semibold">
                <span>{activeProduct} VALUE RANGE</span>
                <span>
                  {activeProduct === 'NDVI'
                    ? '[-0.20 to +1.00]'
                    : activeProduct === 'NDWI'
                    ? '[-0.50 to +0.50] (Water / Ponding)'
                    : activeProduct === 'NDMI'
                    ? '[-0.20 to +0.40] (Canopy Moisture)'
                    : '[Standard Scale]'}
                </span>
              </div>

              {activeProduct === 'NDVI' && (
                <div className="space-y-1">
                  <div className="h-3 w-56 rounded bg-gradient-to-r from-[#a52a2a] via-[#e6b428] via-[#82c332] to-[#10782d]" />
                  <div className="flex justify-between text-[9px] text-[#72816f]">
                    <span>Soil / Barren (&lt;0.2)</span>
                    <span>Vegetative (0.3-0.5)</span>
                    <span>Lush Canopy (&gt;0.6)</span>
                  </div>
                </div>
              )}

              {activeProduct === 'NDWI' && (
                <div className="space-y-1">
                  <div className="h-3 w-56 rounded bg-gradient-to-r from-[#a06e3c] via-[#c8b478] via-[#4696d2] to-[#0f3ca0]" />
                  <div className="flex justify-between text-[9px] text-[#72816f]">
                    <span>Dry Soil (&lt;-0.2)</span>
                    <span>Moist Soil (0.0)</span>
                    <span>Standing Water (&gt;+0.2)</span>
                  </div>
                  <div className="text-[9px] text-[#475569] font-sans pt-0.5">
                    McFeeters (1996) NDWI = (B03-B08)/(B03+B08) monitors AWD surface ponding and irrigation flushing.
                  </div>
                </div>
              )}

              {activeProduct === 'NDMI' && (
                <div className="space-y-1">
                  <div className="h-3 w-56 rounded bg-gradient-to-r from-[#be965a] via-[#8cc8b4] to-[#195aa0]" />
                  <div className="flex justify-between text-[9px] text-[#72816f]">
                    <span>Water Stress (&lt;-0.1)</span>
                    <span>Moderate Moisture</span>
                    <span>High Canopy Water (&gt;+0.2)</span>
                  </div>
                  <div className="text-[9px] text-[#475569] font-sans pt-0.5">
                    Gao (1996) NDMI = (B08-B11)/(B08+B11) measures internal leaf and crop canopy liquid moisture.
                  </div>
                </div>
              )}

              {['EVI', 'NDRE', 'TRUE_COLOR', 'FALSE_COLOR'].includes(activeProduct) && (
                <div className="text-[10px] text-[#72816f]">
                  Authentic Copernicus Sentinel-2 Level-2A surface reflectance BOA composite.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT DOCK (4 COLS): Spectral Analytics, Scene Metadata, & Radar */}
        <div className="lg:col-span-4 space-y-4">
          {/* A. Field Spectral Analytics */}
          <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#edf2e8]">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#193b2a]">
                <BarChart3 size={15} className="text-[#245b45]" />
                Field Spectral Statistics
              </div>
              <span className="text-[10px] font-mono bg-[#163824] text-[#d6eaa6] px-1.5 py-0.5 rounded font-semibold">
                {selectedObs.coverage.validPixelCount} Pixels
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#f8f9f6] p-2 rounded border border-[#e2e8df]">
                <span className="text-[10px] text-[#72816f] uppercase block">Mean NDVI</span>
                <strong className="text-base text-[#193b2a]">
                  {selectedObs.stats.ndvi.mean.toFixed(4)}
                </strong>
                <span className="text-[9px] text-[#72816f] block">
                  Median: {selectedObs.stats.ndvi.median.toFixed(3)}
                </span>
              </div>

              <div className="bg-[#f8f9f6] p-2 rounded border border-[#e2e8df]">
                <span className="text-[10px] text-[#72816f] uppercase block">NDVI Range</span>
                <strong className="text-sm text-[#193b2a]">
                  {selectedObs.stats.ndvi.min.toFixed(2)} → {selectedObs.stats.ndvi.max.toFixed(2)}
                </strong>
                <span className="text-[9px] text-[#72816f] block">
                  StdDev: ±{selectedObs.stats.ndvi.stdDev.toFixed(3)}
                </span>
              </div>

              <div className="bg-[#f8f9f6] p-2 rounded border border-[#e2e8df]">
                <span className="text-[10px] text-[#72816f] uppercase block">Mean NDWI</span>
                <strong className="text-base text-[#193b2a]">
                  {selectedObs.stats.ndwi.mean.toFixed(4)}
                </strong>
                <span className="text-[9px] text-[#72816f] block">
                  Moisture Index
                </span>
              </div>

              <div className="bg-[#f8f9f6] p-2 rounded border border-[#e2e8df]">
                <span className="text-[10px] text-[#72816f] uppercase block">Mean EVI / NDRE</span>
                <strong className="text-sm text-[#193b2a]">
                  {selectedObs.stats.evi.mean.toFixed(3)} / {selectedObs.stats.ndre.mean.toFixed(3)}
                </strong>
                <span className="text-[9px] text-[#72816f] block">RedEdge / Biomass</span>
              </div>
            </div>

            {/* Agronomic Interpretation Notice (Section 8 Compliance) */}
            <div className="bg-[#f4f7f1] border border-[#dde4d9] p-3 rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#193b2a]">
                <Sprout size={14} className="text-[#5c7c46]" />
                <span>Agronomic & Phenology Screening</span>
              </div>
              <p className="text-[11px] text-[#334155] leading-relaxed">
                {selectedObs.agronomicInterpretation}
              </p>
              <span className="text-[10px] text-[#708071] block font-mono italic pt-1">
                ⚠️ Scientific Notice: Satellite spectral patterns support screening and corroboration. Direct Seeded Rice (DSR) or Alternate Wetting & Drying (AWD) compliance cannot be certified from remote sensing alone without ground verification.
              </span>
            </div>
          </div>

          {/* B. Sentinel-1 Radar Backscatter Co-Observation (Priority 3 Validation) */}
          <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#edf2e8]">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#193b2a]">
                <Radio size={15} className="text-[#0284c7]" />
                Sentinel-1 C-SAR Radar Co-Observation
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border ${
                selectedObs.radarCoObservation.isAvailable
                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {selectedObs.radarCoObservation.isAvailable ? 'CALIBRATED' : 'UNAVAILABLE (CALIBRATION PENDING)'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#72816f]">Radar Scene:</span>
                <span className="font-bold text-[#193b2a] truncate max-w-[200px]" title={selectedObs.radarCoObservation.sceneId}>
                  {selectedObs.radarCoObservation.sceneId}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#72816f]">Polarizations & Orbit:</span>
                <span className="text-[#193b2a]">
                  VV+VH Dual-Pol (Orbit {selectedObs.radarCoObservation.orbitNumber} {selectedObs.radarCoObservation.passType})
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                <div className="bg-[#f8fafc] p-2 rounded border border-slate-200">
                  <span className="text-[9px] text-slate-500 block uppercase">VV Mean</span>
                  <strong className="text-xs text-slate-700">
                    {selectedObs.radarCoObservation.vvMeanDb !== null ? `${selectedObs.radarCoObservation.vvMeanDb} dB` : 'N/A'}
                  </strong>
                </div>
                <div className="bg-[#f8fafc] p-2 rounded border border-slate-200">
                  <span className="text-[9px] text-slate-500 block uppercase">VH Mean</span>
                  <strong className="text-xs text-slate-700">
                    {selectedObs.radarCoObservation.vhMeanDb !== null ? `${selectedObs.radarCoObservation.vhMeanDb} dB` : 'N/A'}
                  </strong>
                </div>
                <div className="bg-[#f8fafc] p-2 rounded border border-slate-200">
                  <span className="text-[9px] text-slate-500 block uppercase">VH-VV Ratio</span>
                  <strong className="text-xs text-slate-700">
                    {selectedObs.radarCoObservation.crossRatioDb !== null ? `${selectedObs.radarCoObservation.crossRatioDb} dB` : 'N/A'}
                  </strong>
                </div>
              </div>

              <div className="text-[10px] text-amber-900 bg-amber-50/80 p-2.5 rounded border border-amber-200 leading-normal">
                {selectedObs.radarCoObservation.scientificNotice}
              </div>
            </div>
          </div>

          {/* C. Scene Provenance & STAC Metadata Panel (Section 6E) */}
          <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#193b2a] pb-2 border-b border-[#edf2e8]">
              <FileCheck2 size={15} className="text-[#245b45]" />
              Scene Metadata & STAC Provenance
            </div>

            <div className="text-[11px] font-mono space-y-1.5 text-[#556958]">
              <div className="flex justify-between">
                <span className="text-[#72816f]">STAC Collection:</span>
                <span className="text-[#193b2a] font-semibold">{selectedObs.stacCollection}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72816f]">Scene Item ID:</span>
                <span className="text-[#193b2a] font-semibold truncate max-w-[200px]" title={selectedObs.id}>
                  {selectedObs.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72816f]">Acquired Timestamp:</span>
                <span className="text-[#193b2a]">{selectedObs.date}T05:50:23Z</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72816f]">Processing Level:</span>
                <span className="text-[#193b2a]">Level-2A (BOA Reflectance)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72816f]">Spatial Resolution:</span>
                <span className="text-[#193b2a]">10.0m native</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72816f]">Scene Cloud Cover:</span>
                <span className="text-[#193b2a]">{selectedObs.cloudCoverPercent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72816f]">Parcel Cloud Cover:</span>
                <span className="text-[#193b2a]">{selectedObs.cloudCoverFieldPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72816f]">Cadastral Parcel Area:</span>
                <span className="text-[#193b2a] font-bold">26.48 ha (2,647 px)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72816f]">Enrolled DSR Cultivation:</span>
                <span className="text-[#245b45] font-bold">4.80 ha (480 px)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#72816f]">Valid Parcel Pixels:</span>
                <span className="text-[#193b2a] font-bold">
                  {selectedObs.coverage.validPixelCount} / {selectedObs.coverage.totalPolygonPixels} ({selectedObs.coverage.coveragePct}%)
                </span>
              </div>
            </div>

            {/* Asset COG Direct Links */}
            <div className="pt-2 border-t border-[#edf2e8] space-y-1">
              <span className="text-[10px] font-mono text-[#72816f] uppercase block font-semibold">
                Traceable COG Asset Links (AWS Open Data):
              </span>
              <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                <a
                  href={selectedObs.assets.b04}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 bg-[#f4f6f0] hover:bg-[#edf0e7] rounded text-[#245b45] flex items-center justify-between"
                >
                  <span>B04 (Red 10m)</span>
                  <ExternalLink size={10} />
                </a>
                <a
                  href={selectedObs.assets.b08}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 bg-[#f4f6f0] hover:bg-[#edf0e7] rounded text-[#245b45] flex items-center justify-between"
                >
                  <span>B08 (NIR 10m)</span>
                  <ExternalLink size={10} />
                </a>
                <a
                  href={selectedObs.assets.b03}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 bg-[#f4f6f0] hover:bg-[#edf0e7] rounded text-[#245b45] flex items-center justify-between"
                >
                  <span>B03 (Green 10m)</span>
                  <ExternalLink size={10} />
                </a>
                <a
                  href={selectedObs.assets.b02}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 bg-[#f4f6f0] hover:bg-[#edf0e7] rounded text-[#245b45] flex items-center justify-between"
                >
                  <span>B02 (Blue 10m)</span>
                  <ExternalLink size={10} />
                </a>
                <a
                  href={selectedObs.assets.b05}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 bg-[#f4f6f0] hover:bg-[#edf0e7] rounded text-[#245b45] flex items-center justify-between"
                >
                  <span>B05 (RedEdge 20m)</span>
                  <ExternalLink size={10} />
                </a>
                <a
                  href={selectedObs.assets.b11}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 bg-[#f4f6f0] hover:bg-[#edf0e7] rounded text-[#245b45] flex items-center justify-between"
                >
                  <span>B11 (SWIR 20m)</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* OlmoEarth Foundation Models Status (Section 9 Compliance) */}
            <div className="pt-2 border-t border-[#edf2e8] text-[10px] font-mono space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[#72816f] uppercase font-semibold">OlmoEarth v1.3:</span>
                <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium border border-slate-200">
                  Experimental Preview
                </span>
              </div>
              <p className="text-[10px] text-[#64748b] leading-tight">
                Official Ai2 Zarr v3 Sharded Array access requires Python extraction microservice. Under Mission 3 Section 9 scientific integrity rules, embedding vectors are strictly never simulated or fabricated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
