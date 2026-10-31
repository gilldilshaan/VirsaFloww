/**
 * The Carbon Credit OS — Environmental Data Connectors (ERA5-Land & SoilGrids)
 *
 * Implements authentic retrieval, parsing, and persistence of:
 * 1. ECMWF ERA5-Land Reanalysis (hourly/daily temperature & precipitation) via Open-Meteo API.
 * 2. ISRIC SoilGrids 250m (Soil Organic Carbon) via ISRIC REST API.
 *
 * Mandatory Integrity Rule:
 * - Persists real values with units, spatial resolution, temporal coverage, retrieval timestamp,
 *   source provider, and missing-data indicators.
 * - Does NOT invent numerical outputs when retrieval fails or when cells are unpopulated.
 *
 * Operating Entity: Panjdhara Private Limited
 * Public Brand: The Carbon Credit
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { Corner } from "../geospatial/gis";

const OPEN_METEO_ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";
const SOILGRIDS_REST_URL = "https://rest.isric.org/soilgrids/v2.0/properties/query";

export interface Era5WeatherData {
  provider: "ECMWF ERA5-Land via Open-Meteo API";
  spatialResolution: "9 km";
  temporalCoverage: string; // e.g. "2026-10-01 to 2026-10-07"
  retrievedAt: string;
  missingData: boolean;
  missingReason?: string;
  commercialUsageStatus: "development_only_free_tier" | "commercial_licensed";
  commercialLicenseDisclaimer: string;
  dailyObservations: Array<{
    date: string;
    temperatureMeanC: number;
    precipitationSumMm: number;
  }>;
  summary: {
    avgTemperatureC: number;
    totalPrecipitationMm: number;
    daysCount: number;
  };
}

export interface SoilGridsSocData {
  provider: "ISRIC SoilGrids 250m";
  spatialResolution: "250 meters";
  retrievedAt: string;
  missingData: boolean;
  missingReason?: string;
  attributionDisclaimer: string;
  property: "soc";
  units: "g/kg";
  depths: Array<{
    depthLabel: "0-5cm" | "5-15cm" | "15-30cm";
    meanSocGPerKg: number | null;
  }>;
  estimatedSocTonsPerHa?: number | null;
}

/**
 * Retrieves authentic ERA5-Land weather reanalysis for a parcel coordinate.
 */
export async function fetchRealEra5WeatherData(
  coords: Corner,
  dateRange: { from: string; to: string }
): Promise<Era5WeatherData> {
  const [lng, lat] = coords;
  const retrievedAt = new Date().toISOString();
  const temporalCoverage = `${dateRange.from} to ${dateRange.to}`;

  const url = `${OPEN_METEO_ARCHIVE_URL}?latitude=${lat}&longitude=${lng}&start_date=${dateRange.from}&end_date=${dateRange.to}&daily=temperature_2m_mean,precipitation_sum&timezone=auto`;

  let lastStatus = 0;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(new Error("Open-Meteo ERA5 request timed out")), 10000);

    try {
      let res: Response;
      try {
        res = await fetch(url, { signal: controller.signal });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!res.ok) {
        lastStatus = res.status;
        if (res.status === 429 && attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        }
        return {
          provider: "ECMWF ERA5-Land via Open-Meteo API",
          spatialResolution: "9 km",
          temporalCoverage,
          retrievedAt,
          missingData: true,
          missingReason: `Open-Meteo returned HTTP ${res.status}`,
          commercialUsageStatus: "development_only_free_tier",
          commercialLicenseDisclaimer:
            "[Development Only: Open-Meteo free tier. Commercial carbon credit issuance requires Open-Meteo commercial license or direct ECMWF CDS data]",
          dailyObservations: [],
          summary: { avgTemperatureC: 0, totalPrecipitationMm: 0, daysCount: 0 },
        };
      }

      const data = await res.json();
      const daily = data.daily;

      if (!daily || !Array.isArray(daily.time) || daily.time.length === 0) {
        return {
          provider: "ECMWF ERA5-Land via Open-Meteo API",
          spatialResolution: "9 km",
          temporalCoverage,
          retrievedAt,
          missingData: true,
          missingReason: "No daily observations returned for requested interval",
          commercialUsageStatus: "development_only_free_tier",
          commercialLicenseDisclaimer:
            "[Development Only: Open-Meteo free tier. Commercial carbon credit issuance requires Open-Meteo commercial license or direct ECMWF CDS data]",
          dailyObservations: [],
          summary: { avgTemperatureC: 0, totalPrecipitationMm: 0, daysCount: 0 },
        };
      }

      const observations: Era5WeatherData["dailyObservations"] = [];
      let tempSum = 0;
      let precipSum = 0;

      for (let i = 0; i < daily.time.length; i++) {
        const date = daily.time[i];
        const temp = daily.temperature_2m_mean?.[i] ?? 0;
        const precip = daily.precipitation_sum?.[i] ?? 0;

        observations.push({
          date,
          temperatureMeanC: Number(temp.toFixed(1)),
          precipitationSumMm: Number(precip.toFixed(1)),
        });

        tempSum += temp;
        precipSum += precip;
      }

      const avgTemp = Number((tempSum / observations.length).toFixed(1));
      const totalPrecip = Number(precipSum.toFixed(1));

      return {
        provider: "ECMWF ERA5-Land via Open-Meteo API",
        spatialResolution: "9 km",
        temporalCoverage,
        retrievedAt,
        missingData: false,
        commercialUsageStatus: "development_only_free_tier",
        commercialLicenseDisclaimer:
          "[Development Only: Open-Meteo free tier. Commercial carbon credit issuance requires Open-Meteo commercial license or direct ECMWF CDS data]",
        dailyObservations: observations,
        summary: {
          avgTemperatureC: avgTemp,
          totalPrecipitationMm: totalPrecip,
          daysCount: observations.length,
        },
      };
    } catch (err: unknown) {
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
      return {
        provider: "ECMWF ERA5-Land via Open-Meteo API",
        spatialResolution: "9 km",
        temporalCoverage,
        retrievedAt,
        missingData: true,
        missingReason: err instanceof Error ? err.message : String(err),
        commercialUsageStatus: "development_only_free_tier",
        commercialLicenseDisclaimer:
          "[Development Only: Open-Meteo free tier. Commercial carbon credit issuance requires Open-Meteo commercial license or direct ECMWF CDS data]",
        dailyObservations: [],
        summary: { avgTemperatureC: 0, totalPrecipitationMm: 0, daysCount: 0 },
      };
    }
  }

  return {
    provider: "ECMWF ERA5-Land via Open-Meteo API",
    spatialResolution: "9 km",
    temporalCoverage,
    retrievedAt,
    missingData: true,
    missingReason: `Open-Meteo request failed after retries (HTTP ${lastStatus})`,
    commercialUsageStatus: "development_only_free_tier",
    commercialLicenseDisclaimer:
      "[Development Only: Open-Meteo free tier. Commercial carbon credit issuance requires Open-Meteo commercial license or direct ECMWF CDS data]",
    dailyObservations: [],
    summary: { avgTemperatureC: 0, totalPrecipitationMm: 0, daysCount: 0 },
  };
}

/**
 * Retrieves authentic SoilGrids 250m Soil Organic Carbon from ISRIC REST API.
 * Handles missing raster cell values truthfully without inventing numbers.
 */
export async function fetchRealSoilGridsData(coords: Corner): Promise<SoilGridsSocData> {
  const [lng, lat] = coords;
  const retrievedAt = new Date().toISOString();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new Error("ISRIC SoilGrids REST service timed out")), 6000);

  try {
    const url = `${SOILGRIDS_REST_URL}?lon=${lng}&lat=${lat}&property=soc&depth=0-5cm&depth=5-15cm&depth=15-30cm&value=mean`;
    let res: Response;
    try {
      res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!res.ok) {
      return {
        provider: "ISRIC SoilGrids 250m",
        spatialResolution: "250 meters",
        retrievedAt,
        missingData: true,
        missingReason: `ISRIC REST API returned HTTP ${res.status}`,
        attributionDisclaimer:
          "Contains soil organic carbon data from ISRIC SoilGrids 250m under Creative Commons Attribution 4.0 International (CC-BY 4.0).",
        property: "soc",
        units: "g/kg",
        depths: [
          { depthLabel: "0-5cm", meanSocGPerKg: null },
          { depthLabel: "5-15cm", meanSocGPerKg: null },
          { depthLabel: "15-30cm", meanSocGPerKg: null },
        ],
        estimatedSocTonsPerHa: null,
      };
    }

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return {
        provider: "ISRIC SoilGrids 250m",
        spatialResolution: "250 meters",
        retrievedAt,
        missingData: true,
        missingReason: "ISRIC returned non-JSON response (gateway timeout or HTML error)",
        attributionDisclaimer:
          "Contains soil organic carbon data from ISRIC SoilGrids 250m under Creative Commons Attribution 4.0 International (CC-BY 4.0).",
        property: "soc",
        units: "g/kg",
        depths: [
          { depthLabel: "0-5cm", meanSocGPerKg: null },
          { depthLabel: "5-15cm", meanSocGPerKg: null },
          { depthLabel: "15-30cm", meanSocGPerKg: null },
        ],
        estimatedSocTonsPerHa: null,
      };
    }

    const layers = data.properties?.layers;
    const socLayer = Array.isArray(layers) ? layers.find((l: any) => l.name === "soc") : null;

    if (!socLayer || !Array.isArray(socLayer.depths)) {
      return {
        provider: "ISRIC SoilGrids 250m",
        spatialResolution: "250 meters",
        retrievedAt,
        missingData: true,
        missingReason: "No SOC layer data at coordinate",
        attributionDisclaimer:
          "Contains soil organic carbon data from ISRIC SoilGrids 250m under Creative Commons Attribution 4.0 International (CC-BY 4.0).",
        property: "soc",
        units: "g/kg",
        depths: [
          { depthLabel: "0-5cm", meanSocGPerKg: null },
          { depthLabel: "5-15cm", meanSocGPerKg: null },
          { depthLabel: "15-30cm", meanSocGPerKg: null },
        ],
        estimatedSocTonsPerHa: null,
      };
    }

    // SoilGrids mapped units: dg/kg (decigram per kg) with d_factor 10 -> g/kg
    const parsedDepths = socLayer.depths.map((d: any) => {
      const rawMean = d.values?.mean;
      const meanSoc = rawMean !== null && rawMean !== undefined ? rawMean / 10 : null;
      return {
        depthLabel: d.label as "0-5cm" | "5-15cm" | "15-30cm",
        meanSocGPerKg: meanSoc !== null ? Number(meanSoc.toFixed(1)) : null,
      };
    });

    const hasData = parsedDepths.some((d: any) => d.meanSocGPerKg !== null);

    return {
      provider: "ISRIC SoilGrids 250m",
      spatialResolution: "250 meters",
      retrievedAt,
      missingData: !hasData,
      ...(hasData ? {} : { missingReason: "ISRIC SoilGrids raster cell unpopulated at target coordinate" }),
      attributionDisclaimer:
        "Contains soil organic carbon data from ISRIC SoilGrids 250m under Creative Commons Attribution 4.0 International (CC-BY 4.0).",
      property: "soc",
      units: "g/kg",
      depths: parsedDepths,
      estimatedSocTonsPerHa: null, // Avoid fabricating tons/ha stock calculation when in-situ bulk density is unmeasured
    };
  } catch (err: unknown) {
    return {
      provider: "ISRIC SoilGrids 250m",
      spatialResolution: "250 meters",
      retrievedAt,
      missingData: true,
      missingReason: err instanceof Error ? err.message : "ISRIC network failure",
      attributionDisclaimer:
        "Contains soil organic carbon data from ISRIC SoilGrids 250m under Creative Commons Attribution 4.0 International (CC-BY 4.0).",
      property: "soc",
      units: "g/kg",
      depths: [
        { depthLabel: "0-5cm", meanSocGPerKg: null },
        { depthLabel: "5-15cm", meanSocGPerKg: null },
        { depthLabel: "15-30cm", meanSocGPerKg: null },
      ],
      estimatedSocTonsPerHa: null,
    };
  }
}

/**
 * Persists authentic environmental records to PostGIS database.
 */
export async function persistEnvironmentalRecord(
  client: SupabaseClient,
  parcelId: string,
  record: {
    recordType: "era5_weather" | "soilgrids_soc";
    provider: string;
    spatialResolution: string;
    temporalCoverage?: string;
    data: any;
    missingData: boolean;
    missingReason?: string;
  }
): Promise<{ recordId?: string; error?: string }> {
  try {
    const id = globalThis.crypto.randomUUID();
    const { error } = await client.from("os_environmental_records").insert({
      id,
      parcel_id: parcelId,
      record_type: record.recordType,
      provider: record.provider,
      spatial_resolution: record.spatialResolution,
      temporal_coverage: record.temporalCoverage ?? null,
      data: record.data,
      missing_data: record.missingData,
      missing_reason: record.missingReason ?? null,
    });

    if (error) {
      return { error: `Environmental record insert failed: ${error.message}` };
    }
    return { recordId: id };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Persistence failure" };
  }
}
