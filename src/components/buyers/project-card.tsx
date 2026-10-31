import { Link } from '@tanstack/react-router';
import type { BuyerProject } from '@/lib/types/buyer';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Building,
  Layers,
  Satellite,
  Camera,
  Droplets,
  ArrowRight,
  ShieldAlert,
  FileCheck2,
} from 'lucide-react';

interface ProjectCardProps {
  project: BuyerProject;
  onSelectForCompare?: (id: string) => void;
  isCompared?: boolean;
}

export function ProjectCard({ project, onSelectForCompare, isCompared }: ProjectCardProps) {
  const isReady = project.assessmentStatus === 'READY_FOR_VERIFICATION';

  return (
    <div className="bg-white rounded-xl border border-[#dde4d9] hover:border-[#b8cbb4] transition-all hover:shadow-md flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top Header Strip */}
        <div className="p-5 pb-4 border-b border-[#f0f3ec] flex items-start justify-between gap-3 bg-[#fafbf9]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e8efe5] text-[#245b45] font-semibold uppercase tracking-wider">
                {project.methodology.split('(')[0]?.trim() || 'Verra VM0042'}
              </span>
              <DemoBadge size="xs" label="Demo Data" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#193b2a] tracking-tight leading-snug line-clamp-1">
              {project.title}
            </h3>
            <p className="text-xs text-[#708071] flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-[#5c7c46] shrink-0" />
              <span>{project.location}</span>
            </p>
          </div>

          {/* Assessment Status Pill */}
          <div
            className={`text-[11px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 shrink-0 ${
              isReady
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-sky-50 text-sky-800 border border-sky-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-600' : 'bg-sky-600'}`}
            />
            <span>{isReady ? 'Ready for Verification' : 'Needs Review'}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-[#526655] line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Aggregate Metrics Grid (Safe: No farmer names or PII) */}
          <div className="grid grid-cols-3 gap-2.5 bg-[#f4f7f1] rounded-lg p-3 text-center border border-[#e5ebe0]">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#708071] block">Area</span>
              <span className="text-xs font-bold text-[#193b2a]">
                {project.totalHectares.toLocaleString()} ha
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#708071] block">Parcels</span>
              <span className="text-xs font-bold text-[#193b2a]">
                {project.enrolledParcels}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#708071] block">Readiness</span>
              <span className="text-xs font-bold text-[#245b45]">
                {project.readinessScorePercent}%
              </span>
            </div>
          </div>

          {/* Evidence Depth Indicators */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-[#708071] mb-1.5 font-medium">
              <span>Evidence Depth:</span>
              <span className="font-mono text-[10px] text-[#245b45]">Multi-source Ground Truth</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#eef3eb] text-[#3b5440] text-[11px]">
                <Satellite size={11} className="text-[#245b45]" />
                {project.evidenceDepth.satellitePasses} Passes
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#eef3eb] text-[#3b5440] text-[11px]">
                <Camera size={11} className="text-[#245b45]" />
                {project.evidenceDepth.groundPhotos} Photos
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#eef3eb] text-[#3b5440] text-[11px]">
                <Droplets size={11} className="text-[#245b45]" />
                {project.evidenceDepth.waterLogs} Logs
              </span>
            </div>
          </div>

          {/* Integrity & Credit Notice */}
          <div className="rounded-lg bg-amber-50/70 border border-amber-200/60 p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldAlert size={14} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Issued Credits: 0 tCO2e</span>
              <span className="text-[10px] text-amber-800">
                Preliminary estimate: not computed · Subject to independent VVB validation.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-3 border-t border-[#f0f3ec] bg-[#fafbf9] flex items-center justify-between gap-2">
        {onSelectForCompare && (
          <button
            onClick={() => onSelectForCompare(project.id)}
            className={`text-xs px-2.5 py-1.5 rounded transition-colors ${
              isCompared
                ? 'bg-[#193b2a] text-white font-medium'
                : 'text-[#526655] hover:bg-[#edf2e9] font-medium'
            }`}
          >
            {isCompared ? 'Comparing' : '+ Compare'}
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-xs border-[#d0dcd0] text-[#193b2a] hover:bg-[#edf2e9]"
          >
            <Link to="/buyers/projects/$projectId" params={{ projectId: project.id }}>
              <FileCheck2 size={13} className="mr-1" />
              Dossier
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333]"
          >
            <Link to="/buyers/enquiry" search={{ projectId: project.id }}>
              Enquire
              <ArrowRight size={13} className="ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
