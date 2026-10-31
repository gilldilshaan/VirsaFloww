import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { a as pageHead, n as AcreonBrand, r as PRODUCTION_SITE_URL, t as AccountContext } from "./acreon-brand-HLTFfwjE.mjs";
import { t as Button } from "./button-DbFAHDQB.mjs";
import { C as useNavigate, T as useRouter, _ as Outlet, b as createRootRouteWithContext, d as Scripts, f as HeadContent, g as createRouter, m as useRouterState, v as lazyRouteComponent, w as useParams, x as Link, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Funnel, G as FileCheckCorner, H as FolderGit2, J as Earth, K as FileBadge, M as LoaderCircle, O as Menu, P as LayoutDashboard, R as GitFork, S as RotateCcw, V as FolderOpen, W as FileSpreadsheet, X as Download, a as UserCheck, at as CircleCheck, b as Scale, d as SquareCheckBig, g as ShieldAlert, h as ShieldCheck, i as User, j as MapPin, m as Shield, mt as ArrowLeft, p as Sparkles, pt as ArrowRight, q as ExternalLink, r as Users, st as ChevronDown, t as X, tt as Clock, u as Store, v as Search, x as Satellite } from "../_libs/lucide-react.mjs";
import { a as TerraLedgerProvider, i as SATELLITE_OBSERVATIONS, n as MARKETPLACE_PROJECTS, o as useTerraLedger, r as PRIMARY_FIELD, t as INITIAL_EVIDENCE_ITEMS } from "./store-Ddm4_oB_.mjs";
import { t as CommandCentre } from "./command-centre-CoNdv_9f.mjs";
import { t as Route$37 } from "./contact-Bl0rm83y.mjs";
import { t as ProjectDossier } from "./project-dossier--eo4Dso_.mjs";
import { t as EvidenceExplorer } from "./evidence-explorer-DtAeCbsh.mjs";
import { t as SatelliteIntelligence } from "./satellite-intelligence-BdR04HFn.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DiIA8-Ku.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLE_PERMISSIONS = {
	admin: [...[
		"workspace:view",
		"workspace:projects:read",
		"workspace:projects:manage",
		"workspace:farmers:read",
		"workspace:farmers:manage",
		"workspace:fields:read",
		"workspace:fields:manage",
		"workspace:evidence:read",
		"workspace:evidence:upload",
		"workspace:evidence:review",
		"workspace:assessments:read",
		"workspace:assessments:create",
		"workspace:assessments:approve",
		"workspace:geospatial:view",
		"workspace:reports:view",
		"workspace:reports:export"
	]],
	project_developer: [
		"workspace:view",
		"workspace:projects:read",
		"workspace:projects:manage",
		"workspace:farmers:read",
		"workspace:farmers:manage",
		"workspace:fields:read",
		"workspace:fields:manage",
		"workspace:evidence:read",
		"workspace:evidence:upload",
		"workspace:assessments:read",
		"workspace:assessments:create",
		"workspace:geospatial:view",
		"workspace:reports:view",
		"workspace:reports:export"
	],
	field_officer: [
		"workspace:view",
		"workspace:farmers:read",
		"workspace:farmers:manage",
		"workspace:fields:read",
		"workspace:fields:manage",
		"workspace:evidence:read",
		"workspace:evidence:upload",
		"workspace:geospatial:view"
	],
	reviewer: [
		"workspace:view",
		"workspace:projects:read",
		"workspace:fields:read",
		"workspace:evidence:read",
		"workspace:evidence:review",
		"workspace:assessments:read",
		"workspace:assessments:approve",
		"workspace:geospatial:view",
		"workspace:reports:view"
	],
	buyer: [],
	farmer: []
};
function hasPermission(user, permission) {
	if (!user) return false;
	return user.permissions.includes(permission);
}
function canAccessWorkspace(user) {
	if (!user) return false;
	return [
		"admin",
		"project_developer",
		"field_officer",
		"reviewer"
	].includes(user.role);
}
function canAccessWorkspaceRoute(user, routeSegment) {
	if (!canAccessWorkspace(user)) return false;
	if (!user) return false;
	if (user.role === "admin") return true;
	switch (routeSegment) {
		case "command":
		case "satellite":
		case "terra-intelligence": return true;
		case "projects": return hasPermission(user, "workspace:projects:read");
		case "farmers": return hasPermission(user, "workspace:farmers:read");
		case "fields": return hasPermission(user, "workspace:fields:read");
		case "evidence": return hasPermission(user, "workspace:evidence:read");
		case "review": return hasPermission(user, "workspace:evidence:review") || user.role === "project_developer";
		case "assessments": return hasPermission(user, "workspace:assessments:read");
		case "dossier": return user.role === "project_developer" || user.role === "reviewer";
		case "reports": return hasPermission(user, "workspace:reports:view");
		default: return true;
	}
}
var DEMO_ACCOUNTS = {
	admin: {
		id: "USR-ADMIN-01",
		name: "Dr. Inderjit Singh",
		email: "inderjit.singh@terraledger.ai",
		role: "admin",
		organization: "TerraLedger Global MRV",
		district: "Ludhiana",
		permissions: ROLE_PERMISSIONS.admin
	},
	project_developer: {
		id: "USR-DEV-02",
		name: "Amrita Kaur",
		email: "amrita.kaur@panjdhara.com",
		role: "project_developer",
		organization: "Panjdhara Agritech Pvt Ltd",
		district: "Ludhiana & Sangrur",
		permissions: ROLE_PERMISSIONS.project_developer
	},
	field_officer: {
		id: "USR-FLD-03",
		name: "Harpreet Singh Gill",
		email: "harpreet.gill@malwa-fpo.org",
		role: "field_officer",
		organization: "Malwa Progressive Farmer Collective",
		fpoAffiliation: "Malwa FPO Cluster #4",
		district: "Ludhiana",
		permissions: ROLE_PERMISSIONS.field_officer
	},
	reviewer: {
		id: "USR-REV-04",
		name: "Dr. Evelyn Martinez",
		email: "e.martinez@sustainability-vvb.org",
		role: "reviewer",
		organization: "Apex Climate Auditing & Verification",
		district: "Global / Remote VVB",
		permissions: ROLE_PERMISSIONS.reviewer
	},
	buyer: {
		id: "USR-BUY-05",
		name: "Marcus Vance",
		email: "m.vance@auraclimate.com",
		role: "buyer",
		organization: "Aura Climate Asset Management Ltd.",
		permissions: ROLE_PERMISSIONS.buyer
	},
	farmer: {
		id: "USR-FAR-06",
		name: "Gurdev Singh Gill",
		email: "gurdev.gill@farmer.punjab",
		role: "farmer",
		organization: "Gill Agro Farms",
		district: "Ludhiana",
		village: "Gill Kalan",
		permissions: ROLE_PERMISSIONS.farmer
	}
};
var AuthContext = (0, import_react.createContext)(null);
function AuthProvider({ children, defaultRole = "admin" }) {
	const [currentUser, setCurrentUser] = (0, import_react.useState)(DEMO_ACCOUNTS[defaultRole]);
	const switchRole = (role) => {
		setCurrentUser(DEMO_ACCOUNTS[role] || null);
	};
	const loginAs = (role) => {
		setCurrentUser(DEMO_ACCOUNTS[role] || null);
	};
	const logout = () => {
		setCurrentUser(null);
	};
	const value = (0, import_react.useMemo)(() => ({
		currentUser,
		currentRole: currentUser?.role || "admin",
		switchRole,
		loginAs,
		logout,
		isAuthenticated: currentUser !== null
	}), [currentUser]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const context = (0, import_react.useContext)(AuthContext);
	if (!context) return {
		currentUser: DEMO_ACCOUNTS.admin,
		currentRole: "admin",
		switchRole: () => {},
		loginAs: () => {},
		logout: () => {},
		isAuthenticated: true
	};
	return context;
}
var styles_default = "/assets/styles-BiyGgQgo.css";
var searchVerification = {
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
}["VITE_GOOGLE_SITE_VERIFICATION"]?.trim();
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$36 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "The Carbon Credit | Agricultural Carbon & MRV" },
			{
				name: "description",
				content: "Making agricultural climate impact measurable, verifiable and valuable. Field evidence and MRV for agricultural carbon projects in Punjab, India."
			},
			{
				property: "og:title",
				content: "The Carbon Credit | Agricultural Carbon & MRV"
			},
			{
				property: "og:description",
				content: "Making agricultural climate impact measurable, verifiable and valuable."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:site_name",
				content: "The Carbon Credit"
			},
			{
				property: "og:url",
				content: `${PRODUCTION_SITE_URL}/`
			},
			{
				property: "og:image",
				content: `${PRODUCTION_SITE_URL}/social-card.jpg`
			},
			{
				property: "og:image:alt",
				content: "The Carbon Credit — agricultural evidence and MRV"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "The Carbon Credit | Agricultural Carbon & MRV"
			},
			{
				name: "twitter:description",
				content: "Making agricultural climate impact measurable, verifiable and valuable."
			},
			{
				name: "twitter:image",
				content: `${PRODUCTION_SITE_URL}/social-card.jpg`
			},
			...searchVerification ? [{
				name: "google-site-verification",
				content: searchVerification
			}] : []
		],
		links: [
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+Punjabi:wght@400;600&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/brand/tcc-favicon.png",
				type: "image/png",
				sizes: "64x64"
			},
			{
				rel: "apple-touch-icon",
				href: "/brand/tcc-favicon.png",
				sizes: "64x64"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$36.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountContext.Provider, {
			value: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})
	});
}
var $$splitComponentImporter$20 = () => import("./routes-B_YaqrmH.mjs");
var Route$35 = createFileRoute("/")({
	head: () => pageHead("Agricultural carbon projects & MRV", "The Carbon Credit connects field evidence and MRV workflows to help build credible agricultural carbon projects, starting with Direct Seeded Rice in Punjab.", "/"),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./about-C1vdkgOZ.mjs");
var Route$34 = createFileRoute("/about")({
	head: () => pageHead("About", "The Carbon Credit connects agricultural data and verification workflows for traceable evidence and accountable decisions.", "/about"),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./agricultural-mrv-BeE9sxHb.mjs");
var Route$33 = createFileRoute("/agricultural-mrv")({
	head: () => pageHead("Agricultural MRV", "Understand agricultural monitoring, reporting, verification, confidence, uncertainty and methodology-specific evidence requirements.", "/agricultural-mrv"),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
function AuthPage() {
	const router = useRouter();
	const [email, setEmail] = (0, import_react.useState)("demo.auditor@terraledger.ai");
	const [password, setPassword] = (0, import_react.useState)("••••••••••••");
	const handleLogin = (e) => {
		e.preventDefault();
		router.navigate({ to: "/dashboard" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "account-page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "account-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AcreonBrand, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 mb-2 flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						size: 13,
						className: "text-[#5c7c46]"
					}), "TerraLedger AI Workspace Access"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-serif text-[#193b2a]",
					children: "Sign in to Workspace"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-[#708071] mt-1 mb-6",
					children: "Access the field assessment command centre, satellite intelligence series, and project dossiers."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleLogin,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-[#193b2a] block mb-1",
							children: "Email address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-medium text-[#193b2a] block mb-1",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2 space-y-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "w-full bg-[#245b45] text-white hover:bg-[#1a4333] text-xs font-semibold h-10",
								children: ["Enter TerraLedger Workspace ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									size: 14,
									className: "ml-1.5"
								})]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 pt-4 border-t border-[#edf0e7] text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-[#708071] mb-3",
						children: "Demonstration Mode: Instant auditor access preconfigured without credentials."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "text-xs text-[#245b45] hover:underline font-medium",
						children: "← Return to Public Homepage"
					})]
				})
			]
		})
	});
}
var Route$32 = createFileRoute("/auth")({
	validateSearch: (search) => ({ next: search["next"] || "/dashboard" }),
	head: () => pageHead("Sign In | TerraLedger AI Workspace", "Sign in to access TerraLedger AI agricultural MRV command centre and project dossiers.", "/auth"),
	component: AuthPage
});
var $$splitComponentImporter$17 = () => import("./business-impact-GeBe6cuV.mjs");
var Route$31 = createFileRoute("/business-impact")({
	head: () => pageHead("Business & Impact", "Explore proposed commercial models, customer value, delivery-cost variables and transparent evaluation metrics for agricultural evidence workflows.", "/business-impact"),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./calculator-B4EHfYhv.mjs");
var Route$30 = createFileRoute("/calculator")({
	head: () => pageHead("Farmer Opportunity Estimator", "Explore potential carbon, cost, financing and scheme opportunities for your farm, with every assumption, condition and missing input shown. Illustrative, not guaranteed.", "/calculator"),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./carbon-credits-Y7rvawOR.mjs");
var Route$29 = createFileRoute("/carbon-credits")({
	head: () => pageHead("Direct Seeded Rice & agricultural carbon projects", "How field evidence, appropriate baselines and methodology-specific MRV can support eligible agricultural carbon projects in Punjab.", "/carbon-credits"),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
function DemoBanner() {
	const { demoState, setDemoState, advanceDemoState, resetDemoState, completenessPercent, assessmentStatus } = useTerraLedger();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-slate-900 border-b border-emerald-900/40 text-slate-100 px-4 py-3 shadow-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							size: 12,
							className: "text-emerald-400 animate-pulse"
						}), "TerraLedger AI Demo"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-slate-400 hidden sm:inline",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex rounded-md p-0.5 bg-slate-800/90 border border-slate-700",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDemoState("unverified"),
								className: `px-2.5 py-1 rounded text-[11px] font-medium transition-all ${demoState === "unverified" ? "bg-amber-600 text-white shadow-sm font-semibold" : "text-slate-400 hover:text-slate-200"}`,
								children: "1. Unverified (Spatial Mismatch)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDemoState("needs-review"),
								className: `px-2.5 py-1 rounded text-[11px] font-medium transition-all ${demoState === "needs-review" ? "bg-sky-600 text-white shadow-sm font-semibold" : "text-slate-400 hover:text-slate-200"}`,
								children: "2. Needs Review (Water Log Added)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDemoState("ready"),
								className: `px-2.5 py-1 rounded text-[11px] font-medium transition-all ${demoState === "ready" ? "bg-emerald-600 text-white shadow-sm font-semibold" : "text-slate-400 hover:text-slate-200"}`,
								children: "3. Ready for Verification (Geotag Resolved)"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 self-end md:self-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-slate-300 font-mono text-[11px]",
						children: [
							"Completeness: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "text-white",
								children: [completenessPercent, "%"]
							}),
							" · Status:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `font-semibold ${assessmentStatus === "READY_FOR_VERIFICATION" ? "text-emerald-400" : assessmentStatus === "NEEDS_REVIEW" ? "text-sky-400" : "text-amber-400"}`,
								children: assessmentStatus.replace(/_/g, " ")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: advanceDemoState,
						className: "h-7 text-xs bg-emerald-600/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-600 hover:text-white",
						children: ["Advance Step ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							size: 12,
							className: "ml-1"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: resetDemoState,
						title: "Reset demonstration state",
						className: "h-7 px-2 text-slate-400 hover:text-white hover:bg-slate-800",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { size: 12 })
					})
				]
			})]
		})
	});
}
function WorkspaceLayout({ children }) {
	const { activeTab, setActiveTab, field, assessmentStatus, completenessPercent } = useTerraLedger();
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#f4f6f0] text-[#213c2b] flex flex-col font-sans",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col md:flex-row relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:hidden flex items-center justify-between px-4 py-3 bg-[#102e20] text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-serif text-xl tracking-tight text-[#f5f5e8]",
							children: ["TerraLedger", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[#d6eaa6] font-normal",
								children: "AI"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] bg-[#d6eaa6]/20 text-[#d6eaa6] px-1.5 py-0.5 rounded font-mono",
							children: "WORKSPACE"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMobileMenuOpen(!mobileMenuOpen),
						className: "p-1.5 text-slate-300 hover:text-white",
						"aria-label": "Toggle Navigation",
						children: mobileMenuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 20 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: `${mobileMenuOpen ? "block" : "hidden"} md:block w-full md:w-64 bg-[#102e20] text-[#bacabd] p-6 flex flex-col md:fixed md:top-12 md:bottom-0 z-30 overflow-y-auto border-r border-[#1e4834]`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden md:block pb-6 border-b border-[#ffffff15]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/",
								className: "inline-block group",
								title: "Back to The Carbon Credit Public Home",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-serif text-2xl text-[#f5f5e8] flex items-baseline gap-1",
									children: ["TerraLedger", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#d6eaa6] font-sans font-semibold text-lg",
										children: "AI"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[9px] text-[#809c88] tracking-widest mt-1 uppercase",
									children: "Field MRV & Evidence Engine"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] tracking-widest text-[#809c88] mb-3 uppercase px-3",
								children: "Application Modules"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "space-y-1",
								children: [
									{
										id: "command",
										label: "Command Centre",
										icon: LayoutDashboard,
										badge: "Live MRV"
									},
									{
										id: "satellite",
										label: "Satellite Intelligence",
										icon: Satellite,
										badge: "S2 10m"
									},
									{
										id: "evidence",
										label: "Evidence Explorer",
										icon: GitFork,
										badge: "Graph"
									},
									{
										id: "dossier",
										label: "Buyer View / Dossier",
										icon: FileCheckCorner,
										badge: "Due Diligence"
									},
									{
										id: "marketplace",
										label: "Project Marketplace",
										icon: Store,
										badge: "Projects"
									}
								].map((item) => {
									const Icon = item.icon;
									const isActive = activeTab === item.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											setActiveTab(item.id);
											setMobileMenuOpen(false);
										},
										className: `w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${isActive ? "bg-[#d6eaa6] text-[#173a27] font-semibold shadow-sm" : "text-[#bacabd] hover:bg-[#ffffff10] hover:text-white"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
												size: 16,
												className: isActive ? "text-[#173a27]" : "text-[#809c88]"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
										}), item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-[9px] font-mono px-1.5 py-0.5 rounded ${isActive ? "bg-[#173a27]/10 text-[#173a27]" : "bg-[#ffffff10] text-[#809c88]"}`,
											children: item.badge
										})]
									}, item.id);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 bg-[#173a2b] border border-[#ffffff12] rounded-xl p-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[10px] font-mono text-[#809c88] mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ACTIVE PARCEL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#d6eaa6]",
										children: "PUNJAB"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-white truncate",
									children: field.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-[11px] text-[#bacabd] mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
										size: 11,
										className: "text-[#d6eaa6]"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										field.district,
										", ",
										field.areaHa,
										" ha (",
										field.areaAcres,
										" ac)"
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 pt-2 border-t border-[#ffffff10] flex items-center justify-between text-[10px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#809c88]",
										children: "Practice:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#d6eaa6] font-mono",
										children: "DSR + AWD"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto pt-6 border-t border-[#ffffff12] space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/",
								className: "flex items-center justify-between text-xs text-[#809c88] hover:text-white px-2 py-1.5 rounded transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Public Website" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { size: 12 })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-[#637d6a] px-2 font-mono",
								children: "TerraLedger AI v2.4 · Panjdhara"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "flex-1 md:ml-64 flex flex-col min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "h-16 bg-white border-b border-[#dde4d9] px-6 lg:px-10 flex items-center justify-between gap-4 sticky top-0 md:top-12 z-20 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-[#72816f] hidden sm:inline",
								children: "Assessment Scope:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold text-[#213c2b] flex items-center gap-1.5 truncate",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
										size: 14,
										className: "text-[#347454] shrink-0"
									}),
									field.code,
									" · ",
									field.practice
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden sm:flex flex-col items-end text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono text-[#72816f]",
									children: "COMPLETENESS"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-[#213c2b]",
									children: [completenessPercent, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${assessmentStatus === "READY_FOR_VERIFICATION" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : assessmentStatus === "NEEDS_REVIEW" ? "bg-sky-100 text-sky-800 border border-sky-300" : "bg-amber-100 text-amber-800 border border-amber-300"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-1.5 h-1.5 rounded-full ${assessmentStatus === "READY_FOR_VERIFICATION" ? "bg-emerald-600" : assessmentStatus === "NEEDS_REVIEW" ? "bg-sky-600" : "bg-amber-600"}` }), assessmentStatus.replace(/_/g, " ")]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-8",
						children
					})]
				})
			]
		})]
	});
}
function Marketplace() {
	const { projects, dueDiligenceList, submitBuyerInquiry } = useTerraLedger();
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedPractice, setSelectedPractice] = (0, import_react.useState)("all");
	const [selectedStatus, setSelectedStatus] = (0, import_react.useState)("all");
	const [selectedProject, setSelectedProject] = (0, import_react.useState)(null);
	const [comparisonIds, setComparisonIds] = (0, import_react.useState)(["PRJ-PB-DSR-01", "PRJ-PB-CRM-02"]);
	const [isCompareModalOpen, setIsCompareModalOpen] = (0, import_react.useState)(false);
	const [isInquiryModalOpen, setIsInquiryModalOpen] = (0, import_react.useState)(false);
	const [buyerName, setBuyerName] = (0, import_react.useState)("");
	const [buyerOrg, setBuyerOrg] = (0, import_react.useState)("");
	const [buyerEmail, setBuyerEmail] = (0, import_react.useState)("");
	const [volume, setVolume] = (0, import_react.useState)("2000");
	const [inquirySuccessMsg, setInquirySuccessMsg] = (0, import_react.useState)("");
	const filteredProjects = projects.filter((prj) => {
		const matchesSearch = prj.title.toLowerCase().includes(searchQuery.toLowerCase()) || prj.location.toLowerCase().includes(searchQuery.toLowerCase()) || prj.practice.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesPractice = selectedPractice === "all" || selectedPractice === "dsr" && prj.practice.toLowerCase().includes("direct seeded") || selectedPractice === "residue" && (prj.practice.toLowerCase().includes("residue") || prj.practice.toLowerCase().includes("straw")) || selectedPractice === "awd" && prj.practice.toLowerCase().includes("alternate wetting") || selectedPractice === "agroforestry" && prj.practice.toLowerCase().includes("agroforestry");
		const matchesStatus = selectedStatus === "all" || selectedStatus === "ready" && prj.assessmentStatus === "READY_FOR_VERIFICATION" || selectedStatus === "review" && prj.assessmentStatus === "NEEDS_REVIEW";
		return matchesSearch && matchesPractice && matchesStatus;
	});
	const toggleComparison = (id) => {
		if (comparisonIds.includes(id)) setComparisonIds(comparisonIds.filter((item) => item !== id));
		else if (comparisonIds.length < 3) setComparisonIds([...comparisonIds, id]);
		else alert("You can compare a maximum of 3 projects at once.");
	};
	const handleInquirySubmit = (e) => {
		e.preventDefault();
		if (!buyerName || !buyerOrg || !buyerEmail) return;
		const targetProjectTitle = selectedProject ? selectedProject.title : "Selected Agricultural Project";
		const res = submitBuyerInquiry({
			buyerName,
			buyerOrg,
			projectTitle: targetProjectTitle,
			volumeRequestedTons: Number(volume) || 1e3,
			targetRetirementYear: "2026"
		});
		setInquirySuccessMsg(res.message);
		setTimeout(() => {
			setInquirySuccessMsg("");
			setIsInquiryModalOpen(false);
			setBuyerName("");
			setBuyerOrg("");
			setBuyerEmail("");
		}, 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { size: 13 }), "TerraLedger Marketplace & Offtake Pipeline"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight",
						children: "Agricultural MRV Project Directory"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#72816f] mt-1",
						children: "Browse audited agricultural carbon clusters ready for verification in Punjab. Complete with parcel cadastral records and Sentinel-2 audit trails."
					})
				] }), comparisonIds.length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setIsCompareModalOpen(true),
					className: "text-xs bg-[#245b45] text-white hover:bg-[#1a4333] shadow-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, {
							size: 14,
							className: "mr-1.5"
						}),
						"Compare Selected (",
						comparisonIds.length,
						")"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						size: 15,
						className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#72816f]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "Search by project name, practice (e.g. DSR, Residue), or district...",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg pl-9 pr-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: selectedPractice,
						onChange: (e) => setSelectedPractice(e.target.value),
						className: "bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-2.5 py-2 text-[#213c2b] outline-none focus:border-[#245b45]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Practices"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "dsr",
								children: "Direct Seeded Rice (DSR)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "residue",
								children: "Crop Residue (Happy Seeder)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "awd",
								children: "Alternate Wetting & Drying"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "agroforestry",
								children: "Agroforestry Intercrop"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: selectedStatus,
						onChange: (e) => setSelectedStatus(e.target.value),
						className: "bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-2.5 py-2 text-[#213c2b] outline-none focus:border-[#245b45]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Statuses"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ready",
								children: "Ready for Verification"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "review",
								children: "Needs Review"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-5",
				children: filteredProjects.map((prj) => {
					const isComparing = comparisonIds.includes(prj.id);
					const isReady = prj.assessmentStatus === "READY_FOR_VERIFICATION";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs hover:border-[#245b45] transition-all flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] text-[#72816f] bg-[#f4f6f0] px-2 py-0.5 rounded",
									children: prj.location
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${isReady ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-sky-100 text-sky-800 border border-sky-300"}`,
									children: prj.assessmentStatus.replace(/_/g, " ")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-xl font-semibold text-[#193b2a] mb-1",
								children: prj.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#72816f] line-clamp-2 leading-relaxed mb-4",
								children: prj.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2 p-3 bg-[#f9faf7] rounded-lg border border-[#edf0e7] mb-4 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono text-[#72816f] block",
										children: "VOLUME / YR"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-xs font-mono text-[#245b45]",
										children: [prj.estimatedTonsCo2ePerYear.toLocaleString(), " t"]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono text-[#72816f] block",
										children: "SCALE"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-xs font-mono text-[#193b2a]",
										children: [prj.totalHectares.toLocaleString(), " ha"]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono text-[#72816f] block",
										children: "FARMERS"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-xs font-mono text-[#193b2a]",
										children: prj.farmerCount
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 mb-4 text-[11px] text-[#526451]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
										size: 13,
										className: "text-emerald-600 shrink-0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [prj.evidenceDepth.satellitePasses, " Sentinel-2 passes analyzed"] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
										size: 13,
										className: "text-emerald-600 shrink-0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [prj.evidenceDepth.groundPhotos, " geotagged field photos stamped"] })]
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t border-[#edf0e7] flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 cursor-pointer text-[#72816f] hover:text-[#213c2b]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: isComparing,
									onChange: () => toggleComparison(prj.id),
									className: "rounded text-[#245b45] accent-[#245b45]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Compare" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setSelectedProject(prj),
									className: "text-xs border-[#d8e1d4] hover:bg-[#f4f6f0] h-8",
									children: "View Details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => {
										setSelectedProject(prj);
										setIsInquiryModalOpen(true);
									},
									className: "text-xs bg-[#245b45] text-white hover:bg-[#1a4333] h-8",
									children: "Inquire Offtake"
								})]
							})]
						})]
					}, prj.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl p-6 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#edf0e7] mb-4 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-sm font-semibold text-[#193b2a] flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
							size: 16,
							className: "text-[#245b45]"
						}), "Buyer Due Diligence Pipeline & Data Rooms"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#72816f]",
						children: "Real-time tracker of institutional offtake inquiries, data room access requests, and VVB reviews."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-mono bg-[#edf0e7] text-[#213c2b] px-2 py-0.5 rounded font-semibold",
						children: [dueDiligenceList.length, " Active Records"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-xs text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-[#f9faf6] text-[#72816f] font-mono text-[10px] uppercase border-b border-[#edf0e7]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2.5 px-3",
									children: "Buyer & Organization"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2.5 px-3",
									children: "Project Target"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2.5 px-3",
									children: "Inquiry Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2.5 px-3",
									children: "Volume (tCO2e)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2.5 px-3",
									children: "Due Diligence Stage"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2.5 px-3 text-right",
									children: "Status"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-[#edf0e7]",
							children: dueDiligenceList.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-[#f9faf7]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-[#193b2a] block",
											children: item.buyerName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[#72816f] text-[11px]",
											children: item.buyerOrg
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3 text-[#213c2b] font-medium",
										children: item.projectTitle
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3 font-mono text-[#72816f]",
										children: item.inquiryDate
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-3 px-3 font-mono font-semibold text-[#245b45]",
										children: [item.volumeRequestedTons.toLocaleString(), " t"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-[#f4f6f0] border border-[#dfe6d9] text-[#213c2b] text-[10px] font-mono px-2 py-0.5 rounded",
											children: item.stage
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-semibold",
											children: item.status
										})
									})
								]
							}, item.id))
						})]
					})
				})]
			}),
			isCompareModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-[#dfe6d9] max-h-[90vh] overflow-y-auto animate-in fade-in-50 zoom-in-95",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between pb-3 border-b border-[#edf0e7] mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-[#5c7c46] uppercase tracking-wider block mb-0.5",
								children: "Multi-Project Evaluation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-xl font-semibold text-[#193b2a]",
								children: "Side-by-Side Project Comparison"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setIsCompareModalOpen(false),
								className: "p-1 rounded-full text-[#72816f] hover:text-[#193b2a] hover:bg-[#f4f6f0]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-xs",
							children: comparisonIds.map((id) => {
								const prj = projects.find((p) => p.id === id);
								if (!prj) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-[#f9faf7] border border-[#dfe6d9] rounded-xl p-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-[10px] text-[#72816f] bg-white px-2 py-0.5 rounded border border-[#edf0e7]",
											children: [prj.district, ", Punjab"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-serif text-base font-semibold text-[#193b2a] mt-1.5",
											children: prj.title
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 py-2 border-y border-[#edf0e7] text-[11px]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[#72816f]",
														children: "Methodology:"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-[#193b2a] text-right",
														children: prj.methodology.split(" ")[0]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[#72816f]",
														children: "Mitigation Volume:"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
														className: "font-mono text-[#245b45]",
														children: [prj.estimatedTonsCo2ePerYear.toLocaleString(), " t/yr"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[#72816f]",
														children: "Enrolled Area:"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
														className: "font-mono text-[#193b2a]",
														children: [prj.totalHectares, " ha"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[#72816f]",
														children: "Readiness Score:"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
														className: "font-mono text-emerald-700",
														children: [prj.readinessScorePercent, "%"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[#72816f]",
														children: "Indicative Guide Price:"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
														className: "font-mono text-[#193b2a]",
														children: [
															"$",
															prj.indicativePricePerTonUsd,
															" / t"
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[#72816f]",
														children: "Farmer Count:"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono",
														children: [prj.farmerCount, " Smallholders"]
													})]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											onClick: () => {
												setSelectedProject(prj);
												setIsCompareModalOpen(false);
												setIsInquiryModalOpen(true);
											},
											className: "w-full text-xs bg-[#245b45] text-white hover:bg-[#1a4333]",
											children: "Inquire Offtake"
										})
									]
								}, prj.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 pt-3 border-t border-[#edf0e7] flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setIsCompareModalOpen(false),
								className: "text-xs border-[#d8e1d4]",
								children: "Close Comparison"
							})
						})
					]
				})
			}),
			selectedProject && !isInquiryModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#dfe6d9] animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between pb-3 border-b border-[#edf0e7] mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-[#5c7c46] uppercase tracking-wider block mb-0.5",
								children: "Project Dossier Summary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-xl font-semibold text-[#193b2a]",
								children: selectedProject.title
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedProject(null),
								className: "p-1 rounded-full text-[#72816f] hover:text-[#193b2a] hover:bg-[#f4f6f0]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#526451] leading-relaxed bg-[#f9faf7] p-3 rounded-lg border border-[#edf0e7]",
									children: selectedProject.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-xs font-semibold text-[#193b2a] block mb-2",
									children: "Project Highlights:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-1.5 text-xs text-[#526451]",
									children: selectedProject.highlights.map((h, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
											size: 13,
											className: "text-emerald-600 shrink-0"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h })]
									}, idx))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3 py-2 border-y border-[#edf0e7]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono text-[#72816f] block",
											children: "METHODOLOGY"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-[#193b2a]",
											children: selectedProject.methodology
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono text-[#72816f] block",
											children: "DEVELOPER"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-[#193b2a]",
											children: selectedProject.developer
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono text-[#72816f] block",
											children: "VINTAGE"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[#193b2a]",
											children: selectedProject.vintage
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono text-[#72816f] block",
											children: "INDICATIVE PRICE"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-semibold text-[#245b45]",
											children: [
												"$",
												selectedProject.indicativePricePerTonUsd,
												" / tCO2e"
											]
										})] })
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 pt-3 border-t border-[#edf0e7] flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setSelectedProject(null),
								className: "text-xs border-[#d8e1d4]",
								children: "Close"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => setIsInquiryModalOpen(true),
								className: "text-xs bg-[#245b45] text-white hover:bg-[#1a4333]",
								children: "Inquire Offtake Volume"
							})]
						})
					]
				})
			}),
			isInquiryModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dfe6d9] animate-in fade-in-50 zoom-in-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between pb-3 border-b border-[#edf0e7] mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono text-[#5c7c46] uppercase tracking-wider block mb-0.5",
							children: "Buyer Due Diligence Inquiry"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-serif text-xl font-semibold text-[#193b2a]",
							children: ["Inquire on ", selectedProject ? selectedProject.title : "Agricultural Carbon Project"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setIsInquiryModalOpen(false),
							className: "p-1 rounded-full text-[#72816f] hover:text-[#193b2a] hover:bg-[#f4f6f0]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
						})]
					}), inquirySuccessMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-8 text-center space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
								size: 32,
								className: "text-emerald-600 mx-auto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-serif text-lg text-[#193b2a]",
								children: "Inquiry Registered"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[#72816f]",
								children: inquirySuccessMsg
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
								placeholder: "e.g. David Sterling",
								value: buyerName,
								onChange: (e) => setBuyerName(e.target.value),
								className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-medium text-[#193b2a] block mb-1",
									children: "Organization *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "e.g. Pan-Euro Carbon Fund",
									value: buyerOrg,
									onChange: (e) => setBuyerOrg(e.target.value),
									className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-medium text-[#193b2a] block mb-1",
									children: "Business Email *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									required: true,
									placeholder: "d.sterling@pe-carbon.eu",
									value: buyerEmail,
									onChange: (e) => setBuyerEmail(e.target.value),
									className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-medium text-[#193b2a] block mb-1",
								children: "Desired Volume (tCO2e) *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: "100",
								step: "100",
								required: true,
								value: volume,
								onChange: (e) => setVolume(e.target.value),
								className: "w-full text-xs bg-[#f7f9f5] border border-[#dce3d7] rounded-lg px-3 py-2 text-[#193b2a] outline-none focus:border-[#245b45]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#72816f] bg-[#f9faf7] p-2.5 rounded-lg border border-[#edf0e7]",
								children: "Demonstration Notice: Inquiries are appended to the local Due Diligence pipeline table. Real institutional contracts require VVB audited issuance."
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
									children: "Send Ingestion Request"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
function DashboardView() {
	const { activeTab } = useTerraLedger();
	switch (activeTab) {
		case "satellite": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SatelliteIntelligence, {});
		case "evidence": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceExplorer, {});
		case "dossier": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectDossier, {});
		case "marketplace": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marketplace, {});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandCentre, {});
	}
}
function DashboardPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TerraLedgerProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardView, {}) }) });
}
var Route$28 = createFileRoute("/dashboard")({
	head: () => pageHead("TerraLedger AI | Agricultural MRV Command Centre", "Field evidence, satellite intelligence, and institutional due diligence platform for agricultural carbon projects in Punjab.", "/dashboard"),
	component: DashboardPage
});
var $$splitComponentImporter$14 = () => import("./field-programs-Cc-Yk0Jp.mjs");
var Route$27 = createFileRoute("/field-programs")({
	head: () => pageHead("Field Programs & Case Studies", "Program-specific agricultural contexts, geographies and methodology, with transparent publication status.", "/field-programs"),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./how-it-works-QsgDO8l5.mjs");
var Route$26 = createFileRoute("/how-it-works")({
	head: () => pageHead("How It Works", "Register, collect, analyze, verify and report with a traceable agricultural evidence workflow.", "/how-it-works"),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
function MarketplaceView() {
	const { setActiveTab } = useTerraLedger();
	(0, import_react.useEffect)(() => {
		setActiveTab("marketplace");
	}, [setActiveTab]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marketplace, {});
}
function MarketplacePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TerraLedgerProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketplaceView, {}) }) });
}
var Route$25 = createFileRoute("/marketplace")({
	head: () => pageHead("Agricultural Carbon Marketplace | TerraLedger AI", "Institutional directory of verified agricultural carbon projects and due diligence data rooms in Punjab.", "/marketplace"),
	component: MarketplacePage
});
var $$splitComponentImporter$12 = () => import("./methodology-BaTZ3KOh.mjs");
var Route$24 = createFileRoute("/methodology")({
	head: () => pageHead("Methodology & Evidence", "Evidence provenance, confidence, data quality, human review, audit trails and consent principles.", "/methodology"),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./partners-CWoT55_G.mjs");
var Route$23 = createFileRoute("/partners")({
	head: () => pageHead("Partners & Ecosystem", "Explore collaboration opportunities for agricultural institutions, data experts and verification organizations.", "/partners"),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
function PassportRedirect() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		navigate({ to: "/dashboard" });
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#102e20] text-white flex items-center justify-center font-mono text-xs",
		children: "Loading Field Passport into TerraLedger Workspace..."
	});
}
var Route$22 = createFileRoute("/passport")({
	head: () => pageHead("Field Passport | TerraLedger AI", "Field parcel passport, cadastral boundaries, and agricultural MRV audit record.", "/passport"),
	component: PassportRedirect
});
var $$splitComponentImporter$10 = () => import("./platform-BS5pLeuW.mjs");
var Route$21 = createFileRoute("/platform")({
	head: () => pageHead("Platform", "Explore the The Carbon Credit Evidence Graph, agricultural data sources, analysis, validation and human review.", "/platform"),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./privacy-DpzEAsPi.mjs");
var Route$20 = createFileRoute("/privacy")({
	head: () => pageHead("Privacy & Data Governance", "Understand public enquiry handling, program consent, authorized access, proposed safeguards, publication permissions and responsible AI use.", "/privacy"),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./research-0LM4BrfO.mjs");
var Route$19 = createFileRoute("/research")({
	head: () => pageHead("Research & Insights", "Introductory perspectives on agricultural evidence, measurement, MRV and accountable AI-supported analysis.", "/research"),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./solutions-8Y_AtQXi.mjs");
var Route$18 = createFileRoute("/solutions")({
	head: () => pageHead("Agricultural Solutions", "Agricultural monitoring, water management, environmental MRV, insurance evidence and program oversight.", "/solutions"),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./terms-DYA5UaWF.mjs");
var Route$17 = createFileRoute("/terms")({
	head: () => pageHead("Terms of Use", "Limits on public platform information, illustrative agricultural records and income estimates.", "/terms"),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
function WorkspaceShell({ children }) {
	const { field, assessmentStatus, completenessPercent } = useTerraLedger();
	const { currentUser, currentRole, switchRole } = useAuth();
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	const [roleDropdownOpen, setRoleDropdownOpen] = (0, import_react.useState)(false);
	const currentPath = useRouterState().location.pathname;
	const navItems = [
		{
			to: "/workspace/command",
			segment: "command",
			label: "Command Centre",
			icon: LayoutDashboard,
			badge: "Live MRV"
		},
		{
			to: "/workspace/projects",
			segment: "projects",
			label: "Projects Registry",
			icon: FolderGit2,
			badge: "VCS"
		},
		{
			to: "/workspace/farmers",
			segment: "farmers",
			label: "Farmer Registry",
			icon: Users,
			badge: "KYC"
		},
		{
			to: "/workspace/fields",
			segment: "fields",
			label: "Field Parcels",
			icon: MapPin,
			badge: "Cadastral"
		},
		{
			to: "/workspace/evidence",
			segment: "evidence",
			label: "Evidence Explorer",
			icon: GitFork,
			badge: "Graph"
		},
		{
			to: "/workspace/review",
			segment: "review",
			label: "Review Queue",
			icon: SquareCheckBig,
			badge: "Audits"
		},
		{
			to: "/workspace/assessments",
			segment: "assessments",
			label: "MRV Assessments",
			icon: FileBadge,
			badge: "Scores"
		},
		{
			to: "/workspace/dossier",
			segment: "dossier",
			label: "Project Dossier",
			icon: FileCheckCorner,
			badge: "Diligence"
		},
		{
			to: "/workspace/satellite",
			segment: "satellite",
			label: "Satellite Intelligence",
			icon: Satellite,
			badge: "S2 10m"
		},
		{
			to: "/workspace/terra-intelligence",
			segment: "terra-intelligence",
			label: "Terra Intelligence",
			icon: Earth,
			badge: "GIS"
		},
		{
			to: "/workspace/reports",
			segment: "reports",
			label: "Reports & Export",
			icon: FileSpreadsheet,
			badge: "PDF"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#f4f6f0] text-[#213c2b] flex flex-col font-sans",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoBanner, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col md:flex-row relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:hidden flex items-center justify-between px-4 py-3 bg-[#102e20] text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-serif text-xl tracking-tight text-[#f5f5e8]",
							children: ["TerraLedger", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[#d6eaa6] font-normal",
								children: "AI"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] bg-[#d6eaa6]/20 text-[#d6eaa6] px-1.5 py-0.5 rounded font-mono uppercase",
							children: currentRole
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMobileMenuOpen(!mobileMenuOpen),
						className: "p-1.5 text-slate-300 hover:text-white",
						"aria-label": "Toggle Navigation",
						children: mobileMenuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 20 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 20 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: `${mobileMenuOpen ? "block" : "hidden"} md:block w-full md:w-64 bg-[#102e20] text-[#bacabd] p-5 flex flex-col md:fixed md:top-12 md:bottom-0 z-30 overflow-y-auto border-r border-[#1e4834]`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden md:block pb-4 border-b border-[#ffffff15]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/workspace/command",
								className: "inline-block group",
								title: "TerraLedger AI Workspace",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-serif text-2xl text-[#f5f5e8] flex items-baseline gap-1",
									children: ["TerraLedger", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#d6eaa6] font-sans font-semibold text-lg",
										children: "AI"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[9px] text-[#809c88] tracking-widest mt-0.5 uppercase",
									children: "Internal Operations Workspace"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-4 p-3 bg-[#173a2b] border border-[#ffffff14] rounded-xl relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[10px] font-mono text-[#809c88] mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AUTHENTICATED AS" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#d6eaa6] uppercase font-semibold",
										children: currentRole
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "truncate pr-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-white truncate",
											children: currentUser?.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-[#bacabd] truncate",
											children: currentUser?.organization
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setRoleDropdownOpen(!roleDropdownOpen),
										className: "p-1 text-[#809c88] hover:text-[#d6eaa6] rounded bg-[#ffffff10]",
										title: "Switch Operational Role for Testing",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { size: 14 })
									})]
								}),
								roleDropdownOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute left-0 right-0 top-full mt-2 bg-[#0c2419] border border-[#2a563f] rounded-lg shadow-xl z-50 p-2 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-mono text-[#809c88] px-2 py-1 uppercase",
										children: "Switch Role"
									}), [
										{
											role: "admin",
											label: "Administrator (Full Access)"
										},
										{
											role: "project_developer",
											label: "Project Developer (Panjdhara)"
										},
										{
											role: "field_officer",
											label: "Field Officer (Extension)"
										},
										{
											role: "reviewer",
											label: "Reviewer / Auditor (VVB)"
										}
									].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											switchRole(r.role);
											setRoleDropdownOpen(false);
										},
										className: `w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${currentRole === r.role ? "bg-[#d6eaa6] text-[#102e20] font-semibold" : "text-[#bacabd] hover:bg-[#ffffff15]"}`,
										children: r.label
									}, r.role))]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] tracking-widest text-[#809c88] mb-2 uppercase px-2",
								children: "Operational Modules"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "space-y-1",
								children: navItems.map((item) => {
									const Icon = item.icon;
									const isActive = currentPath === item.to || item.to !== "/workspace/command" && currentPath.startsWith(item.to);
									const hasAccess = canAccessWorkspaceRoute(currentUser, item.segment);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: item.to,
										onClick: () => setMobileMenuOpen(false),
										className: `w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive ? "bg-[#d6eaa6] text-[#173a27] font-semibold shadow-sm" : hasAccess ? "text-[#bacabd] hover:bg-[#ffffff10] hover:text-white" : "text-[#566e5c] opacity-60 hover:opacity-100 hover:bg-[#ffffff08]"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
												size: 15,
												className: isActive ? "text-[#173a27]" : hasAccess ? "text-[#809c88]" : "text-[#566e5c]"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: item.label
											})]
										}), item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-[9px] font-mono px-1.5 py-0.5 rounded ${isActive ? "bg-[#173a27]/10 text-[#173a27]" : "bg-[#ffffff10] text-[#809c88]"}`,
											children: item.badge
										})]
									}, item.to);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 bg-[#173a2b] border border-[#ffffff12] rounded-xl p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[10px] font-mono text-[#809c88] mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PRIMARY PARCEL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#d6eaa6]",
										children: "PUNJAB"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-white truncate",
									children: field.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-[11px] text-[#bacabd] mt-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
										size: 11,
										className: "text-[#d6eaa6]"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										field.district,
										", ",
										field.areaHa,
										" ha"
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 pt-1.5 border-t border-[#ffffff10] flex items-center justify-between text-[10px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#809c88]",
										children: "Status:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#d6eaa6] font-mono text-[9px]",
										children: assessmentStatus
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto pt-4 border-t border-[#ffffff12] space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/",
								className: "flex items-center justify-between text-xs text-[#809c88] hover:text-white px-2 py-1 rounded transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Public Site" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { size: 12 })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-[#637d6a] px-2 font-mono",
								children: "TerraLedger AI v2.4 · Operations"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "flex-1 md:ml-64 flex flex-col min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "h-14 bg-white border-b border-[#dde4d9] px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 md:top-12 z-20 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-[#72816f] hidden sm:inline",
								children: "Active Scope:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold text-[#213c2b] flex items-center gap-1.5 truncate",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
										size: 14,
										className: "text-[#347454] shrink-0"
									}),
									field.code,
									" · ",
									field.practice
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden sm:flex items-center gap-1.5 text-xs text-[#72816f]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, {
										size: 13,
										className: "text-[#347454]"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px] font-semibold text-[#213c2b] uppercase",
										children: currentRole.replace(/_/g, " ")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden sm:flex flex-col items-end text-right border-l border-[#dde4d9] pl-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] font-mono text-[#72816f]",
										children: "EVIDENCE"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-[#213c2b]",
										children: [completenessPercent, "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${assessmentStatus === "READY_FOR_VERIFICATION" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : assessmentStatus === "NEEDS_REVIEW" ? "bg-sky-100 text-sky-800 border border-sky-300" : "bg-amber-100 text-amber-800 border border-amber-300"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-1.5 h-1.5 rounded-full ${assessmentStatus === "READY_FOR_VERIFICATION" ? "bg-emerald-600" : assessmentStatus === "NEEDS_REVIEW" ? "bg-sky-600" : "bg-amber-600"}` }), assessmentStatus.replace(/_/g, " ")]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6",
						children
					})]
				})
			]
		})]
	});
}
function WorkspaceRouteLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, {
		defaultRole: "admin",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TerraLedgerProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) })
	});
}
var Route$16 = createFileRoute("/workspace")({ component: WorkspaceRouteLayout });
var $$splitComponentImporter$5 = () => import("./workspace-CpPErlTC.mjs");
var Route$15 = createFileRoute("/workspace/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var MOCK_PROJECTS = MARKETPLACE_PROJECTS.map((p, idx) => ({
	...p,
	createdAt: "2026-01-15",
	updatedAt: "2026-10-28",
	complianceStandard: idx % 2 === 0 ? "Verra VM0042" : "Gold Standard SOC",
	registryId: `VCS-PRJ-2026-0${idx + 1}84`,
	pipelineStage: idx === 0 ? "Verification Audit" : idx === 1 ? "Monitoring" : "Field Baseline",
	leadDeveloper: p.developer,
	targetMethaneReductionPercent: idx === 0 ? 48 : idx === 1 ? 52 : 35
}));
var MOCK_FARMERS = [
	{
		id: "FARM-PB-001",
		name: "Gurdev Singh Gill",
		localName: "ਗੁਰਦੇਵ ਸਿੰਘ ਗਿੱਲ",
		phoneMasked: "+91 98765-XXXX1",
		district: "Ludhiana",
		tehsil: "Samrala",
		village: "Gill Kalan",
		fpoName: "Malwa Progressive Rice FPO",
		enrolledHectares: 4.8,
		totalParcels: 2,
		kycStatus: "Verified",
		enrolmentDate: "2026-04-12",
		bankAccountVerified: true,
		baselineCrop: "Puddle Transplanted Paddy (PR-126)",
		practiceAdopted: "Direct Seeded Rice (DSR) + AWD",
		pensionOrDirectTransferId: "PM-KISAN-PB-88912"
	},
	{
		id: "FARM-PB-002",
		name: "Harbhajan Singh Dhillon",
		localName: "ਹਰਭਜਨ ਸਿੰਘ ਢਿੱਲੋਂ",
		phoneMasked: "+91 94172-XXXX8",
		district: "Sangrur",
		tehsil: "Sunam",
		village: "Dhillon Patti",
		fpoName: "Panjdhara Farmers Collective",
		enrolledHectares: 7.2,
		totalParcels: 3,
		kycStatus: "Verified",
		enrolmentDate: "2026-03-29",
		bankAccountVerified: true,
		baselineCrop: "Long Duration Puddled Rice (Pusa 44)",
		practiceAdopted: "Happy Seeder Wheat + Short DSR",
		pensionOrDirectTransferId: "PM-KISAN-PB-44120"
	},
	{
		id: "FARM-PB-003",
		name: "Kuldeep Kaur Brar",
		localName: "ਕੁਲਦੀਪ ਕੌਰ ਬਰਾੜ",
		phoneMasked: "+91 98144-XXXX3",
		district: "Bathinda",
		tehsil: "Talwandi Sabo",
		village: "Brar Kot",
		fpoName: "Malwa Clean Air Farmers Union",
		enrolledHectares: 3.5,
		totalParcels: 1,
		kycStatus: "Pending Verification",
		enrolmentDate: "2026-05-18",
		bankAccountVerified: false,
		baselineCrop: "Transplanted Basmati 1121",
		practiceAdopted: "Laser Land Leveling + AWD",
		pensionOrDirectTransferId: "PM-KISAN-PB-99432"
	},
	{
		id: "FARM-PB-004",
		name: "Balwinder Singh Sidhu",
		localName: "ਬਲਵਿੰਦਰ ਸਿੰਘ ਸਿੱਧੂ",
		phoneMasked: "+91 97800-XXXX5",
		district: "Patiala",
		tehsil: "Nabha",
		village: "Sidhuwala",
		fpoName: "Patiala Basin Water Conservation Society",
		enrolledHectares: 6,
		totalParcels: 2,
		kycStatus: "Verified",
		enrolmentDate: "2026-04-02",
		bankAccountVerified: true,
		baselineCrop: "Continuous Flooding Basmati",
		practiceAdopted: "AWD Piezometer Protocol",
		pensionOrDirectTransferId: "PM-KISAN-PB-66381"
	}
];
var MOCK_FIELDS = [
	{
		...PRIMARY_FIELD,
		fpoId: "FPO-MALWA-01",
		fpoName: "Malwa Progressive Rice FPO",
		soilType: "Sandy Loam (Alluvial)",
		irrigationSource: "Canal + Electric Tubewell",
		seedingDate: "2026-06-10",
		harvestProjectedDate: "2026-10-25",
		currentCropStage: "Panicle Initiation",
		awdTubeCount: 3,
		activeStatus: "Under Review",
		assignedFieldOfficer: "Harpreet Singh Gill"
	},
	{
		id: "PB-SAN-108",
		code: "PB-SAN-108",
		name: "Dhillon Estate North 2",
		farmerName: "Harbhajan Singh Dhillon",
		farmerNameLocal: "ਹਰਭਜਨ ਸਿੰਘ ਢਿੱਲੋਂ",
		district: "Sangrur",
		state: "Punjab",
		areaHa: 7.2,
		areaAcres: 17.79,
		practice: "Residue Retention + Happy Seeder",
		crop: "PBW 826 Wheat / PR-126 Basmati",
		season: "Kharif-Rabi 2026",
		coordinates: {
			lat: 30.245,
			lng: 75.842
		},
		boundaryPolygon: [
			[30.247, 75.84],
			[30.248, 75.845],
			[30.242, 75.846],
			[30.241, 75.841]
		],
		targetEmissionReductionTonnes: 34.56,
		fpoId: "FPO-PANJ-02",
		fpoName: "Panjdhara Farmers Collective",
		soilType: "Clay Loam",
		irrigationSource: "Solar Micro-irrigation",
		seedingDate: "2026-06-05",
		harvestProjectedDate: "2026-10-18",
		currentCropStage: "Grain Filling",
		awdTubeCount: 4,
		activeStatus: "Audit Approved",
		assignedFieldOfficer: "Jasbir Singh"
	},
	{
		id: "PB-BAT-089",
		code: "PB-BAT-089",
		name: "Brar Kot Parcel 1",
		farmerName: "Kuldeep Kaur Brar",
		farmerNameLocal: "ਕੁਲਦੀਪ ਕੌਰ ਬਰਾੜ",
		district: "Bathinda",
		state: "Punjab",
		areaHa: 3.5,
		areaAcres: 8.65,
		practice: "Laser Leveling + AWD",
		crop: "Pusa Basmati 1121",
		season: "Kharif 2026",
		coordinates: {
			lat: 30.082,
			lng: 75.012
		},
		boundaryPolygon: [
			[30.084, 75.01],
			[30.085, 75.015],
			[30.08, 75.016],
			[30.079, 75.011]
		],
		targetEmissionReductionTonnes: 16.8,
		fpoId: "FPO-BAT-03",
		fpoName: "Malwa Clean Air Farmers Union",
		soilType: "Silt Loam",
		irrigationSource: "Diesel Tubewell",
		seedingDate: "2026-06-18",
		harvestProjectedDate: "2026-11-05",
		currentCropStage: "Vegetative Tillering",
		awdTubeCount: 2,
		activeStatus: "Flagged Discrepancy",
		assignedFieldOfficer: "Manjit Singh"
	}
];
var MOCK_REVIEWS = [
	{
		id: "REV-2026-091",
		title: "Spatial Anomaly in Seeding Photo EV-003",
		parcelId: "PB-LUD-042",
		farmerName: "Gurdev Singh Gill",
		severity: "high",
		type: "spatial_mismatch",
		status: "pending_review",
		reportedDate: "2026-06-16",
		dueDate: "2026-07-01",
		assignedTo: "Dr. Evelyn Martinez (Reviewer)",
		description: "EXIF coordinates fall 420m outside registered polygon. Corroboration required with in-boundary drill emergence photograph.",
		evidenceRefId: "EV-003"
	},
	{
		id: "REV-2026-088",
		title: "Missing Early-Season PVC Water Tube Log",
		parcelId: "PB-LUD-042",
		farmerName: "Gurdev Singh Gill",
		severity: "medium",
		type: "missing_awd_log",
		status: "in_investigation",
		reportedDate: "2026-06-25",
		dueDate: "2026-07-10",
		assignedTo: "Harpreet Singh Gill (Field Officer)",
		description: "Mandatory AWD drying interval records not logged for June 20-30 vegetative flushing phase.",
		evidenceRefId: "EV-004"
	},
	{
		id: "REV-2026-074",
		title: "Cadastral Boundary Overlap with Canal Right-of-Way",
		parcelId: "PB-BAT-089",
		farmerName: "Kuldeep Kaur Brar",
		severity: "medium",
		type: "boundary_conflict",
		status: "pending_review",
		reportedDate: "2026-06-20",
		dueDate: "2026-07-05",
		assignedTo: "Amrita Kaur (Project Developer)",
		description: "Southern boundary edge intercepts public canal bund drainage buffer by 6 meters. Parcel polygon adjustment required."
	}
];
var MOCK_ASSESSMENTS = [{
	id: "ASM-2026-LUD-042",
	assessmentNumber: "ASM-2026-042",
	projectId: "PRJ-PB-DSR-01",
	projectTitle: "Punjab Direct Seeded Rice MRV Cluster #1",
	parcelCode: "PB-LUD-042",
	farmerName: "Gurdev Singh Gill",
	cropSeason: "Kharif 2026",
	status: "NEEDS_REVIEW",
	overallScorePercent: 71,
	evaluatedAt: "2026-10-24 14:30 UTC",
	leadAuditor: "Apex Climate Auditing & Verification (VVB)",
	criteriaChecks: {
		spatialCadastralBoundary: true,
		zeroPuddleVerification: true,
		awdDrydownSpectralMatch: true,
		fertilizerDosingLog: false,
		independentPeerInspection: true
	},
	headlineFindings: "Demonstrated dry seeding corroborated via Sentinel-2 NDWI drying curve. Geotag photo EV-003 offset pending final resolution.",
	recommendations: ["Obtain calibrated in-boundary photo taken by registered field extension agent", "Attach farmer urea dosing voucher and purchase receipt for additionality cross-reference"]
}, {
	id: "ASM-2026-SAN-108",
	assessmentNumber: "ASM-2026-108",
	projectId: "PRJ-PB-CRM-02",
	projectTitle: "Malwa Zero-Till & Residue Hub",
	parcelCode: "PB-SAN-108",
	farmerName: "Harbhajan Singh Dhillon",
	cropSeason: "Kharif 2026",
	status: "READY_FOR_VERIFICATION",
	overallScorePercent: 94,
	evaluatedAt: "2026-10-22 09:15 UTC",
	leadAuditor: "Bureau Veritas Agri-Carbon",
	criteriaChecks: {
		spatialCadastralBoundary: true,
		zeroPuddleVerification: true,
		awdDrydownSpectralMatch: true,
		fertilizerDosingLog: true,
		independentPeerInspection: true
	},
	headlineFindings: "All MRV criteria met. Complete Happy Seeder telematics and Sentinel-2 NDVI spectral canopy closure matched.",
	recommendations: ["Ready for third-party accredited VVB audit dossier compile"]
}];
var MOCK_LAYERS = [
	{
		id: "layer-s2-rgb",
		name: "Sentinel-2 True Color (RGB)",
		type: "optical_rgb",
		resolution: "10m / pixel",
		satellite: "Copernicus Sentinel-2B MSI",
		lastUpdated: "2026-08-15",
		opacity: 100,
		visible: true,
		cloudCoverPercent: 1.6
	},
	{
		id: "layer-ndvi",
		name: "Normalized Difference Vegetation Index (NDVI)",
		type: "ndvi_spectral",
		resolution: "10m / pixel",
		satellite: "Copernicus Sentinel-2B Level-2A",
		lastUpdated: "2026-08-15",
		opacity: 85,
		visible: true,
		cloudCoverPercent: 1.6
	},
	{
		id: "layer-ndwi",
		name: "Normalized Difference Water Index (NDWI)",
		type: "ndwi_moisture",
		resolution: "10m / pixel",
		satellite: "Copernicus Sentinel-2A Level-2A",
		lastUpdated: "2026-07-28",
		opacity: 80,
		visible: false,
		cloudCoverPercent: 4.5
	},
	{
		id: "layer-cadastral",
		name: "Punjab Revenue Cadastral Boundaries",
		type: "cadastral_boundary",
		resolution: "Vector Polygon (< 1m)",
		satellite: "Punjab Land Records Agency API",
		lastUpdated: "2026-05-18",
		opacity: 100,
		visible: true,
		cloudCoverPercent: 0
	}
];
var MOCK_REPORTS = [
	{
		id: "REP-2026-Q3-01",
		title: "Punjab DSR Cluster #1 MRV Integrity & Evidence Dossier",
		period: "Kharif 2026 (June - Oct)",
		category: "audit_dossier",
		status: "Ready",
		format: "PDF",
		fileSizeKb: 4820,
		generatedBy: "TerraLedger Automated MRV Engine"
	},
	{
		id: "REP-2026-Q3-02",
		title: "Malwa FPO Enrolment & Cadastral Verification Export",
		period: "Q3 2026",
		category: "fpo_enrolment",
		status: "Ready",
		format: "GeoJSON",
		fileSizeKb: 1240,
		generatedBy: "Amrita Kaur (Project Developer)"
	},
	{
		id: "REP-2026-Q3-03",
		title: "Methane Abatement & Water Pumping Baseline Report",
		period: "Kharif 2026",
		category: "emissions_reduction",
		status: "Ready",
		format: "CSV",
		fileSizeKb: 380,
		generatedBy: "Dr. Inderjit Singh (Admin)"
	}
];
var api = {
	projects: {
		list: async () => {
			return [...MOCK_PROJECTS];
		},
		getById: async (id) => {
			return MOCK_PROJECTS.find((p) => p.id === id || p.slug === id) || null;
		}
	},
	farmers: {
		list: async () => {
			return [...MOCK_FARMERS];
		},
		getById: async (id) => {
			return MOCK_FARMERS.find((f) => f.id === id) || null;
		}
	},
	fields: {
		list: async () => {
			return [...MOCK_FIELDS];
		},
		getById: async (id) => {
			return MOCK_FIELDS.find((f) => f.id === id || f.code === id) || null;
		}
	},
	evidence: {
		list: async (category) => {
			if (category && category !== "all") return INITIAL_EVIDENCE_ITEMS.filter((item) => item.category === category);
			return [...INITIAL_EVIDENCE_ITEMS];
		},
		getById: async (id) => {
			return INITIAL_EVIDENCE_ITEMS.find((e) => e.id === id) || null;
		}
	},
	reviews: {
		listQueue: async () => {
			return [...MOCK_REVIEWS];
		},
		getById: async (id) => {
			return MOCK_REVIEWS.find((r) => r.id === id) || null;
		},
		resolve: async (id, notes) => {
			const match = MOCK_REVIEWS.find((r) => r.id === id);
			if (match) {
				match.status = "resolved";
				match.resolutionNotes = notes;
				return true;
			}
			return false;
		}
	},
	assessments: {
		list: async () => {
			return [...MOCK_ASSESSMENTS];
		},
		getById: async (id) => {
			return MOCK_ASSESSMENTS.find((a) => a.id === id || a.assessmentNumber === id) || null;
		}
	},
	terraIntelligence: {
		getLayers: async () => {
			return [...MOCK_LAYERS];
		},
		getObservations: async () => {
			return [...SATELLITE_OBSERVATIONS];
		}
	},
	reports: { list: async () => {
		return [...MOCK_REPORTS];
	} }
};
function UnauthorizedState({ title = "Access Denied", description = "Your current authenticated account role does not have permission to view or manage this workspace section.", requiredPermission }) {
	const { currentRole, switchRole } = useAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-amber-200 my-6 shadow-xs max-w-xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4 text-amber-700",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { size: 28 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold text-[#193b2a]",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-[#72816f] mt-2 max-w-md",
				children: description
			}),
			requiredPermission && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 inline-block bg-[#f4f7f0] border border-[#dce3d7] rounded px-3 py-1 text-[11px] font-mono text-[#5c7c46]",
				children: ["Required Permission: ", requiredPermission]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 text-xs text-[#72816f]",
				children: ["Current active role: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "text-[#193b2a] uppercase",
					children: currentRole
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-center justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => switchRole("admin"),
					className: "text-xs border-[#245b45] text-[#245b45] hover:bg-[#245b45]/10",
					children: "Switch to Admin Demo Role"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/workspace/command",
					className: "inline-flex items-center justify-center rounded-md bg-[#245b45] px-4 py-2 text-xs font-medium text-white hover:bg-[#1a4333]",
					children: "Return to Command Centre"
				})]
			})
		]
	});
}
function PageHeader({ badge, icon: Icon, title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e2e8dc]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			badge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "inline-flex items-center gap-1.5 text-[11px] font-mono text-[#5c7c46] uppercase tracking-wider mb-1",
				children: [Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 13 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: badge })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl sm:text-4xl text-[#193b2a] tracking-tight",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-[#72816f] mt-1 max-w-2xl",
				children: description
			})
		] }), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center flex-wrap gap-2",
			children: actions
		})]
	});
}
function LoadingState({ message = "Loading data...", description = "Retrieving verified records from TerraLedger engine" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-[#e2e8dc] my-4 shadow-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-8 h-8 text-[#245b45] animate-spin mb-3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold text-[#193b2a]",
				children: message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-[#72816f] mt-1 max-w-sm",
				children: description
			})
		]
	});
}
function WorkspaceAssessmentsPage() {
	const { currentUser } = useAuth();
	const [assessments, setAssessments] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		api.assessments.list().then((res) => {
			setAssessments(res);
			setLoading(false);
		});
	}, []);
	if (!hasPermission(currentUser, "workspace:assessments:read")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnauthorizedState, { requiredPermission: "workspace:assessments:read" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			badge: "Independent Verification Engine",
			icon: FileBadge,
			title: "MRV Assessments",
			description: "Parcel-by-parcel quantitative compliance evaluations mapped against Verra VM0042 and Gold Standard agricultural protocols.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-mono text-[#5c7c46] bg-[#eef5e6] px-3 py-1.5 rounded-lg border border-[#cde0c5]",
					children: ["Total Evaluated: ", assessments.length]
				})
			})
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading MRV assessments..." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: assessments.map((asm) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs hover:border-[#b8cfb2] transition-all",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#edf2e8]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono px-2 py-0.5 rounded bg-[#f4f7f0] text-[#4f6453] border border-[#dce3d7]",
									children: asm.assessmentNumber
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-[#193b2a]",
									children: ["Parcel ", asm.parcelCode]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-[#72816f]",
									children: ["· ", asm.farmerName]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-lg text-[#193b2a]",
							children: asm.projectTitle
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 self-end sm:self-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] font-mono text-[#788e7c] block uppercase",
									children: "Completeness"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-lg font-mono font-bold text-[#193b2a]",
									children: [asm.overallScorePercent, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] font-mono px-3 py-1 rounded-full font-medium ${asm.status === "READY_FOR_VERIFICATION" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-800 border border-amber-300"}`,
								children: asm.status.replace(/_/g, " ")
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono uppercase text-[#788e7c] block mb-2",
							children: "Protocol Verification Checklist:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-2 rounded-lg border flex items-center gap-1.5 ${asm.criteriaChecks.spatialCadastralBoundary ? "bg-emerald-50/60 border-emerald-200 text-emerald-900" : "bg-amber-50/60 border-amber-200 text-amber-900"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
										size: 12,
										className: "text-emerald-600 shrink-0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Boundary Match" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-2 rounded-lg border flex items-center gap-1.5 ${asm.criteriaChecks.zeroPuddleVerification ? "bg-emerald-50/60 border-emerald-200 text-emerald-900" : "bg-amber-50/60 border-amber-200 text-amber-900"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
										size: 12,
										className: "text-emerald-600 shrink-0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zero Puddle" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-2 rounded-lg border flex items-center gap-1.5 ${asm.criteriaChecks.awdDrydownSpectralMatch ? "bg-emerald-50/60 border-emerald-200 text-emerald-900" : "bg-amber-50/60 border-amber-200 text-amber-900"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
										size: 12,
										className: "text-emerald-600 shrink-0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AWD Drydown" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-2 rounded-lg border flex items-center gap-1.5 ${asm.criteriaChecks.fertilizerDosingLog ? "bg-emerald-50/60 border-emerald-200 text-emerald-900" : "bg-amber-50/60 border-amber-200 text-amber-900"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
										size: 12,
										className: asm.criteriaChecks.fertilizerDosingLog ? "text-emerald-600" : "text-amber-600"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fertilizer Log" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `p-2 rounded-lg border flex items-center gap-1.5 ${asm.criteriaChecks.independentPeerInspection ? "bg-emerald-50/60 border-emerald-200 text-emerald-900" : "bg-amber-50/60 border-amber-200 text-amber-900"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
										size: 12,
										className: "text-emerald-600 shrink-0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Peer Audit" })]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 pt-3 border-t border-[#edf2e8] flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[#788e7c]",
							children: ["Lead Auditor: ", asm.leadAuditor]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/workspace/assessments/$assessmentId",
							params: { assessmentId: asm.id },
							className: "inline-flex items-center gap-1.5 font-semibold text-[#245b45] hover:text-[#193b2a]",
							children: ["View Assessment Findings", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 13 })]
						})]
					})
				]
			}, asm.id))
		})]
	});
}
var Route$14 = createFileRoute("/workspace/assessments")({
	head: () => pageHead("MRV Assessments | TerraLedger AI", "Quantitative compliance evaluations, verification scoring and audit findings.", "/workspace/assessments"),
	component: WorkspaceAssessmentsPage
});
var $$splitComponentImporter$4 = () => import("./command-CeckyA7G.mjs");
var Route$13 = createFileRoute("/workspace/command")({
	head: () => pageHead("Operational Command Centre | TerraLedger AI", "Field assessment command centre synthesizing ground evidence, remote sensing and review status.", "/workspace/command"),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./dossier-BY-5VoSk.mjs");
var Route$12 = createFileRoute("/workspace/dossier")({
	head: () => pageHead("Project Dossier | TerraLedger AI", "Comprehensive project evidence package, digital data room and institutional due diligence.", "/workspace/dossier"),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./evidence-Djho_nRv.mjs");
var Route$11 = createFileRoute("/workspace/evidence")({
	head: () => pageHead("Evidence Explorer | TerraLedger AI", "Multi-source agricultural evidence graph, document verification and spatial corroboration.", "/workspace/evidence"),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
function WorkspaceFarmersPage() {
	const { currentUser } = useAuth();
	const [farmers, setFarmers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filterKyc, setFilterKyc] = (0, import_react.useState)("all");
	(0, import_react.useEffect)(() => {
		api.farmers.list().then((res) => {
			setFarmers(res);
			setLoading(false);
		});
	}, []);
	if (!hasPermission(currentUser, "workspace:farmers:read")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnauthorizedState, { requiredPermission: "workspace:farmers:read" });
	const filtered = farmers.filter((f) => {
		const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.district.toLowerCase().includes(search.toLowerCase()) || f.village.toLowerCase().includes(search.toLowerCase()) || f.fpoName.toLowerCase().includes(search.toLowerCase());
		const matchesKyc = filterKyc === "all" || f.kycStatus === filterKyc;
		return matchesSearch && matchesKyc;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				badge: "Internal Farmer Registry",
				icon: Users,
				title: "Enrolled Farmer Partners",
				description: "Comprehensive cadastral KYC registry, FPO aggregation memberships, and bank transfer verifications.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-mono text-[#5c7c46] bg-[#eef5e6] px-3 py-1.5 rounded-lg border border-[#cde0c5]",
						children: ["Active Farmers: ", farmers.length]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						size: 14,
						className: "absolute left-3 top-3 text-[#788e7c]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "Search farmer name, village, FPO...",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						className: "w-full text-xs pl-9 pr-3 py-2 bg-[#f8faf6] border border-[#d8e1d4] rounded-lg text-[#193b2a] outline-none focus:border-[#245b45]"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, {
						size: 13,
						className: "text-[#5c7c46]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: filterKyc,
						onChange: (e) => setFilterKyc(e.target.value),
						className: "text-xs bg-[#f8faf6] border border-[#d8e1d4] rounded-lg px-2.5 py-1.5 text-[#193b2a] outline-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All KYC Statuses"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Verified",
								children: "Verified KYC"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Pending Verification",
								children: "Pending Verification"
							})
						]
					})]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading farmer registry..." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl overflow-hidden shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-[#f8faf6] border-b border-[#dfe6d9] text-[#69816a] font-mono uppercase text-[10px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Farmer & ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Location & Village"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "FPO Collective"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Enrolled Area"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Practice Adopted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "KYC Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "Bank Linked"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-[#edf2e8]",
							children: filtered.map((farmer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-[#fafcf8] transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-[#193b2a]",
											children: farmer.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-[#72816f] font-mono",
											lang: "pa",
											children: [
												farmer.localName,
												" · ",
												farmer.id
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[#213c2b] flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
												size: 11,
												className: "text-[#5c7c46]"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												farmer.village,
												", ",
												farmer.tehsil
											] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-[#72816f]",
											children: [farmer.district, ", Punjab"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[#213c2b] font-medium",
											children: farmer.fpoName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-[#72816f]",
											children: farmer.phoneMasked
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-mono font-semibold text-[#193b2a]",
											children: [farmer.enrolledHectares, " ha"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-[#72816f]",
											children: [farmer.totalParcels, " parcel(s)"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-[#245b45] font-medium bg-[#f0f6ec] px-2 py-0.5 rounded border border-[#d2e3ca]",
											children: farmer.practiceAdopted
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${farmer.kycStatus === "Verified" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`,
											children: [farmer.kycStatus === "Verified" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
												size: 10,
												className: "text-emerald-600"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
												size: 10,
												className: "text-amber-600"
											}), farmer.kycStatus]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-right font-mono",
										children: farmer.bankAccountVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-700 text-[11px] font-medium",
											children: "✓ Verified"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-700 text-[11px] font-medium",
											children: "Pending"
										})
									})
								]
							}, farmer.id))
						})]
					})
				})
			})
		]
	});
}
var Route$10 = createFileRoute("/workspace/farmers")({
	head: () => pageHead("Farmer Registry | TerraLedger AI", "Internal smallholder farmer registry, KYC verification and FPO affiliation directory.", "/workspace/farmers"),
	component: WorkspaceFarmersPage
});
function WorkspaceFieldsPage() {
	const { currentUser } = useAuth();
	const [fields, setFields] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("all");
	(0, import_react.useEffect)(() => {
		api.fields.list().then((res) => {
			setFields(res);
			setLoading(false);
		});
	}, []);
	if (!hasPermission(currentUser, "workspace:fields:read")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnauthorizedState, { requiredPermission: "workspace:fields:read" });
	const filtered = fields.filter((f) => {
		const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.code.toLowerCase().includes(search.toLowerCase()) || f.farmerName.toLowerCase().includes(search.toLowerCase()) || f.district.toLowerCase().includes(search.toLowerCase());
		const matchesStatus = filterStatus === "all" || f.activeStatus === filterStatus;
		return matchesSearch && matchesStatus;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				badge: "Cadastral Field Parcels",
				icon: MapPin,
				title: "Field Parcel Registry",
				description: "Parcel-level cadastral GIS boundaries, agricultural practice adoption, and AWD sensor installations.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-mono text-[#5c7c46] bg-[#eef5e6] px-3 py-1.5 rounded-lg border border-[#cde0c5]",
						children: [
							"Total Monitored: ",
							fields.reduce((acc, f) => acc + f.areaHa, 0).toFixed(1),
							" ha"
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						size: 14,
						className: "absolute left-3 top-3 text-[#788e7c]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "Search parcel code, farmer, district...",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						className: "w-full text-xs pl-9 pr-3 py-2 bg-[#f8faf6] border border-[#d8e1d4] rounded-lg text-[#193b2a] outline-none focus:border-[#245b45]"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, {
						size: 13,
						className: "text-[#5c7c46]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: filterStatus,
						onChange: (e) => setFilterStatus(e.target.value),
						className: "text-xs bg-[#f8faf6] border border-[#d8e1d4] rounded-lg px-2.5 py-1.5 text-[#193b2a] outline-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Parcel Statuses"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Audit Approved",
								children: "Audit Approved"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Under Review",
								children: "Under Review"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Flagged Discrepancy",
								children: "Flagged Discrepancy"
							})
						]
					})]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading field parcels..." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-5",
				children: filtered.map((fieldItem) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs hover:border-[#b8cfb2] transition-all flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono font-bold text-[#193b2a] bg-[#f0f6ec] px-2 py-0.5 rounded border border-[#d4e3cf]",
								children: fieldItem.code
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] font-mono px-2 py-0.5 rounded-full font-medium ${fieldItem.activeStatus === "Audit Approved" ? "bg-emerald-100 text-emerald-800" : fieldItem.activeStatus === "Under Review" ? "bg-sky-100 text-sky-800" : "bg-amber-100 text-amber-800"}`,
								children: fieldItem.activeStatus
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-base text-[#193b2a]",
							children: fieldItem.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-[#72816f] mt-0.5",
							children: ["Farmer: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[#193b2a]",
								children: fieldItem.farmerName
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-3 py-3 border-y border-[#edf2e8] space-y-1.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#788e7c]",
										children: "Location:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-[#213c2b]",
										children: [fieldItem.district, ", Punjab"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#788e7c]",
										children: "Area:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-medium text-[#213c2b]",
										children: [
											fieldItem.areaHa,
											" ha (",
											fieldItem.areaAcres,
											" ac)"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#788e7c]",
										children: "Crop Stage:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-[#245b45]",
										children: fieldItem.currentCropStage
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#788e7c]",
										children: "AWD Tubes:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-medium text-[#213c2b]",
										children: [fieldItem.awdTubeCount, " units"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#788e7c]",
										children: "Field Officer:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#526a57] text-[11px] truncate max-w-[140px]",
										children: fieldItem.assignedFieldOfficer
									})]
								})
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono text-[#5c7c46] truncate max-w-[120px]",
							children: fieldItem.practice
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/workspace/fields/$fieldId",
							params: { fieldId: fieldItem.id },
							className: "inline-flex items-center gap-1.5 text-xs font-semibold text-[#245b45] hover:text-[#193b2a]",
							children: ["Inspect Parcel", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 13 })]
						})]
					})]
				}, fieldItem.id))
			})
		]
	});
}
var Route$9 = createFileRoute("/workspace/fields")({
	head: () => pageHead("Field Parcels | TerraLedger AI", "Cadastral parcel registry, geospatial boundaries and water management installations.", "/workspace/fields"),
	component: WorkspaceFieldsPage
});
function WorkspaceProjectsPage() {
	const { currentUser } = useAuth();
	const [projects, setProjects] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filterStage, setFilterStage] = (0, import_react.useState)("all");
	(0, import_react.useEffect)(() => {
		api.projects.list().then((res) => {
			setProjects(res);
			setLoading(false);
		});
	}, []);
	if (!hasPermission(currentUser, "workspace:projects:read")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnauthorizedState, { requiredPermission: "workspace:projects:read" });
	const filtered = projects.filter((p) => {
		const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.district.toLowerCase().includes(search.toLowerCase()) || p.methodology.toLowerCase().includes(search.toLowerCase());
		const matchesStage = filterStage === "all" || p.pipelineStage === filterStage;
		return matchesSearch && matchesStage;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				badge: "Internal Project Registry",
				icon: FolderGit2,
				title: "Agricultural Carbon Projects",
				description: "Institutional portfolio of active agricultural emission reduction programs across Punjab.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-mono text-[#5c7c46] bg-[#eef5e6] px-3 py-1.5 rounded-lg border border-[#cde0c5]",
						children: [
							"Total Enrolled:",
							" ",
							projects.reduce((acc, curr) => acc + curr.totalHectares, 0).toLocaleString(),
							" ha"
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						size: 14,
						className: "absolute left-3 top-3 text-[#788e7c]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "Search by title, district or standard...",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						className: "w-full text-xs pl-9 pr-3 py-2 bg-[#f8faf6] border border-[#d8e1d4] rounded-lg text-[#193b2a] outline-none focus:border-[#245b45]"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, {
						size: 13,
						className: "text-[#5c7c46]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: filterStage,
						onChange: (e) => setFilterStage(e.target.value),
						className: "text-xs bg-[#f8faf6] border border-[#d8e1d4] rounded-lg px-2.5 py-1.5 text-[#193b2a] outline-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Pipeline Stages"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Verification Audit",
								children: "Verification Audit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Monitoring",
								children: "Monitoring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Field Baseline",
								children: "Field Baseline"
							})
						]
					})]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading registered projects..." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-5",
				children: filtered.map((proj) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs hover:border-[#b8cfb2] transition-all flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono px-2 py-0.5 rounded bg-[#f4f7f0] text-[#4f6453] border border-[#dce3d7]",
								children: proj.registryId
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-[10px] font-mono px-2 py-0.5 rounded-full font-medium ${proj.assessmentStatus === "READY_FOR_VERIFICATION" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`,
								children: proj.pipelineStage
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-xl text-[#193b2a] tracking-tight",
							children: proj.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#72816f] mt-1 line-clamp-2",
							children: proj.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 my-4 pt-3 border-t border-[#edf2e8] text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-[#788e7c] block uppercase font-mono",
									children: "Area"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-[#193b2a] font-mono",
									children: [proj.totalHectares, " ha"]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-[#788e7c] block uppercase font-mono",
									children: "Farmers"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-[#193b2a] font-mono",
									children: proj.farmerCount
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-[#788e7c] block uppercase font-mono",
									children: "Mitigation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-[#245b45] font-mono",
									children: [proj.estimatedTonsCo2ePerYear.toLocaleString(), " t"]
								})] })
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t border-[#edf2e8] flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] text-[#5c7c46] font-medium flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { size: 12 }), proj.methodology]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/workspace/projects/$projectId",
							params: { projectId: proj.id },
							className: "inline-flex items-center gap-1.5 text-xs font-semibold text-[#245b45] hover:text-[#193b2a]",
							children: ["Inspect Project Dossier", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 13 })]
						})]
					})]
				}, proj.id))
			})
		]
	});
}
var Route$8 = createFileRoute("/workspace/projects")({
	head: () => pageHead("Projects Registry | TerraLedger AI", "Institutional agricultural carbon project registry and monitoring pipeline.", "/workspace/projects"),
	component: WorkspaceProjectsPage
});
function WorkspaceReportsPage() {
	const { currentUser } = useAuth();
	const [reports, setReports] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [isGenerating, setIsGenerating] = (0, import_react.useState)(false);
	const [downloadNotice, setDownloadNotice] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		api.reports.list().then((res) => {
			setReports(res);
			setLoading(false);
		});
	}, []);
	if (!hasPermission(currentUser, "workspace:reports:view")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnauthorizedState, { requiredPermission: "workspace:reports:view" });
	const handleGenerate = () => {
		setIsGenerating(true);
		setTimeout(() => {
			const newReport = {
				id: `REP-2026-GEN-${Date.now().toString().slice(-4)}`,
				title: "Ad-hoc Cadastral Compliance & Methane Ledger Export",
				period: "Kharif 2026 Season to Date",
				category: "audit_dossier",
				status: "Ready",
				format: "Audit ZIP",
				fileSizeKb: 6140,
				generatedBy: currentUser?.name || "Administrator"
			};
			setReports((prev) => [newReport, ...prev]);
			setIsGenerating(false);
			setDownloadNotice(`Generated ${newReport.title} successfully.`);
		}, 1200);
	};
	const handleDownload = (rep) => {
		setDownloadNotice(`Downloaded demonstration archive for: ${rep.title} (${rep.format}, ${(rep.fileSizeKb / 1024).toFixed(1)} MB).`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				badge: "Compliance Documentation Desk",
				icon: FileSpreadsheet,
				title: "Reports & Compliance Exports",
				description: "Generate and export auditable MRV dossiers, cadastral boundary GeoJSON packages, and methodology compliance summaries.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: handleGenerate,
					disabled: isGenerating,
					className: "text-xs bg-[#245b45] text-white hover:bg-[#1a4333]",
					children: isGenerating ? "Compiling Dossier..." : "Generate New Audit Package"
				})
			}),
			downloadNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-[#f0f6ec] border border-[#cde0c5] rounded-xl p-3 text-xs text-[#2a4d36] flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
						size: 14,
						className: "text-[#347454]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: downloadNotice })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setDownloadNotice(null),
					className: "text-[#526a57] hover:text-[#193b2a] font-bold text-xs",
					children: "×"
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading compliance report catalog..." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl overflow-hidden shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-[#f8faf6] border-b border-[#dfe6d9] text-[#69816a] font-mono uppercase text-[10px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Report Document"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Reporting Period"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Format & Size"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Generated By"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "Action"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-[#edf2e8]",
							children: reports.map((rep) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-[#fafcf8] transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-[#193b2a]",
											children: rep.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] font-mono text-[#788e7c]",
											children: rep.id
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-[#526a57]",
										children: rep.period
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-[11px] bg-[#f4f7f0] px-2 py-0.5 rounded border border-[#dce3d7] text-[#245b45]",
											children: [
												rep.format,
												" · ",
												(rep.fileSizeKb / 1024).toFixed(1),
												" MB"
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-[#526a57] text-[11px]",
										children: rep.generatedBy
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
												size: 10,
												className: "text-emerald-600"
											}), rep.status]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => handleDownload(rep),
											className: "text-xs h-7 px-2.5 border-[#d8e1d4] text-[#213c2b] hover:bg-[#f4f6f0]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
												size: 11,
												className: "mr-1 text-[#5c7c46]"
											}), "Download"]
										})
									})
								]
							}, rep.id))
						})]
					})
				})
			})
		]
	});
}
var Route$7 = createFileRoute("/workspace/reports")({
	head: () => pageHead("Reports & Exports | TerraLedger AI", "Operational MRV report catalog, cadastral data exports and audit packages.", "/workspace/reports"),
	component: WorkspaceReportsPage
});
function WorkspaceReviewPage() {
	const { currentUser } = useAuth();
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filterSeverity, setFilterSeverity] = (0, import_react.useState)("all");
	const [resolvingId, setResolvingId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		api.reviews.listQueue().then((res) => {
			setTasks(res);
			setLoading(false);
		});
	}, []);
	if (!hasPermission(currentUser, "workspace:evidence:review") && currentUser?.role !== "project_developer" && currentUser?.role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnauthorizedState, { requiredPermission: "workspace:evidence:review" });
	const handleResolve = (id) => {
		setResolvingId(id);
		setTimeout(() => {
			api.reviews.resolve(id, "Corroborated by auditor review. Verified replacement photo linked.").then(() => {
				setTasks((prev) => prev.map((t) => t.id === id ? {
					...t,
					status: "resolved"
				} : t));
				setResolvingId(null);
			});
		}, 600);
	};
	const filtered = tasks.filter((t) => {
		if (filterSeverity === "all") return true;
		return t.severity === filterSeverity;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				badge: "Auditor Exception Desk",
				icon: SquareCheckBig,
				title: "MRV Review Queue",
				description: "Human-in-the-loop audit exception queue for spatial anomalies, missing ground observations, and boundary conflicts.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-mono text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200",
						children: ["Pending Exceptions: ", tasks.filter((t) => t.status === "pending_review").length]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, {
							size: 13,
							className: "text-[#5c7c46]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-[#72816f]",
							children: "Filter Severity:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: filterSeverity,
							onChange: (e) => setFilterSeverity(e.target.value),
							className: "text-xs bg-[#f8faf6] border border-[#d8e1d4] rounded-lg px-2.5 py-1 text-[#193b2a] outline-none",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All Severities"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "high",
									children: "High Severity (Spatial/Integrity)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "medium",
									children: "Medium Severity (Logs/Docs)"
								})
							]
						})
					]
				})
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading review tasks..." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: filtered.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `bg-white border rounded-xl p-5 shadow-xs transition-all ${task.status === "resolved" ? "border-emerald-200 bg-[#fafcf9]" : task.severity === "high" ? "border-amber-300" : "border-[#dfe6d9]"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono px-2 py-0.5 rounded bg-[#f4f7f0] text-[#4f6453] border border-[#dce3d7]",
											children: task.id
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${task.severity === "high" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"}`,
											children: [task.severity, " severity"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-mono text-[#788e7c]",
											children: ["Parcel: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-[#193b2a]",
												children: task.parcelId
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-base text-[#193b2a]",
									children: task.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#526a57] leading-relaxed",
									children: task.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4 text-[11px] text-[#788e7c] pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
												size: 11,
												className: "text-[#5c7c46]"
											}),
											"Assigned: ",
											task.assignedTo
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
												size: 11,
												className: "text-[#5c7c46]"
											}),
											"Due: ",
											task.dueDate
										]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sm:self-center flex flex-col items-end gap-2 shrink-0",
							children: task.status === "resolved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 13 }), "Resolved & Attested"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => handleResolve(task.id),
								disabled: resolvingId === task.id,
								className: "text-xs bg-[#245b45] text-white hover:bg-[#1a4333] h-8",
								children: resolvingId === task.id ? "Attesting..." : "Attest Resolution"
							})
						})]
					})
				}, task.id))
			})
		]
	});
}
var Route$6 = createFileRoute("/workspace/review")({
	head: () => pageHead("Review Queue | TerraLedger AI", "Auditor exception desk and evidence dispute resolution queue.", "/workspace/review"),
	component: WorkspaceReviewPage
});
var $$splitComponentImporter$1 = () => import("./satellite-C_AwiEIa.mjs");
var Route$5 = createFileRoute("/workspace/satellite")({
	head: () => pageHead("Satellite Intelligence | TerraLedger AI", "Copernicus Sentinel-2 multi-spectral time-series and vegetation index analysis.", "/workspace/satellite"),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./terra-intelligence-ObQ_5imW.mjs");
var Route$4 = createFileRoute("/workspace/terra-intelligence")({
	head: () => pageHead("Terra Intelligence GIS Studio | TerraLedger AI", "Dedicated geospatial workspace with multi-spectral satellite layers, timeline analysis and data-quality indicators.", "/workspace/terra-intelligence"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route$3 = createFileRoute("/api/public/schemes-sync")({ server: { handlers: { POST: async () => {
	return new Response("Sync not configured on this deployment", { status: 503 });
} } } });
function EmptyState({ icon: Icon = FolderOpen, title = "No records found", description = "There are no active records matching your filter criteria.", actionLabel, onAction, extra }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-[#cfdac7] my-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-12 h-12 rounded-full bg-[#f4f7f0] flex items-center justify-center mb-4 text-[#5c7c46]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 24 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-semibold text-[#193b2a]",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-[#72816f] mt-1.5 max-w-md",
				children: description
			}),
			actionLabel && onAction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: onAction,
					className: "text-xs bg-[#245b45] text-white hover:bg-[#1a4333]",
					children: actionLabel
				})
			}),
			extra && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: extra
			})
		]
	});
}
function AssessmentDetailPage() {
	const { assessmentId } = useParams({ from: "/workspace/assessments/$assessmentId" });
	const [assessment, setAssessment] = (0, import_react.useState)(null);
	const [current, setCurrent] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		api.assessments.getById(assessmentId).then((res) => {
			setCurrent(res);
			setLoading(false);
		});
	}, [assessmentId]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading MRV audit assessment details..." });
	if (!current) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Assessment Not Found",
		description: `Assessment record ${assessmentId} could not be retrieved.`,
		actionLabel: "Back to Assessments",
		onAction: () => window.history.back()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/workspace/assessments",
				className: "inline-flex items-center gap-1.5 text-xs text-[#5c7c46] hover:text-[#193b2a] font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 13 }), "Back to MRV Assessments"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				badge: `Assessment Record: ${current.assessmentNumber}`,
				icon: FileBadge,
				title: `Audit Report: Parcel ${current.parcelCode}`,
				description: `Evaluated for ${current.projectTitle} · ${current.cropSeason}`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `text-xs px-3 py-1.5 rounded-lg font-mono font-medium ${current.status === "READY_FOR_VERIFICATION" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-800 border border-amber-300"}`,
						children: ["Status: ", current.status.replace(/_/g, " ")]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-[#dfe6d9] rounded-xl p-6 shadow-xs space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#edf2e8]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono uppercase text-[#788e7c]",
								children: "Overall Audit Completeness"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-3xl font-mono font-bold text-[#193b2a] mt-1",
								children: [current.overallScorePercent, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-[#72816f] mt-0.5",
								children: ["Evaluated at: ", current.evaluatedAt]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-left sm:text-right",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono uppercase text-[#788e7c]",
									children: "Lead Accredited Auditor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold text-[#193b2a] mt-1",
									children: current.leadAuditor
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-[#5c7c46] mt-0.5",
									children: "ISO 14065 / Verra VVB Accredited"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-mono uppercase text-[#69816a] mb-2 font-bold",
						children: "Headline Audit Findings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#213c2b] bg-[#f8faf6] p-4 rounded-xl border border-[#e2ebd9] leading-relaxed",
						children: current.headlineFindings
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-mono uppercase text-[#69816a] mb-2 font-bold",
							children: "Auditor Recommendations"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: current.recommendations.map((rec, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2 text-xs text-[#213c2b] p-2.5 rounded-lg bg-[#fffdf5] border border-[#f5ecd0]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
									size: 14,
									className: "text-amber-600 shrink-0 mt-0.5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rec })]
							}, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-4 border-t border-[#edf2e8] flex justify-end gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/workspace/dossier",
							className: "rounded-lg bg-[#245b45] text-white px-4 py-2 text-xs font-semibold hover:bg-[#1a4333]",
							children: "Review Project Dossier"
						})
					})
				]
			})
		]
	});
}
var Route$2 = createFileRoute("/workspace/assessments/$assessmentId")({
	head: () => pageHead("Assessment Findings | TerraLedger AI", "Quantitative compliance evaluation and accredited auditor findings.", "/workspace/assessments/$assessmentId"),
	component: AssessmentDetailPage
});
function FieldDetailPage() {
	const { fieldId } = useParams({ from: "/workspace/fields/$fieldId" });
	const [fieldData, setFieldData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		api.fields.getById(fieldId).then((res) => {
			setFieldData(res);
			setLoading(false);
		});
	}, [fieldId]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading parcel cadastral details..." });
	if (!fieldData) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Field Parcel Not Found",
		description: `The parcel reference ${fieldId} was not found in the cadastral registry.`,
		actionLabel: "Back to Fields",
		onAction: () => window.history.back()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/workspace/fields",
				className: "inline-flex items-center gap-1.5 text-xs text-[#5c7c46] hover:text-[#193b2a] font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 13 }), "Back to Field Parcels"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				badge: `Cadastral Code: ${fieldData.code}`,
				icon: MapPin,
				title: fieldData.name,
				description: `Farmer partner: ${fieldData.farmerName} (${fieldData.farmerNameLocal}) · ${fieldData.district}, Punjab`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `text-xs px-3 py-1.5 rounded-lg font-mono font-medium ${fieldData.activeStatus === "Audit Approved" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-sky-100 text-sky-800 border border-sky-300"}`,
						children: ["Status: ", fieldData.activeStatus]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "Parcel Area"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "block text-2xl font-mono text-[#193b2a] mt-1",
								children: [fieldData.areaHa, " ha"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block",
								children: [fieldData.areaAcres, " acres"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "Mitigation Target"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "block text-2xl font-mono text-[#245b45] mt-1",
								children: [fieldData.targetEmissionReductionTonnes, " tCO2e"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block",
								children: "Estimated annual reduction"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "AWD Water Tubes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "block text-2xl font-mono text-[#193b2a] mt-1",
								children: fieldData.awdTubeCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block",
								children: "Perforated monitoring pipes"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "Current Growth Stage"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "block text-lg font-semibold text-[#193b2a] mt-1",
								children: fieldData.currentCropStage
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block",
								children: fieldData.crop
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-2 bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-xl text-[#193b2a]",
							children: "Boundary Geometry & Coordinates"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-[#72816f]",
							children: [
								"Cadastral boundary polygon registered with Punjab Land Records Agency. Centroid coordinates: ",
								fieldData.coordinates.lat.toFixed(4),
								"°N,",
								" ",
								fieldData.coordinates.lng.toFixed(4),
								"°E."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-[#f8faf6] border border-[#e2ebd9] rounded-lg p-3 font-mono text-xs text-[#213c2b] space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase text-[#69816a] mb-2 font-bold",
								children: "Polygon Vertices (WGS 84):"
							}), fieldData.boundaryPolygon.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Vertex #",
									i + 1,
									":"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[#245b45]",
									children: [
										"[",
										v[0]?.toFixed(5),
										", ",
										v[1]?.toFixed(5),
										"]"
									]
								})]
							}, i))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-3 flex gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/workspace/terra-intelligence",
								className: "inline-flex items-center gap-1.5 rounded-lg bg-[#245b45] text-white px-4 py-2 text-xs font-semibold hover:bg-[#1a4333]",
								children: "Open in Terra Intelligence Map"
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs space-y-3 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-lg text-[#193b2a]",
							children: "Agronomic Attributes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono text-[#788e7c] block uppercase",
							children: "FPO Affiliation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-[#193b2a]",
							children: fieldData.fpoName
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono text-[#788e7c] block uppercase",
							children: "Soil Classification"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-[#193b2a]",
							children: fieldData.soilType
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono text-[#788e7c] block uppercase",
							children: "Irrigation Source"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-[#193b2a]",
							children: fieldData.irrigationSource
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono text-[#788e7c] block uppercase",
							children: "Seeding / Sowing Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-[#193b2a]",
							children: fieldData.seedingDate
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono text-[#788e7c] block uppercase",
							children: "Assigned Field Officer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-[#193b2a]",
							children: fieldData.assignedFieldOfficer
						})] })
					]
				})]
			})
		]
	});
}
var Route$1 = createFileRoute("/workspace/fields/$fieldId")({
	head: () => pageHead("Field Parcel Detail | TerraLedger AI", "Cadastral parcel coordinates, soil telemetry and water management protocols.", "/workspace/fields/$fieldId"),
	component: FieldDetailPage
});
function ProjectDetailPage() {
	const { projectId } = useParams({ from: "/workspace/projects/$projectId" });
	const [project, setProject] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		api.projects.getById(projectId).then((res) => {
			setProject(res);
			setLoading(false);
		});
	}, [projectId]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading project specifications..." });
	if (!project) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Project Not Found",
		description: `The project reference ${projectId} could not be located in the registry.`,
		actionLabel: "Back to Projects",
		onAction: () => window.history.back()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/workspace/projects",
				className: "inline-flex items-center gap-1.5 text-xs text-[#5c7c46] hover:text-[#193b2a] font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 13 }), "Back to Project Registry"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				badge: project.registryId,
				icon: FolderGit2,
				title: project.title,
				description: project.description,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `text-xs px-3 py-1.5 rounded-lg font-mono font-medium ${project.assessmentStatus === "READY_FOR_VERIFICATION" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-800 border border-amber-300"}`,
						children: ["Stage: ", project.pipelineStage]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "Total Area"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "block text-2xl font-mono text-[#193b2a] mt-1",
								children: [project.totalHectares.toLocaleString(), " ha"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block",
								children: [project.enrolledParcels, " enrolled parcels"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "Annual Mitigation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "block text-2xl font-mono text-[#245b45] mt-1",
								children: [project.estimatedTonsCo2ePerYear.toLocaleString(), " tCO2e"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block",
								children: "Estimated GHG reduction"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "Farmer Collective"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "block text-2xl font-mono text-[#193b2a] mt-1",
								children: project.farmerCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block",
								children: "Aggregated smallholders"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-[#dfe6d9] rounded-xl p-4 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-mono text-[#69816a] uppercase",
								children: "Readiness Score"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "block text-2xl font-mono text-[#193b2a] mt-1",
								children: [project.readinessScorePercent, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#72816f] mt-0.5 block",
								children: "Evidence corroborated"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-2 bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-xl text-[#193b2a]",
							children: "Methodology & Key Interventions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#526a57] leading-relaxed",
							children: "Intervention focuses on transitioning traditional flooded basin rice paddy to dry direct-seeding with tractor seed drills, combined with alternate wetting and drying (AWD) water management."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-mono uppercase text-[#69816a]",
								children: "Verification Highlights"
							}), project.highlights.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2 text-xs text-[#213c2b]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									size: 14,
									className: "text-[#347454] shrink-0 mt-0.5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h })]
							}, i))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-4 border-t border-[#edf2e8]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-mono uppercase text-[#69816a] mb-2",
								children: "Evidence Depth Breakdown"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-3 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-[#f8faf6] rounded-lg border border-[#e2ebd9]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg font-mono font-bold text-[#193b2a]",
											children: project.evidenceDepth.satellitePasses
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[10px] text-[#72816f]",
											children: "Sentinel-2 Passes"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-[#f8faf6] rounded-lg border border-[#e2ebd9]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg font-mono font-bold text-[#193b2a]",
											children: project.evidenceDepth.groundPhotos
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[10px] text-[#72816f]",
											children: "Geotagged Photos"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-[#f8faf6] rounded-lg border border-[#e2ebd9]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg font-mono font-bold text-[#193b2a]",
											children: project.evidenceDepth.waterLogs
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-[10px] text-[#72816f]",
											children: "Piezometer AWD Logs"
										})]
									})
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white border border-[#dfe6d9] rounded-xl p-5 shadow-xs space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg text-[#193b2a]",
						children: "Project Governance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-[#788e7c] block uppercase",
								children: "Project Developer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[#193b2a]",
								children: project.developer
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-[#788e7c] block uppercase",
								children: "Standard & Methodology"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[#193b2a]",
								children: project.complianceStandard
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-[#788e7c] block uppercase",
								children: "Jurisdiction & Location"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[#193b2a]",
								children: project.location
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono text-[#788e7c] block uppercase",
								children: "Crediting Vintage"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[#193b2a]",
								children: project.vintage
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-3 border-t border-[#edf2e8]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/workspace/dossier",
									className: "w-full inline-flex items-center justify-center rounded-lg bg-[#245b45] text-white py-2 text-xs font-semibold hover:bg-[#1a4333]",
									children: "Inspect Full Dossier"
								})
							})
						]
					})]
				})]
			})
		]
	});
}
var Route = createFileRoute("/workspace/projects/$projectId")({
	head: () => pageHead("Project Dossier Detail | TerraLedger AI", "Detailed agricultural carbon project specifications, evidence records and audit readiness.", "/workspace/projects/$projectId"),
	component: ProjectDetailPage
});
var IndexRoute = Route$35.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$36
});
var AboutRoute = Route$34.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$36
});
var AgriculturalMrvRoute = Route$33.update({
	id: "/agricultural-mrv",
	path: "/agricultural-mrv",
	getParentRoute: () => Route$36
});
var AuthRoute = Route$32.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$36
});
var BusinessImpactRoute = Route$31.update({
	id: "/business-impact",
	path: "/business-impact",
	getParentRoute: () => Route$36
});
var CalculatorRoute = Route$30.update({
	id: "/calculator",
	path: "/calculator",
	getParentRoute: () => Route$36
});
var CarbonCreditsRoute = Route$29.update({
	id: "/carbon-credits",
	path: "/carbon-credits",
	getParentRoute: () => Route$36
});
var ContactRoute = Route$37.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$36
});
var DashboardRoute = Route$28.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$36
});
var FieldProgramsRoute = Route$27.update({
	id: "/field-programs",
	path: "/field-programs",
	getParentRoute: () => Route$36
});
var HowItWorksRoute = Route$26.update({
	id: "/how-it-works",
	path: "/how-it-works",
	getParentRoute: () => Route$36
});
var MarketplaceRoute = Route$25.update({
	id: "/marketplace",
	path: "/marketplace",
	getParentRoute: () => Route$36
});
var MethodologyRoute = Route$24.update({
	id: "/methodology",
	path: "/methodology",
	getParentRoute: () => Route$36
});
var PartnersRoute = Route$23.update({
	id: "/partners",
	path: "/partners",
	getParentRoute: () => Route$36
});
var PassportRoute = Route$22.update({
	id: "/passport",
	path: "/passport",
	getParentRoute: () => Route$36
});
var PlatformRoute = Route$21.update({
	id: "/platform",
	path: "/platform",
	getParentRoute: () => Route$36
});
var PrivacyRoute = Route$20.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$36
});
var ResearchRoute = Route$19.update({
	id: "/research",
	path: "/research",
	getParentRoute: () => Route$36
});
var SolutionsRoute = Route$18.update({
	id: "/solutions",
	path: "/solutions",
	getParentRoute: () => Route$36
});
var TermsRoute = Route$17.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$36
});
var WorkspaceRouteRoute = Route$16.update({
	id: "/workspace",
	path: "/workspace",
	getParentRoute: () => Route$36
});
var WorkspaceIndexRoute = Route$15.update({
	id: "/",
	path: "/",
	getParentRoute: () => WorkspaceRouteRoute
});
var WorkspaceAssessmentsRoute = Route$14.update({
	id: "/assessments",
	path: "/assessments",
	getParentRoute: () => WorkspaceRouteRoute
});
var WorkspaceCommandRoute = Route$13.update({
	id: "/command",
	path: "/command",
	getParentRoute: () => WorkspaceRouteRoute
});
var WorkspaceDossierRoute = Route$12.update({
	id: "/dossier",
	path: "/dossier",
	getParentRoute: () => WorkspaceRouteRoute
});
var WorkspaceEvidenceRoute = Route$11.update({
	id: "/evidence",
	path: "/evidence",
	getParentRoute: () => WorkspaceRouteRoute
});
var WorkspaceFarmersRoute = Route$10.update({
	id: "/farmers",
	path: "/farmers",
	getParentRoute: () => WorkspaceRouteRoute
});
var WorkspaceFieldsRoute = Route$9.update({
	id: "/fields",
	path: "/fields",
	getParentRoute: () => WorkspaceRouteRoute
});
var WorkspaceProjectsRoute = Route$8.update({
	id: "/projects",
	path: "/projects",
	getParentRoute: () => WorkspaceRouteRoute
});
var WorkspaceReportsRoute = Route$7.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => WorkspaceRouteRoute
});
var WorkspaceReviewRoute = Route$6.update({
	id: "/review",
	path: "/review",
	getParentRoute: () => WorkspaceRouteRoute
});
var WorkspaceSatelliteRoute = Route$5.update({
	id: "/satellite",
	path: "/satellite",
	getParentRoute: () => WorkspaceRouteRoute
});
var WorkspaceTerraIntelligenceRoute = Route$4.update({
	id: "/terra-intelligence",
	path: "/terra-intelligence",
	getParentRoute: () => WorkspaceRouteRoute
});
var ApiPublicSchemesSyncRoute = Route$3.update({
	id: "/api/public/schemes-sync",
	path: "/api/public/schemes-sync",
	getParentRoute: () => Route$36
});
var WorkspaceAssessmentsAssessmentIdRoute = Route$2.update({
	id: "/$assessmentId",
	path: "/$assessmentId",
	getParentRoute: () => WorkspaceAssessmentsRoute
});
var WorkspaceFieldsFieldIdRoute = Route$1.update({
	id: "/$fieldId",
	path: "/$fieldId",
	getParentRoute: () => WorkspaceFieldsRoute
});
var WorkspaceProjectsProjectIdRoute = Route.update({
	id: "/$projectId",
	path: "/$projectId",
	getParentRoute: () => WorkspaceProjectsRoute
});
var WorkspaceAssessmentsRouteChildren = { WorkspaceAssessmentsAssessmentIdRoute };
var WorkspaceAssessmentsRouteWithChildren = WorkspaceAssessmentsRoute._addFileChildren(WorkspaceAssessmentsRouteChildren);
var WorkspaceFieldsRouteChildren = { WorkspaceFieldsFieldIdRoute };
var WorkspaceFieldsRouteWithChildren = WorkspaceFieldsRoute._addFileChildren(WorkspaceFieldsRouteChildren);
var WorkspaceProjectsRouteChildren = { WorkspaceProjectsProjectIdRoute };
var WorkspaceRouteRouteChildren = {
	WorkspaceAssessmentsRoute: WorkspaceAssessmentsRouteWithChildren,
	WorkspaceCommandRoute,
	WorkspaceDossierRoute,
	WorkspaceEvidenceRoute,
	WorkspaceFarmersRoute,
	WorkspaceFieldsRoute: WorkspaceFieldsRouteWithChildren,
	WorkspaceProjectsRoute: WorkspaceProjectsRoute._addFileChildren(WorkspaceProjectsRouteChildren),
	WorkspaceReportsRoute,
	WorkspaceReviewRoute,
	WorkspaceSatelliteRoute,
	WorkspaceTerraIntelligenceRoute,
	WorkspaceIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	WorkspaceRouteRoute: WorkspaceRouteRoute._addFileChildren(WorkspaceRouteRouteChildren),
	AboutRoute,
	AgriculturalMrvRoute,
	AuthRoute,
	BusinessImpactRoute,
	CalculatorRoute,
	CarbonCreditsRoute,
	ContactRoute,
	DashboardRoute,
	FieldProgramsRoute,
	HowItWorksRoute,
	MarketplaceRoute,
	MethodologyRoute,
	PartnersRoute,
	PassportRoute,
	PlatformRoute,
	PrivacyRoute,
	ResearchRoute,
	SolutionsRoute,
	TermsRoute,
	ApiPublicSchemesSyncRoute
};
var routeTree = Route$36._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
