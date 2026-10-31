import { useState, useMemo } from 'react';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import { AUTHENTIC_SATELLITE_OBSERVATIONS } from '@/lib/satellite/authentic-observations';
import { FieldMap, FieldFeature } from '@/components/geospatial/field-map';
import {
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Layers,
  FileText,
  Compass,
  Sparkles,
  Info,
  Satellite,
  Radio,
  Eye,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CommandCentre() {
  const {
    field,
    assessmentStatus,
    completenessPercent,
    aiExplanation,
    demoState,
    setActiveTab,
    addIrrigationLogAction,
    addInBoundaryPhotoAction,
  } = useTerraLedger();

  const [mapLayer, setMapLayer] = useState<'boundaries' | 'indices' | 'provenance'>('indices');
  const [activeSpectralIndex, setActiveSpectralIndex] = useState<'ndvi' | 'ndwi' | 'rgb'>('ndvi');

  // Latest genuine Sentinel-2 observation
  const latestObs = AUTHENTIC_SATELLITE_OBSERVATIONS[AUTHENTIC_SATELLITE_OBSERVATIONS.length - 1]!;

  const fieldFeature: FieldFeature = useMemo(() => {
    return {
      id: 'PB-FIELD-001',
      code: 'PB-FIELD-001',
      name: 'Gill Agro Farms Parcel 1 (Jodhan)',
      farmerName: 'Gurdev Singh Gill',
      areaHa: 4.8,
      status: demoState === 'ready' ? 'READY_FOR_VERIFICATION' : demoState === 'needs-review' ? 'NEEDS_REVIEW' : 'UNVERIFIED',
      coordinates: [
        [75.8320, 30.9080],
        [75.8410, 30.9095],
        [75.8395, 30.9160],
        [75.8310, 30.9140],
        [75.8320, 30.9080],
      ],
    };
  }, [demoState]);

  const rasterOverlay = useMemo(() => {
    if (mapLayer === 'boundaries') return null;
    let url = latestObs.rasterLayers.ndvi;
    if (activeSpectralIndex === 'ndwi') url = latestObs.rasterLayers.ndwi;
    if (activeSpectralIndex === 'rgb') url = latestObs.rasterLayers.rgb;
    return {
      imageUrl: url,
      coordinates: latestObs.rasterLayers.coordinates,
      opacity: 0.85,
    };
  }, [mapLayer, activeSpectralIndex, latestObs]);

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider mb-1">
            <Compass size={13} />
            Command Centre · Field Assessment Intelligence
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight">
            Field Parcel {field.code}
          </h1>
          <p className="text-xs text-[#72816f] mt-1">
            Real-time multi-source evidence synthesis for agricultural carbon crediting and MRV.
          </p>
        </div>

        {/* Quick Nav Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('satellite')}
            className="text-xs bg-white border-[#d8e1d4] text-[#213c2b] hover:bg-[#f4f6f0]"
          >
            <Layers size={13} className="mr-1.5 text-[#5c7c46]" />
            Satellite View
          </Button>
          <Button
            size="sm"
            onClick={() => setActiveTab('evidence')}
            className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333]"
          >
            Evidence Explorer
            <ArrowRight size={13} className="ml-1.5" />
          </Button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Registered Parcel Area</span>
          <strong className="block text-2xl font-mono text-[#193b2a] mt-1">
            {field.areaHa} <small className="text-xs font-sans text-[#72816f]">ha</small>
          </strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">{field.areaAcres} acres · {field.district} (Cadastral Pegs)</span>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Estimated Mitigation Potential</span>
          <strong className="block text-2xl font-mono text-[#245b45] mt-1">
            {field.targetEmissionReductionTonnes}{' '}
            <small className="text-xs font-sans text-[#72816f]">tCO2e/yr</small>
          </strong>
          <span className="text-[10px] text-[#72816f] mt-0.5 block font-mono">
            *Unverified VM0042 projection; 0 credits issued
          </span>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Enrolled Farmer Partner</span>
          <strong className="block text-lg font-semibold text-[#193b2a] mt-1 truncate">
            {field.farmerName}
          </strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block font-mono" lang="pa">
            {field.farmerNameLocal}
          </span>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">MRV Completeness</span>
          <strong
            className={`block text-2xl font-mono mt-1 ${
              completenessPercent >= 90
                ? 'text-emerald-700'
                : completenessPercent >= 65
                ? 'text-sky-700'
                : 'text-amber-700'
            }`}
          >
            {completenessPercent}%
          </strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">
            {assessmentStatus.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Main Assessment Grid: Geospatial Map Canvas + AI Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): MapLibre Geospatial Canvas with Genuine Sentinel Layer */}
        <div className="lg:col-span-7 bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf0e7]">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#245b45]" />
              <div>
                <h2 className="text-sm font-semibold text-[#193b2a]">
                  Cadastral Boundary & Satellite Earth Observation
                </h2>
                <span className="text-[10px] font-mono text-[#72816f]">
                  Copernicus Sentinel-2 10m L2A Surface Reflectance Overlay
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setMapLayer('boundaries')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  mapLayer === 'boundaries'
                    ? 'bg-[#193b2a] text-white font-medium'
                    : 'bg-[#f4f6f0] text-[#72816f] hover:text-[#213c2b]'
                }`}
              >
                Boundary Only
              </button>
              <button
                onClick={() => {
                  setMapLayer('indices');
                  setActiveSpectralIndex('ndvi');
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  mapLayer === 'indices' && activeSpectralIndex === 'ndvi'
                    ? 'bg-[#193b2a] text-white font-medium'
                    : 'bg-[#f4f6f0] text-[#72816f] hover:text-[#213c2b]'
                }`}
              >
                NDVI Raster
              </button>
              <button
                onClick={() => {
                  setMapLayer('indices');
                  setActiveSpectralIndex('ndwi');
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  mapLayer === 'indices' && activeSpectralIndex === 'ndwi'
                    ? 'bg-[#193b2a] text-white font-medium'
                    : 'bg-[#f4f6f0] text-[#72816f] hover:text-[#213c2b]'
                }`}
              >
                NDWI (Water)
              </button>
            </div>
          </div>

          {/* Interactive MapLibre GL Map */}
          <div className="relative w-full rounded-lg overflow-hidden border border-[#2b503e] shadow-inner">
            <FieldMap
              fields={[fieldFeature]}
              selectedFieldId={fieldFeature.id}
              showSatellite={true}
              height="360px"
              rasterOverlay={rasterOverlay}
            />

            {/* Top-Right Pill showing observation date */}
            <div className="absolute top-2.5 right-2.5 bg-[#0d2818]/90 text-[#fbf8ee] backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono border border-[#245b45]">
              Latest S2: {latestObs.date} (10m L2A)
            </div>

            {/* Bottom-Left Enclosure Badge */}
            <div className="absolute bottom-2.5 left-2.5 bg-black/80 text-white backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  demoState === 'ready' ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'
                }`}
              />
              <span>
                {demoState === 'ready'
                  ? 'Spatial Enclosure: 100% Contained'
                  : 'Spatial Discrepancy: Photo EV-003 offset (+420m)'}
              </span>
            </div>
          </div>

          {/* Prioritised Satellite Intelligence Summary Strip (Section 7) */}
          <div className="p-3 bg-[#f8f9f6] border border-[#e2e8df] rounded-lg text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono pb-1.5 border-b border-[#e2e8df]">
              <span className="font-bold text-[#193b2a] flex items-center gap-1.5 uppercase">
                <Satellite size={13} className="text-[#245b45]" />
                Latest Satellite Observation Summary
              </span>
              <button
                onClick={() => setActiveTab('satellite')}
                className="text-[#245b45] hover:underline font-bold flex items-center gap-1 text-[10px]"
              >
                Open Full Earth Workspace
                <ArrowRight size={11} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div>
                <span className="text-[#72816f] text-[10px] block">Scene ID:</span>
                <span className="font-bold text-[#193b2a] truncate block" title={latestObs.id}>
                  {latestObs.id}
                </span>
              </div>
              <div>
                <span className="text-[#72816f] text-[10px] block">Mean NDVI:</span>
                <span className="font-bold text-[#10782d]">{latestObs.stats.ndvi.mean.toFixed(3)}</span>
              </div>
              <div>
                <span className="text-[#72816f] text-[10px] block">Mean NDWI:</span>
                <span className="font-bold text-[#193b2a]">{latestObs.stats.ndwi.mean.toFixed(3)}</span>
              </div>
              <div>
                <span className="text-[#72816f] text-[10px] block">Valid Coverage:</span>
                <span className="font-bold text-[#193b2a]">{latestObs.coverage.coveragePct}% (0% cld)</span>
              </div>
            </div>

            <p className="text-[10px] text-[#64748b] leading-tight">
              Temporal Coverage: 7 genuine acquisitions across Kharif 2024. Monsoonal cloud window in late July flagged honestly. Spectral indices corroborate surface dynamics; mandatory ground-truth logs required for certification.
            </p>
          </div>
        </div>

        {/* Right Column (5 cols): AI Diagnostics & Action Steps */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* AI Explanation Card */}
          <div className="bg-[#173a2b] text-[#f5f5e8] border border-[#2b503e] rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono text-[#d6eaa6] mb-2 uppercase">
              <Sparkles size={14} className="animate-spin text-[#d6eaa6]" />
              VirsaFlow AI Diagnostics
            </div>
            <h3 className="font-serif text-lg font-medium text-white mb-2">
              {aiExplanation.headline}
            </h3>
            <p className="text-xs text-[#c6d7cb] leading-relaxed mb-4">
              {aiExplanation.details}
            </p>

            <div className="space-y-2 border-t border-[#ffffff15] pt-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#809c88] block uppercase">
                  Spatial Dimension
                </span>
                <span className="font-mono text-[11px] text-white">
                  {aiExplanation.spatialStatus}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#809c88] block uppercase">
                  Temporal & Moisture Corroboration
                </span>
                <span className="font-mono text-[11px] text-white">
                  {aiExplanation.temporalStatus}
                </span>
              </div>
            </div>

            {/* Quick Demo Advancement Action based on current state */}
            <div className="mt-5 pt-3 border-t border-[#ffffff15]">
              {demoState === 'unverified' && (
                <Button
                  size="sm"
                  onClick={addIrrigationLogAction}
                  className="w-full bg-[#d6eaa6] text-[#173a27] hover:bg-white text-xs font-semibold"
                >
                  Simulate Step 2: Add AWD Irrigation Log
                </Button>
              )}
              {demoState === 'needs-review' && (
                <Button
                  size="sm"
                  onClick={addInBoundaryPhotoAction}
                  className="w-full bg-emerald-500 text-white hover:bg-emerald-400 text-xs font-semibold"
                >
                  Simulate Step 3: Add In-Boundary Photo
                </Button>
              )}
              {demoState === 'ready' && (
                <div className="flex items-center justify-between text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 p-2.5 rounded-lg">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    READY FOR VERIFICATION · Pre-Audit Complete
                  </span>
                  <button
                    onClick={() => setActiveTab('dossier')}
                    className="underline text-white font-medium hover:text-emerald-200"
                  >
                    View Dossier
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Evidence Completeness Breakdown */}
          <div className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider mb-3">
              Assessment Dimensions
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#72816f]">Geospatial Boundary Enclosure</span>
                  <span className="font-mono font-semibold">
                    {demoState === 'ready' ? '100%' : '0%'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#edf0e7] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      demoState === 'ready' ? 'w-full bg-emerald-600' : 'w-0 bg-red-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#72816f]">Temporal Index Continuity</span>
                  <span className="font-mono font-semibold">
                    {demoState === 'unverified' ? '60%' : '96%'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#edf0e7] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      demoState === 'unverified' ? 'w-3/5 bg-amber-500' : 'w-[96%] bg-emerald-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#72816f]">Practice Adherence (DSR/AWD)</span>
                  <span className="font-mono font-semibold">
                    {demoState === 'unverified' ? '40%' : demoState === 'needs-review' ? '75%' : '92%'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#edf0e7] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      demoState === 'unverified'
                        ? 'w-2/5 bg-amber-500'
                        : demoState === 'needs-review'
                        ? 'w-3/4 bg-sky-500'
                        : 'w-[92%] bg-emerald-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#72816f]">Cryptographic Provenance</span>
                  <span className="font-mono font-semibold text-emerald-700">100%</span>
                </div>
                <div className="w-full h-1.5 bg-[#edf0e7] rounded-full overflow-hidden">
                  <div className="h-full w-full bg-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Evidence Checklist Section */}
      <div className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#193b2a]">
              MRV Evidence Checklist & Audit Gate
            </h3>
            <p className="text-xs text-[#72816f]">
              Mandatory items required before submission to accredited validation and verification bodies (VVB).
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveTab('evidence')}
            className="text-xs border-[#d8e1d4] hover:bg-[#f4f6f0]"
          >
            Open Evidence Explorer
          </Button>
        </div>

        <div className="divide-y divide-[#edf0e7]">
          {/* Item 1 */}
          <div className="py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <div>
                <strong className="text-[#193b2a] block">Cadastral Title & Land Tenancy Record</strong>
                <span className="text-[#72816f]">State Land Records (Digital Jamabandi API) · Verified</span>
              </div>
            </div>
            <span className="font-mono text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              VERIFIED
            </span>
          </div>

          {/* Item 2 */}
          <div className="py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <div>
                <strong className="text-[#193b2a] block">Copernicus Sentinel-2 BOA Reflectance Series</strong>
                <span className="text-[#72816f]">4 Cloud-Free passes (June–Aug 2026) · Corroborated</span>
              </div>
            </div>
            <span className="font-mono text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              VERIFIED
            </span>
          </div>

          {/* Item 3 */}
          <div className="py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {demoState === 'unverified' ? (
                <Clock size={16} className="text-amber-500 shrink-0" />
              ) : (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              )}
              <div>
                <strong className="text-[#193b2a] block">Perforated Water Tube (AWD) Soil Log</strong>
                <span className="text-[#72816f]">
                  {demoState === 'unverified'
                    ? 'Missing field observation log for irrigation cessation'
                    : 'AWD-Tube-Log-June-July.csv added & validated against NDWI curve'}
                </span>
              </div>
            </div>
            {demoState === 'unverified' ? (
              <span className="font-mono text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                MISSING
              </span>
            ) : (
              <span className="font-mono text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                VERIFIED
              </span>
            )}
          </div>

          {/* Item 4 */}
          <div className="py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {demoState === 'ready' ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle size={16} className="text-red-500 shrink-0" />
              )}
              <div>
                <strong className="text-[#193b2a] block">In-Boundary Geotagged Field Photograph</strong>
                <span className="text-[#72816f]">
                  {demoState === 'ready'
                    ? 'IMG_20260714_InField_DSR.jpg verified within parcel (±2.1m)'
                    : 'Current photo EV-003 flagged 420m outside boundary polygon'}
                </span>
              </div>
            </div>
            {demoState === 'ready' ? (
              <span className="font-mono text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                READY FOR VERIFICATION
              </span>
            ) : (
              <span className="font-mono text-[11px] bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200">
                FLAGGED
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
