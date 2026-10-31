import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { getFarmerFields, getFarmerEvidenceUploads, uploadFarmerEvidence } from '@/lib/farmer/farmer-service';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { Upload, Camera, FileText, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function FarmerEvidencePage() {
  const fields = useMemo(() => getFarmerFields(), []);
  const initialUploads = useMemo(() => getFarmerEvidenceUploads(), []);
  const [uploads, setUploads] = useState(initialUploads);

  const [selectedField, setSelectedField] = useState(fields[0]?.id || 'PB-LUD-042');
  const [evidenceType, setEvidenceType] = useState<'photo' | 'document' | 'log'>('photo');
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      const newRec = uploadFarmerEvidence({
        fieldId: selectedField,
        type: evidenceType,
        title,
        fileName: fileName || `${evidenceType}_${Date.now()}.jpg`,
      });

      setUploads([newRec, ...uploads]);
      setIsUploading(false);
      setSuccessMsg(`Evidence successfully recorded. Server SHA-256 hash generated.`);
      setTitle('');
      setFileName('');
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="ਸਬੂਤ ਅਪਲੋਡ · Evidence Upload"
        description="Upload geotagged field emergence photographs, AWD PVC pipe measurements, or machine logs."
        badge={<DemoBadge label="Immutable Audit Hash" />}
      />

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="bg-white rounded-2xl p-6 sm:p-8 border border-[#dde4d9] shadow-2xs space-y-5">
        <h3 className="font-serif text-lg font-bold text-[#193b2a]">Submit Field Ground Truth</h3>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-[#193b2a] block">Field Parcel</label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a]"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.code})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#193b2a] block">Evidence Category</label>
            <select
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value as any)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a]"
            >
              <option value="photo">Geotagged Emergence Photograph (EXIF GPS)</option>
              <option value="log">PVC Tube Water Level Log (AWD)</option>
              <option value="document">Seed Drill Receipt / FPO Certificate</option>
            </select>
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-semibold text-[#193b2a] block">Evidence Description / Title</label>
          <input
            type="text"
            required
            placeholder="e.g. In-boundary 30-day DSR vegetative drill emergence photo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a]"
          />
        </div>

        <div className="p-4 border-2 border-dashed border-[#dce3d7] rounded-xl text-center bg-[#fafbf9] space-y-2">
          <Camera size={24} className="text-[#5c7c46] mx-auto" />
          <div className="text-xs text-[#708071]">
            <span className="font-semibold text-[#245b45]">Click to simulate file selection</span> or drag image here
          </div>
          <span className="text-[10px] text-[#8a9b8b] block">JPEG, PNG, or CSV up to 15MB</span>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isUploading}
            className="bg-[#245b45] text-white hover:bg-[#1a4333] text-xs h-10 px-6"
          >
            {isUploading ? 'Computing SHA-256...' : 'Upload & Compute Hash'}
          </Button>
        </div>
      </form>

      {/* Upload History & Verification State */}
      <div className="space-y-3">
        <h3 className="font-serif text-lg font-bold text-[#193b2a]">Submitted Evidence Items</h3>
        <div className="space-y-3">
          {uploads.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-5 border border-[#dde4d9] shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#193b2a]">{item.title}</span>
                  <span className="text-[10px] font-mono bg-[#eef3eb] text-[#245b45] px-1.5 py-0.5 rounded">
                    {item.fieldId}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    item.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'correction_requested'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}
                >
                  {item.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="text-[11px] text-[#708071] font-mono flex items-center justify-between">
                <span>File: {item.fileName}</span>
                <span>{item.uploadedAt}</span>
              </div>
              {item.rejectionReason && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5">
                  <AlertTriangle size={13} className="text-amber-700 shrink-0 mt-0.5" />
                  <span>{item.rejectionReason}</span>
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
      'Upload Evidence | The Carbon Credit',
      'Upload field emergence photos, irrigation logs, and GPS ground truth.',
      '/farmer/evidence'
    ),
  component: FarmerEvidencePage,
});
