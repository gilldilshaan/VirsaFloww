import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/visual-diagrams-B3QxME5l.js
var import_jsx_runtime = require_jsx_runtime();
/** Browser-native explanatory illustrations. Every figure describes a process, not a live result. */
var sourceKinds = [
	{
		n: "01",
		title: "Field observations",
		note: "Who · when · where",
		icon: "◉"
	},
	{
		n: "02",
		title: "Satellite context",
		note: "Coverage · date · quality",
		icon: "⌁"
	},
	{
		n: "03",
		title: "Farmer records",
		note: "Reported activity · season",
		icon: "≡"
	},
	{
		n: "04",
		title: "Supporting files",
		note: "Photos · documents · sensors",
		icon: "▤"
	}
];
function EvidencePackageDiagram() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "story-diagram evidence-package-diagram",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "story-diagram-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "earth-label",
					children: "AGRICULTURAL MRV · SOURCE TO REVIEW"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "story-diagram-tag",
					children: "Illustrative model"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "evidence-package-flow",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "evidence-source-list",
						children: sourceKinds.map((source) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "evidence-source",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "evidence-source-glyph",
									"aria-hidden": "true",
									children: source.icon
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "evidence-source-text",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: source.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: source.note })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "evidence-source-index",
									children: source.n
								})
							]
						}, source.title))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "evidence-flow-lines",
						viewBox: "0 0 150 280",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0 34 C74 34 73 140 145 140M0 104 C70 104 72 140 145 140M0 176 C70 176 72 140 145 140M0 246 C74 246 73 140 145 140" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "145",
							cy: "140",
							r: "5"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "evidence-package-core",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "package-orbit",
								"aria-hidden": "true",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "earth-label",
								children: "CONNECTED RECORD"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
								"Evidence",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"package"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Field · season · claim" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "evidence-flow-out",
						viewBox: "0 0 88 280",
						"aria-hidden": "true",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M0 140 H84" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "82",
							cy: "140",
							r: "5"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "evidence-review-list",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Quality checks" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Completeness · consistency" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "02" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Human review" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Gaps · exceptions · rationale" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "evidence-review-result",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "review-dot" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Decision recorded" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Outcome depends on criteria" })
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: "Evidence sources can support or qualify a claim. The connected record retains their origin, timing and limitations for review." })
		]
	});
}
var lifecycleSteps = [
	["Practice", "Document field activity"],
	["Baseline", "Define the comparison"],
	["Monitor", "Collect dated evidence"],
	["Quantify", "Estimate under a method"],
	["Verify", "Independent assessment"],
	["Issue", "Registry decision, if eligible"]
];
function CarbonLifecycleDiagram() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "story-diagram lifecycle-diagram",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "story-diagram-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "earth-label",
					children: "AGRICULTURAL CARBON · A SEPARATE-STAGE PROCESS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "story-diagram-tag",
					children: "Illustrative pathway"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lifecycle-track",
				role: "list",
				"aria-label": "Illustrative agricultural carbon lifecycle",
				children: lifecycleSteps.map(([title, detail], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `lifecycle-step lifecycle-step-${index + 1}`,
					role: "listitem",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "lifecycle-index",
							children: ["0", index + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "lifecycle-node",
							"aria-hidden": "true",
							children: index < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}) : index === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "∑" }) : index === 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "✓" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "↗" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "lifecycle-title",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: detail })
					]
				}, title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lifecycle-outcome",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "lifecycle-outcome-line" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Verification and issuance are different decisions. A documented project does not guarantee either." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: "Each stage has its own evidence requirements, decision-maker and limits. Actual requirements depend on the selected program and methodology." })
		]
	});
}
function DsrEstablishmentDiagram() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "story-diagram dsr-establishment-diagram",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "story-diagram-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "earth-label",
					children: "CROP ESTABLISHMENT · WATER REGIME IS A SEPARATE CHOICE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "story-diagram-tag",
					children: "Field schematic"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "dsr-comparison",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dsr-row dsr-transplant-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "dsr-row-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01 / TRANSPLANTED" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Nursery → prepared field" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Seedlings move from a nursery into the field." })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 440 180",
						role: "img",
						"aria-label": "Rice seedlings being transplanted into moist, prepared soil",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								className: "dsr-field-edge",
								d: "M10 118 Q220 93 430 118 V177 H10Z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								className: "dsr-soil",
								d: "M10 129 Q220 105 430 129 V177 H10Z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								className: "dsr-water",
								d: "M10 113 Q220 91 430 113 V130 Q220 106 10 131Z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
								className: "dsr-plant dsr-plant-transplant",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M110 119V67M110 90 86 70M110 99 132 77M220 112V55M220 82 195 62M220 91 244 66M328 117V73M328 92 306 74M328 100 350 81" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								className: "dsr-seed-line",
								d: "M62 144H384"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dsr-row dsr-direct-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "dsr-row-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "02 / DIRECT SEEDED" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Seed → field rows" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Seed is placed directly into prepared soil." })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 440 180",
						role: "img",
						"aria-label": "Young rice plants emerging from seeds sown directly into rows",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								className: "dsr-field-edge",
								d: "M10 118 Q220 93 430 118 V177 H10Z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								className: "dsr-soil",
								d: "M10 129 Q220 105 430 129 V177 H10Z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								className: "dsr-water-low",
								d: "M10 113 Q220 91 430 113 V122 Q220 100 10 123Z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								className: "dsr-seed-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "105",
										cy: "142",
										r: "4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "220",
										cy: "137",
										r: "4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "330",
										cy: "143",
										r: "4"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
								className: "dsr-plant dsr-plant-direct",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M105 138V108M105 121 90 110M105 126 119 112M220 133V98M220 116 204 103M220 122 236 106M330 139V104M330 119 314 108M330 125 347 109" })
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "dsr-separate-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↗" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Establishment ≠ water management." }), " Sowing method alone does not show how a field was irrigated or how long it remained flooded."] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: "Schematic only. Field preparation, water conditions and management vary; any emissions comparison needs an applicable method and field evidence." })
		]
	});
}
function SatelliteIntelligenceDiagram({ photo }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "story-diagram satellite-story-diagram",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "story-diagram-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "earth-label",
					children: "SATELLITE INTELLIGENCE · CONTEXT, NOT PROOF"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "story-diagram-tag",
					children: "Concept view · no live imagery"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "satellite-story-layout",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `satellite-map-frame${photo ? " has-photo" : ""}`,
					children: [photo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: "satellite-map-photo",
						src: photo,
						alt: "AI-generated overhead view of a Punjab rice-field mosaic; illustrative context, not live imagery.",
						width: 1536,
						height: 1024,
						loading: "lazy",
						decoding: "async"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "satellite-photo-caption",
						children: "ILLUSTRATIVE SATELLITE-STYLE MOSAIC · NOT LIVE DATA"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: `satellite-field-illustration${photo ? " is-photo-overlay" : ""}`,
						viewBox: "0 0 540 320",
						role: "img",
						"aria-label": "Illustrative parcel boundaries and an observation path over agricultural fields",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "fieldA",
								x1: "0",
								x2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0",
									stopColor: "#506a3e"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "1",
									stopColor: "#a4a86c"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
								id: "cropRows",
								width: "15",
								height: "15",
								patternTransform: "rotate(29)",
								patternUnits: "userSpaceOnUse",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M0 0V15",
									stroke: "#ecedd6",
									strokeOpacity: ".16",
									strokeWidth: "4"
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								width: "540",
								height: "320",
								fill: photo ? "transparent" : "#243b30"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M10 13 260 4 278 142 28 154Z",
								fill: "url(#fieldA)",
								fillOpacity: photo ? .22 : 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M10 13 260 4 278 142 28 154Z",
								fill: "url(#cropRows)",
								fillOpacity: photo ? .5 : 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M288 12 516 34 497 164 280 143Z",
								fill: "#8d9770",
								fillOpacity: photo ? .22 : 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M288 12 516 34 497 164 280 143Z",
								fill: "url(#cropRows)",
								fillOpacity: photo ? .5 : 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M29 167 272 154 298 307 56 300Z",
								fill: "#687b49",
								fillOpacity: photo ? .22 : 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M29 167 272 154 298 307 56 300Z",
								fill: "url(#cropRows)",
								fillOpacity: photo ? .5 : 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M289 163 498 178 520 307 309 302Z",
								fill: "#a3a06d",
								fillOpacity: photo ? .22 : 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M289 163 498 178 520 307 309 302Z",
								fill: "url(#cropRows)",
								fillOpacity: photo ? .5 : 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M277 0 285 320M0 158 540 166",
								stroke: "#b9b995",
								strokeWidth: "7"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M19 22 252 13 268 132 38 144Z",
								fill: "none",
								stroke: "#efb467",
								strokeWidth: "2.5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M301 21 504 42 485 151 292 135Z",
								fill: "none",
								stroke: "#dbe7b6",
								strokeWidth: "2.5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M46 177 262 166 285 295 67 289Z",
								fill: "none",
								stroke: "#dbe7b6",
								strokeWidth: "2.5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M302 174 486 188 505 295 320 290Z",
								fill: "none",
								stroke: "#dbe7b6",
								strokeWidth: "2.5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								className: "satellite-scanline",
								d: "M-5 75H545",
								stroke: "#f3c27d",
								strokeDasharray: "8 7",
								strokeWidth: "2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								className: "satellite-scan-dot",
								cx: "142",
								cy: "75",
								r: "5",
								fill: "#f3c27d"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								className: "satellite-caption-box",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: "25",
									y: "246",
									width: "125",
									height: "34",
									rx: "2",
									fill: "#12241d",
									fillOpacity: ".92"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: "39",
									y: "267",
									fill: "#f4f1e6",
									fontSize: "11",
									fontFamily: "monospace",
									children: "FIELD A · SAMPLE"
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "satellite-story-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "satellite-date-tag",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " OBSERVATION WINDOWS"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "What a satellite can add" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Boundary context" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Which mapped parcel is being observed?" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Image quality" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Is the acquisition clear and complete?" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Seasonal change" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "What patterns appear across dates?" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Field record link" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "What ground evidence gives context?" })] })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Optical imagery can be limited by cloud, timing and resolution. It does not directly measure methane or prove a field practice." })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: "Illustrative parcels and observation path. Live satellite analysis is available only through the authenticated workspace when real data credentials and suitable imagery are available." })
		]
	});
}
function RiceSeasonSatelliteMap() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "story-diagram rice-season-satellite-map",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "story-diagram-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "earth-label",
					children: "FIELD BY FIELD · SEASON BY SEASON"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "story-diagram-tag",
					children: "Illustrative imagery · not a live comparison"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "season-satellite-tiles",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "season-satellite-tile",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "season-satellite-image season-tile-water",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/earth/carbon-season-wet.webp",
								alt: "Illustrative overhead view of rice parcels with visible surface water and field boundaries",
								loading: "lazy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 720 460",
								"aria-hidden": "true",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m83 92 207-22 33 128-204 29z" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m355 80 255 24-26 145-251-34z" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m140 250 191-30 52 142-203 22z" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "287",
										cy: "166",
										r: "7"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										className: "season-satellite-trace",
										d: "M48 363c136-80 226-72 315-153s183-73 313-123"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "season-tile-label",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " SURFACE WATER CONTEXT"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Tile A" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Parcel edges · water visible" })] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "season-satellite-tile",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "season-satellite-image season-tile-canopy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/earth/carbon-season-irrigated.webp",
								alt: "Illustrative overhead view of crop parcels and irrigation channels",
								loading: "lazy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 720 460",
								"aria-hidden": "true",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m80 67 267 33-20 154-264-25z" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m382 113 238-25 34 165-247 19z" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m108 284 236-34 31 135-248 25z" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "500",
										cy: "213",
										r: "7"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										className: "season-satellite-trace",
										d: "M39 372c142-72 222-62 323-148s175-90 328-138"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "season-tile-label",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " CROP & CHANNEL CONTEXT"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Tile B" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Seasonal patterns · channels" })] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "season-satellite-legend",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "legend-boundary" }), "Mapped boundary"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "legend-observation" }), "Observation path"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Two distinct illustrative tiles. They are not the same parcel, date sequence or project record." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
				className: "season-satellite-note",
				children: "Satellite observations can add spatial and seasonal context when coverage, timing and image quality are suitable. They do not directly measure methane or prove a field practice."
			})
		]
	});
}
var marketStages = [
	["Farmers", "Consent · field activity"],
	["FPO / partner", "Local coordination"],
	["Project team", "Scope · methodology"],
	["MRV process", "Evidence · reporting"],
	["Independent body", "Review under criteria"],
	["Registry", "Possible issuance"],
	["Buyer", "Potential transaction"]
];
function FarmerMarketWorkflowDiagram() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "story-diagram market-workflow-diagram",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "story-diagram-head",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "earth-label",
					children: "FARMER-TO-MARKET · POTENTIAL PROJECT PATHWAY"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "story-diagram-tag",
					children: "Program dependent"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "market-workflow-track",
				role: "list",
				"aria-label": "Potential farmer-to-market project workflow",
				children: marketStages.map(([title, detail], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "market-stage",
					role: "listitem",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "market-stage-no",
							children: ["0", index + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "market-stage-mark",
							"aria-hidden": "true",
							children: [
								"⌂",
								"◌",
								"◇",
								"⌁",
								"✓",
								"▤",
								"↗"
							][index]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: detail }),
						index < marketStages.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "market-connector",
							"aria-hidden": "true",
							children: "→"
						})
					]
				}, title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "market-workflow-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Possible sequence, not a promise." }), " Participation, methodology approval, independent review, registry issuance and any commercial sale are separate steps. The diagram does not represent active partners or buyers."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: "Project roles and order depend on the selected program, agreements and applicable registry process." })
		]
	});
}
//#endregion
export { RiceSeasonSatelliteMap as a, FarmerMarketWorkflowDiagram as i, DsrEstablishmentDiagram as n, SatelliteIntelligenceDiagram as o, EvidencePackageDiagram as r, CarbonLifecycleDiagram as t };
