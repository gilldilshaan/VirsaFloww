import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/transplanting-generated.jpg";
import fieldPortraitPhoto from "@/assets/field-story/woman-standing-rice-field.webp";
import harvestPhoto from "@/assets/field-story/tractor-punjab.webp";
import { enquiryDestination } from "@/lib/earth/enquiry";
import {
  ACRES_MAX,
  ACRES_MIN,
  scenarioDefaults,
  MODEL_REVIEWED,
  MODEL_VERSION,
  assumptionRegistry,
  cropPatterns,
  estimate,
  geography,
  inr,
  practices,
  totals,
  validateInputs,
  type CropPattern,
  type Inputs,
  type Opportunity,
  type Practice,
} from "@/lib/earth/opportunity";

const statusLabel: Record<Opportunity["status"], string> = {
  potential: "Illustrative scenario",
  not_estimable: "Not yet estimable",
  eligibility_unassessed: "Eligibility not yet assessed",
};
const num = (s: string) => (s.trim() === "" ? undefined : Number(s));

function NumField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  step = "any",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  error?: string | undefined;
  step?: string;
}) {
  return (
    <label className="opp-field" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={0}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
      />
      {hint && <small>{hint}</small>}
      {error && <em role="alert">{error}</em>}
    </label>
  );
}

function CountUp({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      from.current = value;
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 700);
      const e = 1 - Math.pow(1 - k, 3);
      setShown(a + (value - a) * e);
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      from.current = value;
    };
  }, [value]);
  return <>{inr(shown)}</>;
}

export function OpportunityEstimator() {
  const [acres, setAcres] = useState("9");
  const [state, setState] = useState("Punjab");
  const [district, setDistrict] = useState("Faridkot");
  const [village, setVillage] = useState("");
  const [crop, setCrop] = useState<CropPattern>("wheat-paddy");
  const [picked, setPicked] = useState<Practice[]>(["awd"]);
  const [stage, setStage] = useState<"planned" | "implemented">("planned");
  const [carbon, setCarbon] = useState({
    eligibleAcres: "",
    creditsPerAcre: "",
    pricePerCredit: "",
    farmerSharePct: "",
  });
  const [costs, setCosts] = useState({ currentPerAcre: "", plannedPerAcre: "" });
  const [finance, setFinance] = useState({
    principal: "",
    currentRatePct: "",
    newRatePct: "",
    years: "",
  });
  const [open, setOpen] = useState<string | null>(null);

  const inputs: Inputs = useMemo(() => {
    const strip = <T extends Record<string, string>>(o: T) =>
      Object.fromEntries(
        Object.entries(o)
          .map(([k, v]) => [k, num(v)])
          .filter(([, v]) => v !== undefined),
      );
    return {
      acres: Number(acres),
      state,
      district,
      crop,
      practices: picked,
      status: stage,
      carbon: strip(carbon),
      costs: strip(costs),
      finance: strip(finance),
    };
  }, [acres, state, district, crop, picked, stage, carbon, costs, finance]);
  const errors = validateInputs(inputs);
  const valid = Object.keys(errors).length === 0;
  const results = valid ? estimate(inputs) : [];
  const t = totals(results);
  const carbonResult = results.find((r) => r.id === "carbon");
  const districts = geography.find((g) => g.state === state)?.districts ?? [];

  const toggle = (p: Practice) =>
    setPicked((cur) =>
      p === "undecided"
        ? ["undecided"]
        : cur.includes(p)
          ? cur.filter((x) => x !== p)
          : [...cur.filter((x) => x !== "undecided"), p],
    );

  return (
    <div className="opp-page">
      <section className="opp-hero">
        <img
          src={heroImage}
          alt="AI-generated illustrative farm workers transplanting rice seedlings into a prepared paddy"
          width={1792}
          height={1024}
          className="earth-hero-image"
        />
        <div className="opp-hero-scrim" />
        <div className="earth-container opp-hero-copy earth-hero-copy">
          <span className="earth-label">VIRSAFLOW · FARMER OPPORTUNITY ESTIMATOR</span>
          <h1>
            Your land. Your practices. <em>Your potential opportunities.</em>
          </h1>
          <p>
            Explore potential agricultural program benefits based on your farm size, crop pattern,
            and planned practices. Every estimate comes with transparent assumptions, clear
            eligibility conditions, and an explanation of what is known versus what remains
            uncertain.
          </p>
          <p className="opp-disclaimer">
            Illustrative estimates only. Actual outcomes depend on farm conditions, program
            eligibility, methodology requirements, independent verification, market prices, and
            applicable scheme rules. Estimates are not guaranteed earnings or financial advice.
          </p>
        </div>
      </section>

      <section className="earth-container opp-quick">
        <div className="opp-quick-inputs">
          <span className="earth-label">QUICK ESTIMATE</span>
          <h2>Just tell us your land.</h2>
          <label className="opp-big-field">
            <span>Total land area</span>
            <div>
              <input
                type="number"
                inputMode="decimal"
                min={ACRES_MIN}
                step="0.1"
                value={acres}
                onChange={(e) => setAcres(e.target.value)}
                aria-invalid={!!errors["acres"]}
              />
              <b>acres</b>
            </div>
          </label>
          <input
            type="range"
            min={ACRES_MIN}
            max={50}
            step={0.5}
            value={Math.min(Number(acres) || ACRES_MIN, 50)}
            onChange={(e) => setAcres(e.target.value)}
            aria-label="Land area slider"
          />
          {errors["acres"] && (
            <em role="alert" className="opp-error">
              {errors["acres"]}
            </em>
          )}
          <label className="opp-big-field">
            <span>Farmer share of credit proceeds</span>
            <div>
              <input
                type="number"
                min={0}
                max={100}
                value={carbon.farmerSharePct || String(scenarioDefaults.farmerSharePct)}
                onChange={(e) => setCarbon({ ...carbon, farmerSharePct: e.target.value })}
                aria-invalid={!!errors["farmerSharePct"]}
              />
              <b>%</b>
            </div>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={Number(carbon.farmerSharePct || scenarioDefaults.farmerSharePct)}
            onChange={(e) => setCarbon({ ...carbon, farmerSharePct: e.target.value })}
            aria-label="Farmer share slider"
          />
          <div className="opp-chips" role="radiogroup" aria-label="Crop pattern quick">
            {(Object.keys(cropPatterns) as CropPattern[])
              .filter((k) => k !== "other")
              .map((k) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={crop === k}
                  key={k}
                  className={crop === k ? "on" : ""}
                  onClick={() => setCrop(k)}
                >
                  {cropPatterns[k].label}
                </button>
              ))}
          </div>
        </div>
        <div className="opp-quick-result" aria-live="polite">
          <span className="earth-label">POTENTIAL CARBON PROCEEDS · PER YEAR</span>
          <div className="opp-quick-number">
            {valid && carbonResult?.amount != null ? <CountUp value={carbonResult.amount} /> : "—"}
          </div>
          {valid && carbonResult?.amount != null && (
            <div className="opp-quick-math">
              {carbonResult.inputs.map((l) => (
                <span key={l.label}>
                  <b>{l.value}</b>
                  {l.label.toLowerCase()}
                  <i>{l.source}</i>
                </span>
              ))}
            </div>
          )}
          <div className="opp-quick-bar">
            <i style={{ width: `${Math.min(100, (Number(acres) || 0) * 2)}%` }} />
          </div>
          <p>
            Illustrative scenario using VirsaFlow’s current planning assumptions (
            {scenarioDefaults.creditsPerAcre[crop] ?? "—"} credits per acre,{" "}
            {inr(scenarioDefaults.pricePerCredit)} per credit). Not a promise of income — actual
            credits need eligible practices, monitoring, verification and a buyer. Edit any value
            below.
          </p>
        </div>
      </section>

      <section
        className="earth-container opp-photos"
        aria-label="Agricultural contexts behind an estimate"
      >
        {[
          [
            fieldPortraitPhoto,
            "Crop context",
            "Farm conditions shape every scenario.",
            "A farmer standing among green rice rows.",
          ],
          [
            harvestPhoto,
            "Harvest context",
            "A scenario does not represent a measured outcome.",
            "A tractor moving through a harvested field in Punjab.",
          ],
        ].map(([src, label, caption, alt]) => (
          <figure key={src}>
            <img src={src} alt={alt} width={1200} height={900} loading="lazy" decoding="async" />
            <figcaption>
              <b>{label}</b>
              <span>{caption}</span>
            </figcaption>
          </figure>
        ))}
      </section>

      <section className="earth-section earth-container opp-layout">
        <form className="opp-form" onSubmit={(e) => e.preventDefault()} aria-label="Farm profile">
          <fieldset>
            <legend>
              <span>01</span> Tell us about your farm
            </legend>
            <div className="opp-acres">
              <NumField
                id="acres"
                label="Farm area (acres)"
                value={acres}
                onChange={setAcres}
                error={errors["acres"]}
                step="0.1"
              />
              <input
                type="range"
                min={ACRES_MIN}
                max={50}
                step={0.1}
                value={Math.min(Number(acres) || ACRES_MIN, 50)}
                onChange={(e) => setAcres(e.target.value)}
                aria-label="Farm area slider"
              />
              <small>
                {ACRES_MIN}–{ACRES_MAX} acres. Slider covers up to 50; type larger values.
              </small>
            </div>
            <div className="opp-row">
              <label className="opp-field">
                <span>State</span>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setDistrict(
                      geography.find((g) => g.state === e.target.value)?.districts[0] ??
                        "Other / not listed",
                    );
                  }}
                >
                  {geography.map((g) => (
                    <option key={g.state}>{g.state}</option>
                  ))}
                </select>
              </label>
              <label className="opp-field">
                <span>District</span>
                <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                  {districts.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                  <option>Other / not listed</option>
                </select>
              </label>
              <label className="opp-field">
                <span>Block or village (optional)</span>
                <input
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  maxLength={80}
                />
              </label>
            </div>
            <p className="opp-note">
              Location is used for pilot matching and program discovery only. It does not raise or
              lower any estimate — no district has validated local parameters yet.
            </p>
            <div className="opp-field">
              <span>Crop pattern</span>
              <div className="opp-chips" role="radiogroup" aria-label="Crop pattern">
                {(Object.keys(cropPatterns) as CropPattern[]).map((k) => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={crop === k}
                    key={k}
                    className={crop === k ? "on" : ""}
                    onClick={() => setCrop(k)}
                  >
                    {cropPatterns[k].label}
                    <small>
                      {cropPatterns[k].seasons.length
                        ? `${cropPatterns[k].seasons.length} season${cropPatterns[k].seasons.length > 1 ? "s" : ""}`
                        : "seasons vary"}
                    </small>
                  </button>
                ))}
              </div>
              {errors["crop"] && <em role="alert">{errors["crop"]}</em>}
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <span>02</span> Practices you’re considering
            </legend>
            <div className="opp-practices">
              {(Object.keys(practices) as Practice[]).map((p) => (
                <label key={p} className={picked.includes(p) ? "on" : ""}>
                  <input type="checkbox" checked={picked.includes(p)} onChange={() => toggle(p)} />
                  <strong>{practices[p].label}</strong>
                  <small>{practices[p].plain}</small>
                </label>
              ))}
            </div>
            {errors["practices"] && (
              <em role="alert" className="opp-error">
                {errors["practices"]}
              </em>
            )}
            <div className="opp-chips" role="radiogroup" aria-label="Practice status">
              {(["planned", "implemented"] as const).map((s) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={stage === s}
                  key={s}
                  className={stage === s ? "on" : ""}
                  onClick={() => setStage(s)}
                >
                  {s === "planned" ? "Planning to start" : "Already doing this"}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <span>03</span> Optional: your own numbers
            </legend>
            <p className="opp-note">
              Carbon uses editable planning assumptions. Cost and loan savings appear only when you
              enter your own figures.
            </p>
            <details>
              <summary>Adjust carbon assumptions</summary>
              <div className="opp-row">
                <NumField
                  id="ea"
                  hint="Default: your total land"
                  label="Eligible acres"
                  value={carbon.eligibleAcres}
                  onChange={(v) => setCarbon({ ...carbon, eligibleAcres: v })}
                  error={errors["eligibleAcres"]}
                />
                <NumField
                  id="cpa"
                  hint={`Default ${scenarioDefaults.creditsPerAcre[crop] ?? "none"}`}
                  label="Credits per acre / year"
                  value={carbon.creditsPerAcre}
                  onChange={(v) => setCarbon({ ...carbon, creditsPerAcre: v })}
                />
                <NumField
                  id="ppc"
                  hint={`Default ₹${scenarioDefaults.pricePerCredit}`}
                  label="Price per credit (₹)"
                  value={carbon.pricePerCredit}
                  onChange={(v) => setCarbon({ ...carbon, pricePerCredit: v })}
                />
                <NumField
                  id="fs"
                  hint={`Default ${scenarioDefaults.farmerSharePct}%`}
                  label="Farmer share (%)"
                  value={carbon.farmerSharePct}
                  onChange={(v) => setCarbon({ ...carbon, farmerSharePct: v })}
                  error={errors["farmerSharePct"]}
                />
              </div>
            </details>
            <details>
              <summary>Farming-cost comparison</summary>
              <div className="opp-row">
                <NumField
                  id="cc"
                  label="Current cost per acre per season (₹)"
                  value={costs.currentPerAcre}
                  onChange={(v) => setCosts({ ...costs, currentPerAcre: v })}
                />
                <NumField
                  id="pc"
                  label="Planned cost per acre per season (₹)"
                  value={costs.plannedPerAcre}
                  onChange={(v) => setCosts({ ...costs, plannedPerAcre: v })}
                />
              </div>
            </details>
            <details>
              <summary>Loan comparison</summary>
              <div className="opp-row">
                <NumField
                  id="lp"
                  label="Loan amount (₹)"
                  value={finance.principal}
                  onChange={(v) => setFinance({ ...finance, principal: v })}
                />
                <NumField
                  id="lr"
                  label="Current rate (%)"
                  value={finance.currentRatePct}
                  onChange={(v) => setFinance({ ...finance, currentRatePct: v })}
                />
                <NumField
                  id="nr"
                  label="Offered rate (%)"
                  value={finance.newRatePct}
                  onChange={(v) => setFinance({ ...finance, newRatePct: v })}
                />
                <NumField
                  id="ly"
                  label="Tenure (years)"
                  value={finance.years}
                  onChange={(v) => setFinance({ ...finance, years: v })}
                />
              </div>
            </details>
          </fieldset>
        </form>

        <aside className="opp-results" aria-live="polite">
          <span className="earth-label">ILLUSTRATIVE · MODEL {MODEL_VERSION}</span>
          <h2>Your potential opportunities</h2>
          {!valid ? (
            <p className="opp-empty">Fix the highlighted fields to see your opportunities.</p>
          ) : (
            <>
              <p className="opp-profile">
                {inputs.acres} acres · {cropPatterns[crop].label} · {district}, {state} ·{" "}
                {picked.map((p) => practices[p].label.replace(/ \(.+\)/, "")).join(", ")} (
                {stage === "planned" ? "planned" : "already implemented"})
              </p>
              <div className="opp-totals">
                <div>
                  <small>Potential recurring cash</small>
                  <b>{t.recurringCash ? inr(t.recurringCash) : "—"}</b>
                </div>
                <div>
                  <small>Operating-cost savings</small>
                  <b>{t.operatingSavings ? inr(t.operatingSavings) : "—"}</b>
                </div>
                <div>
                  <small>Financing savings</small>
                  <b>{t.financingSavings ? inr(t.financingSavings) : "—"}</b>
                </div>
                <div>
                  <small>Confirmed one-time support</small>
                  <b>₹0</b>
                </div>
              </div>
              <p className="opp-note">
                These are kept separate on purpose and never added into one “income” figure.
              </p>
              {results.map((r) => (
                <article key={r.id} className={`opp-card ${r.status}`}>
                  <header>
                    <h3>{r.title}</h3>
                    <span className="opp-badge">{statusLabel[r.status]}</span>
                  </header>
                  <div className="opp-amount">
                    {r.amount !== null ? (
                      <>
                        {inr(r.amount)}
                        <small> / {r.period}</small>
                      </>
                    ) : r.status === "eligibility_unassessed" ? (
                      "Check eligibility first"
                    ) : (
                      "Not yet estimable"
                    )}
                  </div>
                  {r.missing.length > 0 && (
                    <p className="opp-missing">Needs: {r.missing.join("; ")}.</p>
                  )}
                  <button
                    type="button"
                    className="opp-more"
                    aria-expanded={open === r.id}
                    onClick={() => setOpen(open === r.id ? null : r.id)}
                  >
                    How this is calculated <ChevronDown size={14} />
                  </button>
                  {open === r.id && (
                    <div className="opp-detail">
                      <p>
                        <b>Formula:</b> {r.formula}
                      </p>
                      {r.inputs.length > 0 && (
                        <table>
                          <tbody>
                            {r.inputs.map((l) => (
                              <tr key={l.label}>
                                <td>{l.label}</td>
                                <td>
                                  {l.value} {l.unit}
                                </td>
                                <td>
                                  <i>{l.source}</i>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      <ul>
                        {r.conditions.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                      <p>
                        <b>What we’d need to verify this:</b> {r.verifyNeeds.join(", ")}.
                      </p>
                      <p className="opp-reviewed">Model reviewed {MODEL_REVIEWED}</p>
                    </div>
                  )}
                </article>
              ))}
            </>
          )}
        </aside>
      </section>

      <section className="earth-section earth-container">
        <div className="earth-section-heading">
          <div>
            <span className="earth-label">ASSUMPTIONS & METHODOLOGY</span>
            <h2>What VirsaFlow still needs to validate.</h2>
          </div>
          <p>
            Before showing real farm estimates, each parameter needs a documented source. Until
            then, the estimator only uses numbers you enter.
          </p>
        </div>
        <div className="opp-registry" role="table">
          {assumptionRegistry.map(([p, n, s]) => (
            <div role="row" key={p}>
              <strong role="cell">{p}</strong>
              <span role="cell">{n}</span>
              <em role="cell">{s}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="earth-section earth-container">
        <div className="earth-section-heading">
          <div>
            <span className="earth-label">ELIGIBILITY & EVIDENCE</span>
            <h2>What it takes to turn potential into proof.</h2>
          </div>
        </div>
        <div className="opp-checklist">
          {[
            [
              "A practice is not an outcome",
              "Adopting DSR or AWD is a change in management, not a verified environmental result.",
            ],
            [
              "A reduction is not a credit",
              "Credits need an approved methodology, monitoring, independent verification, registry issuance and a buyer.",
            ],
            [
              "Prices and shares change",
              "Credit prices and farmer revenue shares depend on project terms and the market.",
            ],
            [
              "Schemes depend on you",
              "Government benefits depend on the specific scheme and your eligibility.",
            ],
            [
              "Records you’ll need",
              "Land and field boundaries, consent, season-long practice records, water-level readings and cost records.",
            ],
            [
              "Estimates aren’t guarantees",
              "Nothing here is a promise of income, credit issuance, subsidy approval or financial return.",
            ],
          ].map(([h, p]) => (
            <article key={h}>
              <h3>{h}</h3>
              <p>{p}</p>
            </article>
          ))}
        </div>
      </section>

      <AssessmentRequest
        acres={inputs.acres}
        crop={cropPatterns[crop].label}
        district={`${district}, ${state}`}
        practicesText={picked.map((p) => practices[p].label).join(", ")}
      />

      <section className="earth-section earth-container">
        <div className="earth-section-heading">
          <div>
            <span className="earth-label">FAQ</span>
            <h2>Common questions.</h2>
          </div>
        </div>
        <div className="opp-faq">
          {[
            [
              "Why don’t you show one income number?",
              "Carbon proceeds, cost savings, avoided interest and scheme support are different kinds of benefit with different conditions. Adding them together would make uncertain benefits look certain.",
            ],
            [
              "Where do the carbon numbers come from?",
              "From VirsaFlow’s current planning assumptions per crop pattern, credit price and farmer share. They are not yet validated against a methodology or real project terms, so you can change any of them.",
            ],
            [
              "Does my district change the estimate?",
              "No. Location helps us match you with pilots. It will only affect estimates once validated local data exists.",
            ],
            [
              "Is my information saved?",
              "No. The estimator runs in your browser. The assessment request only opens an email draft you choose to send.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <div className="opp-links">
          <Link to="/agricultural-mrv">
            Agricultural MRV <ArrowUpRight size={14} />
          </Link>
          <Link to="/carbon-credits">
            Carbon credits <ArrowUpRight size={14} />
          </Link>
          <Link to="/methodology">
            Methodology <ArrowUpRight size={14} />
          </Link>
          <Link to="/privacy">
            Privacy <ArrowUpRight size={14} />
          </Link>
          <Link to="/contact" search={{ interest: "Pilot program" }}>
            Discuss an FPO or pilot partnership <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}

const assistance = [
  "Farm assessment",
  "Joining a pilot program",
  "Understanding practices",
  "FPO partnership",
] as const;

function AssessmentRequest({
  acres,
  crop,
  district,
  practicesText,
}: {
  acres: number;
  crop: string;
  district: string;
  practicesText: string;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [help, setHelp] = useState<string>(assistance[0]);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [mailto, setMailto] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMailto("");
    if (!name.trim()) return setError("Please enter your name.");
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim()) &&
      !/^\+?[\d\s-]{8,15}$/.test(contact.trim())
    )
      return setError("Enter a valid email address or phone number.");
    if (!consent) return setError("Please agree to be contacted.");
    setError("");
    const body = `Name: ${name.trim()}\nContact: ${contact.trim()}\nLocation: ${district}\nApproximate acreage: ${acres}\nCrop pattern: ${crop}\nPractices: ${practicesText}\nAssistance wanted: ${help}\n\nI agree to be contacted by VirsaFlow about this request.`;
    const url = `mailto:${enquiryDestination}?subject=${encodeURIComponent("VirsaFlow | Farm assessment request")}&body=${encodeURIComponent(body)}`;
    setMailto(url);
    window.location.href = url;
  };
  return (
    <section className="earth-section earth-container opp-assess" id="assessment">
      <div>
        <span className="earth-label">NEXT STEP</span>
        <h2>Request a farm assessment.</h2>
        <p>
          We’ll look at which programs may be relevant and what evidence you’d need. Your farm
          profile above is included automatically.
        </p>
        <div className="carbon-hero-actions">
          <Button asChild variant="ghost">
            <Link to="/methodology">
              Explore our methodology <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
      <form onSubmit={submit} noValidate>
        <label className="opp-field">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label className="opp-field">
          <span>Email or phone</span>
          <input value={contact} onChange={(e) => setContact(e.target.value)} />
        </label>
        <label className="opp-field">
          <span>Type of help</span>
          <select value={help} onChange={(e) => setHelp(e.target.value)}>
            {assistance.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>
        <label className="opp-consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />{" "}
          I agree to be contacted by VirsaFlow about this request.
        </label>
        {error && (
          <em role="alert" className="opp-error">
            {error}
          </em>
        )}
        <Button type="submit" variant="earth">
          Request a farm assessment <ArrowUpRight />
        </Button>
        {mailto && (
          <p className="opp-sent" role="status">
            Your email app should open with a draft. Nothing is sent until you press send there.{" "}
            <a href={mailto}>Open the draft again</a>
          </p>
        )}
      </form>
    </section>
  );
}
