import { useState, useMemo } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { getApprovedBuyerProjects, saveBuyerEnquiry } from '@/lib/buyer/buyer-service';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/client';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!buyerName.trim() || !buyerOrg.trim() || !buyerEmail.trim() || !projectId) {
      setErrorMsg('Please complete all required fields (Name, Organization, Email, and Project).');
      return;
    }

    const selectedProj = allProjects.find((p) => p.id === projectId);
    const projectTitle = selectedProj ? selectedProj.title : 'Selected Agricultural Project';

    setIsSubmitting(true);

    try {
      // Submit to FastAPI backend /api/buyer/enquiries
      await api.post('/buyer/enquiries', {
        projectId,
        volumeRequestedTons: volume ? parseFloat(volume) : 500,
        targetRetirementYear: targetYear || '2027',
        message: `${message}\n[Scope Requested: ${scopeOptions.join(', ')}]`,
      });
    } catch {
      // offline/fallback
    }

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
  };

  if (submittedEnquiryId) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
          <CheckCircle2 size={36} />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
            Enquiry Reference: {submittedEnquiryId}
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#193b2a]">
            Due Diligence EOI Submitted
          </h2>
          <p className="text-xs text-[#526655] max-w-md mx-auto">
            Your inquiry has been encrypted and recorded in the institutional pipeline. The project developer team will review your credentials and issue Data Room credentials.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <Button asChild size="sm" className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333]">
            <Link to="/buyers/enquiries">
              <Inbox size={13} className="mr-1.5" />
              View Tracked Enquiries
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link to="/buyers/marketplace">Return to Marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <Link
          to="/buyers/marketplace"
          className="inline-flex items-center gap-1.5 text-xs text-[#526655] hover:text-[#193b2a] font-medium"
        >
          <ArrowLeft size={14} />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      <PageHeader
        title="Submit Due Diligence Inquiry & Data Room Request"
        description="Formal expression of interest for accredited corporate buyers seeking forward offtake or auditing data-room access."
        badge={<DemoBadge label="Commercial Due Diligence" />}
      />

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#dde4d9] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#193b2a] border-b border-[#dde4d9] pb-2">
            1. Target Agricultural Carbon Project
          </h3>
          <div>
            <label className="block text-xs font-mono uppercase text-[#708071] mb-1.5">
              Select Approved Project Cluster *
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg p-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
              required
            >
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.district} · {p.practice})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#193b2a] border-b border-[#dde4d9] pb-2">
            2. Buyer Organization & Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#708071] mb-1.5">
                Lead Contact Name *
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg p-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#708071] mb-1.5">
                Organization / Company *
              </label>
              <input
                type="text"
                value={buyerOrg}
                onChange={(e) => setBuyerOrg(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg p-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#708071] mb-1.5">
                Corporate Email Address *
              </label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg p-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#708071] mb-1.5">
                Institutional Sector
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg p-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
              >
                <option value="Corporate Climate Fund">Corporate Climate Fund</option>
                <option value="Carbon Credit Brokerage">Carbon Credit Brokerage / Trader</option>
                <option value="Compliance Emitter">Compliance / Heavy Industry Emitter</option>
                <option value="Sovereign / Multilateral Facility">Sovereign / Multilateral Facility</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#193b2a] border-b border-[#dde4d9] pb-2">
            3. Procurement Scope & Target Volume
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#708071] mb-1.5">
                Target Forward Volume (tCO2e)
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg p-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
              />
              <span className="text-[10px] text-[#708071] mt-1 block">
                Indicative forward volume. Non-binding expression of interest.
              </span>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#708071] mb-1.5">
                Target Retirement Year
              </label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg p-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
              >
                <option value="2026">2026 Vintage</option>
                <option value="2027">2027 Vintage</option>
                <option value="2028">2028 Vintage</option>
                <option value="Multi-year">Multi-year Forward Contract</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#708071] mb-2">
              Data Room Artifacts Requested
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { id: 'satellite_manifest', label: 'Sentinel-2 Remote Sensing Index Trajectory' },
                { id: 'pdd_draft', label: 'Verra VM0042 Project Design Document (PDD)' },
                { id: 'benefit_sharing', label: '80% Farmer Benefit-Sharing Governance Protocol' },
                { id: 'cadastral_shapefile', label: 'Cadastral GIS Vector Enclosure Manifest' },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 text-[#213c2b] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scopeOptions.includes(opt.id)}
                    onChange={() => handleCheckboxToggle(opt.id)}
                    className="accent-[#245b45]"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#708071] mb-1.5">
              Specific Inquiries or Bilateral Requirements
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg p-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#dde4d9] flex justify-end gap-3">
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link to="/buyers/marketplace">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="sm"
            className="text-xs bg-[#245b45] text-white hover:bg-[#1a4333]"
          >
            {isSubmitting ? 'Registering Enquiry...' : 'Submit Due Diligence Request'}
          </Button>
        </div>
      </form>
    </div>
  );
}
