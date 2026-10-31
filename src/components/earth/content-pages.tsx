import { PunjabMap } from "./punjab-map";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell, PageIntro, SectionHeading, FinalCTA, TextLink, PhotoStory } from "./site-shell";
import { EvidenceGraph, EvidenceMap } from "./evidence-visual";
import { stages, audiences, trustPrinciples } from "@/lib/earth/content";
import { DetailSections, EvidenceNextSteps } from "./detail-sections";
import { ProductDemo, WorkflowDemo } from "./product-demo";
import { SolutionDetails, ResearchLibrary, PilotEnquiry } from "./expanded-content";
import {
  CarbonLifecycleDiagram,
  DsrEstablishmentDiagram,
  EvidencePackageDiagram,
  FarmerMarketWorkflowDiagram,
  SatelliteIntelligenceDiagram,
} from "./visual-diagrams";
import programFieldPhoto from "@/assets/field-story/farmer-kneeling-rice.webp";
import researchFieldPhoto from "@/assets/field-story/aerial-field-pattern.webp";
import partnerFieldPhoto from "@/assets/field-story/women-fieldwork.webp";
import platformSatellitePhoto from "@/assets/home-visuals/satellite-platform-context.webp";
import methodologySatellitePhoto from "@/assets/home-visuals/satellite-methodology-season.webp";
export function PlatformPage() {
  return (
    <SiteShell>
      <PageIntro
        label="THE VIRSAFLOW PLATFORM"
        title="From agricultural data to traceable evidence."
        description="Connect the field, its activities and the evidence behind every assessment. Keep context intact from collection to review."
      />
      <section className="earth-container earth-platform-map">
        <EvidenceMap />
      </section>
      <section className="earth-section earth-container">
        <SectionHeading
          label="FROM INPUT TO INSIGHT"
          title="Different sources. A connected record."
        />
        <div className="earth-data-flow">
          {[
            "Data sources",
            "Evidence Graph",
            "Analysis & validation",
            "Human review",
            "Decision-ready reports",
          ].map((label, i) => (
            <div key={label}>
              <span className="earth-label">0{i + 1}</span>
              <h3>{label}</h3>
              {i < 4 && <ArrowRight size={18} />}
            </div>
          ))}
        </div>
        <div className="earth-two-grid earth-body-grid">
          <div>
            <h3>Bring the source with the data.</h3>
            <p>
              Potential inputs include satellite imagery, field observations, photos, sensors and
              farm records. Availability and suitability depend on each program. A source is linked
              to its field, season, collection time and limitations.
            </p>
          </div>
          <div>
            <h3>Keep the decision accountable.</h3>
            <p>
              AI supports analysis and anomaly detection. Predefined rules validate evidence against
              applicable criteria. Human review handles exceptions and uncertainty; AI alone does
              not establish the truth of a sustainability claim.
            </p>
          </div>
        </div>
      </section>
      <section className="earth-section earth-container">
        <SectionHeading
          label="SATELLITE CONTEXT"
          title="Link the observation to the parcel and season."
          description="Coverage, image quality and acquisition date shape what an image can support."
        />
        <SatelliteIntelligenceDiagram photo={platformSatellitePhoto} />
      </section>
      <section className="earth-graph-section">
        <div className="earth-container earth-two-grid">
          <div>
            <span className="earth-label">ILLUSTRATIVE EVIDENCE GRAPH</span>
            <h2>
              Preserve the relationships
              <br />
              behind the result.
            </h2>
            <p>
              Fields, seasons, activities and claims remain connected to their sources, confidence
              assessments and reviewer decisions.
            </p>
            <TextLink to="/methodology">Read our methodology approach</TextLink>
          </div>
          <EvidenceGraph />
        </div>
      </section>
      <section className="earth-section earth-container">
        <SectionHeading
          label="A CLEAR EVIDENCE VOCABULARY"
          title="Not all records mean the same thing."
        />
        <div className="earth-three-grid">
          {[
            [
              "Measured / estimated",
              "Instrument readings and observations are distinguished from modeled values and their assumptions.",
            ],
            [
              "Self-reported / corroborated",
              "A declaration is not the same as evidence supported by independent sources.",
            ],
            [
              "Preliminary / verified",
              "An assessment remains preliminary until the applicable review process is complete.",
            ],
          ].map(([t, p]) => (
            <article className="earth-challenge" key={t}>
              <h3>{t}</h3>
              <p>{p}</p>
            </article>
          ))}
        </div>
      </section>
      <DetailSections page="platform" />
      <ProductDemo />
      <FinalCTA />
    </SiteShell>
  );
}
export function SolutionsPage() {
  return (
    <SiteShell>
      <PageIntro
        label="SOLUTIONS"
        title="Agricultural applications. Explicit evidence requirements."
        description="Find the problem your organization needs to solve, the sources required and the limits of the resulting assessment."
      />
      <SolutionDetails />
      <section className="earth-section earth-sage">
        <div className="earth-container">
          <SectionHeading
            label="DIRECT SEEDED RICE"
            title="Show how the crop was established."
            description="A practice record describes crop establishment; it does not replace observations about the field’s water regime."
          />
          <DsrEstablishmentDiagram />
        </div>
      </section>
      <section className="earth-container earth-section">
        <SectionHeading
          label="CHOOSE THE RIGHT SOLUTION"
          title="Define the outcome before choosing the data."
        />
        <PilotEnquiry interest="Pilot program" />
      </section>
      <FinalCTA />
    </SiteShell>
  );
}
export function HowPage() {
  return (
    <SiteShell>
      <PageIntro
        label="HOW IT WORKS"
        title="A traceable path from activity to assessment."
        description="Five connected stages keep source evidence, analysis and reviewer decisions in the same context."
      />
      <section className="earth-container earth-long-workflow">
        {stages.map(([title, description], i) => (
          <article key={title}>
            <span className="earth-stage-big">0{i + 1}</span>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            <span className="earth-status">
              {
                [
                  "Field context",
                  "Source evidence",
                  "Preliminary assessment",
                  "Review decision",
                  "Traceable report",
                ][i]
              }
            </span>
          </article>
        ))}
      </section>
      <section className="earth-container earth-section">
        <CarbonLifecycleDiagram />
      </section>
      <section className="earth-section earth-sage">
        <div className="earth-container">
          <SectionHeading
            label="REVIEW IS A DECISION, NOT A DATA POINT"
            title="Uncertainty belongs in the record."
            description="Missing inputs, conflicting observations and unresolved exceptions should be visible — not hidden behind a single score."
          />
          <TextLink to="/methodology">Explore trust and methodology</TextLink>
        </div>
      </section>
      <WorkflowDemo />
      <EvidenceNextSteps />
      <FinalCTA />
    </SiteShell>
  );
}
export function PartnersPage() {
  return (
    <SiteShell>
      <PageIntro
        label="PARTNERS & ECOSYSTEM"
        title="Stronger evidence is a shared effort."
        description="We welcome conversations with organizations bringing agricultural knowledge, field access, data expertise and independent review."
      />
      <section className="earth-container earth-section earth-partners">
        <SectionHeading
          label="COLLABORATION AREAS"
          title="Different expertise. A common evidence standard."
        />
        <div className="earth-audience-grid">
          {audiences.map(([title, description]) => (
            <article key={title}>
              <Check size={20} />
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="earth-disclosure">
          These are prospective collaboration areas, not a list of existing customers or confirmed
          partners.
        </p>
      </section>
      <PhotoStory
        image={partnerFieldPhoto}
        imageAlt="Women working together among green crops in a field."
        caption="Illustrative agricultural field work; no active partner relationship is represented."
        label="WORK HAPPENS IN THE FIELD"
        title="A strong program begins with shared responsibilities."
        description="Farmers and local partners contribute authorized field context. Program teams define scope and monitoring requirements. Independent reviewers assess evidence against the selected rules. Keep each role and decision clear from the start."
        className="earth-partner-field-story"
      >
        <div className="partner-responsibility-strip" aria-label="Shared project responsibilities">
          <div><b>01</b><span>Farmers & FPOs</span><small>Consent · local context</small></div>
          <div><b>02</b><span>Program teams</span><small>Scope · collection</small></div>
          <div><b>03</b><span>Independent body</span><small>Assessment · decision</small></div>
        </div>
      </PhotoStory>
      <section className="earth-section earth-sage">
        <div className="earth-container">
          <SectionHeading
            label="A POTENTIAL PROJECT PATHWAY"
            title="Make roles and decisions visible."
            description="Participation, MRV, independent review, registry issuance and any sale happen through distinct responsibilities."
          />
          <FarmerMarketWorkflowDiagram />
        </div>
      </section>
      <section className="earth-trust">
        <div className="earth-container">
          <SectionHeading
            label="WORK TOGETHER"
            title="Start with the question your program needs to answer."
            description="Define the agricultural context, intended decision, evidence requirements and review responsibilities before choosing the data."
          />
          <div className="earth-cta-links">
            <Button asChild variant="lime">
              <Link to="/contact" search={{ interest: "Institutional partnership" }}>
                Discuss a partnership <ArrowUpRight />
              </Link>
            </Button>
            <Link to="/contact" search={{ interest: "Research collaboration" }}>
              Explore research collaboration <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <DetailSections page="partners" />
      <FinalCTA />
    </SiteShell>
  );
}
export function ProgramsPage() {
  return (
    <SiteShell>
      <PageIntro
        label="FIELD PROGRAMS & CASE STUDIES"
        title="Every program has its own context."
        description="Geography, crops, seasons and methodologies belong to a field program — not to the boundaries of the platform."
      />
      <PhotoStory
        image={programFieldPhoto}
        imageAlt="A farmer tending young rice plants in a flooded field."
        caption="Illustrative rice field work; separate from the Faridkot planning reference."
        label="FIELD CONTEXT"
        title="Start with the place, the season and the evidence available."
        description="A public case study needs a defined geography, crop season, activity, methodology and review status. This landscape is illustrative and does not represent a Carbon Credit project or result."
      >
        <div
          className="earth-photo-story-steps"
          aria-label="Information needed for a field program"
        >
          <span>Geography & season</span>
          <span>Practice & method</span>
          <span>Evidence & review</span>
        </div>
      </PhotoStory>
      <section className="earth-container earth-program-detail earth-program-detail-copy">
        <div>
          <span className="earth-status">Planning reference · not a published case study</span>
          <h2>Faridkot program reference</h2>
          <p>
            A possible Punjab context for evidence workflows. Objective, intervention and
            implementation stage are not confirmed for public reporting; no verified impact results
            are published.
          </p>
          <dl>
            {[
              ["Geography", "Faridkot, Punjab, India"],
              ["Crop & season", "Program-specific; not publicly documented"],
              ["Practice & methodology", "To be documented for the applicable program"],
              ["Data sources", "Field records and observations; availability to be confirmed"],
              ["Published results", "No verified results published"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <TextLink to="/contact">Discuss a field program</TextLink>
        </div>
      </section>
      <section className="earth-section earth-sage">
        <div className="earth-container">
          <SectionHeading
            label="BUILT TO ADD CONTEXT"
            title="New regions. New practices. The same foundation."
            description="Programs can define geography, crop, season, practice, methodology, status, sources and published results independently of platform capabilities."
          />
          <p className="earth-disclosure">
            The landscape is illustrative. No deployment counts, impact metrics or certifications
            are represented.
          </p>
        </div>
      </section>
      <DetailSections page="field-programs" />
      <FinalCTA />
    </SiteShell>
  );
}
export function ResearchPage() {
  return (
    <SiteShell>
      <PageIntro
        label="RESEARCH & INSIGHTS"
        title="Understanding agricultural systems through better evidence."
        description="Technical explainers on MRV, geospatial information, measurement and traceability. These are editorial drafts, not VirsaFlow research findings or published field results."
      />
      <PhotoStory
        image={researchFieldPhoto}
        imageAlt="Aerial view of crop plots divided into distinct field sections."
        caption="Illustrative drone view; not a live parcel, satellite result or research finding."
        label="FIELD OBSERVATION"
        title="Keep the field pattern distinct from the finding."
        description="Research questions need a clear source, collection date, field context and method. An aerial image can help describe spatial context; it cannot establish a practice history, emissions outcome or verification decision on its own."
        className="earth-photo-story-reversed"
      >
        <div className="earth-photo-story-steps" aria-label="A traceable research record">
          <span>Observation</span>
          <span>Source & date</span>
          <span>Method & limits</span>
        </div>
      </PhotoStory>
      <ResearchLibrary />
      <FinalCTA />
    </SiteShell>
  );
}
export function AboutPage() {
  return (
    <SiteShell>
      <PageIntro
        label="ABOUT VIRSAFLOW"
        title="Agricultural intelligence. Grounded in evidence."
        description="VirsaFlow is the agricultural intelligence and MRV platform of Panjdhara Private Limited. We focus on agricultural carbon project development and evidence-based MRV, starting with Direct Seeded Rice in Punjab, India."
      />
      <section className="earth-section earth-container earth-two-grid">
        <div>
          <span className="earth-label">OUR PURPOSE</span>
          <h2>
            Better decisions start
            <br />
            with better context.
          </h2>
        </div>
        <div className="earth-prose">
          <p>
            Agricultural monitoring brings together information collected in different ways, at
            different times and for different purposes. Meaningful assessment requires those sources
            to remain connected to the land and activities they describe.
          </p>
          <p>
            Our approach centers on an evidence graph: a connected record that makes provenance,
            uncertainty and review decisions inspectable. Our initial focus is Direct Seeded Rice
            and agricultural carbon projects in Punjab.
          </p>
          <p>
            Credibility comes from showing what evidence supports — and what it does not. We do not
            present estimates as verified results or imply certification without the appropriate
            evidence.
          </p>
          <TextLink to="/methodology">Our principles of evidence</TextLink>
        </div>
      </section>
      <section className="earth-roots">
        <div className="earth-container">
          <span className="earth-label">FOUNDERS’ REGION · PUNJAB</span>
          <p className="earth-punjabi" lang="pa">
            ਜਿੱਥੇ ਖੇਤ, ਉੱਥੇ ਜੜ੍ਹਾਂ
          </p>
          <p className="earth-roots-translation">“From the soil to the proof.”</p>
          <p className="earth-roots-copy">
            Punjab rice-wheat systems, irrigation patterns and farmer networks shape our first
            public use case. Project evidence requirements and outcomes depend on the applicable
            program and methodology.
          </p>
        </div>
      </section>
      <PunjabMap />
      <DetailSections page="about" />
      <FinalCTA />
    </SiteShell>
  );
}
export function MethodologyPage() {
  return (
    <SiteShell>
      <PageIntro
        label="TRUST & METHODOLOGY"
        title="Show the source. Preserve the reasoning."
        description="Our evidence principles guide how records are organized and reviewed. Applicable methods and verification criteria must be defined for each program."
      />
      <section className="earth-container earth-solution-details">
        {trustPrinciples.map(([title, description], i) => (
          <article key={title}>
            <div>
              <span className="earth-label">PRINCIPLE 0{i + 1}</span>
              <h2>{title}</h2>
            </div>
            <p>{description}</p>
          </article>
        ))}
      </section>
      <section className="earth-section earth-sage">
        <div className="earth-container earth-prose">
          <h2>Analysis is not certification.</h2>
          <p>
            AI supports pattern analysis and anomaly detection. Rules check evidence against
            applicable criteria. Human reviewers handle exceptions and uncertain cases, recording
            the rationale for their decisions.
          </p>
          <p>
            Measured values remain separate from estimates. Self-reported activities remain separate
            from independent corroboration. Preliminary assessments remain separate from verified
            results. A verified assessment does not by itself issue a carbon credit or grant a
            certification.
          </p>
          <p>
            Program-specific assumptions, method versions, quality checks and limitations should
            accompany any published assessment. No certification, accreditation or independent
            validation of VirsaFlow is claimed on this website.
          </p>
        </div>
      </section>
      <section className="earth-section earth-container">
        <SectionHeading
          label="REMOTE SENSING CONTEXT"
          title="A satellite observation has a date and a scale."
          description="Imagery supports field interpretation when its coverage, acquisition window and quality are suitable."
        />
        <SatelliteIntelligenceDiagram photo={methodologySatellitePhoto} />
      </section>
      <DetailSections page="methodology" />
      <EvidenceNextSteps />
      <FinalCTA />
    </SiteShell>
  );
}
export function ContactPage({ interest }: { interest?: string }) {
  return (
    <SiteShell>
      <PageIntro
        label="CONTACT & START A PILOT"
        title="Let’s define the agricultural problem you need to solve."
        description="Whether you are planning a monitoring program, improving field traceability or evaluating an MRV workflow, begin with the problem, available data and requirements for a potential pilot."
      />
      <section className="earth-container earth-contact">
        <div>
          <span className="earth-label">A CONVERSATION WITH VIRSAFLOW</span>
          <h2>
            Partnerships.
            <br />
            Pilots. Possibilities.
          </h2>
          <p>
            Pilots for specific agricultural use cases, partnerships with implementation and
            research teams, or walkthroughs for institutional users.
          </p>
          <a className="earth-text-link" href="mailto:contact@thecarboncredit.in">
            contact@thecarboncredit.in
            <ArrowUpRight size={17} />
          </a>
          <p className="earth-disclosure">
            For technical integrations, research collaboration and data-governance questions, use
            the same team contact. Do not include confidential farmer data or sensitive documents.
          </p>
          <h3 className="earth-next-heading">After you send the enquiry</h3>
          <ol className="earth-next-list">
            <li>The team reviews your enquiry.</li>
            <li>Discuss the problem and intended outcome.</li>
            <li>Assess sources and evidence requirements.</li>
            <li>Define pilot scope and methodology.</li>
            <li>Agree responsibilities, permissions and evaluation criteria.</li>
            <li>Agree an implementation plan if both parties proceed.</li>
          </ol>
          <p className="earth-disclosure">No response time or service level is promised.</p>
        </div>
        <PilotEnquiry interest={interest} />
      </section>
      <section className="earth-section earth-sage">
        <div className="earth-container">
          <SectionHeading
            label="A WELL-SCOPED CONVERSATION"
            title="Move from the question to the evidence."
            description="The first discussion is about context and requirements; it does not enroll a farmer or confirm a project."
          />
          <FarmerMarketWorkflowDiagram />
        </div>
      </section>
      <FinalCTA />
    </SiteShell>
  );
}
export function AgriculturalMRVPage() {
  return (
    <SiteShell>
      <PageIntro
        label="AGRICULTURAL MRV"
        title="From observations to a defensible assessment."
        description="Understand monitoring, reporting and verification, why agricultural evidence is difficult and what a methodology-specific workflow can support."
      />
      <section className="earth-section earth-sage">
        <div className="earth-container">
          <SectionHeading
            label="FROM THE FIELD TO THE RECORD"
            title="Keep each observation in its place."
            description="A field, crop season, activity and source record need to remain connected for later interpretation."
          />
          <EvidencePackageDiagram />
        </div>
      </section>
      <DetailSections page="agricultural-mrv" />
      <WorkflowDemo />
      <EvidenceNextSteps />
      <FinalCTA />
    </SiteShell>
  );
}
export function BusinessImpactPage() {
  return (
    <SiteShell>
      <PageIntro
        label="BUSINESS & IMPACT"
        title="Customer value. Measured against evidence."
        description="A proposed commercial model and a transparent framework for evaluating operational value — not claims of revenue, profitability or proven impact."
      />
      <DetailSections page="business-impact" />
      <section className="earth-section earth-sage">
        <div className="earth-container">
          <SectionHeading
            label="VALUE NEEDS A PATHWAY"
            title="Make responsibilities part of the model."
            description="Measure operational value against a defined problem and reporting period, while preserving the separation between participation, verification and potential market activity."
          />
          <FarmerMarketWorkflowDiagram />
        </div>
      </section>
      <FinalCTA />
    </SiteShell>
  );
}

export function LegalPage({ type }: { type: "privacy" | "terms" }) {
  return (
    <SiteShell>
      <PageIntro
        label={type === "privacy" ? "PRIVACY & DATA GOVERNANCE" : "TERMS OF USE"}
        title={
          type === "privacy" ? "Your information. Clear boundaries." : "Use evidence responsibly."
        }
        description={
          type === "privacy"
            ? "How this public website handles enquiries and separates public examples from private operational records."
            : "Important limits on public information, illustrative interfaces and agricultural estimates."
        }
      />
      <section className="earth-container earth-section earth-legal earth-prose">
        {type === "privacy" ? (
          <>
            <h2>Public enquiries</h2>
            <p>
              The contact form prepares an email draft in your browser. It does not store a
              registration or send information to VirsaFlow until you send the email through
              your chosen email service. Your email provider’s own terms and privacy policies apply.
            </p>
            <h2>Information you share</h2>
            <p>
              When you send an enquiry, the team receives the name, email, organization and message
              you choose to share. Please do not include private farmer records, precise field data
              or other sensitive information in a public enquiry.
            </p>
            <h2>Analytics and performance</h2>
            <p>
              On the production website, Vercel Web Analytics and Speed Insights help us understand
              aggregate page use and performance. Vercel describes Web Analytics as cookieless and
              based on a short-lived request hash. Google Analytics is loaded only if you choose
              “Allow analytics”; you can reject it or change your choice with Analytics settings in
              the footer. Google Analytics receives public page paths and titles and an event when
              someone opens an email link. We remove query strings from tracked page locations and
              do not send enquiry contents, authentication details or farmer records. Analytics
              choices are stored in this browser. Provider processing is subject to the providers’
              privacy terms.
            </p>
            <h2>Account access</h2>
            <p>
              Operational accounts are separate from the public website. Private records require
              authenticated access and applicable permissions. Public interface examples are
              illustrative and do not expose live farmer records.
            </p>
            <h2>Requests and questions</h2>
            <p>
              To ask about information you have shared, or request correction or deletion of an
              enquiry, contact{" "}
              <a href="mailto:contact@thecarboncredit.in">contact@thecarboncredit.in</a>.
              Program-specific data collection requires its own applicable consent and privacy
              terms.
            </p>
          </>
        ) : (
          <>
            <h2>Public information</h2>
            <p>
              This website introduces VirsaFlow’s agricultural evidence approach. Program
              scope, service availability and deliverables require separate agreement with the team.
            </p>
            <h2>Illustrative and estimated information</h2>
            <p>
              Sample interfaces and records are illustrative, not live deployments. Income
              projections are estimates, not guaranteed revenue. Nothing on this website establishes
              an independently certified agricultural practice, verified water saving or issued
              carbon credit.
            </p>
            <h2>Assessments and decisions</h2>
            <p>
              Environmental assessments depend on applicable methodologies, source quality and
              review. AI-supported analysis does not independently establish a sustainability claim.
              Public information is not insurance, financial or certification advice.
            </p>
            <h2>Responsible use</h2>
            <p>
              Do not attempt to access restricted records, misuse account access or submit private
              farmer information through public enquiries. Contact{" "}
              <a href="mailto:contact@thecarboncredit.in">contact@thecarboncredit.in</a> for
              questions about use.
            </p>
          </>
        )}
      </section>
      {type === "privacy" && <DetailSections page="privacy" />}
      <FinalCTA />
    </SiteShell>
  );
}
