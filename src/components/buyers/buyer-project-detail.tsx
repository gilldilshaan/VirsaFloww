import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { getApprovedBuyerProjectById } from '@/lib/buyer/buyer-service';
import type { BuyerProject } from '@/lib/types/buyer';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import {
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
  Send,
  Building,
  Calendar,
  Users,
  Sprout,
  CheckCircle2,
  Lock,
  Layers,
  Info,
  MapPin,
  Satellite,
  Camera,
  Droplets,
  Download,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

interface BuyerProjectDetailProps {
  projectId: string;
}

export function BuyerProjectDetail({ projectId }: BuyerProjectDetailProps) {
  const project = useMemo(() => getApprovedBuyerProjectById(projectId), [projectId]);
  const [accessRequestedDoc, setAccessRequestedDoc] = useState<string | null>(null);

  if (!project) {
    return (
      <EmptyState
        title="Project Not Found"
        description={`No approved project found matching identifier "${projectId}". It may not yet be approved for publication.`}
        action={
          <Button asChild variant="outline" size="sm" className="text-xs text-[#245b45]">
            <Link to="/buyers/marketplace">
              <ArrowLeft size={14} className="mr-1.5" />
              Back to Marketplace
            </Link>
          </Button>
        }
      />
    );
  }

  const isReady = project.assessmentStatus === 'READY_FOR_VERIFICATION';

  const documents = [
    {
      title: 'Project Design Document (PDD) Draft',
      description: 'Formal carbon methodology specification based on Verra VM0042 standards.',
      standard: project.methodology,
      version: 'v1.4 (Draft)',
      id: 'doc-pdd',
    },
    {
      title: 'Cadastral Polygon & Boundary Registry',
      description: 'Anonymized cadastral field boundary coordinates with zero-overlap validation.',
      standard: 'PostGIS GIS-Layer',
      version: 'Kharif 2026',
      id: 'doc-geo',
    },
    {
      title: 'Sentinel-2 Remote Sensing Index Series',
      description: 'Preprocessed Sentinel-2 L2A optical scenes, cloud masks, and mean NDWI/NDVI trajectories.',
      standard: 'Copernicus 10m',
      version: 'Multi-temporal',
      id: 'doc-sat',
    },
    {
      title: 'Farmer Benefit-Sharing & Consent Protocol',
      description: 'Legal governance structure ensuring 80% direct revenue distribution to smallholder producers.',
      standard: 'FPO Agreement',
      version: '2026 Policy',
      id: 'doc-fpo',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          to="/buyers/marketplace"
          className="inline-flex items-center gap-1.5 text-xs text-[#526655] hover:text-[#193b2a] font-medium transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Project Marketplace</span>
        </Link>
      </div>

      {/* Header & Due Diligence Action Bar */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#dde4d9] shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#f0f3ec]">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-[#e8efe5] text-[#245b45] font-semibold uppercase tracking-wider">
                {project.methodology}
              </span>
              <DemoBadge label="Synthetic Portfolio Record" />
              <div
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5 ${
                  isReady
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-sky-50 text-sky-800 border border-sky-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-600' : 'bg-sky-600'}`} />
                <span>{isReady ? 'Ready for Verification' : 'Needs Review'}</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight">
              {project.title}
            </h1>

            <p className="text-xs text-[#708071] mt-2 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-[#5c7c46]" />
                {project.location}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Building size={13} className="text-[#5c7c46]" />
                Developer: {project.developer}
              </span>
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              asChild
              className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333] shadow-sm px-4 py-2 h-10"
            >
              <Link to="/buyers/enquiry" search={{ projectId: project.id }}>
                <Send size={14} className="mr-2" />
                Request Due Diligence Data Room
              </Link>
            </Button>
          </div>
        </div>

        {/* Aggregate Overview Metrics (Privacy Preserved: No Farmer PII) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#f7f9f5] rounded-xl p-3.5 border border-[#e5ebe0]">
            <span className="text-[10px] font-mono uppercase text-[#708071] block">Enrolled Area</span>
            <span className="text-lg font-bold text-[#193b2a] mt-1 block">
              {project.totalHectares.toLocaleString()} ha
            </span>
            <span className="text-[11px] text-[#5c7c46]">~{(project.totalHectares * 2.471).toFixed(0)} acres</span>
          </div>

          <div className="bg-[#f7f9f5] rounded-xl p-3.5 border border-[#e5ebe0]">
            <span className="text-[10px] font-mono uppercase text-[#708071] block">Discrete Parcels</span>
            <span className="text-lg font-bold text-[#193b2a] mt-1 block">
              {project.enrolledParcels}
            </span>
            <span className="text-[11px] text-[#5c7c46]">100% boundary validated</span>
          </div>

          <div className="bg-[#f7f9f5] rounded-xl p-3.5 border border-[#e5ebe0]">
            <span className="text-[10px] font-mono uppercase text-[#708071] block">Participating Farmers</span>
            <span className="text-lg font-bold text-[#193b2a] mt-1 block">
              {project.farmerCount}
            </span>
            <span className="text-[11px] text-[#708071]">FPO cluster aggregate</span>
          </div>

          <div className="bg-[#f7f9f5] rounded-xl p-3.5 border border-[#e5ebe0]">
            <span className="text-[10px] font-mono uppercase text-[#708071] block">Readiness Score</span>
            <span className="text-lg font-bold text-[#245b45] mt-1 block">
              {project.readinessScorePercent}%
            </span>
            <span className="text-[11px] text-[#245b45]">Deterministic MRV Pass</span>
          </div>
        </div>

        {/* Mandatory Truth & Pricing Transparency Notice */}
        <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-4 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldAlert size={16} className="text-amber-700 shrink-0" />
            <span>Integrity & Credit Issuance Notice</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            <strong>Issued Credits: 0 tCO2e.</strong> In strict compliance with TerraLedger AI integrity rules, no credits are issued or sold as finished offsets prior to independent third-party VVB audit and official registry issuance.
            Preliminary estimate: <em>not computed</em> pending final baseline reconciliation.
          </p>
        </div>
      </div>

      {/* Main Dossier Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Methodology, Evidence Trajectory, and Narrative */}
        <div className="lg:col-span-2 space-y-8">
          {/* Methodology & Practice Context */}
          <div className="bg-white rounded-2xl p-6 border border-[#dde4d9] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#5c7c46] uppercase font-semibold">
              <Sprout size={15} />
              <span>Agricultural Practice & Decarbonization Mechanism</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-[#193b2a]">
              Direct Seeded Rice (DSR) with Alternate Wetting & Drying
            </h2>
            <p className="text-xs text-[#526655] leading-relaxed">
              {project.description}
            </p>

            <div className="pt-3 border-t border-[#f0f3ec] space-y-2">
              <h3 className="text-xs font-semibold text-[#193b2a] uppercase tracking-wider font-mono">
                Key Climate & Ecological Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#f7f9f5] rounded-lg p-2.5 text-xs text-[#415d43] border border-[#e8efe5]">
                    <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Multi-Source Ground Truth Summary */}
          <div className="bg-white rounded-2xl p-6 border border-[#dde4d9] shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#5c7c46] uppercase font-semibold">
              <Layers size={15} />
              <span>Multi-Spectral Observation & Evidence Corpus</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-[#193b2a]">
              Independent Remote Sensing & In-Situ Corroboration
            </h2>
            <p className="text-xs text-[#526655] leading-relaxed">
              All declarations undergo deterministic corroboration between European Space Agency (ESA) Copernicus Sentinel-2 MSI observations, perforated PVC field water level recordings (AWD tubes), and boundary-enclosed emergence imagery.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 text-center">
              <div className="border border-[#dde4d9] rounded-xl p-3 bg-[#fafbf9]">
                <Satellite size={18} className="text-[#245b45] mx-auto mb-1" />
                <span className="text-base font-bold text-[#193b2a] block">
                  {project.evidenceDepth.satellitePasses}
                </span>
                <span className="text-[10px] text-[#708071] font-mono uppercase">
                  Sentinel-2 Passes
                </span>
              </div>
              <div className="border border-[#dde4d9] rounded-xl p-3 bg-[#fafbf9]">
                <Camera size={18} className="text-[#245b45] mx-auto mb-1" />
                <span className="text-base font-bold text-[#193b2a] block">
                  {project.evidenceDepth.groundPhotos}
                </span>
                <span className="text-[10px] text-[#708071] font-mono uppercase">
                  Geotagged Photos
                </span>
              </div>
              <div className="border border-[#dde4d9] rounded-xl p-3 bg-[#fafbf9]">
                <Droplets size={18} className="text-[#245b45] mx-auto mb-1" />
                <span className="text-base font-bold text-[#193b2a] block">
                  {project.evidenceDepth.waterLogs}
                </span>
                <span className="text-[10px] text-[#708071] font-mono uppercase">
                  Water Level Logs
                </span>
              </div>
            </div>

            <div className="bg-[#f0f3ec] rounded-xl p-3 text-xs text-[#415d43] flex items-center justify-between">
              <span className="text-[11px]">Server-side SHA-256 byte hashing enforced for all uploads.</span>
              <span className="text-[10px] font-mono text-[#245b45] font-semibold">APPEND-ONLY AUDIT</span>
            </div>
          </div>
        </div>

        {/* Right Column: Due Diligence Data Room & Documents */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#dde4d9] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#5c7c46] uppercase font-semibold">
                <Lock size={13} />
                <span>Due Diligence Data Room</span>
              </div>
              <span className="text-[10px] bg-[#eef3eb] text-[#245b45] px-2 py-0.5 rounded font-mono">
                4 Available
              </span>
            </div>

            <p className="text-xs text-[#708071]">
              Accredited buyers and institutional climate funds may request encrypted access to formal project files.
            </p>

            <div className="space-y-3 pt-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-[#dde4d9] rounded-xl p-3 bg-[#fafbf9] space-y-2 hover:border-[#b8cbb4] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-[#193b2a]">{doc.title}</h4>
                    <span className="text-[9px] font-mono bg-[#f0f3ec] text-[#415d43] px-1.5 py-0.5 rounded shrink-0">
                      {doc.version}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#708071] line-clamp-2">{doc.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-[#5c7c46] font-mono">{doc.standard}</span>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-[11px] text-[#245b45] hover:bg-[#edf2e9] h-7 px-2"
                    >
                      <Link to="/buyers/enquiry" search={{ projectId: project.id }}>
                        Request Access
                        <ArrowRight size={11} className="ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Inquiry CTA */}
            <div className="pt-2">
              <Button
                asChild
                className="w-full text-xs bg-[#245b45] text-white hover:bg-[#1a4333]"
              >
                <Link to="/buyers/enquiry" search={{ projectId: project.id }}>
                  <Send size={13} className="mr-1.5" />
                  Request Full Diligence Dossier
                </Link>
              </Button>
            </div>
          </div>

          {/* Privacy & Safe Projection Assurance */}
          <div className="rounded-2xl bg-[#f7f9f5] p-5 border border-[#dde4d9] space-y-2 text-xs text-[#526655]">
            <div className="flex items-center gap-2 font-semibold text-[#193b2a]">
              <ShieldCheck size={16} className="text-[#245b45]" />
              <span>Data Governance & Farmer Privacy</span>
            </div>
            <p className="text-[11px] text-[#708071] leading-relaxed">
              TerraLedger AI strictly redacts smallholder personal identifiable information (PII) from institutional buyer data rooms. Individual landholder names, contact numbers, and precise residence coordinates remain encrypted under farmer consent agreements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
