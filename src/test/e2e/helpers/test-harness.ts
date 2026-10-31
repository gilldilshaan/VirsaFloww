/**
 * VirsaFloww E2E Test Harness & Authoritative Fixture Generators
 * 
 * Provides mock HTTP network interceptors, cryptographic SHA-256 calculation,
 * PostGIS coordinate adapters, and authoritative test fixtures derived directly
 * from backend FastAPI Pydantic schemas.
 */

import { vi } from 'vitest';

export class StorageMock implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

if (typeof globalThis.localStorage === 'undefined') {
  const mockStorage = new StorageMock();
  Object.defineProperty(globalThis, 'localStorage', {
    value: mockStorage,
    writable: true,
    configurable: true,
  });
}

if (typeof globalThis.sessionStorage === 'undefined') {
  const mockStorage = new StorageMock();
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: mockStorage,
    writable: true,
    configurable: true,
  });
}

export function resetStorage(): void {
  globalThis.localStorage?.clear();
  globalThis.sessionStorage?.clear();
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  status: number;
}

export interface ListEnvelope<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type AssessmentStatus = 'UNVERIFIED' | 'NEEDS_REVIEW' | 'READY_FOR_VERIFICATION';

export interface PostgisPolygonField {
  id: string;
  code: string;
  name: string;
  farmerId: string;
  district: string;
  state: string;
  areaHa: number;
  areaAcres: number;
  practice: string;
  crop: string;
  season: string;
  coordinates: { lat: number; lng: number };
  boundaryPolygon: number[][];
  geometrySource?: string;
  isDemo?: boolean;
}

export interface EvidenceRecord {
  id: string;
  fieldId: string;
  activityId?: string | null;
  title: string;
  type: 'photo' | 'satellite' | 'document' | 'log' | 'sensor';
  category: 'supporting' | 'contradicting' | 'missing';
  status: 'received' | 'hash_recorded' | 'self_reported' | 'flagged' | 'superseded';
  description: string;
  capturedAt: string;
  submittedAt: string;
  submitterId: string;
  provenance: {
    author: string;
    source: string;
    sha256: string;
    device?: string | null;
    gpsCoordinates?: { lat: number; lng: number; accuracyMeters?: number | null } | null;
    reviewStatus: string;
  };
  fileDetails?: {
    name: string;
    sizeKb: number;
    mime: string;
    storageUri?: string | null;
  } | null;
  supersedesId?: string | null;
  statusHistory: Array<{
    timestamp: string;
    previousStatus: string;
    newStatus: string;
    actorId: string;
    reason?: string | null;
  }>;
  isDemo: boolean;
}

/**
 * Calculates SHA-256 hex digest of binary or string data using standard Web Crypto.
 */
export async function calculateSha256(data: string | Uint8Array | ArrayBuffer): Promise<string> {
  let buffer: ArrayBuffer;
  if (typeof data === 'string') {
    buffer = new TextEncoder().encode(data).buffer as ArrayBuffer;
  } else if (data instanceof Uint8Array) {
    buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
  } else {
    buffer = data;
  }

  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Standard PostGIS Coordinate Adapter.
 * Converts backend boundaryPolygon `number[][]` to UI coordinate tuples `[lat, lng]`.
 * Fails safely to empty array `[]` when input is null, undefined, or empty.
 */
export function adaptPostgisCoordinates(boundaryPolygon?: number[][] | null): [number, number][] {
  if (!boundaryPolygon || !Array.isArray(boundaryPolygon) || boundaryPolygon.length === 0) {
    return [];
  }

  const validCoordinates: [number, number][] = [];
  for (const point of boundaryPolygon) {
    if (Array.isArray(point) && point.length >= 2) {
      const lat = point[0];
      const lng = point[1];
      if (typeof lat === 'number' && !isNaN(lat) && typeof lng === 'number' && !isNaN(lng)) {
        // Enforce valid geographic bounds
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          validCoordinates.push([lat, lng]);
        }
      }
    }
  }

  return validCoordinates;
}

/**
 * Asserts MRV assessment status strictly adheres to non-verified enum values.
 * Throws an Error if 'VERIFIED' is encountered.
 */
export function assertValidMrvStatus(status: string): AssessmentStatus {
  if (status === 'VERIFIED') {
    throw new Error(
      `INVARIANT VIOLATION: MRV status cannot be 'VERIFIED'. Only UNVERIFIED, NEEDS_REVIEW, READY_FOR_VERIFICATION are permitted.`
    );
  }

  const allowedStatuses: AssessmentStatus[] = ['UNVERIFIED', 'NEEDS_REVIEW', 'READY_FOR_VERIFICATION'];
  if (!allowedStatuses.includes(status as AssessmentStatus)) {
    throw new Error(`Invalid MRV status '${status}'. Must be one of: ${allowedStatuses.join(', ')}`);
  }

  return status as AssessmentStatus;
}

/**
 * Safely parses backend ErrorEnvelope format.
 */
export function parseErrorEnvelope(status: number, responseBody: unknown): ApiError {
  const defaultMessage = `Request failed with status ${status}`;
  if (!responseBody || typeof responseBody !== 'object') {
    return {
      status,
      code: 'API_ERROR',
      message: defaultMessage,
    };
  }

  const envelope = responseBody as Record<string, unknown>;
  if (envelope['error'] && typeof envelope['error'] === 'object') {
    const errorDetail = envelope['error'] as Record<string, unknown>;
    return {
      status,
      code: String(errorDetail['code'] ?? 'API_ERROR'),
      message: String(errorDetail['message'] ?? defaultMessage),
      details: errorDetail['details'],
    };
  }

  return {
    status,
    code: String(envelope['code'] ?? 'API_ERROR'),
    message: String(envelope['message'] ?? defaultMessage),
    details: envelope['details'],
  };
}

/**
 * Safely unwraps backend ListEnvelope format.
 */
export function unwrapListEnvelope<T>(responseBody: unknown): ListEnvelope<T> {
  if (!responseBody || typeof responseBody !== 'object') {
    throw new Error('Malformed list response: expected JSON object');
  }

  const obj = responseBody as Record<string, unknown>;
  if (!Array.isArray(obj['items'])) {
    throw new Error("Malformed ListEnvelope: missing or invalid 'items' array");
  }

  return {
    items: obj['items'] as T[],
    total: typeof obj['total'] === 'number' ? obj['total'] : (obj['items'] as T[]).length,
    limit: typeof obj['limit'] === 'number' ? obj['limit'] : 50,
    offset: typeof obj['offset'] === 'number' ? obj['offset'] : 0,
  };
}

/**
 * Mock Auth Session Generator for testing.
 */
export function createMockSession(role: string = 'reviewer', isDemo: boolean = false) {
  return {
    accessToken: `mock-jwt-token-${role}-${isDemo ? 'demo' : 'live'}-${Date.now()}`,
    tokenType: 'Bearer',
    expiresInSeconds: 3600,
    user: {
      id: isDemo ? `USR-DEMO-${role.toUpperCase()}-01` : `USR-LIVE-${role.toUpperCase()}-01`,
      email: `${role}@virsaflow.com`,
      name: `Test ${role.replace('_', ' ').toUpperCase()}`,
      role,
      assignedProjectIds: ['PRJ-PB-DSR-001'],
      assignedFieldIds: ['PB-FIELD-001'],
      isActive: true,
      isDemoUser: isDemo,
    },
  };
}
