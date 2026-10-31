import { describe, expect, it } from 'vitest';
import { adaptPostgisCoordinates, PostgisPolygonField } from './helpers/test-harness';

describe('E2E PostGIS Coordinate Adapter & Geometry Boundary Fallbacks', () => {
  describe('Tier 1: Feature Coverage (Coordinate Adapter & Normalization)', () => {
    it('1.1 adapts valid PostGIS polygon coordinates into frontend [lat, lng] coordinate array', () => {
      const rawPolygon = [
        [30.901, 75.857],
        [30.905, 75.857],
        [30.905, 75.862],
        [30.901, 75.862],
        [30.901, 75.857], // Closed ring
      ];

      const adapted = adaptPostgisCoordinates(rawPolygon);
      expect(adapted).toHaveLength(5);
      expect(adapted[0]).toEqual([30.901, 75.857]);
      expect(adapted[4]).toEqual([30.901, 75.857]);
    });

    it('1.2 handles empty boundary polygon with safe empty array fallback [] without throwing', () => {
      const emptyPolygon: number[][] = [];
      const adapted = adaptPostgisCoordinates(emptyPolygon);

      expect(adapted).toEqual([]);
      expect(Array.isArray(adapted)).toBe(true);
      expect(adapted).toHaveLength(0);
    });

    it('1.3 handles null and undefined boundaryPolygon gracefully with empty array fallback', () => {
      expect(adaptPostgisCoordinates(null)).toEqual([]);
      expect(adaptPostgisCoordinates(undefined)).toEqual([]);
    });

    it('1.4 preserves high precision GPS coordinate floats from backend GeoAlchemy model', () => {
      const highPrecisionPolygon = [
        [30.901234567, 75.857654321],
        [30.905432109, 75.857123456],
      ];

      const adapted = adaptPostgisCoordinates(highPrecisionPolygon);
      expect(adapted[0]?.[0]).toBe(30.901234567);
      expect(adapted[0]?.[1]).toBe(75.857654321);
    });

    it('1.5 integrates with field parcel schema containing centroid coordinates and boundary', () => {
      const fieldData: PostgisPolygonField = {
        id: 'PB-FIELD-001',
        code: 'PB-FIELD-001',
        name: 'Gill Farm Sector 4',
        farmerId: 'FARMER-01',
        district: 'Ludhiana',
        state: 'Punjab',
        areaHa: 4.5,
        areaAcres: 11.12,
        practice: 'Direct Seeded Rice (DSR)',
        crop: 'PR-126 Basmati / Paddy',
        season: 'Kharif 2026',
        coordinates: { lat: 30.903, lng: 75.859 },
        boundaryPolygon: [
          [30.901, 75.857],
          [30.905, 75.857],
          [30.905, 75.862],
          [30.901, 75.862],
          [30.901, 75.857],
        ],
      };

      const coords = adaptPostgisCoordinates(fieldData.boundaryPolygon);
      expect(coords.length).toBeGreaterThan(0);
      expect(fieldData.coordinates.lat).toBe(30.903);
      expect(fieldData.coordinates.lng).toBe(75.859);
    });
  });

  describe('Tier 2: Boundary & Corner Cases (Geometry Anomalies & Out-of-Bounds)', () => {
    it('2.1 filters out points with invalid latitudes exceeding [-90, +90] range', () => {
      const invalidLatPolygon = [
        [30.901, 75.857],
        [95.0, 75.857], // Invalid lat > 90
        [-92.0, 75.857], // Invalid lat < -90
        [30.905, 75.862],
      ];

      const adapted = adaptPostgisCoordinates(invalidLatPolygon);
      expect(adapted).toHaveLength(2);
      expect(adapted[0]).toEqual([30.901, 75.857]);
      expect(adapted[1]).toEqual([30.905, 75.862]);
    });

    it('2.2 filters out points with invalid longitudes exceeding [-180, +180] range', () => {
      const invalidLngPolygon = [
        [30.901, 75.857],
        [30.905, 185.0], // Invalid lng > 180
        [30.905, -190.0], // Invalid lng < -180
        [30.901, 75.862],
      ];

      const adapted = adaptPostgisCoordinates(invalidLngPolygon);
      expect(adapted).toHaveLength(2);
      expect(adapted[0]).toEqual([30.901, 75.857]);
      expect(adapted[1]).toEqual([30.901, 75.862]);
    });

    it('2.3 filters out NaN and malformed coordinate elements', () => {
      const malformedPolygon = [
        [NaN, 75.857],
        [30.901, NaN],
        [30.905, 75.857],
        ['invalid_string', 75.857],
      ] as unknown as number[][];

      const adapted = adaptPostgisCoordinates(malformedPolygon);
      expect(adapted).toHaveLength(1);
      expect(adapted[0]).toEqual([30.905, 75.857]);
    });

    it('2.4 handles non-array or nested irregular structures safely', () => {
      // @ts-expect-error testing runtime resilience
      expect(adaptPostgisCoordinates('not-an-array')).toEqual([]);
      // @ts-expect-error testing runtime resilience
      expect(adaptPostgisCoordinates(12345)).toEqual([]);
      // @ts-expect-error testing runtime resilience
      expect(adaptPostgisCoordinates({})).toEqual([]);
    });

    it('2.5 computes bounding box safely when coordinates exist, or null when empty', () => {
      function computeBoundingBox(coords: [number, number][]): { minLat: number; maxLat: number; minLng: number; maxLng: number } | null {
        if (coords.length === 0) return null;
        let minLat = Infinity;
        let maxLat = -Infinity;
        let minLng = Infinity;
        let maxLng = -Infinity;

        for (const [lat, lng] of coords) {
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
          if (lng < minLng) minLng = lng;
          if (lng > maxLng) maxLng = lng;
        }

        return { minLat, maxLat, minLng, maxLng };
      }

      const emptyResult = computeBoundingBox(adaptPostgisCoordinates([]));
      expect(emptyResult).toBeNull();

      const validResult = computeBoundingBox(
        adaptPostgisCoordinates([
          [30.0, 70.0],
          [35.0, 75.0],
        ])
      );
      expect(validResult).toEqual({ minLat: 30.0, maxLat: 35.0, minLng: 70.0, maxLng: 75.0 });
    });
  });
});
