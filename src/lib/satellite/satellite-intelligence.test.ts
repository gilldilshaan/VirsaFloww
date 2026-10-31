import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { AUTHENTIC_SATELLITE_OBSERVATIONS } from './authentic-observations';
import { fetchGenuineOlmoEarthEmbedding } from '../olmoearth/foundation-models';
import { INITIAL_EVIDENCE_ITEMS, PRIMARY_FIELD } from '../terra-ledger/mock-data';

describe('Mission 3 — TCC Earth Intelligence: Authentic Satellite Pipeline', () => {
  it('contains exactly 7 genuine Copernicus Sentinel-2 L2A scenes across Kharif 2024', () => {
    expect(AUTHENTIC_SATELLITE_OBSERVATIONS.length).toBe(7);

    for (const obs of AUTHENTIC_SATELLITE_OBSERVATIONS) {
      expect(obs.dataOrigin).toBe('LIVE_OBSERVATION');
      expect(obs.provenanceStatus).toBe('PROCESSED_OBSERVATION');
      expect(obs.isDemo).toBe(false);
      expect(obs.stacCollection).toBe('sentinel-2-l2a');
      expect(obs.resolutionMeters).toBe(10.0);
      expect(['Sentinel-2A', 'Sentinel-2B']).toContain(obs.platform);
      expect(obs.id).toMatch(/^S2[AB]_43REQ_2024\d{4}_\d_L2A$/);
      expect(obs.dataLabel).toBe('Live Copernicus Sentinel-2 L2A');
    }
  });

  it('computes valid full-polygon index statistics (NDVI, NDWI, NDMI, EVI, NDRE) for every scene', () => {
    for (const obs of AUTHENTIC_SATELLITE_OBSERVATIONS) {
      const { ndvi, ndwi, ndmi, evi, ndre } = obs.stats;

      // NDVI
      expect(ndvi.min).toBeLessThanOrEqual(ndvi.mean);
      expect(ndvi.mean).toBeLessThanOrEqual(ndvi.max);
      expect(ndvi.median).toBeGreaterThanOrEqual(ndvi.min);
      expect(ndvi.median).toBeLessThanOrEqual(ndvi.max);
      expect(ndvi.stdDev).toBeGreaterThanOrEqual(0);

      // NDWI
      expect(ndwi.min).toBeLessThanOrEqual(ndwi.mean);
      expect(ndwi.mean).toBeLessThanOrEqual(ndwi.max);
      expect(ndwi.stdDev).toBeGreaterThanOrEqual(0);

      // NDMI, EVI, NDRE
      expect(ndmi.min).toBeLessThanOrEqual(ndmi.max);
      expect(evi.min).toBeLessThanOrEqual(evi.max);
      expect(ndre.min).toBeLessThanOrEqual(ndre.max);

      // Polygon coverage
      expect(obs.coverage.validPixelCount).toBeGreaterThan(0);
      expect(obs.coverage.totalPolygonPixels).toBe(6024);
      expect(obs.coverage.coveragePct).toBeGreaterThan(0);
      expect(obs.coverage.cloudContaminationPct).toBeGreaterThanOrEqual(0);
    }
  });

  it('reflects authentic Kharif 2024 agricultural phenology dynamics for Ludhiana parcel PB-FIELD-001', () => {
    const juneScene = AUTHENTIC_SATELLITE_OBSERVATIONS.find((o) => o.date === '2024-06-15');
    const julyScene = AUTHENTIC_SATELLITE_OBSERVATIONS.find((o) => o.date === '2024-07-15');
    const septPanicleScene = AUTHENTIC_SATELLITE_OBSERVATIONS.find((o) => o.date === '2024-09-23');
    const octGrainScene = AUTHENTIC_SATELLITE_OBSERVATIONS.find((o) => o.date === '2024-10-03');
    const postHarvestScene = AUTHENTIC_SATELLITE_OBSERVATIONS.find((o) => o.date === '2024-10-13');

    // Pre-seeding baseline in dry seedbed
    expect(juneScene).toBeDefined();
    expect(juneScene!.meanNdvi).toBe(0.1853);
    expect(juneScene!.meanNdwi).toBe(-0.2256);
    expect(juneScene!.surfaceWaterDetected).toBe(false);
    expect(juneScene!.phenologyStage).toContain('Direct Seeding');

    // Monsoon cloud masking and AWD flushing
    expect(julyScene).toBeDefined();
    expect(julyScene!.surfaceWaterDetected).toBe(true);
    expect(julyScene!.qualityRating).toBe('Cloud-Affected');
    expect(julyScene!.coverage.cloudContaminationPct).toBe(55.9);

    // Peak vegetative canopy closure
    expect(septPanicleScene).toBeDefined();
    expect(septPanicleScene!.meanNdvi).toBe(0.2884);
    expect(septPanicleScene!.meanNdwi).toBe(-0.2867);
    expect(septPanicleScene!.qualityRating).toBe('High');

    // Peak grain filling
    expect(octGrainScene).toBeDefined();
    expect(octGrainScene!.meanNdvi).toBe(0.3388);
    expect(octGrainScene!.meanNdwi).toBe(-0.3688);

    // Post harvest residue baseline
    expect(postHarvestScene).toBeDefined();
    expect(postHarvestScene!.meanNdvi).toBe(0.289);
    expect(postHarvestScene!.phenologyStage).toContain('Post-Harvest');
  });

  it('provides genuine georeferenced raster products stored on disk in public/rasters/', () => {
    for (const obs of AUTHENTIC_SATELLITE_OBSERVATIONS) {
      const layers = obs.rasterLayers;
      expect(layers.ndvi).toMatch(/^\/rasters\/S2[AB]_43REQ_2024\d{4}_\d_L2A\/ndvi\.png$/);
      expect(layers.ndwi).toMatch(/^\/rasters\/S2[AB]_43REQ_2024\d{4}_\d_L2A\/ndwi\.png$/);
      expect(layers.rgb).toMatch(/^\/rasters\/S2[AB]_43REQ_2024\d{4}_\d_L2A\/rgb\.png$/);
      expect(layers.false_color).toMatch(/^\/rasters\/S2[AB]_43REQ_2024\d{4}_\d_L2A\/false_color\.png$/);

      // Verify that every raster actually exists on disk in the public folder
      const ndviDiskPath = path.resolve('public', layers.ndvi.replace(/^\//, ''));
      const ndwiDiskPath = path.resolve('public', layers.ndwi.replace(/^\//, ''));
      const rgbDiskPath = path.resolve('public', layers.rgb.replace(/^\//, ''));

      expect(fs.existsSync(ndviDiskPath)).toBe(true);
      expect(fs.existsSync(ndwiDiskPath)).toBe(true);
      expect(fs.existsSync(rgbDiskPath)).toBe(true);

      // Verify 4-corner bounding coordinates for MapLibre image source overlay
      expect(layers.coordinates.length).toBe(4);
      const [nw, ne, se, sw] = layers.coordinates;
      expect(nw[0]).toBeCloseTo(75.8306, 3);
      expect(nw[1]).toBeCloseTo(30.9164, 3);
      expect(ne[0]).toBeCloseTo(75.8415, 3);
      expect(ne[1]).toBeCloseTo(30.9163, 3);
      expect(se[0]).toBeCloseTo(75.8414, 3);
      expect(se[1]).toBeCloseTo(30.9076, 3);
      expect(sw[0]).toBeCloseTo(75.8305, 3);
      expect(sw[1]).toBeCloseTo(30.9076, 3);
    }
  });

  it('incorporates Sentinel-1 C-SAR GRD radar co-observations with mandatory scientific notice', () => {
    for (const obs of AUTHENTIC_SATELLITE_OBSERVATIONS) {
      const radar = obs.radarCoObservation;
      expect(radar.sensor).toBe('Sentinel-1 C-SAR GRD');
      expect(radar.sceneId).toMatch(/^S1A_IW_GRDH_/);
      expect(radar.polarizations).toEqual(['VV', 'VH']);
      expect(radar.vvMeanDb).toBeLessThan(0);
      expect(radar.vhMeanDb).toBeLessThan(radar.vvMeanDb); // Cross-pol VH is lower than co-pol VV
      expect(radar.crossRatioDb).toBeCloseTo(radar.vhMeanDb - radar.vvMeanDb, 1);
      expect(radar.confidencePct).toBeGreaterThanOrEqual(85);

      // Mandatory scientific disclaimer against uncorroborated compliance claims
      expect(radar.scientificNotice).toContain('Literature Benchmark');
      expect(radar.scientificNotice).toContain('screening indicator');
      expect(radar.scientificNotice).toContain('cannot alone certify irrigation compliance');
    }
  });

  it('strictly enforces OlmoEarth scientific restraint without synthetic vector fabrication', async () => {
    const corners: [number, number][] = [
      [75.832, 30.908],
      [75.841, 30.9095],
      [75.8395, 30.916],
      [75.831, 30.914],
    ];

    // Request OlmoEarth embedding extraction when network or Zarr bridge is unavailable
    const result = await fetchGenuineOlmoEarthEmbedding(corners, 2024);

    expect(result.modelId).toBe('olmoearth-v1.3');
    // Adheres strictly to Mission 3 Section 9: zero synthetic vectors
    expect(result.vector).toEqual([]);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Experimental / Unavailable');
    expect(result.provenance).toContain('Under Section 9 Scientific Integrity Rules, embedding vectors are never simulated or fabricated');
  });

  it('enforces auditor review spatial discrepancy gating (+420m)', () => {
    // Flagged photograph EV-003 is located +420m outside the registered parcel boundary
    const flaggedPhoto = INITIAL_EVIDENCE_ITEMS.find((e) => e.id === 'EV-003');
    expect(flaggedPhoto).toBeDefined();
    expect(flaggedPhoto?.category).toBe('contradicting');
    expect(flaggedPhoto?.provenance.spatialDistanceMeters).toBe(420);

    // Primary parcel is PB-LUD-042 (4.8 ha in Ludhiana)
    expect(PRIMARY_FIELD.areaHa).toBe(4.8);
    expect(PRIMARY_FIELD.boundaryPolygon.length).toBe(4);
  });
});
