import { useState } from 'react';
import { useTerraLedger } from '@/lib/terra-ledger/store';
import {
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
  Download,
  Send,
  Building,
  Calendar,
  Users,
  Sprout,
  CheckCircle2,
  ExternalLink,
  Lock,
  Layers,
  Info,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProjectDossier() {
  const { assessmentStatus, completenessPercent, demoState, submitBuyerInquiry } = useTerraLedger();

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerOrg, setBuyerOrg] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [volume, setVolume] = useState('2500');
  const [vintage, setVintage] = useState('2026');
  const [notes, setNotes] = useState('');
  const [inquiryResult, setInquiryResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerOrg || !buyerEmail) return;

    const res = submitBuyerInquiry({
      buyerName,
      buyerOrg,
      projectTitle: 'Punjab Direct Seeded Rice MRV Cluster #1',
      volumeRequestedTons: Number(volume) || 1000,
      targetRetirementYear: vintage,
    });

    setInquiryResult(res);
    setTimeout(() => {
      setInquiryResult(null);
      setIsInquiryModalOpen(false);
      setBuyerName('');
      setBuyerOrg('');
      setBuyerEmail('');
    }, 2200);
  };

  return (
    <div className="space-y-6">
      {/* Header & Due Diligence Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider mb-1">
            <FileCheck2 size={13} />
            Institutional Due Diligence & Project Dossier
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight">
            Punjab DSR MRV Cluster #1
          </h1>
          <p className="text-xs text-[#72816f] mt-1">
            Dossier compiled from multi-spectral satellite observations, cadastral polygons, and farmer field evidence.
          </p>
        </div>

        {/* Due Diligence CTAs */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsInquiryModalOpen(true)}
            className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333]"
          >
            <Send size={13} className="mr-1.5" />
            Request Data Room Access
          </Button>
        </div>
      </div>

      {/* Mandatory Non-Certification Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-amber-950 flex items-start gap-3 text-xs">
        <ShieldAlert size={18} className="text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-amber-900 font-semibold mb-0.5">
            Independent Verification Notice
          </strong>
          <span>
            Automated multi-source evidence screening organizes and validates data completeness, spatial enclosure, and temporal continuity. This dossier serves as the pre-audit data room for accredited Validation and Verification Bodies (VVBs). It does not constitute independent third-party carbon credit certification or guarantee credit issuance.
          </span>
        </div>
      </div>

      {/* Project Specs Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Cluster Scale</span>
          <strong className="block text-2xl font-mono text-[#193b2a] mt-1">1,450 ha</strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">180 Registered Parcels</span>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Annual Volume</span>
          <strong className="block text-2xl font-mono text-[#245b45] mt-1">6,960 t</strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">Estimated CO2e reduction</span>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Methodology</span>
          <strong className="block text-sm font-semibold text-[#193b2a] mt-1">Verra VM0042</strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">Agri-Land Management</span>
        </div>

        <div className="bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-mono text-[#69816a] uppercase">Audit Readiness</span>
          <strong
            className={`block text-2xl font-mono mt-1 ${
              completenessPercent >= 90
                ? 'text-emerald-700'
                : completenessPercent >= 65
                ? 'text-sky-700'
                : 'text-amber-700'
            }`}
          >
            {completenessPercent}%
          </strong>
          <span className="text-[11px] text-[#72816f] mt-0.5 block">
            {assessmentStatus.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Due Diligence Dimensions & Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Evidence Dimensions */}
        <div className="lg:col-span-7 bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf0e7]">
            <h2 className="text-sm font-semibold text-[#193b2a] flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#245b45]" />
              Institutional Due Diligence Scorecard
            </h2>
            <span className="text-[10px] font-mono text-[#72816f]">VINTAGE KHARIF 2026</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Dimension 1 */}
            <div className="p-3 bg-[#f9faf7] rounded-lg border border-[#edf0e7]">
              <div className="flex justify-between font-medium mb-1">
                <span className="text-[#193b2a]">1. Geospatial Cadastral Alignment</span>
                <span className="font-mono text-emerald-700 font-semibold">
                  {demoState === 'ready' ? 'Pass · 100%' : 'Flagged (1 Mismatch)'}
                </span>
              </div>
              <p className="text-[11px] text-[#72816f] leading-relaxed">
                All field boundaries anchored to official Punjab State digital land revenue records. Centroid tolerance &lt; 5m.
              </p>
            </div>

            {/* Dimension 2 */}
            <div className="p-3 bg-[#f9faf7] rounded-lg border border-[#edf0e7]">
              <div className="flex justify-between font-medium mb-1">
                <span className="text-[#193b2a]">2. Remote Sensing Phenology Match</span>
                <span className="font-mono text-emerald-700 font-semibold">Pass · High Confidence</span>
              </div>
              <p className="text-[11px] text-[#72816f] leading-relaxed">
                Copernicus Sentinel-2 Level-2A multi-spectral passes corroborate direct seeding emergence without puddling and track seasonal NDVI growth curve.
              </p>
            </div>

            {/* Dimension 3 */}
            <div className="p-3 bg-[#f9faf7] rounded-lg border border-[#edf0e7]">
              <div className="flex justify-between font-medium mb-1">
                <span className="text-[#193b2a]">3. Water Saving Practice Evidence (AWD)</span>
                <span
                  className={`font-mono font-semibold ${
                    demoState === 'unverified' ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {demoState === 'unverified' ? 'Incomplete (Log Missing)' : 'Pass · Ready for Verification'}
                </span>
              </div>
              <p className="text-[11px] text-[#72816f] leading-relaxed">
                Field perforated PVC water tube readings validate 15cm drying depth cycles, confirming absence of continuous anaerobic flood conditions.
              </p>
            </div>

            {/* Dimension 4 */}
            <div className="p-3 bg-[#f9faf7] rounded-lg border border-[#edf0e7]">
              <div className="flex justify-between font-medium mb-1">
                <span className="text-[#193b2a]">4. Farmer Benefit Share Guarantee</span>
                <span className="font-mono text-emerald-700 font-semibold">Pass · 80% Direct Share</span>
              </div>
              <p className="text-[11px] text-[#72816f] leading-relaxed">
                Binding aggregation agreement with Malwa Agro FPO guaranteeing 80% net carbon credit proceeds directly into participating farmers' bank accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Audit Trail & Data Room Summary */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider mb-3">
              Cryptographic Audit Trail Summary
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#edf0e7]">
                <span className="text-[#72816f]">Total Evaluated Documents:</span>
                <strong className="font-mono text-[#213c2b]">184 Records</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#edf0e7]">
                <span className="text-[#72816f]">Satellite Scenes Analyzed:</span>
                <strong className="font-mono text-[#213c2b]">16 Passes (S2 MSI)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#edf0e7]">
                <span className="text-[#72816f]">Cadastral Parcel Registry:</span>
                <span className="text-emerald-700 font-semibold">100% Jamabandi Match</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#edf0e7]">
                <span className="text-[#72816f]">Immutable Digest:</span>
                <span className="font-mono text-[10px] text-[#72816f]">SHA-256 Merkle Root</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#72816f]">Current Cluster Status:</span>
                <span className="font-mono font-semibold text-[#245b45]">
                  {assessmentStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#edf0e7]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  alert('Demonstration: Project Data Room package download initiated.');
                }}
                className="w-full text-xs border-[#d8e1d4] hover:bg-[#f4f6f0] text-[#193b2a]"
              >
                <Download size={13} className="mr-1.5" />
                Download Summary Dossier (PDF Demo)
              </Button>
            </div>
          </div>

          {/* Institutional Developer Details */}
          <div className="bg-[#173a2b] text-white border border-[#2b503e] rounded-xl p-5 shadow-xs">
            <span className="text-[10px] font-mono text-[#d6eaa6] uppercase tracking-wider block mb-1">
              Project Developer & FPO Aggregator
            </span>
            <h4 className="font-serif text-base font-semibold text-white">
              Panjdhara Agritech Private Limited
            </h4>
            <p className="text-xs text-[#c6d7cb] mt-1 leading-relaxed">
              In institutional partnership with Malwa Agro Farmer Producer Organisation (Registration #FPO-PB-2024-819).
            </p>
            <div className="mt-3 pt-2 border-t border-[#ffffff15] text-[11px] text-[#a7f3d0] flex items-center justify-between">
              <span>Contact: contact@thecarboncredit.in</span>
              <span className="font-mono">Panjdhara India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buyer Inquiry Modal */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dfe6d9] animate-in fade-in-50 zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-[#edf0e7] mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#5c7c46] uppercase tracking-wider block mb-0.5">
                  Institutional Offtake & Inquiry
                </span>
                <h3 className="font-serif text-xl font-semibold text-[#193b2a]">
                  Request Data Room & Due Diligence Access
                </h3>
              </div>
              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="p-1 rounded-full text-[#72816f] hover:text-[#193b2a] hover:bg-[#f4f6f0]"
              >
                <X size={18} />
              </button>
            </div>

            {inquiryResult ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg text-[#193b2a]">Request Submitted</h4>
                <p className="text-xs text-[#72816f]">{inquiryResult.message}</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-medium text-[#193b2a] block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-[#193b2a] block mb-1">Organization / Fund *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Global Climate Capital Ltd"
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
                      placeholder="s.jenkins@climatecap.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-[#193b2a] block mb-1">Inquired Volume (tCO2e)</label>
                    <input
                      type="number"
                      min="100"
                      step="100"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-[#193b2a] block mb-1">Target Vintage</label>
                    <select
                      value={vintage}
                      onChange={(e) => setVintage(e.target.value)}
                      className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                    >
                      <option value="2026">Kharif 2026 (Forward)</option>
                      <option value="2027">Kharif 2027 (Forward)</option>
                      <option value="Multi-year">Multi-year Offtake (2026-2029)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-medium text-[#193b2a] block mb-1">Notes / Scope Requirements</label>
                  <textarea
                    rows={2}
                    placeholder="Specific due-diligence questions, VVB requirements, or Scope 3 inset requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
                  />
                </div>

                <p className="text-[11px] text-[#72816f] bg-[#f9faf7] p-2.5 rounded-lg border border-[#edf0e7]">
                  Demonstration Notice: Submitting records this enquiry into the local Due Diligence Pipeline tracker without sending unconsented external emails.
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
                    Submit Data Room Request
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
