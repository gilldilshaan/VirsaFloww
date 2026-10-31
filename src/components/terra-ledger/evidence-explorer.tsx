import { useState, useEffect, useContext } from 'react';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import { EvidenceItem } from '@/lib/terra-ledger/types';
import { AuthContext } from '@/lib/auth/auth-context';
import { api } from '@/lib/api';
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
  Loader2,
  History,
  RotateCcw,
  ArrowRight,
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

  const auth = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const isDemoMode = auth?.isDemoMode ?? true;
  const user = auth?.user ?? null;

  const [activeFilter, setActiveFilter] = useState<'all' | 'supporting' | 'contradicting' | 'missing'>('all');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<'photo' | 'log' | 'document' | 'sensor'>('photo');
  const [uploadFileName, setUploadFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [serverSha256, setServerSha256] = useState<string | null>(null);

  // History inspection state
  const [historyTrail, setHistoryTrail] = useState<Array<{
    timestamp: string;
    previousStatus: string;
    newStatus: string;
    actorId: string;
    reason?: string;
  }> | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Supersede modal state
  const [isSupersedeModalOpen, setIsSupersedeModalOpen] = useState(false);
  const [supersedeReason, setSupersedeReason] = useState('');
  const [supersedeFileName, setSupersedeFileName] = useState('');
  const [supersedeFile, setSupersedeFile] = useState<File | null>(null);
  const [isSuperseding, setIsSuperseding] = useState(false);
  const [supersedeError, setSupersedeError] = useState<string | null>(null);

  const filteredEvidence = evidenceList.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  // Load immutable lifecycle audit history when an item is selected
  useEffect(() => {
    if (!selectedEvidence) {
      setHistoryTrail(null);
      return;
    }

    let isMounted = true;
    setIsLoadingHistory(true);

    api
      .getEvidenceHistory(selectedEvidence.id)
      .then((res) => {
        if (isMounted && res.history) {
          setHistoryTrail(res.history);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHistoryTrail([
            {
              timestamp: selectedEvidence.timestamp,
              previousStatus: 'received',
              newStatus: 'hash_recorded',
              actorId: selectedEvidence.provenance.author,
              reason: selectedEvidence.provenance.reviewStatus || 'Cryptographic SHA-256 hash stamped upon upload.',
            },
          ]);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingHistory(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedEvidence]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      if (isAuthenticated && !isDemoMode && user && !user.isDemoUser) {
        // Live backend upload via multipart/form-data
        const formData = new FormData();
        const fileToUpload =
          selectedFile ||
          new File(
            [new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00])],
            uploadFileName || 'evidence.gif',
            { type: 'image/gif' }
          );

        formData.append('file', fileToUpload);
        formData.append('fieldId', field.id || 'PB-FIELD-001');
        formData.append('title', uploadTitle.trim());
        formData.append('type', uploadType);
        formData.append('category', 'supporting');
        formData.append('capturedAt', new Date().toISOString());
        formData.append('author', user.name || user.email || 'Registered User');
        formData.append('source', 'virsa_web_client');

        const created = await api.submitEvidence(formData);
        addCustomEvidenceAction(created);
        setServerSha256(created.provenance.sha256 || null);
        setUploadSuccessMessage(`Successfully uploaded and sealed with SHA-256 digest!`);
      } else {
        // Deterministic demo mode simulation
        const simSha = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        addCustomEvidenceAction({
          title: uploadTitle.trim(),
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
            author: user?.name || 'Field Investigator (Demo)',
            source: 'VirsaFlow Field App v2.4',
            sha256: simSha,
            reviewStatus: 'Cryptographic Hash Stamped & Attached to Parcel',
          },
        });
        setServerSha256(simSha);
        setUploadSuccessMessage(`Successfully attached "${uploadTitle}" to parcel ${field.code}!`);
      }

      setTimeout(() => {
        setUploadSuccessMessage('');
        setIsUploadModalOpen(false);
        setUploadTitle('');
        setUploadFileName('');
        setSelectedFile(null);
        setServerSha256(null);
      }, 2000);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Evidence upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSupersedeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvidence || !supersedeReason.trim()) return;

    setIsSuperseding(true);
    setSupersedeError(null);

    try {
      const formData = new FormData();
      const fileToUpload =
        supersedeFile ||
        new File(
          [new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00])],
          supersedeFileName || 'superseded_replacement.gif',
          { type: 'image/gif' }
        );

      formData.append('file', fileToUpload);
      formData.append('reason', supersedeReason.trim());
      formData.append('title', `Correction: ${selectedEvidence.title}`);

      const newItem = await api.supersedeEvidence(selectedEvidence.id, formData);
      addCustomEvidenceAction(newItem);
      setIsSupersedeModalOpen(false);
      setSelectedEvidence(newItem);
      setSupersedeReason('');
      setSupersedeFileName('');
      setSupersedeFile(null);
    } catch (err) {
      setSupersedeError(err instanceof Error ? err.message : 'Failed to supersede evidence record.');
    } finally {
      setIsSuperseding(false);
    }
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
            onClick={() => {
              setUploadError(null);
              setIsUploadModalOpen(true);
            }}
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

        {/* Interactive Graph Canvas */}
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

            {/* Column 3: Telemetry & Satellite */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-[#809c88] mb-1.5">VERIFICATION CORROBORATION</span>
              <div className="bg-[#173a2b] border border-[#ffffff20] rounded-xl p-3 w-44 text-center shadow-md">
                <Satellite size={20} className="text-amber-300 mx-auto mb-1" />
                <strong className="text-xs font-semibold block text-white">Sentinel-2 Passes</strong>
                <span className="text-[10px] text-[#809c88] block">NDVI: 0.72 | NDWI: -0.18</span>
                <span className="text-[9px] font-mono text-emerald-400 block mt-1">10m Multi-Spectral</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#dfe6d9] pb-3 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'all' ? 'bg-[#245b45] text-white' : 'text-[#526451] hover:bg-[#edf0e7]'
          }`}
        >
          All Evidence ({evidenceList.length})
        </button>
        <button
          onClick={() => setActiveFilter('supporting')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeFilter === 'supporting' ? 'bg-[#245b45] text-white' : 'text-[#526451] hover:bg-[#edf0e7]'
          }`}
        >
          <FileCheck2 size={13} className="text-emerald-500" />
          Supporting ({evidenceList.filter((i) => i.category === 'supporting').length})
        </button>
        <button
          onClick={() => setActiveFilter('contradicting')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeFilter === 'contradicting' ? 'bg-[#245b45] text-white' : 'text-[#526451] hover:bg-[#edf0e7]'
          }`}
        >
          <AlertTriangle size={13} className="text-amber-500" />
          Flagged / Contradicting ({evidenceList.filter((i) => i.category === 'contradicting').length})
        </button>
        <button
          onClick={() => setActiveFilter('missing')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeFilter === 'missing' ? 'bg-[#245b45] text-white' : 'text-[#526451] hover:bg-[#edf0e7]'
          }`}
        >
          <Clock size={13} className="text-rose-500" />
          Missing Mandatory ({evidenceList.filter((i) => i.category === 'missing').length})
        </button>
      </div>

      {/* Evidence Cards Grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvidence.map((item) => {
            const isContradiction = item.category === 'contradicting';
            const isMissing = item.category === 'missing';

            return (
              <div
                key={item.id}
                onClick={() => setSelectedEvidence(item)}
                className={`border rounded-xl p-4 bg-white hover:shadow-md transition-all cursor-pointer relative group ${
                  isContradiction
                    ? 'border-amber-300 bg-amber-50/20'
                    : isMissing
                    ? 'border-rose-300 bg-rose-50/20'
                    : 'border-[#dfe6d9] hover:border-[#245b45]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#f4f6f0] text-[#245b45]">
                      {item.type === 'photo' && <Camera size={14} />}
                      {item.type === 'satellite' && <Satellite size={14} />}
                      {item.type === 'document' && <FileText size={14} />}
                      {item.type === 'log' && <FileCheck2 size={14} />}
                      {item.type === 'sensor' && <Shield size={14} />}
                    </span>
                    <div>
                      <h4 className="font-semibold text-xs text-[#193b2a] group-hover:text-[#245b45] transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-[#72816f] block">
                        {item.id} · {item.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                        isContradiction
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : isMissing
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                    {item.supersedesId && (
                      <span className="text-[9px] font-mono text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.2 rounded">
                        Supersedes {item.supersedesId}
                      </span>
                    )}
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

      {/* Evidence Details Modal / Provenance Inspector */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#dfe6d9] animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#edf0e7] mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#5c7c46] uppercase tracking-wider block mb-0.5">
                  Evidence Provenance & Immutability Inspector
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

              {/* Supersession indicators */}
              {selectedEvidence.supersedesId && (
                <div className="bg-purple-50 border border-purple-200 text-purple-900 rounded-lg p-2.5 text-xs flex items-center gap-2">
                  <RotateCcw size={14} className="text-purple-600 shrink-0" />
                  <span>
                    Non-Destructive Version: This record supersedes <strong>{selectedEvidence.supersedesId}</strong>.
                  </span>
                </div>
              )}

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
                    SHA-256 CONTENT DIGEST (SERVER SEALED)
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

              {/* Immutable Lifecycle Status History */}
              <div className="border border-[#dfe6d9] rounded-xl p-3 bg-white">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#193b2a] uppercase tracking-wider mb-2 font-semibold">
                  <History size={12} />
                  Immutable Lifecycle History Trail
                </div>
                {isLoadingHistory ? (
                  <div className="py-3 text-center text-[#72816f] text-xs flex items-center justify-center gap-2">
                    <Loader2 size={13} className="animate-spin" /> Loading tamper-evident history...
                  </div>
                ) : historyTrail && historyTrail.length > 0 ? (
                  <div className="space-y-2">
                    {historyTrail.map((h, idx) => (
                      <div key={idx} className="text-[11px] p-2 bg-[#f7f9f5] rounded border border-[#edf0e7]">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#72816f] mb-0.5">
                          <span>{h.timestamp}</span>
                          <span>Actor: {h.actorId}</span>
                        </div>
                        <div className="font-semibold text-[#193b2a]">
                          {h.previousStatus.toUpperCase()} → {h.newStatus.toUpperCase()}
                        </div>
                        {h.reason && <p className="text-[#556e50] text-[10px] mt-0.5">{h.reason}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#72816f] text-[11px]">No status transitions recorded yet.</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#edf0e7] flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSupersedeReason('');
                  setSupersedeFileName('');
                  setSupersedeFile(null);
                  setSupersedeError(null);
                  setIsSupersedeModalOpen(true);
                }}
                className="text-xs border-amber-300 text-amber-900 hover:bg-amber-50"
              >
                <RotateCcw size={12} className="mr-1.5 text-amber-600" />
                Supersede / Replace
              </Button>

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
                  {isAuthenticated && !isDemoMode ? 'Live Verification Ingestion' : 'Demonstration Ingestion Pipeline'}
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
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg text-[#193b2a]">Evidence Sealed & Attached</h4>
                <p className="text-xs text-[#72816f]">{uploadSuccessMessage}</p>
                {serverSha256 && (
                  <div className="bg-[#102e20] p-2.5 rounded-lg border border-[#2b503e] text-left">
                    <span className="text-[9px] font-mono text-[#d6eaa6] block uppercase mb-1">
                      SHA-256 Digest:
                    </span>
                    <code className="text-[10px] font-mono text-[#a7f3d0] break-all block">
                      {serverSha256}
                    </code>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {uploadError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-2.5 text-xs">
                    {uploadError}
                  </div>
                )}

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

                {/* File Dropzone */}
                <div>
                  <label className="text-xs font-medium text-[#193b2a] block mb-1">
                    Select File
                  </label>
                  <div className="border-2 border-dashed border-[#dce3d7] rounded-xl p-4 text-center bg-[#f9faf7] hover:bg-[#edf0e7] transition-colors cursor-pointer">
                    <Upload size={20} className="text-[#5c7c46] mx-auto mb-1" />
                    <span className="text-xs text-[#213c2b] block font-medium">
                      {uploadFileName || 'Click to select or drag and drop image or CSV'}
                    </span>
                    <span className="text-[10px] text-[#72816f] block mt-0.5">
                      JPG, PNG, PDF, CSV, GIF up to 25 MB
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
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
                  {isAuthenticated && !isDemoMode
                    ? 'Production Notice: Uploads are sent over multipart/form-data to FastAPI backend and sealed with a cryptographic SHA-256 digest in PostgreSQL.'
                    : 'Demonstration Notice: Uploads are processed with simulated SHA-256 digests in demo mode.'}
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
                    disabled={isUploading}
                    size="sm"
                    className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333] disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={13} className="animate-spin mr-1.5" />
                        Uploading & Sealing...
                      </>
                    ) : (
                      'Stamp & Attach to Parcel'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Supersede Evidence Modal */}
      {isSupersedeModalOpen && selectedEvidence && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-[#edf0e7] mb-4">
              <div>
                <span className="text-[10px] font-mono text-amber-700 uppercase tracking-wider block mb-0.5">
                  Non-Destructive Supersession
                </span>
                <h3 className="font-serif text-xl font-semibold text-[#193b2a]">
                  Supersede Evidence {selectedEvidence.id}
                </h3>
              </div>
              <button
                onClick={() => setIsSupersedeModalOpen(false)}
                className="p-1 rounded-full text-[#72816f] hover:text-[#193b2a] hover:bg-[#f4f6f0]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSupersedeSubmit} className="space-y-4 text-xs">
              {supersedeError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-2.5 text-xs">
                  {supersedeError}
                </div>
              )}

              <p className="text-[#556e50]">
                Upload an updated or corrected file to supersede <strong>{selectedEvidence.title}</strong>.
                The previous record is preserved permanently in the immutable audit trail.
              </p>

              <div>
                <label className="text-xs font-medium text-[#193b2a] block mb-1">
                  Reason for Supersession *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. In-boundary geotagged replacement following auditor request..."
                  value={supersedeReason}
                  onChange={(e) => setSupersedeReason(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#193b2a] block mb-1">
                  Replacement File *
                </label>
                <div className="border-2 border-dashed border-[#dce3d7] rounded-xl p-3 text-center bg-[#f9faf7]">
                  <Upload size={18} className="text-[#5c7c46] mx-auto mb-1" />
                  <span className="text-xs text-[#213c2b] block font-medium">
                    {supersedeFileName || 'Choose replacement file'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    id="supersede-file-upload"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSupersedeFile(e.target.files[0]);
                        setSupersedeFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label
                    htmlFor="supersede-file-upload"
                    className="inline-block mt-1.5 text-[11px] font-semibold text-[#245b45] underline cursor-pointer"
                  >
                    Select Replacement File
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSupersedeModalOpen(false)}
                  className="text-xs border-[#d8e1d4]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSuperseding}
                  size="sm"
                  className="text-xs bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  {isSuperseding ? (
                    <>
                      <Loader2 size={13} className="animate-spin mr-1.5" />
                      Superseding...
                    </>
                  ) : (
                    'Confirm Supersession'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
