import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as audiences, l as trustPrinciples, s as solutions } from "./acreon-brand-HLTFfwjE.mjs";
import { t as Button } from "./button-DbFAHDQB.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Cloud, A as MapPinned, E as Pause, N as Leaf, T as Play, U as FileText, Y as Droplets, Z as Database, ct as Check, f as Sprout, ft as ArrowUpRight, gt as ArrowDownRight, h as ShieldCheck, ht as ArrowDown, it as CircleDashed, lt as ChartNoAxesCombined, mt as ArrowLeft, n as Waves, nt as ClipboardCheck, pt as ArrowRight, s as Umbrella, x as Satellite, y as ScanLine, z as GitBranch } from "../_libs/lucide-react.mjs";
import { a as SiteShell, i as SectionHeading, o as TextLink, t as FinalCTA } from "./site-shell-BuAaQje2.mjs";
import { a as LandscapeAnnotations, n as EvidenceGraph, o as platformCapabilities, t as DetailSections } from "./detail-sections-cpc1dhlh.mjs";
import { n as DsrEstablishmentDiagram, o as SatelliteIntelligenceDiagram } from "./visual-diagrams-B3QxME5l.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B_YaqrmH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var rice_aerial_default = "/assets/rice-aerial-CumgBo-I.jpg";
var woman_harvesting_rice_default = "/assets/woman-harvesting-rice-BLXfrqMr.webp";
var rice_field_team_default = "/assets/rice-field-team-DOSxdXih.webp";
var haybales_team_default = "/assets/haybales-team-Dbp0_ksj.webp";
var farmer_walking_field_default = "/assets/farmer-walking-field-_NpL62a4.webp";
var evidence_trail_default = "/assets/evidence-trail-BfhDa-m-.webp";
var satellite_mosaic_default = "/assets/satellite-mosaic-DtmonUGA.webp";
var programs_background_default = "/assets/programs-background-ZULvKhhI.webp";
var trust_background_default = "/assets/trust-background-D-s4D2CH.webp";
var contact_background_default = "/assets/contact-background-Cvo6SopF.webp";
var dsr_direct_seeding_default = "/assets/dsr-direct-seeding-DpE3HZ_x.webp";
var dsr_transplanting_default = "/assets/dsr-transplanting-D8rtf9y1.webp";
var stages = [
	{
		title: "Identify the project",
		Icon: MapPinned,
		evidence: "Farm and participant scope, field boundaries, crop season and eligibility criteria.",
		establishes: "Which fields and participants are in scope.",
		limitation: "A mapped boundary does not establish eligibility or additionality."
	},
	{
		title: "Collect field evidence",
		Icon: ClipboardCheck,
		evidence: "Consent, dated activity logs, field observations, photos and supporting records.",
		establishes: "What was reported or observed, by whom and when.",
		limitation: "A self-reported activity is not independent corroboration."
	},
	{
		title: "Review satellite context",
		Icon: Satellite,
		evidence: "Available imagery dates, field geometry, cloud and quality flags, and relevant observations.",
		establishes: "Spatial and seasonal context where imagery is suitable.",
		limitation: "Vegetation indices do not directly measure emissions or prove a practice."
	},
	{
		title: "Quantify under a method",
		Icon: Waves,
		evidence: "Applicable methodology, baseline, activity data, emission factors, assumptions and uncertainty.",
		establishes: "A documented estimate for the defined scope and period.",
		limitation: "An estimate is not a verified reduction or a credit."
	},
	{
		title: "Independent review",
		Icon: Check,
		evidence: "Traceable monitoring records, calculations, exceptions and reviewer findings.",
		establishes: "Whether the submitted claim meets the selected programme criteria.",
		limitation: "Verification remains a separate decision by an independent body where required."
	},
	{
		title: "Market participation",
		Icon: FileText,
		evidence: "Programme and registry submissions, issuance records and agreed commercial terms.",
		establishes: "The steps a project may take after applicable requirements are met.",
		limitation: "Issuance and sale are separate; neither is guaranteed by documentation."
	}
];
var seasons = [
	["Before sowing", "Confirm field boundaries, season, consent and the project’s evidence requirements."],
	["Establishment", "Record sowing date and method, field preparation and relevant observations."],
	["Crop growth", "Log irrigation and water management where the selected methodology requires them."],
	["Harvest & review", "Close the seasonal record, resolve gaps and retain calculations with their assumptions."]
];
function HomeMRVExperience() {
	const [active, setActive] = (0, import_react.useState)(0);
	const step = stages[active];
	const Icon = step.Icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "earth-section earth-container home-mrv",
		id: "our-approach",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				label: "A SIX-STAGE MRV WORKFLOW",
				title: "Follow the evidence from field to market.",
				description: "Select a stage to see what it can establish, which records support it and where its limits begin."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "home-mrv-layout",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "home-mrv-steps",
					role: "tablist",
					"aria-label": "Agricultural MRV stages",
					children: stages.map(({ title }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "tab",
						"aria-selected": active === index,
						"aria-controls": "home-mrv-detail",
						id: `home-mrv-tab-${index}`,
						onClick: () => setActive(index),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(index + 1).padStart(2, "0") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { size: 16 })
						]
					}, title))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "home-mrv-detail",
					id: "home-mrv-detail",
					role: "tabpanel",
					"aria-labelledby": `home-mrv-tab-${active}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "home-mrv-detail-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "home-mrv-icon",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 22 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "earth-label",
								children: [
									"STAGE ",
									String(active + 1).padStart(2, "0"),
									" / 06"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: step.title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Evidence involved" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: step.evidence })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "What it establishes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: step.establishes })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "home-mrv-limit",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "What it does not" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: step.limitation })]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "home-mrv-progress",
							"aria-label": `Stage ${active + 1} of 6`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${(active + 1) / stages.length * 100}%` } })
						})
					]
				}, active)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "home-mrv-footnote",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDashed, { size: 15 }), " Evidence collection, emission estimates, independent verification, credit issuance and credit sales are distinct steps."]
			})
		]
	});
}
function DsrEducation() {
	const [method, setMethod] = (0, import_react.useState)("direct");
	const direct = method === "direct";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "home-dsr-section",
		id: "dsr",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "earth-container home-dsr-layout",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "home-dsr-header",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "home-dsr-title",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "earth-label",
							children: "PUNJAB · DIRECT SEEDED RICE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
							"One crop.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Different beginnings." })
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "home-dsr-intro",
						children: "Direct Seeded Rice (DSR) establishes rice by sowing seed directly in the field. Transplanted rice moves seedlings from a nursery into prepared fields. The establishment method can affect field operations, but water management remains a separate choice."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "home-dsr-practice",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "home-dsr-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "dsr-method-heading",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "earth-label",
									children: "COMPARE ESTABLISHMENT"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Choose a method to see what changes in the field." })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "dsr-method-tabs",
								role: "tablist",
								"aria-label": "Compare rice establishment methods",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									id: "dsr-tab-transplanting",
									type: "button",
									role: "tab",
									"aria-selected": !direct,
									"aria-controls": "dsr-method-panel",
									onClick: () => setMethod("transplanting"),
									children: "Transplanting"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									id: "dsr-tab-direct",
									type: "button",
									role: "tab",
									"aria-selected": direct,
									"aria-controls": "dsr-method-panel",
									onClick: () => setMethod("direct"),
									children: "Direct seeding"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "dsr-method-detail",
								id: "dsr-method-panel",
								role: "tabpanel",
								"aria-labelledby": direct ? "dsr-tab-direct" : "dsr-tab-transplanting",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: direct ? "Seed is placed directly in the field." : "Seedlings are raised, then transplanted." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: direct ? "This changes crop establishment. Irrigation schedules and field conditions still vary, so DSR alone does not define how long soil stays flooded." : "Transplanting commonly involves puddling and moving nursery-grown seedlings. Actual practice and water regime vary from field to field." })]
							}, method),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "dsr-carbon-caveat",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CARBON CONTEXT" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Under suitable conditions, DSR can reduce methane compared with an appropriate baseline. Results depend on water and crop management, field conditions and the applicable methodology. DSR does not automatically produce carbon credits." })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "dsr-source",
								href: "https://dsrc.irri.org/our-work/issues-opportunities",
								target: "_blank",
								rel: "noreferrer",
								children: ["Read IRRI’s Direct Seeded Rice Consortium notes ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↗" })]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "dsr-practice-photo",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: direct ? dsr_direct_seeding_default : dsr_transplanting_default,
								alt: direct ? "Illustrative tractor-mounted seed drill sowing rice directly into prepared field rows." : "Illustrative Punjab farmers transplanting nursery-raised rice seedlings into a shallow paddy.",
								width: 1536,
								height: 1024,
								loading: "lazy",
								decoding: "async"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "dsr-photo-index",
								children: ["FIELD PRACTICE / 0", direct ? "2" : "1"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: direct ? "DIRECT SEEDING" : "TRANSPLANTING" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "AI-generated illustrative field scene" })] })
						]
					}, method)]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "home-dsr-schematic",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DsrEstablishmentDiagram, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "dsr-season",
					"aria-labelledby": "dsr-season-title",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "dsr-season-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "earth-label",
								children: "EVIDENCE THROUGH A SEASON"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								id: "dsr-season-title",
								children: "Keep each field’s season connected."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sprout, {
								size: 22,
								"aria-hidden": "true"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: seasons.map(([title, text], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(index + 1).padStart(2, "0") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: text })] })] }, title)) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "dsr-season-note",
							children: "The required records depend on the chosen programme and methodology."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "home-dsr-faq",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "earth-label",
						children: "COMMON QUESTIONS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Carbon projects, in plain terms." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "home-faq-list",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Does adopting DSR guarantee carbon credits?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No. Eligibility and any potential outcome depend on the project boundary, baseline, applicable methodology, field evidence and independent review. DSR adoption alone is not enough." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "How is a potential credit quantity estimated?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "A project applies the relevant methodology to its defined baseline, activity data and assumptions, including uncertainty and deductions. The result is an estimate, not a verified reduction or issued credit." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "Who verifies an agricultural carbon project?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "An independent validation or verification body assesses the project against the selected programme’s rules where required. A registry controls credit issuance under its process." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "How can an FPO or partner explore a project?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Start with your geography, crop and season, current practices, available records and intended programme. The Carbon Credit can discuss evidence requirements and a potential collaboration." })] })
						]
					})]
				})
			]
		})
	});
}
var woman_orange_rice_default = "/assets/woman-orange-rice-DqOe5XAi.webp";
function FieldPerspective() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "field-perspective",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				className: "field-perspective-image",
				src: woman_orange_rice_default,
				width: 1920,
				height: 1024,
				loading: "lazy",
				alt: "A farmer walking beside rows of rice in a green field"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "earth-container field-perspective-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "earth-label",
						children: "ROOTED IN THE FIELD"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						"Real context.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Stronger evidence." })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Every field has a story. Connect its season, practices and observations — without losing the context behind a claim." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
						to: "/how-it-works",
						children: "From observation to review"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "field-perspective-caption",
				children: "ILLUSTRATIVE FIELD LANDSCAPE"
			})
		]
	});
}
var carbon_practice_default = "/assets/carbon-practice-DW8SepED.webp";
var carbon_baseline_default = "/assets/carbon-baseline-ekzngUZk.webp";
var carbon_monitor_default = "/assets/carbon-monitor-nscik3Cw.webp";
var carbon_quantify_default = "/assets/carbon-quantify-CuPrS4D1.webp";
var carbon_verify_default = "/assets/carbon-verify-BsW0d3A6.webp";
var carbon_registry_default = "/assets/carbon-registry-C06mq8YN.webp";
var market_farmers_default = "/assets/market-farmers-CdVTqM4x.webp";
var market_collective_default = "/assets/market-collective-DNvbS3Vz.webp";
var market_design_default = "/assets/market-design-Cko3J1Qm.webp";
var market_monitoring_default = "/assets/market-monitoring-CBbgi36N.webp";
var market_review_default = "/assets/market-review-DPGA5TQK.webp";
var market_registry_default = "/assets/market-registry-CohALSbB.webp";
var market_buyer_default = "/assets/market-buyer-DTKQhy30.webp";
var carbonSteps = [
	{
		title: "Practice",
		detail: "Document the field activity, who reported it and when it took place.",
		image: carbon_practice_default,
		alt: "Illustrative Punjab farmer operating a seed drill across direct-seeded rice rows."
	},
	{
		title: "Baseline",
		detail: "Define the comparison the selected methodology requires.",
		image: carbon_baseline_default,
		alt: "Illustrative farmer and agronomist compare neighboring field plots and records."
	},
	{
		title: "Monitor",
		detail: "Collect dated field evidence and suitable observations through the season.",
		image: carbon_monitor_default,
		alt: "Illustrative field worker checks a water-level tube between rice rows."
	},
	{
		title: "Quantify",
		detail: "Estimate under an applicable method, keeping assumptions and uncertainty visible.",
		image: carbon_quantify_default,
		alt: "Illustrative researchers take a field measurement beside a rice crop."
	},
	{
		title: "Verify",
		detail: "An independent body assesses the design and reported monitoring under programme rules.",
		image: carbon_verify_default,
		alt: "Illustrative reviewers inspect project records with a farmer beside a paddy field."
	},
	{
		title: "Issue",
		detail: "Only a registry can issue credits, if the project meets its requirements.",
		image: carbon_registry_default,
		alt: "Illustrative project submission documents are reviewed in an unbranded office."
	}
];
var marketSteps = [
	{
		title: "Farmers",
		detail: "Participation starts with informed consent and a record of field activity.",
		image: market_farmers_default,
		alt: "Illustrative farmer discusses participation and field activity with a coordinator."
	},
	{
		title: "FPO / partner",
		detail: "A local collective can coordinate participants, permissions and records.",
		image: market_collective_default,
		alt: "Illustrative farmer collective discusses a field-boundary sketch near rice paddies."
	},
	{
		title: "Project team",
		detail: "Define project scope, methodology, baseline and monitoring responsibilities.",
		image: market_design_default,
		alt: "Illustrative project specialists review parcel sketches and a tablet beside fields."
	},
	{
		title: "MRV process",
		detail: "Connect evidence to fields and seasons; record gaps and deviations.",
		image: market_monitoring_default,
		alt: "Illustrative field officer records a crop observation on a tablet."
	},
	{
		title: "Independent body",
		detail: "An independent reviewer assesses records against the selected programme criteria.",
		image: market_review_default,
		alt: "Illustrative reviewer and project representative examine monitoring records."
	},
	{
		title: "Registry",
		detail: "The registry makes its own decision on issuance under the applicable rules.",
		image: market_registry_default,
		alt: "Illustrative unbranded registry submission is checked in an office; no issuance is shown."
	},
	{
		title: "Buyer",
		detail: "A commercial conversation may follow; a transaction is a separate decision.",
		image: market_buyer_default,
		alt: "Illustrative exploratory discussion about rice supply and project documentation."
	}
];
function PhotoProcessSequence({ id, label, tag, steps, caveat }) {
	const root = (0, import_react.useRef)(null);
	const [active, setActive] = (0, import_react.useState)(0);
	const [inView, setInView] = (0, import_react.useState)(false);
	const [autoAdvance, setAutoAdvance] = (0, import_react.useState)(true);
	const [interactionPaused, setInteractionPaused] = (0, import_react.useState)(false);
	const [motionAllowed, setMotionAllowed] = (0, import_react.useState)(false);
	const [pageVisible, setPageVisible] = (0, import_react.useState)(true);
	const step = steps[active];
	(0, import_react.useEffect)(() => {
		const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
		const update = () => setMotionAllowed(media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, []);
	(0, import_react.useEffect)(() => {
		const element = root.current;
		if (!element || !("IntersectionObserver" in window)) return;
		const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), { threshold: .25 });
		observer.observe(element);
		return () => observer.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		const update = () => setPageVisible(document.visibilityState === "visible");
		update();
		document.addEventListener("visibilitychange", update);
		return () => document.removeEventListener("visibilitychange", update);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!inView || !autoAdvance || interactionPaused || !motionAllowed || !pageVisible) return;
		const timer = window.setInterval(() => setActive((current) => (current + 1) % steps.length), 6800);
		return () => window.clearInterval(timer);
	}, [
		active,
		autoAdvance,
		inView,
		interactionPaused,
		motionAllowed,
		pageVisible,
		steps.length
	]);
	(0, import_react.useEffect)(() => {
		if (!inView) return;
		const next = new Image();
		next.src = steps[(active + 1) % steps.length].image;
	}, [
		active,
		inView,
		steps
	]);
	const handleBlur = (event) => {
		if (!event.currentTarget.contains(event.relatedTarget)) setInteractionPaused(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		ref: root,
		className: `home-process-sequence home-process-${id}`,
		role: "group",
		"aria-roledescription": "carousel",
		"aria-label": label,
		onPointerEnter: () => setInteractionPaused(true),
		onPointerLeave: () => setInteractionPaused(false),
		onFocusCapture: () => setInteractionPaused(true),
		onBlurCapture: handleBlur,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "home-process-photo",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: step.image,
						alt: step.alt,
						width: 1536,
						height: 1024,
						loading: "lazy",
						decoding: "async"
					}, step.image),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "home-process-photo-shade",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "home-process-photo-index",
						children: [
							String(active + 1).padStart(2, "0"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
							" ",
							String(steps.length).padStart(2, "0")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "home-process-photo-tag",
						children: tag
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "home-process-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "earth-label",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "home-process-step-label",
						children: [
							"STAGE ",
							String(active + 1).padStart(2, "0"),
							" / ",
							String(steps.length).padStart(2, "0")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: step.title }, `${id}-${step.title}`),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: step.detail }, `${id}-${active}-detail`),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "home-process-controls",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "home-process-arrow",
								"aria-label": "Previous stage",
								onClick: () => setActive((current) => (current - 1 + steps.length) % steps.length),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 17 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "home-process-play",
								"aria-label": motionAllowed ? autoAdvance ? "Pause automatic stage changes" : "Resume automatic stage changes" : "Automatic stage changes disabled by reduced motion",
								"aria-pressed": !autoAdvance,
								disabled: !motionAllowed,
								onClick: () => {
									setAutoAdvance((playing) => !playing);
									setInteractionPaused(false);
								},
								children: [!motionAllowed ? null : autoAdvance ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: motionAllowed ? autoAdvance ? "Pause" : "Play" : "Motion off" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "home-process-arrow",
								"aria-label": "Next stage",
								onClick: () => setActive((current) => (current + 1) % steps.length),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 17 })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "home-process-stage-nav",
				"aria-label": "Choose a stage",
				children: steps.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-current": active === index ? "step" : void 0,
					"aria-label": `Show stage ${index + 1}: ${item.title}`,
					onClick: () => setActive(index),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(index + 1).padStart(2, "0") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.title })]
				}, item.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
				className: "home-process-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Illustrative AI-generated scenes" }), caveat]
			})
		]
	});
}
function HomeCarbonLifecycleStory() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoProcessSequence, {
		id: "carbon-lifecycle",
		label: "AGRICULTURAL CARBON · A SEPARATE-STAGE PROCESS",
		tag: "ILLUSTRATIVE FIELD STORY",
		steps: carbonSteps,
		caveat: "Verification and issuance are different decisions. A documented project does not guarantee either; actual requirements depend on the selected program and methodology."
	});
}
function HomeFarmerMarketStory() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoProcessSequence, {
		id: "farmer-market",
		label: "FARMER-TO-MARKET · POTENTIAL PROJECT PATHWAY",
		tag: "PROGRAM DEPENDENT",
		steps: marketSteps,
		caveat: "Participation, methodology approval, independent review, registry issuance and any commercial sale are separate steps. These scenes do not represent active partners, buyers or project outcomes."
	});
}
var solutionIcons = [
	Sprout,
	Droplets,
	Leaf,
	Cloud,
	Umbrella,
	ChartNoAxesCombined
];
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, {
		home: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-hero",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: rice_aerial_default,
						alt: "Illustrative aerial view across rice fields and irrigation channels",
						width: 1920,
						height: 1024,
						fetchPriority: "high",
						className: "earth-hero-image"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandscapeAnnotations, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "earth-container earth-hero-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "earth-label",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "evidence-dot" }), " AGRICULTURAL CARBON · PUNJAB, INDIA"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: ["Turn better farming practices into ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "measurable climate impact." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The Carbon Credit connects field activity, geospatial observations and rigorous MRV workflows to help build credible agricultural carbon projects." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "earth-hero-actions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "earth",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/platform",
										children: ["Explore our approach ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "glass",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/partners",
										children: ["Partner with us ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "earth-hero-bottom earth-container",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { size: 14 }), " MAKING AGRICULTURAL CLIMATE IMPACT MEASURABLE"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ILLUSTRATIVE FIELD VIEW" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#evidence-challenge",
								"aria-label": "Explore why agricultural carbon needs evidence",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { size: 18 })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "earth-source-strip",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "earth-label",
					children: "A CONNECTED EVIDENCE TRAIL"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "earth-source-window",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "earth-source-track",
						children: [0, 1].map((copy) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "earth-source-group",
							"aria-hidden": copy === 1 ? true : void 0,
							children: [
								"Field boundaries",
								"Farm records",
								"Satellite observations",
								"Methodology",
								"Human review"
							].map((source) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "source-marker" }), source] }, source))
						}, copy))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "evidence-challenge",
				className: "earth-section earth-container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						label: "WHY EVIDENCE MATTERS",
						title: "A practice is only the start of a carbon project.",
						description: "A credible project needs more than an activity claim. Its scope, baseline, method, calculations and review must connect back to suitable evidence."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "earth-three-grid",
						children: [
							{
								Icon: MapPinned,
								title: "Define the project",
								description: "Establish participating farms, field boundaries, eligible land and the project’s scope."
							},
							{
								Icon: Database,
								title: "Document the season",
								description: "Connect consent, farming activities, dates, field observations and source records."
							},
							{
								Icon: GitBranch,
								title: "Trace every claim",
								description: "Keep methodology versions, assumptions, calculations and review decisions together."
							}
						].map(({ Icon, title, description }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "earth-challenge",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "challenge-top",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 23 }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["0", index + 1] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: title }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description })
							]
						}, title))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "earth-evidence-consequence",
						children: "Not every claimed tonne becomes an issued credit. Evidence collection, estimated reductions, independent verification, issuance and sale are separate stages."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
						to: "/agricultural-mrv",
						children: "Understand monitoring, reporting and verification"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "evidence-connection",
				className: "earth-graph-section",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "earth-container",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "earth-two-grid",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "earth-label",
								children: "THE EVIDENCE CONNECTION"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
								"Every result has a trail.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Make it visible." })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The illustrative evidence graph connects a field, season and activity to its source records, assessment status and reviewer decision." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Collected evidence, assessed findings and work awaiting independent review remain distinct." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
								to: "/platform",
								children: "Explore the evidence model"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceGraph, {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "home-evidence-trail",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: evidence_trail_default,
							alt: "A field observer connects a paper field log and parcel sketch with a phone photograph beside rice plots.",
							width: 1600,
							height: 900,
							loading: "lazy",
							decoding: "async"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI-GENERATED ILLUSTRATION · FIELD RECORDS" }), "No real farmer record, field identifier or assessment is shown."] })]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeMRVExperience, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DsrEducation, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldPerspective, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "earth-container home-gallery",
				"aria-label": "Agricultural work across a season",
				children: [
					[
						woman_harvesting_rice_default,
						"Harvest",
						"A farmer gathers rice seedlings at the edge of a paddy.",
						"A farmer carrying a bundle of rice seedlings in a green field."
					],
					[
						rice_field_team_default,
						"Field context",
						"Working across a patchwork of rice plots.",
						"Farm workers across a wide landscape of rice paddies."
					],
					[
						haybales_team_default,
						"Harvest landscape",
						"Fields and stored crop residue after harvest.",
						"A broad agricultural landscape with small haystacks across the field."
					],
					[
						farmer_walking_field_default,
						"Seasonal practice",
						"A field worker moves between crop rows.",
						"A farmer carrying a tool through green rice rows."
					]
				].map(([src, title, caption, alt], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: `g${index}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src,
						alt,
						width: 1200,
						height: 900,
						loading: "lazy",
						decoding: "async"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: caption })] })]
				}, src))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "earth-section earth-satellite-story",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "earth-container",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						label: "SATELLITE INTELLIGENCE",
						title: "Observe the season. Keep the field record in view.",
						description: "Satellite observations can add spatial and seasonal context when coverage, timing and image quality are suitable. They remain one source among several."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SatelliteIntelligenceDiagram, { photo: satellite_mosaic_default })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-section earth-container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						label: "OUR APPROACH",
						title: "A project workflow built around evidence.",
						description: "Each stage has a purpose, required sources and a clear boundary on what its findings can support."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "earth-workflow",
						children: [
							["Scope", "Define the participating farms, fields, season and project requirements."],
							["Collect", "Record consent, activities and field observations with their source and date."],
							["Observe", "Use suitable geospatial data as supporting context, with quality limitations."],
							["Quantify", "Apply the relevant baseline and methodology, retaining assumptions and uncertainty."],
							["Review", "Prepare traceable records for quality checks and independent assessment where required."]
						].map(([title, description], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "earth-step-number",
								children: [
									"0",
									i + 1,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 16 })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description })
						] }, title))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeCarbonLifecycleStory, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
						to: "/how-it-works",
						children: "See the project workflow"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSections, {
				sections: platformCapabilities,
				label: "THE CARBON CREDIT PLATFORM"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-section earth-programs-photo",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "earth-programs-background",
						src: programs_background_default,
						alt: "",
						"aria-hidden": "true",
						width: 1920,
						height: 840,
						loading: "lazy",
						decoding: "async"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "earth-programs-shade",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "earth-container",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
							label: "AGRICULTURAL PROGRAMS",
							title: "Start with local context. Build for credible scale.",
							description: "Programs define their own geography, crop, practices, methodology and evidence requirements. The current public focus is Direct Seeded Rice and agricultural carbon projects in Punjab."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "earth-solutions-grid",
							children: solutions.slice(0, 3).map((item, i) => {
								const Icon = solutionIcons[i] ?? Sprout;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/solutions",
									className: "earth-solution-card",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 25 }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "earth-label",
											children: item.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: item.title }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.description }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
											className: "solution-arrow",
											size: 19
										})
									]
								}, item.id);
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-section earth-container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						label: "WHO WE WORK WITH",
						title: "A shared evidence language for every partner.",
						description: "Farmers and institutions bring different knowledge and responsibilities to an agricultural carbon project."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "earth-audience-grid",
						children: audiences.map(([title, description], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "earth-label",
							children: ["0", i + 1]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description })] })] }, title))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeFarmerMarketStory, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-trust earth-trust-photo",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "earth-trust-background",
						src: trust_background_default,
						alt: "",
						"aria-hidden": "true",
						width: 1920,
						height: 840,
						loading: "lazy",
						decoding: "async"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "earth-trust-shade",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "earth-container",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
								label: "CREDIBILITY BY DESIGN",
								title: "Clear methods. Traceable records. Accountable review.",
								description: "AI can support analysis. Applicable rules check requirements. People review exceptions and make accountable decisions."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "earth-trust-grid",
								children: trustPrinciples.map(([title, description]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 21 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: title }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description })
								] }, title))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
								to: "/methodology",
								children: "Our approach to methodology"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "earth-section earth-container",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "earth-program-preview",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "earth-label",
							children: "FIELD PROGRAMS & CASE STUDIES"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Evidence before outcomes." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No project results or credit issuance are presented as established facts. We’ll publish program outcomes only with a defined scope, supporting records and approval." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
							to: "/field-programs",
							children: "Explore program context"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "program-concept",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "earth-label",
								children: "WHAT A PROJECT RECORD NEEDS"
							}),
							[
								"Geography, crop & season",
								"Practice, baseline & method",
								"Evidence sources & quality",
								"Assessment status & limitations"
							].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["0", i + 1] }),
								label,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 15 })
							] }, label)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Illustrative project framework · no deployment or results implied." })
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCTA, {
				image: contact_background_default,
				imageAlt: "",
				showBrand: true
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomePage, {});
//#endregion
export { SplitComponent as component };
