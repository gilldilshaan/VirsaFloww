import { useState } from 'react';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import { MarketplaceProject } from '@/lib/terra-ledger/types';
import {
  Store,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Building,
  Users,
  Sprout,
  Scale,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Layers,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Marketplace() {
  const { projects, dueDiligenceList, submitBuyerInquiry } = useTerraLedger();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPractice, setSelectedPractice] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<MarketplaceProject | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>(['PRJ-PB-DSR-01', 'PRJ-PB-CRM-02']);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  // Inquiry Form state
  const [buyerName, setBuyerName] = useState('');
  const [buyerOrg, setBuyerOrg] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [volume, setVolume] = useState('2000');
  const [inquirySuccessMsg, setInquirySuccessMsg] = useState('');

  const filteredProjects = projects.filter((prj) => {
    const matchesSearch =
      prj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prj.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prj.practice.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPractice =
      selectedPractice === 'all' ||
      (selectedPractice === 'dsr' && prj.practice.toLowerCase().includes('direct seeded')) ||
      (selectedPractice === 'residue' && (prj.practice.toLowerCase().includes('residue') || prj.practice.toLowerCase().includes('straw'))) ||
      (selectedPractice === 'awd' && prj.practice.toLowerCase().includes('alternate wetting')) ||
      (selectedPractice === 'agroforestry' && prj.practice.toLowerCase().includes('agroforestry'));

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'ready' && prj.assessmentStatus === 'READY_FOR_VERIFICATION') ||
      (selectedStatus === 'review' && prj.assessmentStatus === 'NEEDS_REVIEW');

    return matchesSearch && matchesPractice && matchesStatus;
  });

  const toggleComparison = (id: string) => {
    if (comparisonIds.includes(id)) {
      setComparisonIds(comparisonIds.filter((item) => item !== id));
    } else {
      if (comparisonIds.length < 3) {
        setComparisonIds([...comparisonIds, id]);
      } else {
        alert('You can compare a maximum of 3 projects at once.');
      }
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerOrg || !buyerEmail) return;

    const targetProjectTitle = selectedProject ? selectedProject.title : 'Selected Agricultural Project';
    const res = submitBuyerInquiry({
      buyerName,
      buyerOrg,
      projectTitle: targetProjectTitle,
      volumeRequestedTons: Number(volume) || 1000,
      targetRetirementYear: '2026',
    });

    setInquirySuccessMsg(res.message);
    setTimeout(() => {
      setInquirySuccessMsg('');
      setIsInquiryModalOpen(false);
      setBuyerName('');
      setBuyerOrg('');
      setBuyerEmail('');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider mb-1">
            <Store size={13} />
            VirsaFlow Marketplace & Offtake Pipeline
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight">
            Agricultural MRV Project Directory
          </h1>
          <p className="text-xs text-[#72816f] mt-1">
            Browse audited agricultural carbon clusters ready for verification in Punjab. Complete with parcel cadastral records and Sentinel-2 audit trails.
          </p>
        </div>

        {/* Compare CTA */}
        {comparisonIds.length >= 2 && (
          <Button
            size="sm"
            onClick={() => setIsCompareModalOpen(true)}
            className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333] shadow-xs"
          >
            <Scale size={14} className="mr-1.5" />
            Compare Selected ({comparisonIds.length})
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#72816f]" />
          <input
            type="text"
            placeholder="Search by project name, practice (e.g. DSR, Residue), or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg pl-9 pr-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={selectedPractice}
            onChange={(e) => setSelectedPractice(e.target.value)}
            className="bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-2.5 py-2 text-[#213c2b] outline-none focus:border-[#245b45]"
          >
            <option value="all">All Practices</option>
            <option value="dsr">Direct Seeded Rice (DSR)</option>
            <option value="residue">Crop Residue (Happy Seeder)</option>
            <option value="awd">Alternate Wetting & Drying</option>
            <option value="agroforestry">Agroforestry Intercrop</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-2.5 py-2 text-[#213c2b] outline-none focus:border-[#245b45]"
          >
            <option value="all">All Statuses</option>
            <option value="ready">Ready for Verification</option>
            <option value="review">Needs Review</option>
          </select>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((prj) => {
          const isComparing = comparisonIds.includes(prj.id);
          const isReady = prj.assessmentStatus === 'READY_FOR_VERIFICATION';
          return (
            <div
              key={prj.id}
              className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs hover:border-[#245b45] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Meta */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[10px] text-[#72816f] bg-[#f4f6f0] px-2 py-0.5 rounded">
                    {prj.location}
                  </span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                      isReady
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-sky-100 text-sky-800 border border-sky-300'
                    }`}
                  >
                    {prj.assessmentStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-semibold text-[#193b2a] mb-1">
                  {prj.title}
                </h3>
                <p className="text-xs text-[#72816f] line-clamp-2 leading-relaxed mb-4">
                  {prj.description}
                </p>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-[#f9faf7] rounded-lg border border-[#edf0e7] mb-4 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-[#72816f] block">VOLUME / YR</span>
                    <strong className="text-xs font-mono text-[#245b45]">
                      {prj.estimatedTonsCo2ePerYear.toLocaleString()} t
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#72816f] block">SCALE</span>
                    <strong className="text-xs font-mono text-[#193b2a]">
                      {prj.totalHectares.toLocaleString()} ha
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#72816f] block">FARMERS</span>
                    <strong className="text-xs font-mono text-[#193b2a]">
                      {prj.farmerCount}
                    </strong>
                  </div>
                </div>

                {/* Evidence Depth Highlights */}
                <div className="space-y-1 mb-4 text-[11px] text-[#526451]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>{prj.evidenceDepth.satellitePasses} Sentinel-2 passes analyzed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>{prj.evidenceDepth.groundPhotos} geotagged field photos stamped</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#edf0e7] flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#72816f] hover:text-[#213c2b]">
                  <input
                    type="checkbox"
                    checked={isComparing}
                    onChange={() => toggleComparison(prj.id)}
                    className="rounded text-[#245b45] accent-[#245b45]"
                  />
                  <span>Compare</span>
                </label>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProject(prj)}
                    className="text-xs border-[#d8e1d4] hover:bg-[#f4f6f0] h-8"
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedProject(prj);
                      setIsInquiryModalOpen(true);
                    }}
                    className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333] h-8"
                  >
                    Inquire Offtake
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Due Diligence Pipeline Tracker */}
      <div className="bg-white border border-[#dfe6d9] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#edf0e7] mb-4 gap-2">
          <div>
            <h3 className="text-sm font-semibold text-[#193b2a] flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#245b45]" />
              Buyer Due Diligence Pipeline & Data Rooms
            </h3>
            <p className="text-xs text-[#72816f]">
              Real-time tracker of institutional offtake inquiries, data room access requests, and VVB reviews.
            </p>
          </div>
          <span className="text-xs font-mono bg-[#edf0e7] text-[#213c2b] px-2 py-0.5 rounded font-semibold">
            {dueDiligenceList.length} Active Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#f9faf6] text-[#72816f] font-mono text-[10px] uppercase border-b border-[#edf0e7]">
                <th className="py-2.5 px-3">Buyer & Organization</th>
                <th className="py-2.5 px-3">Project Target</th>
                <th className="py-2.5 px-3">Inquiry Date</th>
                <th className="py-2.5 px-3">Volume (tCO2e)</th>
                <th className="py-2.5 px-3">Due Diligence Stage</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0e7]">
              {dueDiligenceList.map((item) => (
                <tr key={item.id} className="hover:bg-[#f9faf7]">
                  <td className="py-3 px-3">
                    <strong className="text-[#193b2a] block">{item.buyerName}</strong>
                    <span className="text-[#72816f] text-[11px]">{item.buyerOrg}</span>
                  </td>
                  <td className="py-3 px-3 text-[#213c2b] font-medium">{item.projectTitle}</td>
                  <td className="py-3 px-3 font-mono text-[#72816f]">{item.inquiryDate}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-[#245b45]">
                    {item.volumeRequestedTons.toLocaleString()} t
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-[#f4f6f0] border border-[#dfe6d9] text-[#213c2b] text-[10px] font-mono px-2 py-0.5 rounded">
                      {item.stage}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-[#dfe6d9] max-h-[90vh] overflow-y-auto animate-in fade-in-50 zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-[#edf0e7] mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#5c7c46] uppercase tracking-wider block mb-0.5">
                  Multi-Project Evaluation
                </span>
                <h3 className="font-serif text-xl font-semibold text-[#193b2a]">
                  Side-by-Side Project Comparison
                </h3>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-1 rounded-full text-[#72816f] hover:text-[#193b2a] hover:bg-[#f4f6f0]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {comparisonIds.map((id) => {
                const prj = projects.find((p) => p.id === id);
                if (!prj) return null;
                return (
                  <div key={prj.id} className="bg-[#f9faf7] border border-[#dfe6d9] rounded-xl p-4 space-y-3">
                    <div>
                      <span className="font-mono text-[10px] text-[#72816f] bg-white px-2 py-0.5 rounded border border-[#edf0e7]">
                        {prj.district}, Punjab
                      </span>
                      <h4 className="font-serif text-base font-semibold text-[#193b2a] mt-1.5">
                        {prj.title}
                      </h4>
                    </div>

                    <div className="space-y-2 py-2 border-y border-[#edf0e7] text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-[#72816f]">Methodology:</span>
                        <strong className="text-[#193b2a] text-right">{prj.methodology.split(' ')[0]}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#72816f]">Mitigation Volume:</span>
                        <strong className="font-mono text-[#245b45]">
                          {prj.estimatedTonsCo2ePerYear.toLocaleString()} t/yr
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#72816f]">Enrolled Area:</span>
                        <strong className="font-mono text-[#193b2a]">{prj.totalHectares} ha</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#72816f]">Readiness Score:</span>
                        <strong className="font-mono text-emerald-700">{prj.readinessScorePercent}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#72816f]">Indicative Guide Price:</span>
                        <strong className="font-mono text-[#193b2a]">${prj.indicativePricePerTonUsd} / t</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#72816f]">Farmer Count:</span>
                        <span className="font-mono">{prj.farmerCount} Smallholders</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedProject(prj);
                        setIsCompareModalOpen(false);
                        setIsInquiryModalOpen(true);
                      }}
                      className="w-full text-xs bg-[#245b45] text-white hover:bg-[#1a4333]"
                    >
                      Inquire Offtake
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-[#edf0e7] flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCompareModalOpen(false)}
                className="text-xs border-[#d8e1d4]"
              >
                Close Comparison
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Project View Drawer */}
      {selectedProject && !isInquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#dfe6d9] animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#edf0e7] mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#5c7c46] uppercase tracking-wider block mb-0.5">
                  Project Dossier Summary
                </span>
                <h3 className="font-serif text-xl font-semibold text-[#193b2a]">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1 rounded-full text-[#72816f] hover:text-[#193b2a] hover:bg-[#f4f6f0]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-xs text-[#526451] leading-relaxed bg-[#f9faf7] p-3 rounded-lg border border-[#edf0e7]">
                {selectedProject.description}
              </p>

              <div>
                <strong className="text-xs font-semibold text-[#193b2a] block mb-2">Project Highlights:</strong>
                <ul className="space-y-1.5 text-xs text-[#526451]">
                  {selectedProject.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 py-2 border-y border-[#edf0e7]">
                <div>
                  <span className="text-[10px] font-mono text-[#72816f] block">METHODOLOGY</span>
                  <span className="font-medium text-[#193b2a]">{selectedProject.methodology}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#72816f] block">DEVELOPER</span>
                  <span className="font-medium text-[#193b2a]">{selectedProject.developer}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#72816f] block">VINTAGE</span>
                  <span className="font-mono text-[#193b2a]">{selectedProject.vintage}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#72816f] block">INDICATIVE PRICE</span>
                  <span className="font-mono font-semibold text-[#245b45]">
                    ${selectedProject.indicativePricePerTonUsd} / tCO2e
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#edf0e7] flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedProject(null)}
                className="text-xs border-[#d8e1d4]"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => setIsInquiryModalOpen(true)}
                className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333]"
              >
                Inquire Offtake Volume
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Buyer Inquiry Modal */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dfe6d9] animate-in fade-in-50 zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-[#edf0e7] mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#5c7c46] uppercase tracking-wider block mb-0.5">
                  Buyer Due Diligence Inquiry
                </span>
                <h3 className="font-serif text-xl font-semibold text-[#193b2a]">
                  Inquire on {selectedProject ? selectedProject.title : 'Agricultural Carbon Project'}
                </h3>
              </div>
              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="p-1 rounded-full text-[#72816f] hover:text-[#193b2a] hover:bg-[#f4f6f0]"
              >
                <X size={18} />
              </button>
            </div>

            {inquirySuccessMsg ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg text-[#193b2a]">Inquiry Registered</h4>
                <p className="text-xs text-[#72816f]">{inquirySuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-medium text-[#193b2a] block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Sterling"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-[#193b2a] block mb-1">Organization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pan-Euro Carbon Fund"
                      value={buyerOrg}
                      onChange={(e) => setBuyerOrg(e.target.value)}
                      className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-[#193b2a] block mb-1">Business Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="d.sterling@pe-carbon.eu"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-medium text-[#193b2a] block mb-1">Desired Volume (tCO2e) *</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                  />
                </div>

                <p className="text-[11px] text-[#72816f] bg-[#f9faf7] p-2.5 rounded-lg border border-[#edf0e7]">
                  Demonstration Notice: Inquiries are appended to the local Due Diligence pipeline table. Real institutional contracts require VVB audited issuance.
                </p>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsInquiryModalOpen(false)}
                    className="text-xs border-[#d8e1d4]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333]"
                  >
                    Send Ingestion Request
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
