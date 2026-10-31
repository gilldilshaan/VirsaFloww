import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { MARKETPLACE_PROJECTS } from '@/lib/terra-ledger/mock-data';
import {
  Store,
  Eye,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Search,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function WorkspaceMarketplaceViewPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects] = useState(MARKETPLACE_PROJECTS);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buyer Marketplace — Internal Projection & Review"
        description="Verify how carbon programs and due-diligence data rooms appear to institutional buyers. Confirms privacy controls and price-leakage prevention."
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge label="Safe Projection Audit" />
            <a
              href="/buyers/marketplace"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-[#193b2a] text-[#f5f5e8] px-3 py-1.5 rounded hover:bg-[#224e37] transition-colors flex items-center gap-1.5"
            >
              <ExternalLink size={13} />
              Open Live Buyer Portal
            </a>
          </div>
        }
      />

      {/* Security & Truth Callout */}
      <div className="bg-[#102e20] text-[#f5f5e8] p-4 rounded-xl flex items-start gap-3">
        <Shield size={20} className="text-[#d6eaa6] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-white">
            Buyer Portal Safe Projection Active
          </p>
          <p className="text-[#bacabd] leading-relaxed">
            Internal rules prohibit exposing farmer PII (names, phone numbers, individual cadastre parcels) to external corporate buyers.
            No speculative carbon prices ($/tCO2e) are published. All pre-issuance credits remain strictly at 0 tCO2e issued until third-party registry sign-off.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="bg-white border border-[#dde4d9] rounded-xl overflow-hidden flex flex-col justify-between"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-[#193b2a]">
                  {proj.id}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    proj.assessmentStatus === 'READY_FOR_VERIFICATION'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {proj.assessmentStatus === 'READY_FOR_VERIFICATION'
                    ? 'READY FOR VERIFICATION'
                    : 'NEEDS REVIEW'}
                </span>
              </div>

              <h3 className="font-serif text-lg text-[#193b2a] font-semibold">
                {proj.title}
              </h3>

              <p className="text-xs text-[#708071] line-clamp-2">
                {proj.description}
              </p>

              <div className="grid grid-cols-2 gap-2 bg-[#f4f7f1] p-3 rounded-lg text-xs">
                <div>
                  <span className="text-[#708071] block">Enrolled Area:</span>
                  <span className="font-semibold text-[#193b2a]">
                    {proj.totalHectares.toLocaleString()} Ha
                  </span>
                </div>
                <div>
                  <span className="text-[#708071] block">Parcels / Farmers:</span>
                  <span className="font-semibold text-[#193b2a]">
                    {proj.enrolledParcels} / {proj.farmerCount}
                  </span>
                </div>
                <div>
                  <span className="text-[#708071] block">Readiness Score:</span>
                  <span className="font-semibold text-[#193b2a]">
                    {proj.readinessScorePercent}%
                  </span>
                </div>
                <div>
                  <span className="text-[#708071] block">Methodology:</span>
                  <span className="font-mono text-[#193b2a] text-[11px]">
                    {proj.methodology}
                  </span>
                </div>
              </div>

              {/* Evidence Depth */}
              <div className="border-t border-[#dde4d9] pt-2 text-[11px] text-[#5c7c46] flex items-center justify-between">
                <span>Satellite Passes: {proj.evidenceDepth.satellitePasses}</span>
                <span>Water Logs: {proj.evidenceDepth.waterLogs}</span>
                <span>In-situ Photos: {proj.evidenceDepth.groundPhotos}</span>
              </div>
            </div>

            <div className="p-4 bg-[#fdfdfb] border-t border-[#dde4d9] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#708071]">
                Issued Credits: <strong className="text-[#193b2a]">0 tCO2e (Pre-Issuance)</strong>
              </span>
              <a
                href={`/buyers/projects/${proj.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#193b2a] hover:underline flex items-center gap-1 font-medium"
              >
                Inspect Buyer View <Eye size={13} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/workspace/marketplace')({
  head: () =>
    pageHead(
      'Buyer Marketplace Review | The Carbon Credit OS',
      'Internal verification of buyer-facing marketplace projections and data safety.',
      '/workspace/marketplace'
    ),
  component: WorkspaceMarketplaceViewPage,
});
