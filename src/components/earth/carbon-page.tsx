import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Pause, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import carbonDsrHero from "@/assets/rice-dsr.jpg";
import awdWaterTube from "@/assets/field-story/awd-water-tube-generated.webp";
import dsrSeedDrill from "@/assets/field-story/dsr-seed-drill-generated.webp";
import riceResidueManagement from "@/assets/field-story/rice-residue-management-generated.webp";
import { AcreonBrand } from "@/components/acreon-brand";
import { SectionHeading, SiteShell, TextLink } from "./site-shell";
import { CarbonLifecycleDiagram, DsrEstablishmentDiagram, RiceSeasonSatelliteMap } from "./visual-diagrams";

const explainer = [
  {
    title: "Practice",
    short: "A field changes how it is managed",
    body: "A farmer adopts a practice such as alternate wetting and drying. On its own, this is a change in management, not yet a climate outcome.",
  },
  {
    title: "Field observations",
    short: "Dated records show what happened",
    body: "Water-level readings, photos, agent visits and satellite context build a timeline of flooding and drying for each field and season. A water tube shows water level; it does not measure methane.",
  },
  {
    title: "Baseline comparison",
    short: "What would have happened otherwise",
    body: "The project defines a baseline scenario under its methodology. The baseline cannot simply be assumed to be continuous flooding for every field.",
  },
  {
    title: "Emissions calculation",
    short: "The difference is estimated",
    body: "Approved methodology equations estimate baseline and project emissions, accounting for other gases, uncertainty and deductions. An estimate is not yet a verified reduction.",
  },
  {
    title: "Independent verification",
    short: "A third party checks the claim",
    body: "An independent validation and verification body reviews the design, monitoring and calculations. Only then can a registry issue credits: one credit usually represents one tonne of CO₂-equivalent reduced.",
  },
];

const practices = [
  {
    n: "01",
    title: "Alternate Wetting and Drying (AWD)",
    tag: "Manage flooding. Document the water regime.",
    img: awdWaterTube,
    alt: "A farmer checks a perforated water-level tube in a partly drained rice paddy.",
    caption: "AI-generated illustration · a water tube records water level, not methane.",
    text: "Fields dry partially between irrigations instead of staying flooded all season. Depending on conditions, this can shorten anaerobic periods and lower methane. A field water tube helps decide when to irrigate.",
    evidence: [
      "Field registration and crop season",
      "Dated water-level readings and photos",
      "Irrigation and drying-period records",
      "Field-agent visits",
      "Satellite context",
      "Missing or inconsistent observations",
    ],
    supports:
      "Whether the documented water practice was implemented to the project’s requirements. It does not by itself establish methane reductions.",
  },
  {
    n: "02",
    title: "Direct Seeded Rice (DSR)",
    tag: "Change establishment. Document what changes.",
    img: dsrSeedDrill,
    alt: "A tractor-mounted seed drill places rice seed into dry, prepared rows.",
    caption: "AI-generated illustration · direct seeding changes crop establishment.",
    text: "Seeds are sown directly instead of transplanting into puddled soil. DSR can change water needs and flooded duration, but it does not automatically guarantee lower methane — outcomes depend on management and methodology.",
    evidence: [
      "Field boundaries and season registration",
      "Sowing dates and establishment method",
      "Field observations of reported practice",
      "Irrigation records where required",
      "Satellite crop-development context",
      "Deviations from intended practice",
    ],
    supports:
      "A traceable record of crop establishment. Methane effects must be evaluated separately.",
  },
  {
    n: "03",
    title: "Residue and Straw Management",
    tag: "Document how organic material is handled.",
    img: riceResidueManagement,
    alt: "A tractor-mounted straw chopper spreads rice residue across a harvested field.",
    caption: "AI-generated illustration · residue handling varies by field and season.",
    text: "Straw decomposing under flooded, oxygen-limited conditions can feed methane production. Effects depend on quantity, timing, incorporation and removal — so each field’s actual practice must be recorded, not assumed.",
    evidence: [
      "Reported residue activities",
      "Field observations and photos",
      "Activity dates and season records",
      "Inspection records",
      "Missing or inconsistent documentation",
    ],
    supports:
      "Documentation of reported and observed practice. Reductions must be quantified under a methodology that covers it.",
  },
];

const evidence = [
  [
    "Field registration and consent",
    "Each field needs a reliable identity linked to its season, project and practice, plus participation and consent records. A registered field is not automatically eligible.",
  ],
  [
    "Water-management observations",
    "Water-tube readings, dated photos, irrigation logs, agent visits, sensors where available and satellite support — each with source, time and context. Gaps are flagged, not treated as compliant.",
  ],
  [
    "Remote-sensing context",
    "Satellite data helps characterise crop development and surface conditions over time. It is supporting context, not definitive proof of irrigation events or methane.",
  ],
  [
    "Baseline and project scenario",
    "Baseline conditions, project boundary, eligible fields, monitoring period, emission factors, uncertainty and deductions — all set by the selected methodology.",
  ],
  [
    "Emissions quantification",
    "The methodology’s calculation estimates the difference between baseline and project emissions. An estimated reduction is not a verified reduction or an issued credit.",
  ],
  [
    "Review and audit trail",
    "Completeness checks, anomaly flags, calculation references, documented review decisions and versioned history so a reviewer can trace any claim back to its records.",
  ],
];

const steps = [
  [
    "Enrol",
    "Identify participating farmers and eligible fields with the FPO or program partner.",
    "A defined project population with traceable field records.",
  ],
  [
    "Design",
    "Select a crediting program and methodology; define baseline, monitoring plan and responsibilities.",
    "A documented project design and monitoring framework.",
  ],
  [
    "Monitor",
    "Collect required records through the season; track missing evidence and deviations.",
    "A structured monitoring record linked to fields.",
  ],
  [
    "Quantify",
    "Apply approved calculations; document assumptions, uncertainty and deductions.",
    "A traceable emissions calculation and monitoring report.",
  ],
  [
    "Validate & verify",
    "An independent body assesses design, monitoring and reported reductions.",
    "An independent assessment under the program’s rules.",
  ],
  [
    "Issue & share",
    "Only a registry can issue credits. Benefit-sharing terms are agreed with farmers in advance.",
    "Credits issued by the registry, where requirements are met.",
  ],
];

const carbonProcessScenes = [
  {
    image: "/earth/carbon-stage-enrol.webp",
    alt: "Farmers and a field coordinator looking together at a parcel map beside rice fields.",
    note: "Field population and consent records",
  },
  {
    image: "/earth/carbon-stage-design.webp",
    alt: "A program specialist reviewing field maps and season records at a desk.",
    note: "Method, baseline and monitoring plan",
  },
  {
    image: "/earth/carbon-stage-monitor.webp",
    alt: "A field officer recording a water-level observation beside rice plants.",
    note: "Dated evidence linked to the field",
  },
  {
    image: "/earth/carbon-stage-quantify.webp",
    alt: "An analyst reviewing field records and non-legible calculation charts on a laptop.",
    note: "Assumptions, uncertainty and deductions",
  },
  {
    image: "/earth/carbon-stage-review.webp",
    alt: "A technical reviewer and local observer comparing field notes at a rice parcel.",
    note: "Independent assessment under program rules",
  },
  {
    image: "/earth/carbon-stage-share.webp",
    alt: "A farmer collective reviewing a seasonal project record in a village meeting room.",
    note: "Registry and benefit-sharing decisions remain separate",
  },
];

function CarbonProcessStoryboard({
  active,
  onSelect,
  playing,
  onToggle,
}: {
  active: number;
  onSelect: (index: number) => void;
  playing: boolean;
  onToggle: () => void;
}) {
  const scene = carbonProcessScenes[active]!;
  const step = steps[active]!;
  return (
    <aside className="carbon-process-storyboard" aria-label="Illustrative project process image sequence">
      <div className="carbon-process-photo" key={scene.image}>
        <img src={scene.image} alt={scene.alt} loading="lazy" decoding="async" />
        <div className="carbon-process-photo-shade" />
        <span className="carbon-process-photo-label">PROJECT PATHWAY · ILLUSTRATIVE SCENE</span>
        <div className="carbon-process-photo-copy" aria-live="polite">
          <span>STAGE 0{active + 1} / 06</span>
          <h3>{step[0]}</h3>
          <p>{scene.note}</p>
        </div>
        <div className="carbon-process-photo-controls">
          <button type="button" aria-label="Previous process stage" onClick={() => onSelect((active + steps.length - 1) % steps.length)}>
            <ArrowLeft size={16} />
          </button>
          <button type="button" aria-label={playing ? "Pause process sequence" : "Play process sequence"} aria-pressed={playing} onClick={onToggle}>
            {playing ? <Pause size={15} /> : <Play size={15} />}
          </button>
          <button type="button" aria-label="Next process stage" onClick={() => onSelect((active + 1) % steps.length)}>
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="carbon-process-progress" role="group" aria-label="Choose a project stage">
          {steps.map(([title], index) => (
            <button
              key={title}
              type="button"
              className={active === index ? "is-active" : ""}
              aria-label={`Show stage ${index + 1}: ${title}`}
              aria-pressed={active === index}
              onClick={() => onSelect(index)}
            />
          ))}
        </div>
        <span className="carbon-process-ai-note">AI-generated illustrative scene · not a documented project</span>
      </div>
      <div className="carbon-process-scene-caption">
        <b>{step[0]}</b>
        <span>{step[2]}</span>
      </div>
    </aside>
  );
}

function MethaneExplainer() {
  const [active, setActive] = useState(0);
  const step = explainer[active]!;
  return (
    <section className="earth-section earth-container">
      <SectionHeading
        label="DSR & RICE METHANE, EXPLAINED"
        title="From a change in the field to a credit."
        description="Evidence that a practice changed does not, by itself, prove a quantity of methane was avoided. Every stage matters."
      />
      <div className="methane-soil" aria-label="How water affects methane in rice soils">
        <div className="methane-soil-panel flooded">
          <span className="earth-label">CONTINUOUS FLOODING</span>
          <div className="soil-scene">
            <div className="water-layer" />
            <div className="soil-layer">
              {Array.from({ length: 9 }, (_, i) => (
                <i
                  key={i}
                  className="bubble"
                  style={{ left: `${8 + i * 10}%`, animationDelay: `${i * 0.45}s` }}
                />
              ))}
            </div>
          </div>
          <p>
            Water seals the soil. Oxygen runs out and microbes break down organic matter into
            methane, which escapes through water and plants.
          </p>
        </div>
        <div className="methane-soil-panel drying">
          <span className="earth-label">DRYING PERIOD</span>
          <div className="soil-scene">
            <div className="water-layer low" />
            <div className="soil-layer cracked">
              {Array.from({ length: 3 }, (_, i) => (
                <i
                  key={i}
                  className="bubble"
                  style={{ left: `${20 + i * 28}%`, animationDelay: `${i * 1.1}s` }}
                />
              ))}
            </div>
          </div>
          <p>
            Partial drying lets oxygen back into the soil, which can interrupt methane-producing
            conditions — depending on soil, climate and management.
          </p>
        </div>
      </div>
      <p className="methane-caption">
        Schematic illustration · not to scale and not measured data.
      </p>
      <div className="methane-stepper" role="tablist" aria-label="Methane credit stages">
        {explainer.map((s, i) => (
          <button
            key={s.title}
            role="tab"
            aria-selected={i === active}
            className={i === active ? "active" : ""}
            onClick={() => setActive(i)}
          >
            <span>0{i + 1}</span>
            <strong>{s.title}</strong>
            <small>{s.short}</small>
          </button>
        ))}
      </div>
      <div className="methane-step-detail" role="tabpanel" key={active}>
        <span className="earth-label">STAGE 0{active + 1} OF 05</span>
        <h3>{step.title}</h3>
        <p>{step.body}</p>
        {active === 3 && (
          <div className="methane-bars" aria-label="Illustrative quantification steps">
            <div>
              <span>Baseline scenario</span>
              <small>Defined by the applicable methodology</small>
            </div>
            <div>
              <span>Project scenario</span>
              <small>Estimated from field data and assumptions</small>
            </div>
            <div className="diff">
              <span>Difference</span>
              <small>Assessed with uncertainty and deductions</small>
            </div>
          </div>
        )}
        <div className="methane-step-nav">
          <Button variant="ghost" disabled={active === 0} onClick={() => setActive(active - 1)}>
            Previous
          </Button>
          <Button
            variant="earth"
            disabled={active === explainer.length - 1}
            onClick={() => setActive(active + 1)}
          >
            Next stage <ArrowUpRight />
          </Button>
        </div>
      </div>
    </section>
  );
}

export function CarbonCreditsPage() {
  const [activeProcessStage, setActiveProcessStage] = useState(0);
  const [processPlaying, setProcessPlaying] = useState(true);

  useEffect(() => {
    if (!processPlaying || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveProcessStage((current) => (current + 1) % steps.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [processPlaying]);

  return (
    <SiteShell>
      <main id="main-content" className="earth-carbon-page">
        <section className="carbon-hero">
          <img
            className="carbon-hero-image earth-hero-image"
            src={carbonDsrHero}
            alt="Young rice plants growing in distinct rows across a direct-seeded field"
            width={1920}
            height={912}
          />
          <div className="carbon-hero-scrim" />
          <div className="earth-container carbon-hero-copy earth-hero-copy">
            <span className="earth-label">DIRECT SEEDED RICE · PUNJAB PROJECT FOCUS</span>
            <h1>
              Build agricultural carbon projects on <em>field-level evidence.</em>
            </h1>
            <p>
              Flooded rice fields can release methane as microorganisms break down organic matter in
              oxygen-depleted soils. The Carbon Credit connects farming practices, field records and
              geospatial observations through methodology-specific MRV workflows. Our initial
              agricultural project focus is Direct Seeded Rice in Punjab.
            </p>
            <div className="carbon-hero-actions">
              <Button asChild variant="earth">
                <a href="#methane-explainer">
                  Explore the evidence workflow <ArrowUpRight />
                </a>
              </Button>
              <Button asChild variant="ghost" className="carbon-ghost">
                <Link to="/contact">
                  Discuss a rice MRV pilot <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </div>
          <span className="carbon-hero-note">Illustrative direct-seeded crop rows · no project data</span>
        </section>

        <section className="earth-section earth-container earth-carbon-hero">
          <div className="earth-carbon-why">
            <span className="earth-label">WHY RICE METHANE MATTERS</span>
            <h2>Water management can change the emissions profile.</h2>
            <p>
              When fields stay flooded, soil oxygen falls and microbes produce methane, which
              escapes through the soil and rice plants. Interrupting continuous flooding can reduce
              emissions under suitable conditions.
            </p>
            <p>
              But adopting a practice is only the first step. A credible claim documents what
              happened, defines what would have happened otherwise, and quantifies the difference
              under an applicable methodology.
            </p>
            <p className="carbon-role">
              The Carbon Credit’s role: connect those records into an evidence trail that can be
              assessed and independently reviewed.
            </p>
          </div>
          <figure className="carbon-methane-photo">
            <img
              src="/earth/carbon-methane-field.webp"
              alt="Rice plants growing in a waterlogged field beside an irrigation channel."
              loading="lazy"
              decoding="async"
            />
            <figcaption>Illustrative rice-field conditions · no methane measurement shown</figcaption>
            <span className="carbon-methane-photo-tag">WATER REGIME · FIELD CONTEXT</span>
          </figure>
        </section>

        <div id="methane-explainer">
          <MethaneExplainer />
        </div>

        <section className="earth-section earth-sage">
          <div className="earth-container">
            <SectionHeading
              label="CROP ESTABLISHMENT & WATER"
              title="Document the practice and its conditions separately."
              description="Direct seeding changes how rice is established; it does not define irrigation or field water conditions."
            />
            <DsrEstablishmentDiagram />
          </div>
        </section>

        <section className="earth-section earth-container">
          <SectionHeading
            label="PRACTICES WE HELP DOCUMENT"
            title="Three practices, one evidence standard."
            description="Which practices are eligible, and how they are measured, depends on the methodology a project applies."
          />
          <div className="carbon-practices">
            {practices.map((p) => (
              <article key={p.n} className="carbon-practice">
                <figure>
                  <img
                    src={p.img}
                    alt={p.alt}
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                  <span>{p.n}</span>
                  <figcaption>{p.caption}</figcaption>
                </figure>
                <div>
                  <span className="earth-step-number">{p.n}</span>
                  <h3>{p.title}</h3>
                  <strong>{p.tag}</strong>
                  <p>{p.text}</p>
                  <span className="earth-label">EVIDENCE TO ORGANISE</span>
                  <ul>
                    {p.evidence.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                  <p className="carbon-supports">
                    <b>What this supports:</b> {p.supports}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="earth-section earth-container">
          <SectionHeading
            label="THE EVIDENCE BEHIND A CARBON CREDIT"
            title="A credit is only as credible as its evidence."
            description="Projects need a defined boundary, a baseline, monitoring evidence, calculations and independent assessment. The Carbon Credit keeps gaps and assumptions visible."
          />
          <div className="earth-carbon-evidence">
            {evidence.map(([t, d], i) => (
              <article key={t}>
                <span className="earth-step-number">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="carbon-band">
          <img src="/earth/carbon-season-landscape.webp" alt="Illustrative rice landscape at the edge of a field season." loading="lazy" decoding="async" />
          <div className="carbon-band-copy earth-container">
            <span className="earth-label">FIELD BY FIELD · SEASON BY SEASON</span>
            <h2>
              Make agricultural methane claims easier to investigate, substantiate and review.
            </h2>
          </div>
        </section>

        <section id="carbon-satellite-intelligence" className="earth-section earth-sage carbon-satellite-section">
          <div className="earth-container">
            <SectionHeading
              label="SATELLITE INTELLIGENCE · SUPPORTING CONTEXT"
              title="Read the landscape across observation windows."
              description="Parcel boundaries, visible water and seasonal crop patterns can help reviewers ask better questions. Each observation still needs suitable timing, image quality and field records."
            />
            <RiceSeasonSatelliteMap />
          </div>
        </section>

        <section id="carbon-project-pathway" className="earth-section earth-container">
          <SectionHeading
            label="FROM PADDY TO CARBON REGISTRY"
            title="How a rice methane project progresses."
            description="Exact requirements depend on the selected standard, methodology, project design and registry."
          />
          <div className="carbon-process-layout">
            <ol className="carbon-timeline" aria-label="Six project stages">
              {steps.map(([title, description, output], index) => (
                <li key={title} className={activeProcessStage === index ? "is-active" : ""}>
                  <button type="button" aria-pressed={activeProcessStage === index} onClick={() => setActiveProcessStage(index)}>
                    <span>0{index + 1}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                      <small><b>Output:</b> {output}</small>
                    </div>
                  </button>
                </li>
              ))}
            </ol>
            <CarbonProcessStoryboard
              active={activeProcessStage}
              onSelect={setActiveProcessStage}
              playing={processPlaying}
              onToggle={() => setProcessPlaying((value) => !value)}
            />
          </div>
          <div className="carbon-process-discovery">
            <span className="earth-label">PROCESS DISCOVERY · KEEP EACH DECISION DISTINCT</span>
            <CarbonLifecycleDiagram />
          </div>
        </section>

        <section className="earth-section earth-container earth-carbon-honest">
          <SectionHeading label="WHAT WE DO AND DON’T CLAIM" title="Clear about our role." />
          <div className="earth-two-grid">
            <article>
              <h3>What The Carbon Credit does</h3>
              <ul className="carbon-checks">
                {[
                  "Organises field records and consent documentation",
                  "Connects field observations with geospatial information",
                  "Tracks practices and required evidence",
                  "Flags missing, inconsistent or anomalous records",
                  "Supports traceable monitoring and calculation workflows",
                  "Prepares evidence packages for independent review",
                ].map((x) => (
                  <li key={x}>
                    <Check size={16} />
                    {x}
                  </li>
                ))}
              </ul>
            </article>
            <article>
              <h3>What The Carbon Credit does not do</h3>
              <ul className="carbon-checks no">
                {[
                  "Issue or certify carbon credits",
                  "Guarantee a field or project qualifies for crediting",
                  "Guarantee reductions, credit price or revenue",
                  "Replace independent validation and verification",
                  "Treat satellite imagery or AI output as proof on its own",
                  "Claim a reduction without adequate evidence",
                ].map((x) => (
                  <li key={x}>
                    <X size={16} />
                    {x}
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <p className="earth-carbon-note">
            <b>Current status:</b> This page does not represent a specific project outcome or credit
            issuance. Estimates are illustrative and do not guarantee eligibility, issuance, price
            or revenue.
          </p>
          <TextLink to="/methodology">Read our methodology & evidence principles</TextLink>
        </section>

        <section className="earth-section earth-container carbon-traceable">
          <SectionHeading
            label="WHY EVIDENCE QUALITY MATTERS"
            title="Make every claim traceable."
            description="A monitoring record should never be confused with proof of a verified climate outcome."
          />
          <div className="carbon-questions">
            {[
              "Which fields and seasons are included?",
              "Which practices were reported, and what supports them?",
              "Which observations are missing or uncertain?",
              "Which methodology and assumptions were applied?",
              "How was the emissions estimate calculated?",
              "Which cases required human review?",
              "What did the independent assessment conclude?",
            ].map((q, i) => (
              <div key={q}>
                <span>Q{i + 1}</span>
                {q}
              </div>
            ))}
          </div>
        </section>

        <section className="earth-final carbon-final">
          <div className="earth-container carbon-final-grid">
            <div className="carbon-final-copy">
              <span className="earth-label">START WITH A CONVERSATION</span>
              <h2>Build a clearer picture of agricultural impact.</h2>
              <p>
                Talk with The Carbon Credit about a DSR program, field evidence requirements,
                research collaboration or a potential project partnership.
              </p>
              <div className="carbon-hero-actions">
                <Button asChild variant="earth">
                  <Link to="/contact" search={{ interest: "Institutional partnership" }}>
                    Partner with us <ArrowUpRight />
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/contact" search={{ interest: "Pilot program" }}>
                    Discuss a pilot <ArrowUpRight />
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to="/contact" search={{ interest: "Platform walkthrough" }}>
                    Request a walkthrough <ArrowUpRight />
                  </Link>
                </Button>
              </div>
              <small className="carbon-fineprint">
                Proposed projects depend on eligibility, methodology, data availability and independent assessment.
              </small>
            </div>
            <div className="carbon-final-brand-panel">
              <span className="earth-label">THE CARBON CREDIT · PUNJAB, INDIA</span>
              <AcreonBrand className="carbon-final-brand" />
              <p>Making agricultural climate impact measurable, verifiable and valuable.</p>
              <span className="carbon-final-rule"><i /> LAND TODAY · OPPORTUNITIES TOMORROW <i /></span>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
