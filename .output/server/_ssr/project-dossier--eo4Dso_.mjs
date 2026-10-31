import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-DbFAHDQB.mjs";
import { G as FileCheckCorner, X as Download, _ as Send, at as CircleCheck, g as ShieldAlert, h as ShieldCheck, t as X } from "../_libs/lucide-react.mjs";
import { o as useTerraLedger } from "./store-Ddm4_oB_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/project-dossier--eo4Dso_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectDossier() {
	const { assessmentStatus, completenessPercent, demoState, submitBuyerInquiry } = useTerraLedger();
	const [isInquiryModalOpen, setIsInquiryModalOpen] = (0, import_react.useState)(false);
	const [buyerName, setBuyerName] = (0, import_react.useState)("");
	const [buyerOrg, setBuyerOrg] = (0, import_react.useState)("");
	const [buyerEmail, setBuyerEmail] = (0, import_react.useState)("");
	const [volume, setVolume] = (0, import_react.useState)("2500");
	const [vintage, setVintage] = (0, import_react.useState)("2026");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [inquiryResult, setInquiryResult] = (0, import_react.useState)(null);
	const handleInquirySubmit = (e) => {
		e.preventDefault();
		if (!buyerName || !buyerOrg || !buyerEmail) return;
		const res = submitBuyerInquiry({
			buyerName,
			buyerOrg,
			projectTitle: "Punjab Direct Seeded Rice MRV Cluster #1",
			volumeRequestedTons: Number(volume) || 1e3,
			targetRetirementYear: vintage
		});
		setInquiryResult(res);
		setTimeout(() => {
			setInquiryResult(null);
			setIsInquiryModalOpen(false);
			setBuyerName("");
			setBuyerOrg("");
			setBuyerEmail("");
		}, 2200);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { size: 13 }), "Institutional Due Diligence & Project Dossier"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight",
						children: "Punjab DSR MRV Cluster #1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#72816f] mt-1",
						children: "Dossier compiled from multi-spectral satellite observations, cadastral polygons, and farmer field evidence."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setIsInquiryModalOpen(true),
						className: "text-xs bg-[#245b45] text-white hover:bg-[#1a4333]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
							size: 13,
							className: "mr-1.5"
						}), "Request Data Room Access"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-amber-50 border border-amber-300 rounded-xl p-4 text-amber-950 flex items-start gap-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
					size: 18,
					className: "text-amber-700 shrink-0 mt-0.5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "block text-amber-900 font-semibold mb-0.5",
					children: "Independent Verification Notice"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Automated multi-source evidence screening organizes and validates data completeness, spatial enclosure, and temporal continuity. This dossier serves as the pre-audit data room for accredited Validation and Verification Bodies (VVBs). It does not constitute independent third-party carbon credit certification or guarantee credit issuance." })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "Cluster Scale"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "block text-2xl font-mono text-[#193b2a] mt-1",
								children: "1,450 ha"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block",
								children: "180 Registered Parcels"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "Annual Volume"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "block text-2xl font-mono text-[#245b45] mt-1",
								children: "6,960 t"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block",
								children: "Estimated CO2e reduction"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "Methodology"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "block text-sm font-semibold text-[#193b2a] mt-1",
								children: "Verra VM0042"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block",
								children: "Agri-Land Management"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "Audit Readiness"
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
					className: "lg:col-span-7 bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-3 border-b border-[#edf0e7]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-semibold text-[#193b2a] flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
								size: 16,
								className: "text-[#245b45]"
							}), "Institutional Due Diligence Scorecard"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono text-[#72816f]",
							children: "VINTAGE KHARIF 2026"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3.5 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-[#f9faf7] rounded-lg border border-[#edf0e7]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-medium mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#193b2a]",
										children: "1. Geospatial Cadastral Alignment"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-emerald-700 font-semibold",
										children: demoState === "ready" ? "Pass · 100%" : "Flagged (1 Mismatch)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-[#72816f] leading-relaxed",
									children: "All field boundaries anchored to official Punjab State digital land revenue records. Centroid tolerance < 5m."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-[#f9faf7] rounded-lg border border-[#edf0e7]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-medium mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#193b2a]",
										children: "2. Remote Sensing Phenology Match"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-emerald-700 font-semibold",
										children: "Pass · High Confidence"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-[#72816f] leading-relaxed",
									children: "Copernicus Sentinel-2 Level-2A multi-spectral passes corroborate direct seeding emergence without puddling and track seasonal NDVI growth curve."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-[#f9faf7] rounded-lg border border-[#edf0e7]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-medium mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#193b2a]",
										children: "3. Water Saving Practice Evidence (AWD)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-mono font-semibold ${demoState === "unverified" ? "text-amber-700" : "text-emerald-700"}`,
										children: demoState === "unverified" ? "Incomplete (Log Missing)" : "Pass · Ready for Verification"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-[#72816f] leading-relaxed",
									children: "Field perforated PVC water tube readings validate 15cm drying depth cycles, confirming absence of continuous anaerobic flood conditions."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 bg-[#f9faf7] rounded-lg border border-[#edf0e7]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-medium mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#193b2a]",
										children: "4. Farmer Benefit Share Guarantee"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-emerald-700 font-semibold",
										children: "Pass · 80% Direct Share"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-[#72816f] leading-relaxed",
									children: "Binding aggregation agreement with Malwa Agro FPO guaranteeing 80% net carbon credit proceeds directly into participating farmers' bank accounts."
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-5 flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-semibold text-[#193b2a] uppercase font-mono tracking-wider mb-3",
								children: "Cryptographic Audit Trail Summary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-[#edf0e7]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#72816f]",
											children: "Total Evaluated Documents:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "font-mono text-[#213c2b]",
											children: "184 Records"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-[#edf0e7]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#72816f]",
											children: "Satellite Scenes Analyzed:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "font-mono text-[#213c2b]",
											children: "16 Passes (S2 MSI)"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-[#edf0e7]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#72816f]",
											children: "Cadastral Parcel Registry:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-700 font-semibold",
											children: "100% Jamabandi Match"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-[#edf0e7]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#72816f]",
											children: "Immutable Digest:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] text-[#72816f]",
											children: "SHA-256 Merkle Root"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#72816f]",
											children: "Current Cluster Status:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-[#245b45]",
											children: assessmentStatus.replace(/_/g, " ")
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 pt-3 border-t border-[#edf0e7]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										alert("Demonstration: Project Data Room package download initiated.");
									},
									className: "w-full text-xs border-[#d8e1d4] hover:bg-[#f4f6f0] text-[#193b2a]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
										size: 13,
										className: "mr-1.5"
									}), "Download Summary Dossier (PDF Demo)"]
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-[#173a2b] text-white border border-[#2b503e] rounded-xl p-5 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-[#d6eaa6] uppercase tracking-wider block mb-1",
								children: "Project Developer & FPO Aggregator"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-serif text-base font-semibold text-white",
								children: "Panjdhara Agritech Private Limited"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#c6d7cb] mt-1 leading-relaxed",
								children: "In institutional partnership with Malwa Agro Farmer Producer Organisation (Registration #FPO-PB-2024-819)."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 pt-2 border-t border-[#ffffff15] text-[11px] text-[#a7f3d0] flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Contact: contact@thecarboncredit.in" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: "Panjdhara India"
								})]
							})
						]
					})]
				})]
			}),
			isInquiryModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dfe6d9] animate-in fade-in-50 zoom-in-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between pb-3 border-b border-[#edf0e7] mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono text-[#5c7c46] uppercase tracking-wider block mb-0.5",
							children: "Institutional Offtake & Inquiry"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-xl font-semibold text-[#193b2a]",
							children: "Request Data Room & Due Diligence Access"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsInquiryModalOpen(false),
							className: "p-1 rounded-full text-[#72816f] hover:text-[#193b2a] hover:bg-[#f4f6f0]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
						})]
					}), inquiryResult ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-8 text-center space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
								size: 32,
								className: "text-emerald-600 mx-auto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-serif text-lg text-[#193b2a]",
								children: "Request Submitted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#72816f]",
								children: inquiryResult.message
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleInquirySubmit,
						className: "space-y-3.5 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-medium text-[#193b2a] block mb-1",
								children: "Your Full Name *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								required: true,
								placeholder: "e.g. Sarah Jenkins",
								value: buyerName,
								onChange: (e) => setBuyerName(e.target.value),
								className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-medium text-[#193b2a] block mb-1",
									children: "Organization / Fund *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "e.g. Global Climate Capital Ltd",
									value: buyerOrg,
									onChange: (e) => setBuyerOrg(e.target.value),
									className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-medium text-[#193b2a] block mb-1",
									children: "Business Email *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									required: true,
									placeholder: "s.jenkins@climatecap.com",
									value: buyerEmail,
									onChange: (e) => setBuyerEmail(e.target.value),
									className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-medium text-[#193b2a] block mb-1",
									children: "Inquired Volume (tCO2e)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: "100",
									step: "100",
									value: volume,
									onChange: (e) => setVolume(e.target.value),
									className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-medium text-[#193b2a] block mb-1",
									children: "Target Vintage"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: vintage,
									onChange: (e) => setVintage(e.target.value),
									className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2026",
											children: "Kharif 2026 (Forward)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2027",
											children: "Kharif 2027 (Forward)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Multi-year",
											children: "Multi-year Offtake (2026-2029)"
										})
									]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-medium text-[#193b2a] block mb-1",
								children: "Notes / Scope Requirements"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								placeholder: "Specific due-diligence questions, VVB requirements, or Scope 3 inset requirements...",
								value: notes,
								onChange: (e) => setNotes(e.target.value),
								className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#72816f] bg-[#f9faf7] p-2.5 rounded-lg border border-[#edf0e7]",
								children: "Demonstration Notice: Submitting records this enquiry into the local Due Diligence Pipeline tracker without sending unconsented external emails."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => setIsInquiryModalOpen(false),
									className: "text-xs border-[#d8e1d4]",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									className: "text-xs bg-[#245b45] text-white hover:bg-[#1a4333]",
									children: "Submit Data Room Request"
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
export { ProjectDossier as t };
