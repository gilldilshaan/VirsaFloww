import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import {
  FileText,
  Download,
  CheckCircle2,
  Shield,
  FileCheck2,
  Database,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

interface AuditReport {
  id: string;
  title: string;
  type: 'ISO-14064-2' | 'Verra-VM0042' | 'Field-Audit' | 'Telemetry-Export' | 'Verifiable-Credential';
  format: 'PDF' | 'JSON-LD' | 'CSV' | 'ZIP';
  generatedDate: string;
  sizeMb: number;
  sha256Hash: string;
  status: 'Ready' | 'Generating';
}

const AVAILABLE_REPORTS: AuditReport[] = [
  {
    id: 'RPT-ISO-2026-PB01',
    title: 'ISO 14064-2 GHG Project Plan & Baseline Emissions Report',
    type: 'ISO-14064-2',
    format: 'PDF',
    generatedDate: '2026-10-28 14:00 UTC',
    sizeMb: 4.8,
    sha256Hash: '4f29a0e71b29a8c3d9039bf832da8431c09420bba54320912189dca0298a2873',
    status: 'Ready',
  },
  {
    id: 'RPT-VERRA-PB-LUD',
    title: 'Verra VM0042 Methodology Compliance & In-Situ Water Log Package',
    type: 'Verra-VM0042',
    format: 'ZIP',
    generatedDate: '2026-10-29 09:30 UTC',
    sizeMb: 18.2,
    sha256Hash: '8a9c394801fe839bcda0192847291a039bfe8912304918237192837491029384',
    status: 'Ready',
  },
  {
    id: 'RPT-S2-SURFACE-REFLECTANCE',
    title: 'Copernicus Sentinel-2 Surface Reflectance (BOA) Multi-Temporal Cube',
    type: 'Telemetry-Export',
    format: 'CSV',
    generatedDate: '2026-10-30 18:15 UTC',
    sizeMb: 6.4,
    sha256Hash: '7c89120394819203984712093847192038471029384719203847192038471920',
    status: 'Ready',
  },
  {
    id: 'RPT-VC-CADASTRE-HASH',
    title: 'W3C Verifiable Credential: Field Boundary & Agronomic Integrity Hash',
    type: 'Verifiable-Credential',
    format: 'JSON-LD',
    generatedDate: '2026-10-31 06:00 UTC',
    sizeMb: 0.2,
    sha256Hash: '1928374918237491827391827391827391827391827391827391827391827391',
    status: 'Ready',
  },
];

export function WorkspaceReportsPage() {
  const { assessmentStatus, completenessPercent, field } = useTerraLedger();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (report: AuditReport) => {
    // Generate synthetic mock download for verified export
    const content = JSON.stringify(
      {
        reportId: report.id,
        title: report.title,
        type: report.type,
        format: report.format,
        generatedDate: report.generatedDate,
        sha256Hash: report.sha256Hash,
        field: {
          id: field.id,
          name: field.name,
          district: field.district,
          state: field.state,
          practice: field.practice,
        },
        assessmentStatus,
        completenessPercent,
        complianceStandard: 'ISO 14064-2:2019 / Verra VM0042',
        disclaimer:
          'DEMO EXPORT: Issued credits = 0 tCO2e. Subject to final Designated Operational Entity (DOE) independent verification.',
      },
      null,
      2
    );

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}.${report.format.toLowerCase() === 'json-ld' ? 'json' : report.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Downloaded ${report.title}`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="MRV Audit & Compliance Reports"
        description="Generate certified export packages, ISO 14064-2 documentation dossiers, and cryptographically hashed telemetry for verification auditors."
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge label="Compliance Engine" />
            <span className="text-xs font-mono bg-[#193b2a] text-[#f5f5e8] px-3 py-1.5 rounded">
              ISO 14064-2 Compliant
            </span>
          </div>
        }
      />

      {/* Protocol Banner */}
      <div className="bg-white border border-[#dde4d9] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-[#193b2a]" />
            <h2 className="font-serif text-lg text-[#193b2a]">
              Audit Dossier Export Engine
            </h2>
          </div>
          <p className="text-xs text-[#708071] mt-1 max-w-2xl">
            All export packages bundle raw Sentinel-2 BOA spectral indices, tamper-evident EXIF device hashes, water sensor logs, and cadastral shapefiles into a unified audit bundle.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xs text-[#708071] block">Current Readiness</span>
            <span className="font-mono text-sm font-bold text-[#193b2a]">
              {completenessPercent}% Complete
            </span>
          </div>
          <span className="h-8 w-px bg-[#dde4d9]" />
          <div className="text-right">
            <span className="text-xs text-[#708071] block">Status Ceiling</span>
            <span className="font-mono text-xs font-bold text-amber-700">
              {assessmentStatus === 'READY_FOR_VERIFICATION' ? 'READY_FOR_VERIFICATION' : 'NEEDS_REVIEW'}
            </span>
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 size={15} />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-white border border-[#dde4d9] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#dde4d9] flex items-center justify-between">
          <h2 className="font-serif text-base text-[#193b2a]">Certified Packages ({AVAILABLE_REPORTS.length})</h2>
          <span className="text-xs text-[#708071]">Cryptographically sealed packages</span>
        </div>

        <div className="divide-y divide-[#dde4d9]">
          {AVAILABLE_REPORTS.map((report) => (
            <div
              key={report.id}
              className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f9faf7] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#193b2a]">
                    {report.id}
                  </span>
                  <span className="text-[10px] bg-[#f4f7f1] text-[#213c2b] px-2 py-0.5 rounded font-mono font-medium">
                    {report.format}
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono">
                    {report.sizeMb} MB
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-[#193b2a]">
                  {report.title}
                </h3>
                <div className="text-xs text-[#708071] flex flex-wrap gap-x-4 gap-y-1 pt-1">
                  <span>Generated: {report.generatedDate}</span>
                  <span className="font-mono text-[10px] text-[#5c7c46] truncate max-w-md">
                    SHA-256: {report.sha256Hash}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => handleDownload(report)}
                className="bg-[#193b2a] text-[#f5f5e8] hover:bg-[#224e37] text-xs px-4 py-2 shrink-0 flex items-center gap-1.5"
              >
                <Download size={13} />
                Download Package
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/workspace/reports')({
  head: () =>
    pageHead(
      'Audit Reports | VirsaFlow',
      'Certified MRV compliance exports, ISO 14064-2 documentation dossiers, and telemetry files.',
      '/workspace/reports'
    ),
  component: WorkspaceReportsPage,
});
