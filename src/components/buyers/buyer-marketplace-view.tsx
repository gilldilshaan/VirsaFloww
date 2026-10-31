import { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { getApprovedBuyerProjects } from '@/lib/buyer/buyer-service';
import type { BuyerProject } from '@/lib/types/buyer';
import { ProjectCard } from './project-card';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingState } from '@/components/shared/loading-state';
import { Button } from '@/components/ui/button';
import {
  Search,
  Filter,
  Layers,
  ShieldCheck,
  Building,
  Sprout,
  CheckCircle2,
  X,
  FileCheck2,
  Send,
  Scale,
} from 'lucide-react';

export function BuyerMarketplaceView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPractice, setSelectedPractice] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [comparisonIds, setComparisonIds] = useState<string[]>(['PRJ-PB-DSR-01', 'PRJ-PB-CRM-02']);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const allProjects = useMemo(() => getApprovedBuyerProjects(), []);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((prj) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        prj.title.toLowerCase().includes(q) ||
        prj.location.toLowerCase().includes(q) ||
        prj.practice.toLowerCase().includes(q) ||
        prj.district.toLowerCase().includes(q);

      const matchesPractice =
        selectedPractice === 'all' ||
        (selectedPractice === 'dsr' && prj.practice.toLowerCase().includes('direct seeded')) ||
        (selectedPractice === 'residue' && (prj.practice.toLowerCase().includes('residue') || prj.practice.toLowerCase().includes('straw'))) ||
        (selectedPractice === 'awd' && prj.practice.toLowerCase().includes('wetting'));

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'ready' && prj.assessmentStatus === 'READY_FOR_VERIFICATION') ||
        (selectedStatus === 'review' && prj.assessmentStatus === 'NEEDS_REVIEW');

      return matchesSearch && matchesPractice && matchesStatus;
    });
  }, [allProjects, searchQuery, selectedPractice, selectedStatus]);

  const toggleComparison = (id: string) => {
    if (comparisonIds.includes(id)) {
      setComparisonIds(comparisonIds.filter((item) => item !== id));
    } else {
      if (comparisonIds.length < 3) {
        setComparisonIds([...comparisonIds, id]);
      } else {
        alert('You can compare a maximum of 3 projects simultaneously.');
      }
    }
  };

  const comparedProjects = allProjects.filter((p) => comparisonIds.includes(p.id));

  // Compute portfolio aggregates for corporate overview
  const totalHectares = allProjects.reduce((acc, p) => acc + p.totalHectares, 0);
  const totalParcels = allProjects.reduce((acc, p) => acc + p.enrolledParcels, 0);

  if (isLoading) {
    return <LoadingState message="Loading approved agricultural carbon project directory…" />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Institutional Project Marketplace"
        description="Discover publication-approved agricultural carbon MRV projects in Punjab. Every listed project is backed by multi-spectral satellite observations, geotagged farmer activity, and transparent readiness scores."
        badge={<DemoBadge label="Pre-Issuance Pipeline" />}
        actions={
          <div className="flex items-center gap-2">
            {comparisonIds.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCompareModalOpen(true)}
                className="text-xs border-[#245b45] text-[#245b45] hover:bg-[#edf2e9]"
              >
                <Scale size={13} className="mr-1.5" />
                Compare ({comparisonIds.length})
              </Button>
            )}
            <Button
              asChild
              size="sm"
              className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333]"
            >
              <Link to="/buyers/enquiry" search={{ projectId: undefined }}>
                <Send size={13} className="mr-1.5" />
                Submit Due Diligence EOI
              </Link>
            </Button>
          </div>
        }
      />

      {/* Corporate Portfolio Top Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#dde4d9] shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#708071] uppercase">
            <span>Approved Projects</span>
            <Building size={14} className="text-[#245b45]" />
          </div>
          <div className="text-2xl font-bold text-[#193b2a] mt-2">
            {allProjects.length} Clusters
          </div>
          <div className="text-[11px] text-[#5c7c46] mt-0.5">
            100% Cadastral Enclosure Checked
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#dde4d9] shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#708071] uppercase">
            <span>Enrolled Area</span>
            <Layers size={14} className="text-[#245b45]" />
          </div>
          <div className="text-2xl font-bold text-[#193b2a] mt-2">
            {totalHectares.toLocaleString()} ha
          </div>
          <div className="text-[11px] text-[#708071] mt-0.5">
            Across {totalParcels} discrete parcels
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#dde4d9] shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#708071] uppercase">
            <span>Methodology Standard</span>
            <Sprout size={14} className="text-[#245b45]" />
          </div>
          <div className="text-2xl font-bold text-[#193b2a] mt-2">
            Verra VM0042
          </div>
          <div className="text-[11px] text-[#708071] mt-0.5">
            Rice practice transition protocol
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#dde4d9] shadow-2xs bg-linear-to-br from-white to-[#f7faf5]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#708071] uppercase">
            <span>Issued Credits</span>
            <ShieldCheck size={14} className="text-[#245b45]" />
          </div>
          <div className="text-2xl font-bold text-[#193b2a] mt-2">
            0 tCO2e
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-0.5">
            Pre-issuance · Awaiting VVB Audit
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-xl p-4 border border-[#dde4d9] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-[#708071]" size={15} />
            <input
              type="text"
              placeholder="Search by practice, location, or methodology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg text-[#193b2a] placeholder-[#8a9b8b] outline-none focus:border-[#245b45] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#708071] hover:text-[#193b2a]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Practice Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-[#708071] shrink-0 font-medium">Practice:</span>
            <div className="flex gap-1.5 shrink-0">
              {[
                { id: 'all', label: 'All Practices' },
                { id: 'dsr', label: 'Direct Seeded Rice (DSR)' },
                { id: 'residue', label: 'Crop Residue Management' },
                { id: 'awd', label: 'AWD Irrigation' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPractice(p.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedPractice === p.id
                      ? 'bg-[#245b45] text-white'
                      : 'bg-[#f0f3ec] text-[#4a6352] hover:bg-[#e4ebdf]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#708071] font-medium">Readiness:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-2.5 py-1.5 text-[#193b2a] outline-none focus:border-[#245b45]"
            >
              <option value="all">All Readiness Tiers</option>
              <option value="ready">Ready for Verification</option>
              <option value="review">Needs Review</option>
            </select>
          </div>
        </div>

        {/* Filter tags bar */}
        {(selectedPractice !== 'all' || selectedStatus !== 'all' || searchQuery) && (
          <div className="flex items-center gap-2 pt-2 border-t border-[#f0f3ec] text-xs">
            <span className="text-[#708071]">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-[#eef3eb] text-[#193b2a] px-2 py-0.5 rounded text-[11px]">
                Search: "{searchQuery}"
                <X size={11} className="cursor-pointer" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {selectedPractice !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#eef3eb] text-[#193b2a] px-2 py-0.5 rounded text-[11px]">
                Practice: {selectedPractice.toUpperCase()}
                <X size={11} className="cursor-pointer" onClick={() => setSelectedPractice('all')} />
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#eef3eb] text-[#193b2a] px-2 py-0.5 rounded text-[11px]">
                Status: {selectedStatus === 'ready' ? 'Ready for Verification' : 'Needs Review'}
                <X size={11} className="cursor-pointer" onClick={() => setSelectedStatus('all')} />
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedPractice('all');
                setSelectedStatus('all');
              }}
              className="text-[11px] text-[#245b45] hover:underline ml-auto font-medium"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          title="No projects match your filter criteria"
          description="Try broadening your search keywords or resetting the practice and readiness status filters."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedPractice('all');
                setSelectedStatus('all');
              }}
              className="text-xs border-[#dce3d7] text-[#245b45]"
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelectForCompare={toggleComparison}
              isCompared={comparisonIds.includes(project.id)}
            />
          ))}
        </div>
      )}

      {/* Comparison Drawer / Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#dde4d9] pb-4">
              <div>
                <h3 className="font-serif text-2xl text-[#193b2a]">Project Comparison</h3>
                <p className="text-xs text-[#708071] mt-0.5">
                  Side-by-side evaluation of approved agricultural carbon project clusters.
                </p>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-1.5 text-[#708071] hover:text-[#193b2a] rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {comparedProjects.length === 0 ? (
              <p className="text-xs text-[#708071] py-8 text-center">
                Select up to 3 projects from the marketplace to compare metrics.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {comparedProjects.map((p) => (
                  <div key={p.id} className="border border-[#dde4d9] rounded-xl p-4 bg-[#fafbf9] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold text-[#245b45] uppercase">
                        {p.id}
                      </span>
                      <button
                        onClick={() => toggleComparison(p.id)}
                        className="text-[10px] text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <h4 className="font-serif font-bold text-[#193b2a] text-sm">{p.title}</h4>
                    <div className="space-y-1.5 text-xs text-[#526655] pt-2 border-t border-[#dde4d9]">
                      <div className="flex justify-between">
                        <span className="text-[#708071]">District:</span>
                        <span className="font-medium text-[#193b2a]">{p.district}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#708071]">Methodology:</span>
                        <span className="font-medium text-[#193b2a] text-right truncate max-w-[130px]">
                          {p.methodology}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#708071]">Total Area:</span>
                        <span className="font-bold text-[#193b2a]">{p.totalHectares} ha</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#708071]">Parcels:</span>
                        <span className="font-medium text-[#193b2a]">{p.enrolledParcels}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#708071]">Readiness Score:</span>
                        <span className="font-bold text-[#245b45]">{p.readinessScorePercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#708071]">Satellite Passes:</span>
                        <span className="font-medium text-[#193b2a]">{p.evidenceDepth.satellitePasses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#708071]">Ground Photos:</span>
                        <span className="font-medium text-[#193b2a]">{p.evidenceDepth.groundPhotos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#708071]">Issued Credits:</span>
                        <span className="font-mono text-amber-700">0 tCO2e</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#dde4d9]">
                      <Button asChild size="sm" className="w-full text-xs bg-[#245b45] text-white">
                        <Link to="/buyers/projects/$projectId" params={{ projectId: p.id }}>
                          View Dossier
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#dde4d9]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCompareModalOpen(false)}
                className="text-xs"
              >
                Close Comparison
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
