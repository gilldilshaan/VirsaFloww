import { useState } from 'react';
import { useTerraLedger } from '@/lib/terra-ledger/store';
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

  const [mapLayer, setMapLayer] = useState<'boundaries' | 'indices' | 'provenance'>('boundaries');

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
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Area & Scale</span>
          <strong className="block text-2xl font-mono text-[#193b2a] mt-1">
            {field.areaHa} <small className="text-xs font-sans text-[#72816f]">ha</small>
          </strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">{field.areaAcres} acres · {field.district}</span>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Projected Mitigation</span>
          <strong className="block text-2xl font-mono text-[#245b45] mt-1">
            {field.targetEmissionReductionTonnes}{' '}
            <small className="text-xs font-sans text-[#72816f]">tCO2e/yr</small>
          </strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">4.8 t/ha DSR-AWD reduction</span>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Farmer Partner</span>
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

      {/* Main Assessment Grid: Boundary Canvas + AI Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Boundary & Geotag Map Canvas */}
        <div className="lg:col-span-7 bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf0e7] mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#245b45]" />
              <h2 className="text-sm font-semibold text-[#193b2a]">
                Cadastral Boundary & Spatial Enclosure Canvas
              </h2>
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
                Cadastral
              </button>
              <button
                onClick={() => setMapLayer('indices')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  mapLayer === 'indices'
                    ? 'bg-[#193b2a] text-white font-medium'
                    : 'bg-[#f4f6f0] text-[#72816f] hover:text-[#213c2b]'
                }`}
              >
                NDVI Overlay
              </button>
            </div>
          </div>

          {/* Interactive SVG Visualization */}
          <div className="relative w-full aspect-16/10 bg-[#173024] rounded-lg overflow-hidden border border-[#2b503e] flex items-center justify-center">
            {/* Background Satellite Texture */}
            <div
              className={`absolute inset-0 opacity-40 mix-blend-luminosity bg-cover bg-center transition-all duration-700 ${
                mapLayer === 'indices' ? 'filter saturate-200 hue-rotate-30' : ''
              }`}
              style={{ backgroundImage: `url('/earth/platform-field-satellite.webp')` }}
            />

            {/* SVG Drawing Layer */}
            <svg
              viewBox="0 0 600 380"
              className="relative z-10 w-full h-full p-4"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Field Polygon PB-LUD-042 */}
              <polygon
                points="160,70 440,90 410,310 130,270"
                fill={mapLayer === 'indices' ? 'rgba(74, 222, 128, 0.25)' : 'rgba(214, 234, 166, 0.2)'}
                stroke="#d6eaa6"
                strokeWidth="2.5"
                strokeDasharray={mapLayer === 'indices' ? '0' : '4,2'}
              />

              {/* Centroid Label */}
              <text x="270" y="185" fill="#ffffff" fontSize="12" fontFamily="IBM Plex Mono" textAnchor="middle" opacity="0.9">
                PARCEL PB-LUD-042 (4.8 ha)
              </text>
              <text x="270" y="202" fill="#d6eaa6" fontSize="10" fontFamily="IBM Plex Mono" textAnchor="middle" opacity="0.8">
                30.9110° N, 75.8370° E
              </text>

              {/* Boundary Vertices */}
              {[[160, 70], [440, 90], [410, 310], [130, 270]].map(([x, y], idx) => (
                <circle key={idx} cx={x} cy={y} r="4" fill="#d6eaa6" stroke="#102e20" strokeWidth="2" />
              ))}

              {/* State 1 & 2: Photograph Out-of-bounds Marker (RED) */}
              {(demoState === 'unverified' || demoState === 'needs-review') && (
                <g className="animate-pulse">
                  {/* Distance line from field edge */}
                  <line x1="440" y1="90" x2="520" y2="45" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" />
                  <text x="495" y="80" fill="#fca5a5" fontSize="9" fontFamily="IBM Plex Mono">
                    +420m offset
                  </text>

                  {/* Flagged Photo Pin */}
                  <circle cx="520" cy="45" r="14" fill="rgba(239, 68, 68, 0.25)" />
                  <circle cx="520" cy="45" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                  <rect x="440" y="10" width="150" height="22" rx="4" fill="#7f1d1d" opacity="0.95" />
                  <text x="515" y="25" fill="#fecaca" fontSize="9" fontFamily="IBM Plex Mono" textAnchor="middle" fontWeight="bold">
                    ⚠️ Photo EV-003 Mismatch
                  </text>
                </g>
              )}

              {/* State 3: Geotag In-Bounds Marker (GREEN) */}
              {demoState === 'ready' && (
                <g>
                  {/* Photo Pin inside field */}
                  <circle cx="270" cy="140" r="14" fill="rgba(34, 197, 94, 0.25)" className="animate-ping" />
                  <circle cx="270" cy="140" r="6" fill="#22c55e" stroke="#ffffff" strokeWidth="2" />
                  <rect x="160" y="105" width="220" height="22" rx="4" fill="#14532d" opacity="0.95" />
                  <text x="270" y="120" fill="#bbf7d0" fontSize="9" fontFamily="IBM Plex Mono" textAnchor="middle" fontWeight="bold">
                    ✓ Photo EV-005 Ready for Verification
                  </text>
                </g>
              )}
            </svg>

            {/* Bottom Overlay Legend */}
            <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-xs rounded-md px-3 py-2 flex items-center justify-between text-[11px] text-white font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full border border-white bg-[#d6eaa6]" />
                  Boundary
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full border border-white ${
                      demoState === 'ready' ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  />
                  {demoState === 'ready' ? 'In-Bounds Pin · Ready for Verification' : 'Flagged Pin (+420m)'}
                </span>
              </div>
              <span className="text-[#a7f3d0]">Cadastral: Revenue Dept PB</span>
            </div>
          </div>

          {/* Spatial Summary Note */}
          <div className="mt-3 text-xs text-[#72816f] flex items-center justify-between">
            <span>Spatial Tolerance Threshold: &lt; 5.0m</span>
            <span className="font-mono">
              Status:{' '}
              <strong className={demoState === 'ready' ? 'text-emerald-700' : 'text-amber-700'}>
                {demoState === 'ready' ? 'Enclosure Pass (100% in bounds)' : 'Enclosure Violation Detected'}
              </strong>
            </span>
          </div>
        </div>

        {/* Right Column (5 cols): AI Diagnostics & Action Steps */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* AI Explanation Card */}
          <div className="bg-[#173a2b] text-[#f5f5e8] border border-[#2b503e] rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono text-[#d6eaa6] mb-2 uppercase">
              <Sparkles size={14} className="animate-spin text-[#d6eaa6]" />
              TerraLedger AI Diagnostics
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
