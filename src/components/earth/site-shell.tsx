import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AcreonBrand } from "@/components/acreon-brand";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/lib/auth-context";
import { publicNavigation } from "@/lib/earth/content";
import { usePublicMotion } from "./use-public-motion";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnalyticsConsent, AnalyticsSettingsButton } from "@/components/earth/analytics-consent";
import { PRODUCTION_SITE_URL } from "@/lib/site-url";
import imgAgent from "@/assets/page-field-agent.jpg";
import imgSat from "@/assets/page-satellite.jpg";
import imgFpo from "@/assets/page-fpo-meeting.jpg";
import imgResearch from "@/assets/page-research.jpg";
import imgPunjabRicePrograms from "@/assets/field-story/punjab-rice-programs-generated.webp";
import imgTermsRecords from "@/assets/field-story/terms-records-generated.webp";
import imgBund from "@/assets/page-bund.jpg";
import imgPerspective from "@/assets/field-perspective.jpg";
import imgLandscape from "@/assets/agricultural-landscape.jpg";
import imgBanner from "@/assets/dash-banner.jpg";
import imgPunjab from "@/assets/punjab-fields.jpg";
import imgTransplanting from "@/assets/field-story/planting-wet-paddy.webp";
import imgMethane from "@/assets/rice-methane.jpg";

export function SiteShell({ children, home = false }: { children: ReactNode; home?: boolean }) {
  const [menu, setMenu] = useState(false);
  const [productionTelemetry, setProductionTelemetry] = useState(false);
  const account = useAccount();
  const root = useRef<HTMLDivElement>(null);
  const pathname = useLocation({ select: (location) => location.pathname });
  usePublicMotion(root, pathname);
  useEffect(() => {
    setProductionTelemetry(window.location.hostname === new URL(PRODUCTION_SITE_URL).hostname);
  }, []);
  const mobileLinks = [
    ...publicNavigation,
    { to: "/field-programs", label: "Field programs" },
    { to: "/business-impact", label: "Business & impact" },
    { to: "/methodology", label: "Methodology & evidence" },
    { to: "/privacy", label: "Privacy & data governance" },
    { to: "/research", label: "Research & insights" },
  ];
  return (
    <div ref={root} className="earth-site">
      <div className="earth-reading-progress" aria-hidden="true" />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className={`earth-nav ${home ? "on-landscape" : ""}`}>
        <div className="earth-nav-inner">
          <AcreonBrand />
          <nav className="earth-desktop-nav" aria-label="Main navigation">
            {publicNavigation.map((item) => (
              <Link key={item.to} to={item.to} activeProps={{ className: "current" }}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="earth-nav-actions">
            <Button asChild variant="ghost" className="earth-signin">
              <Link to={account ? "/dashboard" : "/auth"} search={{ next: "/dashboard" }}>
                {account ? "Workspace" : "Sign in"}
                <ArrowUpRight size={14} />
              </Link>
            </Button>
            <Button asChild variant="earth" className="earth-contact-button">
              <Link to="/auth" search={{ next: "/dashboard" }}>
                Get Started <ArrowUpRight />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={menu ? "Close navigation" : "Open navigation"}
              aria-expanded={menu}
              aria-controls="earth-mobile-nav"
              className="earth-menu"
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {menu && (
          <nav id="earth-mobile-nav" className="earth-mobile-nav" aria-label="Mobile navigation">
            {mobileLinks.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMenu(false)}>
                {item.label}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main id="main-content">{children}</main>
      <footer className="earth-footer">
        <div className="earth-container earth-footer-top">
          <div>
            <AcreonBrand />
            <p>Making agricultural climate impact measurable, verifiable and valuable.</p>
            <a className="footer-email" href="mailto:contact@thecarboncredit.in">
              contact@thecarboncredit.in <ArrowUpRight size={14} />
            </a>
          </div>
          <div>
            <span className="earth-label">EXPLORE</span>
            <Link to="/platform">Our approach</Link>
            <Link to="/carbon-credits">Agricultural projects</Link>
            <Link to="/agricultural-mrv">MRV & verification</Link>
            <Link to="/solutions">Solutions</Link>
            <Link to="/how-it-works">Project lifecycle</Link>
            <Link to="/methodology">Methodology</Link>
          </div>
          <div>
            <span className="earth-label">PARTNERS</span>
            <Link to="/partners">Partner with us</Link>
            <Link to="/field-programs">Field programs</Link>
            <Link to="/research">Research & insights</Link>
            <Link to="/business-impact">Business & impact</Link>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <span className="earth-label">RESOURCES</span>
            <Link to="/passport">Field passport</Link>
            <Link to="/calculator">Opportunity estimator</Link>
            <Link to="/auth" search={{ next: "/dashboard" }}>
              Sign in
            </Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms of use</Link>
          </div>
        </div>
        <div className="earth-container earth-footer-bottom">
          <span>© 2026 VirsaFlow · Panjdhara Private Limited</span>
          <span>
            Built around evidence. Rooted in Punjab.{" "}
            <span lang="pa" className="earth-punjabi-inline">
              ਪੰਜਾਬ ਦੀ ਮਿੱਟੀ ਤੋਂ
            </span>
          </span>
          <AnalyticsSettingsButton />
        </div>
      </footer>
      <AnalyticsConsent />
      {productionTelemetry && <Analytics />}
      {productionTelemetry && <SpeedInsights />}
    </div>
  );
}

export function TextLink({
  to,
  children,
}: {
  to:
    | "/agricultural-mrv"
    | "/carbon-credits"
    | "/business-impact"
    | "/privacy"
    | "/platform"
    | "/solutions"
    | "/how-it-works"
    | "/partners"
    | "/field-programs"
    | "/research"
    | "/about"
    | "/contact"
    | "/methodology";
  children: ReactNode;
}) {
  return (
    <Link className="earth-text-link" to={to}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="earth-section-heading">
      <div>
        <span className="earth-label">{label}</span>
        <h2>{title}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
const introImages: Record<string, [string, string, string]> = {
  "/platform": [
    imgSat,
    "Illustrative overhead view of agricultural field parcels and canals",
    "Spatial imagery · concept visual",
  ],
  "/agricultural-mrv": [
    imgAgent,
    "Illustrative field observer recording an agricultural observation with a farmer",
    "Field observation · illustrative scene",
  ],
  "/solutions": [
    imgTransplanting,
    "Farmers transplanting rice seedlings into a flooded field",
    "Crop establishment · illustrative field scene",
  ],
  "/how-it-works": [
    imgBund,
    "Illustrative farmer walking between rice paddies in morning mist",
    "Field practice · illustrative scene",
  ],
  "/partners": [
    imgFpo,
    "Illustrative community discussion about agricultural programs",
    "Community context · not a confirmed partner",
  ],
  "/field-programs": [
    imgPunjabRicePrograms,
    "Illustrative Punjab rice plots and irrigation channels at dawn",
    "AI-generated illustration · Punjab rice systems, not a documented project",
  ],
  "/research": [
    imgResearch,
    "Illustrative soil samples and field notebook used in agricultural research",
    "Research methods · illustrative scene",
  ],
  "/about": [
    imgPerspective,
    "Illustrative rice fields and an irrigation channel",
    "Punjab agricultural landscape · illustrative",
  ],
  "/methodology": [
    imgMethane,
    "Illustrative rice field water-level observation",
    "Water observation · does not measure methane",
  ],
  "/business-impact": [
    imgBanner,
    "Illustrative agriculture landscape in warm evening light",
    "Agricultural context · illustrative landscape",
  ],
  "/contact": [
    imgLandscape,
    "Illustrative agricultural field landscape",
    "Illustrative scene · not a documented operation",
  ],
  "/privacy": [
    imgPunjab,
    "Illustrative agricultural parcels seen from above",
    "Illustrative spatial context",
  ],
  "/terms": [
    imgTermsRecords,
    "Illustrative farm notebook and blank agreement beside a Punjab rice field",
    "AI-generated illustration · no customer or farmer records shown",
  ],
};
export function PageIntro({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  const { pathname } = useLocation();
  const img = introImages[pathname];
  const cinematic = !!img && pathname !== "/privacy" && pathname !== "/terms";
  return (
    <section
      className={`earth-page-intro${img ? " has-photo" : ""}${cinematic ? " is-cinematic" : ""}${img && !cinematic ? " compact-photo earth-container" : ""}${!img ? " earth-container" : ""}`}
    >
      <div className={`earth-page-intro-copy${cinematic ? " earth-container" : ""}`}>
        <span className="earth-label">{label}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {img && (
        <figure className="earth-page-intro-photo">
          <img
            src={img[0]}
            alt={img[1]}
            width={1600}
            height={912}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption>{img[2]}</figcaption>
        </figure>
      )}
    </section>
  );
}
export function PhotoStory({
  image,
  imageAlt,
  caption,
  label,
  title,
  description,
  children,
  className = "",
}: {
  image: string;
  imageAlt: string;
  caption: string;
  label: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`earth-container earth-section earth-photo-story ${className}`.trim()}>
      <figure>
        <img
          src={image}
          alt={imageAlt}
          width={1400}
          height={1050}
          loading="lazy"
          decoding="async"
        />
        <figcaption>{caption}</figcaption>
      </figure>
      <div className="earth-photo-story-copy">
        <span className="earth-label">{label}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        {children}
      </div>
    </section>
  );
}
export function FinalCTA({
  image,
  imageAlt,
  showBrand = false,
}: {
  image?: string;
  imageAlt?: string;
  showBrand?: boolean;
}) {
  return (
    <section className={`earth-final${image ? " has-visual" : ""}`}>
      {image && (
        <img
          className="earth-final-image"
          src={image}
          alt={imageAlt ?? ""}
          width={1920}
          height={1024}
          loading="lazy"
        />
      )}
      <div className={`earth-container earth-final-layout${showBrand ? " with-brand" : ""}`}>
        <div className="earth-final-copy-block">
          <span className="earth-label">START WITH A CONVERSATION</span>
          <h2>
            Build a clearer picture
            <br />
            of agricultural impact.
          </h2>
          <p className="earth-final-copy">
            Talk with VirsaFlow about a DSR program, field evidence requirements, research
            collaboration or a potential project partnership.
          </p>
          <div className="earth-cta-links">
            <Button asChild variant="earth">
              <Link to="/contact" search={{ interest: "Institutional partnership" }}>
                Partner with us <ArrowUpRight />
              </Link>
            </Button>
            <Link to="/contact" search={{ interest: "Pilot program" }}>
              Discuss a pilot <ArrowUpRight size={16} />
            </Link>
            <Link to="/contact" search={{ interest: "Platform walkthrough" }}>
              Request a walkthrough <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        {showBrand && (
          <aside className="earth-final-brand-panel" aria-label="VirsaFlow">
            <AcreonBrand className="earth-final-brand" />
            <span>Land today <i /> Opportunities tomorrow</span>
          </aside>
        )}
      </div>
    </section>
  );
}
