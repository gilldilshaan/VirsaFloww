import { a as pageHead } from "./acreon-brand-HLTFfwjE.mjs";
import { v as lazyRouteComponent, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-Bl0rm83y.js
var $$splitComponentImporter = () => import("./contact--Mzojh5N.mjs");
var Route = createFileRoute("/contact")({
	validateSearch: (search) => typeof search["interest"] === "string" ? { interest: search["interest"] } : {},
	head: () => pageHead("Contact", "Contact The Carbon Credit about institutional partnerships, pilot programs, research and platform walkthroughs.", "/contact"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
