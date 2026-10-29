import { useState } from 'react';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import { EvidenceItem } from '@/lib/terra-ledger/types';
import {
  GitFork,
  FileCheck2,
  AlertTriangle,
  Clock,
  PlusCircle,
  FileText,
  Camera,
  Satellite,
  Shield,
  Hash,
  MapPin,
  Sparkles,
  Upload,
  X,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EvidenceExplorer() {
  const {
    evidenceList,
    field,
    demoState,
    aiExplanation,
    addIrrigationLogAction,
    addInBoundaryPhotoAction,
    addCustomEvidenceAction,
  } = useTerraLedger();

  const [activeFilter, setActiveFilter] = useState<'all' | 'supporting' | 'contradicting' | 'missing'>('all');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<'photo' | 'log' | 'document' | 'sensor'>('photo');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  const filteredEvidence = evidenceList.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    addCustomEvidenceAction({
      title: uploadTitle,
      type: uploadType,
      category: 'supporting',
      status: 'verified',
      description: `Uploaded ${uploadType} for parcel ${field.code}. File: ${uploadFileName || 'custom-evidence.dat'}.`,
      fileDetails: {
        name: uploadFileName || `${uploadType}-attachment-${Date.now().toString().slice(-4)}.pdf`,
        sizeKb: Math.floor(Math.random() * 800) + 120,
        mime: uploadType === 'photo' ? 'image/jpeg' : 'application/pdf',
      },
      provenance: {
        author: 'Field Investigator (Demo)',
        source: 'TerraLedger Field App v2.4',
        sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        reviewStatus: 'Cryptographic Hash Stamped & Attached to Parcel',
      },
    });

    setUploadSuccessMessage(`Successfully attached "${uploadTitle}" to parcel ${field.code}!`);
    setTimeout(() => {
      setUploadSuccessMessage('');
      setIsUploadModalOpen(false);
      setUploadTitle('');
      setUploadFileName('');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider mb-1">
            <GitFork size={13} />
            Cryptographic Evidence Graph & Provenance
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight">
            Evidence Explorer
          </h1>
          <p className="text-xs text-[#72816f] mt-1">
            Audit-grade multi-layer evidence graph linking claims, satellite passes, parcel geometries, and field records.
          </p>
        </div>

        {/* Action Button: Add Evidence */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333]"
          >
            <PlusCircle size={14} className="mr-1.5" />
            Add / Upload Evidence
          </Button>
        </div>
      </div>

      {/* AI Explanation & Contradiction Resolution Banner */}
      <div className="bg-[#173a2b] text-[#f5f5e8] border border-[#2b503e] rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#d6eaa6] uppercase">
            <Sparkles size={14} className="text-[#d6eaa6] animate-pulse" />
            AI Evidence Synthesis & Contradiction Detection
          </div>
          <span className="text-[11px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
            Status: {demoState === 'ready' ? 'READY FOR VERIFICATION' : demoState === 'needs-review' ? 'NEEDS REVIEW' : 'UNVERIFIED'}
          </span>
        </div>

        <h3 className="font-serif text-lg font-medium text-white mb-2">
          {aiExplanation.headline}
        </h3>
        <p className="text-xs text-[#c6d7cb] leading-relaxed mb-4">
          {aiExplanation.details}
        </p>

        {/* State-specific quick resolution buttons */}
        <div className="pt-3 border-t border-[#ffffff15] flex flex-wrap items-center gap-3 text-xs">
          {demoState === 'unverified' && (
            <div className="flex items-center gap-2">
              <span className="text-amber-300 text-xs font-medium">Contradiction active:</span>
              <Button
                size="sm"
                onClick={addIrrigationLogAction}
                className="h-7 text-xs bg-[#d6eaa6] text-[#173a27] hover:bg-white font-semibold"
              >
                Resolve Water Log (Simulate Step 2)
              </Button>
            </div>
          )}
          {demoState === 'needs-review' && (
            <div className="flex items-center gap-2">
              <span className="text-sky-300 text-xs font-medium">Spatial mismatch active (+420m):</span>
              <Button
                size="sm"
                onClick={addInBoundaryPhotoAction}
                className="h-7 text-xs bg-emerald-500 text-white hover:bg-emerald-400 font-semibold"
              >
                Upload In-Boundary Photo (Simulate Step 3)
              </Button>
            </div>
          )}
          {demoState === 'ready' && (
            <div className="text-emerald-300 text-xs flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={14} className="text-emerald-400" />
              All contradictions resolved. Evidence completeness is 94%. Status: READY FOR VERIFICATION (pre-audit complete).
            </div>
          )}
        </div>
      </div>

      {/* Visual Evidence Graph Representation */}
      <div className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs">
        <h3 className="text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider mb-2">
          Relational Evidence Graph (Claims ↔ Boundaries ↔ Observations)
        </h3>
        <p className="text-[11px] text-[#72816f] mb-4">
          Visual trace connecting high-level carbon mitigation claims down to cryptographic hashes and sensor passes.
        </p>

        {/* Interactive Graph Canvas (SVG / Flex Nodes) */}
        <div className="bg-[#102e20] rounded-xl p-6 text-white overflow-x-auto border border-[#1e4834]">
          <div className="min-w-[620px] flex items-center justify-between gap-6 relative">
            {/* Column 1: Root Claim */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-[#809c88] mb-1.5">ROOT CLAIM</span>
              <div className="bg-[#173a2b] border border-[#d6eaa6]/40 rounded-xl p-3 w-44 text-center shadow-md">
                <Shield size={20} className="text-[#d6eaa6] mx-auto mb-1" />
                <strong className="text-xs font-semibold block text-white">DSR + AWD Adoption</strong>
                <span className="text-[10px] text-[#809c88] block">Kharif Season 2026</span>
                <span className="text-[9px] font-mono text-emerald-400 block mt-1">23.04 tCO2e Target</span>
              </div>
            </div>

            {/* Connecting arrows */}
            <div className="h-0.5 flex-1 bg-[#ffffff20] relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-[#809c88] rotate-45" />
            </div>

            {/* Column 2: Parcel & Farmer */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-[#809c88] mb-1.5">CADASTRAL ANCHOR</span>
              <div className="bg-[#173a2b] border border-[#ffffff20] rounded-xl p-3 w-44 text-center shadow-md">
                <MapPin size={20} className="text-sky-400 mx-auto mb-1" />
                <strong className="text-xs font-semibold block text-white">{field.code}</strong>
                <span className="text-[10px] text-[#809c88] block">{field.name}</span>
                <span className="text-[9px] font-mono text-white/70 block mt-1">{field.areaHa} ha (4 vertices)</span>
              </div>
            </div>

            {/* Connecting arrows */}
            <div className="h-0.5 flex-1 bg-[#ffffff20] relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-[#809c88] rotate-45" />
            </div>

            {/* Column 3: Multi-Source Evidence Nodes */}
            <div className="flex flex-col gap-2.5 w-52">
              <span className="text-[10px] font-mono text-[#809c88] mb-0 text-center">EVIDENCE NODES</span>

              {/* Node 1: Satellite */}
              <div className="bg-[#173a2b] border border-emerald-500/40 rounded-lg p-2 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Satellite size={14} className="text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[11px] font-medium block">Sentinel-2 Passes</span>
                    <span className="text-[9px] font-mono text-[#809c88]">4 Level-2A BOA Tiles</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 px-1 rounded">MATCH</span>
              </div>

              {/* Node 2: Water Log */}
              <div
                className={`border rounded-lg p-2 text-xs flex items-center justify-between ${
                  demoState === 'unverified'
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                    : 'bg-[#173a2b] border-emerald-500/40 text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock size={14} className={demoState === 'unverified' ? 'text-amber-400' : 'text-emerald-400'} />
                  <div>
                    <span className="text-[11px] font-medium block">AWD Water Log</span>
                    <span className="text-[9px] font-mono text-[#809c88]">
                      {demoState === 'unverified' ? 'Log missing' : 'Verified log'}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-mono px-1 rounded ${
                    demoState === 'unverified'
                      ? 'bg-amber-900/60 text-amber-300'
                      : 'bg-emerald-950 text-emerald-400'
                  }`}
                >
                  {demoState === 'unverified' ? 'MISSING' : 'MATCH'}
                </span>
              </div>

              {/* Node 3: Ground Photo */}
              <div
                className={`border rounded-lg p-2 text-xs flex items-center justify-between ${
                  demoState === 'ready'
                    ? 'bg-[#173a2b] border-emerald-500/40 text-white'
                    : 'bg-red-950/40 border-red-500/50 text-red-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Camera size={14} className={demoState === 'ready' ? 'text-emerald-400' : 'text-red-400'} />
                  <div>
                    <span className="text-[11px] font-medium block">Geotagged Photo</span>
                    <span className="text-[9px] font-mono text-[#809c88]">
                      {demoState === 'ready' ? 'EV-005 in-bounds' : 'EV-003 +420m off'}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-mono px-1 rounded ${
                    demoState === 'ready' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-900/60 text-red-300'
                  }`}
                >
                  {demoState === 'ready' ? 'READY FOR VERIFICATION' : 'MISMATCH'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Table with Filtering Tabs */}
      <div className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#edf0e7] mb-4 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#193b2a]">Evidence Records</span>
            <span className="text-[11px] font-mono bg-[#edf0e7] text-[#213c2b] px-2 py-0.5 rounded-full font-semibold">
              {filteredEvidence.length} items
            </span>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex rounded-md p-0.5 bg-[#f4f6f0] border border-[#dfe6d9] text-xs font-mono">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeFilter === 'all'
                  ? 'bg-[#193b2a] text-[#d6eaa6] font-semibold'
                  : 'text-[#72816f] hover:text-[#213c2b]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('supporting')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeFilter === 'supporting'
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'text-[#72816f] hover:text-[#213c2b]'
              }`}
            >
              Supporting
            </button>
            <button
              onClick={() => setActiveFilter('contradicting')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeFilter === 'contradicting'
                  ? 'bg-red-700 text-white font-semibold'
                  : 'text-[#72816f] hover:text-[#213c2b]'
              }`}
            >
              Flagged Mismatches
            </button>
            <button
              onClick={() => setActiveFilter('missing')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeFilter === 'missing'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'text-[#72816f] hover:text-[#213c2b]'
              }`}
            >
              Missing
            </button>
          </div>
        </div>

        {/* Evidence Cards List */}
        <div className="space-y-3">
          {filteredEvidence.map((item) => {
            const isFlagged = item.category === 'contradicting';
            const isMissing = item.category === 'missing';
            return (
              <div
                key={item.id}
                onClick={() => setSelectedEvidence(item)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all hover:shadow-xs ${
                  isFlagged
                    ? 'border-red-300 bg-red-50/50'
                    : isMissing
                    ? 'border-amber-200 bg-amber-50/40'
                    : 'border-[#dfe6d9] bg-white hover:border-[#245b45]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {item.type === 'photo' && <Camera size={15} className="text-[#245b45]" />}
                    {item.type === 'satellite' && <Satellite size={15} className="text-sky-600" />}
                    {item.type === 'document' && <FileText size={15} className="text-[#5c7c46]" />}
                    {item.type === 'log' && <Clock size={15} className="text-amber-600" />}
                    <strong className="text-sm font-semibold text-[#193b2a]">{item.title}</strong>
                    <span className="font-mono text-[10px] text-[#72816f] bg-[#f4f6f0] px-1.5 py-0.5 rounded">
                      {item.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                        isFlagged
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : isMissing
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {item.provenance.reviewStatus}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#526451] mb-2 leading-relaxed">{item.description}</p>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-[#72816f] pt-2 border-t border-[#edf0e7]">
                  <div className="flex items-center gap-4">
                    <span>Source: <strong className="text-[#213c2b]">{item.provenance.source}</strong></span>
                    {item.provenance.gpsCoordinates && (
                      <span className="font-mono text-xs">
                        GPS: {item.provenance.gpsCoordinates.lat.toFixed(4)}°N, {item.provenance.gpsCoordinates.lng.toFixed(4)}°E
                      </span>
                    )}
                  </div>
                  <span className="text-[#245b45] font-medium underline flex items-center gap-1">
                    View Details & Provenance Hash
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evidence Details Modal / Drawer */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#dfe6d9] animate-in fade-in-50 zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-[#edf0e7] mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#5c7c46] uppercase tracking-wider block mb-0.5">
                  Evidence Provenance Inspector
                </span>
                <h3 className="font-serif text-xl font-semibold text-[#193b2a]">
                  {selectedEvidence.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="p-1 rounded-full text-[#72816f] hover:text-[#193b2a] hover:bg-[#f4f6f0]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <p className="text-xs text-[#526451] bg-[#f9faf7] p-3 rounded-lg border border-[#edf0e7]">
                {selectedEvidence.description}
              </p>

              <div className="grid grid-cols-2 gap-3 py-1">
                <div>
                  <span className="text-[10px] font-mono text-[#72816f] block">RECORD ID</span>
                  <span className="font-mono font-semibold text-[#193b2a]">{selectedEvidence.id}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#72816f] block">TIMESTAMP (UTC)</span>
                  <span className="font-mono font-semibold text-[#193b2a]">{selectedEvidence.timestamp}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#72816f] block">AUTHOR / PROVIDER</span>
                  <span className="font-semibold text-[#193b2a]">{selectedEvidence.provenance.author}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#72816f] block">HARDWARE / SOURCE</span>
                  <span className="font-semibold text-[#193b2a]">{selectedEvidence.provenance.source}</span>
                </div>
              </div>

              {selectedEvidence.provenance.sha256 && (
                <div className="bg-[#102e20] text-[#f5f5e8] p-3 rounded-lg border border-[#2b503e]">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#d6eaa6] mb-1">
                    <Hash size={12} />
                    SHA-256 CONTENT DIGEST
                  </div>
                  <code className="font-mono text-[10px] break-all block text-[#a7f3d0]">
                    {selectedEvidence.provenance.sha256}
                  </code>
                </div>
              )}

              {selectedEvidence.provenance.gpsCoordinates && (
                <div className="bg-[#f4f6f0] p-3 rounded-lg border border-[#dfe6d9]">
                  <span className="text-[10px] font-mono text-[#5c7c46] block uppercase mb-1">
                    EXIF Geolocation Coordinates
                  </span>
                  <div className="flex justify-between font-mono text-xs">
                    <span>
                      {selectedEvidence.provenance.gpsCoordinates.lat}° N, {selectedEvidence.provenance.gpsCoordinates.lng}° E
                    </span>
                    <span className="text-[#72816f]">
                      Accuracy: ±{selectedEvidence.provenance.gpsCoordinates.accuracyMeters}m
                    </span>
                  </div>
                  {selectedEvidence.provenance.spatialDistanceMeters !== undefined && (
                    <div className="mt-2 text-[11px] font-semibold">
                      {selectedEvidence.provenance.spatialDistanceMeters > 0 ? (
                        <span className="text-red-700">
                          ⚠️ Spatial distance from registered polygon: +{selectedEvidence.provenance.spatialDistanceMeters}m (Flagged)
                        </span>
                      ) : (
                        <span className="text-emerald-700">
                          ✓ Enclosed within cadastral polygon boundaries (Verified)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-[#edf0e7] flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedEvidence(null)}
                className="text-xs border-[#d8e1d4]"
              >
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Upload Evidence Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dfe6d9] animate-in fade-in-50 zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-[#edf0e7] mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#5c7c46] uppercase tracking-wider block mb-0.5">
                  Demonstration Ingestion Pipeline
                </span>
                <h3 className="font-serif text-xl font-semibold text-[#193b2a]">
                  Attach Field Evidence Record
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-full text-[#72816f] hover:text-[#193b2a] hover:bg-[#f4f6f0]"
              >
                <X size={18} />
              </button>
            </div>

            {uploadSuccessMessage ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg text-[#193b2a]">Evidence Attached</h4>
                <p className="text-xs text-[#72816f]">{uploadSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSimulatedUpload} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#193b2a] block mb-1">
                    Evidence Title / Description *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. In-Field DSR Seeding Row Photograph"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#193b2a] block mb-1">
                      Evidence Category
                    </label>
                    <select
                      value={uploadType}
                      onChange={(e) => setUploadType(e.target.value as any)}
                      className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                    >
                      <option value="photo">Field Photograph (Geotagged)</option>
                      <option value="log">Irrigation / Water Tube Log</option>
                      <option value="document">Land Registry / Legal Tenancy</option>
                      <option value="sensor">Soil Moisture / IoT Sensor</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#193b2a] block mb-1">
                      Target Parcel
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`${field.code} (${field.areaHa} ha)`}
                      className="w-full text-xs bg-[#edf0e7] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#72816f] cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Simulated File Dropzone */}
                <div>
                  <label className="text-xs font-medium text-[#193b2a] block mb-1">
                    Select File (Simulated)
                  </label>
                  <div className="border-2 border-dashed border-[#dce3d7] rounded-xl p-4 text-center bg-[#f9faf7] hover:bg-[#edf0e7] transition-colors cursor-pointer">
                    <Upload size={20} className="text-[#5c7c46] mx-auto mb-1" />
                    <span className="text-xs text-[#213c2b] block font-medium">
                      {uploadFileName || 'Click to select or drag and drop image or CSV'}
                    </span>
                    <span className="text-[10px] text-[#72816f] block mt-0.5">
                      JPG, PNG, PDF, CSV up to 25 MB
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadFileName(e.target.files[0].name);
                          if (!uploadTitle) setUploadTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                        }
                      }}
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block mt-2 text-[11px] font-semibold text-[#245b45] underline cursor-pointer"
                    >
                      Browse Files
                    </label>
                  </div>
                </div>

                <div className="bg-[#f4f6f0] p-3 rounded-lg text-[11px] text-[#72816f]">
                  Demonstration Notice: Uploads are processed in local memory and stamped with simulated SHA-256 digests. No external data is published.
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="text-xs border-[#d8e1d4]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333]"
                  >
                    Stamp & Attach to Parcel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
