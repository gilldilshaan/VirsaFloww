//#region node_modules/.nitro/vite/services/ssr/assets/enquiry-BeeurNGE.js
var enquiryDestination = "contact@thecarboncredit.in";
var enquiryPurposes = [
	"Institutional partnership",
	"Pilot program",
	"Platform walkthrough",
	"Research collaboration",
	"General enquiry"
];
var enquiryContextFields = [
	{
		key: "role",
		label: "Your role"
	},
	{
		key: "partnerCategory",
		label: "Partner category"
	},
	{
		key: "geography",
		label: "Geography / region"
	},
	{
		key: "cropPractice",
		label: "Crop or agricultural practice"
	},
	{
		key: "scale",
		label: "Approximate program scale"
	},
	{
		key: "availableData",
		label: "Available data sources"
	},
	{
		key: "timeline",
		label: "Expected timeline"
	}
];
function composeEnquiry(values) {
	if (!values.name.trim() || !values.organization.trim() || !values.message.trim()) throw new Error("Please complete all required fields.");
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) throw new Error("Enter a valid email address.");
	if (!values.consent) throw new Error("Please agree to share your enquiry with The Carbon Credit.");
	if (!enquiryPurposes.includes(values.purpose)) throw new Error("Choose an enquiry type.");
	const context = enquiryContextFields.map((f) => {
		const value = values.context?.[f.key]?.trim();
		return value ? `${f.label}: ${value}` : "";
	}).filter(Boolean).join("\n");
	const body = `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\nOrganization: ${values.organization.trim()}\nInterest: ${values.purpose}${context ? `\n${context}` : ""}\n\nDesired outcome: ${values.message.trim()}`;
	return `mailto:${enquiryDestination}?subject=${encodeURIComponent(`The Carbon Credit | ${values.purpose}`)}&body=${encodeURIComponent(body)}`;
}
//#endregion
export { enquiryPurposes as i, enquiryContextFields as n, enquiryDestination as r, composeEnquiry as t };
