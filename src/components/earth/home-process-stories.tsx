import { useEffect, useRef, useState, type FocusEvent } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import practiceImage from "@/assets/home-visuals/carbon-practice.webp";
import baselineImage from "@/assets/home-visuals/carbon-baseline.webp";
import monitorImage from "@/assets/home-visuals/carbon-monitor.webp";
import quantifyImage from "@/assets/home-visuals/carbon-quantify.webp";
import verifyImage from "@/assets/home-visuals/carbon-verify.webp";
import registryImage from "@/assets/home-visuals/carbon-registry.webp";
import farmersImage from "@/assets/home-visuals/market-farmers.webp";
import collectiveImage from "@/assets/home-visuals/market-collective.webp";
import designImage from "@/assets/home-visuals/market-design.webp";
import monitoringImage from "@/assets/home-visuals/market-monitoring.webp";
import reviewImage from "@/assets/home-visuals/market-review.webp";
import registryStageImage from "@/assets/home-visuals/market-registry.webp";
import buyerImage from "@/assets/home-visuals/market-buyer.webp";

type StoryStep = {
  title: string;
  detail: string;
  image: string;
  alt: string;
};

const carbonSteps: StoryStep[] = [
  {
    title: "Practice",
    detail: "Document the field activity, who reported it and when it took place.",
    image: practiceImage,
    alt: "Illustrative Punjab farmer operating a seed drill across direct-seeded rice rows.",
  },
  {
    title: "Baseline",
    detail: "Define the comparison the selected methodology requires.",
    image: baselineImage,
    alt: "Illustrative farmer and agronomist compare neighboring field plots and records.",
  },
  {
    title: "Monitor",
    detail: "Collect dated field evidence and suitable observations through the season.",
    image: monitorImage,
    alt: "Illustrative field worker checks a water-level tube between rice rows.",
  },
  {
    title: "Quantify",
    detail: "Estimate under an applicable method, keeping assumptions and uncertainty visible.",
    image: quantifyImage,
    alt: "Illustrative researchers take a field measurement beside a rice crop.",
  },
  {
    title: "Verify",
    detail: "An independent body assesses the design and reported monitoring under programme rules.",
    image: verifyImage,
    alt: "Illustrative reviewers inspect project records with a farmer beside a paddy field.",
  },
  {
    title: "Issue",
    detail: "Only a registry can issue credits, if the project meets its requirements.",
    image: registryImage,
    alt: "Illustrative project submission documents are reviewed in an unbranded office.",
  },
];

const marketSteps: StoryStep[] = [
  {
    title: "Farmers",
    detail: "Participation starts with informed consent and a record of field activity.",
    image: farmersImage,
    alt: "Illustrative farmer discusses participation and field activity with a coordinator.",
  },
  {
    title: "FPO / partner",
    detail: "A local collective can coordinate participants, permissions and records.",
    image: collectiveImage,
    alt: "Illustrative farmer collective discusses a field-boundary sketch near rice paddies.",
  },
  {
    title: "Project team",
    detail: "Define project scope, methodology, baseline and monitoring responsibilities.",
    image: designImage,
    alt: "Illustrative project specialists review parcel sketches and a tablet beside fields.",
  },
  {
    title: "MRV process",
    detail: "Connect evidence to fields and seasons; record gaps and deviations.",
    image: monitoringImage,
    alt: "Illustrative field officer records a crop observation on a tablet.",
  },
  {
    title: "Independent body",
    detail: "An independent reviewer assesses records against the selected programme criteria.",
    image: reviewImage,
    alt: "Illustrative reviewer and project representative examine monitoring records.",
  },
  {
    title: "Registry",
    detail: "The registry makes its own decision on issuance under the applicable rules.",
    image: registryStageImage,
    alt: "Illustrative unbranded registry submission is checked in an office; no issuance is shown.",
  },
  {
    title: "Buyer",
    detail: "A commercial conversation may follow; a transaction is a separate decision.",
    image: buyerImage,
    alt: "Illustrative exploratory discussion about rice supply and project documentation.",
  },
];

function PhotoProcessSequence({
  id,
  label,
  tag,
  steps,
  caveat,
}: {
  id: string;
  label: string;
  tag: string;
  steps: StoryStep[];
  caveat: string;
}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const step = steps[active]!;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => setMotionAllowed(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.25 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (!inView || !autoAdvance || interactionPaused || !motionAllowed || !pageVisible) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % steps.length),
      6800,
    );
    return () => window.clearInterval(timer);
  }, [active, autoAdvance, inView, interactionPaused, motionAllowed, pageVisible, steps.length]);

  useEffect(() => {
    if (!inView) return;
    const next = new Image();
    next.src = steps[(active + 1) % steps.length]!.image;
  }, [active, inView, steps]);

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setInteractionPaused(false);
    }
  };

  return (
    <figure
      ref={root}
      className={`home-process-sequence home-process-${id}`}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={() => setInteractionPaused(true)}
      onPointerLeave={() => setInteractionPaused(false)}
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={handleBlur}
    >
      <div className="home-process-photo">
        <img
          key={step.image}
          src={step.image}
          alt={step.alt}
          width={1536}
          height={1024}
          loading="lazy"
          decoding="async"
        />
        <div className="home-process-photo-shade" aria-hidden="true" />
        <span className="home-process-photo-index">
          {String(active + 1).padStart(2, "0")} <i /> {String(steps.length).padStart(2, "0")}
        </span>
        <span className="home-process-photo-tag">{tag}</span>
      </div>
      <div className="home-process-copy">
        <span className="earth-label">{label}</span>
        <div className="home-process-step-label">
          STAGE {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </div>
        <h3 key={`${id}-${step.title}`}>{step.title}</h3>
        <p key={`${id}-${active}-detail`}>{step.detail}</p>
        <div className="home-process-controls">
          <button
            type="button"
            className="home-process-arrow"
            aria-label="Previous stage"
            onClick={() => setActive((current) => (current - 1 + steps.length) % steps.length)}
          >
            <ArrowLeft size={17} />
          </button>
          <button
            type="button"
            className="home-process-play"
            aria-label={
              motionAllowed
                ? autoAdvance
                  ? "Pause automatic stage changes"
                  : "Resume automatic stage changes"
                : "Automatic stage changes disabled by reduced motion"
            }
            aria-pressed={!autoAdvance}
            disabled={!motionAllowed}
            onClick={() => {
              setAutoAdvance((playing) => !playing);
              setInteractionPaused(false);
            }}
          >
            {!motionAllowed ? null : autoAdvance ? <Pause size={14} /> : <Play size={14} />}
            <span>{motionAllowed ? (autoAdvance ? "Pause" : "Play") : "Motion off"}</span>
          </button>
          <button
            type="button"
            className="home-process-arrow"
            aria-label="Next stage"
            onClick={() => setActive((current) => (current + 1) % steps.length)}
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <div className="home-process-stage-nav" aria-label="Choose a stage">
        {steps.map((item, index) => (
          <button
            key={item.title}
            type="button"
            aria-current={active === index ? "step" : undefined}
            aria-label={`Show stage ${index + 1}: ${item.title}`}
            onClick={() => setActive(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <b>{item.title}</b>
          </button>
        ))}
      </div>
      <figcaption className="home-process-note">
        <span>Illustrative AI-generated scenes</span>
        {caveat}
      </figcaption>
    </figure>
  );
}

export function HomeCarbonLifecycleStory() {
  return (
    <PhotoProcessSequence
      id="carbon-lifecycle"
      label="AGRICULTURAL CARBON · A SEPARATE-STAGE PROCESS"
      tag="ILLUSTRATIVE FIELD STORY"
      steps={carbonSteps}
      caveat="Verification and issuance are different decisions. A documented project does not guarantee either; actual requirements depend on the selected program and methodology."
    />
  );
}

export function HomeFarmerMarketStory() {
  return (
    <PhotoProcessSequence
      id="farmer-market"
      label="FARMER-TO-MARKET · POTENTIAL PROJECT PATHWAY"
      tag="PROGRAM DEPENDENT"
      steps={marketSteps}
      caveat="Participation, methodology approval, independent review, registry issuance and any commercial sale are separate steps. These scenes do not represent active partners, buyers or project outcomes."
    />
  );
}
