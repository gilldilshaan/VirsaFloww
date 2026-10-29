import { useState } from "react";
import {
  Check,
  Layers,
  Map,
  Satellite,
  ScanLine,
  FileText,
  GitBranch,
  Camera,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
export function LandscapeAnnotations() {
  return (
    <div className="landscape-annotations" aria-hidden="true">
      <svg viewBox="0 0 700 500" preserveAspectRatio="xMidYMid slice">
        <path d="M140 95 L370 76 L401 231 L162 258 Z" />
        <path d="M408 88 L592 124 L571 294 L424 265 Z" />
        <path d="M179 282 L394 260 L423 420 L215 451 Z" />
        <path d="M440 297 L579 324 L563 447 L458 433 Z" />
      </svg>
      <div className="parcel-tag parcel-one">
        <ScanLine size={13} /> Field boundary <span>ILLUSTRATIVE</span>
      </div>
      <div className="parcel-tag parcel-two">
        <Camera size={13} /> Observation linked
      </div>
      <div className="parcel-tag parcel-three">
        <GitBranch size={13} /> Evidence connected
      </div>
    </div>
  );
}
const layerOptions = ["Boundaries", "Observations", "Review status"] as const;
export function EvidenceMap() {
  const [layer, setLayer] = useState<(typeof layerOptions)[number]>("Boundaries");
  return (
    <div className="evidence-map">
      <div className="map-toolbar">
        <span>
          <Map size={16} /> Field intelligence
        </span>
        <span className="earth-status">Illustrative interface</span>
      </div>
      <div className="map-body evidence-map-canvas">
        <div className={`evidence-satellite-scene evidence-satellite-${layer.toLowerCase().replace(/\s+/g, "-")}`} aria-hidden="true">
          <img src="/earth/platform-field-satellite.webp" alt="" />
          <div className="evidence-satellite-shade" />
          <svg viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid slice">
            <g className="evidence-boundary-layer">
              <path d="M116 102 405 74 438 253 147 288Z" />
              <path d="M465 74 732 108 702 286 448 253Z" />
              <path d="M146 317 438 281 474 506 180 535Z" />
              <path d="M467 282 713 312 752 531 490 506Z" />
            </g>
            <g className="evidence-observation-layer">
              <path className="evidence-scan-path" d="M38 424C237 358 309 182 510 120S859 110 1161 42" />
              <circle cx="270" cy="331" r="8" />
              <circle cx="637" cy="137" r="8" />
              <circle cx="918" cy="105" r="8" />
            </g>
            <g className="evidence-review-layer">
              <circle cx="335" cy="160" r="22" />
              <circle cx="335" cy="160" r="6" />
              <circle cx="623" cy="391" r="22" />
              <circle cx="623" cy="391" r="6" />
              <circle cx="927" cy="239" r="22" />
              <circle cx="927" cy="239" r="6" />
            </g>
          </svg>
          <span className="evidence-satellite-stamp">ILLUSTRATIVE SATELLITE VIEW · GENERATED</span>
        </div>
        <div className="map-layer-tabs" aria-label="Map layers">
          {layerOptions.map((option) => (
            <Button
              key={option}
              variant={layer === option ? "earth" : "secondary"}
              onClick={() => setLayer(option)}
              aria-pressed={layer === option}
            >
              <Layers size={13} />
              {option}
            </Button>
          ))}
        </div>
        <div className="map-record">
          <span className="earth-label">SAMPLE FIELD / A-024</span>
          <h3>
            {layer === "Boundaries"
              ? "Field & season context"
              : layer === "Observations"
                ? "Source-linked observation"
                : "Human review required"}
          </h3>
          <p>
            {layer === "Boundaries"
              ? "Illustrative parcel • season linked"
              : layer === "Observations"
                ? "Self-reported activity • photo attached"
                : "Preliminary assessment • not verified"}
          </p>
          <span>
            <span className="evidence-dot" />
            {layer === "Review status" ? "Awaiting reviewer decision" : "Source context retained"}
          </span>
        </div>
        <div className="map-coordinate">
          <Satellite size={13} /> CONCEPT VIEW · NOT LIVE FIELD DATA
        </div>
      </div>
    </div>
  );
}
const graphNodes = [
  {
    label: "Field",
    Icon: Map,
    detail: "The illustrative field identifier links spatial scope to the program record.",
    status: "Context defined",
  },
  {
    label: "Season",
    Icon: Layers,
    detail: "Crop and reporting period keep observations within the right time window.",
    status: "Period linked",
  },
  {
    label: "Activity",
    Icon: ScanLine,
    detail: "A reported farming practice is recorded with its date and source.",
    status: "Reported activity",
  },
  {
    label: "Claim",
    Icon: FileText,
    detail: "The claim states what the project intends to assess under defined criteria.",
    status: "Illustrative claim",
  },
  {
    label: "Source evidence",
    Icon: Camera,
    detail: "Records and observations support, qualify or challenge the activity claim.",
    status: "Illustrative sources",
  },
  {
    label: "Assessment",
    Icon: GitBranch,
    detail: "Checks retain methodology, assumptions, uncertainty and evidence gaps.",
    status: "Preliminary example",
  },
  {
    label: "Review decision",
    Icon: ShieldCheck,
    detail: "A reviewer records whether more evidence is needed or the criteria are met.",
    status: "Independent review pending",
  },
];
export function EvidenceGraph() {
  const [selected, setSelected] = useState(4);
  const node = graphNodes[selected]!;
  return (
    <div className="evidence-graph">
      <div className="graph-context">
        <span className="earth-label">ILLUSTRATIVE EVIDENCE GRAPH</span>
        <span className="earth-status">Conceptual model · not live data</span>
      </div>
      <div className="graph-nodes" role="group" aria-label="Illustrative evidence relationships">
        {graphNodes.map(({ label, Icon }, index) => (
          <button
            type="button"
            className={`graph-node node-${index}${selected === index ? " selected" : ""}`}
            key={label}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <Icon size={19} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <div className="graph-selection" aria-live="polite">
        <div>
          <strong>{node.label}</strong>
          <span className="earth-status">{node.status}</span>
        </div>
        <p>{node.detail}</p>
      </div>
      <div className="graph-note">
        <Check size={14} /> No real farmer record, verification result or credit issuance is shown.
      </div>
    </div>
  );
}
