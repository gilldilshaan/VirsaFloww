import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { composeEnquiry, enquiryPurposes, enquiryContextFields } from "@/lib/earth/enquiry";
import { TextLink } from "./site-shell";
import practiceMrvPhoto from "@/assets/application-stories/practice-mrv.webp";
import irrigationPhoto from "@/assets/application-stories/irrigation-measurement.webp";
import programPlanningPhoto from "@/assets/application-stories/program-planning.webp";
import carbonSamplingPhoto from "@/assets/application-stories/carbon-sampling.webp";
import cropAssessmentPhoto from "@/assets/application-stories/crop-assessment.webp";
import supplyChainPhoto from "@/assets/application-stories/supply-chain.webp";
const applications = [
  {
    title: "Agricultural Practice MRV",
    photo: practiceMrvPhoto,
    photoAlt: "A farmer and agricultural field specialist inspect young rice plants together.",
    photoCaption: "Field practice observation · illustrative",
    problem:
      "A declaration that a practice was implemented is not the same as a supported assessment across participating fields.",
    users: "FPOs, agribusinesses and agricultural program operators.",
    inputs:
      "Field boundaries, seasonal records, activity logs, authorized observations, photographs and suitable geospatial information.",
    workflow:
      "Define practice requirements, register fields and seasons, associate source records, check the required evidence and review conflicts or missing information.",
    outputs:
      "Intended outputs: practice assessments, evidence-completeness reports and program summaries.",
    limits:
      "Missing records remain unresolved until suitable evidence arrives. Practice assessment is distinct from quantified environmental impact.",
  },
  {
    title: "Water-use and irrigation intelligence",
    photo: irrigationPhoto,
    photoAlt: "A field technician reads a flow meter beside a rice-field irrigation channel.",
    photoCaption: "Irrigation measurement · illustrative",
    problem:
      "An irrigation event, water level and volume of water applied measure different things. Confusing them can produce unsupported savings claims.",
    users: "Irrigation program teams, FPOs, agricultural institutions and researchers.",
    inputs:
      "Irrigation logs, authorized flow meters or pumping measurements, field conditions, weather and suitable remote-sensing data where available.",
    workflow:
      "Record events, check instrument units and calibration, associate observations with fields and periods, and apply a suitable baseline comparison with uncertainty.",
    outputs:
      "Intended outputs: irrigation timelines, instrument-supported water totals, method-based estimates and field-condition reports.",
    limits:
      "Water savings require a defensible comparison, not just a practice change. Measured values remain distinct from estimates; instrumentation and integrations are program-dependent.",
  },
  {
    title: "Sustainable agriculture programs",
    photo: programPlanningPhoto,
    photoAlt: "Farmers and a program coordinator review a field sketch together under a shaded farm shelter.",
    photoCaption: "Program and field planning · illustrative",
    problem:
      "Eligibility, participation and implementation evidence can become inconsistent across locations and seasons.",
    users:
      "Government and development programs, agribusinesses and sustainability program operators.",
    inputs:
      "Eligibility criteria, authorized participation records, fields and seasons, practice requirements and applicable observation sources.",
    workflow:
      "Define criteria, register permitted participants, monitor evidence requirements, review exceptions and report progress consistently.",
    outputs:
      "Intended outputs: participation records, implementation assessments, evidence gaps and methodology-based outcome summaries.",
    limits:
      "Program-specific methods must be agreed. Participation alone is not proof of compliance, certification or benefit.",
  },
  {
    title: "Carbon and environmental MRV",
    photo: carbonSamplingPhoto,
    photoAlt: "A field researcher collects a sample from a transparent chamber placed over rice plants.",
    photoCaption: "Environmental field measurement · illustrative",
    problem:
      "Environmental claims need boundaries, a baseline, a methodology and suitable activity data, not only records of an agricultural practice.",
    users: "Environmental project developers, sustainability teams and authorized reviewers.",
    inputs:
      "Project boundary, baseline data, activity sources, applicable calculation procedures, method version and uncertainty.",
    workflow:
      "Organize sources, retain assumptions, calculate under the applicable method and prepare records for review. Track gaps and changes rather than overwriting assumptions.",
    outputs: "Intended outputs: traceable calculations, monitoring reports and evidence packages.",
    limits:
      "Evidence-workflow services do not automatically issue carbon credits or provide independent certification. No quantified reduction is claimed here.",
  },
  {
    title: "Crop insurance and risk evidence",
    photo: cropAssessmentPhoto,
    photoAlt: "An assessor photographs lodged rice plants while a farmer points out field conditions after rain.",
    photoCaption: "Crop-condition documentation · illustrative",
    problem:
      "Assessment teams need dated documentation of field conditions and events, with discrepancies and incomplete records made visible.",
    users: "Insurers, authorized inspection teams and risk-assessment partners.",
    inputs:
      "Time-stamped photographs, observations, weather context, inspection records and authorized case references.",
    workflow:
      "Assemble field evidence timelines, flag inconsistent records and prepare a case for the insurer’s own assessment process.",
    outputs:
      "Intended outputs: structured field documentation, evidence summaries and review queues.",
    limits:
      "The Carbon Credit does not replace policy interpretation, insurer decisions or formal loss adjustment. Geospatial observations alone do not establish a covered loss.",
  },
  {
    title: "Agricultural supply-chain traceability",
    photo: supplyChainPhoto,
    photoAlt: "A worker and farmer check an unbranded paddy sack at a rural collection point.",
    photoCaption: "Field-to-collection handoff · illustrative",
    problem:
      "A field record and downstream shipment documentation may have missing or ambiguous links.",
    users: "Agribusinesses, supply-chain organizations and authorized program partners.",
    inputs:
      "Field identities, crop-season and production records, downstream references and appropriate permissions.",
    workflow:
      "Link authorized records, reconcile references, surface missing links and document which chain-of-custody steps are supported.",
    outputs:
      "Intended outputs: traceability summaries, reconciliation findings and supporting records.",
    limits:
      "Farm records alone do not prove the origin of every shipment. Physical custody and downstream documentation require separate controls.",
  },
];
export function SolutionDetails() {
  return (
    <>
      <div className="earth-container earth-capability-note">
        <span className="earth-label">PROPOSED APPLICATIONS</span>
        <p>
          These workflows describe intended program configurations. Source availability, methods,
          implementation and deliverables require agreement; they are not claims of deployed
          integrations or verified outcomes.
        </p>
      </div>
      <section id="solution-applications" className="earth-container earth-application-details">
        {applications.map((a, i) => (
          <article key={a.title}>
            <div className="earth-application-story">
              <header>
                <span className="earth-label">APPLICATION {String(i + 1).padStart(2, "0")}</span>
                <h2>{a.title}</h2>
                <p>{a.problem}</p>
                <TextLink to="/contact">Discuss this application</TextLink>
              </header>
              <figure className="earth-application-photo">
                <img src={a.photo} alt={a.photoAlt} width={1600} height={900} loading="lazy" decoding="async" />
                <figcaption>
                  <span>AI-GENERATED ILLUSTRATION</span>
                  {a.photoCaption}
                </figcaption>
              </figure>
            </div>
            <dl>
              {[
                ["Intended users", a.users],
                ["Evidence inputs", a.inputs],
                ["Proposed workflow", a.workflow],
                ["Outputs", a.outputs],
                ["Interpretation boundaries", a.limits],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </section>
    </>
  );
}
export function PilotEnquiry({ interest }: { interest?: string | undefined }) {
  const [purpose, setPurpose] = useState<string>(
    enquiryPurposes.find((p) => p === interest) ?? "Institutional partnership",
  );
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      className="earth-enquiry"
      onChange={() => setDraft("")}
      onSubmit={(e) => {
        e.preventDefault();
        setError("");
        const data = new FormData(e.currentTarget);
        const context = Object.fromEntries(
          enquiryContextFields.map((f) => [f.key, String(data.get(f.key) ?? "")]),
        );
        try {
          setDraft(
            composeEnquiry({
              name: String(data.get("name") ?? ""),
              email: String(data.get("email") ?? ""),
              organization: String(data.get("organization") ?? ""),
              purpose,
              message: String(data.get("message") ?? ""),
              consent: data.get("consent") === "on",
              context,
            }),
          );
        } catch (err) {
          setError(err instanceof Error ? err.message : "Please check your enquiry.");
        }
      }}
    >
      <div className="earth-enquiry-paths" aria-label="Enquiry paths">
        {[
          ["Pilot program", "Discuss a pilot"],
          ["Institutional partnership", "Explore a partnership"],
          ["Platform walkthrough", "Platform walkthrough"],
        ].map(([value, label]) => (
          <Button
            type="button"
            key={value}
            variant={purpose === value ? "earth" : "secondary"}
            aria-pressed={purpose === value}
            onClick={() => {
              setPurpose(value ?? "Pilot program");
              setDraft("");
            }}
          >
            {label}
          </Button>
        ))}
      </div>
      <div className="earth-form-grid">
        <label>
          Your name
          <input name="name" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          Work email
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
      </div>
      <label>
        Organization
        <input name="organization" autoComplete="organization" required maxLength={200} />
      </label>
      <label>
        Enquiry type
        <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
          {enquiryPurposes.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <div className="earth-form-grid">
        {enquiryContextFields.map((f) => (
          <label key={f.key}>
            {f.label}
            <input name={f.key} maxLength={300} />
          </label>
        ))}
      </div>
      <label>
        Desired outcome
        <textarea
          name="message"
          required
          rows={5}
          maxLength={4000}
          placeholder="The agricultural problem, evidence needed and decision it should support…"
        />
      </label>
      <p className="earth-disclosure">
        Program context fields are optional. Do not include confidential farmer data, precise
        private field locations or sensitive documents. This prepares an email draft; nothing is
        submitted until you send it.
      </p>
      <label className="earth-consent">
        <input type="checkbox" name="consent" required />
        <span>
          I agree to share this enquiry with The Carbon Credit.{" "}
          <Link to="/privacy">Privacy & data governance</Link>
        </span>
      </label>
      <Button type="submit" variant="earth">
        Prepare enquiry
        <ArrowUpRight />
      </Button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {draft && (
        <div className="enquiry-feedback" role="status">
          <Check size={20} />
          <div>
            <strong>Your email draft is ready.</strong>
            <p>
              Review it in your email app and send it to the team. Nothing has been submitted yet.
            </p>
            <Button asChild variant="earth">
              <a href={draft}>
                Open email draft
                <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
const articles = [
  {
    title: "What Is Agricultural MRV?",
    category: "Agricultural MRV fundamentals",
    summary: "How observations, reporting and review support a methodology-specific claim.",
    sections: [
      {
        title: "Three distinct tasks",
        text: "Monitoring collects and assesses observations over a defined period. Reporting presents records, calculations and limitations. Verification evaluates a claim under defined criteria and a relevant method. A completed data form does not itself verify an outcome.",
      },
      {
        title: "Practice records and impact claims",
        text: "A log can report an activity. Establishing adoption may require corroboration. Quantifying benefit requires additional measurements, a defensible baseline and calculation procedures. Keep measured, estimated and verified results distinct.",
      },
      {
        title: "Review and uncertainty",
        text: "Sources differ in timing, reliability and spatial relevance. Missing observations and contradictory records need accountable review. An independent verifier may still be required by the applicable program.",
      },
    ],
    reference: "IPCC guidance on inventory methods and uncertainty",
    url: "https://www.ipcc-nggip.iges.or.jp/public/2006gl/",
  },
  {
    title: "How an Agricultural Evidence Graph Works",
    category: "Data provenance and verification",
    summary: "Trace a claim through field identity, source evidence, methods and decisions.",
    sections: [
      {
        title: "Nodes and relationships",
        text: "A field identifier connects multiple seasons. Each season connects activities and observations; claims connect relevant sources to an assessment, method version and review record. Provenance is the relationship between a result and the information used to produce it.",
      },
      {
        title: "Follow a sample claim",
        text: "For illustrative A-024, the rice-practice claim has a boundary and a self-reported log, but lacks the corroborating observation required by demonstration criteria v1. The graph makes that gap visible; it does not turn the claim into truth.",
      },
      {
        title: "Versions matter",
        text: "Retaining original records, transformations and method versions enables later scrutiny. A changed source or method should not erase the reasoning behind an earlier assessment.",
      },
    ],
    reference: "W3C PROV overview: provenance concepts",
    url: "https://www.w3.org/TR/prov-overview/",
  },
  {
    title: "DSR and Water Management",
    category: "Sustainable farming practices",
    summary: "Separate a rice-establishment practice from the water outcomes it might support.",
    sections: [
      {
        title: "Establishing a crop",
        text: "Direct Seeded Rice (DSR) establishes rice by sowing seed directly in the field rather than transplanting seedlings raised elsewhere. It changes crop establishment and may change field preparation, irrigation scheduling and weed management.",
      },
      {
        title: "Measure the water question",
        text: "A practice record identifies how the crop was established, not how much water was saved. Relevant monitoring may include irrigation events, metered water applied, rainfall, soil or field water conditions and crop stage.",
      },
      {
        title: "Context and comparison",
        text: "The result depends on local conditions, management and the baseline chosen. No fixed water-saving percentage is asserted here. A program needs a suitable method and measured inputs before making a quantified claim.",
      },
    ],
    reference: "IRRI Rice Knowledge Bank: rice establishment and management",
    url: "https://www.knowledgebank.irri.org/",
  },
  {
    title: "Satellite Data in Agriculture",
    category: "Satellite and geospatial intelligence",
    summary: "Understand coverage, crop stage and spatial limitations before interpreting imagery.",
    sections: [
      {
        title: "An observation at a time and scale",
        text: "Spatial resolution determines what an image can distinguish. Observation frequency and usable acquisition dates determine which parts of the season can be assessed. Field alignment and crop stage affect interpretation.",
      },
      {
        title: "Indicators are not direct proof",
        text: "Vegetation and land-surface indicators can help characterize conditions or changes. Cloud cover, mixed pixels near boundaries, small parcels and gaps between images limit conclusions. Similar signals can have different explanations.",
      },
      {
        title: "Use alongside other evidence",
        text: "Imagery needs documented dates, dataset and processing. Combine it with suitable field observations or instruments when a claim requires corroboration; do not imply a satellite image independently establishes every practice.",
      },
    ],
    reference: "Copernicus Sentinel-2 mission and observation characteristics",
    url: "https://sentiwiki.copernicus.eu/web/s2-mission",
  },
  {
    title: "Measuring Agricultural Water Savings",
    category: "Water and irrigation measurement",
    summary: "Distinguish water applied, consumption, water levels and modeled requirements.",
    sections: [
      {
        title: "Define the quantity",
        text: "Water applied is delivered to a field. Water consumption and crop water requirements are different quantities. A water-level observation describes a state, not necessarily a volume. Units, spatial boundary and reporting period must be specified.",
      },
      {
        title: "Choose suitable measurements",
        text: "Meters or calibrated pumping measurements can support applied-water totals where appropriate. Environmental observations and models answer different questions and retain their own uncertainty. Missing observations cannot silently become zero water use.",
      },
      {
        title: "A defensible baseline",
        text: "A savings calculation compares the same defined quantity under a suitable baseline and assessment method. Rainfall, crop stage and management differences must be considered. An observed practice change alone is insufficient.",
      },
    ],
    reference: "FAO-56: crop evapotranspiration and water requirements",
    url: "https://www.fao.org/4/x0490e/x0490e00.htm",
  },
  {
    title: "From Practice Adoption to Environmental Impact",
    category: "Carbon and environmental accounting",
    summary: "Why documenting an activity is only the beginning of an outcome assessment.",
    sections: [
      {
        title: "Two separate questions",
        text: "Was the practice implemented? What environmental effect followed? The evidence for the first question may not answer the second. An activity log is not a measured water saving, yield change or greenhouse gas reduction.",
      },
      {
        title: "Additional requirements",
        text: "Outcome assessment needs a defined boundary, suitable baseline, relevant data and an applicable calculation method. Method versions, assumptions and exclusions should accompany any estimate.",
      },
      {
        title: "Publish the interpretation boundaries",
        text: "Uncertainty, missing data and environmental variability limit attribution. Evidence preparation does not itself grant a certification or issue a carbon credit. Independent review may be required under the applicable program.",
      },
    ],
    reference: "IPCC agriculture, forestry and land-use guidance",
    url: "https://www.ipcc-nggip.iges.or.jp/public/2006gl/vol4.html",
  },
  {
    title: "Designing Auditable Agricultural Data Systems",
    category: "Data provenance and verification",
    summary: "Source context, access permissions and reproducible decision histories.",
    sections: [
      {
        title: "Keep the original context",
        text: "Source identity, collection time, field association and method make records interpretable. Transformations should retain references to their inputs; a summary should not replace the underlying evidence.",
      },
      {
        title: "Preserve versions and decisions",
        text: "Method versions and material changes matter for reproducibility. A useful audit event records the action, responsible actor, time and decision rationale. Historical reasoning should remain inspectable after corrections.",
      },
      {
        title: "Permission is part of auditability",
        text: "Access should match purpose and responsibility. Consent for collection is not automatic permission for publication. The capabilities described are design principles, not a claim of external security certification.",
      },
    ],
    reference: "W3C PROV overview: interoperable provenance",
    url: "https://www.w3.org/TR/prov-overview/",
  },
  {
    title: "Agricultural MRV and Crop Insurance",
    category: "Crop insurance and risk evidence",
    summary: "Evidence preparation can support review without replacing policy decisions.",
    sections: [
      {
        title: "Build an event timeline",
        text: "Dated photographs, field observations, inspections, weather context and authorized records can help organize evidence about a crop event. Field and season associations make the documentation easier to inspect.",
      },
      {
        title: "Identify gaps and discrepancies",
        text: "Conflicting dates, ambiguous photographs and incomplete coverage should be visible. Geospatial information provides context but does not by itself determine the cause or extent of an insured loss.",
      },
      {
        title: "Keep roles distinct",
        text: "Policy terms, insurer decisions and formal loss adjustment remain outside an evidence-management system’s authority. Outputs support case preparation, not guaranteed claim acceptance.",
      },
    ],
    reference: "FAO: agricultural insurance context and risk management",
    url: "https://www.fao.org/4/y0506e/y0506e00.htm",
  },
];
const categories = [
  "All topics",
  ...new Set(articles.map((a) => a.category)),
  "Research and field-program updates",
];
export function ResearchLibrary() {
  const [category, setCategory] = useState("All topics");
  const [open, setOpen] = useState<string | null>(null);
  const shown = articles.filter((a) => category === "All topics" || a.category === category);
  return (
    <section className="earth-container earth-section">
      <div className="earth-research-filter">
        <label>
          Topic
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setOpen(null);
            }}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <p className="earth-disclosure">
          Editorial explainers · draft for review · publication dates and named authors pending
          approval. External references are not partnerships or The Carbon Credit findings.
        </p>
      </div>
      <div className="earth-insights">
        {shown.map((a) => (
          <article key={a.title}>
            <span className="earth-label">{a.category} / EDITORIAL DRAFT</span>
            <h2>{a.title}</h2>
            <p>{a.summary}</p>
            <Button
              variant="link"
              aria-expanded={open === a.title}
              onClick={() => setOpen(open === a.title ? null : a.title)}
            >
              {open === a.title ? "Close explainer" : "Read explainer"}
              {open === a.title ? <Minus /> : <Plus />}
            </Button>
            {open === a.title && (
              <div className="insight-body">
                {a.sections.map((s) => (
                  <div className="earth-article-section" key={s.title}>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                ))}
                <h3>Reference & interpretation boundaries</h3>
                <p>
                  <a className="earth-reference" href={a.url} target="_blank" rel="noreferrer">
                    {a.reference}
                    <ArrowUpRight size={14} />
                  </a>
                </p>
                <p>
                  General explanatory context, not a study by The Carbon Credit, operational
                  validation or program-specific methodology. Specific claims require appropriate
                  evidence and review.
                </p>
                <div className="earth-cta-links">
                  <TextLink to="/agricultural-mrv">Agricultural MRV</TextLink>
                  <TextLink to="/platform">Explore the platform</TextLink>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
      {shown.length === 0 && (
        <div className="earth-capability-note">
          <h3>No approved field-program publications yet.</h3>
          <p>
            Research results and program updates will be added with a responsible owner, reporting
            period, evidence references and publication approval.
          </p>
          <TextLink to="/field-programs">Field program publication status</TextLink>
        </div>
      )}
    </section>
  );
}
