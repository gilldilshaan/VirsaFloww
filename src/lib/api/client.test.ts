import { describe, it, expect } from "vitest";
import { api } from "./client";

describe("Workspace Typed API Client", () => {
  it("should list projects and get project by ID", async () => {
    const projects = await api.projects.list();
    expect(projects.length).toBeGreaterThan(0);
    const first = projects[0];
    expect(first).toBeDefined();
    if (first) {
      const single = await api.projects.getById(first.id);
      expect(single).not.toBeNull();
      expect(single?.id).toBe(first.id);
    }
  });

  it("should list farmers and verify KYC attributes", async () => {
    const farmers = await api.farmers.list();
    expect(farmers.length).toBeGreaterThan(0);
    const farmer = farmers.find((f) => f.id === "FARM-PB-001");
    expect(farmer).toBeDefined();
    expect(farmer?.name).toBe("Gurdev Singh Gill");
    expect(farmer?.district).toBe("Ludhiana");
  });

  it("should list field parcels and coordinates", async () => {
    const fields = await api.fields.list();
    expect(fields.length).toBeGreaterThan(0);
    const parcel = await api.fields.getById("PB-LUD-042");
    expect(parcel).not.toBeNull();
    expect(parcel?.code).toBe("PB-LUD-042");
    expect(parcel?.boundaryPolygon.length).toBeGreaterThanOrEqual(4);
  });

  it("should list review tasks and resolve an exception", async () => {
    const tasks = await api.reviews.listQueue();
    expect(tasks.length).toBeGreaterThan(0);
    const task = tasks[0];
    expect(task).toBeDefined();
    if (task) {
      const ok = await api.reviews.resolve(task.id, "Verified resolution");
      expect(ok).toBe(true);
      const updated = await api.reviews.getById(task.id);
      expect(updated?.status).toBe("resolved");
    }
  });

  it("should list MRV assessments and get assessment detail", async () => {
    const assessments = await api.assessments.list();
    expect(assessments.length).toBeGreaterThan(0);
    const asm = assessments[0];
    expect(asm).toBeDefined();
    if (asm) {
      expect(asm.criteriaChecks).toBeDefined();
      expect(asm.overallScorePercent).toBeGreaterThan(0);
    }
  });

  it("should retrieve geospatial layers for Terra Intelligence", async () => {
    const layers = await api.terraIntelligence.getLayers();
    expect(layers.length).toBeGreaterThan(0);
    const ndviLayer = layers.find((l) => l.type === "ndvi_spectral");
    expect(ndviLayer).toBeDefined();
    expect(ndviLayer?.resolution).toBe("10m / pixel");
  });

  it("should list operational reports and verify format", async () => {
    const reports = await api.reports.list();
    expect(reports.length).toBeGreaterThan(0);
    expect(reports[0]?.format).toBeDefined();
  });
});
