import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-DbFAHDQB.mjs";
import { F as Layers, Q as Compass, at as CircleCheck, c as TriangleAlert, h as ShieldCheck, j as MapPin, p as Sparkles, pt as ArrowRight, tt as Clock } from "../_libs/lucide-react.mjs";
import { o as useTerraLedger } from "./store-Ddm4_oB_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/command-centre-CoNdv_9f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CommandCentre() {
	const { field, assessmentStatus, completenessPercent, aiExplanation, demoState, setActiveTab, addIrrigationLogAction, addInBoundaryPhotoAction } = useTerraLedger();
	const [mapLayer, setMapLayer] = (0, import_react.useState)("boundaries");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { size: 13 }), "Command Centre · Field Assessment Intelligence"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight",
						children: ["Field Parcel ", field.code]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#72816f] mt-1",
						children: "Real-time multi-source evidence synthesis for agricultural carbon crediting and MRV."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setActiveTab("satellite"),
						className: "text-xs bg-white border-[#d8e1d4] text-[#213c2b] hover:bg-[#f4f6f0]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, {
							size: 13,
							className: "mr-1.5 text-[#5c7c46]"
						}), "Satellite View"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setActiveTab("evidence"),
						className: "text-xs bg-[#245b45] text-white hover:bg-[#1a4333]",
						children: ["Evidence Explorer", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							size: 13,
							className: "ml-1.5"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "Area & Scale"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "block text-2xl font-mono text-[#193b2a] mt-1",
								children: [
									field.areaHa,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "text-xs font-sans text-[#72816f]",
										children: "ha"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block",
								children: [
									field.areaAcres,
									" acres · ",
									field.district
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "Projected Mitigation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "block text-2xl font-mono text-[#245b45] mt-1",
								children: [
									field.targetEmissionReductionTonnes,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "text-xs font-sans text-[#72816f]",
										children: "tCO2e/yr"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block",
								children: "4.8 t/ha DSR-AWD reduction"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "Farmer Partner"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "block text-lg font-semibold text-[#193b2a] mt-1 truncate",
								children: field.farmerName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block font-mono",
								lang: "pa",
								children: field.farmerNameLocal
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "MRV Completeness"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: `block text-2xl font-mono mt-1 ${completenessPercent >= 90 ? "text-emerald-700" : completenessPercent >= 65 ? "text-sky-700" : "text-amber-700"}`,
								children: [completenessPercent, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block",
								children: assessmentStatus.replace(/_/g, " ")
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-7 bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs flex flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-[#edf0e7] mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
									size: 16,
									className: "text-[#245b45]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-semibold text-[#193b2a]",
									children: "Cadastral Boundary & Spatial Enclosure Canvas"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setMapLayer("boundaries"),
									className: `px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${mapLayer === "boundaries" ? "bg-[#193b2a] text-white font-medium" : "bg-[#f4f6f0] text-[#72816f] hover:text-[#213c2b]"}`,
									children: "Cadastral"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setMapLayer("indices"),
									className: `px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${mapLayer === "indices" ? "bg-[#193b2a] text-white font-medium" : "bg-[#f4f6f0] text-[#72816f] hover:text-[#213c2b]"}`,
									children: "NDVI Overlay"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full aspect-16/10 bg-[#173024] rounded-lg overflow-hidden border border-[#2b503e] flex items-center justify-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `absolute inset-0 opacity-40 mix-blend-luminosity bg-cover bg-center transition-all duration-700 ${mapLayer === "indices" ? "filter saturate-200 hue-rotate-30" : ""}`,
									style: { backgroundImage: `url('/earth/platform-field-satellite.webp')` }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									viewBox: "0 0 600 380",
									className: "relative z-10 w-full h-full p-4",
									preserveAspectRatio: "xMidYMid meet",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
											id: "grid",
											width: "40",
											height: "40",
											patternUnits: "userSpaceOnUse",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												d: "M 40 0 L 0 0 0 40",
												fill: "none",
												stroke: "rgba(255,255,255,0.06)",
												strokeWidth: "1"
											})
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											width: "100%",
											height: "100%",
											fill: "url(#grid)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
											points: "160,70 440,90 410,310 130,270",
											fill: mapLayer === "indices" ? "rgba(74, 222, 128, 0.25)" : "rgba(214, 234, 166, 0.2)",
											stroke: "#d6eaa6",
											strokeWidth: "2.5",
											strokeDasharray: mapLayer === "indices" ? "0" : "4,2"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											x: "270",
											y: "185",
											fill: "#ffffff",
											fontSize: "12",
											fontFamily: "IBM Plex Mono",
											textAnchor: "middle",
											opacity: "0.9",
											children: "PARCEL PB-LUD-042 (4.8 ha)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											x: "270",
											y: "202",
											fill: "#d6eaa6",
											fontSize: "10",
											fontFamily: "IBM Plex Mono",
											textAnchor: "middle",
											opacity: "0.8",
											children: "30.9110° N, 75.8370° E"
										}),
										[
											[160, 70],
											[440, 90],
											[410, 310],
											[130, 270]
										].map(([x, y], idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											cx: x,
											cy: y,
											r: "4",
											fill: "#d6eaa6",
											stroke: "#102e20",
											strokeWidth: "2"
										}, idx)),
										(demoState === "unverified" || demoState === "needs-review") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
											className: "animate-pulse",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "440",
													y1: "90",
													x2: "520",
													y2: "45",
													stroke: "#ef4444",
													strokeWidth: "1.5",
													strokeDasharray: "3,3"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "495",
													y: "80",
													fill: "#fca5a5",
													fontSize: "9",
													fontFamily: "IBM Plex Mono",
													children: "+420m offset"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
													cx: "520",
													cy: "45",
													r: "14",
													fill: "rgba(239, 68, 68, 0.25)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
													cx: "520",
													cy: "45",
													r: "6",
													fill: "#ef4444",
													stroke: "#ffffff",
													strokeWidth: "2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "440",
													y: "10",
													width: "150",
													height: "22",
													rx: "4",
													fill: "#7f1d1d",
													opacity: "0.95"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "515",
													y: "25",
													fill: "#fecaca",
													fontSize: "9",
													fontFamily: "IBM Plex Mono",
													textAnchor: "middle",
													fontWeight: "bold",
													children: "⚠️ Photo EV-003 Mismatch"
												})
											]
										}),
										demoState === "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
												cx: "270",
												cy: "140",
												r: "14",
												fill: "rgba(34, 197, 94, 0.25)",
												className: "animate-ping"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
												cx: "270",
												cy: "140",
												r: "6",
												fill: "#22c55e",
												stroke: "#ffffff",
												strokeWidth: "2"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
												x: "160",
												y: "105",
												width: "220",
												height: "22",
												rx: "4",
												fill: "#14532d",
												opacity: "0.95"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
												x: "270",
												y: "120",
												fill: "#bbf7d0",
												fontSize: "9",
												fontFamily: "IBM Plex Mono",
												textAnchor: "middle",
												fontWeight: "bold",
												children: "✓ Photo EV-005 Ready for Verification"
											})
										] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-xs rounded-md px-3 py-2 flex items-center justify-between text-[11px] text-white font-mono",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-full border border-white bg-[#d6eaa6]" }), "Boundary"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-2.5 h-2.5 rounded-full border border-white ${demoState === "ready" ? "bg-emerald-500" : "bg-red-500"}` }), demoState === "ready" ? "In-Bounds Pin · Ready for Verification" : "Flagged Pin (+420m)"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#a7f3d0]",
										children: "Cadastral: Revenue Dept PB"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 text-xs text-[#72816f] flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Spatial Tolerance Threshold: < 5.0m" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono",
								children: [
									"Status:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: demoState === "ready" ? "text-emerald-700" : "text-amber-700",
										children: demoState === "ready" ? "Enclosure Pass (100% in bounds)" : "Enclosure Violation Detected"
									})
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-5 flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-[#173a2b] text-[#f5f5e8] border border-[#2b503e] rounded-xl p-5 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-mono text-[#d6eaa6] mb-2 uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									size: 14,
									className: "animate-spin text-[#d6eaa6]"
								}), "TerraLedger AI Diagnostics"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-lg font-medium text-white mb-2",
								children: aiExplanation.headline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#c6d7cb] leading-relaxed mb-4",
								children: aiExplanation.details
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 border-t border-[#ffffff15] pt-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono text-[#809c88] block uppercase",
									children: "Spatial Dimension"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] text-white",
									children: aiExplanation.spatialStatus
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono text-[#809c88] block uppercase",
									children: "Temporal & Moisture Corroboration"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] text-white",
									children: aiExplanation.temporalStatus
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 pt-3 border-t border-[#ffffff15]",
								children: [
									demoState === "unverified" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										onClick: addIrrigationLogAction,
										className: "w-full bg-[#d6eaa6] text-[#173a27] hover:bg-white text-xs font-semibold",
										children: "Simulate Step 2: Add AWD Irrigation Log"
									}),
									demoState === "needs-review" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										onClick: addInBoundaryPhotoAction,
										className: "w-full bg-emerald-500 text-white hover:bg-emerald-400 text-xs font-semibold",
										children: "Simulate Step 3: Add In-Boundary Photo"
									}),
									demoState === "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 p-2.5 rounded-lg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5 font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
												size: 16,
												className: "text-emerald-400"
											}), "READY FOR VERIFICATION · Pre-Audit Complete"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setActiveTab("dossier"),
											className: "underline text-white font-medium hover:text-emerald-200",
											children: "View Dossier"
										})]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider mb-3",
							children: "Assessment Dimensions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-xs mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#72816f]",
										children: "Geospatial Boundary Enclosure"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold",
										children: demoState === "ready" ? "100%" : "0%"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full h-1.5 bg-[#edf0e7] rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-full transition-all duration-500 ${demoState === "ready" ? "w-full bg-emerald-600" : "w-0 bg-red-500"}` })
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-xs mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#72816f]",
										children: "Temporal Index Continuity"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold",
										children: demoState === "unverified" ? "60%" : "96%"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full h-1.5 bg-[#edf0e7] rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-full transition-all duration-500 ${demoState === "unverified" ? "w-3/5 bg-amber-500" : "w-[96%] bg-emerald-600"}` })
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-xs mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#72816f]",
										children: "Practice Adherence (DSR/AWD)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold",
										children: demoState === "unverified" ? "40%" : demoState === "needs-review" ? "75%" : "92%"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full h-1.5 bg-[#edf0e7] rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-full transition-all duration-500 ${demoState === "unverified" ? "w-2/5 bg-amber-500" : demoState === "needs-review" ? "w-3/4 bg-sky-500" : "w-[92%] bg-emerald-600"}` })
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-xs mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#72816f]",
										children: "Cryptographic Provenance"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold text-emerald-700",
										children: "100%"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full h-1.5 bg-[#edf0e7] rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-emerald-600" })
								})] })
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-[#193b2a]",
						children: "MRV Evidence Checklist & Audit Gate"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#72816f]",
						children: "Mandatory items required before submission to accredited validation and verification bodies (VVB)."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setActiveTab("evidence"),
						className: "text-xs border-[#d8e1d4] hover:bg-[#f4f6f0]",
						children: "Open Evidence Explorer"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-[#edf0e7]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3 flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									size: 16,
									className: "text-emerald-600 shrink-0"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-[#193b2a] block",
									children: "Cadastral Title & Land Tenancy Record"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#72816f]",
									children: "State Land Records (Digital Jamabandi API) · Verified"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200",
								children: "VERIFIED"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3 flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									size: 16,
									className: "text-emerald-600 shrink-0"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-[#193b2a] block",
									children: "Copernicus Sentinel-2 BOA Reflectance Series"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#72816f]",
									children: "4 Cloud-Free passes (June–Aug 2026) · Corroborated"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200",
								children: "VERIFIED"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3 flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [demoState === "unverified" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
									size: 16,
									className: "text-amber-500 shrink-0"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									size: 16,
									className: "text-emerald-600 shrink-0"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-[#193b2a] block",
									children: "Perforated Water Tube (AWD) Soil Log"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#72816f]",
									children: demoState === "unverified" ? "Missing field observation log for irrigation cessation" : "AWD-Tube-Log-June-July.csv added & validated against NDWI curve"
								})] })]
							}), demoState === "unverified" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200",
								children: "MISSING"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200",
								children: "VERIFIED"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3 flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [demoState === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									size: 16,
									className: "text-emerald-600 shrink-0"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
									size: 16,
									className: "text-red-500 shrink-0"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-[#193b2a] block",
									children: "In-Boundary Geotagged Field Photograph"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#72816f]",
									children: demoState === "ready" ? "IMG_20260714_InField_DSR.jpg verified within parcel (±2.1m)" : "Current photo EV-003 flagged 420m outside boundary polygon"
								})] })]
							}), demoState === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200",
								children: "READY FOR VERIFICATION"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200",
								children: "FLAGGED"
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { CommandCentre as t };
