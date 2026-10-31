import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as AcreonBrand } from "./acreon-brand-HLTFfwjE.mjs";
import { t as Button } from "./button-DbFAHDQB.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Pause, T as Play, ct as Check, ft as ArrowUpRight, mt as ArrowLeft, pt as ArrowRight, t as X } from "../_libs/lucide-react.mjs";
import { a as SiteShell, i as SectionHeading, o as TextLink } from "./site-shell-BuAaQje2.mjs";
import { a as RiceSeasonSatelliteMap, n as DsrEstablishmentDiagram, t as CarbonLifecycleDiagram } from "./visual-diagrams-B3QxME5l.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/carbon-credits-Y7rvawOR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var rice_dsr_default = "/assets/rice-dsr-D90ydj80.jpg";
var awd_water_tube_generated_default = "/assets/awd-water-tube-generated-hN4jPQTS.webp";
var dsr_seed_drill_generated_default = "/assets/dsr-seed-drill-generated-CzDqSEEp.webp";
var rice_residue_management_generated_default = "/assets/rice-residue-management-generated-Bp4EdXOq.webp";
var explainer = [
	{
		title: "Practice",
		short: "A field changes how it is managed",
		body: "A farmer adopts a practice such as alternate wetting and drying. On its own, this is a change in management, not yet a climate outcome."
	},
	{
		title: "Field observations",
		short: "Dated records show what happened",
		body: "Water-level readings, photos, agent visits and satellite context build a timeline of flooding and drying for each field and season. A water tube shows water level; it does not measure methane."
	},
	{
		title: "Baseline comparison",
		short: "What would have happened otherwise",
		body: "The project defines a baseline scenario under its methodology. The baseline cannot simply be assumed to be continuous flooding for every field."
	},
	{
		title: "Emissions calculation",
		short: "The difference is estimated",
		body: "Approved methodology equations estimate baseline and project emissions, accounting for other gases, uncertainty and deductions. An estimate is not yet a verified reduction."
	},
	{
		title: "Independent verification",
		short: "A third party checks the claim",
		body: "An independent validation and verification body reviews the design, monitoring and calculations. Only then can a registry issue credits: one credit usually represents one tonne of CO₂-equivalent reduced."
	}
];
var practices = [
	{
		n: "01",
		title: "Alternate Wetting and Drying (AWD)",
		tag: "Manage flooding. Document the water regime.",
		img: awd_water_tube_generated_default,
		alt: "A farmer checks a perforated water-level tube in a partly drained rice paddy.",
		caption: "AI-generated illustration · a water tube records water level, not methane.",
		text: "Fields dry partially between irrigations instead of staying flooded all season. Depending on conditions, this can shorten anaerobic periods and lower methane. A field water tube helps decide when to irrigate.",
		evidence: [
			"Field registration and crop season",
			"Dated water-level readings and photos",
			"Irrigation and drying-period records",
			"Field-agent visits",
			"Satellite context",
			"Missing or inconsistent observations"
		],
		supports: "Whether the documented water practice was implemented to the project’s requirements. It does not by itself establish methane reductions."
	},
	{
		n: "02",
		title: "Direct Seeded Rice (DSR)",
		tag: "Change establishment. Document what changes.",
		img: dsr_seed_drill_generated_default,
		alt: "A tractor-mounted seed drill places rice seed into dry, prepared rows.",
		caption: "AI-generated illustration · direct seeding changes crop establishment.",
		text: "Seeds are sown directly instead of transplanting into puddled soil. DSR can change water needs and flooded duration, but it does not automatically guarantee lower methane — outcomes depend on management and methodology.",
		evidence: [
			"Field boundaries and season registration",
			"Sowing dates and establishment method",
			"Field observations of reported practice",
			"Irrigation records where required",
			"Satellite crop-development context",
			"Deviations from intended practice"
		],
		supports: "A traceable record of crop establishment. Methane effects must be evaluated separately."
	},
	{
		n: "03",
		title: "Residue and Straw Management",
		tag: "Document how organic material is handled.",
		img: rice_residue_management_generated_default,
		alt: "A tractor-mounted straw chopper spreads rice residue across a harvested field.",
		caption: "AI-generated illustration · residue handling varies by field and season.",
		text: "Straw decomposing under flooded, oxygen-limited conditions can feed methane production. Effects depend on quantity, timing, incorporation and removal — so each field’s actual practice must be recorded, not assumed.",
		evidence: [
			"Reported residue activities",
			"Field observations and photos",
			"Activity dates and season records",
			"Inspection records",
			"Missing or inconsistent documentation"
		],
		supports: "Documentation of reported and observed practice. Reductions must be quantified under a methodology that covers it."
	}
];
var evidence = [
	["Field registration and consent", "Each field needs a reliable identity linked to its season, project and practice, plus participation and consent records. A registered field is not automatically eligible."],
	["Water-management observations", "Water-tube readings, dated photos, irrigation logs, agent visits, sensors where available and satellite support — each with source, time and context. Gaps are flagged, not treated as compliant."],
	["Remote-sensing context", "Satellite data helps characterise crop development and surface conditions over time. It is supporting context, not definitive proof of irrigation events or methane."],
	["Baseline and project scenario", "Baseline conditions, project boundary, eligible fields, monitoring period, emission factors, uncertainty and deductions — all set by the selected methodology."],
	["Emissions quantification", "The methodology’s calculation estimates the difference between baseline and project emissions. An estimated reduction is not a verified reduction or an issued credit."],
	["Review and audit trail", "Completeness checks, anomaly flags, calculation references, documented review decisions and versioned history so a reviewer can trace any claim back to its records."]
];
var steps = [
	[
		"Enrol",
		"Identify participating farmers and eligible fields with the FPO or program partner.",
		"A defined project population with traceable field records."
	],
	[
		"Design",
		"Select a crediting program and methodology; define baseline, monitoring plan and responsibilities.",
		"A documented project design and monitoring framework."
	],
	[
		"Monitor",
		"Collect required records through the season; track missing evidence and deviations.",
		"A structured monitoring record linked to fields."
	],
	[
		"Quantify",
		"Apply approved calculations; document assumptions, uncertainty and deductions.",
		"A traceable emissions calculation and monitoring report."
	],
	[
		"Validate & verify",
		"An independent body assesses design, monitoring and reported reductions.",
		"An independent assessment under the program’s rules."
	],
	[
		"Issue & share",
		"Only a registry can issue credits. Benefit-sharing terms are agreed with farmers in advance.",
		"Credits issued by the registry, where requirements are met."
	]
];
var carbonProcessScenes = [
	{
		image: "/earth/carbon-stage-enrol.webp",
		alt: "Farmers and a field coordinator looking together at a parcel map beside rice fields.",
		note: "Field population and consent records"
	},
	{
		image: "/earth/carbon-stage-design.webp",
		alt: "A program specialist reviewing field maps and season records at a desk.",
		note: "Method, baseline and monitoring plan"
	},
	{
		image: "/earth/carbon-stage-monitor.webp",
		alt: "A field officer recording a water-level observation beside rice plants.",
		note: "Dated evidence linked to the field"
	},
	{
		image: "/earth/carbon-stage-quantify.webp",
		alt: "An analyst reviewing field records and non-legible calculation charts on a laptop.",
		note: "Assumptions, uncertainty and deductions"
	},
	{
		image: "/earth/carbon-stage-review.webp",
		alt: "A technical reviewer and local observer comparing field notes at a rice parcel.",
		note: "Independent assessment under program rules"
	},
	{
		image: "/earth/carbon-stage-share.webp",
		alt: "A farmer collective reviewing a seasonal project record in a village meeting room.",
		note: "Registry and benefit-sharing decisions remain separate"
	}
];
function CarbonProcessStoryboard({ active, onSelect, playing, onToggle }) {
	const scene = carbonProcessScenes[active];
	const step = steps[active];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "carbon-process-storyboard",
		"aria-label": "Illustrative project process image sequence",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "carbon-process-photo",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: scene.image,
					alt: scene.alt,
					loading: "lazy",
					decoding: "async"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "carbon-process-photo-shade" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "carbon-process-photo-label",
					children: "PROJECT PATHWAY · ILLUSTRATIVE SCENE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "carbon-process-photo-copy",
					"aria-live": "polite",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"STAGE 0",
							active + 1,
							" / 06"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: step[0] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: scene.note })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "carbon-process-photo-controls",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Previous process stage",
							onClick: () => onSelect((active + steps.length - 1) % steps.length),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": playing ? "Pause process sequence" : "Play process sequence",
							"aria-pressed": playing,
							onClick: onToggle,
							children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { size: 15 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { size: 15 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Next process stage",
							onClick: () => onSelect((active + 1) % steps.length),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "carbon-process-progress",
					role: "group",
					"aria-label": "Choose a project stage",
					children: steps.map(([title], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: active === index ? "is-active" : "",
						"aria-label": `Show stage ${index + 1}: ${title}`,
						"aria-pressed": active === index,
						onClick: () => onSelect(index)
					}, title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "carbon-process-ai-note",
					children: "AI-generated illustrative scene · not a documented project"
				})
			]
		}, scene.image), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "carbon-process-scene-caption",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: step[0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step[2] })]
		})]
	});
}
function MethaneExplainer() {
	const [active, setActive] = (0, import_react.useState)(0);
	const step = explainer[active];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "earth-section earth-container",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				label: "DSR & RICE METHANE, EXPLAINED",
				title: "From a change in the field to a credit.",
				description: "Evidence that a practice changed does not, by itself, prove a quantity of methane was avoided. Every stage matters."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "methane-soil",
				"aria-label": "How water affects methane in rice soils",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "methane-soil-panel flooded",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "earth-label",
							children: "CONTINUOUS FLOODING"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "soil-scene",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "water-layer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "soil-layer",
								children: Array.from({ length: 9 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
									className: "bubble",
									style: {
										left: `${8 + i * 10}%`,
										animationDelay: `${i * .45}s`
									}
								}, i))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Water seals the soil. Oxygen runs out and microbes break down organic matter into methane, which escapes through water and plants." })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "methane-soil-panel drying",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "earth-label",
							children: "DRYING PERIOD"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "soil-scene",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "water-layer low" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "soil-layer cracked",
								children: Array.from({ length: 3 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
									className: "bubble",
									style: {
										left: `${20 + i * 28}%`,
										animationDelay: `${i * 1.1}s`
									}
								}, i))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Partial drying lets oxygen back into the soil, which can interrupt methane-producing conditions — depending on soil, climate and management." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "methane-caption",
				children: "Schematic illustration · not to scale and not measured data."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "methane-stepper",
				role: "tablist",
				"aria-label": "Methane credit stages",
				children: explainer.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					role: "tab",
					"aria-selected": i === active,
					className: i === active ? "active" : "",
					onClick: () => setActive(i),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["0", i + 1] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: s.title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: s.short })
					]
				}, s.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "methane-step-detail",
				role: "tabpanel",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "earth-label",
						children: [
							"STAGE 0",
							active + 1,
							" OF 05"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: step.title }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: step.body }),
					active === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "methane-bars",
						"aria-label": "Illustrative quantification steps",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Baseline scenario" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Defined by the applicable methodology" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Project scenario" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Estimated from field data and assumptions" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "diff",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Difference" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Assessed with uncertainty and deductions" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "methane-step-nav",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							disabled: active === 0,
							onClick: () => setActive(active - 1),
							children: "Previous"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "earth",
							disabled: active === explainer.length - 1,
							onClick: () => setActive(active + 1),
							children: ["Next stage ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
						})]
					})
				]
			}, active)
		]
	});
}
function CarbonCreditsPage() {
	const [activeProcessStage, setActiveProcessStage] = (0, import_react.useState)(0);
	const [processPlaying, setProcessPlaying] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!processPlaying || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = window.setInterval(() => {
			setActiveProcessStage((current) => (current + 1) % steps.length);
		}, 5600);
		return () => window.clearInterval(timer);
	}, [processPlaying]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		id: "main-content",
		className: "earth-carbon-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "carbon-hero",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "carbon-hero-image earth-hero-image",
						src: rice_dsr_default,
						alt: "Young rice plants growing in distinct rows across a direct-seeded field",
						width: 1920,
						height: 912
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "carbon-hero-scrim" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "earth-container carbon-hero-copy earth-hero-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "earth-label",
								children: "DIRECT SEEDED RICE · PUNJAB PROJECT FOCUS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: ["Build agricultural carbon projects on ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "field-level evidence." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Flooded rice fields can release methane as microorganisms break down organic matter in oxygen-depleted soils. The Carbon Credit connects farming practices, field records and geospatial observations through methodology-specific MRV workflows. Our initial agricultural project focus is Direct Seeded Rice in Punjab." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "carbon-hero-actions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "earth",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "#methane-explainer",
										children: ["Explore the evidence workflow ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "ghost",
									className: "carbon-ghost",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/contact",
										children: ["Discuss a rice MRV pilot ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "carbon-hero-note",
						children: "Illustrative direct-seeded crop rows · no project data"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-section earth-container earth-carbon-hero",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "earth-carbon-why",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "earth-label",
							children: "WHY RICE METHANE MATTERS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Water management can change the emissions profile." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "When fields stay flooded, soil oxygen falls and microbes produce methane, which escapes through the soil and rice plants. Interrupting continuous flooding can reduce emissions under suitable conditions." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "But adopting a practice is only the first step. A credible claim documents what happened, defines what would have happened otherwise, and quantifies the difference under an applicable methodology." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "carbon-role",
							children: "The Carbon Credit’s role: connect those records into an evidence trail that can be assessed and independently reviewed."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "carbon-methane-photo",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/earth/carbon-methane-field.webp",
							alt: "Rice plants growing in a waterlogged field beside an irrigation channel.",
							loading: "lazy",
							decoding: "async"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: "Illustrative rice-field conditions · no methane measurement shown" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "carbon-methane-photo-tag",
							children: "WATER REGIME · FIELD CONTEXT"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: "methane-explainer",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MethaneExplainer, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "earth-section earth-sage",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "earth-container",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						label: "CROP ESTABLISHMENT & WATER",
						title: "Document the practice and its conditions separately.",
						description: "Direct seeding changes how rice is established; it does not define irrigation or field water conditions."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DsrEstablishmentDiagram, {})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-section earth-container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					label: "PRACTICES WE HELP DOCUMENT",
					title: "Three practices, one evidence standard.",
					description: "Which practices are eligible, and how they are measured, depends on the methodology a project applies."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "carbon-practices",
					children: practices.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "carbon-practice",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.img,
								alt: p.alt,
								width: 1200,
								height: 900,
								loading: "lazy",
								decoding: "async"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.n }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: p.caption })
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "earth-step-number",
								children: p.n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: p.title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: p.tag }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p.text }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "earth-label",
								children: "EVIDENCE TO ORGANISE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: p.evidence.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: e }, e)) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "carbon-supports",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "What this supports:" }),
									" ",
									p.supports
								]
							})
						] })]
					}, p.n))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-section earth-container",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					label: "THE EVIDENCE BEHIND A CARBON CREDIT",
					title: "A credit is only as credible as its evidence.",
					description: "Projects need a defined boundary, a baseline, monitoring evidence, calculations and independent assessment. The Carbon Credit keeps gaps and assumptions visible."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "earth-carbon-evidence",
					children: evidence.map(([t, d], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "earth-step-number",
							children: ["0", i + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: t }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: d })
					] }, t))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "carbon-band",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/earth/carbon-season-landscape.webp",
					alt: "Illustrative rice landscape at the edge of a field season.",
					loading: "lazy",
					decoding: "async"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "carbon-band-copy earth-container",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "earth-label",
						children: "FIELD BY FIELD · SEASON BY SEASON"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Make agricultural methane claims easier to investigate, substantiate and review." })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "carbon-satellite-intelligence",
				className: "earth-section earth-sage carbon-satellite-section",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "earth-container",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						label: "SATELLITE INTELLIGENCE · SUPPORTING CONTEXT",
						title: "Read the landscape across observation windows.",
						description: "Parcel boundaries, visible water and seasonal crop patterns can help reviewers ask better questions. Each observation still needs suitable timing, image quality and field records."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiceSeasonSatelliteMap, {})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "carbon-project-pathway",
				className: "earth-section earth-container",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						label: "FROM PADDY TO CARBON REGISTRY",
						title: "How a rice methane project progresses.",
						description: "Exact requirements depend on the selected standard, methodology, project design and registry."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "carbon-process-layout",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "carbon-timeline",
							"aria-label": "Six project stages",
							children: steps.map(([title, description, output], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: activeProcessStage === index ? "is-active" : "",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": activeProcessStage === index,
									onClick: () => setActiveProcessStage(index),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["0", index + 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: title }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Output:" }),
											" ",
											output
										] })
									] })]
								})
							}, title))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarbonProcessStoryboard, {
							active: activeProcessStage,
							onSelect: setActiveProcessStage,
							playing: processPlaying,
							onToggle: () => setProcessPlaying((value) => !value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "carbon-process-discovery",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "earth-label",
							children: "PROCESS DISCOVERY · KEEP EACH DECISION DISTINCT"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarbonLifecycleDiagram, {})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-section earth-container earth-carbon-honest",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						label: "WHAT WE DO AND DON’T CLAIM",
						title: "Clear about our role."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "earth-two-grid",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "What The Carbon Credit does" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "carbon-checks",
							children: [
								"Organises field records and consent documentation",
								"Connects field observations with geospatial information",
								"Tracks practices and required evidence",
								"Flags missing, inconsistent or anomalous records",
								"Supports traceable monitoring and calculation workflows",
								"Prepares evidence packages for independent review"
							].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 16 }), x] }, x))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "What The Carbon Credit does not do" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "carbon-checks no",
							children: [
								"Issue or certify carbon credits",
								"Guarantee a field or project qualifies for crediting",
								"Guarantee reductions, credit price or revenue",
								"Replace independent validation and verification",
								"Treat satellite imagery or AI output as proof on its own",
								"Claim a reduction without adequate evidence"
							].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 }), x] }, x))
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "earth-carbon-note",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Current status:" }), " This page does not represent a specific project outcome or credit issuance. Estimates are illustrative and do not guarantee eligibility, issuance, price or revenue."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
						to: "/methodology",
						children: "Read our methodology & evidence principles"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "earth-section earth-container carbon-traceable",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					label: "WHY EVIDENCE QUALITY MATTERS",
					title: "Make every claim traceable.",
					description: "A monitoring record should never be confused with proof of a verified climate outcome."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "carbon-questions",
					children: [
						"Which fields and seasons are included?",
						"Which practices were reported, and what supports them?",
						"Which observations are missing or uncertain?",
						"Which methodology and assumptions were applied?",
						"How was the emissions estimate calculated?",
						"Which cases required human review?",
						"What did the independent assessment conclude?"
					].map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Q", i + 1] }), q] }, q))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "earth-final carbon-final",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "earth-container carbon-final-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "carbon-final-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "earth-label",
								children: "START WITH A CONVERSATION"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Build a clearer picture of agricultural impact." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Talk with The Carbon Credit about a DSR program, field evidence requirements, research collaboration or a potential project partnership." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "carbon-hero-actions",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "earth",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/contact",
											search: { interest: "Institutional partnership" },
											children: ["Partner with us ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "ghost",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/contact",
											search: { interest: "Pilot program" },
											children: ["Discuss a pilot ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "ghost",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/contact",
											search: { interest: "Platform walkthrough" },
											children: ["Request a walkthrough ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
								className: "carbon-fineprint",
								children: "Proposed projects depend on eligibility, methodology, data availability and independent assessment."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "carbon-final-brand-panel",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "earth-label",
								children: "THE CARBON CREDIT · PUNJAB, INDIA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AcreonBrand, { className: "carbon-final-brand" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Making agricultural climate impact measurable, verifiable and valuable." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "carbon-final-rule",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
									" LAND TODAY · OPPORTUNITIES TOMORROW ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
								]
							})
						]
					})]
				})
			})
		]
	}) });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarbonCreditsPage, {});
//#endregion
export { SplitComponent as component };
