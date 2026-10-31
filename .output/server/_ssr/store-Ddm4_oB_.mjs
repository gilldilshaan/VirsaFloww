import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-Ddm4_oB_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRIMARY_FIELD = {
	id: "PB-LUD-042",
	code: "PB-LUD-042",
	name: "Gill Agro-Plot 4",
	farmerName: "Gurdev Singh Gill",
	farmerNameLocal: "ਗੁਰਦੇਵ ਸਿੰਘ ਗਿੱਲ",
	district: "Ludhiana",
	state: "Punjab",
	areaHa: 4.8,
	areaAcres: 11.86,
	practice: "Direct Seeded Rice (DSR) + Alternate Wetting & Drying (AWD)",
	crop: "PR-126 Basmati / Paddy",
	season: "Kharif 2026",
	coordinates: {
		lat: 30.911,
		lng: 75.837
	},
	boundaryPolygon: [
		[30.9135, 75.8345],
		[30.9142, 75.8388],
		[30.9085, 75.8395],
		[30.9078, 75.8352]
	],
	targetEmissionReductionTonnes: 23.04
};
var SATELLITE_OBSERVATIONS = [
	{
		id: "S2A_20260614_PB",
		date: "2026-06-14",
		sensor: "Copernicus Sentinel-2A MSI",
		resolutionMeters: 10,
		cloudCoverPercent: .8,
		sunAzimuthDeg: 68.2,
		meanNdvi: .18,
		meanNdwi: -.22,
		qualityRating: "High",
		surfaceWaterDetected: false,
		notes: "Pre-seeding dry seedbed preparation. No standing water detected, consistent with direct seeding baseline."
	},
	{
		id: "S2B_20260702_PB",
		date: "2026-07-02",
		sensor: "Copernicus Sentinel-2B MSI",
		resolutionMeters: 10,
		cloudCoverPercent: 2.1,
		sunAzimuthDeg: 71.4,
		meanNdvi: .34,
		meanNdwi: .12,
		qualityRating: "High",
		surfaceWaterDetected: true,
		notes: "Early vegetative flushing irrigation. Brief NDWI rise indicating controlled moisture application."
	},
	{
		id: "S2A_20260728_PB",
		date: "2026-07-28",
		sensor: "Copernicus Sentinel-2A MSI",
		resolutionMeters: 10,
		cloudCoverPercent: 4.5,
		sunAzimuthDeg: 66.8,
		meanNdvi: .58,
		meanNdwi: -.08,
		qualityRating: "High",
		surfaceWaterDetected: false,
		notes: "AWD mid-season drying phase. NDWI dropped negative while NDVI surged, validating alternate aeration without crop moisture stress."
	},
	{
		id: "S2B_20260815_PB",
		date: "2026-08-15",
		sensor: "Copernicus Sentinel-2B MSI",
		resolutionMeters: 10,
		cloudCoverPercent: 1.6,
		sunAzimuthDeg: 64,
		meanNdvi: .76,
		meanNdwi: .04,
		qualityRating: "High",
		surfaceWaterDetected: false,
		notes: "Full panicle initiation canopy closure. Peak biomass development consistent with healthy DSR adoption."
	}
];
var INITIAL_EVIDENCE_ITEMS = [
	{
		id: "EV-001",
		title: "Farmer Land Registry Record (Fard Jamabandi)",
		type: "document",
		category: "supporting",
		status: "verified",
		description: "Government certified land tenancy and title deed verified against Punjab Revenue portal.",
		timestamp: "2026-05-18 10:30 UTC",
		provenance: {
			author: "Revenue Department, Govt of Punjab",
			source: "State Land Records (Digital Jamabandi API)",
			sha256: "a68f08c3bc0078dc17482596e174066c1f1ecf330198de7e5ec0d74ebba09c62",
			reviewStatus: "Verified by Agro-MRV Registrar"
		},
		fileDetails: {
			name: "PB-LUD-042-Jamabandi.pdf",
			sizeKb: 412,
			mime: "application/pdf"
		}
	},
	{
		id: "EV-002",
		title: "Copernicus Sentinel-2 Spectral Series (June-Aug)",
		type: "satellite",
		category: "supporting",
		status: "verified",
		description: "Calibrated BOA surface reflectance spectral profiles confirming vegetation progression without continuous flooding.",
		timestamp: "2026-08-16 04:15 UTC",
		provenance: {
			author: "European Space Agency (ESA) Copernicus Hub",
			source: "Sentinel-2 Level-2A Processing",
			sha256: "9f83a21e7d0a2731804b901a1d1297e5591cf8813bcdae34024b423f7178a301",
			reviewStatus: "Automated Pipeline Match (Cloud Cover < 5%)"
		},
		fileDetails: {
			name: "Sentinel2_PB_LUD_042_Composite.tif",
			sizeKb: 18450,
			mime: "image/tiff"
		}
	},
	{
		id: "EV-003",
		title: "Field Drill Activity Photograph (Spatial Anomaly)",
		type: "photo",
		category: "contradicting",
		status: "flagged",
		description: "Seeding photograph captured with DSR drill machine. Flagged: EXIF geotag coordinates fall 420 meters outside the parcel boundary polygon.",
		timestamp: "2026-06-15 08:42 UTC",
		provenance: {
			author: "Gurdev Singh (Farmer mobile client)",
			source: "Samsung Galaxy A52s camera EXIF",
			sha256: "381a8b94091ca2857410f92b774c8de5320e8b15d29033e08f230234714d2491",
			device: "Samsung Galaxy A52s SM-A528B",
			gpsCoordinates: {
				lat: 30.9178,
				lng: 75.8424,
				accuracyMeters: 4.2
			},
			spatialDistanceMeters: 420,
			reviewStatus: "Flagged: Coordinate Mismatch (+420m)"
		},
		fileDetails: {
			name: "IMG_20260615_Seeding_DSR.jpg",
			sizeKb: 3820,
			mime: "image/jpeg"
		}
	},
	{
		id: "EV-004",
		title: "Perforated PVC Water Tube (Pani Da Bambu) AWD Log",
		type: "log",
		category: "missing",
		status: "missing",
		description: "Mandatory field soil-moisture log tracking water level depth below ground (AWD protocol requirement).",
		timestamp: "Unrecorded",
		provenance: {
			author: "Field Agent / Farmer",
			source: "Missing field observation log",
			reviewStatus: "Mandatory Evidence Missing"
		}
	},
	{
		id: "EV-005",
		title: "Verified In-Boundary Crop Emergence Photograph",
		type: "photo",
		category: "missing",
		status: "missing",
		description: "High-resolution in-boundary photograph with GPS accuracy < 5m showing DSR rice line emergence.",
		timestamp: "Unrecorded",
		provenance: {
			author: "Field Inspector or Farmer App",
			source: "Required replacement for flagged EV-003",
			reviewStatus: "Awaiting Verified Upload"
		}
	}
];
var ADDED_IRRIGATION_LOG = {
	id: "EV-004-LOG",
	title: "Perforated PVC Tube Field Irrigation & Pumping Log",
	type: "log",
	category: "supporting",
	status: "verified",
	description: "Daily water level recordings showing 15cm drying depth intervals between irrigations, explaining July drydown cycles.",
	timestamp: "2026-07-29 11:20 UTC",
	provenance: {
		author: "Harpreet Singh (FPO Extension Agent)",
		source: "TerraLedger Mobile Offline Sync",
		sha256: "72c3d10526017b8f9e2cf44b581023a968d901764ebaf231a47b19df52c1e847",
		device: "TerraLedger Field App v2.4 (Android)",
		reviewStatus: "Corroborated with Sentinel-2 NDWI series"
	},
	fileDetails: {
		name: "PB-LUD-042-AWD-Irrigation-Log.csv",
		sizeKb: 64,
		mime: "text/csv"
	}
};
var ADDED_IN_BOUNDARY_PHOTO = {
	id: "EV-005-PHOTO",
	title: "Geotagged In-Boundary Crop Emergence Photograph",
	type: "photo",
	category: "supporting",
	status: "verified",
	description: "High precision geotagged photograph taken inside parcel boundary showing direct drill rows without puddle crust.",
	timestamp: "2026-07-14 09:12 UTC",
	provenance: {
		author: "Gurdev Singh (Farmer)",
		source: "TerraLedger Camera with Boundary Enclosure Check",
		sha256: "55bc2990f2304918e77c592b217036a441e976db570183e29f032870197d6482",
		device: "Samsung Galaxy A52s SM-A528B",
		gpsCoordinates: {
			lat: 30.9112,
			lng: 75.8374,
			accuracyMeters: 2.1
		},
		spatialDistanceMeters: 0,
		reviewStatus: "Enclosure Verified (100% inside PB-LUD-042)"
	},
	fileDetails: {
		name: "IMG_20260714_InField_DSR_Emergence.jpg",
		sizeKb: 4210,
		mime: "image/jpeg"
	}
};
var MARKETPLACE_PROJECTS = [
	{
		id: "PRJ-PB-DSR-01",
		title: "Punjab Direct Seeded Rice MRV Cluster #1",
		slug: "punjab-dsr-cluster-1",
		location: "Ludhiana & Sangrur, Punjab",
		district: "Ludhiana",
		practice: "Direct Seeded Rice (DSR) + AWD",
		methodology: "Verra VM0042 (Agricultural Land Management)",
		developer: "Panjdhara Agritech Private Limited",
		totalHectares: 1450,
		enrolledParcels: 180,
		farmerCount: 164,
		estimatedTonsCo2ePerYear: 6960,
		readinessScorePercent: 94,
		assessmentStatus: "READY_FOR_VERIFICATION",
		indicativePricePerTonUsd: 28,
		vintage: "Kharif 2026",
		description: "Consolidated cluster of smallholder paddy farmers adopting dry direct-seeding with tractor seed drills, eliminating seedling nursery puddle cultivation and reducing methane emissions by ~48%.",
		highlights: [
			"Zero puddling reduces methane emissions by 42–52%",
			"35% water savings monitored by Sentinel-2 NDWI",
			"80% carbon revenue distributed directly to farmer bank accounts",
			"Full parcel-level cadastral and satellite evidence trail"
		],
		evidenceDepth: {
			satellitePasses: 16,
			groundPhotos: 342,
			waterLogs: 178
		}
	},
	{
		id: "PRJ-PB-CRM-02",
		title: "Malwa Zero-Till & Residue Management Hub",
		slug: "malwa-zero-till-residue",
		location: "Bathinda & Mansa, Punjab",
		district: "Bathinda",
		practice: "Crop Residue Management (Happy Seeder Retention)",
		methodology: "Gold Standard Soil Organic Carbon",
		developer: "Punjab Clean Air Agro-Alliance",
		totalHectares: 2100,
		enrolledParcels: 245,
		farmerCount: 220,
		estimatedTonsCo2ePerYear: 9870,
		readinessScorePercent: 74,
		assessmentStatus: "NEEDS_REVIEW",
		indicativePricePerTonUsd: 26,
		vintage: "Rabi 2026",
		description: "Complete replacement of stubble burning with Happy Seeder wheat planting into unburnt rice straw mulch, enhancing soil carbon retention and preventing seasonal particulate pollution.",
		highlights: [
			"Eliminates open straw burning on 2,100 hectares",
			"Thermal anomaly satellite tracking via VIIRS/MODIS",
			"Tractor telemetry tracking machinery operating hours",
			"Includes localized soil carbon sampling core baselines"
		],
		evidenceDepth: {
			satellitePasses: 22,
			groundPhotos: 280,
			waterLogs: 95
		}
	},
	{
		id: "PRJ-PB-AWD-03",
		title: "Patiala Basin Precision Alternate Wetting & Drying",
		slug: "patiala-basin-awd",
		location: "Patiala & Fatehgarh Sahib, Punjab",
		district: "Patiala",
		practice: "Alternate Wetting & Drying (AWD)",
		methodology: "Verra AMS-III.AU",
		developer: "Indus Water & Carbon Initiatives",
		totalHectares: 1200,
		enrolledParcels: 140,
		farmerCount: 125,
		estimatedTonsCo2ePerYear: 4320,
		readinessScorePercent: 88,
		assessmentStatus: "READY_FOR_VERIFICATION",
		indicativePricePerTonUsd: 31,
		vintage: "Kharif 2026",
		description: "Controlled intermittent irrigation across groundwater-stressed zones. Tube water tables measured daily with automated telemetry sensors and farmer verification logs.",
		highlights: [
			"Groundwater pumping electricity reduction of 30%",
			"Strict soil aeration intervals documented with piezometer tubes",
			"Direct FPO aggregate governance and benefit distribution",
			"High-confidence Sentinel-2 NDWI drying confirmation"
		],
		evidenceDepth: {
			satellitePasses: 18,
			groundPhotos: 195,
			waterLogs: 210
		}
	},
	{
		id: "PRJ-PB-AFR-04",
		title: "Doaba Agroforestry & Poplar Biomass Intercrop",
		slug: "doaba-agroforestry-poplar",
		location: "Hoshiarpur & Kapurthala, Punjab",
		district: "Hoshiarpur",
		practice: "Agroforestry & Boundary Poplar Trees",
		methodology: "Verra AR-ACM0003 (Afforestation & Reforestation)",
		developer: "Green Punjab Ecological FPO",
		totalHectares: 850,
		enrolledParcels: 98,
		farmerCount: 92,
		estimatedTonsCo2ePerYear: 5100,
		readinessScorePercent: 62,
		assessmentStatus: "NEEDS_REVIEW",
		indicativePricePerTonUsd: 34,
		vintage: "Multi-year 2025-2029",
		description: "Boundary and intercropped deciduous tree belts integrated with agricultural fields, yielding above-ground biomass carbon sequestration and timber diversification for smallholders.",
		highlights: [
			"Canopy area measured via high-resolution satellite NDVI",
			"DBH tree circumference field audit log",
			"Dual income stream: carbon payments + timber harvest cycle",
			"Enhanced biodiversity and soil erosion protection"
		],
		evidenceDepth: {
			satellitePasses: 12,
			groundPhotos: 140,
			waterLogs: 45
		}
	}
];
var INITIAL_DUE_DILIGENCE_PIPELINE = [
	{
		id: "DD-001",
		buyerName: "Marcus Vance",
		buyerOrg: "Aura Climate Asset Management Ltd.",
		projectTitle: "Punjab Direct Seeded Rice MRV Cluster #1",
		inquiryDate: "2026-10-14",
		stage: "Data Room Shared",
		volumeRequestedTons: 2500,
		targetRetirementYear: "2026",
		status: "Active"
	},
	{
		id: "DD-002",
		buyerName: "Elena Rostova",
		buyerOrg: "Nordic Agri-Transition Fund",
		projectTitle: "Patiala Basin Precision AWD",
		inquiryDate: "2026-10-21",
		stage: "Audit Underway",
		volumeRequestedTons: 1500,
		targetRetirementYear: "2027",
		status: "Review Required"
	},
	{
		id: "DD-003",
		buyerName: "Kenji Takahashi",
		buyerOrg: "Sojitz Environmental Commodities",
		projectTitle: "Malwa Zero-Till & Residue Hub",
		inquiryDate: "2026-10-27",
		stage: "Inquiry",
		volumeRequestedTons: 4e3,
		targetRetirementYear: "2026",
		status: "Active"
	}
];
var TerraLedgerContext = (0, import_react.createContext)(null);
function TerraLedgerProvider({ children }) {
	const [demoState, setDemoState] = (0, import_react.useState)("unverified");
	const [activeTab, setActiveTab] = (0, import_react.useState)("command");
	const [customEvidence, setCustomEvidence] = (0, import_react.useState)([]);
	const [dueDiligenceList, setDueDiligenceList] = (0, import_react.useState)(INITIAL_DUE_DILIGENCE_PIPELINE);
	const evidenceList = (0, import_react.useMemo)(() => {
		let items = [];
		if (demoState === "unverified") items = [...INITIAL_EVIDENCE_ITEMS];
		else if (demoState === "needs-review") items = INITIAL_EVIDENCE_ITEMS.filter((i) => i.id !== "EV-004").concat(ADDED_IRRIGATION_LOG);
		else items = INITIAL_EVIDENCE_ITEMS.filter((i) => i.id !== "EV-004" && i.id !== "EV-005").concat(ADDED_IRRIGATION_LOG).concat(ADDED_IN_BOUNDARY_PHOTO);
		return [...items, ...customEvidence];
	}, [demoState, customEvidence]);
	const assessmentStatus = (0, import_react.useMemo)(() => {
		if (demoState === "unverified") return "UNVERIFIED";
		if (demoState === "needs-review") return "NEEDS_REVIEW";
		return "READY_FOR_VERIFICATION";
	}, [demoState]);
	const completenessPercent = (0, import_react.useMemo)(() => {
		if (demoState === "unverified") return 42;
		if (demoState === "needs-review") return 71;
		return 94;
	}, [demoState]);
	const aiExplanation = (0, import_react.useMemo)(() => {
		if (demoState === "unverified") return {
			headline: "Spatial Anomaly & Incomplete Water Records Detected",
			details: "Evidence completeness is currently at 42%. A critical spatial discrepancy exists: field seeding photograph EV-003 exhibits EXIF coordinates falling 420 meters outside Parcel PB-LUD-042. Additionally, mandatory in-situ PVC water tube (AWD) records are absent for early vegetative flushing.",
			spatialStatus: "FLAGGED: Coordinate mismatch (+420m outside polygon)",
			temporalStatus: "INCOMPLETE: AWD field water log missing",
			nextRequiredAction: "Upload perforated tube AWD log and provide in-boundary geotagged photo replacement.",
			isReady: false
		};
		if (demoState === "needs-review") return {
			headline: "Water Schedule Corroborated; Spatial Mismatch Persists",
			details: "Perforated PVC water tube log (EV-004-LOG) was successfully added. Pumping cessation intervals align with Sentinel-2 NDWI drying curves (June 28 to July 08). However, the original field drill photograph EV-003 remains unresolved (+420m offset). Status advanced to Needs Review.",
			spatialStatus: "UNRESOLVED: Photo EV-003 still outside boundary",
			temporalStatus: "VERIFIED: Pumping cycles corroborate Sentinel-2 NDWI drying curve",
			nextRequiredAction: "Upload verified in-boundary geotagged emergence photograph with accuracy < 5m.",
			isReady: false
		};
		return {
			headline: "All Required Evidence Corroborated · Ready for Verification",
			details: "New geotagged photograph (EV-005-PHOTO) was captured with 2.1m precision inside parcel bounds, confirming DSR drill row emergence. Pumping records correlate with remote sensing. All mandatory MRV criteria are satisfied. The dossier is now ready for third-party accredited verifier inspection.",
			spatialStatus: "RESOLVED: Coordinates verified 100% within polygon (PB-LUD-042) · Ready for Verification",
			temporalStatus: "CORROBORATED: AWD drying cycle confirmed across satellite & field logs",
			nextRequiredAction: "Compile digital project dossier for accredited VVB audit (automated assessment is not 3rd-party certification). Status: READY FOR VERIFICATION.",
			isReady: true
		};
	}, [demoState]);
	const advanceDemoState = () => {
		if (demoState === "unverified") setDemoState("needs-review");
		else if (demoState === "needs-review") setDemoState("ready");
		else setDemoState("unverified");
	};
	const resetDemoState = () => {
		setDemoState("unverified");
		setCustomEvidence([]);
	};
	const addIrrigationLogAction = () => {
		setDemoState("needs-review");
	};
	const addInBoundaryPhotoAction = () => {
		setDemoState("ready");
	};
	const addCustomEvidenceAction = (item) => {
		const newItem = {
			id: `EV-USER-${Date.now()}`,
			title: item.title || "Uploaded Field Evidence",
			type: item.type || "document",
			category: item.category || "supporting",
			status: item.status || "verified",
			description: item.description || "User submitted evidence record via demonstration upload.",
			timestamp: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19) + " UTC",
			provenance: {
				author: item.provenance?.author || "Demonstration Reviewer",
				source: "TerraLedger Web Client Upload",
				sha256: item.provenance?.sha256 || "b849e7b2359483c6753c072d6778f8c47b5de9744cfd91a92a543ec27b1406d2",
				reviewStatus: "Pending Verifier Attestation"
			},
			fileDetails: item.fileDetails || {
				name: "uploaded-evidence.pdf",
				sizeKb: 128,
				mime: "application/pdf"
			}
		};
		setCustomEvidence((prev) => [...prev, newItem]);
	};
	const submitBuyerInquiry = (data) => {
		const newEntry = {
			id: `DD-${String(Date.now()).slice(-4)}`,
			buyerName: data.buyerName,
			buyerOrg: data.buyerOrg,
			projectTitle: data.projectTitle,
			inquiryDate: (/* @__PURE__ */ new Date()).toISOString().substring(0, 10),
			stage: "Inquiry",
			volumeRequestedTons: data.volumeRequestedTons,
			targetRetirementYear: data.targetRetirementYear,
			status: "Active"
		};
		setDueDiligenceList((prev) => [newEntry, ...prev]);
		return {
			success: true,
			message: `Enquiry submitted for ${data.volumeRequestedTons.toLocaleString()} tCO2e of ${data.projectTitle}. Data room link generated. (Demonstration interaction).`
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TerraLedgerContext.Provider, {
		value: {
			demoState,
			setDemoState,
			advanceDemoState,
			resetDemoState,
			addIrrigationLogAction,
			addInBoundaryPhotoAction,
			addCustomEvidenceAction,
			field: PRIMARY_FIELD,
			satelliteObservations: SATELLITE_OBSERVATIONS,
			evidenceList,
			assessmentStatus,
			completenessPercent,
			aiExplanation,
			activeTab,
			setActiveTab,
			projects: MARKETPLACE_PROJECTS,
			dueDiligenceList,
			submitBuyerInquiry
		},
		children
	});
}
function useTerraLedger() {
	const context = (0, import_react.useContext)(TerraLedgerContext);
	if (!context) throw new Error("useTerraLedger must be used within a TerraLedgerProvider");
	return context;
}
//#endregion
export { TerraLedgerProvider as a, SATELLITE_OBSERVATIONS as i, MARKETPLACE_PROJECTS as n, useTerraLedger as o, PRIMARY_FIELD as r, INITIAL_EVIDENCE_ITEMS as t };
