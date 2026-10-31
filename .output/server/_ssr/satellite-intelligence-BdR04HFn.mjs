import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-DbFAHDQB.mjs";
import { C as RefreshCw, I as Info, dt as Calendar, et as CloudSun, l as TrendingUp, ot as CircleAlert, x as Satellite } from "../_libs/lucide-react.mjs";
import { o as useTerraLedger } from "./store-Ddm4_oB_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/satellite-intelligence-BdR04HFn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SatelliteIntelligence() {
	const { satelliteObservations, field } = useTerraLedger();
	const [selectedObsId, setSelectedObsId] = (0, import_react.useState)(satelliteObservations[2]?.id || "S2A_20260728_PB");
	const [compareObsId, setCompareObsId] = (0, import_react.useState)(satelliteObservations[0]?.id || "S2A_20260614_PB");
	const [activeSpectralIndex, setActiveSpectralIndex] = (0, import_react.useState)("NDVI");
	const [comparisonMode, setComparisonMode] = (0, import_react.useState)(false);
	const [uiState, setUiState] = (0, import_react.useState)("normal");
	const defaultObs = satelliteObservations[0];
	const selectedObs = satelliteObservations.find((o) => o.id === selectedObsId) ?? defaultObs;
	const compareObs = satelliteObservations.find((o) => o.id === compareObsId) ?? defaultObs;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Satellite, { size: 13 }), "Earth Observation & Spectral Analysis"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight",
						children: "Satellite Intelligence"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-[#72816f] mt-1",
						children: [
							"Copernicus Sentinel-2 MSI Level-2A multi-spectral time-series for Parcel ",
							field.code,
							"."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-lg p-1 flex items-center gap-1 text-[11px] font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#72816f] px-1.5",
								children: "View State:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setUiState("normal"),
								className: `px-2 py-0.5 rounded ${uiState === "normal" ? "bg-[#245b45] text-white font-medium" : "text-[#72816f]"}`,
								children: "Live"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setUiState("loading"),
								className: `px-2 py-0.5 rounded ${uiState === "loading" ? "bg-[#245b45] text-white font-medium" : "text-[#72816f]"}`,
								children: "Loading"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setUiState("empty"),
								className: `px-2 py-0.5 rounded ${uiState === "empty" ? "bg-[#245b45] text-white font-medium" : "text-[#72816f]"}`,
								children: "Empty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setUiState("error"),
								className: `px-2 py-0.5 rounded ${uiState === "error" ? "bg-[#245b45] text-white font-medium" : "text-[#72816f]"}`,
								children: "Error"
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-slate-900 border border-emerald-900/40 rounded-xl p-3.5 text-slate-200 flex items-start gap-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					size: 16,
					className: "text-emerald-400 shrink-0 mt-0.5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-white block font-medium",
						children: "Demonstration Earth Observation Engine"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-slate-300",
						children: "Observation scenes reflect actual Copernicus Sentinel-2 MSI phenology models for Punjab Kharif Direct Seeded Rice and Alternate Wetting & Drying cycles. Measurements are illustrative and clearly labeled."
					})]
				})]
			}),
			uiState === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl p-16 text-center space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
						size: 28,
						className: "animate-spin text-[#245b45] mx-auto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg text-[#193b2a]",
						children: "Querying Copernicus Open Access Hub..."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#72816f]",
						children: "Processing Level-2A Bottom-Of-Atmosphere surface reflectance tile 43UFR"
					})
				]
			}),
			uiState === "empty" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl p-16 text-center space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Satellite, {
						size: 28,
						className: "text-[#809c88] mx-auto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg text-[#193b2a]",
						children: "No Sentinel-2 Observations in Selected Date Window"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#72816f]",
						children: "Try widening your date window or adjusting the cloud-cover threshold filter."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => setUiState("normal"),
						className: "bg-[#245b45] text-white text-xs",
						children: "Reset Date Filters"
					})
				]
			}),
			uiState === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-red-200 rounded-xl p-12 text-center space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
						size: 28,
						className: "text-red-500 mx-auto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg text-red-900",
						children: "Sentinel Hub API Service Unavailable"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#72816f]",
						children: "Failed to fetch raster spectral data for tile 43UFR. Error HTTP 503."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => setUiState("normal"),
						className: "bg-red-700 text-white text-xs",
						children: "Retry Request"
					})
				]
			}),
			uiState === "normal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-mono text-[#72816f] uppercase mr-2",
						children: "Observation Date:"
					}), satelliteObservations.map((obs) => {
						const isSelected = selectedObs.id === obs.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedObsId(obs.id),
							className: `px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${isSelected ? "bg-[#193b2a] text-[#d6eaa6] font-semibold shadow-xs" : "bg-[#f4f6f0] text-[#213c2b] hover:bg-[#edf0e7]"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
								size: 12,
								className: isSelected ? "text-[#d6eaa6]" : "text-[#72816f]"
							}), obs.date]
						}, obs.id);
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-[#edf0e7]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-[#72816f] flex items-center gap-2 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: comparisonMode,
							onChange: (e) => setComparisonMode(e.target.checked),
							className: "rounded text-[#245b45] accent-[#245b45]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-[#213c2b]",
							children: "Compare with Baseline"
						})]
					}), comparisonMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: compareObsId,
						onChange: (e) => setCompareObsId(e.target.value),
						className: "text-xs font-mono bg-[#f4f6f0] border border-[#d8e1d4] rounded px-2 py-1 text-[#213c2b] outline-none",
						children: satelliteObservations.map((obs) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: obs.id,
							children: [
								obs.date,
								" (",
								obs.id.slice(0, 3),
								")"
							]
						}, obs.id))
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-8 bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs flex flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#edf0e7] mb-4 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-semibold text-[#193b2a]",
										children: ["Spectral Visualizer: ", activeSpectralIndex]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono bg-[#e8f4ea] text-[#245b45] px-2 py-0.5 rounded border border-[#c3e6cb]",
										children: selectedObs.date
									}),
									comparisonMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] font-mono bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-200",
										children: ["vs ", compareObs.date]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex rounded-md p-0.5 bg-[#f4f6f0] border border-[#dfe6d9] text-xs font-mono",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActiveSpectralIndex("NDVI"),
										className: `px-3 py-1 rounded transition-colors ${activeSpectralIndex === "NDVI" ? "bg-[#193b2a] text-[#d6eaa6] font-semibold" : "text-[#72816f] hover:text-[#213c2b]"}`,
										children: "NDVI (Vegetation)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActiveSpectralIndex("NDWI"),
										className: `px-3 py-1 rounded transition-colors ${activeSpectralIndex === "NDWI" ? "bg-[#193b2a] text-[#d6eaa6] font-semibold" : "text-[#72816f] hover:text-[#213c2b]"}`,
										children: "NDWI (Moisture)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setActiveSpectralIndex("RGB"),
										className: `px-3 py-1 rounded transition-colors ${activeSpectralIndex === "RGB" ? "bg-[#193b2a] text-[#d6eaa6] font-semibold" : "text-[#72816f] hover:text-[#213c2b]"}`,
										children: "True Color RGB"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full aspect-16/10 rounded-lg overflow-hidden border border-[#2b503e] bg-slate-900 flex items-center justify-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 bg-cover bg-center opacity-60",
									style: { backgroundImage: `url('/earth/platform-field-satellite.webp')` }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									viewBox: "0 0 600 380",
									className: "relative z-10 w-full h-full p-4",
									preserveAspectRatio: "xMidYMid meet",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "ndviGradient",
											x1: "0%",
											y1: "0%",
											x2: "100%",
											y2: "100%",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "0%",
													stopColor: "#84cc16",
													stopOpacity: "0.75"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "50%",
													stopColor: "#22c55e",
													stopOpacity: "0.8"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "100%",
													stopColor: "#15803d",
													stopOpacity: "0.85"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "ndwiGradient",
											x1: "0%",
											y1: "0%",
											x2: "100%",
											y2: "100%",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "0%",
													stopColor: "#38bdf8",
													stopOpacity: "0.7"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "60%",
													stopColor: "#0284c7",
													stopOpacity: "0.75"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
													offset: "100%",
													stopColor: "#0369a1",
													stopOpacity: "0.8"
												})
											]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
											points: "160,70 440,90 410,310 130,270",
											fill: activeSpectralIndex === "NDVI" ? "url(#ndviGradient)" : activeSpectralIndex === "NDWI" ? "url(#ndwiGradient)" : "rgba(255, 255, 255, 0.15)",
											stroke: "#ffffff",
											strokeWidth: "2"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											x: "200",
											y: "150",
											width: "200",
											height: "70",
											rx: "8",
											fill: "rgba(16, 46, 32, 0.88)",
											stroke: "#d6eaa6",
											strokeWidth: "1"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											x: "300",
											y: "174",
											fill: "#ffffff",
											fontSize: "11",
											fontFamily: "IBM Plex Mono",
											textAnchor: "middle",
											fontWeight: "bold",
											children: activeSpectralIndex === "NDVI" ? `NDVI: ${selectedObs.meanNdvi.toFixed(2)}` : activeSpectralIndex === "NDWI" ? `NDWI: ${selectedObs.meanNdwi.toFixed(2)}` : "RGB BOA Reflectance"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											x: "300",
											y: "192",
											fill: "#d6eaa6",
											fontSize: "10",
											fontFamily: "IBM Plex Mono",
											textAnchor: "middle",
											children: "Tile: 43UFR · 10m Ground Res"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
											x: "300",
											y: "208",
											fill: "#a7f3d0",
											fontSize: "9",
											fontFamily: "IBM Plex Mono",
											textAnchor: "middle",
											children: [
												"Cloud Cover: ",
												selectedObs.cloudCoverPercent,
												"%"
											]
										}),
										comparisonMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
												x: "20",
												y: "20",
												width: "180",
												height: "50",
												rx: "6",
												fill: "rgba(0, 0, 0, 0.75)",
												stroke: "#38bdf8"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
												x: "110",
												y: "38",
												fill: "#38bdf8",
												fontSize: "10",
												fontFamily: "IBM Plex Mono",
												textAnchor: "middle",
												children: [
													"Δ ",
													activeSpectralIndex,
													": ",
													activeSpectralIndex === "NDVI" ? (selectedObs.meanNdvi - compareObs.meanNdvi).toFixed(2) : (selectedObs.meanNdwi - compareObs.meanNdwi).toFixed(2)
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
												x: "110",
												y: "54",
												fill: "#ffffff",
												fontSize: "9",
												fontFamily: "IBM Plex Mono",
												textAnchor: "middle",
												children: ["Baseline: ", compareObs.date]
											})
										] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute bottom-3 left-4 right-4 bg-black/80 backdrop-blur-xs rounded-md px-4 py-2 flex items-center justify-between text-[10px] text-white font-mono",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "-0.2 (Bare/Dry)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-2 flex-1 mx-4 rounded-full",
											style: { background: activeSpectralIndex === "NDVI" ? "linear-gradient(to right, #ef4444, #eab308, #84cc16, #15803d)" : "linear-gradient(to right, #f97316, #e2e8f0, #38bdf8, #0369a1)" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"+0.85 (High ",
											activeSpectralIndex === "NDVI" ? "Canopy" : "Moisture",
											")"
										] })
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 p-3 bg-[#f9faf7] border border-[#edf0e7] rounded-lg text-xs text-[#213c2b]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "font-semibold text-[#193b2a] block mb-0.5",
								children: "Observation Assessment:"
							}), selectedObs.notes]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-4 flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider mb-3 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudSun, {
								size: 14,
								className: "text-[#245b45]"
							}), "Scene Acquisition Metadata"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1 border-b border-[#edf0e7]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#72816f]",
										children: "Sensor Platform:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-mono text-[#213c2b]",
										children: selectedObs.sensor
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1 border-b border-[#edf0e7]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#72816f]",
										children: "Acquisition Date:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-mono text-[#213c2b]",
										children: selectedObs.date
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1 border-b border-[#edf0e7]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#72816f]",
										children: "Cloud Cover:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-emerald-700 font-semibold",
										children: [selectedObs.cloudCoverPercent, "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1 border-b border-[#edf0e7]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#72816f]",
										children: "Spatial Resolution:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[#213c2b]",
										children: "10m / Ground Sample"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1 border-b border-[#edf0e7]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#72816f]",
										children: "Sun Azimuth / Angle:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[#213c2b]",
										children: [selectedObs.sunAzimuthDeg, "°"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#72816f]",
										children: "Quality Rating:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-semibold",
										children: selectedObs.qualityRating
									})]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider mb-2 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
									size: 14,
									className: "text-[#245b45]"
								}), "Seasonal Index Dynamics"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#72816f] mb-3",
								children: "Demonstrating DSR vegetative growth curve (NDVI) alongside intermittent AWD aeration cycles (NDWI)."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: satelliteObservations.map((obs) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => setSelectedObsId(obs.id),
									className: `p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${selectedObs.id === obs.id ? "border-[#245b45] bg-[#e8f4ea]" : "border-[#edf0e7] hover:border-[#cbd7c5]"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between font-mono text-[11px] font-semibold mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: obs.date }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[#245b45]",
											children: ["NDVI ", obs.meanNdvi.toFixed(2)]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex-1 h-2 bg-[#e2e8f0] rounded-full overflow-hidden flex",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "bg-emerald-600 h-full",
												style: { width: `${Math.max(5, obs.meanNdvi * 100)}%` }
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-[10px] text-sky-700",
											children: ["NDWI ", obs.meanNdwi > 0 ? `+${obs.meanNdwi.toFixed(2)}` : obs.meanNdwi.toFixed(2)]
										})]
									})]
								}, obs.id))
							})
						]
					})]
				})]
			})] })
		]
	});
}
//#endregion
export { SatelliteIntelligence as t };
