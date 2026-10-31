import { useState } from 'react';
import { SiteShell, PageIntro } from '@/components/earth/site-shell';
import { Button } from '@/components/ui/button';
import { DemoBadge } from '@/components/shared/demo-badge';
import {
  ORGANISATION_TYPES,
  PARTNERSHIP_INTERESTS,
  type OrganisationType,
  type PartnershipInterest,
} from '@/lib/partnerships/types';
import { submitPartnershipEnquiry } from '@/lib/partnerships/partnerships-service';
import {
  Factory,
  Building2,
  Sprout,
  Landmark,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  FileCheck2,
  TreeDeciduous,
  Send,
  AlertCircle,
} from 'lucide-react';

export function IndustrialPartnershipsPage() {
  const [orgName, setOrgName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orgType, setOrgType] = useState<OrganisationType>('Manufacturing Company');
  const [industry, setIndustry] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Punjab');
  const [interest, setInterest] = useState<PartnershipInterest>('Industrial environmental infrastructure');
  const [estimatedScale, setEstimatedScale] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!orgName.trim() || !contactPerson.trim() || !email.trim() || !phone.trim() || !city.trim()) {
      setErrorMsg('Please complete all mandatory contact and organisation fields.');
      return;
    }

    if (!consent) {
      setErrorMsg('Please confirm your consent to be contacted regarding this partnership inquiry.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitPartnershipEnquiry({
        organisationName: orgName,
        contactPerson,
        email,
        phone,
        organisationType: orgType,
        industry: industry || 'Not specified',
        city,
        state,
        interest,
        estimatedScale: estimatedScale || 'Initial scoping',
        message: message || 'Partnership discussion requested.',
        consent,
      });

      setIsSubmitting(false);
      setSubmittedRefId(res.enquiryId);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Unable to submit enquiry. Please verify your connection or try again.');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SiteShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#102e20] text-[#f4f7f1] pt-24 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#1c4833]">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d6eaa6]/15 border border-[#d6eaa6]/30 text-[#d6eaa6] text-xs font-mono uppercase tracking-widest">
            <Sparkles size={13} />
            Institutional Tie-ups & Climate Infrastructure
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#f5f5e8] tracking-tight leading-[1.08] max-w-4xl">
            Build the Next Generation of <span className="italic text-[#d6eaa6]">Climate Infrastructure.</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-[#bacabd] max-w-2xl font-light leading-relaxed">
            Partner with The Carbon Credit to deploy measurable environmental infrastructure through agricultural carbon programmes, urban carbon solutions and technology-enabled MRV.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
            <Button
              size="lg"
              onClick={() => scrollToSection('partnership-categories')}
              className="bg-[#d6eaa6] text-[#102e20] hover:bg-[#e4f3c0] font-semibold text-xs sm:text-sm h-12 px-6"
            >
              Explore Partnership Opportunities <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('enquiry-form')}
              className="border-[#4a725b] text-[#f4f7f1] hover:bg-[#1a4531] text-xs sm:text-sm h-12 px-6"
            >
              Request a Partnership Discussion
            </Button>
          </div>
        </div>
      </section>

      {/* Institutional Highlights Band */}
      <section className="bg-[#173a2b] border-b border-[#1f4e38] text-white py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#a3bfa8] block">Jurisdiction</span>
            <span className="text-sm font-semibold text-[#f5f5e8] mt-0.5 block">Punjab & North India</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#a3bfa8] block">MRV Standard</span>
            <span className="text-sm font-semibold text-[#d6eaa6] mt-0.5 block">Deterministic Multi-Sensor</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#a3bfa8] block">Beneficiary Impact</span>
            <span className="text-sm font-semibold text-[#f5f5e8] mt-0.5 block">80% Smallholder Benefit Direct</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-[#a3bfa8] block">Infrastructure</span>
            <span className="text-sm font-semibold text-[#d6eaa6] mt-0.5 block">Urban & Industrial Scale</span>
          </div>
        </div>
      </section>

      {/* Four Strategic Partnership Categories */}
      <section id="partnership-categories" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#5c7c46] font-semibold">
            Programmes & Infrastructure
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#193b2a]">
            Collaborative Climate Frameworks
          </h2>
          <p className="text-xs sm:text-sm text-[#708071] leading-relaxed">
            We structure long-term institutional agreements with clear engineering boundaries, empirical verification protocols, and transparent co-benefit accounting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Category A: Industrial Decarbonisation */}
          <div className="bg-white rounded-2xl p-8 border border-[#dde4d9] shadow-xs space-y-4 hover:border-[#245b45] transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#eef3eb] text-[#245b45] flex items-center justify-center">
                <Factory size={24} />
              </div>
              <span className="text-[10px] font-mono bg-[#eef3eb] text-[#245b45] px-2.5 py-0.5 rounded-full uppercase font-bold">
                Available & Active
              </span>
            </div>
            <h3 className="font-serif text-2xl text-[#193b2a]">
              A. Industrial Decarbonisation
            </h3>
            <p className="text-xs text-[#526655] leading-relaxed">
              Designed for heavy manufacturing, cement, chemical, and industrial complexes seeking direct environmental infrastructure integration and credible emissions baseline accounting.
            </p>
            <ul className="space-y-2 text-xs text-[#415d43] pt-2 border-t border-[#f0f3ec]">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>Environmental infrastructure deployment:</strong> Point-source capture interfaces and site-specific mitigation systems.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>Industrial sustainability partnerships:</strong> Joint operational frameworks for energy-intensive clusters.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>Emissions measurement & reporting:</strong> Continuous facility emissions telemetry and scope-aligned reporting.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>Project-level environmental monitoring:</strong> Independent audit trails for corporate sustainability compliance.</span>
              </li>
            </ul>
          </div>

          {/* Category B: Urban Climate Infrastructure */}
          <div className="bg-white rounded-2xl p-8 border border-[#dde4d9] shadow-xs space-y-4 hover:border-[#245b45] transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#eef3eb] text-[#245b45] flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <span className="text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase font-bold">
                Pilot & Co-Development
              </span>
            </div>
            <h3 className="font-serif text-2xl text-[#193b2a]">
              B. Urban Climate Infrastructure
            </h3>
            <p className="text-xs text-[#526655] leading-relaxed">
              Civic bio-architecture and smart urban infrastructure targeting metropolitan air quality, carbon fixation, and high-visibility corporate sustainability installations.
            </p>
            <ul className="space-y-2 text-xs text-[#415d43] pt-2 border-t border-[#f0f3ec]">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>Algae-based environmental installations:</strong> High-efficiency photobioreactor columns capturing localized particulate matter and CO2.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>Smart urban sustainability infrastructure:</strong> Integrated civic air-scrubbing amenities for business parks and transit corridors.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>Public-space deployments:</strong> Architectural living installations for smart-city zones and corporate headquarters.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>Environmental monitoring systems:</strong> Real-time urban environmental IoT sensors tracking ambient air parameters.</span>
              </li>
            </ul>
          </div>

          {/* Category C: Agricultural Carbon Programmes */}
          <div className="bg-white rounded-2xl p-8 border border-[#dde4d9] shadow-xs space-y-4 hover:border-[#245b45] transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#eef3eb] text-[#245b45] flex items-center justify-center">
                <Sprout size={24} />
              </div>
              <span className="text-[10px] font-mono bg-[#eef3eb] text-[#245b45] px-2.5 py-0.5 rounded-full uppercase font-bold">
                Operational Backbone
              </span>
            </div>
            <h3 className="font-serif text-2xl text-[#193b2a]">
              C. Agricultural Carbon Programmes
            </h3>
            <p className="text-xs text-[#526655] leading-relaxed">
              Large-scale regional agronomic transition programs across Punjab and Indo-Gangetic plains tackling rice methane emissions, groundwater overdraft, and stubble burning.
            </p>
            <ul className="space-y-2 text-xs text-[#415d43] pt-2 border-t border-[#f0f3ec]">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>DSR and AWD programme participation:</strong> Direct Seeded Rice and Alternate Wetting & Drying field cluster mobilization.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>Agricultural carbon project development:</strong> Comprehensive PDD formulation, baseline surveys, and cadastral mapping.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>Farmer engagement & FPO networks:</strong> Direct smallholder contracts, agronomic training, and digital payout mechanisms.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>Digital MRV & evidence systems:</strong> Sentinel-2 satellite time-series coupled with farmer app geotagged ground truth.</span>
              </li>
            </ul>
          </div>

          {/* Category D: CSR and Government Partnerships */}
          <div className="bg-white rounded-2xl p-8 border border-[#dde4d9] shadow-xs space-y-4 hover:border-[#245b45] transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#eef3eb] text-[#245b45] flex items-center justify-center">
                <Landmark size={24} />
              </div>
              <span className="text-[10px] font-mono bg-[#eef3eb] text-[#245b45] px-2.5 py-0.5 rounded-full uppercase font-bold">
                Institutional Mandate
              </span>
            </div>
            <h3 className="font-serif text-2xl text-[#193b2a]">
              D. CSR and Government Partnerships
            </h3>
            <p className="text-xs text-[#526655] leading-relaxed">
              Aligning corporate social responsibility grants and state climate priorities with defensible, auditable rural and municipal environmental deployments.
            </p>
            <ul className="space-y-2 text-xs text-[#415d43] pt-2 border-t border-[#f0f3ec]">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>CSR-funded environmental programmes:</strong> Verifiable impact metrics compliant with Ministry of Corporate Affairs norms.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>Municipal projects:</strong> Urban green corridors, community bio-filters, and public climate adaptation amenities.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>Government-supported climate initiatives:</strong> Technical alignment with State Action Plans on Climate Change (SAPCC).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#245b45] shrink-0 mt-0.5" />
                <span><strong>Community-level deployments:</strong> Panchayat-level water conservation and residue machinery hubs.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Distinction & Provenance Callout */}
      <section className="bg-[#f7f9f5] py-12 px-4 border-y border-[#dde4d9]">
        <div className="max-w-4xl mx-auto rounded-2xl bg-white p-6 sm:p-8 border border-[#dde4d9] flex flex-col sm:flex-row items-start gap-4">
          <ShieldCheck size={28} className="text-[#245b45] shrink-0 mt-1" />
          <div className="space-y-2 text-xs text-[#526655]">
            <h4 className="font-serif text-base font-bold text-[#193b2a]">
              Deployment Integrity & Staged Delivery Assurance
            </h4>
            <p className="leading-relaxed">
              The Carbon Credit strictly distinguishes active, operational agricultural MRV programmes (currently monitoring Kharif 2026 DSR clusters in Punjab) from pilot-stage urban and algae bio-architecture installations. We do not claim installations are deployed until site commissioning and third-party verification are formally completed.
            </p>
          </div>
        </div>
      </section>

      {/* Enquiry Form Section */}
      <section id="enquiry-form" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#5c7c46] font-semibold">
            Institutional Intake
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#193b2a]">
            Initiate a Partnership Discussion
          </h2>
          <p className="text-xs text-[#708071]">
            Submit your institutional scoping details. Our leadership and technical teams evaluate every inquiry within 24 hours.
          </p>
        </div>

        {submittedRefId ? (
          <div className="bg-white rounded-2xl p-8 border border-[#dde4d9] text-center space-y-5 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-[#193b2a]">Partnership Inquiry Received</h3>
              <p className="text-xs text-[#708071] max-w-md mx-auto leading-relaxed">
                Thank you for reaching out. Your institutional dossier request has been registered in the Panjdhara Private Limited partnership queue.
              </p>
            </div>
            <div className="bg-[#f7f9f5] rounded-xl p-4 max-w-sm mx-auto border border-[#dde4d9] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#708071]">Reference ID:</span>
                <span className="font-mono font-bold text-[#193b2a]">{submittedRefId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#708071]">Organisation:</span>
                <span className="font-semibold text-[#193b2a]">{orgName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#708071]">Status:</span>
                <span className="text-emerald-700 font-semibold">Under Evaluation</span>
              </div>
            </div>
            <Button
              onClick={() => {
                setSubmittedRefId(null);
                setOrgName('');
                setContactPerson('');
                setEmail('');
                setPhone('');
                setCity('');
                setMessage('');
                setConsent(false);
              }}
              variant="outline"
              size="sm"
              className="text-xs border-[#dce3d7] text-[#245b45]"
            >
              Submit Another Inquiry
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 sm:p-10 border border-[#dde4d9] shadow-sm space-y-6"
          >
            {errorMsg && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-800 flex items-center gap-2">
                <AlertCircle size={15} className="text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">
                  Organisation Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vardhman Textiles / Punjab Infrastructure"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajiv Malhotra, VP Sustainability"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">
                  Official Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@organisation.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98XXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">
                  Organisation Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value as OrganisationType)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
                >
                  {ORGANISATION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">
                  Industry / Sector Focus
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heavy Manufacturing, Municipal, Cement"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ludhiana, Chandigarh, Amritsar"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">
                  State / Territory
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-[#f0f3ec]">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">
                  Primary Partnership Interest <span className="text-red-500">*</span>
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value as PartnershipInterest)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
                >
                  {PARTNERSHIP_INTERESTS.map((pi) => (
                    <option key={pi} value={pi}>
                      {pi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#193b2a] block">
                  Estimated Project Scale
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5,000 ha / 2 Factory Units / City Zone"
                  value={estimatedScale}
                  onChange={(e) => setEstimatedScale(e.target.value)}
                  className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2.5 text-[#193b2a] outline-none focus:border-[#245b45]"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#f0f3ec] text-xs">
              <label className="font-semibold text-[#193b2a] block">
                Partnership Scope & Objectives
              </label>
              <textarea
                rows={3}
                placeholder="Outline your timeline, target environmental KPIs, or specific scoping questions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg p-3 text-[#193b2a] outline-none focus:border-[#245b45]"
              />
            </div>

            <div className="pt-2 border-t border-[#f0f3ec]">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#526655]">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#245b45] focus:ring-[#245b45]"
                />
                <span>
                  I consent to The Carbon Credit / Panjdhara Private Limited contacting my organisation regarding institutional climate infrastructure partnerships and technical scoping discussions.
                </span>
              </label>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#245b45] text-white hover:bg-[#1a4333] px-8 h-11 text-xs sm:text-sm font-semibold"
              >
                {isSubmitting ? (
                  'Submitting Dossier Request...'
                ) : (
                  <>
                    <Send size={15} className="mr-2" />
                    Submit Partnership Inquiry
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </section>
    </SiteShell>
  );
}
