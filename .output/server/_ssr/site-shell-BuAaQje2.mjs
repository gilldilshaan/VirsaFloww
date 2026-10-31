import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as AcreonBrand, o as publicNavigation, r as PRODUCTION_SITE_URL, u as useAccount } from "./acreon-brand-HLTFfwjE.mjs";
import { t as Button } from "./button-DbFAHDQB.mjs";
import { p as useLocation, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as Menu, ft as ArrowUpRight, t as X } from "../_libs/lucide-react.mjs";
import { t as Analytics } from "../_libs/vercel__analytics.mjs";
import { t as SpeedInsights } from "../_libs/vercel__speed-insights.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-shell-BuAaQje2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Progressive enhancement: content stays readable without motion or JavaScript. */
function usePublicMotion(ref, pathname) {
	(0, import_react.useEffect)(() => {
		const root = ref.current;
		if (!root) return;
		const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
		let dispose = () => {};
		const setup = () => {
			dispose();
			if (preference.matches) return;
			const animations = [];
			const targets = Array.from(root.querySelectorAll(".earth-section-heading, .earth-page-intro-copy > *, .earth-challenge, .earth-workflow article, .earth-solution-card, .earth-audience-grid article, .earth-trust-grid article, .earth-detailed-sections > article, .earth-application-details > article, .earth-long-workflow > article, .earth-insights > article, .earth-program-preview > *, .earth-two-grid > *, .earth-final .earth-container > *, .carbon-practice, .carbon-timeline > li"));
			const observer = new IntersectionObserver((entries) => {
				entries.filter((entry) => entry.isIntersecting).forEach((entry, index) => {
					const target = entry.target;
					const animation = target.animate([{
						opacity: 0,
						transform: "translateY(32px)"
					}, {
						opacity: 1,
						transform: "translateY(0)"
					}], {
						duration: 850,
						delay: Math.min(index, 4) * 90,
						easing: "cubic-bezier(.22,1,.36,1)",
						fill: "backwards"
					});
					animations.push(animation);
					target.dataset["revealed"] = "true";
					observer.unobserve(target);
				});
			}, {
				threshold: .08,
				rootMargin: "0px 0px -35px 0px"
			});
			targets.forEach((target) => observer.observe(target));
			const visuals = Array.from(root.querySelectorAll(".home-gallery figure, .opp-photos figure, .opp-quick, .earth-evidence-map, .earth-graph, .earth-demo, .field-perspective, .earth-landscape, figure, .earth-product-demo"));
			const visualObserver = new IntersectionObserver((entries) => {
				entries.filter((e) => e.isIntersecting).forEach((entry) => {
					const el = entry.target;
					animations.push(el.animate([{
						clipPath: "inset(12% 6% 12% 6% round 28px)",
						opacity: .4,
						transform: "scale(.97)"
					}, {
						clipPath: "inset(0% 0% 0% 0% round 0px)",
						opacity: 1,
						transform: "scale(1)"
					}], {
						duration: 1200,
						easing: "cubic-bezier(.22,1,.36,1)",
						fill: "backwards"
					}));
					visualObserver.unobserve(el);
				});
			}, { threshold: .12 });
			visuals.forEach((v) => visualObserver.observe(v));
			const headings = Array.from(root.querySelectorAll("main h2, .earth-carbon-page h2"));
			const headingObserver = new IntersectionObserver((entries) => {
				entries.filter((e) => e.isIntersecting).forEach((entry) => {
					const el = entry.target;
					animations.push(el.animate([{
						clipPath: "inset(0 0 100% 0)",
						transform: "translateY(40%)"
					}, {
						clipPath: "inset(0 0 -20% 0)",
						transform: "translateY(0)"
					}], {
						duration: 1e3,
						easing: "cubic-bezier(.22,1,.36,1)",
						fill: "backwards"
					}));
					headingObserver.unobserve(el);
				});
			}, { threshold: .2 });
			headings.forEach((h) => headingObserver.observe(h));
			root.querySelectorAll(".earth-solution-grid, .earth-audience-grid, .earth-trust-grid, .earth-workflow").forEach((grid) => {
				Array.from(grid.children).forEach((kid, i) => kid.style.setProperty("--stagger", String(i)));
			});
			root.querySelectorAll(".earth-hero-copy > *").forEach((target, index) => {
				animations.push(target.animate([{
					opacity: 0,
					transform: "translateY(24px)"
				}, {
					opacity: 1,
					transform: "translateY(0)"
				}], {
					duration: 1e3,
					delay: index * 100,
					easing: "cubic-bezier(.22,1,.36,1)",
					fill: "backwards"
				}));
			});
			let frame = 0;
			const images = root.querySelectorAll(".earth-hero-image, .field-perspective-image, .earth-photo-story img, .earth-about-image img, .earth-program-detail > img");
			const update = () => {
				frame = 0;
				const max = document.documentElement.scrollHeight - window.innerHeight;
				root.style.setProperty("--reading-progress", String(max > 0 ? window.scrollY / max : 0));
				images.forEach((image) => {
					const rect = image.parentElement?.getBoundingClientRect();
					if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
					const offset = Math.max(-45, Math.min(45, -rect.top * .09));
					const scale = image.matches(".earth-hero-image, .field-perspective-image") ? 1.12 : 1.06;
					image.style.transform = `translateY(${offset}px) scale(${scale})`;
				});
			};
			const onScroll = () => {
				if (!frame) frame = requestAnimationFrame(update);
			};
			window.addEventListener("scroll", onScroll, { passive: true });
			window.addEventListener("resize", onScroll);
			update();
			dispose = () => {
				observer.disconnect();
				visualObserver.disconnect();
				headingObserver.disconnect();
				animations.forEach((animation) => animation.cancel());
				window.removeEventListener("scroll", onScroll);
				window.removeEventListener("resize", onScroll);
				cancelAnimationFrame(frame);
				images.forEach((image) => {
					image.style.transform = "";
				});
				root.style.removeProperty("--reading-progress");
			};
		};
		setup();
		preference.addEventListener("change", setup);
		return () => {
			dispose();
			preference.removeEventListener("change", setup);
		};
	}, [ref, pathname]);
}
var STORAGE_KEY = "tcc-ga4-consent";
var SETTINGS_EVENT = "tcc:open-analytics-settings";
var measurementId = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
}["VITE_GA4_MEASUREMENT_ID"]?.trim() ?? "";
var validMeasurementId = /^G-[A-Z0-9]+$/.test(measurementId);
function isProductionHost() {
	return window.location.hostname === "www.thecarboncredit.in";
}
function sanitizedPageLocation(pathname) {
	return new URL(pathname, window.location.origin).toString();
}
function ensureGoogleTag() {
	if (!validMeasurementId || !isProductionHost()) return false;
	window.dataLayer ??= [];
	window.gtag ??= (...args) => window.dataLayer?.push(args);
	if (window.__tccGa4MeasurementId !== measurementId) {
		window.__tccGa4MeasurementId = measurementId;
		window.gtag("consent", "default", {
			analytics_storage: "granted",
			ad_storage: "denied",
			ad_user_data: "denied",
			ad_personalization: "denied"
		});
		window.gtag("js", /* @__PURE__ */ new Date());
		window.gtag("config", measurementId, {
			send_page_view: false,
			allow_google_signals: false,
			allow_ad_personalization_signals: false
		});
		if (!document.querySelector(`script[data-tcc-ga4="${measurementId}"]`)) {
			const script = document.createElement("script");
			script.async = true;
			script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
			script.dataset["tccGa4"] = measurementId;
			document.head.appendChild(script);
		}
	}
	return true;
}
function AnalyticsConsent() {
	const pathname = useLocation({ select: (location) => location.pathname });
	const [choice, setChoice] = (0, import_react.useState)(null);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!validMeasurementId || !isProductionHost()) return;
		try {
			const stored = window.localStorage.getItem(STORAGE_KEY);
			if (stored === "granted" || stored === "denied") setChoice(stored);
		} catch {}
		const openSettings = () => setSettingsOpen(true);
		window.addEventListener(SETTINGS_EVENT, openSettings);
		return () => window.removeEventListener(SETTINGS_EVENT, openSettings);
	}, []);
	(0, import_react.useEffect)(() => {
		if (choice !== "granted" || !ensureGoogleTag() || !window.gtag) return;
		const pageLocation = sanitizedPageLocation(pathname);
		const previousPage = window.__tccGa4PreviousPage ?? document.referrer;
		let safeReferrer;
		try {
			if (previousPage) {
				const parsed = new URL(previousPage);
				safeReferrer = `${parsed.origin}${parsed.pathname}`;
			}
		} catch {
			safeReferrer = void 0;
		}
		window.gtag("event", "page_view", {
			page_title: document.title,
			page_location: pageLocation,
			...safeReferrer ? { page_referrer: safeReferrer } : {}
		});
		window.__tccGa4PreviousPage = pageLocation;
	}, [choice, pathname]);
	(0, import_react.useEffect)(() => {
		if (choice !== "granted" || !validMeasurementId || !isProductionHost()) return;
		const onContactLink = (event) => {
			const target = event.target;
			if (!(target instanceof Element)) return;
			if (target.closest("a[href^=\"mailto:\"]") && window.gtag) window.gtag("event", "contact_email_open", { surface: "public_site" });
		};
		document.addEventListener("click", onContactLink, true);
		return () => document.removeEventListener("click", onContactLink, true);
	}, [choice]);
	function saveChoice(next) {
		if (window.gtag && window.__tccGa4MeasurementId === measurementId) window.gtag("consent", "update", { analytics_storage: next });
		if (next === "denied") window.__tccGa4PreviousPage = void 0;
		try {
			window.localStorage.setItem(STORAGE_KEY, next);
		} catch {}
		setChoice(next);
		setSettingsOpen(false);
	}
	if (!validMeasurementId || !isProductionHost() || choice !== null && !settingsOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "analytics-consent",
		"aria-label": "Optional analytics settings",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Optional analytics" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Allow optional Google Analytics for public page visits. Vercel aggregate usage and performance metrics are described in the Privacy page. No form contents or farmer records are sent to Google Analytics." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "analytics-consent-actions",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => saveChoice("granted"),
				children: "Allow analytics"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => saveChoice("denied"),
				children: "Reject analytics"
			})]
		})]
	});
}
function AnalyticsSettingsButton() {
	if (!validMeasurementId) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: "analytics-settings-trigger",
		type: "button",
		onClick: () => window.dispatchEvent(new Event(SETTINGS_EVENT)),
		children: "Analytics settings"
	});
}
var page_field_agent_default = "/assets/page-field-agent-D-6s8mh4.jpg";
var page_satellite_default = "/assets/page-satellite-Ww7LSd3j.jpg";
var page_fpo_meeting_default = "/assets/page-fpo-meeting-CspECwdU.jpg";
var page_research_default = "/assets/page-research-CdR-VM1Z.jpg";
var punjab_rice_programs_generated_default = "/assets/punjab-rice-programs-generated-D-PYujGp.webp";
var terms_records_generated_default = "/assets/terms-records-generated-CHaHu_3_.webp";
var page_bund_default = "/assets/page-bund-Ckaj7T67.jpg";
var field_perspective_default = "/assets/field-perspective-DLL8_P8Q.jpg";
var agricultural_landscape_default = "/assets/agricultural-landscape-MMouSJlG.jpg";
var dash_banner_default = "/assets/dash-banner-CRTdL3BS.jpg";
var punjab_fields_default = "/assets/punjab-fields-BuW6GlE7.jpg";
var planting_wet_paddy_default = "/assets/planting-wet-paddy-DQy5jhx4.webp";
var rice_methane_default = "/assets/rice-methane-rQvVLMsI.jpg";
function SiteShell({ children, home = false }) {
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [productionTelemetry, setProductionTelemetry] = (0, import_react.useState)(false);
	const account = useAccount();
	const root = (0, import_react.useRef)(null);
	usePublicMotion(root, useLocation({ select: (location) => location.pathname }));
	(0, import_react.useEffect)(() => {
		setProductionTelemetry(window.location.hostname === new URL(PRODUCTION_SITE_URL).hostname);
	}, []);
	const mobileLinks = [
		...publicNavigation,
		{
			to: "/field-programs",
			label: "Field programs"
		},
		{
			to: "/business-impact",
			label: "Business & impact"
		},
		{
			to: "/methodology",
			label: "Methodology & evidence"
		},
		{
			to: "/privacy",
			label: "Privacy & data governance"
		},
		{
			to: "/research",
			label: "Research & insights"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: root,
		className: "earth-site",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "earth-reading-progress",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main-content",
				className: "skip-link",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: `earth-nav ${home ? "on-landscape" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "earth-nav-inner",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AcreonBrand, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "earth-desktop-nav",
							"aria-label": "Main navigation",
							children: publicNavigation.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								activeProps: { className: "current" },
								children: item.label
							}, item.to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "earth-nav-actions",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "ghost",
									className: "earth-signin",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: account ? "/dashboard" : "/auth",
										search: { next: "/dashboard" },
										children: [account ? "Workspace" : "Sign in", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 14 })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "earth",
									className: "earth-contact-button",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/contact",
										children: ["Partner with us ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									"aria-label": menu ? "Close navigation" : "Open navigation",
									"aria-expanded": menu,
									"aria-controls": "earth-mobile-nav",
									className: "earth-menu",
									onClick: () => setMenu(!menu),
									children: menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
								})
							]
						})
					]
				}), menu && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					id: "earth-mobile-nav",
					className: "earth-mobile-nav",
					"aria-label": "Mobile navigation",
					children: mobileLinks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						onClick: () => setMenu(false),
						children: [item.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 16 })]
					}, item.to))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main-content",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "earth-footer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "earth-container earth-footer-top",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AcreonBrand, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Making agricultural climate impact measurable, verifiable and valuable." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "footer-email",
								href: "mailto:contact@thecarboncredit.in",
								children: ["contact@thecarboncredit.in ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 14 })]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "earth-label",
								children: "EXPLORE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/platform",
								children: "Our approach"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/carbon-credits",
								children: "Agricultural projects"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/agricultural-mrv",
								children: "MRV & verification"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/solutions",
								children: "Solutions"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/how-it-works",
								children: "Project lifecycle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/methodology",
								children: "Methodology"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "earth-label",
								children: "PARTNERS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/partners",
								children: "Partner with us"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/field-programs",
								children: "Field programs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/research",
								children: "Research & insights"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/business-impact",
								children: "Business & impact"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/about",
								children: "About us"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contact",
								children: "Contact"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "earth-label",
								children: "RESOURCES"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/passport",
								children: "Field passport"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/calculator",
								children: "Opportunity estimator"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								search: { next: "/dashboard" },
								children: "Sign in"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/privacy",
								children: "Privacy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/terms",
								children: "Terms of use"
							})
						] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "earth-container earth-footer-bottom",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 The Carbon Credit · Panjdhara Private Limited" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Built around evidence. Rooted in Punjab.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								lang: "pa",
								className: "earth-punjabi-inline",
								children: "ਪੰਜਾਬ ਦੀ ਮਿੱਟੀ ਤੋਂ"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsSettingsButton, {})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsConsent, {}),
			productionTelemetry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Analytics, {}),
			productionTelemetry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpeedInsights, {})
		]
	});
}
function TextLink({ to, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		className: "earth-text-link",
		to,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 17 })]
	});
}
function SectionHeading({ label, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "earth-section-heading",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "earth-label",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title })] }), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description })]
	});
}
var introImages = {
	"/platform": [
		page_satellite_default,
		"Illustrative overhead view of agricultural field parcels and canals",
		"Spatial imagery · concept visual"
	],
	"/agricultural-mrv": [
		page_field_agent_default,
		"Illustrative field observer recording an agricultural observation with a farmer",
		"Field observation · illustrative scene"
	],
	"/solutions": [
		planting_wet_paddy_default,
		"Farmers transplanting rice seedlings into a flooded field",
		"Crop establishment · illustrative field scene"
	],
	"/how-it-works": [
		page_bund_default,
		"Illustrative farmer walking between rice paddies in morning mist",
		"Field practice · illustrative scene"
	],
	"/partners": [
		page_fpo_meeting_default,
		"Illustrative community discussion about agricultural programs",
		"Community context · not a confirmed partner"
	],
	"/field-programs": [
		punjab_rice_programs_generated_default,
		"Illustrative Punjab rice plots and irrigation channels at dawn",
		"AI-generated illustration · Punjab rice systems, not a documented project"
	],
	"/research": [
		page_research_default,
		"Illustrative soil samples and field notebook used in agricultural research",
		"Research methods · illustrative scene"
	],
	"/about": [
		field_perspective_default,
		"Illustrative rice fields and an irrigation channel",
		"Punjab agricultural landscape · illustrative"
	],
	"/methodology": [
		rice_methane_default,
		"Illustrative rice field water-level observation",
		"Water observation · does not measure methane"
	],
	"/business-impact": [
		dash_banner_default,
		"Illustrative agriculture landscape in warm evening light",
		"Agricultural context · illustrative landscape"
	],
	"/contact": [
		agricultural_landscape_default,
		"Illustrative agricultural field landscape",
		"Illustrative scene · not a documented operation"
	],
	"/privacy": [
		punjab_fields_default,
		"Illustrative agricultural parcels seen from above",
		"Illustrative spatial context"
	],
	"/terms": [
		terms_records_generated_default,
		"Illustrative farm notebook and blank agreement beside a Punjab rice field",
		"AI-generated illustration · no customer or farmer records shown"
	]
};
function PageIntro({ label, title, description }) {
	const { pathname } = useLocation();
	const img = introImages[pathname];
	const cinematic = !!img && pathname !== "/privacy" && pathname !== "/terms";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `earth-page-intro${img ? " has-photo" : ""}${cinematic ? " is-cinematic" : ""}${img && !cinematic ? " compact-photo earth-container" : ""}${!img ? " earth-container" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `earth-page-intro-copy${cinematic ? " earth-container" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "earth-label",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: title }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description })
			]
		}), img && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
			className: "earth-page-intro-photo",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: img[0],
				alt: img[1],
				width: 1600,
				height: 912,
				loading: "eager",
				fetchPriority: "high",
				decoding: "async"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: img[2] })]
		})]
	});
}
function PhotoStory({ image, imageAlt, caption, label, title, description, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `earth-container earth-section earth-photo-story ${className}`.trim(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: image,
			alt: imageAlt,
			width: 1400,
			height: 1050,
			loading: "lazy",
			decoding: "async"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: caption })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "earth-photo-story-copy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "earth-label",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description }),
				children
			]
		})]
	});
}
function FinalCTA({ image, imageAlt, showBrand = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `earth-final${image ? " has-visual" : ""}`,
		children: [image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			className: "earth-final-image",
			src: image,
			alt: imageAlt ?? "",
			width: 1920,
			height: 1024,
			loading: "lazy"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `earth-container earth-final-layout${showBrand ? " with-brand" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "earth-final-copy-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "earth-label",
						children: "START WITH A CONVERSATION"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						"Build a clearer picture",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"of agricultural impact."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "earth-final-copy",
						children: "Talk with The Carbon Credit about a DSR program, field evidence requirements, research collaboration or a potential project partnership."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "earth-cta-links",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/contact",
								search: { interest: "Pilot program" },
								children: ["Discuss a pilot ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 16 })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/contact",
								search: { interest: "Platform walkthrough" },
								children: ["Request a walkthrough ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 16 })]
							})
						]
					})
				]
			}), showBrand && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "earth-final-brand-panel",
				"aria-label": "The Carbon Credit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AcreonBrand, { className: "earth-final-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Land today ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
					" Opportunities tomorrow"
				] })]
			})]
		})]
	});
}
//#endregion
export { SiteShell as a, SectionHeading as i, PageIntro as n, TextLink as o, PhotoStory as r, FinalCTA as t };
