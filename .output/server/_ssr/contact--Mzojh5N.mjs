import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as ContactPage } from "./content-pages-D2-do96n.mjs";
import { t as Route } from "./contact-Bl0rm83y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact--Mzojh5N.js
var import_jsx_runtime = require_jsx_runtime();
function ContactRoute() {
	const { interest } = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactPage, { ...interest ? { interest } : {} });
}
//#endregion
export { ContactRoute as component };
