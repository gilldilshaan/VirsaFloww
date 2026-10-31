import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUpRight,
  Database,
  GitBranch,
  MapPinned,
  ScanLine,
  ShieldCheck,
  Sprout,
  Droplets,
  Leaf,
  Cloud,
  Umbrella,
  ChartNoAxesCombined,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell, SectionHeading, TextLink, FinalCTA } from "./site-shell";
import { EvidenceGraph, LandscapeAnnotations } from "./evidence-visual";
import { audiences, solutions, trustPrinciples } from "@/lib/earth/content";
import { DetailSections } from "./detail-sections";
import { platformCapabilities } from "@/lib/earth/page-details";
import riceAerial from "@/assets/rice-aerial.jpg";
import harvestStory from "@/assets/field-story/woman-harvesting-rice.webp";
import riceTeamStory from "@/assets/field-story/rice-field-team.webp";
import harvestLandscapeStory from "@/assets/field-story/haybales-team.webp";
import seasonalWorkStory from "@/assets/field-story/farmer-walking-field.webp";
import evidenceTrailPhoto from "@/assets/application-stories/evidence-trail.webp";
import satellitePhoto from "@/assets/home-visuals/satellite-mosaic.webp";
import programsBackground from "@/assets/home-visuals/programs-background.webp";
import trustBackground from "@/assets/home-visuals/trust-background.webp";
import contactBackground from "@/assets/home-visuals/contact-background.webp";
import { DsrEducation, HomeMRVExperience } from "./home-experience";
import { FieldPerspective } from "./field-perspective";
import { SatelliteIntelligenceDiagram } from "./visual-diagrams";
import { HomeCarbonLifecycleStory, HomeFarmerMarketStory } from "./home-process-stories";

const solutionIcons = [Sprout, Droplets, Leaf, Cloud, Umbrella, ChartNoAxesCombined];

export function HomePage() {
  return (
    <SiteShell home>
      <section className="earth-hero">
        <img
          src={riceAerial}
          alt="Illustrative aerial view across rice fields and irrigation channels"
          width={1920}
          height={1024}
          fetchPriority="high"
          className="earth-hero-image"
        />
        <LandscapeAnnotations />
        <div className="earth-container earth-hero-copy">
          <span className="earth-label">
            <span className="evidence-dot" /> AGRICULTURAL CARBON · PUNJAB, INDIA
          </span>
          <h1>
            Turn better farming practices into <em>measurable climate impact.</em>
          </h1>
          <p>
            The Carbon Credit connects field activity, geospatial observations and rigorous MRV
            workflows to help build credible agricultural carbon projects.
          </p>
          <div className="earth-hero-actions">
            <Button asChild variant="earth">
              <Link to="/platform">
                Explore our approach <ArrowUpRight />
              </Link>
            </Button>
            <Button asChild variant="glass">
              <Link to="/partners">
                Partner with us <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
        <div className="earth-hero-bottom earth-container">
          <span>
            <ScanLine size={14} /> MAKING AGRICULTURAL CLIMATE IMPACT MEASURABLE
          </span>
          <span>ILLUSTRATIVE FIELD VIEW</span>
          <a href="#evidence-challenge" aria-label="Explore why agricultural carbon needs evidence">
            <ArrowDown size={18} />
          </a>
        </div>
      </section>

      <div className="earth-source-strip">
        <span className="earth-label">A CONNECTED EVIDENCE TRAIL</span>
        <div className="earth-source-window">
          <div className="earth-source-track">
            {[0, 1].map((copy) => (
              <div
                className="earth-source-group"
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {[
                  "Field boundaries",
                  "Farm records",
                  "Satellite observations",
                  "Methodology",
                  "Human review",
                ].map((source) => (
                  <span key={source}>
                    <span className="source-marker" />
                    {source}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="evidence-challenge" className="earth-section earth-container">
        <SectionHeading
          label="WHY EVIDENCE MATTERS"
          title="A practice is only the start of a carbon project."
          description="A credible project needs more than an activity claim. Its scope, baseline, method, calculations and review must connect back to suitable evidence."
        />
        <div className="earth-three-grid">
          {[
            {
              Icon: MapPinned,
              title: "Define the project",
              description:
                "Establish participating farms, field boundaries, eligible land and the project’s scope.",
            },
            {
              Icon: Database,
              title: "Document the season",
              description:
                "Connect consent, farming activities, dates, field observations and source records.",
            },
            {
              Icon: GitBranch,
              title: "Trace every claim",
              description:
                "Keep methodology versions, assumptions, calculations and review decisions together.",
            },
          ].map(({ Icon, title, description }, index) => (
            <article className="earth-challenge" key={title}>
              <span className="challenge-top">
                <Icon size={23} />
                <span>0{index + 1}</span>
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <p className="earth-evidence-consequence">
          Not every claimed tonne becomes an issued credit. Evidence collection, estimated
          reductions, independent verification, issuance and sale are separate stages.
        </p>
        <TextLink to="/agricultural-mrv">
          Understand monitoring, reporting and verification
        </TextLink>
      </section>

      <section id="evidence-connection" className="earth-graph-section">
        <div className="earth-container">
          <div className="earth-two-grid">
            <div>
              <span className="earth-label">THE EVIDENCE CONNECTION</span>
              <h2>
                Every result has a trail.
                <br />
                <em>Make it visible.</em>
              </h2>
              <p>
                The illustrative evidence graph connects a field, season and activity to its source
                records, assessment status and reviewer decision.
              </p>
              <p>
                Collected evidence, assessed findings and work awaiting independent review remain
                distinct.
              </p>
              <TextLink to="/platform">Explore the evidence model</TextLink>
            </div>
            <EvidenceGraph />
          </div>
          <figure className="home-evidence-trail">
            <img
              src={evidenceTrailPhoto}
              alt="A field observer connects a paper field log and parcel sketch with a phone photograph beside rice plots."
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>AI-GENERATED ILLUSTRATION · FIELD RECORDS</span>
              No real farmer record, field identifier or assessment is shown.
            </figcaption>
          </figure>
        </div>
      </section>

      <HomeMRVExperience />
      <DsrEducation />
      <FieldPerspective />
      <section
        className="earth-container home-gallery"
        aria-label="Agricultural work across a season"
      >
        {[
          [
            harvestStory,
            "Harvest",
            "A farmer gathers rice seedlings at the edge of a paddy.",
            "A farmer carrying a bundle of rice seedlings in a green field.",
          ],
          [
            riceTeamStory,
            "Field context",
            "Working across a patchwork of rice plots.",
            "Farm workers across a wide landscape of rice paddies.",
          ],
          [
            harvestLandscapeStory,
            "Harvest landscape",
            "Fields and stored crop residue after harvest.",
            "A broad agricultural landscape with small haystacks across the field.",
          ],
          [
            seasonalWorkStory,
            "Seasonal practice",
            "A field worker moves between crop rows.",
            "A farmer carrying a tool through green rice rows.",
          ],
        ].map(([src, title, caption, alt], index) => (
          <figure key={src} className={`g${index}`}>
            <img src={src} alt={alt} width={1200} height={900} loading="lazy" decoding="async" />
            <figcaption>
              <b>{title}</b>
              <span>{caption}</span>
            </figcaption>
          </figure>
        ))}
      </section>
      <section className="earth-section earth-satellite-story">
        <div className="earth-container">
          <SectionHeading
            label="SATELLITE INTELLIGENCE"
            title="Observe the season. Keep the field record in view."
            description="Satellite observations can add spatial and seasonal context when coverage, timing and image quality are suitable. They remain one source among several."
          />
          <SatelliteIntelligenceDiagram photo={satellitePhoto} />
        </div>
      </section>

      <section className="earth-section earth-container">
        <SectionHeading
          label="OUR APPROACH"
          title="A project workflow built around evidence."
          description="Each stage has a purpose, required sources and a clear boundary on what its findings can support."
        />
        <div className="earth-workflow">
          {[
            ["Scope", "Define the participating farms, fields, season and project requirements."],
            [
              "Collect",
              "Record consent, activities and field observations with their source and date.",
            ],
            [
              "Observe",
              "Use suitable geospatial data as supporting context, with quality limitations.",
            ],
            [
              "Quantify",
              "Apply the relevant baseline and methodology, retaining assumptions and uncertainty.",
            ],
            [
              "Review",
              "Prepare traceable records for quality checks and independent assessment where required.",
            ],
          ].map(([title, description], i) => (
            <article key={title}>
              <span className="earth-step-number">
                0{i + 1}
                <ArrowUpRight size={16} />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <HomeCarbonLifecycleStory />
        <TextLink to="/how-it-works">See the project workflow</TextLink>
      </section>

      <DetailSections sections={platformCapabilities} label="THE CARBON CREDIT PLATFORM" />
      <section className="earth-section earth-programs-photo">
        <img
          className="earth-programs-background"
          src={programsBackground}
          alt=""
          aria-hidden="true"
          width={1920}
          height={840}
          loading="lazy"
          decoding="async"
        />
        <div className="earth-programs-shade" aria-hidden="true" />
        <div className="earth-container">
          <SectionHeading
            label="AGRICULTURAL PROGRAMS"
            title="Start with local context. Build for credible scale."
            description="Programs define their own geography, crop, practices, methodology and evidence requirements. The current public focus is Direct Seeded Rice and agricultural carbon projects in Punjab."
          />
          <div className="earth-solutions-grid">
            {solutions.slice(0, 3).map((item, i) => {
              const Icon = solutionIcons[i] ?? Sprout;
              return (
                <Link to="/solutions" key={item.id} className="earth-solution-card">
                  <Icon size={25} />
                  <span className="earth-label">{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <ArrowUpRight className="solution-arrow" size={19} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="earth-section earth-container">
        <SectionHeading
          label="WHO WE WORK WITH"
          title="A shared evidence language for every partner."
          description="Farmers and institutions bring different knowledge and responsibilities to an agricultural carbon project."
        />
        <div className="earth-audience-grid">
          {audiences.map(([title, description], i) => (
            <article key={title}>
              <span className="earth-label">0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
        <HomeFarmerMarketStory />
      </section>

      <section className="earth-trust earth-trust-photo">
        <img
          className="earth-trust-background"
          src={trustBackground}
          alt=""
          aria-hidden="true"
          width={1920}
          height={840}
          loading="lazy"
          decoding="async"
        />
        <div className="earth-trust-shade" aria-hidden="true" />
        <div className="earth-container">
          <SectionHeading
            label="CREDIBILITY BY DESIGN"
            title="Clear methods. Traceable records. Accountable review."
            description="AI can support analysis. Applicable rules check requirements. People review exceptions and make accountable decisions."
          />
          <div className="earth-trust-grid">
            {trustPrinciples.map(([title, description]) => (
              <article key={title}>
                <ShieldCheck size={21} />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <TextLink to="/methodology">Our approach to methodology</TextLink>
        </div>
      </section>

      <section className="earth-section earth-container">
        <div className="earth-program-preview">
          <div>
            <span className="earth-label">FIELD PROGRAMS & CASE STUDIES</span>
            <h2>Evidence before outcomes.</h2>
            <p>
              No project results or credit issuance are presented as established facts. We’ll
              publish program outcomes only with a defined scope, supporting records and approval.
            </p>
            <TextLink to="/field-programs">Explore program context</TextLink>
          </div>
          <div className="program-concept">
            <span className="earth-label">WHAT A PROJECT RECORD NEEDS</span>
            {[
              "Geography, crop & season",
              "Practice, baseline & method",
              "Evidence sources & quality",
              "Assessment status & limitations",
            ].map((label, i) => (
              <div key={label}>
                <span>0{i + 1}</span>
                {label}
                <ArrowUpRight size={15} />
              </div>
            ))}
            <small>Illustrative project framework · no deployment or results implied.</small>
          </div>
        </div>
      </section>
      <FinalCTA image={contactBackground} imageAlt="" showBrand />
    </SiteShell>
  );
}
