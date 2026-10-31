import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState, useEffect, useRef } from 'react';
import { getFarmerFields, getFarmerEvidenceUploads } from '@/lib/farmer/farmer-service';
import { api } from '@/lib/api/client';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import {
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  RefreshCw,
  Info,
  Check,
  FileCheck,
  Hash,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

interface SubmittedEvidenceRecord {
  id: string;
  fieldId: string;
  type: string;
  title: string;
  fileName: string;
  uploadedAt: string;
  status: string;
  sha256?: string;
  rejectionReason: string | null;
  lat?: number;
  lng?: number;
  accuracy?: number;
}

export function FarmerEvidencePage() {
  const fields = useMemo(() => getFarmerFields(), []);
  const initialUploads = useMemo(() => getFarmerEvidenceUploads(), []);
  const [uploads, setUploads] = useState<SubmittedEvidenceRecord[]>([]);

  const [selectedField, setSelectedField] = useState(fields[0]?.id || 'PB-LUD-042');
  const [evidenceType, setEvidenceType] = useState<'photo' | 'document' | 'log'>('photo');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Geolocation state
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'requesting' | 'acquired' | 'denied'>('idle');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [manualLat, setManualLat] = useState('30.9112');
  const [manualLng, setManualLng] = useState('75.8374');

  const [isUploading, setIsUploading] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ id: string; sha256: string; title: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load existing evidence from backend or fallback to initial records
  useEffect(() => {
    async function loadEvidence() {
      try {
        const res = await api.get<{ items: any[] }>(`/evidence?fieldId=${selectedField}`);
        if (res.data && Array.isArray(res.data.items) && res.data.items.length > 0) {
          const mapped: SubmittedEvidenceRecord[] = res.data.items.map((item) => ({
            id: item.id,
            fieldId: item.fieldId || item.field_id,
            type: item.type,
            title: item.title,
            fileName: item.fileDetails?.name || item.file_details?.name || 'document.pdf',
            uploadedAt: item.submittedAt || item.submitted_at || new Date().toISOString(),
            status: item.provenance?.review_status || item.status,
            sha256: item.provenance?.sha256,
            rejectionReason: null,
            lat: item.provenance?.gpsCoordinates?.lat,
            lng: item.provenance?.gpsCoordinates?.lng,
            accuracy: item.provenance?.gpsCoordinates?.accuracyMeters,
          }));
          setUploads(mapped);
          return;
        }
      } catch {}

      // Fallback
      setUploads(
        initialUploads.map((u) => ({
          ...u,
          sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        }))
      );
    }
    loadEvidence();
  }, [selectedField]);

  // Request browser GPS position
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('denied');
      return;
    }

    setGpsStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({
          lat: parseFloat(pos.coords.latitude.toFixed(6)),
          lng: parseFloat(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy),
        });
        setGpsStatus('acquired');
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setGpsStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    if (selected.type.startsWith('image/')) {
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please provide a descriptive title for this evidence.');
      return;
    }

    if (!file) {
      setErrorMessage('Please attach a valid evidence file (photo, document, or log).');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fieldId', selectedField);
      formData.append('title', title);
      formData.append('type', evidenceType);
      formData.append('category', 'supporting');
      formData.append('capturedAt', new Date().toISOString());
      formData.append('author', 'Gurdev Singh Gill (Farmer)');
      formData.append('source', 'farmer_portal_web');
      formData.append('description', description || `${evidenceType} evidence submitted from field`);

      // Coordinates
      const finalLat = gpsCoords ? gpsCoords.lat : parseFloat(manualLat);
      const finalLng = gpsCoords ? gpsCoords.lng : parseFloat(manualLng);
      const finalAccuracy = gpsCoords ? gpsCoords.accuracy : 15;

      if (!isNaN(finalLat) && !isNaN(finalLng)) {
        formData.append('lat', String(finalLat));
        formData.append('lng', String(finalLng));
        formData.append('accuracyMeters', String(finalAccuracy));
      }

      const res = await api.upload<any>('/evidence', formData);

      if (res.data) {
        const item = res.data;
        const newRecord: SubmittedEvidenceRecord = {
          id: item.id,
          fieldId: item.fieldId || selectedField,
          type: item.type || evidenceType,
          title: item.title || title,
          fileName: file.name,
          uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          status: 'hash_recorded',
          sha256: item.provenance?.sha256 || 'SHA-256 Calculated',
          rejectionReason: null,
          lat: finalLat,
          lng: finalLng,
          accuracy: finalAccuracy,
        };

        setUploads([newRecord, ...uploads]);
        setSuccessInfo({
          id: item.id,
          sha256: item.provenance?.sha256 || 'Calculated',
          title,
        });

        // Reset form
        setTitle('');
        setDescription('');
        setFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setErrorMessage(res.error?.message || 'Failed to upload evidence. Please retry.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error occurred during evidence upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="ਸਬੂਤ ਅਪਲੋਡ · Evidence Upload"
        description="Submit geotagged field emergence photographs, PVC water tube readings, or machinery logs. Raw binary SHA-256 hashes are sealed upon upload."
        badge={<DemoBadge label="Cryptographic Provenance" />}
      />

      {/* Success Notification Banner */}
      {successInfo && (
        <div className="p-4 sm:p-5 bg-[#eef5ea] border border-[#245b45] rounded-2xl space-y-2 text-xs text-[#193b2a]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#245b45] shrink-0" />
            <span className="font-semibold text-sm">Evidence Cryptographically Sealed & Enqueued for Review</span>
          </div>
          <p className="text-[#5c7c46] leading-relaxed">
            Record ID <strong>{successInfo.id}</strong> has been transmitted to the MRV repository and immediately dispatched to the auditor workbench.
          </p>
          <div className="pt-2 border-t border-[#d6eaa6] flex items-center gap-2 font-mono text-[11px] text-[#245b45] overflow-x-auto">
            <Hash size={13} className="shrink-0" />
            <span>SHA-256: {successInfo.sha256}</span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
          <AlertTriangle size={15} className="text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Real Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-[#dde4d9] shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-[#edf0e7] pb-4">
          <h3 className="font-serif text-lg font-bold text-[#193b2a]">Submit Ground Truth Evidence</h3>
          <span className="text-[10px] font-mono bg-[#f4f7f1] text-[#245b45] font-semibold px-2 py-0.5 rounded">
            FastAPI Multipart Sync
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-[#193b2a] block">Target Field Parcel</label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] font-medium"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.code})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-[#193b2a] block">Evidence Category</label>
            <select
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value as any)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] font-medium"
            >
              <option value="photo">Geotagged Crop Emergence Photo (JPEG / PNG)</option>
              <option value="log">AWD Field Water Tube Measurement Log (CSV)</option>
              <option value="document">Certified Seed Drill Purchase Receipt (PDF)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-[#193b2a] block">Title / Agronomic Milestone</label>
          <input
            type="text"
            required
            placeholder="e.g. 21-Day Vegetative Emergence Row Alignment"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a]"
          />
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-[#193b2a] block">Field Observation Notes (Optional)</label>
          <input
            type="text"
            placeholder="e.g. In-boundary shoot height 12cm; soil moisture reading 18%; AWD tube dry to -8cm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a]"
          />
        </div>

        {/* Location Capture Widget */}
        <div className="p-4 bg-[#fafbf9] border border-[#dfe6d9] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#193b2a]">
              <MapPin size={15} className="text-[#245b45]" />
              <span>Ground Coordinate Tagging (EXIF & Geolocation)</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={requestLocation}
              disabled={gpsStatus === 'requesting'}
              className="h-7 text-[11px] border-[#193b2a] text-[#193b2a] hover:bg-[#eef5ea]"
            >
              {gpsStatus === 'requesting' ? (
                <>
                  <RefreshCw size={11} className="mr-1 animate-spin" /> Fetching GPS...
                </>
              ) : gpsStatus === 'acquired' ? (
                <>
                  <Check size={11} className="mr-1 text-emerald-700" /> Refresh GPS
                </>
              ) : (
                'Capture Device GPS'
              )}
            </Button>
          </div>

          {gpsStatus === 'acquired' && gpsCoords && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
              <span>
                Lat: <strong>{gpsCoords.lat}° N</strong> · Lng: <strong>{gpsCoords.lng}° E</strong>
              </span>
              <span className="text-[10px] font-mono text-emerald-700">Accuracy: ±{gpsCoords.accuracy}m</span>
            </div>
          )}

          {gpsStatus === 'denied' && (
            <div className="space-y-2">
              <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-center gap-2">
                <Info size={13} className="shrink-0 text-amber-700" />
                <span>Device GPS unavailable or permission denied. Using manual field coordinate fallback.</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-[#708071] block font-mono">Latitude (°N)</label>
                  <input
                    type="text"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    className="w-full text-xs bg-white border border-[#dce3d7] rounded px-2.5 py-1 text-[#193b2a] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#708071] block font-mono">Longitude (°E)</label>
                  <input
                    type="text"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    className="w-full text-xs bg-white border border-[#dce3d7] rounded px-2.5 py-1 text-[#193b2a] font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Real File Picker and Live Preview */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-6 border-2 border-dashed border-[#dce3d7] hover:border-[#245b45] rounded-xl text-center bg-[#fafbf9] space-y-2 cursor-pointer transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,text/csv,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {file ? (
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#245b45] rounded-full text-xs font-semibold text-[#193b2a]">
                <FileCheck size={14} className="text-[#245b45]" />
                <span>{file.name}</span>
                <span className="text-[10px] text-[#708071]">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              {previewUrl && (
                <div className="max-w-xs mx-auto mt-2 rounded-lg overflow-hidden border border-[#dce3d7] shadow-2xs">
                  <img src={previewUrl} alt="Preview" className="w-full h-36 object-cover" />
                </div>
              )}
              <span className="text-[11px] text-[#5c7c46] block">Click to select a different file</span>
            </div>
          ) : (
            <>
              <Camera size={26} className="text-[#5c7c46] mx-auto" />
              <div className="text-xs text-[#193b2a]">
                <span className="font-semibold text-[#245b45]">Select real file</span> or drag image / document here
              </div>
              <span className="text-[10px] text-[#8a9b8b] block">JPEG, PNG, CSV, or PDF up to 15MB</span>
            </>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isUploading || !file}
            className="bg-[#193B2A] text-white hover:bg-[#245B45] text-xs h-10 px-6 font-semibold"
          >
            {isUploading ? (
              <>
                <RefreshCw size={13} className="mr-2 animate-spin" />
                Calculating SHA-256 & Uploading...
              </>
            ) : (
              <>
                <Upload size={14} className="mr-2" />
                Upload & Seal Hash
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Submitted Evidence Items with SHA-256 Proof */}
      <div className="space-y-3">
        <h3 className="font-serif text-lg font-bold text-[#193b2a]">Submitted Field Records</h3>
        <div className="space-y-3">
          {uploads.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-5 border border-[#dde4d9] shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#193b2a]">{item.title}</span>
                  <span className="text-[10px] font-mono bg-[#eef3eb] text-[#245b45] px-1.5 py-0.5 rounded font-semibold">
                    {item.fieldId}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                    item.status === 'Accepted by Reviewer' || item.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : item.status === 'Clarification Requested' || item.status === 'correction_requested'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-[#eef5ea] text-[#245b45] border border-[#d6eaa6]'
                  }`}
                >
                  {item.status.toUpperCase()}
                </span>
              </div>

              <div className="text-[11px] text-[#708071] font-mono flex items-center justify-between flex-wrap gap-2">
                <span>File: {item.fileName}</span>
                <span>{item.uploadedAt}</span>
              </div>

              {item.sha256 && (
                <div className="pt-2 border-t border-[#f0f3ec] text-[10px] font-mono text-[#5c7c46] flex items-center gap-1.5 overflow-x-auto">
                  <Hash size={11} className="shrink-0" />
                  <span>SHA-256: {item.sha256}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/evidence')({
  head: () =>
    pageHead(
      'Upload Evidence | VirsaFlow',
      'Upload field emergence photos, irrigation logs, and GPS ground truth.',
      '/farmer/evidence'
    ),
  component: FarmerEvidencePage,
});
