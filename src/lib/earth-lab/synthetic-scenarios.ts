/**
 * The Carbon Credit OS — TCC Earth Intelligence Lab
 * Synthetic Agricultural Scenario Engine (Phase 5)
 *
 * Generates controlled multi-temporal synthetic trajectories for software validation
 * and algorithmic stress-testing across rice, wheat, fallow, and flooded scenarios.
 *
 * NON-NEGOTIABLE SCIENTIFIC PRINCIPLE:
 * These synthetic trajectories validate software behavior, edge-case handling, and
 * pipeline resilience. They do NOT represent observed agricultural truth or field performance.
 */

import { SyntheticScenarioTrajectory, ScenarioCategory } from "./types";
import { Mulberry32PRNG } from "./synthetic-generator";

/**
 * Asserts that simulated labels cannot be promoted to verified ground truth.
 * Throws a non-recoverable error if simulated data is supplied to verification endpoints.
 */
export function assertSimulatedLabelPromotionProhibited(dataOrigin: string, labelOrigin: string): void {
  if (dataOrigin === "synthetic" || labelOrigin === "simulated") {
    throw new Error(
      "SIMULATED_LABEL_PROMOTION_PROHIBITED: Simulated scenario labels cannot be promoted to farmer-verified ground truth or used to claim carbon credit eligibility."
    );
  }
}

/**
 * Generates a synthetic Direct Seeded Rice (DSR) seasonal trajectory.
 * Kharif season: June 15 to October 31 (138 days).
 *
 * Key Physical Dynamics:
 * - Day 0–20 (Establishment): Dry seeded soil. Specular drop absent. VV ~ -11.0 dB. NDVI ~ 0.15–0.22.
 * - Day 20–70 (Tillering & Vegetative): Canopy closes gradually. NDVI climbs 0.25 -> 0.75.
 * - Day 70–100 (Reproductive): Dense canopy, high LAI. NDVI ~ 0.75–0.82.
 * - Day 100–138 (Maturity & Harvest): Dry-down, senescent decline in NDVI, decline in NDMI.
 *
 * If isAmbiguous is true, introduces early monsoon showers causing partial specular drop
 * or delayed weed emergence, simulating realistic overlapping sensor signatures.
 */
export function generateDsrScenarioTrajectory(
  seed: number = 101,
  isAmbiguous: boolean = false
): SyntheticScenarioTrajectory {
  const prng = new Mulberry32PRNG(seed);
  const observations: SyntheticScenarioTrajectory["observations"] = [];
  const baseDates = [
    { day: 5, date: "2024-06-20" },
    { day: 15, date: "2024-06-30" },
    { day: 30, date: "2024-07-15" },
    { day: 45, date: "2024-07-30" },
    { day: 60, date: "2024-08-14" },
    { day: 75, date: "2024-08-29" },
    { day: 90, date: "2024-09-13" },
    { day: 105, date: "2024-09-28" },
    { day: 120, date: "2024-10-13" },
    { day: 135, date: "2024-10-28" },
  ];

  for (const item of baseDates) {
    let ndvi = 0.18;
    let vv_db = -11.2;
    let vh_db = -18.5;
    let ndmi = 0.10;
    let evi = 0.12;
    let ndre = 0.14;
    let isCloud = false;
    let isMissing = false;

    if (item.day <= 20) {
      // Early dry soil
      ndvi = prng.range(0.16, 0.22);
      vv_db = isAmbiguous ? prng.range(-14.2, -12.5) : prng.range(-11.8, -10.5); // Ambiguous may mimic wet soil
      vh_db = vv_db - 7.5;
      ndmi = prng.range(0.05, 0.15);
      evi = ndvi * 0.85;
      ndre = ndvi * 0.90;
    } else if (item.day <= 60) {
      // Active tillering
      const progress = (item.day - 20) / 40;
      ndvi = 0.22 + progress * (0.65 - 0.22) + prng.range(-0.03, 0.03);
      vv_db = -11.0 + progress * 2.0; // canopy scattering
      vh_db = vv_db - 6.5;
      ndmi = 0.15 + progress * 0.25;
      evi = ndvi * 0.88;
      ndre = ndvi * 0.82;
      if (item.day === 45) isCloud = true; // Monsoon cloud in late July
    } else if (item.day <= 95) {
      // Peak reproductive
      ndvi = prng.range(0.74, 0.82);
      vv_db = prng.range(-9.5, -8.2);
      vh_db = vv_db - 5.5; // High volume scattering
      ndmi = prng.range(0.38, 0.46);
      evi = prng.range(0.65, 0.74);
      ndre = prng.range(0.55, 0.65);
    } else {
      // Senescence & harvest
      const progress = (item.day - 95) / 40;
      ndvi = 0.75 - progress * 0.45 + prng.range(-0.03, 0.03);
      vv_db = -9.0 - progress * 2.5;
      vh_db = vv_db - 7.0;
      ndmi = 0.40 - progress * 0.30;
      evi = ndvi * 0.80;
      ndre = ndvi * 0.75;
    }

    observations.push({
      date: item.date,
      day_of_season: item.day,
      ndvi: Number(ndvi.toFixed(4)),
      ndmi: Number(ndmi.toFixed(4)),
      evi: Number(evi.toFixed(4)),
      ndre: Number(ndre.toFixed(4)),
      vv_db: Number(vv_db.toFixed(2)),
      vh_db: Number(vh_db.toFixed(2)),
      is_cloud_contaminated: isCloud,
      is_missing: isMissing,
    });
  }

  return {
    scenario_id: `TCC-SCEN-DSR-${isAmbiguous ? "AMB" : "STD"}-${seed}`,
    scenario_category: "rice_season",
    practice_type: "DSR",
    data_origin: "synthetic",
    label_origin: "simulated",
    validation_class: "engineering_only",
    seed,
    observations,
    description: isAmbiguous
      ? "Simulated DSR trajectory with overlapping radar signatures simulating rain-wetted establishment."
      : "Standard simulated DSR trajectory with dry-seeded unpuddled establishment.",
    ...(isAmbiguous
      ? {
          ambiguity_notes:
            "Radar backscatter between days 10–25 overlaps with conventional wet fields; demonstrates why physical ground truth is required.",
        }
      : {}),
  };
}

/**
 * Generates a synthetic Puddled Transplanted Rice (PTR) seasonal trajectory.
 * Demonstrates early-season puddling with sharp specular reflection drop.
 */
export function generatePtrScenarioTrajectory(
  seed: number = 202,
  isAmbiguous: boolean = false
): SyntheticScenarioTrajectory {
  const prng = new Mulberry32PRNG(seed);
  const observations: SyntheticScenarioTrajectory["observations"] = [];
  const baseDates = [
    { day: 5, date: "2024-06-20" },
    { day: 15, date: "2024-06-30" }, // Puddling & transplanting
    { day: 30, date: "2024-07-15" }, // Standing water
    { day: 45, date: "2024-07-30" },
    { day: 60, date: "2024-08-14" },
    { day: 75, date: "2024-08-29" },
    { day: 90, date: "2024-09-13" },
    { day: 105, date: "2024-09-28" },
    { day: 120, date: "2024-10-13" },
    { day: 135, date: "2024-10-28" },
  ];

  for (const item of baseDates) {
    let ndvi = 0.15;
    let vv_db = -17.5; // Puddled water signature
    let vh_db = -24.0;
    let ndmi = -0.15;
    let evi = 0.10;
    let ndre = 0.12;
    let isCloud = false;
    let isMissing = false;

    if (item.day <= 30) {
      // Intense puddling & standing water
      ndvi = prng.range(0.12, 0.18);
      // Sharp specular drop: VV < -16.0 dB (or slightly higher if ambiguous wind roughening)
      vv_db = isAmbiguous ? prng.range(-15.2, -14.1) : prng.range(-18.5, -16.2);
      vh_db = vv_db - 6.5;
      ndmi = prng.range(-0.25, -0.10); // Water absorption
      evi = ndvi * 0.75;
      ndre = ndvi * 0.80;
    } else if (item.day <= 60) {
      // Rapid canopy emergence out of standing water
      const progress = (item.day - 30) / 30;
      ndvi = 0.18 + progress * (0.68 - 0.18) + prng.range(-0.02, 0.02);
      vv_db = -16.0 + progress * 6.5; // Double-bounce and volume scattering rises
      vh_db = vv_db - 6.0;
      ndmi = -0.10 + progress * 0.45;
      evi = ndvi * 0.85;
      ndre = ndvi * 0.82;
      if (item.day === 45) isCloud = true;
    } else if (item.day <= 95) {
      // Peak canopy
      ndvi = prng.range(0.76, 0.85);
      vv_db = prng.range(-9.2, -7.8);
      vh_db = vv_db - 5.2;
      ndmi = prng.range(0.40, 0.48);
      evi = prng.range(0.68, 0.78);
      ndre = prng.range(0.58, 0.68);
    } else {
      // Harvest dry-down
      const progress = (item.day - 95) / 40;
      ndvi = 0.78 - progress * 0.48 + prng.range(-0.03, 0.03);
      vv_db = -8.5 - progress * 2.8;
      vh_db = vv_db - 7.2;
      ndmi = 0.42 - progress * 0.32;
      evi = ndvi * 0.80;
      ndre = ndvi * 0.72;
    }

    observations.push({
      date: item.date,
      day_of_season: item.day,
      ndvi: Number(ndvi.toFixed(4)),
      ndmi: Number(ndmi.toFixed(4)),
      evi: Number(evi.toFixed(4)),
      ndre: Number(ndre.toFixed(4)),
      vv_db: Number(vv_db.toFixed(2)),
      vh_db: Number(vh_db.toFixed(2)),
      is_cloud_contaminated: isCloud,
      is_missing: isMissing,
    });
  }

  return {
    scenario_id: `TCC-SCEN-PTR-${isAmbiguous ? "AMB" : "STD"}-${seed}`,
    scenario_category: "rice_season",
    practice_type: "PTR",
    data_origin: "synthetic",
    label_origin: "simulated",
    validation_class: "engineering_only",
    seed,
    observations,
    description: isAmbiguous
      ? "Simulated PTR trajectory with wind-roughened puddling dampening specular reflection."
      : "Standard simulated PTR trajectory with clear puddling specular reflection drop below -16.0 dB.",
    ...(isAmbiguous
      ? {
          ambiguity_notes:
            "Wind-roughened water surface elevates backscatter by 2–3 dB, showing why optical/radar fusion is necessary.",
        }
      : {}),
  };
}

/**
 * Generates a synthetic Wheat (Rabi season) trajectory.
 * November 15 to April 15 (151 days).
 */
export function generateWheatScenarioTrajectory(seed: number = 303): SyntheticScenarioTrajectory {
  const prng = new Mulberry32PRNG(seed);
  const observations: SyntheticScenarioTrajectory["observations"] = [];
  const baseDates = [
    { day: 10, date: "2024-11-25" },
    { day: 30, date: "2024-12-15" },
    { day: 55, date: "2025-01-09" },
    { day: 80, date: "2025-02-03" }, // Peak vegetative / heading
    { day: 105, date: "2025-02-28" },
    { day: 130, date: "2025-03-25" }, // Grain fill / senescence
    { day: 145, date: "2025-04-09" }, // Harvesting
  ];

  for (const item of baseDates) {
    let ndvi = 0.20;
    let vv_db = -12.5;
    let vh_db = -19.5;
    let ndmi = 0.10;
    let evi = 0.15;
    let ndre = 0.16;

    if (item.day <= 30) {
      ndvi = prng.range(0.18, 0.28);
      vv_db = prng.range(-13.0, -11.5);
      vh_db = vv_db - 7.5;
    } else if (item.day <= 80) {
      const progress = (item.day - 30) / 50;
      ndvi = 0.28 + progress * (0.82 - 0.28);
      vv_db = -12.0 + progress * 2.5;
      vh_db = vv_db - 6.0;
      ndmi = 0.15 + progress * 0.30;
    } else {
      const progress = (item.day - 80) / 65;
      ndvi = 0.82 - progress * 0.55;
      vv_db = -9.5 - progress * 2.0;
      vh_db = vv_db - 7.0;
      ndmi = 0.45 - progress * 0.35;
    }

    evi = ndvi * 0.85;
    ndre = ndvi * 0.80;

    observations.push({
      date: item.date,
      day_of_season: item.day,
      ndvi: Number(ndvi.toFixed(4)),
      ndmi: Number(ndmi.toFixed(4)),
      evi: Number(evi.toFixed(4)),
      ndre: Number(ndre.toFixed(4)),
      vv_db: Number(vv_db.toFixed(2)),
      vh_db: Number(vh_db.toFixed(2)),
      is_cloud_contaminated: false,
      is_missing: false,
    });
  }

  return {
    scenario_id: `TCC-SCEN-WHT-${seed}`,
    scenario_category: "wheat_season",
    practice_type: "Wheat_Conventional",
    data_origin: "synthetic",
    label_origin: "simulated",
    validation_class: "engineering_only",
    seed,
    observations,
    description: "Simulated Rabi wheat phenological cycle with winter vegetative peak and spring senescence.",
  };
}

/**
 * Generates a synthetic Fallow / Bare Soil trajectory.
 */
export function generateFallowScenarioTrajectory(seed: number = 404): SyntheticScenarioTrajectory {
  const prng = new Mulberry32PRNG(seed);
  const observations: SyntheticScenarioTrajectory["observations"] = [];
  const dates = ["2024-06-20", "2024-07-20", "2024-08-20", "2024-09-20", "2024-10-20"];

  dates.forEach((date, idx) => {
    observations.push({
      date,
      day_of_season: idx * 30 + 5,
      ndvi: Number(prng.range(0.12, 0.22).toFixed(4)),
      ndmi: Number(prng.range(-0.05, 0.08).toFixed(4)),
      evi: Number(prng.range(0.08, 0.15).toFixed(4)),
      ndre: Number(prng.range(0.09, 0.16).toFixed(4)),
      vv_db: Number(prng.range(-12.5, -10.5).toFixed(2)),
      vh_db: Number(prng.range(-20.0, -18.0).toFixed(2)),
      is_cloud_contaminated: false,
      is_missing: false,
    });
  });

  return {
    scenario_id: `TCC-SCEN-FAL-${seed}`,
    scenario_category: "fallow",
    practice_type: "Fallow",
    data_origin: "synthetic",
    label_origin: "simulated",
    validation_class: "engineering_only",
    seed,
    observations,
    description: "Simulated persistent fallow field with bare soil reflectance and baseline roughness.",
  };
}

/**
 * Generates a synthetic Water / Flooded trajectory.
 */
export function generateFloodedScenarioTrajectory(seed: number = 505): SyntheticScenarioTrajectory {
  const prng = new Mulberry32PRNG(seed);
  const observations: SyntheticScenarioTrajectory["observations"] = [];
  const dates = ["2024-06-20", "2024-07-20", "2024-08-20", "2024-09-20", "2024-10-20"];

  dates.forEach((date, idx) => {
    observations.push({
      date,
      day_of_season: idx * 30 + 5,
      ndvi: Number(prng.range(-0.35, -0.15).toFixed(4)),
      ndmi: Number(prng.range(-0.45, -0.25).toFixed(4)),
      evi: Number(prng.range(-0.15, -0.05).toFixed(4)),
      ndre: Number(prng.range(-0.20, -0.08).toFixed(4)),
      vv_db: Number(prng.range(-21.0, -17.5).toFixed(2)), // Deep specular drop
      vh_db: Number(prng.range(-28.0, -24.5).toFixed(2)),
      is_cloud_contaminated: false,
      is_missing: false,
    });
  });

  return {
    scenario_id: `TCC-SCEN-FLD-${seed}`,
    scenario_category: "water_flooded",
    practice_type: "Flooded",
    data_origin: "synthetic",
    label_origin: "simulated",
    validation_class: "engineering_only",
    seed,
    observations,
    description: "Simulated permanent water / inundated reservoir with persistent specular scattering and negative NDVI.",
  };
}
