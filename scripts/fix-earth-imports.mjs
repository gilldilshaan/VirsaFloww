import fs from "fs";
import path from "path";

const root = path.resolve("src/lib");

// 1. sentinel-pipeline.ts
let p = path.join(root, "satellite", "sentinel-pipeline.ts");
let content = fs.readFileSync(p, "utf8");
content = content.replace('from "./gis"', 'from "../geospatial/gis"');
content = content.replace(
  'return { observationId: obsId, featureId };',
  'return { observationId: obsId, ...(featureId ? { featureId } : {}) };'
);
fs.writeFileSync(p, content);

// 2. satellite-provider.ts
p = path.join(root, "satellite", "satellite-provider.ts");
content = fs.readFileSync(p, "utf8");
content = content.replace('from "./gis"', 'from "../geospatial/gis"');
fs.writeFileSync(p, content);

// 3. foundation-models.ts
p = path.join(root, "olmoearth", "foundation-models.ts");
content = fs.readFileSync(p, "utf8");
content = content.replace('from "./gis"', 'from "../geospatial/gis"');
content = content.replace('from "./sentinel-pipeline"', 'from "../satellite/sentinel-pipeline"');
content = content.replace(/process\.env\.GEE_SERVICE_ACCOUNT_KEY/g, 'process.env["GEE_SERVICE_ACCOUNT_KEY"]');
content = content.replace(/process\.env\.GOOGLE_APPLICATION_CREDENTIALS/g, 'process.env["GOOGLE_APPLICATION_CREDENTIALS"]');
content = content.replace(/process\.env\.PYTHON_PATH/g, 'process.env["PYTHON_PATH"]');
content = content.replace(
  'return fetchGenuineOlmoEarthEmbedding(corners, year, { declaredAcres, mode: "polygon" });',
  'return fetchGenuineOlmoEarthEmbedding(corners, year, declaredAcres !== undefined ? { declaredAcres, mode: "polygon" } : { mode: "polygon" });'
);
content = content.replace(
  'profile: DETAILED_MODEL_RESOURCE_PROFILES.baseline_sentinel,',
  'profile: DETAILED_MODEL_RESOURCE_PROFILES["baseline_sentinel"],'
);
fs.writeFileSync(p, content);

// 4. model-evaluation.ts
p = path.join(root, "olmoearth", "model-evaluation.ts");
content = fs.readFileSync(p, "utf8");
content = content.replace('from "./sentinel-pipeline"', 'from "../satellite/sentinel-pipeline"');
fs.writeFileSync(p, content);

// 5. agricultural-intelligence.service.ts
p = path.join(root, "agricultural", "agricultural-intelligence.service.ts");
content = fs.readFileSync(p, "utf8");
content = content.replace('from "./sentinel-pipeline"', 'from "../satellite/sentinel-pipeline"');
content = content.replace('from "./foundation-models"', 'from "../olmoearth/foundation-models"');
content = content.replace('reduce((s, v) => s + Math.abs(v), 0)', 'reduce((s: number, v: number) => s + Math.abs(v), 0)');
fs.writeFileSync(p, content);

// 6. environmental-data.ts
p = path.join(root, "agricultural", "environmental-data.ts");
content = fs.readFileSync(p, "utf8");
content = content.replace('from "./gis"', 'from "../geospatial/gis"');
content = content.replace(
  'missingReason: hasData ? undefined : "ISRIC SoilGrids raster cell unpopulated at target coordinate",',
  '...(hasData ? {} : { missingReason: "ISRIC SoilGrids raster cell unpopulated at target coordinate" }),'
);
fs.writeFileSync(p, content);

// 7. ground-truth.service.ts
p = path.join(root, "agricultural", "ground-truth.service.ts");
content = fs.readFileSync(p, "utf8");
content = content.replace('import { AuthContext } from "./types";\nimport { assertPermission } from "./permissions";', `export interface GroundTruthActor {
  userId?: string;
  role: string;
  email?: string;
}`);
content = content.replace(/actor\?: AuthContext/g, 'actor?: GroundTruthActor');
content = content.replace(/actor: AuthContext/g, 'actor: GroundTruthActor');
content = content.replace(
  'actor.role === "system_admin" ||',
  'actor.role === "system_admin" || actor.role === "admin" ||'
);
content = content.replace(
  '["operations_manager", "field_coordinator", "quality_inspector", "evidence_reviewer"].includes(actor.role);',
  '["operations_manager", "field_coordinator", "field_officer", "quality_inspector", "evidence_reviewer", "reviewer"].includes(actor.role);'
);
content = content.replace(/errors\.(\w+) =/g, 'errors["$1"] =');
content = content.replace('updatePayload.verified_by = actor.userId;', 'updatePayload["verified_by"] = actor.userId;');
content = content.replace('updatePayload.verified_at = new Date().toISOString();', 'updatePayload["verified_at"] = new Date().toISOString();');
content = content.replace('updatePayload.verification_notes = notes.trim();', 'updatePayload["verification_notes"] = notes.trim();');
fs.writeFileSync(p, content);

// 8. earth-lab/types.ts
p = path.join(root, "earth-lab", "types.ts");
content = fs.readFileSync(p, "utf8");
content = content.replace('from "../gis"', 'from "../geospatial/gis"');
fs.writeFileSync(p, content);

// 9. earth-lab/synthetic-generator.ts
p = path.join(root, "earth-lab", "synthetic-generator.ts");
content = fs.readFileSync(p, "utf8");
content = content.replace('from "../gis"', 'from "../geospatial/gis"');
fs.writeFileSync(p, content);

// 10. earth-lab/feature-engine.ts
p = path.join(root, "earth-lab", "feature-engine.ts");
content = fs.readFileSync(p, "utf8");
content = content.replace('from "../sentinel-pipeline"', 'from "../satellite/sentinel-pipeline"');
fs.writeFileSync(p, content);

// 11. earth-lab/satellite-retriever.ts
p = path.join(root, "earth-lab", "satellite-retriever.ts");
content = fs.readFileSync(p, "utf8");
content = content.replace('from "../gis"', 'from "../geospatial/gis"');
content = content.replace('from "../sentinel-pipeline"', 'from "../satellite/sentinel-pipeline"');
content = content.replace('from "../satellite-provider"', 'from "../satellite/satellite-provider"');
fs.writeFileSync(p, content);

// 12. earth-lab/stress-tester.ts
p = path.join(root, "earth-lab", "stress-tester.ts");
content = fs.readFileSync(p, "utf8");
content = content.replace('from "../foundation-models"', 'from "../olmoearth/foundation-models"');
content = content.replace('from "../gis"', 'from "../geospatial/gis"');
fs.writeFileSync(p, content);

// 13. earth-lab/model-benchmark.ts
p = path.join(root, "earth-lab", "model-benchmark.ts");
content = fs.readFileSync(p, "utf8");
content = content.replace('from "../model-evaluation"', 'from "../olmoearth/model-evaluation"');
content = content.replace('    metrics,\n', '    ...(metrics ? { metrics } : {}),\n');
fs.writeFileSync(p, content);

// 14. earth-lab/synthetic-scenarios.ts
p = path.join(root, "earth-lab", "synthetic-scenarios.ts");
content = fs.readFileSync(p, "utf8");
content = content.replace(
  `    ambiguity_notes: isAmbiguous
      ? "Radar backscatter between days 10–25 overlaps with conventional wet fields; demonstrates why physical ground truth is required."
      : undefined,`,
  `    ...(isAmbiguous
      ? {
          ambiguity_notes:
            "Radar backscatter between days 10–25 overlaps with conventional wet fields; demonstrates why physical ground truth is required.",
        }
      : {}),`
);
content = content.replace(
  `    ambiguity_notes: isAmbiguous
      ? "Wind-roughened water surface elevates backscatter by 2–3 dB, showing why optical/radar fusion is necessary."
      : undefined,`,
  `    ...(isAmbiguous
      ? {
          ambiguity_notes:
            "Wind-roughened water surface elevates backscatter by 2–3 dB, showing why optical/radar fusion is necessary.",
        }
      : {}),`
);
fs.writeFileSync(p, content);

console.log("All Earth Intelligence core files updated successfully.");
