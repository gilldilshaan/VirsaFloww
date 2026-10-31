import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-DbFAHDQB.mjs";
import { F as Layers, I as Info, J as Earth, at as CircleCheck, dt as Calendar, j as MapPin, p as Sparkles } from "../_libs/lucide-react.mjs";
import { o as useTerraLedger } from "./store-Ddm4_oB_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terra-intelligence-ObQ_5imW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DemoBadge({ label = "Synthetic Demo Dataset" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-mono",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
			size: 12,
			className: "text-amber-600"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
	});
}
function TerraIntelligenceView() {
	const { field, satelliteObservations, demoState } = useTerraLedger();
	const [activeLayer, setActiveLayer] = (0, import_react.useState)("ndvi");
	const [activeDateIndex, setActiveDateIndex] = (0, import_react.useState)(2);
	const [opacity, setOpacity] = (0, import_react.useState)(85);
	const [showBoundary, setShowBoundary] = (0, import_react.useState)(true);
	const [showGpsPins, setShowGpsPins] = (0, import_react.useState)(true);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const currentObservation = satelliteObservations[activeDateIndex] || satelliteObservations[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#e2e8dc]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { size: 13 }), "Terra Intelligence · Geospatial MRV Engine"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight",
						children: "Geospatial Evidence Workspace"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-[#72816f] mt-1",
						children: [
							"Cadastral parcel ",
							field.code,
							" · Copernicus Sentinel-2 MSI multi-spectral time series and ground telemetry synthesis."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBadge, { label: "Synthetic Calibrated Feed · Demo" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-[#f0f6ec] border border-[#cde0c5] rounded-xl p-3.5 flex items-start gap-3 text-xs text-[#2a4d36]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					size: 16,
					className: "text-[#3a754c] shrink-0 mt-0.5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "font-semibold block text-[#1a3824]",
					children: "Notice: Synthetic Demonstration Geospatial Feed"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Spectral values and parcel overlays demonstrate TerraLedger's automated remote-sensing pipeline (Verra VM0042 / AMS-III.AU protocols). Imagery and vegetation indices are simulated for demonstrative validation; this output does not constitute third-party accredited certificate issuance." })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-4 gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider flex items-center gap-2 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, {
										size: 14,
										className: "text-[#5c7c46]"
									}), "Spectral Map Layers"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setActiveLayer("ndvi"),
											className: `w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${activeLayer === "ndvi" ? "bg-[#eef5e6] border-[#729e5a] text-[#1c3e27] font-semibold" : "bg-white border-[#e3ebd9] text-[#4f6453] hover:bg-[#fafbf8]"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: "NDVI (Vegetation Index)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-[#788e7c]",
												children: "Biomass growth & row emergence"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800",
												children: "10m"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setActiveLayer("ndwi"),
											className: `w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${activeLayer === "ndwi" ? "bg-[#eef5e6] border-[#729e5a] text-[#1c3e27] font-semibold" : "bg-white border-[#e3ebd9] text-[#4f6453] hover:bg-[#fafbf8]"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: "NDWI (Water/Moisture Index)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-[#788e7c]",
												children: "AWD drying cycles & ponding"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 text-sky-800",
												children: "10m"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setActiveLayer("rgb"),
											className: `w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${activeLayer === "rgb" ? "bg-[#eef5e6] border-[#729e5a] text-[#1c3e27] font-semibold" : "bg-white border-[#e3ebd9] text-[#4f6453] hover:bg-[#fafbf8]"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: "True Color (RGB Ortho)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-[#788e7c]",
												children: "Visual surface reflectance"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800",
												children: "MSI"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setActiveLayer("cadastral"),
											className: `w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${activeLayer === "cadastral" ? "bg-[#eef5e6] border-[#729e5a] text-[#1c3e27] font-semibold" : "bg-white border-[#e3ebd9] text-[#4f6453] hover:bg-[#fafbf8]"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: "Revenue Cadastral Overlay"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-[#788e7c]",
												children: "Jamabandi tenancy polygon"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-800",
												children: "<1m"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 pt-4 border-t border-[#edf2e8]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-[#4f6453] mb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Layer Opacity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-semibold",
											children: [opacity, "%"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: "20",
										max: "100",
										value: opacity,
										onChange: (e) => setOpacity(Number(e.target.value)),
										className: "w-full h-1.5 bg-[#e0ebd7] rounded-lg appearance-none cursor-pointer accent-[#245b45]"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 pt-4 border-t border-[#edf2e8] space-y-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: showBoundary,
											onChange: (e) => setShowBoundary(e.target.checked),
											className: "rounded text-[#245b45] focus:ring-[#245b45]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[#314a38]",
											children: [
												"Show Parcel Boundary (",
												field.code,
												")"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: showGpsPins,
											onChange: (e) => setShowGpsPins(e.target.checked),
											className: "rounded text-[#245b45] focus:ring-[#245b45]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#314a38]",
											children: "Show Geotagged Evidence Pins"
										})]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-[11px] font-mono text-[#69816a] uppercase mb-2",
									children: activeLayer === "ndvi" ? "NDVI Scale (Biomass)" : activeLayer === "ndwi" ? "NDWI Scale (Water Content)" : "Spectral Palette"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-full rounded bg-gradient-to-r from-[#d73027] via-[#ffffbf] to-[#1a9850]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[10px] font-mono text-[#788e7c] mt-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: activeLayer === "ndvi" ? "0.0 (Bare Soil)" : "-0.3 (Dry)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: activeLayer === "ndvi" ? "0.4 (Emerging)" : "0.0 (Moist)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: activeLayer === "ndvi" ? "0.8+ (Dense)" : "+0.3 (Flooded)" })
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-2 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-[#12281c] border border-[#234b35] rounded-xl overflow-hidden shadow-md relative min-h-[460px] flex flex-col justify-between p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 z-10 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-[#0b1b13]/80 backdrop-blur border border-[#ffffff20] text-white text-[11px] font-mono px-2.5 py-1 rounded-md flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
											size: 12,
											className: "text-[#d6eaa6]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Lat: ",
											field.coordinates.lat.toFixed(4),
											"°N, Lng: ",
											field.coordinates.lng.toFixed(4),
											"°E"
										] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-[#0b1b13]/80 backdrop-blur border border-[#ffffff20] text-[#d6eaa6] text-[11px] font-mono px-2.5 py-1 rounded-md",
										children: [
											"Pass: ",
											currentObservation?.date,
											" · ",
											activeLayer.toUpperCase()
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0 flex items-center justify-center pointer-events-none",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-full h-full absolute inset-0 opacity-40",
											style: {
												backgroundImage: activeLayer === "ndvi" ? "radial-gradient(circle at 55% 45%, #2d7a46 0%, #154528 50%, #0d2919 100%)" : activeLayer === "ndwi" ? "radial-gradient(circle at 55% 45%, #1e5f74 0%, #0f3542 50%, #0d2919 100%)" : "radial-gradient(circle at 55% 45%, #60583b 0%, #363a24 50%, #0d2919 100%)",
												opacity: opacity / 100
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-full h-full absolute inset-0 opacity-15",
											style: {
												backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
												backgroundSize: "40px 40px"
											}
										}),
										showBoundary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative w-64 h-52 border-2 border-[#d6eaa6] bg-[#d6eaa6]/15 rounded-md flex items-center justify-center transform -rotate-3 shadow-lg",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "absolute top-2 left-2 text-[10px] font-mono bg-[#0b1b13]/90 text-[#d6eaa6] px-1.5 py-0.5 rounded border border-[#d6eaa6]/40",
													children: [
														field.code,
														" (",
														field.areaHa,
														" ha)"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "absolute bottom-6 right-8 flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-3 rounded-full bg-sky-400 animate-ping absolute" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-3 rounded-full bg-sky-500 border border-white relative z-10" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[9px] font-mono bg-[#0b1b13]/90 text-sky-200 px-1 rounded ml-1",
															children: "AWD Tube #1"
														})
													]
												}),
												demoState !== "unverified" && showGpsPins && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "absolute top-8 right-12 flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-3 rounded-full bg-emerald-500 border border-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[9px] font-mono bg-[#0b1b13]/90 text-emerald-300 px-1 rounded ml-1",
														children: "EV-005 (In-Boundary 2.1m)"
													})]
												})
											]
										}),
										showGpsPins && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute top-12 left-8 flex items-center gap-1 transform translate-x-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] font-mono bg-[#0b1b13]/90 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/50",
												children: "EV-003 (+420m Offset)"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs text-[#bacabd] z-10 bg-[#0b1b13]/80 backdrop-blur p-2 rounded-lg border border-[#ffffff15]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono",
												children: "Scale: 1:5,000 (100m)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono",
												children: "EPSG: 4326 (WGS84)"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-mono text-white",
											children: [
												"Cloud: ",
												currentObservation?.cloudCoverPercent,
												"%"
											]
										})]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
											size: 14,
											className: "text-[#5c7c46]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider",
											children: "Spectral Pass Timeline (Kharif 2026)"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] font-mono text-[#5c7c46]",
										children: [
											"Pass ",
											activeDateIndex + 1,
											" of ",
											satelliteObservations.length
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
									children: satelliteObservations.map((obs, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setActiveDateIndex(idx),
										className: `p-2 rounded-lg border text-left text-xs transition-all ${activeDateIndex === idx ? "bg-[#245b45] text-white border-[#245b45] shadow-xs" : "bg-[#f8faf6] border-[#e2e8dc] text-[#3d5341] hover:bg-[#edf2e8]"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono text-[10px] opacity-80",
												children: obs.date
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-semibold text-xs mt-0.5 truncate",
												children: ["NDVI: ", obs.meanNdvi.toFixed(2)]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[9px] opacity-75 mt-0.5 truncate",
												children: obs.surfaceWaterDetected ? "Surface Water" : "Dry Surface"
											})
										]
									}, obs.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-[#526a57] pt-1 italic",
									children: ["Observation Notes: ", currentObservation?.notes]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									size: 14,
									className: "text-[#5c7c46]"
								}), "Data Quality Indicators"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 bg-[#f8faf6] rounded-lg border border-[#e2ebd9]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[#69816a] font-mono text-[10px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CLOUD CLEARANCE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald-700 font-bold",
													children: "OPTIMAL"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-sm font-semibold text-[#193b2a] mt-0.5",
												children: [currentObservation?.cloudCoverPercent, "% Cloud Cover"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-[#788e7c] mt-0.5",
												children: "Under 5.0% threshold required for valid radiometric calculation."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 bg-[#f8faf6] rounded-lg border border-[#e2ebd9]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[#69816a] font-mono text-[10px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ATMOSPHERIC LEVEL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[#245b45] font-bold",
													children: "BOA LEVEL-2A"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-semibold text-[#193b2a] mt-0.5",
												children: "Bottom-Of-Atmosphere"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-[#788e7c] mt-0.5",
												children: "Sen2Cor corrected surface reflectance with 10m spatial resolution."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 bg-[#f8faf6] rounded-lg border border-[#e2ebd9]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[#69816a] font-mono text-[10px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SENSOR SATELLITE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-purple-700 font-bold",
													children: "SENTINEL-2 MSI"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-semibold text-[#193b2a] mt-0.5",
												children: currentObservation?.sensor
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[10px] text-[#788e7c] mt-0.5",
												children: [
													"Solar azimuth: ",
													currentObservation?.sunAzimuthDeg,
													"° · Calibrated."
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 bg-[#f8faf6] rounded-lg border border-[#e2ebd9]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[#69816a] font-mono text-[10px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GROUND CORROBORATION" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sky-700 font-bold",
													children: "ALIGNED"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-semibold text-[#193b2a] mt-0.5",
												children: "AWD Drying Corroboration"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-[#788e7c] mt-0.5",
												children: "Piezometer drop coincides with negative NDWI signature."
											})
										]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-[#173a2b] text-white rounded-xl p-4 shadow-xs space-y-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-semibold uppercase font-mono text-[#d6eaa6]",
									children: "GIS Layer Export"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-[#bacabd]",
									children: "Export geo-referenced multi-band GeoTIFF and cadastral GeoJSON files for third-party auditing."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									className: "w-full bg-[#d6eaa6] text-[#102e20] hover:bg-[#c2de8c] text-xs font-semibold h-8",
									onClick: () => alert("Synthetic demonstration GeoJSON parcel envelope downloaded."),
									children: "Export Boundary GeoJSON"
								})
							]
						})]
					})
				]
			})
		]
	});
}
var SplitComponent = TerraIntelligenceView;
//#endregion
export { SplitComponent as component };
