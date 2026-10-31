import { n as __toESM } from "../_runtime.mjs";
import { i as performance_default } from "../_libs/h3-v2+rou3+srvx+unenv.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-DbFAHDQB.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { ft as ArrowUpRight, st as ChevronDown } from "../_libs/lucide-react.mjs";
import { a as SiteShell } from "./site-shell-BuAaQje2.mjs";
import { r as enquiryDestination } from "./enquiry-BeeurNGE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calculator-B4EHfYhv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var transplanting_generated_default = "/assets/transplanting-generated-C6HwgLpw.jpg";
var woman_standing_rice_field_default = "/assets/woman-standing-rice-field-ciPZ4mcu.webp";
var tractor_punjab_default = "/assets/tractor-punjab-CEN56KKw.webp";
/**
* Agricultural Opportunity Estimator — pure, browser-safe calculation engine.
* No financial default is assumed: every number comes from the user or from a
* reviewed entry in the assumption registry. Unvalidated categories return
* "not_estimable" with the inputs that are missing.
*/
var ACRES_MIN = .1;
var MODEL_VERSION = "2026.10-a";
var cropPatterns = {
	"wheat-paddy": {
		label: "Wheat + paddy",
		seasons: ["Rabi wheat", "Kharif paddy"]
	},
	"paddy": {
		label: "Paddy only",
		seasons: ["Kharif paddy"]
	},
	"wheat": {
		label: "Wheat only",
		seasons: ["Rabi wheat"]
	},
	"other": {
		label: "Other / mixed crops",
		seasons: []
	}
};
/** Scenario defaults from The Carbon Credit's original model — labelled "assumed" and editable; not validated. */
var scenarioDefaults = {
	creditsPerAcre: {
		"wheat-paddy": 1.2,
		paddy: 1.2,
		wheat: .65,
		other: null
	},
	pricePerCredit: 1600,
	farmerSharePct: 80
};
var practices = {
	dsr: {
		label: "Direct Seeded Rice (DSR)",
		plain: "Sowing rice seed directly instead of transplanting seedlings into flooded, puddled soil.",
		ricePractice: true
	},
	awd: {
		label: "Alternate Wetting and Drying (AWD)",
		plain: "Letting paddy fields dry partly between irrigations instead of keeping them flooded all season.",
		ricePractice: true
	},
	"zero-till": {
		label: "Zero tillage",
		plain: "Sowing the next crop without ploughing, often into the previous crop’s residue.",
		ricePractice: false
	},
	residue: {
		label: "Residue or straw management",
		plain: "Handling straw without burning — for example mulching, incorporation or removal.",
		ricePractice: false
	},
	other: {
		label: "Other eligible practices",
		plain: "Another practice you or your FPO are considering.",
		ricePractice: false
	},
	undecided: {
		label: "Not decided yet",
		plain: "You would like help understanding which practices could suit your farm.",
		ricePractice: false
	}
};
/** Geography is used for pilot matching only — no district has validated parameters yet. */
var geography = [
	{
		state: "Punjab",
		districts: [
			"Faridkot",
			"Bathinda",
			"Ferozepur",
			"Ludhiana",
			"Moga",
			"Sangrur"
		]
	},
	{
		state: "Haryana",
		districts: [
			"Karnal",
			"Kaithal",
			"Kurukshetra"
		]
	},
	{
		state: "Other / not listed",
		districts: []
	}
];
function validateInputs(i) {
	const e = {};
	const a = i.acres;
	if (typeof a !== "number" || !Number.isFinite(a)) e["acres"] = "Enter your farm area as a number.";
	else if (a < .1) e["acres"] = `Farm area must be at least ${ACRES_MIN} acres.`;
	else if (a > 500) e["acres"] = `Farm area must be 500 acres or less.`;
	if (!i.crop || !(i.crop in cropPatterns)) e["crop"] = "Choose a crop pattern.";
	if (!i.practices || i.practices.length === 0) e["practices"] = "Choose at least one practice, or “Not decided yet”.";
	const c = i.carbon;
	if (c?.eligibleAcres !== void 0 && typeof a === "number" && c.eligibleAcres > a) e["eligibleAcres"] = "Eligible area cannot be larger than your farm.";
	if (c?.farmerSharePct !== void 0 && (c.farmerSharePct < 0 || c.farmerSharePct > 100)) e["farmerSharePct"] = "Farmer share must be between 0 and 100%.";
	for (const [k, v] of Object.entries({
		...c,
		...i.costs,
		...i.finance
	})) if (v !== void 0 && (!Number.isFinite(v) || v < 0)) e[k] = "Enter a positive number.";
	return e;
}
var round = (n) => Math.round(n);
var inr = (n) => `₹${round(n).toLocaleString("en-IN")}`;
var allSet = (o, keys) => !!o && keys.every((k) => typeof o[k] === "number" && Number.isFinite(o[k]));
function estimate(i) {
	const seasons = cropPatterns[i.crop].seasons.length;
	const hasRice = i.crop === "paddy" || i.crop === "wheat-paddy";
	const riceSelected = i.practices.some((p) => practices[p].ricePractice);
	const defCredits = scenarioDefaults.creditsPerAcre[i.crop] ?? void 0;
	const src = (v) => v === void 0 ? "assumed" : "user-provided";
	const raw = i.carbon ?? {};
	const c = {
		eligibleAcres: raw.eligibleAcres ?? i.acres,
		creditsPerAcre: raw.creditsPerAcre ?? defCredits,
		pricePerCredit: raw.pricePerCredit ?? scenarioDefaults.pricePerCredit,
		farmerSharePct: raw.farmerSharePct ?? scenarioDefaults.farmerSharePct
	};
	const carbonReady = allSet(c, [
		"eligibleAcres",
		"creditsPerAcre",
		"pricePerCredit",
		"farmerSharePct"
	]);
	const carbonAmount = carbonReady ? c.eligibleAcres * c.creditsPerAcre * c.pricePerCredit * (c.farmerSharePct / 100) : null;
	const carbon = {
		id: "carbon",
		title: "Potential carbon proceeds",
		kind: carbonReady ? "potential_revenue" : "not_estimable",
		status: carbonReady ? "potential" : "not_estimable",
		period: "annual",
		amount: carbonAmount,
		formula: "Eligible acres × credits per acre × price per credit × farmer share",
		inputs: carbonReady ? [
			{
				label: "Eligible acres",
				value: String(c.eligibleAcres),
				unit: "acres",
				source: "user-provided"
			},
			{
				label: "Credits per acre",
				value: String(c.creditsPerAcre),
				unit: "tCO₂e/acre/yr",
				source: src(raw.creditsPerAcre)
			},
			{
				label: "Price per credit",
				value: inr(c.pricePerCredit),
				unit: "per credit",
				source: src(raw.pricePerCredit)
			},
			{
				label: "Farmer share",
				value: `${c.farmerSharePct}%`,
				unit: "of net proceeds",
				source: src(raw.farmerSharePct)
			}
		] : [],
		missing: carbonReady ? [] : ["Credits per acre for your crop pattern — enter your own value to explore a scenario"],
		conditions: [
			!hasRice ? "Methane methodologies for rice do not apply to your selected crop pattern." : !riceSelected ? "No rice water-management practice (DSR or AWD) is selected." : "Eligible practice must be implemented and monitored all season.",
			"Requires an approved methodology, baseline, independent verification, registry issuance and a buyer.",
			"Estimated reductions are not issued credits; issued credits are not sold credits."
		],
		verifyNeeds: [
			"Field boundaries and consent",
			"Season-long water-level and practice records",
			"Baseline under the chosen methodology",
			"Independent verification"
		]
	};
	const k = i.costs;
	const costReady = allSet(k, ["currentPerAcre", "plannedPerAcre"]);
	const seasonsUsed = Math.max(seasons, 1);
	const costAmount = costReady ? (k.currentPerAcre - k.plannedPerAcre) * i.acres * seasonsUsed : null;
	const costs = {
		id: "costs",
		title: "Potential farming-cost changes",
		kind: costReady ? "operating_savings" : "not_estimable",
		status: costReady ? "potential" : "not_estimable",
		period: "annual",
		amount: costAmount,
		formula: "(Current cost per acre − planned cost per acre) × acres × seasons",
		inputs: costReady ? [
			{
				label: "Current cost",
				value: inr(k.currentPerAcre),
				unit: "per acre per season",
				source: "user-provided"
			},
			{
				label: "Planned cost",
				value: inr(k.plannedPerAcre),
				unit: "per acre per season",
				source: "user-provided"
			},
			{
				label: "Farm area",
				value: String(i.acres),
				unit: "acres",
				source: "user-provided"
			},
			{
				label: "Seasons",
				value: String(seasonsUsed),
				unit: "per year",
				source: "user-provided"
			}
		] : [],
		missing: costReady ? [] : ["Your current cost per acre (seed, labour, machinery, fuel, irrigation, inputs)", "Your expected cost per acre with the new practice"],
		conditions: [
			"A negative value means the planned practice costs more.",
			"Yield changes are not included.",
			"No practice lowers costs on every farm."
		],
		verifyNeeds: ["Cost records for the current practice", "Comparable records after the change"]
	};
	const mandi = {
		id: "mandi",
		title: "Potential market or mandi benefits",
		kind: "not_estimable",
		status: "not_estimable",
		period: "per season",
		amount: null,
		formula: "Not calculated",
		inputs: [],
		missing: ["Documented comparison price for your crop, market and quality"],
		conditions: ["Mandi prices, quality, yield and buyer arrangements vary."],
		verifyNeeds: ["Market evidence and a defined comparison"]
	};
	const f = i.finance;
	const finReady = allSet(f, [
		"principal",
		"currentRatePct",
		"newRatePct",
		"years"
	]);
	const finAmount = finReady ? f.principal * ((f.currentRatePct - f.newRatePct) / 100) : null;
	return [
		carbon,
		costs,
		mandi,
		{
			id: "finance",
			title: "Financing and interest savings",
			kind: finReady ? "financing_savings" : "not_estimable",
			status: finReady ? "potential" : "not_estimable",
			period: "annual",
			amount: finAmount,
			formula: "Loan principal × (current rate − new rate), simple annual interest",
			inputs: finReady ? [
				{
					label: "Principal",
					value: inr(f.principal),
					unit: "",
					source: "user-provided"
				},
				{
					label: "Current rate",
					value: `${f.currentRatePct}%`,
					unit: "per year",
					source: "user-provided"
				},
				{
					label: "New rate",
					value: `${f.newRatePct}%`,
					unit: "per year",
					source: "user-provided"
				},
				{
					label: "Tenure",
					value: String(f.years),
					unit: "years",
					source: "user-provided"
				}
			] : [],
			missing: finReady ? [] : ["Loan amount, current rate, offered rate and tenure"],
			conditions: ["Avoided interest is a cost saving, not extra income.", "Assumes the loan is approved on those terms."],
			verifyNeeds: ["Current loan statement", "Written offer of new terms"]
		},
		{
			id: "schemes",
			title: "Government schemes and grants",
			kind: "one_time_support",
			status: "eligibility_unassessed",
			period: "one-time",
			amount: null,
			formula: "Not calculated",
			inputs: [],
			missing: ["Named scheme, administering authority and current eligibility rules"],
			conditions: ["Scheme support is never added to recurring income.", "No entitlement is implied until approval is confirmed."],
			verifyNeeds: [
				"Official scheme source",
				"Eligibility documents",
				"Application and approval record"
			]
		}
	];
}
/** Separate totals only — never one combined “income” figure. Unconfirmed schemes are excluded. */
function totals(results) {
	const sum = (kind) => results.filter((r) => r.kind === kind && r.amount !== null).reduce((s, r) => s + r.amount, 0);
	return {
		recurringCash: sum("potential_revenue"),
		operatingSavings: sum("operating_savings"),
		financingSavings: sum("financing_savings"),
		confirmedOneTime: 0
	};
}
var assumptionRegistry = [
	[
		"Carbon potential per acre",
		"Applicable methodology and defensible baseline/project assumptions",
		"Not validated"
	],
	[
		"Credit sale price",
		"Source, date, currency and gross vs net",
		"Not validated"
	],
	[
		"Farmer revenue share",
		"Documented project terms and deductions",
		"Not validated"
	],
	[
		"Practice cost difference",
		"Comparable farm-level cost data",
		"User-provided only"
	],
	[
		"Mandi advantage",
		"Market evidence and a defined comparison",
		"Not validated"
	],
	[
		"Financing savings",
		"Actual loan terms and a defined counterfactual",
		"User-provided only"
	],
	[
		"Scheme support",
		"Named scheme, current eligibility and official source",
		"Not validated"
	]
];
var statusLabel = {
	potential: "Illustrative scenario",
	not_estimable: "Not yet estimable",
	eligibility_unassessed: "Eligibility not yet assessed"
};
var num = (s) => s.trim() === "" ? void 0 : Number(s);
function NumField({ id, label, value, onChange, hint, error, step = "any" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "opp-field",
		htmlFor: id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id,
				type: "number",
				inputMode: "decimal",
				min: 0,
				step,
				value,
				onChange: (e) => onChange(e.target.value),
				"aria-invalid": !!error
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: hint }),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
				role: "alert",
				children: error
			})
		]
	});
}
function CountUp({ value }) {
	const [shown, setShown] = (0, import_react.useState)(value);
	const from = (0, import_react.useRef)(value);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setShown(value);
			from.current = value;
			return;
		}
		const start = performance_default.now();
		const a = from.current;
		let raf = 0;
		const tick = (t) => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: inr(shown) });
}
function OpportunityEstimator() {
	const [acres, setAcres] = (0, import_react.useState)("9");
	const [state, setState] = (0, import_react.useState)("Punjab");
	const [district, setDistrict] = (0, import_react.useState)("Faridkot");
	const [village, setVillage] = (0, import_react.useState)("");
	const [crop, setCrop] = (0, import_react.useState)("wheat-paddy");
	const [picked, setPicked] = (0, import_react.useState)(["awd"]);
	const [stage, setStage] = (0, import_react.useState)("planned");
	const [carbon, setCarbon] = (0, import_react.useState)({
		eligibleAcres: "",
		creditsPerAcre: "",
		pricePerCredit: "",
		farmerSharePct: ""
	});
	const [costs, setCosts] = (0, import_react.useState)({
		currentPerAcre: "",
		plannedPerAcre: ""
	});
	const [finance, setFinance] = (0, import_react.useState)({
		principal: "",
		currentRatePct: "",
		newRatePct: "",
		years: ""
	});
	const [open, setOpen] = (0, import_react.useState)(null);
	const inputs = (0, import_react.useMemo)(() => {
		const strip = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, num(v)]).filter(([, v]) => v !== void 0));
		return {
			acres: Number(acres),
			state,
			district,
			crop,
			practices: picked,
			status: stage,
			carbon: strip(carbon),
			costs: strip(costs),
			finance: strip(finance)
		};
	}, [
		acres,
		state,
		district,
		crop,
		picked,
		stage,
		carbon,
		costs,
		finance
	]);
	const errors = validateInputs(inputs);
	const valid = Object.keys(errors).length === 0;
	const results = valid ? estimate(inputs) : [];
	const t = totals(results);
	const carbonResult = results.find((r) => r.id === "carbon");
	const districts = geography.find((g) => g.state === state)?.districts ?? [];
	const toggle = (p) => setPicked((cur) => p === "undecided" ? ["undecided"] : cur.includes(p) ? cur.filter((x) => x !== p) : [...cur.filter((x) => x !== "undecided"), p]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "opp-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "opp-hero",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: transplanting_generated_default,
						alt: "AI-generated illustrative farm workers transplanting rice seedlings into a prepared paddy",
						width: 1792,
						height: 1024,
						className: "earth-hero-image"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "opp-hero-scrim" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "earth-container opp-hero-copy earth-hero-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "earth-label",
								children: "THE CARBON CREDIT · FARMER OPPORTUNITY ESTIMATOR"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: ["Your land. Your practices. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Your potential opportunities." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Explore potential agricultural program benefits based on your farm size, crop pattern, and planned practices. Every estimate comes with transparent assumptions, clear eligibility conditions, and an explanation of what is known versus what remains uncertain." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "opp-disclaimer",
								children: "Illustrative estimates only. Actual outcomes depend on farm conditions, program eligibility, methodology requirements, independent verification, market prices, and applicable scheme rules. Estimates are not guaranteed earnings or financial advice."
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-container opp-quick",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "opp-quick-inputs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "earth-label",
							children: "QUICK ESTIMATE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Just tell us your land." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "opp-big-field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total land area" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								inputMode: "decimal",
								min: ACRES_MIN,
								step: "0.1",
								value: acres,
								onChange: (e) => setAcres(e.target.value),
								"aria-invalid": !!errors["acres"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "acres" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: ACRES_MIN,
							max: 50,
							step: .5,
							value: Math.min(Number(acres) || .1, 50),
							onChange: (e) => setAcres(e.target.value),
							"aria-label": "Land area slider"
						}),
						errors["acres"] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
							role: "alert",
							className: "opp-error",
							children: errors["acres"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "opp-big-field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Farmer share of credit proceeds" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								max: 100,
								value: carbon.farmerSharePct || String(scenarioDefaults.farmerSharePct),
								onChange: (e) => setCarbon({
									...carbon,
									farmerSharePct: e.target.value
								}),
								"aria-invalid": !!errors["farmerSharePct"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "%" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 100,
							step: 5,
							value: Number(carbon.farmerSharePct || scenarioDefaults.farmerSharePct),
							onChange: (e) => setCarbon({
								...carbon,
								farmerSharePct: e.target.value
							}),
							"aria-label": "Farmer share slider"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "opp-chips",
							role: "radiogroup",
							"aria-label": "Crop pattern quick",
							children: Object.keys(cropPatterns).filter((k) => k !== "other").map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "radio",
								"aria-checked": crop === k,
								className: crop === k ? "on" : "",
								onClick: () => setCrop(k),
								children: cropPatterns[k].label
							}, k))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "opp-quick-result",
					"aria-live": "polite",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "earth-label",
							children: "POTENTIAL CARBON PROCEEDS · PER YEAR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "opp-quick-number",
							children: valid && carbonResult?.amount != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, { value: carbonResult.amount }) : "—"
						}),
						valid && carbonResult?.amount != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "opp-quick-math",
							children: carbonResult.inputs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: l.value }),
								l.label.toLowerCase(),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: l.source })
							] }, l.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "opp-quick-bar",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${Math.min(100, (Number(acres) || 0) * 2)}%` } })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Illustrative scenario using The Carbon Credit’s current planning assumptions (",
							scenarioDefaults.creditsPerAcre[crop] ?? "—",
							" credits per acre,",
							" ",
							inr(scenarioDefaults.pricePerCredit),
							" per credit). Not a promise of income — actual credits need eligible practices, monitoring, verification and a buyer. Edit any value below."
						] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "earth-container opp-photos",
				"aria-label": "Agricultural contexts behind an estimate",
				children: [[
					woman_standing_rice_field_default,
					"Crop context",
					"Farm conditions shape every scenario.",
					"A farmer standing among green rice rows."
				], [
					tractor_punjab_default,
					"Harvest context",
					"A scenario does not represent a measured outcome.",
					"A tractor moving through a harvested field in Punjab."
				]].map(([src, label, caption, alt]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt,
					width: 1200,
					height: 900,
					loading: "lazy",
					decoding: "async"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: caption })] })] }, src))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-section earth-container opp-layout",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "opp-form",
					onSubmit: (e) => e.preventDefault(),
					"aria-label": "Farm profile",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01" }), " Tell us about your farm"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "opp-acres",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
										id: "acres",
										label: "Farm area (acres)",
										value: acres,
										onChange: setAcres,
										error: errors["acres"],
										step: "0.1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: ACRES_MIN,
										max: 50,
										step: .1,
										value: Math.min(Number(acres) || .1, 50),
										onChange: (e) => setAcres(e.target.value),
										"aria-label": "Farm area slider"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
										ACRES_MIN,
										"–",
										500,
										" acres. Slider covers up to 50; type larger values."
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "opp-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "opp-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "State" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: state,
											onChange: (e) => {
												setState(e.target.value);
												setDistrict(geography.find((g) => g.state === e.target.value)?.districts[0] ?? "Other / not listed");
											},
											children: geography.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: g.state }, g.state))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "opp-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "District" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: district,
											onChange: (e) => setDistrict(e.target.value),
											children: [districts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Other / not listed" })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "opp-field",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Block or village (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: village,
											onChange: (e) => setVillage(e.target.value),
											maxLength: 80
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "opp-note",
								children: "Location is used for pilot matching and program discovery only. It does not raise or lower any estimate — no district has validated local parameters yet."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "opp-field",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Crop pattern" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "opp-chips",
										role: "radiogroup",
										"aria-label": "Crop pattern",
										children: Object.keys(cropPatterns).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											role: "radio",
											"aria-checked": crop === k,
											className: crop === k ? "on" : "",
											onClick: () => setCrop(k),
											children: [cropPatterns[k].label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: cropPatterns[k].seasons.length ? `${cropPatterns[k].seasons.length} season${cropPatterns[k].seasons.length > 1 ? "s" : ""}` : "seasons vary" })]
										}, k))
									}),
									errors["crop"] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
										role: "alert",
										children: errors["crop"]
									})
								]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "02" }), " Practices you’re considering"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "opp-practices",
								children: Object.keys(practices).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: picked.includes(p) ? "on" : "",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: picked.includes(p),
											onChange: () => toggle(p)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: practices[p].label }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: practices[p].plain })
									]
								}, p))
							}),
							errors["practices"] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
								role: "alert",
								className: "opp-error",
								children: errors["practices"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "opp-chips",
								role: "radiogroup",
								"aria-label": "Practice status",
								children: ["planned", "implemented"].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									role: "radio",
									"aria-checked": stage === s,
									className: stage === s ? "on" : "",
									onClick: () => setStage(s),
									children: s === "planned" ? "Planning to start" : "Already doing this"
								}, s))
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "03" }), " Optional: your own numbers"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "opp-note",
								children: "Carbon uses editable planning assumptions. Cost and loan savings appear only when you enter your own figures."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Adjust carbon assumptions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "opp-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
										id: "ea",
										hint: "Default: your total land",
										label: "Eligible acres",
										value: carbon.eligibleAcres,
										onChange: (v) => setCarbon({
											...carbon,
											eligibleAcres: v
										}),
										error: errors["eligibleAcres"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
										id: "cpa",
										hint: `Default ${scenarioDefaults.creditsPerAcre[crop] ?? "none"}`,
										label: "Credits per acre / year",
										value: carbon.creditsPerAcre,
										onChange: (v) => setCarbon({
											...carbon,
											creditsPerAcre: v
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
										id: "ppc",
										hint: `Default ₹${scenarioDefaults.pricePerCredit}`,
										label: "Price per credit (₹)",
										value: carbon.pricePerCredit,
										onChange: (v) => setCarbon({
											...carbon,
											pricePerCredit: v
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
										id: "fs",
										hint: `Default ${scenarioDefaults.farmerSharePct}%`,
										label: "Farmer share (%)",
										value: carbon.farmerSharePct,
										onChange: (v) => setCarbon({
											...carbon,
											farmerSharePct: v
										}),
										error: errors["farmerSharePct"]
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Farming-cost comparison" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "opp-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
									id: "cc",
									label: "Current cost per acre per season (₹)",
									value: costs.currentPerAcre,
									onChange: (v) => setCosts({
										...costs,
										currentPerAcre: v
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
									id: "pc",
									label: "Planned cost per acre per season (₹)",
									value: costs.plannedPerAcre,
									onChange: (v) => setCosts({
										...costs,
										plannedPerAcre: v
									})
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Loan comparison" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "opp-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
										id: "lp",
										label: "Loan amount (₹)",
										value: finance.principal,
										onChange: (v) => setFinance({
											...finance,
											principal: v
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
										id: "lr",
										label: "Current rate (%)",
										value: finance.currentRatePct,
										onChange: (v) => setFinance({
											...finance,
											currentRatePct: v
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
										id: "nr",
										label: "Offered rate (%)",
										value: finance.newRatePct,
										onChange: (v) => setFinance({
											...finance,
											newRatePct: v
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
										id: "ly",
										label: "Tenure (years)",
										value: finance.years,
										onChange: (v) => setFinance({
											...finance,
											years: v
										})
									})
								]
							})] })
						] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "opp-results",
					"aria-live": "polite",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "earth-label",
							children: ["ILLUSTRATIVE · MODEL ", MODEL_VERSION]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Your potential opportunities" }),
						!valid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "opp-empty",
							children: "Fix the highlighted fields to see your opportunities."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "opp-profile",
								children: [
									inputs.acres,
									" acres · ",
									cropPatterns[crop].label,
									" · ",
									district,
									", ",
									state,
									" ·",
									" ",
									picked.map((p) => practices[p].label.replace(/ \(.+\)/, "")).join(", "),
									" (",
									stage === "planned" ? "planned" : "already implemented",
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "opp-totals",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Potential recurring cash" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: t.recurringCash ? inr(t.recurringCash) : "—" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Operating-cost savings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: t.operatingSavings ? inr(t.operatingSavings) : "—" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Financing savings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: t.financingSavings ? inr(t.financingSavings) : "—" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Confirmed one-time support" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "₹0" })] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "opp-note",
								children: "These are kept separate on purpose and never added into one “income” figure."
							}),
							results.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: `opp-card ${r.status}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: r.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "opp-badge",
										children: statusLabel[r.status]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "opp-amount",
										children: r.amount !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [inr(r.amount), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [" / ", r.period] })] }) : r.status === "eligibility_unassessed" ? "Check eligibility first" : "Not yet estimable"
									}),
									r.missing.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "opp-missing",
										children: [
											"Needs: ",
											r.missing.join("; "),
											"."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "opp-more",
										"aria-expanded": open === r.id,
										onClick: () => setOpen(open === r.id ? null : r.id),
										children: ["How this is calculated ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 14 })]
									}),
									open === r.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "opp-detail",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Formula:" }),
												" ",
												r.formula
											] }),
											r.inputs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: r.inputs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: l.label }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [
													l.value,
													" ",
													l.unit
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: l.source }) })
											] }, l.label)) }) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: r.conditions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: c }, c)) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "What we’d need to verify this:" }),
												" ",
												r.verifyNeeds.join(", "),
												"."
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "opp-reviewed",
												children: ["Model reviewed ", "2026-10-09"]
											})
										]
									})
								]
							}, r.id))
						] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-section earth-container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "earth-section-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "earth-label",
						children: "ASSUMPTIONS & METHODOLOGY"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "What The Carbon Credit still needs to validate." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Before showing real farm estimates, each parameter needs a documented source. Until then, the estimator only uses numbers you enter." })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "opp-registry",
					role: "table",
					children: assumptionRegistry.map(([p, n, s]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								role: "cell",
								children: p
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								role: "cell",
								children: n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
								role: "cell",
								children: s
							})
						]
					}, p))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-section earth-container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "earth-section-heading",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "earth-label",
						children: "ELIGIBILITY & EVIDENCE"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "What it takes to turn potential into proof." })] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "opp-checklist",
					children: [
						["A practice is not an outcome", "Adopting DSR or AWD is a change in management, not a verified environmental result."],
						["A reduction is not a credit", "Credits need an approved methodology, monitoring, independent verification, registry issuance and a buyer."],
						["Prices and shares change", "Credit prices and farmer revenue shares depend on project terms and the market."],
						["Schemes depend on you", "Government benefits depend on the specific scheme and your eligibility."],
						["Records you’ll need", "Land and field boundaries, consent, season-long practice records, water-level readings and cost records."],
						["Estimates aren’t guarantees", "Nothing here is a promise of income, credit issuance, subsidy approval or financial return."]
					].map(([h, p]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: h }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p })] }, h))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssessmentRequest, {
				acres: inputs.acres,
				crop: cropPatterns[crop].label,
				district: `${district}, ${state}`,
				practicesText: picked.map((p) => practices[p].label).join(", ")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-section earth-container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "earth-section-heading",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "earth-label",
							children: "FAQ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Common questions." })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "opp-faq",
						children: [
							["Why don’t you show one income number?", "Carbon proceeds, cost savings, avoided interest and scheme support are different kinds of benefit with different conditions. Adding them together would make uncertain benefits look certain."],
							["Where do the carbon numbers come from?", "From The Carbon Credit’s current planning assumptions per crop pattern, credit price and farmer share. They are not yet validated against a methodology or real project terms, so you can change any of them."],
							["Does my district change the estimate?", "No. Location helps us match you with pilots. It will only affect estimates once validated local data exists."],
							["Is my information saved?", "No. The estimator runs in your browser. The assessment request only opens an email draft you choose to send."]
						].map(([q, a]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: q }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: a })] }, q))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "opp-links",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/agricultural-mrv",
								children: ["Agricultural MRV ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 14 })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/carbon-credits",
								children: ["Carbon credits ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 14 })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/methodology",
								children: ["Methodology ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 14 })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/privacy",
								children: ["Privacy ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 14 })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/contact",
								search: { interest: "Pilot program" },
								children: ["Discuss an FPO or pilot partnership ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 14 })]
							})
						]
					})
				]
			})
		]
	});
}
var assistance = [
	"Farm assessment",
	"Joining a pilot program",
	"Understanding practices",
	"FPO partnership"
];
function AssessmentRequest({ acres, crop, district, practicesText }) {
	const [name, setName] = (0, import_react.useState)("");
	const [contact, setContact] = (0, import_react.useState)("");
	const [help, setHelp] = (0, import_react.useState)(assistance[0]);
	const [consent, setConsent] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [mailto, setMailto] = (0, import_react.useState)("");
	const submit = (e) => {
		e.preventDefault();
		setMailto("");
		if (!name.trim()) return setError("Please enter your name.");
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim()) && !/^\+?[\d\s-]{8,15}$/.test(contact.trim())) return setError("Enter a valid email address or phone number.");
		if (!consent) return setError("Please agree to be contacted.");
		setError("");
		const body = `Name: ${name.trim()}\nContact: ${contact.trim()}\nLocation: ${district}\nApproximate acreage: ${acres}\nCrop pattern: ${crop}\nPractices: ${practicesText}\nAssistance wanted: ${help}\n\nI agree to be contacted by The Carbon Credit about this request.`;
		const url = `mailto:${enquiryDestination}?subject=${encodeURIComponent("The Carbon Credit | Farm assessment request")}&body=${encodeURIComponent(body)}`;
		setMailto(url);
		window.location.href = url;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "earth-section earth-container opp-assess",
		id: "assessment",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "earth-label",
				children: "NEXT STEP"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Request a farm assessment." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We’ll look at which programs may be relevant and what evidence you’d need. Your farm profile above is included automatically." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "carbon-hero-actions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/methodology",
						children: ["Explore our methodology ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
					})
				})
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			noValidate: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "opp-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: name,
						onChange: (e) => setName(e.target.value),
						autoComplete: "name"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "opp-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Email or phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: contact,
						onChange: (e) => setContact(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "opp-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Type of help" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: help,
						onChange: (e) => setHelp(e.target.value),
						children: assistance.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: a }, a))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "opp-consent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: consent,
							onChange: (e) => setConsent(e.target.checked)
						}),
						" ",
						"I agree to be contacted by The Carbon Credit about this request."
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
					role: "alert",
					className: "opp-error",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					variant: "earth",
					children: ["Request a farm assessment ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
				}),
				mailto && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "opp-sent",
					role: "status",
					children: [
						"Your email app should open with a draft. Nothing is sent until you press send there.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: mailto,
							children: "Open the draft again"
						})
					]
				})
			]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpportunityEstimator, {}) });
//#endregion
export { SplitComponent as component };
