globalThis.__nitro_main__ = import.meta.url;
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx+unenv.mjs";
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.svg": {
		"type": "image/svg+xml",
		"etag": "\"13a-w1WkAJh6qi7DGiVfVvcPFcYnFSI\"",
		"mtime": "2026-10-31T06:51:23.606Z",
		"size": 314,
		"path": "../public/favicon.svg"
	},
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"233d-LHmss4VJbTDJvnKx8ly7bsTFnQg\"",
		"mtime": "2026-10-31T06:51:23.597Z",
		"size": 9021,
		"path": "../public/favicon.png"
	},
	"/sitemap.xml": {
		"type": "application/xml",
		"etag": "\"4c3-6SLHYw45xO6rhCDisw7QSrTJoE8\"",
		"mtime": "2026-10-31T07:13:12.780Z",
		"size": 1219,
		"path": "../public/sitemap.xml"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"d5-DUh+jt6tKS1YZTOMBb3kcA5I1V0\"",
		"mtime": "2026-10-31T06:51:23.614Z",
		"size": 213,
		"path": "../public/robots.txt"
	},
	"/social-card.svg": {
		"type": "image/svg+xml",
		"etag": "\"511-BM/Rqyv0qxeC1k7xRvVDq7LUMYc\"",
		"mtime": "2026-10-31T06:51:23.644Z",
		"size": 1297,
		"path": "../public/social-card.svg"
	},
	"/earth/carbon-methane-field.webp": {
		"type": "image/webp",
		"etag": "\"2f942-slTPgXA5M54sCvTV3pKjZlZEyrw\"",
		"mtime": "2026-10-31T06:51:23.708Z",
		"size": 194882,
		"path": "../public/earth/carbon-methane-field.webp"
	},
	"/earth/carbon-season-landscape.webp": {
		"type": "image/webp",
		"etag": "\"4dbc0-9+2be7CJ4VD8XsT6WDMxU14/2Kw\"",
		"mtime": "2026-10-31T06:51:23.735Z",
		"size": 318400,
		"path": "../public/earth/carbon-season-landscape.webp"
	},
	"/social-card.jpg": {
		"type": "image/jpeg",
		"etag": "\"55c3e-7M+tHqluwTIFNobFw4Un0vz5Yhk\"",
		"mtime": "2026-10-31T06:51:23.634Z",
		"size": 351294,
		"path": "../public/social-card.jpg"
	},
	"/earth/carbon-season-irrigated.webp": {
		"type": "image/webp",
		"etag": "\"54668-BrXUP9U6hdB3qyMdKGj0C6RRlac\"",
		"mtime": "2026-10-31T06:51:23.722Z",
		"size": 345704,
		"path": "../public/earth/carbon-season-irrigated.webp"
	},
	"/earth/carbon-season-wet.webp": {
		"type": "image/webp",
		"etag": "\"52686-THTCkj+kqezbtUZI29nRBq4ywcM\"",
		"mtime": "2026-10-31T06:51:23.748Z",
		"size": 337542,
		"path": "../public/earth/carbon-season-wet.webp"
	},
	"/earth/carbon-stage-design.webp": {
		"type": "image/webp",
		"etag": "\"254b4-vsZG9Ey+qMM2il3Wgd6q8x4CVZY\"",
		"mtime": "2026-10-31T06:51:23.758Z",
		"size": 152756,
		"path": "../public/earth/carbon-stage-design.webp"
	},
	"/earth/carbon-stage-quantify.webp": {
		"type": "image/webp",
		"etag": "\"2060e-mUvu8c9Ceru35Et6seSZ12Q2Zas\"",
		"mtime": "2026-10-31T06:51:23.788Z",
		"size": 132622,
		"path": "../public/earth/carbon-stage-quantify.webp"
	},
	"/earth/carbon-stage-enrol.webp": {
		"type": "image/webp",
		"etag": "\"2e1d4-SkFlzRiw+jUN77BSOEhDhBnLJd4\"",
		"mtime": "2026-10-31T06:51:23.767Z",
		"size": 188884,
		"path": "../public/earth/carbon-stage-enrol.webp"
	},
	"/earth/carbon-stage-review.webp": {
		"type": "image/webp",
		"etag": "\"269f8-CTnuu+KE1mlMhfffDE47RZlXR3U\"",
		"mtime": "2026-10-31T06:51:23.796Z",
		"size": 158200,
		"path": "../public/earth/carbon-stage-review.webp"
	},
	"/earth/carbon-stage-monitor.webp": {
		"type": "image/webp",
		"etag": "\"3c658-BQNCNTPskvOj9QV4GfVGTrpEe0M\"",
		"mtime": "2026-10-31T06:51:23.777Z",
		"size": 247384,
		"path": "../public/earth/carbon-stage-monitor.webp"
	},
	"/assets/about-DHhgPuFJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-ikRkvE5TLGjKnGBr/lGSsAf2070\"",
		"mtime": "2026-10-31T07:13:18.665Z",
		"size": 144,
		"path": "../public/assets/about-DHhgPuFJ.js"
	},
	"/assets/aerial-field-pattern-Bx9PZBUt.webp": {
		"type": "image/webp",
		"etag": "\"27aae-epsxV87guGbYEbZFdPIskNzgmJw\"",
		"mtime": "2026-10-31T07:13:18.708Z",
		"size": 162478,
		"path": "../public/assets/aerial-field-pattern-Bx9PZBUt.webp"
	},
	"/earth/carbon-stage-share.webp": {
		"type": "image/webp",
		"etag": "\"227be-pCaVGvLQYtso6ua8yFPgIXwgysY\"",
		"mtime": "2026-10-31T06:51:23.806Z",
		"size": 141246,
		"path": "../public/earth/carbon-stage-share.webp"
	},
	"/assets/agricultural-mrv-C9vaVDjR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f-IHQ0GhivIVbCrzKV+iOO1RxFqYc\"",
		"mtime": "2026-10-31T07:13:18.667Z",
		"size": 79,
		"path": "../public/assets/agricultural-mrv-C9vaVDjR.js"
	},
	"/assets/arrow-left-BQqmWEjA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-iwugUKUlN//i8T6qI0xaKTY8ks4\"",
		"mtime": "2026-10-31T07:13:18.667Z",
		"size": 165,
		"path": "../public/assets/arrow-left-BQqmWEjA.js"
	},
	"/assets/arrow-right-BdsSPC2r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-bKhBshVtH0hR2OishuxCLoOQG5Y\"",
		"mtime": "2026-10-31T07:13:18.668Z",
		"size": 165,
		"path": "../public/assets/arrow-right-BdsSPC2r.js"
	},
	"/earth/platform-field-satellite.webp": {
		"type": "image/webp",
		"etag": "\"50a48-2u6eXho1qdqg8n9TimDTfJ+pDJk\"",
		"mtime": "2026-10-31T06:51:23.818Z",
		"size": 330312,
		"path": "../public/earth/platform-field-satellite.webp"
	},
	"/assets/agricultural-landscape-MMouSJlG.jpg": {
		"type": "image/jpeg",
		"etag": "\"55c3e-7M+tHqluwTIFNobFw4Un0vz5Yhk\"",
		"mtime": "2026-10-31T07:13:18.708Z",
		"size": 351294,
		"path": "../public/assets/agricultural-landscape-MMouSJlG.jpg"
	},
	"/assets/awd-water-tube-generated-hN4jPQTS.webp": {
		"type": "image/webp",
		"etag": "\"4ad78-V1Pl7ksAeUbmoCXENHqoiWxflIA\"",
		"mtime": "2026-10-31T07:13:18.710Z",
		"size": 306552,
		"path": "../public/assets/awd-water-tube-generated-hN4jPQTS.webp"
	},
	"/assets/business-impact-BHOKEOVM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f-ImlaX1/1iABkKJheXodN5VOHVPo\"",
		"mtime": "2026-10-31T07:13:18.669Z",
		"size": 79,
		"path": "../public/assets/business-impact-BHOKEOVM.js"
	},
	"/assets/calculator-DAnx6IcF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"733f-Hh0q5Zr4obAaKe//6ED30/CAAn8\"",
		"mtime": "2026-10-31T07:13:18.669Z",
		"size": 29503,
		"path": "../public/assets/calculator-DAnx6IcF.js"
	},
	"/assets/carbon-credits-_fyeXTrz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e8c-HVDVAXfply+9oH1oqbk25qts50Y\"",
		"mtime": "2026-10-31T07:13:18.670Z",
		"size": 24204,
		"path": "../public/assets/carbon-credits-_fyeXTrz.js"
	},
	"/assets/carbon-baseline-ekzngUZk.webp": {
		"type": "image/webp",
		"etag": "\"4d654-OHiSTONLIsk2kqr3bCv8T7H5xDE\"",
		"mtime": "2026-10-31T07:13:18.711Z",
		"size": 317012,
		"path": "../public/assets/carbon-baseline-ekzngUZk.webp"
	},
	"/assets/carbon-monitor-nscik3Cw.webp": {
		"type": "image/webp",
		"etag": "\"2d29e-/326ay8NYXE2EvgR4U0P4FEvwU8\"",
		"mtime": "2026-10-31T07:13:18.711Z",
		"size": 184990,
		"path": "../public/assets/carbon-monitor-nscik3Cw.webp"
	},
	"/assets/carbon-practice-DW8SepED.webp": {
		"type": "image/webp",
		"etag": "\"3676e-br1a3hJ3EuWvpA2n4dFvWcrow6k\"",
		"mtime": "2026-10-31T07:13:18.712Z",
		"size": 223086,
		"path": "../public/assets/carbon-practice-DW8SepED.webp"
	},
	"/assets/carbon-quantify-CuPrS4D1.webp": {
		"type": "image/webp",
		"etag": "\"35ca0-GVUIghhwWtjOtC7hjvKqqIEx28I\"",
		"mtime": "2026-10-31T07:13:18.712Z",
		"size": 220320,
		"path": "../public/assets/carbon-quantify-CuPrS4D1.webp"
	},
	"/assets/carbon-registry-C06mq8YN.webp": {
		"type": "image/webp",
		"etag": "\"1ece8-Jirbi6ZXZP9nd04yjRoq/A4p9Kw\"",
		"mtime": "2026-10-31T07:13:18.716Z",
		"size": 126184,
		"path": "../public/assets/carbon-registry-C06mq8YN.webp"
	},
	"/assets/carbon-sampling-BdxiQSED.webp": {
		"type": "image/webp",
		"etag": "\"3811c-Y+tydWI+IT/xhFmf9zQvpW5TkhA\"",
		"mtime": "2026-10-31T07:13:18.717Z",
		"size": 229660,
		"path": "../public/assets/carbon-sampling-BdxiQSED.webp"
	},
	"/assets/chevron-down-Cd5D8bwE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"80-1HclzIq5XKAtAJcd8rvuWUvxb9Q\"",
		"mtime": "2026-10-31T07:13:18.671Z",
		"size": 128,
		"path": "../public/assets/chevron-down-Cd5D8bwE.js"
	},
	"/assets/circle-check-D9ZS-Wn6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2-Z7NBSQyYjbsP+a4qXL4dAZn0JbI\"",
		"mtime": "2026-10-31T07:13:18.672Z",
		"size": 178,
		"path": "../public/assets/circle-check-D9ZS-Wn6.js"
	},
	"/assets/clock-CUBxsiBf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9-ZwML2qSCxuLzL7wc3juiEDyocLo\"",
		"mtime": "2026-10-31T07:13:18.672Z",
		"size": 169,
		"path": "../public/assets/clock-CUBxsiBf.js"
	},
	"/assets/command-BlgnsE_m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"50-XqPJToQYwXhAWI1HIuFfb3sgsxg\"",
		"mtime": "2026-10-31T07:13:18.673Z",
		"size": 80,
		"path": "../public/assets/command-BlgnsE_m.js"
	},
	"/assets/command-centre-GbBT_CmY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4502-woR3VUcsbBbyU1Xtk06w6YUJb8M\"",
		"mtime": "2026-10-31T07:13:18.674Z",
		"size": 17666,
		"path": "../public/assets/command-centre-GbBT_CmY.js"
	},
	"/assets/carbon-verify-BsW0d3A6.webp": {
		"type": "image/webp",
		"etag": "\"323e4-94zAwb7LZHe4dJT1apINqYZXEBY\"",
		"mtime": "2026-10-31T07:13:18.718Z",
		"size": 205796,
		"path": "../public/assets/carbon-verify-BsW0d3A6.webp"
	},
	"/assets/contact-ZwMoqBcE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f9-KG4CWj7cwerSDdBWFldU1aJMiz4\"",
		"mtime": "2026-10-31T07:13:18.674Z",
		"size": 249,
		"path": "../public/assets/contact-ZwMoqBcE.js"
	},
	"/assets/contact-_otySe0p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17f4-8pblEQe4m8wRyESDLPp0UaXVM74\"",
		"mtime": "2026-10-31T07:13:18.675Z",
		"size": 6132,
		"path": "../public/assets/contact-_otySe0p.js"
	},
	"/assets/content-pages-5eggvxx-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bb67-uCUEzBto/wGtOdgBq5TX4b66sl0\"",
		"mtime": "2026-10-31T07:13:18.675Z",
		"size": 113511,
		"path": "../public/assets/content-pages-5eggvxx-.js"
	},
	"/assets/createLucideIcon-99O-W4Ia.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"83f0-QAdsLm2QpoAL6YrIoBmyMI8eTKs\"",
		"mtime": "2026-10-31T07:13:18.676Z",
		"size": 33776,
		"path": "../public/assets/createLucideIcon-99O-W4Ia.js"
	},
	"/assets/contact-background-Cvo6SopF.webp": {
		"type": "image/webp",
		"etag": "\"30c10-vSmZoaTQ36QPedNrYxLcBahSsMA\"",
		"mtime": "2026-10-31T07:13:18.719Z",
		"size": 199696,
		"path": "../public/assets/contact-background-Cvo6SopF.webp"
	},
	"/assets/dash-banner-CRTdL3BS.jpg": {
		"type": "image/jpeg",
		"etag": "\"17b37-Q05QOvKAtYEjMGa1WvO0htbq15g\"",
		"mtime": "2026-10-31T07:13:18.721Z",
		"size": 97079,
		"path": "../public/assets/dash-banner-CRTdL3BS.jpg"
	},
	"/assets/crop-assessment-jINmz3hW.webp": {
		"type": "image/webp",
		"etag": "\"49912-k9i6MmCzwtNcOTkcAPp1osJg+Tw\"",
		"mtime": "2026-10-31T07:13:18.720Z",
		"size": 301330,
		"path": "../public/assets/crop-assessment-jINmz3hW.webp"
	},
	"/assets/detail-sections-ZPfKhLDp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"91db-KCqnbpBEzqZvd8dv39Lm/WpMWDI\"",
		"mtime": "2026-10-31T07:13:18.678Z",
		"size": 37339,
		"path": "../public/assets/detail-sections-ZPfKhLDp.js"
	},
	"/assets/dossier-CRGfTQcN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"51-bKNstUaDmzbDg5E0y8ZKRN79sqQ\"",
		"mtime": "2026-10-31T07:13:18.678Z",
		"size": 81,
		"path": "../public/assets/dossier-CRGfTQcN.js"
	},
	"/assets/dsr-direct-seeding-DpE3HZ_x.webp": {
		"type": "image/webp",
		"etag": "\"4d060-ZrdEvc7FiDavT1m9SHUX2CliA4I\"",
		"mtime": "2026-10-31T07:13:18.722Z",
		"size": 315488,
		"path": "../public/assets/dsr-direct-seeding-DpE3HZ_x.webp"
	},
	"/assets/dsr-seed-drill-generated-CzDqSEEp.webp": {
		"type": "image/webp",
		"etag": "\"5146e-xiMr+Rx6tLZqIHZ9gHleRqyOD4o\"",
		"mtime": "2026-10-31T07:13:18.722Z",
		"size": 332910,
		"path": "../public/assets/dsr-seed-drill-generated-CzDqSEEp.webp"
	},
	"/assets/dsr-transplanting-D8rtf9y1.webp": {
		"type": "image/webp",
		"etag": "\"42944-R9OyEPfJ+060MHKxc8vMVJB4qw4\"",
		"mtime": "2026-10-31T07:13:18.724Z",
		"size": 272708,
		"path": "../public/assets/dsr-transplanting-D8rtf9y1.webp"
	},
	"/assets/earth-2gs1wQmo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"189-2+00ZVWaedVtZdrfNfoycHXwJGg\"",
		"mtime": "2026-10-31T07:13:18.678Z",
		"size": 393,
		"path": "../public/assets/earth-2gs1wQmo.js"
	},
	"/assets/enquiry-BxTfKTzC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"500-YwOvdo2Ac7jtmoSPvk73geFpy/E\"",
		"mtime": "2026-10-31T07:13:18.679Z",
		"size": 1280,
		"path": "../public/assets/enquiry-BxTfKTzC.js"
	},
	"/assets/evidence-BAgIaIwH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"53-jvIaRa8YF71Sk3gn80wwfaRKB5c\"",
		"mtime": "2026-10-31T07:13:18.680Z",
		"size": 83,
		"path": "../public/assets/evidence-BAgIaIwH.js"
	},
	"/assets/evidence-explorer-BnjFkmoj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"558c-avsrYNSrPu+f4IrICaauHWXzrH0\"",
		"mtime": "2026-10-31T07:13:18.680Z",
		"size": 21900,
		"path": "../public/assets/evidence-explorer-BnjFkmoj.js"
	},
	"/assets/evidence-trail-BfhDa-m-.webp": {
		"type": "image/webp",
		"etag": "\"294f2-UuThGIdJpAM9dFklZyLpUzPDq+I\"",
		"mtime": "2026-10-31T07:13:18.724Z",
		"size": 169202,
		"path": "../public/assets/evidence-trail-BfhDa-m-.webp"
	},
	"/assets/farmer-walking-field-_NpL62a4.webp": {
		"type": "image/webp",
		"etag": "\"1ff5c-fs8fFt30grrOFZl5p6T/eaoed58\"",
		"mtime": "2026-10-31T07:13:18.726Z",
		"size": 130908,
		"path": "../public/assets/farmer-walking-field-_NpL62a4.webp"
	},
	"/assets/farmer-kneeling-rice-BEPDvxZt.webp": {
		"type": "image/webp",
		"etag": "\"382b0-rj7tUgA719erMA3gTjFtHkY+zz4\"",
		"mtime": "2026-10-31T07:13:18.725Z",
		"size": 230064,
		"path": "../public/assets/farmer-kneeling-rice-BEPDvxZt.webp"
	},
	"/assets/field-programs-Cy3Lx9MS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95-b1RKI5Cj7A9TwSxyyPN6nuD8klQ\"",
		"mtime": "2026-10-31T07:13:18.681Z",
		"size": 149,
		"path": "../public/assets/field-programs-Cy3Lx9MS.js"
	},
	"/assets/file-text-Csp0-Ldz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29c-E/2EJZkXfdSg/7kcAzCwt0rRu3Y\"",
		"mtime": "2026-10-31T07:13:18.683Z",
		"size": 668,
		"path": "../public/assets/file-text-Csp0-Ldz.js"
	},
	"/assets/field-perspective-DLL8_P8Q.jpg": {
		"type": "image/jpeg",
		"etag": "\"4c5e6-PDx5Ejz3dz4T2kYRGlRz/E1iMvc\"",
		"mtime": "2026-10-31T07:13:18.726Z",
		"size": 312806,
		"path": "../public/assets/field-perspective-DLL8_P8Q.jpg"
	},
	"/assets/how-it-works-h9sLKpr8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95-s5jmM6tAJouic0iPb0zoKE2MVDk\"",
		"mtime": "2026-10-31T07:13:18.685Z",
		"size": 149,
		"path": "../public/assets/how-it-works-h9sLKpr8.js"
	},
	"/assets/haybales-team-Dbp0_ksj.webp": {
		"type": "image/webp",
		"etag": "\"1d9fc-FZBNgM1eL8fzpy6bcPfekDMilgI\"",
		"mtime": "2026-10-31T07:13:18.727Z",
		"size": 121340,
		"path": "../public/assets/haybales-team-Dbp0_ksj.webp"
	},
	"/assets/info-5oYmoqj8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"198-Na7Idd/qQXjn1KEXsAP1toSdB9g\"",
		"mtime": "2026-10-31T07:13:18.686Z",
		"size": 408,
		"path": "../public/assets/info-5oYmoqj8.js"
	},
	"/assets/index-CSUdrdfN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"70f75-KT7VD3HZQYWn6eIOufrvwmXX7Bo\"",
		"mtime": "2026-10-31T07:13:18.664Z",
		"size": 462709,
		"path": "../public/assets/index-CSUdrdfN.js"
	},
	"/assets/jsx-runtime-Dk72oS4N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2246-jdmifwUklrWzVvkkm/k29uuTwFE\"",
		"mtime": "2026-10-31T07:13:18.687Z",
		"size": 8774,
		"path": "../public/assets/jsx-runtime-Dk72oS4N.js"
	},
	"/assets/layers-C-ttMRu4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a5-pphs0mQ4G6I/dolXx9l/oFZhzyo\"",
		"mtime": "2026-10-31T07:13:18.688Z",
		"size": 421,
		"path": "../public/assets/layers-C-ttMRu4.js"
	},
	"/assets/irrigation-measurement-CxuCVhEt.webp": {
		"type": "image/webp",
		"etag": "\"3abce-LjhJvsGw807M3EDF+65WvKJPSgE\"",
		"mtime": "2026-10-31T07:13:18.728Z",
		"size": 240590,
		"path": "../public/assets/irrigation-measurement-CxuCVhEt.webp"
	},
	"/assets/market-buyer-DTKQhy30.webp": {
		"type": "image/webp",
		"etag": "\"26672-zdVImk1lSJ4STyu+z64zwVYXXEA\"",
		"mtime": "2026-10-31T07:13:18.730Z",
		"size": 157298,
		"path": "../public/assets/market-buyer-DTKQhy30.webp"
	},
	"/assets/market-collective-DNvbS3Vz.webp": {
		"type": "image/webp",
		"etag": "\"3824c-wWSUn0LdzdASCoStZrgweVdzH68\"",
		"mtime": "2026-10-31T07:13:18.730Z",
		"size": 229964,
		"path": "../public/assets/market-collective-DNvbS3Vz.webp"
	},
	"/assets/market-design-Cko3J1Qm.webp": {
		"type": "image/webp",
		"etag": "\"2b24a-NabOQPkT1m7IUMrfYKSpUz1b6gg\"",
		"mtime": "2026-10-31T07:13:18.731Z",
		"size": 176714,
		"path": "../public/assets/market-design-Cko3J1Qm.webp"
	},
	"/assets/market-farmers-CdVTqM4x.webp": {
		"type": "image/webp",
		"etag": "\"3320c-QHQx3ZRHQSy3KImV4JJyP8NkivI\"",
		"mtime": "2026-10-31T07:13:18.731Z",
		"size": 209420,
		"path": "../public/assets/market-farmers-CdVTqM4x.webp"
	},
	"/assets/market-monitoring-CBbgi36N.webp": {
		"type": "image/webp",
		"etag": "\"3d292-PrXLbAkpN+kfleLSd3XhzXHNHaI\"",
		"mtime": "2026-10-31T07:13:18.732Z",
		"size": 250514,
		"path": "../public/assets/market-monitoring-CBbgi36N.webp"
	},
	"/assets/market-registry-CohALSbB.webp": {
		"type": "image/webp",
		"etag": "\"1f2f2-iJtQbnhj+s3NA5YJnk4V5n8X47s\"",
		"mtime": "2026-10-31T07:13:18.733Z",
		"size": 127730,
		"path": "../public/assets/market-registry-CohALSbB.webp"
	},
	"/assets/market-review-DPGA5TQK.webp": {
		"type": "image/webp",
		"etag": "\"27d30-FRv1faWMDGlIaZgpL0Q9/bcnhRM\"",
		"mtime": "2026-10-31T07:13:18.733Z",
		"size": 163120,
		"path": "../public/assets/market-review-DPGA5TQK.webp"
	},
	"/assets/methodology-CuYmZYzE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95-0TBRQ0UDQHkPj8Kn7co1A1yEwqI\"",
		"mtime": "2026-10-31T07:13:18.689Z",
		"size": 149,
		"path": "../public/assets/methodology-CuYmZYzE.js"
	},
	"/assets/menu-BkZwQIzT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4aad-zSML0yQrFk1PJ081iEOvO/q8cdA\"",
		"mtime": "2026-10-31T07:13:18.688Z",
		"size": 19117,
		"path": "../public/assets/menu-BkZwQIzT.js"
	},
	"/assets/page-field-agent-D-6s8mh4.jpg": {
		"type": "image/jpeg",
		"etag": "\"25eac-ccRCOAqAApIXd8wvRgkyHdBRXKo\"",
		"mtime": "2026-10-31T07:13:18.736Z",
		"size": 155308,
		"path": "../public/assets/page-field-agent-D-6s8mh4.jpg"
	},
	"/assets/page-fpo-meeting-CspECwdU.jpg": {
		"type": "image/jpeg",
		"etag": "\"33a51-XAjsF2gmN8/bLT1UOwfLrhRAvwQ\"",
		"mtime": "2026-10-31T07:13:18.737Z",
		"size": 211537,
		"path": "../public/assets/page-fpo-meeting-CspECwdU.jpg"
	},
	"/assets/page-bund-Ckaj7T67.jpg": {
		"type": "image/jpeg",
		"etag": "\"348e0-rOSHGLQ78OIoOsef8tEOimcTuGs\"",
		"mtime": "2026-10-31T07:13:18.735Z",
		"size": 215264,
		"path": "../public/assets/page-bund-Ckaj7T67.jpg"
	},
	"/assets/page-research-CdR-VM1Z.jpg": {
		"type": "image/jpeg",
		"etag": "\"233c5-mvR/Vx2KnoAQLpSnvphjf1PH110\"",
		"mtime": "2026-10-31T07:13:18.737Z",
		"size": 144325,
		"path": "../public/assets/page-research-CdR-VM1Z.jpg"
	},
	"/assets/partners-D3cCJ7bj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95-nM9epf4DbuDv69RaCVxceA3WWe4\"",
		"mtime": "2026-10-31T07:13:18.690Z",
		"size": 149,
		"path": "../public/assets/partners-D3cCJ7bj.js"
	},
	"/assets/page-satellite-Ww7LSd3j.jpg": {
		"type": "image/jpeg",
		"etag": "\"37173-pITr2u330gEIhb3izug6sRUaZEw\"",
		"mtime": "2026-10-31T07:13:18.738Z",
		"size": 225651,
		"path": "../public/assets/page-satellite-Ww7LSd3j.jpg"
	},
	"/assets/platform-CGXGkOgj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95-G/oa2Ui0IzfjfagJh3aL5/x2+hM\"",
		"mtime": "2026-10-31T07:13:18.690Z",
		"size": 149,
		"path": "../public/assets/platform-CGXGkOgj.js"
	},
	"/assets/play-CnzcjNIa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15c-oLCfR+ZIBCcA9nFNl/YO8gZ5YR0\"",
		"mtime": "2026-10-31T07:13:18.691Z",
		"size": 348,
		"path": "../public/assets/play-CnzcjNIa.js"
	},
	"/assets/privacy-vTXkYmhn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a3-JBgU2UgFs6gxWdeai2dwozWmetc\"",
		"mtime": "2026-10-31T07:13:18.692Z",
		"size": 163,
		"path": "../public/assets/privacy-vTXkYmhn.js"
	},
	"/assets/practice-mrv-Cd0oCeVp.webp": {
		"type": "image/webp",
		"etag": "\"3c718-DiElReJxg7SDdqSg0joSzRCkP/c\"",
		"mtime": "2026-10-31T07:13:18.740Z",
		"size": 247576,
		"path": "../public/assets/practice-mrv-Cd0oCeVp.webp"
	},
	"/assets/program-planning-DQJhL6UG.webp": {
		"type": "image/webp",
		"etag": "\"2c0be-VBmdVCP+4j7SqFR0MOqxzljwoCA\"",
		"mtime": "2026-10-31T07:13:18.741Z",
		"size": 180414,
		"path": "../public/assets/program-planning-DQJhL6UG.webp"
	},
	"/assets/project-dossier-D0U18Bi8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e2d-0CVOUcUzcPS9g7cYF8S6sWAdIFQ\"",
		"mtime": "2026-10-31T07:13:18.694Z",
		"size": 15917,
		"path": "../public/assets/project-dossier-D0U18Bi8.js"
	},
	"/assets/programs-background-ZULvKhhI.webp": {
		"type": "image/webp",
		"etag": "\"49344-6TfeXzqSygqhVLsCl5eyJFktzEo\"",
		"mtime": "2026-10-31T07:13:18.742Z",
		"size": 299844,
		"path": "../public/assets/programs-background-ZULvKhhI.webp"
	},
	"/assets/punjab-fields-BuW6GlE7.jpg": {
		"type": "image/jpeg",
		"etag": "\"514ee-9MegXgz8p/sinKimwLCB8iI/s38\"",
		"mtime": "2026-10-31T07:13:18.743Z",
		"size": 333038,
		"path": "../public/assets/punjab-fields-BuW6GlE7.jpg"
	},
	"/assets/research-CF31WSCh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95-oksHPJc6PGa18drcnIzxXbPLfZ4\"",
		"mtime": "2026-10-31T07:13:18.694Z",
		"size": 149,
		"path": "../public/assets/research-CF31WSCh.js"
	},
	"/assets/punjab-rice-programs-generated-D-PYujGp.webp": {
		"type": "image/webp",
		"etag": "\"54a72-MyJ0DqVymiXFPcfKpX1Z4LCe92M\"",
		"mtime": "2026-10-31T07:13:18.744Z",
		"size": 346738,
		"path": "../public/assets/punjab-rice-programs-generated-D-PYujGp.webp"
	},
	"/assets/rice-dsr-D90ydj80.jpg": {
		"type": "image/jpeg",
		"etag": "\"2b5e5-/1Jt76/y0lwhP4MO5MPOp6aB8gY\"",
		"mtime": "2026-10-31T07:13:18.748Z",
		"size": 177637,
		"path": "../public/assets/rice-dsr-D90ydj80.jpg"
	},
	"/assets/rice-aerial-CumgBo-I.jpg": {
		"type": "image/jpeg",
		"etag": "\"4e409-2Wg3SPhyl70sSrLJWXt2ktxdyqI\"",
		"mtime": "2026-10-31T07:13:18.745Z",
		"size": 320521,
		"path": "../public/assets/rice-aerial-CumgBo-I.jpg"
	},
	"/assets/planting-wet-paddy-DQy5jhx4.webp": {
		"type": "image/webp",
		"etag": "\"91fd0-6C5oUcAxzD6h/Eghpd9Ms4CoX6E\"",
		"mtime": "2026-10-31T07:13:18.739Z",
		"size": 597968,
		"path": "../public/assets/planting-wet-paddy-DQy5jhx4.webp"
	},
	"/assets/rice-methane-rQvVLMsI.jpg": {
		"type": "image/jpeg",
		"etag": "\"4230a-eWGym+8rO8ltGQP/KId/yWvbuzI\"",
		"mtime": "2026-10-31T07:13:18.751Z",
		"size": 271114,
		"path": "../public/assets/rice-methane-rQvVLMsI.jpg"
	},
	"/assets/rice-field-team-DOSxdXih.webp": {
		"type": "image/webp",
		"etag": "\"4ceb0-6Cd1gp/pBJKms/HHIN+SuaE1qDs\"",
		"mtime": "2026-10-31T07:13:18.749Z",
		"size": 315056,
		"path": "../public/assets/rice-field-team-DOSxdXih.webp"
	},
	"/assets/rice-residue-management-generated-Bp4EdXOq.webp": {
		"type": "image/webp",
		"etag": "\"60ee8-W4rw6lLv9TXur8GsVxE4t9r+dNo\"",
		"mtime": "2026-10-31T07:13:18.752Z",
		"size": 397032,
		"path": "../public/assets/rice-residue-management-generated-Bp4EdXOq.webp"
	},
	"/assets/routes-CRr6XSMh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"831a-J5Qb0RjUmVjKeFOLhSvVjdrpAwU\"",
		"mtime": "2026-10-31T07:13:18.695Z",
		"size": 33562,
		"path": "../public/assets/routes-CRr6XSMh.js"
	},
	"/assets/satellite-DuS9SFS5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"58-XOnUoov5faJNS2W1vH90yg396bY\"",
		"mtime": "2026-10-31T07:13:18.697Z",
		"size": 88,
		"path": "../public/assets/satellite-DuS9SFS5.js"
	},
	"/assets/satellite-DXizCuHy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"260-xUNFTkNnayKJ/SWWzSkganHwsbM\"",
		"mtime": "2026-10-31T07:13:18.696Z",
		"size": 608,
		"path": "../public/assets/satellite-DXizCuHy.js"
	},
	"/assets/satellite-intelligence-Cip_BbHX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b0e-VRzRrUe9srrKmizTIMOspQkGFIk\"",
		"mtime": "2026-10-31T07:13:18.698Z",
		"size": 15118,
		"path": "../public/assets/satellite-intelligence-Cip_BbHX.js"
	},
	"/assets/shield-check-_rDaY0sA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-zr+YxqGIP56EiA6KMbVjKhJxEe0\"",
		"mtime": "2026-10-31T07:13:18.699Z",
		"size": 320,
		"path": "../public/assets/shield-check-_rDaY0sA.js"
	},
	"/assets/site-shell-DqmqP90N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5476-krNjthMskFWOJpBBaW+x2T7ktVs\"",
		"mtime": "2026-10-31T07:13:18.699Z",
		"size": 21622,
		"path": "../public/assets/site-shell-DqmqP90N.js"
	},
	"/assets/satellite-mosaic-DtmonUGA.webp": {
		"type": "image/webp",
		"etag": "\"50bfa-2xS3pcEB46hZ4nM6z+dAkNeVxww\"",
		"mtime": "2026-10-31T07:13:18.754Z",
		"size": 330746,
		"path": "../public/assets/satellite-mosaic-DtmonUGA.webp"
	},
	"/assets/satellite-methodology-season-L2yZVZf5.webp": {
		"type": "image/webp",
		"etag": "\"78dde-IDNcSbxWbEYt4CTVt8xaNZxgEoY\"",
		"mtime": "2026-10-31T07:13:18.753Z",
		"size": 495070,
		"path": "../public/assets/satellite-methodology-season-L2yZVZf5.webp"
	},
	"/assets/satellite-platform-context-BRjAm_78.webp": {
		"type": "image/webp",
		"etag": "\"60246-FU2RC8GeTrfMdZalF+B7KKMA2CM\"",
		"mtime": "2026-10-31T07:13:18.755Z",
		"size": 393798,
		"path": "../public/assets/satellite-platform-context-BRjAm_78.webp"
	},
	"/assets/solutions-CO46OgGa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"95-2OmzrPn7bYuWMIgZHoPIOSZodTM\"",
		"mtime": "2026-10-31T07:13:18.701Z",
		"size": 149,
		"path": "../public/assets/solutions-CO46OgGa.js"
	},
	"/assets/sparkles-Daj57x6s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2bc-uJlrnDyM4CVpn1243dFMYMj0OQ0\"",
		"mtime": "2026-10-31T07:13:18.701Z",
		"size": 700,
		"path": "../public/assets/sparkles-Daj57x6s.js"
	},
	"/assets/store-CGagkiDs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b47-vO9JxzMhUH2+TJfcXA51txXRu8o\"",
		"mtime": "2026-10-31T07:13:18.702Z",
		"size": 15175,
		"path": "../public/assets/store-CGagkiDs.js"
	},
	"/assets/styles-BiyGgQgo.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"4425f-RSkch8PBci1f+cBRfZScesEbu8s\"",
		"mtime": "2026-10-31T07:13:18.757Z",
		"size": 279135,
		"path": "../public/assets/styles-BiyGgQgo.css"
	},
	"/assets/supply-chain-7BdsrTmo.webp": {
		"type": "image/webp",
		"etag": "\"32138-exImhucGVNHpxX1+ndJIpFmRPn0\"",
		"mtime": "2026-10-31T07:13:18.758Z",
		"size": 205112,
		"path": "../public/assets/supply-chain-7BdsrTmo.webp"
	},
	"/assets/terms-xpaj8ekL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a1-gLVbQP4nvnqzXVYSxMy5SX5AuSk\"",
		"mtime": "2026-10-31T07:13:18.703Z",
		"size": 161,
		"path": "../public/assets/terms-xpaj8ekL.js"
	},
	"/assets/terra-intelligence-sNfKAvaG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3e96-Ag+XP1BcZ6UDwc/RtRsORYE8y4A\"",
		"mtime": "2026-10-31T07:13:18.703Z",
		"size": 16022,
		"path": "../public/assets/terra-intelligence-sNfKAvaG.js"
	},
	"/assets/terms-records-generated-CHaHu_3_.webp": {
		"type": "image/webp",
		"etag": "\"2916e-/s2pGA2Fp7YJXytVh9U9+vhgLio\"",
		"mtime": "2026-10-31T07:13:18.758Z",
		"size": 168302,
		"path": "../public/assets/terms-records-generated-CHaHu_3_.webp"
	},
	"/assets/tractor-punjab-CEN56KKw.webp": {
		"type": "image/webp",
		"etag": "\"3c718-ph05i0dwy1rllAPsvwArmnXF2D8\"",
		"mtime": "2026-10-31T07:13:18.759Z",
		"size": 247576,
		"path": "../public/assets/tractor-punjab-CEN56KKw.webp"
	},
	"/assets/transplanting-generated-C6HwgLpw.jpg": {
		"type": "image/jpeg",
		"etag": "\"54af9-7sjHWo2rS43AwRA5Nu0VTEFZ2GA\"",
		"mtime": "2026-10-31T07:13:18.759Z",
		"size": 346873,
		"path": "../public/assets/transplanting-generated-C6HwgLpw.jpg"
	},
	"/assets/trust-background-D-s4D2CH.webp": {
		"type": "image/webp",
		"etag": "\"27100-g+28vQYX/7oUPk+aaygNywZFHn8\"",
		"mtime": "2026-10-31T07:13:18.760Z",
		"size": 16e4,
		"path": "../public/assets/trust-background-D-s4D2CH.webp"
	},
	"/assets/useNavigate-QLUEPe4D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"183-meci9XE26joWGu93WastzZa6L7c\"",
		"mtime": "2026-10-31T07:13:18.704Z",
		"size": 387,
		"path": "../public/assets/useNavigate-QLUEPe4D.js"
	},
	"/assets/useRouter-BWuYVZyj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97-U1ZzK0eROVVNcRQXWMxE1xpT0F4\"",
		"mtime": "2026-10-31T07:13:18.704Z",
		"size": 151,
		"path": "../public/assets/useRouter-BWuYVZyj.js"
	},
	"/assets/visual-diagrams-C7bKi40G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4164-1YIsGUl71FOLPhxe5MSuo8gugYg\"",
		"mtime": "2026-10-31T07:13:18.706Z",
		"size": 16740,
		"path": "../public/assets/visual-diagrams-C7bKi40G.js"
	},
	"/assets/woman-harvesting-rice-BLXfrqMr.webp": {
		"type": "image/webp",
		"etag": "\"51df8-iLyTaUziTxV2XCIttTkXysKiV1Q\"",
		"mtime": "2026-10-31T07:13:18.761Z",
		"size": 335352,
		"path": "../public/assets/woman-harvesting-rice-BLXfrqMr.webp"
	},
	"/assets/woman-orange-rice-DqOe5XAi.webp": {
		"type": "image/webp",
		"etag": "\"34bd0-GIB5waRyzfyb+U1umhv6xYH8ApY\"",
		"mtime": "2026-10-31T07:13:18.762Z",
		"size": 216016,
		"path": "../public/assets/woman-orange-rice-DqOe5XAi.webp"
	},
	"/assets/workspace-DOyvDm1u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b0-QLXRQ2xpPS9KkWxmGyI1pPnwkTs\"",
		"mtime": "2026-10-31T07:13:18.706Z",
		"size": 176,
		"path": "../public/assets/workspace-DOyvDm1u.js"
	},
	"/assets/woman-standing-rice-field-ciPZ4mcu.webp": {
		"type": "image/webp",
		"etag": "\"17a2e-vlWZFHcf/nUT8mie0yojzW9RZZM\"",
		"mtime": "2026-10-31T07:13:18.763Z",
		"size": 96814,
		"path": "../public/assets/woman-standing-rice-field-ciPZ4mcu.webp"
	},
	"/assets/x-Bs33Y-Ts.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-5r4FNgCqeECKaxSTQI7p4fa1GM0\"",
		"mtime": "2026-10-31T07:13:18.707Z",
		"size": 154,
		"path": "../public/assets/x-Bs33Y-Ts.js"
	},
	"/assets/women-fieldwork-CjlmCiUC.webp": {
		"type": "image/webp",
		"etag": "\"6866c-6mToNcB5hf9Uci0YsqM1VXD1jY0\"",
		"mtime": "2026-10-31T07:13:18.763Z",
		"size": 427628,
		"path": "../public/assets/women-fieldwork-CjlmCiUC.webp"
	},
	"/brand/tcc-favicon.png": {
		"type": "image/png",
		"etag": "\"eba-xBpfUDS/xUbF7BnI9LxL6SMbrVY\"",
		"mtime": "2026-10-31T06:51:23.670Z",
		"size": 3770,
		"path": "../public/brand/tcc-favicon.png"
	},
	"/brand/organic-tcc-monogram.png": {
		"type": "image/png",
		"etag": "\"83016-+aAsdz61mhPAgdh2PxmI6enNlyc\"",
		"mtime": "2026-10-31T06:51:23.663Z",
		"size": 536598,
		"path": "../public/brand/organic-tcc-monogram.png"
	},
	"/brand/the-carbon-credit-logo.png": {
		"type": "image/png",
		"etag": "\"12e653-wgvoqGbwFrvEGnn1ShCZcCrRNnU\"",
		"mtime": "2026-10-31T06:51:23.692Z",
		"size": 1238611,
		"path": "../public/brand/the-carbon-credit-logo.png"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_Dobh8j = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_Dobh8j
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
