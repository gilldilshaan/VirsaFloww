import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-DbFAHDQB.mjs";
import { L as Hash, R as GitFork, U as FileText, at as CircleCheck, j as MapPin, m as Shield, o as Upload, p as Sparkles, rt as CirclePlus, t as X, tt as Clock, ut as Camera, x as Satellite } from "../_libs/lucide-react.mjs";
import { o as useTerraLedger } from "./store-Ddm4_oB_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/evidence-explorer-DtAeCbsh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EvidenceExplorer() {
	const { evidenceList, field, demoState, aiExplanation, addIrrigationLogAction, addInBoundaryPhotoAction, addCustomEvidenceAction } = useTerraLedger();
	const [activeFilter, setActiveFilter] = (0, import_react.useState)("all");
	const [selectedEvidence, setSelectedEvidence] = (0, import_react.useState)(null);
	const [isUploadModalOpen, setIsUploadModalOpen] = (0, import_react.useState)(false);
	const [uploadTitle, setUploadTitle] = (0, import_react.useState)("");
	const [uploadType, setUploadType] = (0, import_react.useState)("photo");
	const [uploadFileName, setUploadFileName] = (0, import_react.useState)("");
	const [uploadSuccessMessage, setUploadSuccessMessage] = (0, import_react.useState)("");
	const filteredEvidence = evidenceList.filter((item) => {
		if (activeFilter === "all") return true;
		return item.category === activeFilter;
	});
	const handleSimulatedUpload = (e) => {
		e.preventDefault();
		if (!uploadTitle.trim()) return;
		addCustomEvidenceAction({
			title: uploadTitle,
			type: uploadType,
			category: "supporting",
			status: "verified",
			description: `Uploaded ${uploadType} for parcel ${field.code}. File: ${uploadFileName || "custom-evidence.dat"}.`,
			fileDetails: {
				name: uploadFileName || `${uploadType}-attachment-${Date.now().toString().slice(-4)}.pdf`,
				sizeKb: Math.floor(Math.random() * 800) + 120,
				mime: uploadType === "photo" ? "image/jpeg" : "application/pdf"
			},
			provenance: {
				author: "Field Investigator (Demo)",
				source: "TerraLedger Field App v2.4",
				sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
				reviewStatus: "Cryptographic Hash Stamped & Attached to Parcel"
			}
		});
		setUploadSuccessMessage(`Successfully attached "${uploadTitle}" to parcel ${field.code}!`);
		setTimeout(() => {
			setUploadSuccessMessage("");
			setIsUploadModalOpen(false);
			setUploadTitle("");
			setUploadFileName("");
		}, 1800);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitFork, { size: 13 }), "Cryptographic Evidence Graph & Provenance"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight",
						children: "Evidence Explorer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#72816f] mt-1",
						children: "Audit-grade multi-layer evidence graph linking claims, satellite passes, parcel geometries, and field records."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setIsUploadModalOpen(true),
						className: "text-xs bg-[#245b45] text-white hover:bg-[#1a4333]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, {
							size: 14,
							className: "mr-1.5"
						}), "Add / Upload Evidence"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-[#173a2b] text-[#f5f5e8] border border-[#2b503e] rounded-xl p-5 shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between flex-wrap gap-2 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-mono text-[#d6eaa6] uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
								size: 14,
								className: "text-[#d6eaa6] animate-pulse"
							}), "AI Evidence Synthesis & Contradiction Detection"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded",
							children: ["Status: ", demoState === "ready" ? "READY FOR VERIFICATION" : demoState === "needs-review" ? "NEEDS REVIEW" : "UNVERIFIED"]
						})]
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
						className: "pt-3 border-t border-[#ffffff15] flex flex-wrap items-center gap-3 text-xs",
						children: [
							demoState === "unverified" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber-300 text-xs font-medium",
									children: "Contradiction active:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: addIrrigationLogAction,
									className: "h-7 text-xs bg-[#d6eaa6] text-[#173a27] hover:bg-white font-semibold",
									children: "Resolve Water Log (Simulate Step 2)"
								})]
							}),
							demoState === "needs-review" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sky-300 text-xs font-medium",
									children: "Spatial mismatch active (+420m):"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: addInBoundaryPhotoAction,
									className: "h-7 text-xs bg-emerald-500 text-white hover:bg-emerald-400 font-semibold",
									children: "Upload In-Boundary Photo (Simulate Step 3)"
								})]
							}),
							demoState === "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-emerald-300 text-xs flex items-center gap-1.5 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									size: 14,
									className: "text-emerald-400"
								}), "All contradictions resolved. Evidence completeness is 94%. Status: READY FOR VERIFICATION (pre-audit complete)."]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider mb-2",
						children: "Relational Evidence Graph (Claims ↔ Boundaries ↔ Observations)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-[#72816f] mb-4",
						children: "Visual trace connecting high-level carbon mitigation claims down to cryptographic hashes and sensor passes."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-[#102e20] rounded-xl p-6 text-white overflow-x-auto border border-[#1e4834]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-[620px] flex items-center justify-between gap-6 relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono text-[#809c88] mb-1.5",
										children: "ROOT CLAIM"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-[#173a2b] border border-[#d6eaa6]/40 rounded-xl p-3 w-44 text-center shadow-md",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
												size: 20,
												className: "text-[#d6eaa6] mx-auto mb-1"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-xs font-semibold block text-white",
												children: "DSR + AWD Adoption"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-[#809c88] block",
												children: "Kharif Season 2026"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] font-mono text-emerald-400 block mt-1",
												children: "23.04 tCO2e Target"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-0.5 flex-1 bg-[#ffffff20] relative",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-[#809c88] rotate-45" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono text-[#809c88] mb-1.5",
										children: "CADASTRAL ANCHOR"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-[#173a2b] border border-[#ffffff20] rounded-xl p-3 w-44 text-center shadow-md",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
												size: 20,
												className: "text-sky-400 mx-auto mb-1"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-xs font-semibold block text-white",
												children: field.code
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-[#809c88] block",
												children: field.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[9px] font-mono text-white/70 block mt-1",
												children: [field.areaHa, " ha (4 vertices)"]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-0.5 flex-1 bg-[#ffffff20] relative",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-[#809c88] rotate-45" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-2.5 w-52",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono text-[#809c88] mb-0 text-center",
											children: "EVIDENCE NODES"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-[#173a2b] border border-emerald-500/40 rounded-lg p-2 text-xs flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Satellite, {
													size: 14,
													className: "text-emerald-400 shrink-0"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] font-medium block",
													children: "Sentinel-2 Passes"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] font-mono text-[#809c88]",
													children: "4 Level-2A BOA Tiles"
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[9px] font-mono bg-emerald-950 text-emerald-400 px-1 rounded",
												children: "MATCH"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `border rounded-lg p-2 text-xs flex items-center justify-between ${demoState === "unverified" ? "bg-amber-950/40 border-amber-500/40 text-amber-200" : "bg-[#173a2b] border-emerald-500/40 text-white"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
													size: 14,
													className: demoState === "unverified" ? "text-amber-400" : "text-emerald-400"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] font-medium block",
													children: "AWD Water Log"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] font-mono text-[#809c88]",
													children: demoState === "unverified" ? "Log missing" : "Verified log"
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[9px] font-mono px-1 rounded ${demoState === "unverified" ? "bg-amber-900/60 text-amber-300" : "bg-emerald-950 text-emerald-400"}`,
												children: demoState === "unverified" ? "MISSING" : "MATCH"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `border rounded-lg p-2 text-xs flex items-center justify-between ${demoState === "ready" ? "bg-[#173a2b] border-emerald-500/40 text-white" : "bg-red-950/40 border-red-500/50 text-red-200"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
													size: 14,
													className: demoState === "ready" ? "text-emerald-400" : "text-red-400"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] font-medium block",
													children: "Geotagged Photo"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[9px] font-mono text-[#809c88]",
													children: demoState === "ready" ? "EV-005 in-bounds" : "EV-003 +420m off"
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-[9px] font-mono px-1 rounded ${demoState === "ready" ? "bg-emerald-950 text-emerald-400" : "bg-red-900/60 text-red-300"}`,
												children: demoState === "ready" ? "READY FOR VERIFICATION" : "MISMATCH"
											})]
										})
									]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#edf0e7] mb-4 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-[#193b2a]",
							children: "Evidence Records"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-mono bg-[#edf0e7] text-[#213c2b] px-2 py-0.5 rounded-full font-semibold",
							children: [filteredEvidence.length, " items"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex rounded-md p-0.5 bg-[#f4f6f0] border border-[#dfe6d9] text-xs font-mono",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveFilter("all"),
								className: `px-2.5 py-1 rounded transition-colors ${activeFilter === "all" ? "bg-[#193b2a] text-[#d6eaa6] font-semibold" : "text-[#72816f] hover:text-[#213c2b]"}`,
								children: "All"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveFilter("supporting"),
								className: `px-2.5 py-1 rounded transition-colors ${activeFilter === "supporting" ? "bg-emerald-700 text-white font-semibold" : "text-[#72816f] hover:text-[#213c2b]"}`,
								children: "Supporting"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveFilter("contradicting"),
								className: `px-2.5 py-1 rounded transition-colors ${activeFilter === "contradicting" ? "bg-red-700 text-white font-semibold" : "text-[#72816f] hover:text-[#213c2b]"}`,
								children: "Flagged Mismatches"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveFilter("missing"),
								className: `px-2.5 py-1 rounded transition-colors ${activeFilter === "missing" ? "bg-amber-600 text-white font-semibold" : "text-[#72816f] hover:text-[#213c2b]"}`,
								children: "Missing"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: filteredEvidence.map((item) => {
						const isFlagged = item.category === "contradicting";
						const isMissing = item.category === "missing";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setSelectedEvidence(item),
							className: `p-4 rounded-xl border text-xs cursor-pointer transition-all hover:shadow-xs ${isFlagged ? "border-red-300 bg-red-50/50" : isMissing ? "border-amber-200 bg-amber-50/40" : "border-[#dfe6d9] bg-white hover:border-[#245b45]"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											item.type === "photo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
												size: 15,
												className: "text-[#245b45]"
											}),
											item.type === "satellite" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Satellite, {
												size: 15,
												className: "text-sky-600"
											}),
											item.type === "document" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
												size: 15,
												className: "text-[#5c7c46]"
											}),
											item.type === "log" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
												size: 15,
												className: "text-amber-600"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-sm font-semibold text-[#193b2a]",
												children: item.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[10px] text-[#72816f] bg-[#f4f6f0] px-1.5 py-0.5 rounded",
												children: item.id
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${isFlagged ? "bg-red-100 text-red-800 border border-red-300" : isMissing ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-emerald-100 text-emerald-800 border border-emerald-300"}`,
											children: item.provenance.reviewStatus
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#526451] mb-2 leading-relaxed",
									children: item.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between text-[11px] text-[#72816f] pt-2 border-t border-[#edf0e7]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Source: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-[#213c2b]",
											children: item.provenance.source
										})] }), item.provenance.gpsCoordinates && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-xs",
											children: [
												"GPS: ",
												item.provenance.gpsCoordinates.lat.toFixed(4),
												"°N, ",
												item.provenance.gpsCoordinates.lng.toFixed(4),
												"°E"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#245b45] font-medium underline flex items-center gap-1",
										children: "View Details & Provenance Hash"
									})]
								})
							]
						}, item.id);
					})
				})]
			}),
			selectedEvidence && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#dfe6d9] animate-in fade-in-50 zoom-in-95",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between pb-3 border-b border-[#edf0e7] mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-[#5c7c46] uppercase tracking-wider block mb-0.5",
								children: "Evidence Provenance Inspector"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-xl font-semibold text-[#193b2a]",
								children: selectedEvidence.title
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedEvidence(null),
								className: "p-1 rounded-full text-[#72816f] hover:text-[#193b2a] hover:bg-[#f4f6f0]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#526451] bg-[#f9faf7] p-3 rounded-lg border border-[#edf0e7]",
									children: selectedEvidence.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3 py-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono text-[#72816f] block",
											children: "RECORD ID"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-[#193b2a]",
											children: selectedEvidence.id
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono text-[#72816f] block",
											children: "TIMESTAMP (UTC)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-[#193b2a]",
											children: selectedEvidence.timestamp
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono text-[#72816f] block",
											children: "AUTHOR / PROVIDER"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-[#193b2a]",
											children: selectedEvidence.provenance.author
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono text-[#72816f] block",
											children: "HARDWARE / SOURCE"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-[#193b2a]",
											children: selectedEvidence.provenance.source
										})] })
									]
								}),
								selectedEvidence.provenance.sha256 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-[#102e20] text-[#f5f5e8] p-3 rounded-lg border border-[#2b503e]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-[10px] font-mono text-[#d6eaa6] mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { size: 12 }), "SHA-256 CONTENT DIGEST"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										className: "font-mono text-[10px] break-all block text-[#a7f3d0]",
										children: selectedEvidence.provenance.sha256
									})]
								}),
								selectedEvidence.provenance.gpsCoordinates && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-[#f4f6f0] p-3 rounded-lg border border-[#dfe6d9]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono text-[#5c7c46] block uppercase mb-1",
											children: "EXIF Geolocation Coordinates"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between font-mono text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												selectedEvidence.provenance.gpsCoordinates.lat,
												"° N, ",
												selectedEvidence.provenance.gpsCoordinates.lng,
												"° E"
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[#72816f]",
												children: [
													"Accuracy: ±",
													selectedEvidence.provenance.gpsCoordinates.accuracyMeters,
													"m"
												]
											})]
										}),
										selectedEvidence.provenance.spatialDistanceMeters !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 text-[11px] font-semibold",
											children: selectedEvidence.provenance.spatialDistanceMeters > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-red-700",
												children: [
													"⚠️ Spatial distance from registered polygon: +",
													selectedEvidence.provenance.spatialDistanceMeters,
													"m (Flagged)"
												]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-emerald-700",
												children: "✓ Enclosed within cadastral polygon boundaries (Verified)"
											})
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 pt-3 border-t border-[#edf0e7] flex justify-end gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setSelectedEvidence(null),
								className: "text-xs border-[#d8e1d4]",
								children: "Close Inspector"
							})
						})
					]
				})
			}),
			isUploadModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dfe6d9] animate-in fade-in-50 zoom-in-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between pb-3 border-b border-[#edf0e7] mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono text-[#5c7c46] uppercase tracking-wider block mb-0.5",
							children: "Demonstration Ingestion Pipeline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-xl font-semibold text-[#193b2a]",
							children: "Attach Field Evidence Record"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsUploadModalOpen(false),
							className: "p-1 rounded-full text-[#72816f] hover:text-[#193b2a] hover:bg-[#f4f6f0]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
						})]
					}), uploadSuccessMessage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-8 text-center space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
								size: 32,
								className: "text-emerald-600 mx-auto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-serif text-lg text-[#193b2a]",
								children: "Evidence Attached"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#72816f]",
								children: uploadSuccessMessage
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSimulatedUpload,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-[#193b2a] block mb-1",
								children: "Evidence Title / Description *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								placeholder: "e.g. In-Field DSR Seeding Row Photograph",
								value: uploadTitle,
								onChange: (e) => setUploadTitle(e.target.value),
								className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-[#193b2a] block mb-1",
									children: "Evidence Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: uploadType,
									onChange: (e) => setUploadType(e.target.value),
									className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "photo",
											children: "Field Photograph (Geotagged)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "log",
											children: "Irrigation / Water Tube Log"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "document",
											children: "Land Registry / Legal Tenancy"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "sensor",
											children: "Soil Moisture / IoT Sensor"
										})
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-[#193b2a] block mb-1",
									children: "Target Parcel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									disabled: true,
									value: `${field.code} (${field.areaHa} ha)`,
									className: "w-full text-xs bg-[#edf0e7] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#72816f] cursor-not-allowed"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-[#193b2a] block mb-1",
								children: "Select File (Simulated)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-2 border-dashed border-[#dce3d7] rounded-xl p-4 text-center bg-[#f9faf7] hover:bg-[#edf0e7] transition-colors cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
										size: 20,
										className: "text-[#5c7c46] mx-auto mb-1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-[#213c2b] block font-medium",
										children: uploadFileName || "Click to select or drag and drop image or CSV"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[#72816f] block mt-0.5",
										children: "JPG, PNG, PDF, CSV up to 25 MB"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										className: "hidden",
										id: "file-upload",
										onChange: (e) => {
											if (e.target.files && e.target.files[0]) {
												setUploadFileName(e.target.files[0].name);
												if (!uploadTitle) setUploadTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
											}
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "file-upload",
										className: "inline-block mt-2 text-[11px] font-semibold text-[#245b45] underline cursor-pointer",
										children: "Browse Files"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-[#f4f6f0] p-3 rounded-lg text-[11px] text-[#72816f]",
								children: "Demonstration Notice: Uploads are processed in local memory and stamped with simulated SHA-256 digests. No external data is published."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => setIsUploadModalOpen(false),
									className: "text-xs border-[#d8e1d4]",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									className: "text-xs bg-[#245b45] text-white hover:bg-[#1a4333]",
									children: "Stamp & Attach to Parcel"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { EvidenceExplorer as t };
