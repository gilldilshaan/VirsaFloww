import { useState, useMemo } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { getApprovedBuyerProjects, saveBuyerEnquiry } from '@/lib/buyer/buyer-service';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import {
  Send,
  Building,
  CheckCircle2,
  FileCheck2,
  ShieldAlert,
  ArrowRight,
  Inbox,
  Lock,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

interface BuyerEnquiryFormProps {
  initialProjectId: string | undefined;
}

export function BuyerEnquiryForm({ initialProjectId }: BuyerEnquiryFormProps) {
  const router = useRouter();
  const allProjects = useMemo(() => getApprovedBuyerProjects(), []);

  const [projectId, setProjectId] = useState<string>(
    initialProjectId && allProjects.some((p) => p.id === initialProjectId)
      ? initialProjectId
      : allProjects[0]?.id || ''
  );
  const [buyerName, setBuyerName] = useState('Sarah Jenkins');
  const [buyerOrg, setBuyerOrg] = useState('Global Decarbonization Capital');
  const [buyerEmail, setBuyerEmail] = useState('s.jenkins@decarboncapital.com');
  const [sector, setSector] = useState('Corporate Climate Fund');
  const [volume, setVolume] = useState('2500');
  const [targetYear, setTargetYear] = useState('2026');
  const [scopeOptions, setScopeOptions] = useState<string[]>([
    'satellite_manifest',
    'pdd_draft',
    'benefit_sharing',
  ]);
  const [message, setMessage] = useState(
    'Requesting access to the complete remote sensing time-series and cadastral boundary manifest for pre-contract due diligence.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  const handleCheckboxToggle = (val: string) => {
    if (scopeOptions.includes(val)) {
      setScopeOptions(scopeOptions.filter((s) => s !== val));
    } else {
      setScopeOptions([...scopeOptions, val]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!buyerName.trim() || !buyerOrg.trim() || !buyerEmail.trim() || !projectId) {
      setErrorMsg('Please complete all required fields (Name, Organization, Email, and Project).');
      return;
    }

    const selectedProj = allProjects.find((p) => p.id === projectId);
    const projectTitle = selectedProj ? selectedProj.title : 'Selected Agricultural Project';

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const saved = saveBuyerEnquiry({
          buyerName,
          buyerOrg,
          projectId,
          projectTitle,
          volumeRequestedTons: volume ? parseInt(volume, 10) : null,
          targetRetirementYear: targetYear || null,
          message: `${message}\n[Scope Requested: ${scopeOptions.join(', ')}]`,
        });

        setIsSubmitting(false);
        setSubmittedEnquiryId(saved.id);
      } catch (err) {
        setIsSubmitting(false);
        setErrorMsg('An error occurred while registering your enquiry. Please try again.');
      }
    }, 600);
  };

  if (submittedEnquiryId) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-[#5c7c46] uppercase font-semibold">
            Due Diligence Enquiry Registered
          </span>
          <h2 className="font-serif text-3xl text-[#193b2a]">Enquiry Successfully Logged</h2>
          <p className="text-xs text-[#708071] max-w-md mx-auto">
            Your request for project due diligence has been received and routed to the internal project developer workspace.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#dde4d9] text-left max-w-md mx-auto space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-[#f0f3ec]">
            <span className="text-[#708071]">Reference ID:</span>
            <span className="font-mono font-bold text-[#193b2a]">{submittedEnquiryId}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#f0f3ec]">
            <span className="text-[#708071]">Target Project:</span>
            <span className="font-medium text-[#193b2a]">
              {allProjects.find((p) => p.id === projectId)?.title}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#f0f3ec]">
            <span className="text-[#708071]">Status:</span>
            <span className="text-emerald-700 font-semibold">Pending Review</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#708071]">Indicative Volume:</span>
            <span className="font-mono">{volume ? `${Number(volume).toLocaleString()} tCO2e` : 'Custom'}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          <Button asChild variant="outline" size="sm" className="text-xs border-[#dce3d7] text-[#245b45]">
            <Link to="/buyers/marketplace">
              <ArrowLeft size={13} className="mr-1.5" />
              Explore More Projects
            </Link>
          </Button>
          <Button asChild size="sm" className="text-xs bg-[#245b45] text-white">
            <Link to="/buyers/enquiries">
              <Inbox size={13} className="mr-1.5" />
              View My Enquiries
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Request Project Due Diligence"
        description="Submit an institutional Expression of Interest (EOI) or request access to technical data rooms, Sentinel-2 remote sensing manifests, and deterministic rule logs."
        badge={<DemoBadge label="Demonstration Form" />}
      />

      {/* Mandatory Notice */}
      <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert size={16} className="text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block">Pre-Issuance Due Diligence Notice</span>
          <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
            TerraLedger AI does not broker or execute transactions for unverified carbon credits. This form registers an institutional enquiry with the project developer for transparent evaluation of field evidence and methodologies.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle size={15} className="text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-[#dde4d9] shadow-2xs space-y-6">
        {/* Project Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#193b2a] block">
            Target Project Cluster <span className="text-red-500">*</span>
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
            required
          >
            {allProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.location}) — {p.readinessScorePercent}% Readiness
              </option>
            ))}
          </select>
          <span className="text-[11px] text-[#708071] block">
            Select the agricultural cluster for which you require documentation.
          </span>
        </div>

        {/* Contact Info (2 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#193b2a] block">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#193b2a] block">
              Organization / Firm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={buyerOrg}
              onChange={(e) => setBuyerOrg(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#193b2a] block">
              Business Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#193b2a] block">
              Institutional Sector
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
            >
              <option value="Corporate Climate Fund">Corporate Climate Fund</option>
              <option value="Compliance Procurement">Compliance Procurement</option>
              <option value="Voluntary Buyer">Voluntary Corporate Sustainability</option>
              <option value="Carbon Aggregator">Carbon Aggregator / Broker</option>
              <option value="Research & Academic">VVB / Academic Auditor</option>
            </select>
          </div>
        </div>

        {/* Volume & Vintage (2 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f0f3ec]">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#193b2a] block">
              Indicative Volume Interest (tCO2e)
            </label>
            <input
              type="number"
              step="500"
              min="100"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
              placeholder="e.g. 2500"
            />
            <span className="text-[10px] text-[#708071] block">
              Indicative non-binding volume for planning purposes.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#193b2a] block">
              Target Vintage
            </label>
            <select
              value={targetYear}
              onChange={(e) => setTargetYear(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
            >
              <option value="2026">Kharif 2026 (Active Monitoring)</option>
              <option value="2027">2027 Pipeline</option>
              <option value="2028">Multi-year forward commitment</option>
            </select>
          </div>
        </div>

        {/* Requested Due Diligence Scope */}
        <div className="space-y-2 pt-2 border-t border-[#f0f3ec]">
          <label className="text-xs font-semibold text-[#193b2a] block">
            Requested Data Room Access Scope
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { id: 'satellite_manifest', label: 'Sentinel-2 Remote Sensing Scene Manifest' },
              { id: 'pdd_draft', label: 'Verra VM0042 Project Design Document (PDD) Draft' },
              { id: 'cadastral_manifest', label: 'Cadastral Parcel GIS Layer (Anonymized)' },
              { id: 'benefit_sharing', label: 'Smallholder Direct Benefit-Sharing Model (80%)' },
              { id: 'mrv_rules', label: 'Deterministic Rule Engine Specification' },
            ].map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-[#e5ebe0] bg-[#fafbf9] cursor-pointer hover:bg-[#f4f7f1]"
              >
                <input
                  type="checkbox"
                  checked={scopeOptions.includes(opt.id)}
                  onChange={() => handleCheckboxToggle(opt.id)}
                  className="rounded text-[#245b45] focus:ring-[#245b45]"
                />
                <span className="text-[#3b5440] text-[11px]">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Message / Objectives */}
        <div className="space-y-1.5 pt-2 border-t border-[#f0f3ec]">
          <label className="text-xs font-semibold text-[#193b2a] block">
            Specific Requirements / Corporate Objectives
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg p-3 text-[#193b2a] outline-none focus:border-[#245b45]"
            placeholder="Specify any internal audit standards or requirements..."
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-between">
          <Link to="/buyers/marketplace" className="text-xs text-[#708071] hover:underline">
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333] px-6 h-10"
          >
            {isSubmitting ? (
              'Submitting Enquiry...'
            ) : (
              <>
                <Send size={14} className="mr-1.5" />
                Submit Due Diligence Request
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
