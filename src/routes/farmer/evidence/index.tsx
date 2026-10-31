import { createFileRoute, Link } from '@tanstack/react-router';
import { PageHeader } from '@/components/terra-ledger/shared/page-header';
import { Camera, Upload, History, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FarmerEvidenceUploadScreen() {
  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Field Evidence Submission"
        description="Capture or upload geotagged field photos, AWD perforated tube records, and tenancy receipts."
        actions={
          <Link
            to="/farmer/evidence/history"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#d8e1d4] text-[#193b2a] rounded-lg text-xs font-medium hover:bg-[#f4f6f0]"
          >
            <History size={14} />
            <span>Submission History</span>
          </Link>
        }
      />

      <div className="bg-white border border-[#dfe6d9] rounded-xl p-6 shadow-xs space-y-4 text-xs">
        <div>
          <label className="font-medium text-[#193b2a] block mb-1">Target Parcel</label>
          <input
            type="text"
            disabled
            defaultValue="PB-LUD-042 (Gill Agro-Plot 4 · 4.8 ha)"
            className="w-full text-xs bg-[#f4f6f0] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#72816f] cursor-not-allowed"
          />
        </div>

        <div>
          <label className="font-medium text-[#193b2a] block mb-1">Evidence Type</label>
          <select className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none">
            <option>In-Field Emergence Photograph (Geotagged)</option>
            <option>Pani Da Bambu (AWD) Water Depth Log</option>
            <option>Seeding Drill Machinery Activity Photo</option>
            <option>Revenue Land Tenancy Record</option>
          </select>
        </div>

        {/* Upload dropzone placeholder */}
        <div className="border-2 border-dashed border-[#dce3d7] rounded-xl p-6 text-center bg-[#f9faf7]">
          <Camera size={24} className="text-[#5c7c46] mx-auto mb-1.5" />
          <span className="text-xs text-[#213c2b] block font-medium">Capture or Select Field Photo</span>
          <span className="text-[10px] text-[#72816f] block mt-0.5">
            EXIF coordinates must fall within parcel boundaries (tolerance &lt; 5m).
          </span>
        </div>

        <div className="pt-2 flex justify-end">
          <Button size="sm" className="bg-[#245b45] text-white hover:bg-[#1a4333]">
            Submit Evidence
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/farmer/evidence/')({
  component: FarmerEvidenceUploadScreen,
});
