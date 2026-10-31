import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { MARKETPLACE_PROJECTS } from '@/lib/terra-ledger/mock-data';
import {
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Eye,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

interface ProjectAdminState {
  id: string;
  title: string;
  district: string;
  totalHectares: number;
  readinessScorePercent: number;
  isPublishedToMarketplace: boolean;
  assessmentStatus: 'READY_FOR_VERIFICATION' | 'NEEDS_REVIEW';
}

export function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectAdminState[]>([
    {
      id: 'PRJ-PB-DSR-01',
      title: 'Punjab Regenerative Rice Consortium — Phase 1 (Ludhiana East)',
      district: 'Ludhiana',
      totalHectares: 1200,
      readinessScorePercent: 92,
      isPublishedToMarketplace: true,
      assessmentStatus: 'READY_FOR_VERIFICATION',
    },
    {
      id: 'PRJ-PB-DSR-02',
      title: 'Malwa Direct-Seeded Rice Expansion — Phase 2 (Bathinda & Mansa)',
      district: 'Bathinda',
      totalHectares: 3400,
      readinessScorePercent: 88,
      isPublishedToMarketplace: true,
      assessmentStatus: 'READY_FOR_VERIFICATION',
    },
    {
      id: 'PRJ-PB-AWD-03',
      title: 'Central Punjab Water Stewardship AWD Cluster (Sangrur & Barnala)',
      district: 'Sangrur',
      totalHectares: 2100,
      readinessScorePercent: 64,
      isPublishedToMarketplace: false,
      assessmentStatus: 'NEEDS_REVIEW',
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const togglePublication = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;

    if (!proj.isPublishedToMarketplace && proj.readinessScorePercent < 70) {
      setNotification(`Cannot publish ${proj.id}: Readiness score (${proj.readinessScorePercent}%) is below 70% minimum threshold.`);
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    const updated = projects.map((p) =>
      p.id === id ? { ...p, isPublishedToMarketplace: !p.isPublishedToMarketplace } : p
    );
    setProjects(updated);
    setNotification(
      `${proj.id} ${!proj.isPublishedToMarketplace ? 'published to' : 'withdrawn from'} Buyer Marketplace.`
    );
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Governance & Marketplace Publication"
        description="Stage, approve, and govern visibility of agricultural carbon programs in the Institutional Buyer Marketplace."
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge label="Program Governance" />
            <span className="text-xs font-mono bg-[#193b2a] text-[#f5f5e8] px-3 py-1.5 rounded">
              {projects.filter((p) => p.isPublishedToMarketplace).length} / {projects.length} Published
            </span>
          </div>
        }
      />

      {/* Strict Compliance Banner */}
      <div className="bg-[#102e20] text-[#f5f5e8] p-4 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-[#d6eaa6] shrink-0" />
          <div>
            <span className="font-semibold text-white">Publication Threshold Guard Enforced</span>
            <p className="text-[#bacabd] mt-0.5">
              Projects require &ge; 70% evidence readiness completeness before an admin can publish them to corporate buyers. Status ceiling is strictly READY_FOR_VERIFICATION.
            </p>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 size={14} />
          <span>{notification}</span>
        </div>
      )}

      {/* Projects List */}
      <div className="bg-white border border-[#dde4d9] rounded-xl overflow-hidden divide-y divide-[#dde4d9]">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f9faf7] transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#193b2a]">{proj.id}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    proj.assessmentStatus === 'READY_FOR_VERIFICATION'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {proj.assessmentStatus}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    proj.isPublishedToMarketplace
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {proj.isPublishedToMarketplace ? 'PUBLIC MARKETPLACE' : 'STAGING ONLY'}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-[#193b2a]">{proj.title}</h3>
              <div className="text-xs text-[#708071] flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                <span>District: {proj.district}</span>
                <span>Enrolled Scope: {proj.totalHectares.toLocaleString()} Hectares</span>
                <span>
                  Readiness Score:{' '}
                  <strong className={proj.readinessScorePercent >= 70 ? 'text-emerald-700' : 'text-amber-700'}>
                    {proj.readinessScorePercent}%
                  </strong>
                </span>
                <span>Issued Credits: 0 tCO2e</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                onClick={() => togglePublication(proj.id)}
                className={`text-xs px-3.5 py-2 flex items-center gap-1.5 ${
                  proj.isPublishedToMarketplace
                    ? 'bg-amber-800 text-white hover:bg-amber-900'
                    : 'bg-[#193b2a] text-[#f5f5e8] hover:bg-[#224e37]'
                }`}
              >
                {proj.isPublishedToMarketplace ? 'Withdraw from Buyers' : 'Approve for Buyers'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/admin/projects')({
  head: () =>
    pageHead(
      'Project Governance | The Carbon Credit OS Admin',
      'Stage, approve, and manage project publication status in the Buyer Marketplace.',
      '/admin/projects'
    ),
  component: AdminProjectsPage,
});
