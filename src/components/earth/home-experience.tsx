import { useState } from "react";
import {
  ArrowDownRight,
  Check,
  CircleDashed,
  ClipboardCheck,
  FileText,
  MapPinned,
  Satellite,
  Sprout,
  Waves,
} from "lucide-react";
import { SectionHeading } from "./site-shell";
import { DsrEstablishmentDiagram } from "./visual-diagrams";
import directSeedingPhoto from "@/assets/home-visuals/dsr-direct-seeding.webp";
import transplantingPhoto from "@/assets/home-visuals/dsr-transplanting.webp";

const stages = [
  {
    title: "Identify the project",
    Icon: MapPinned,
    evidence: "Farm and participant scope, field boundaries, crop season and eligibility criteria.",
    establishes: "Which fields and participants are in scope.",
    limitation: "A mapped boundary does not establish eligibility or additionality.",
  },
  {
    title: "Collect field evidence",
    Icon: ClipboardCheck,
    evidence: "Consent, dated activity logs, field observations, photos and supporting records.",
    establishes: "What was reported or observed, by whom and when.",
    limitation: "A self-reported activity is not independent corroboration.",
  },
  {
    title: "Review satellite context",
    Icon: Satellite,
    evidence:
      "Available imagery dates, field geometry, cloud and quality flags, and relevant observations.",
    establishes: "Spatial and seasonal context where imagery is suitable.",
    limitation: "Vegetation indices do not directly measure emissions or prove a practice.",
  },
  {
    title: "Quantify under a method",
    Icon: Waves,
    evidence:
      "Applicable methodology, baseline, activity data, emission factors, assumptions and uncertainty.",
    establishes: "A documented estimate for the defined scope and period.",
    limitation: "An estimate is not a verified reduction or a credit.",
  },
  {
    title: "Independent review",
    Icon: Check,
    evidence: "Traceable monitoring records, calculations, exceptions and reviewer findings.",
    establishes: "Whether the submitted claim meets the selected programme criteria.",
    limitation: "Verification remains a separate decision by an independent body where required.",
  },
  {
    title: "Market participation",
    Icon: FileText,
    evidence: "Programme and registry submissions, issuance records and agreed commercial terms.",
    establishes: "The steps a project may take after applicable requirements are met.",
    limitation: "Issuance and sale are separate; neither is guaranteed by documentation.",
  },
];

const seasons = [
  [
    "Before sowing",
    "Confirm field boundaries, season, consent and the project’s evidence requirements.",
  ],
  ["Establishment", "Record sowing date and method, field preparation and relevant observations."],
  [
    "Crop growth",
    "Log irrigation and water management where the selected methodology requires them.",
  ],
  [
    "Harvest & review",
    "Close the seasonal record, resolve gaps and retain calculations with their assumptions.",
  ],
];

export function HomeMRVExperience() {
  const [active, setActive] = useState(0);
  const step = stages[active]!;
  const Icon = step.Icon;
  return (
    <section className="earth-section earth-container home-mrv" id="our-approach">
      <SectionHeading
        label="A SIX-STAGE MRV WORKFLOW"
        title="Follow the evidence from field to market."
        description="Select a stage to see what it can establish, which records support it and where its limits begin."
      />
      <div className="home-mrv-layout">
        <div className="home-mrv-steps" role="tablist" aria-label="Agricultural MRV stages">
          {stages.map(({ title }, index) => (
            <button
              key={title}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-controls="home-mrv-detail"
              id={`home-mrv-tab-${index}`}
              onClick={() => setActive(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <ArrowDownRight size={16} />
            </button>
          ))}
        </div>
        <article
          className="home-mrv-detail"
          id="home-mrv-detail"
          role="tabpanel"
          aria-labelledby={`home-mrv-tab-${active}`}
          key={active}
        >
          <div className="home-mrv-detail-head">
            <span className="home-mrv-icon">
              <Icon size={22} />
            </span>
            <span className="earth-label">STAGE {String(active + 1).padStart(2, "0")} / 06</span>
          </div>
          <h3>{step.title}</h3>
          <dl>
            <div>
              <dt>Evidence involved</dt>
              <dd>{step.evidence}</dd>
            </div>
            <div>
              <dt>What it establishes</dt>
              <dd>{step.establishes}</dd>
            </div>
            <div className="home-mrv-limit">
              <dt>What it does not</dt>
              <dd>{step.limitation}</dd>
            </div>
          </dl>
          <div className="home-mrv-progress" aria-label={`Stage ${active + 1} of 6`}>
            <span style={{ width: `${((active + 1) / stages.length) * 100}%` }} />
          </div>
        </article>
      </div>
      <p className="home-mrv-footnote">
        <CircleDashed size={15} /> Evidence collection, emission estimates, independent
        verification, credit issuance and credit sales are distinct steps.
      </p>
    </section>
  );
}

export function DsrEducation() {
  const [method, setMethod] = useState<"transplanting" | "direct">("direct");
  const direct = method === "direct";
  const activeTabId = direct ? "dsr-tab-direct" : "dsr-tab-transplanting";
  return (
    <section className="home-dsr-section" id="dsr">
      <div className="earth-container home-dsr-layout">
        <header className="home-dsr-header">
          <div className="home-dsr-title">
            <span className="earth-label">PUNJAB · DIRECT SEEDED RICE</span>
            <h2>
              One crop.
              <br />
              <em>Different beginnings.</em>
            </h2>
          </div>
          <p className="home-dsr-intro">
            Direct Seeded Rice (DSR) establishes rice by sowing seed directly in the field.
            Transplanted rice moves seedlings from a nursery into prepared fields. The establishment
            method can affect field operations, but water management remains a separate choice.
          </p>
        </header>

        <div className="home-dsr-practice">
          <div className="home-dsr-copy">
            <div className="dsr-method-heading">
              <span className="earth-label">COMPARE ESTABLISHMENT</span>
              <p>Choose a method to see what changes in the field.</p>
            </div>
            <div
              className="dsr-method-tabs"
              role="tablist"
              aria-label="Compare rice establishment methods"
            >
              <button
                id="dsr-tab-transplanting"
                type="button"
                role="tab"
                aria-selected={!direct}
                aria-controls="dsr-method-panel"
                onClick={() => setMethod("transplanting")}
              >
                Transplanting
              </button>
              <button
                id="dsr-tab-direct"
                type="button"
                role="tab"
                aria-selected={direct}
                aria-controls="dsr-method-panel"
                onClick={() => setMethod("direct")}
              >
                Direct seeding
              </button>
            </div>
            <div
              className="dsr-method-detail"
              id="dsr-method-panel"
              role="tabpanel"
              aria-labelledby={activeTabId}
              key={method}
            >
              <strong>
                {direct
                  ? "Seed is placed directly in the field."
                  : "Seedlings are raised, then transplanted."}
              </strong>
              <p>
                {direct
                  ? "This changes crop establishment. Irrigation schedules and field conditions still vary, so DSR alone does not define how long soil stays flooded."
                  : "Transplanting commonly involves puddling and moving nursery-grown seedlings. Actual practice and water regime vary from field to field."}
              </p>
            </div>
            <div className="dsr-carbon-caveat">
              <span>CARBON CONTEXT</span>
              <p>
                Under suitable conditions, DSR can reduce methane compared with an appropriate
                baseline. Results depend on water and crop management, field conditions and the
                applicable methodology. DSR does not automatically produce carbon credits.
              </p>
            </div>
            <a
              className="dsr-source"
              href="https://dsrc.irri.org/our-work/issues-opportunities"
              target="_blank"
              rel="noreferrer"
            >
              Read IRRI’s Direct Seeded Rice Consortium notes <span>↗</span>
            </a>
          </div>
          <figure className="dsr-practice-photo" key={method}>
            <img
              src={direct ? directSeedingPhoto : transplantingPhoto}
              alt={
                direct
                  ? "Illustrative tractor-mounted seed drill sowing rice directly into prepared field rows."
                  : "Illustrative Punjab farmers transplanting nursery-raised rice seedlings into a shallow paddy."
              }
              width={1536}
              height={1024}
              loading="lazy"
              decoding="async"
            />
            <span className="dsr-photo-index">FIELD PRACTICE / 0{direct ? "2" : "1"}</span>
            <figcaption>
              <span>{direct ? "DIRECT SEEDING" : "TRANSPLANTING"}</span>
              <small>AI-generated illustrative field scene</small>
            </figcaption>
          </figure>
        </div>

        <div className="home-dsr-schematic">
          <DsrEstablishmentDiagram />
        </div>

        <section className="dsr-season" aria-labelledby="dsr-season-title">
          <div className="dsr-season-head">
            <div>
              <span className="earth-label">EVIDENCE THROUGH A SEASON</span>
              <h3 id="dsr-season-title">Keep each field’s season connected.</h3>
            </div>
            <Sprout size={22} aria-hidden="true" />
          </div>
          <ol>
            {seasons.map(([title, text], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="dsr-season-note">
            The required records depend on the chosen programme and methodology.
          </p>
        </section>

        <div className="home-dsr-faq">
          <div>
            <span className="earth-label">COMMON QUESTIONS</span>
            <h3>Carbon projects, in plain terms.</h3>
          </div>
          <div className="home-faq-list">
            <details>
              <summary>Does adopting DSR guarantee carbon credits?</summary>
              <p>
                No. Eligibility and any potential outcome depend on the project boundary, baseline,
                applicable methodology, field evidence and independent review. DSR adoption alone is
                not enough.
              </p>
            </details>
            <details>
              <summary>How is a potential credit quantity estimated?</summary>
              <p>
                A project applies the relevant methodology to its defined baseline, activity data
                and assumptions, including uncertainty and deductions. The result is an estimate,
                not a verified reduction or issued credit.
              </p>
            </details>
            <details>
              <summary>Who verifies an agricultural carbon project?</summary>
              <p>
                An independent validation or verification body assesses the project against the
                selected programme’s rules where required. A registry controls credit issuance under
                its process.
              </p>
            </details>
            <details>
              <summary>How can an FPO or partner explore a project?</summary>
              <p>
                Start with your geography, crop and season, current practices, available records and
                intended programme. VirsaFlow can discuss evidence requirements and a
                potential collaboration.
              </p>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
