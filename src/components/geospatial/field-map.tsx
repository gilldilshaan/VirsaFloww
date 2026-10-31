import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layers, MapPin, Undo2, Check, Trash2, Maximize2, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FieldFeature {
  id: string;
  code: string;
  name: string;
  farmerName?: string;
  areaHa: number;
  status: 'READY_FOR_VERIFICATION' | 'NEEDS_REVIEW' | 'UNVERIFIED';
  coordinates: [number, number][]; // [lng, lat]
}

export interface RasterOverlayConfig {
  imageUrl: string;
  coordinates: [number, number][]; // 4 corners: [[minLng, maxLat], [maxLng, maxLat], [maxLng, minLat], [minLng, minLat]]
  opacity?: number;
}

interface FieldMapProps {
  fields?: FieldFeature[];
  selectedFieldId?: string;
  onSelectField?: (fieldId: string) => void;
  isDrawingMode?: boolean;
  onPolygonComplete?: (coords: [number, number][], areaHa: number, areaAcres: number) => void;
  showSatellite?: boolean;
  className?: string;
  height?: string;
  rasterOverlay?: RasterOverlayConfig | null;
  onHoverCoordinates?: (coords: { lng: number; lat: number } | null) => void;
}

// Calculate geodesic area using spherical polygon formula
export function calculateGeodesicArea(coords: [number, number][]): { sqMeters: number; ha: number; acres: number } {
  if (coords.length < 3) return { sqMeters: 0, ha: 0, acres: 0 };
  const rad = Math.PI / 180;
  let total = 0;
  const R = 6378137; // Earth radius in meters

  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];
    if (!p1 || !p2) continue;
    total += (p2[0] * rad - p1[0] * rad) * (2 + Math.sin(p1[1] * rad) + Math.sin(p2[1] * rad));
  }
  const sqMeters = Math.abs((total * R * R) / 2.0);
  const ha = Math.round((sqMeters / 10000) * 100) / 100;
  const acres = Math.round((ha * 2.47105) * 100) / 100;
  return { sqMeters, ha, acres };
}

const DEFAULT_PUNJAB_FIELDS: FieldFeature[] = [
  {
    id: 'PB-FIELD-001',
    code: 'PB-FIELD-001',
    name: 'Gill Agro Farms Parcel 1 (Jodhan)',
    farmerName: 'Gurdev Singh Gill',
    areaHa: 4.8,
    status: 'READY_FOR_VERIFICATION',
    coordinates: [
      [75.8320, 30.9080],
      [75.8410, 30.9095],
      [75.8395, 30.9160],
      [75.8310, 30.9140],
      [75.8320, 30.9080],
    ],
  },
  {
    id: 'PB-BTI-108',
    code: 'PB-BTI-108',
    name: 'Brar Farm Parcel (Maur, Bathinda)',
    farmerName: 'Harpreet Singh Brar',
    areaHa: 5.7,
    status: 'NEEDS_REVIEW',
    coordinates: [
      [75.2280, 30.0820],
      [75.2370, 30.0835],
      [75.2355, 30.0900],
      [75.2270, 30.0880],
      [75.2280, 30.0820],
    ],
  },
];

export function FieldMap({
  fields = DEFAULT_PUNJAB_FIELDS,
  selectedFieldId,
  onSelectField,
  isDrawingMode = false,
  onPolygonComplete,
  showSatellite = true,
  className = '',
  height = '460px',
  rasterOverlay,
  onHoverCoordinates,
}: FieldMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapType, setMapType] = useState<'satellite' | 'street'>(showSatellite ? 'satellite' : 'street');
  const [drawnVertices, setDrawnVertices] = useState<[number, number][]>([]);
  const [computedArea, setComputedArea] = useState<{ ha: number; acres: number }>({ ha: 0, acres: 0 });

  // Styles
  const satelliteStyle: maplibregl.StyleSpecification = {
    version: 8,
    sources: {
      'esri-satellite': {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      },
    },
    layers: [
      {
        id: 'esri-satellite-layer',
        type: 'raster',
        source: 'esri-satellite',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  };

  const streetStyle: maplibregl.StyleSpecification = {
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    },
    layers: [
      {
        id: 'osm-tiles-layer',
        type: 'raster',
        source: 'osm-tiles',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const initialCenter: [number, number] = [75.8360, 30.9125]; // Ludhiana, Punjab
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapType === 'satellite' ? satelliteStyle : streetStyle,
      center: initialCenter,
      zoom: 13.5,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      // Add Fields GeoJSON Source
      const geojsonFeatures = fields.map((f) => ({
        type: 'Feature' as const,
        id: f.id,
        properties: {
          id: f.id,
          code: f.code,
          name: f.name,
          farmerName: f.farmerName || 'Enrolled Farmer',
          areaHa: f.areaHa,
          status: f.status,
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [f.coordinates],
        },
      }));

      map.addSource('fields-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: geojsonFeatures,
        },
      });

      // Polygon Fill Layer
      map.addLayer({
        id: 'fields-fill',
        type: 'fill',
        source: 'fields-source',
        paint: {
          'fill-color': [
            'match',
            ['get', 'status'],
            'READY_FOR_VERIFICATION',
            '#10b981',
            'NEEDS_REVIEW',
            '#f59e0b',
            '#6b7280',
          ],
          'fill-opacity': 0.35,
        },
      });

      // Polygon Outline Layer
      map.addLayer({
        id: 'fields-outline',
        type: 'line',
        source: 'fields-source',
        paint: {
          'line-color': [
            'match',
            ['get', 'status'],
            'READY_FOR_VERIFICATION',
            '#059669',
            'NEEDS_REVIEW',
            '#d97706',
            '#374151',
          ],
          'line-width': 2.5,
        },
      });

      // Source for interactive drawn polygon
      map.addSource('drawn-polygon-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'drawn-polygon-fill',
        type: 'fill',
        source: 'drawn-polygon-source',
        paint: {
          'fill-color': '#d6eaa6',
          'fill-opacity': 0.45,
        },
      });

      map.addLayer({
        id: 'drawn-polygon-line',
        type: 'line',
        source: 'drawn-polygon-source',
        paint: {
          'line-color': '#102e20',
          'line-width': 2.5,
          'line-dasharray': [2, 1],
        },
      });

      // Click on existing field
      map.on('click', 'fields-fill', (e: any) => {
        if (e.features && e.features[0] && onSelectField) {
          const fid = e.features[0].properties?.id;
          if (fid) onSelectField(fid);
        }
      });

      // Cursor pointer
      map.on('mouseenter', 'fields-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'fields-fill', () => {
        map.getCanvas().style.cursor = '';
      });

      // Mousemove coordinates reporter
      map.on('mousemove', (e) => {
        if (onHoverCoordinates) {
          onHoverCoordinates({ lng: e.lngLat.lng, lat: e.lngLat.lat });
        }
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle Style Toggle
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(mapType === 'satellite' ? satelliteStyle : streetStyle);
  }, [mapType]);

  // Handle Dynamic Raster Overlay (Genuine Sentinel-2 / Sentinel-1 rasters)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyRasterLayer = () => {
      const sourceId = 'raster-product-source';
      const layerId = 'raster-product-layer';

      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }

      if (!rasterOverlay || !rasterOverlay.imageUrl || !rasterOverlay.coordinates) {
        return;
      }

      try {
        map.addSource(sourceId, {
          type: 'image',
          url: rasterOverlay.imageUrl,
          coordinates: rasterOverlay.coordinates as [
            [number, number],
            [number, number],
            [number, number],
            [number, number],
          ],
        });

        // Insert underneath fields-outline so boundary remains crisp
        const beforeLayer = map.getLayer('fields-outline') ? 'fields-outline' : undefined;
        map.addLayer(
          {
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: {
              'raster-opacity': rasterOverlay.opacity ?? 0.85,
              'raster-fade-duration': 150,
            },
          },
          beforeLayer
        );
      } catch (err) {
        console.warn('Error attaching raster layer to MapLibre:', err);
      }
    };

    if (map.isStyleLoaded()) {
      applyRasterLayer();
    } else {
      map.once('style.load', applyRasterLayer);
    }
  }, [rasterOverlay?.imageUrl, rasterOverlay?.coordinates, rasterOverlay?.opacity, mapType]);

  // Handle Drawing Clicks
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMapClick = (e: maplibregl.MapMouseEvent) => {
      if (!isDrawingMode) return;
      const newVertex: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setDrawnVertices((prev) => {
        const next: [number, number][] = [...prev, newVertex];
        const area = calculateGeodesicArea(next);
        setComputedArea({ ha: area.ha, acres: area.acres });
        return next;
      });
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isDrawingMode]);

  // Update Drawn Polygon GeoJSON
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('drawn-polygon-source') as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    if (drawnVertices.length >= 3) {
      const firstVertex = drawnVertices[0];
      if (firstVertex) {
        const closedCoords: [number, number][] = [...drawnVertices, firstVertex];
        source.setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [closedCoords],
              },
            },
          ],
        });
      }
    } else {
      source.setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
  }, [drawnVertices]);

  const handleClearDrawing = () => {
    setDrawnVertices([]);
    setComputedArea({ ha: 0, acres: 0 });
  };

  const handleCompletePolygon = () => {
    if (drawnVertices.length < 3) return;
    const firstVertex = drawnVertices[0];
    if (!firstVertex) return;
    const closedCoords: [number, number][] = [...drawnVertices, firstVertex];
    const area = calculateGeodesicArea(drawnVertices);
    if (onPolygonComplete) {
      onPolygonComplete(closedCoords, area.ha, area.acres);
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border border-[#dde4d9] ${className}`} style={{ height }}>
      {/* MapLibre DOM Node */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Top Left Controls: Layer & Drawing Badges */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <div className="bg-white/90 backdrop-blur-xs p-1 rounded-lg border border-[#dde4d9] shadow-sm flex items-center gap-1 text-[11px] font-mono">
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded transition-colors ${
              mapType === 'satellite' ? 'bg-[#193b2a] text-white font-semibold' : 'text-[#708071] hover:text-[#193b2a]'
            }`}
          >
            Satellite MSI
          </button>
          <button
            onClick={() => setMapType('street')}
            className={`px-2.5 py-1 rounded transition-colors ${
              mapType === 'street' ? 'bg-[#193b2a] text-white font-semibold' : 'text-[#708071] hover:text-[#193b2a]'
            }`}
          >
            Cartographic
          </button>
        </div>

        {isDrawingMode && (
          <div className="bg-amber-950/85 text-amber-200 border border-amber-800 px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 backdrop-blur-xs">
            <MapPin size={12} className="text-amber-400" />
            <span>Draw Mode: Click map to place boundary vertices</span>
          </div>
        )}
      </div>

      {/* Bottom Bar: Geodesic Area Calculation & Drawing Actions */}
      {isDrawingMode && (
        <div className="absolute bottom-3 left-3 right-3 z-10 bg-black/80 backdrop-blur-xs text-white p-3 rounded-xl border border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-[#bacabd] uppercase font-mono block">Vertices Placed</span>
              <span className="font-mono font-bold text-emerald-400">{drawnVertices.length} Points</span>
            </div>
            <div>
              <span className="text-[10px] text-[#bacabd] uppercase font-mono block">Calculated Geodesic Area</span>
              <span className="font-mono font-bold text-white">
                {computedArea.acres.toFixed(2)} Acres ({computedArea.ha.toFixed(2)} ha)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleClearDrawing}
              variant="outline"
              size="sm"
              className="text-xs h-7 border-white/30 text-white hover:bg-white/20 gap-1"
            >
              <Trash2 size={12} />
              Reset
            </Button>
            <Button
              onClick={handleCompletePolygon}
              disabled={drawnVertices.length < 3}
              size="sm"
              className="text-xs h-7 bg-emerald-600 text-white hover:bg-emerald-500 gap-1 disabled:opacity-50"
            >
              <Check size={12} />
              Save Boundary ({computedArea.acres.toFixed(1)} ac)
            </Button>
          </div>
        </div>
      )}

      {/* Default Map Legend when not in drawing mode */}
      {!isDrawingMode && (
        <div className="absolute bottom-3 left-3 z-10 bg-black/75 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg border border-white/20 text-[11px] font-mono flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Ready for Verification
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Needs Review
          </span>
          <span className="text-white/60">10m Sentinel-2 Calibration</span>
        </div>
      )}
    </div>
  );
}
