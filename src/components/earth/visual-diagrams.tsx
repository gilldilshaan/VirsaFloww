/** Browser-native explanatory illustrations. Every figure describes a process, not a live result. */

const sourceKinds = [
  { n: "01", title: "Field observations", note: "Who · when · where", icon: "◉" },
  { n: "02", title: "Satellite context", note: "Coverage · date · quality", icon: "⌁" },
  { n: "03", title: "Farmer records", note: "Reported activity · season", icon: "≡" },
  { n: "04", title: "Supporting files", note: "Photos · documents · sensors", icon: "▤" },
];

export function EvidencePackageDiagram() {
  return (
    <figure className="story-diagram evidence-package-diagram">
      <div className="story-diagram-head">
        <span className="earth-label">AGRICULTURAL MRV · SOURCE TO REVIEW</span>
        <span className="story-diagram-tag">Illustrative model</span>
      </div>
      <div className="evidence-package-flow">
        <div className="evidence-source-list">
          {sourceKinds.map((source) => (
            <div className="evidence-source" key={source.title}>
              <span className="evidence-source-glyph" aria-hidden="true">
                {source.icon}
              </span>
              <span className="evidence-source-text">
                <b>{source.title}</b>
                <small>{source.note}</small>
              </span>
              <span className="evidence-source-index">{source.n}</span>
            </div>
          ))}
        </div>
        <svg className="evidence-flow-lines" viewBox="0 0 150 280" aria-hidden="true">
          <path d="M0 34 C74 34 73 140 145 140M0 104 C70 104 72 140 145 140M0 176 C70 176 72 140 145 140M0 246 C74 246 73 140 145 140" />
          <circle cx="145" cy="140" r="5" />
        </svg>
        <div className="evidence-package-core">
          <span className="package-orbit" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="earth-label">CONNECTED RECORD</span>
          <b>
            Evidence
            <br />
            package
          </b>
          <small>Field · season · claim</small>
        </div>
        <svg className="evidence-flow-out" viewBox="0 0 88 280" aria-hidden="true">
          <path d="M0 140 H84" />
          <circle cx="82" cy="140" r="5" />
        </svg>
        <div className="evidence-review-list">
          <div>
            <span>01</span>
            <b>Quality checks</b>
            <small>Completeness · consistency</small>
          </div>
          <div>
            <span>02</span>
            <b>Human review</b>
            <small>Gaps · exceptions · rationale</small>
          </div>
          <div className="evidence-review-result">
            <span className="review-dot" />
            <b>Decision recorded</b>
            <small>Outcome depends on criteria</small>
          </div>
        </div>
      </div>
      <figcaption>
        Evidence sources can support or qualify a claim. The connected record retains their origin,
        timing and limitations for review.
      </figcaption>
    </figure>
  );
}

const lifecycleSteps = [
  ["Practice", "Document field activity"],
  ["Baseline", "Define the comparison"],
  ["Monitor", "Collect dated evidence"],
  ["Quantify", "Estimate under a method"],
  ["Verify", "Independent assessment"],
  ["Issue", "Registry decision, if eligible"],
];

export function CarbonLifecycleDiagram() {
  return (
    <figure className="story-diagram lifecycle-diagram">
      <div className="story-diagram-head">
        <span className="earth-label">AGRICULTURAL CARBON · A SEPARATE-STAGE PROCESS</span>
        <span className="story-diagram-tag">Illustrative pathway</span>
      </div>
      <div
        className="lifecycle-track"
        role="list"
        aria-label="Illustrative agricultural carbon lifecycle"
      >
        {lifecycleSteps.map(([title, detail], index) => (
          <div className={`lifecycle-step lifecycle-step-${index + 1}`} key={title} role="listitem">
            <span className="lifecycle-index">0{index + 1}</span>
            <span className="lifecycle-node" aria-hidden="true">
              {index < 3 ? <i /> : index === 3 ? <b>∑</b> : index === 4 ? <b>✓</b> : <b>↗</b>}
            </span>
            <b className="lifecycle-title">{title}</b>
            <small>{detail}</small>
          </div>
        ))}
      </div>
      <div className="lifecycle-outcome">
        <span className="lifecycle-outcome-line" />
        <p>
          Verification and issuance are different decisions. A documented project does not guarantee
          either.
        </p>
      </div>
      <figcaption>
        Each stage has its own evidence requirements, decision-maker and limits. Actual requirements
        depend on the selected program and methodology.
      </figcaption>
    </figure>
  );
}

export function DsrEstablishmentDiagram() {
  return (
    <figure className="story-diagram dsr-establishment-diagram">
      <div className="story-diagram-head">
        <span className="earth-label">CROP ESTABLISHMENT · WATER REGIME IS A SEPARATE CHOICE</span>
        <span className="story-diagram-tag">Field schematic</span>
      </div>
      <div className="dsr-comparison">
        <div className="dsr-row dsr-transplant-row">
          <div className="dsr-row-copy">
            <span>01 / TRANSPLANTED</span>
            <b>Nursery → prepared field</b>
            <small>Seedlings move from a nursery into the field.</small>
          </div>
          <svg
            viewBox="0 0 440 180"
            role="img"
            aria-label="Rice seedlings being transplanted into moist, prepared soil"
          >
            <path className="dsr-field-edge" d="M10 118 Q220 93 430 118 V177 H10Z" />
            <path className="dsr-soil" d="M10 129 Q220 105 430 129 V177 H10Z" />
            <path className="dsr-water" d="M10 113 Q220 91 430 113 V130 Q220 106 10 131Z" />
            <g className="dsr-plant dsr-plant-transplant">
              <path d="M110 119V67M110 90 86 70M110 99 132 77M220 112V55M220 82 195 62M220 91 244 66M328 117V73M328 92 306 74M328 100 350 81" />
            </g>
            <path className="dsr-seed-line" d="M62 144H384" />
          </svg>
        </div>
        <div className="dsr-row dsr-direct-row">
          <div className="dsr-row-copy">
            <span>02 / DIRECT SEEDED</span>
            <b>Seed → field rows</b>
            <small>Seed is placed directly into prepared soil.</small>
          </div>
          <svg
            viewBox="0 0 440 180"
            role="img"
            aria-label="Young rice plants emerging from seeds sown directly into rows"
          >
            <path className="dsr-field-edge" d="M10 118 Q220 93 430 118 V177 H10Z" />
            <path className="dsr-soil" d="M10 129 Q220 105 430 129 V177 H10Z" />
            <path className="dsr-water-low" d="M10 113 Q220 91 430 113 V122 Q220 100 10 123Z" />
            <g className="dsr-seed-row">
              <circle cx="105" cy="142" r="4" />
              <circle cx="220" cy="137" r="4" />
              <circle cx="330" cy="143" r="4" />
            </g>
            <g className="dsr-plant dsr-plant-direct">
              <path d="M105 138V108M105 121 90 110M105 126 119 112M220 133V98M220 116 204 103M220 122 236 106M330 139V104M330 119 314 108M330 125 347 109" />
            </g>
          </svg>
        </div>
      </div>
      <div className="dsr-separate-note">
        <span>↗</span>
        <p>
          <b>Establishment ≠ water management.</b> Sowing method alone does not show how a field was
          irrigated or how long it remained flooded.
        </p>
      </div>
      <figcaption>
        Schematic only. Field preparation, water conditions and management vary; any emissions
        comparison needs an applicable method and field evidence.
      </figcaption>
    </figure>
  );
}

export function SatelliteIntelligenceDiagram({ photo }: { photo?: string }) {
  return (
    <figure className="story-diagram satellite-story-diagram">
      <div className="story-diagram-head">
        <span className="earth-label">SATELLITE INTELLIGENCE · CONTEXT, NOT PROOF</span>
        <span className="story-diagram-tag">Concept view · no live imagery</span>
      </div>
      <div className="satellite-story-layout">
        <div className={`satellite-map-frame${photo ? " has-photo" : ""}`}>
          {photo && (
            <>
              <img
                className="satellite-map-photo"
                src={photo}
                alt="AI-generated overhead view of a Punjab rice-field mosaic; illustrative context, not live imagery."
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
              />
              <span className="satellite-photo-caption">ILLUSTRATIVE SATELLITE-STYLE MOSAIC · NOT LIVE DATA</span>
            </>
          )}
          <svg
            className={`satellite-field-illustration${photo ? " is-photo-overlay" : ""}`}
            viewBox="0 0 540 320"
            role="img"
            aria-label="Illustrative parcel boundaries and an observation path over agricultural fields"
          >
          <defs>
            <linearGradient id="fieldA" x1="0" x2="1">
              <stop offset="0" stopColor="#506a3e" />
              <stop offset="1" stopColor="#a4a86c" />
            </linearGradient>
            <pattern
              id="cropRows"
              width="15"
              height="15"
              patternTransform="rotate(29)"
              patternUnits="userSpaceOnUse"
            >
              <path d="M0 0V15" stroke="#ecedd6" strokeOpacity=".16" strokeWidth="4" />
            </pattern>
          </defs>
          <rect width="540" height="320" fill={photo ? "transparent" : "#243b30"} />
          <path d="M10 13 260 4 278 142 28 154Z" fill="url(#fieldA)" fillOpacity={photo ? 0.22 : 1} />
          <path d="M10 13 260 4 278 142 28 154Z" fill="url(#cropRows)" fillOpacity={photo ? 0.5 : 1} />
          <path d="M288 12 516 34 497 164 280 143Z" fill="#8d9770" fillOpacity={photo ? 0.22 : 1} />
          <path d="M288 12 516 34 497 164 280 143Z" fill="url(#cropRows)" fillOpacity={photo ? 0.5 : 1} />
          <path d="M29 167 272 154 298 307 56 300Z" fill="#687b49" fillOpacity={photo ? 0.22 : 1} />
          <path d="M29 167 272 154 298 307 56 300Z" fill="url(#cropRows)" fillOpacity={photo ? 0.5 : 1} />
          <path d="M289 163 498 178 520 307 309 302Z" fill="#a3a06d" fillOpacity={photo ? 0.22 : 1} />
          <path d="M289 163 498 178 520 307 309 302Z" fill="url(#cropRows)" fillOpacity={photo ? 0.5 : 1} />
          <path d="M277 0 285 320M0 158 540 166" stroke="#b9b995" strokeWidth="7" />
          <path d="M19 22 252 13 268 132 38 144Z" fill="none" stroke="#efb467" strokeWidth="2.5" />
          <path
            d="M301 21 504 42 485 151 292 135Z"
            fill="none"
            stroke="#dbe7b6"
            strokeWidth="2.5"
          />
          <path
            d="M46 177 262 166 285 295 67 289Z"
            fill="none"
            stroke="#dbe7b6"
            strokeWidth="2.5"
          />
          <path
            d="M302 174 486 188 505 295 320 290Z"
            fill="none"
            stroke="#dbe7b6"
            strokeWidth="2.5"
          />
          <path
            className="satellite-scanline"
            d="M-5 75H545"
            stroke="#f3c27d"
            strokeDasharray="8 7"
            strokeWidth="2"
          />
          <circle className="satellite-scan-dot" cx="142" cy="75" r="5" fill="#f3c27d" />
          <g className="satellite-caption-box">
            <rect x="25" y="246" width="125" height="34" rx="2" fill="#12241d" fillOpacity=".92" />
            <text x="39" y="267" fill="#f4f1e6" fontSize="11" fontFamily="monospace">
              FIELD A · SAMPLE
            </text>
          </g>
          </svg>
        </div>
        <div className="satellite-story-copy">
          <span className="satellite-date-tag">
            <i /> OBSERVATION WINDOWS
          </span>
          <h3>What a satellite can add</h3>
          <ol>
            <li>
              <b>Boundary context</b>
              <small>Which mapped parcel is being observed?</small>
            </li>
            <li>
              <b>Image quality</b>
              <small>Is the acquisition clear and complete?</small>
            </li>
            <li>
              <b>Seasonal change</b>
              <small>What patterns appear across dates?</small>
            </li>
            <li>
              <b>Field record link</b>
              <small>What ground evidence gives context?</small>
            </li>
          </ol>
          <p>
            Optical imagery can be limited by cloud, timing and resolution. It does not directly
            measure methane or prove a field practice.
          </p>
        </div>
      </div>
      <figcaption>
        Illustrative parcels and observation path. Live satellite analysis is available only through
        the authenticated workspace when real data credentials and suitable imagery are available.
      </figcaption>
    </figure>
  );
}

export function RiceSeasonSatelliteMap() {
  return (
    <figure className="story-diagram rice-season-satellite-map">
      <div className="story-diagram-head">
        <span className="earth-label">FIELD BY FIELD · SEASON BY SEASON</span>
        <span className="story-diagram-tag">Illustrative imagery · not a live comparison</span>
      </div>
      <div className="season-satellite-tiles">
        <figure className="season-satellite-tile">
          <div className="season-satellite-image season-tile-water">
            <img src="/earth/carbon-season-wet.webp" alt="Illustrative overhead view of rice parcels with visible surface water and field boundaries" loading="lazy" />
            <svg viewBox="0 0 720 460" aria-hidden="true">
              <path d="m83 92 207-22 33 128-204 29z" />
              <path d="m355 80 255 24-26 145-251-34z" />
              <path d="m140 250 191-30 52 142-203 22z" />
              <circle cx="287" cy="166" r="7" />
              <path className="season-satellite-trace" d="M48 363c136-80 226-72 315-153s183-73 313-123" />
            </svg>
            <span className="season-tile-label"><i /> SURFACE WATER CONTEXT</span>
          </div>
          <figcaption><b>Tile A</b><span>Parcel edges · water visible</span></figcaption>
        </figure>
        <figure className="season-satellite-tile">
          <div className="season-satellite-image season-tile-canopy">
            <img src="/earth/carbon-season-irrigated.webp" alt="Illustrative overhead view of crop parcels and irrigation channels" loading="lazy" />
            <svg viewBox="0 0 720 460" aria-hidden="true">
              <path d="m80 67 267 33-20 154-264-25z" />
              <path d="m382 113 238-25 34 165-247 19z" />
              <path d="m108 284 236-34 31 135-248 25z" />
              <circle cx="500" cy="213" r="7" />
              <path className="season-satellite-trace" d="M39 372c142-72 222-62 323-148s175-90 328-138" />
            </svg>
            <span className="season-tile-label"><i /> CROP & CHANNEL CONTEXT</span>
          </div>
          <figcaption><b>Tile B</b><span>Seasonal patterns · channels</span></figcaption>
        </figure>
      </div>
      <div className="season-satellite-legend">
        <span><i className="legend-boundary" />Mapped boundary</span>
        <span><i className="legend-observation" />Observation path</span>
        <p>Two distinct illustrative tiles. They are not the same parcel, date sequence or project record.</p>
      </div>
      <figcaption className="season-satellite-note">
        Satellite observations can add spatial and seasonal context when coverage, timing and image quality are suitable. They do not directly measure methane or prove a field practice.
      </figcaption>
    </figure>
  );
}

const marketStages = [
  ["Farmers", "Consent · field activity"],
  ["FPO / partner", "Local coordination"],
  ["Project team", "Scope · methodology"],
  ["MRV process", "Evidence · reporting"],
  ["Independent body", "Review under criteria"],
  ["Registry", "Possible issuance"],
  ["Buyer", "Potential transaction"],
];

export function FarmerMarketWorkflowDiagram() {
  return (
    <figure className="story-diagram market-workflow-diagram">
      <div className="story-diagram-head">
        <span className="earth-label">FARMER-TO-MARKET · POTENTIAL PROJECT PATHWAY</span>
        <span className="story-diagram-tag">Program dependent</span>
      </div>
      <div
        className="market-workflow-track"
        role="list"
        aria-label="Potential farmer-to-market project workflow"
      >
        {marketStages.map(([title, detail], index) => (
          <div className="market-stage" key={title} role="listitem">
            <span className="market-stage-no">0{index + 1}</span>
            <span className="market-stage-mark" aria-hidden="true">
              {["⌂", "◌", "◇", "⌁", "✓", "▤", "↗"][index]}
            </span>
            <b>{title}</b>
            <small>{detail}</small>
            {index < marketStages.length - 1 && (
              <span className="market-connector" aria-hidden="true">
                →
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="market-workflow-note">
        <b>Possible sequence, not a promise.</b> Participation, methodology approval, independent
        review, registry issuance and any commercial sale are separate steps. The diagram does not
        represent active partners or buyers.
      </div>
      <figcaption>
        Project roles and order depend on the selected program, agreements and applicable registry
        process.
      </figcaption>
    </figure>
  );
}
