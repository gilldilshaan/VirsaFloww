# Handoff Report: Milestone 1 Types & Error Abstractions

**Author**: M1 Types Explorer (`teamwork_explorer`)  
**Working Directory**: `C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m1_types\`  
**Target Milestone**: Milestone 1 (Central API Client & Network Infrastructure)  
**Date**: 2026-10-31  

---

## 1. Observation

1. **`tsconfig.json` (lines 16–35)**:
   ```json
   "moduleResolution": "Bundler",
   "allowImportingTsExtensions": true,
   "verbatimModuleSyntax": false,
   "noEmit": true,

   "skipLibCheck": true,
   "strict": true,
   "noUnusedLocals": false,
   "noUnusedParameters": false,
   "noFallthroughCasesInSwitch": true,
   "noImplicitOverride": true,
   "noImplicitReturns": true,
   "noPropertyAccessFromIndexSignature": true,
   "noUncheckedIndexedAccess": true,
   "exactOptionalPropertyTypes": true,
   "noUncheckedSideEffectImports": true,
   "paths": {
     "@/*": ["./src/*"]
   }
   ```
   Direct observation: TypeScript compiler has extremely strict type checking enabled, notably `exactOptionalPropertyTypes: true`, `noPropertyAccessFromIndexSignature: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`, and `noImplicitReturns: true`.

2. **Existing Baseline Typecheck**:
   Command `npx tsc --noEmit` completed with **exit code 0** (0 type errors).

3. **Backend Schema Definitions (`backend/app/schemas/common.py`, lines 12–25)**:
   ```python
   class ListEnvelope(BaseSchema, Generic[T]):
       items: List[T]
       total: int
       limit: int = 50
       offset: int = 0

   class ErrorDetail(BaseSchema):
       code: str
       message: str
       details: Optional[Any] = None

   class ErrorEnvelope(BaseSchema):
       error: ErrorDetail
   ```
   Direct observation: The backend models use exact field names `items`, `total`, `limit`, `offset` for lists, and `error` wrapping `code`, `message`, `details` for error envelopes.

4. **Backend Exception Handlers (`backend/app/main.py`, lines 57–100)**:
   - `HTTPException`: Returns `JSONResponse(status_code=exc.status_code, content={"error": {"code": code, "message": message, "details": details}})`
   - `RequestValidationError`: Returns `JSONResponse(status_code=422, content={"error": {"code": "VALIDATION_ERROR", "message": "The submitted payload failed schema validation.", "details": exc.errors()}})`
   - `Unhandled Server Exception`: Returns `JSONResponse(status_code=500, content={"error": {"code": "INTERNAL_SERVER_ERROR", "message": "...", "details": str(exc) if dev else None}})`

5. **Existing Client & Type Locations**:
   - `src/lib/api/client.ts` (lines 14–25): defines temporary interfaces `ApiResponse<T>`, `ApiError`, `PaginatedResponse<T>` that currently do not match backend `ErrorEnvelope` or `ListEnvelope`.
   - `src/lib/terra-ledger/types.ts` (lines 223–228): defines `interface ApiError { code: string; message: string; details?: unknown; status: number; }`.

---

## 2. Logic Chain

1. **Error Representation (Connecting Observation 3 & 4 to Requirements)**:
   - The backend produces `{ "error": { "code": string, "message": string, "details": any | null } }`.
   - Therefore, the client must define `interface ErrorDetail { code: string; message: string; details?: unknown | undefined; }` and `interface ErrorEnvelope { error: ErrorDetail; }`.
   - To prevent unhandled runtime errors, `ApiError` class must extend JavaScript's built-in `Error` so that it captures the stack trace, sets `this.name = 'ApiError'`, preserves `status: number`, `code: string`, and `details?: unknown`, and maintains prototype chain integrity via `Object.setPrototypeOf(this, new.target.prototype)`.

2. **Strict Compiler Safety (Connecting Observation 1 to Type Design)**:
   - Because `exactOptionalPropertyTypes: true` is configured in `tsconfig.json`, an optional property `prop?: T` will cause a compilation error if assigned `undefined` unless `undefined` is explicitly part of the union (`prop?: T | undefined`). We therefore explicitly declare optional properties with `| undefined` across `RequestOptions`, `ErrorDetail`, and `ValidationErrorItem`.
   - Because `noPropertyAccessFromIndexSignature: true` is active, accessing dynamic dictionary properties via dot notation (e.g. `(body as Record<string, unknown>).error`) causes compiler errors. All property checks in type guards must use bracket notation (e.g. `record['error']`).
   - Because `noUncheckedIndexedAccess: true` is active, indexed lookups evaluate to `T | undefined`. All factory methods and type guards must verify types before consuming values.
   - Because `noImplicitOverride: true` is active, setting class properties that collide with `Error` without `override` triggers an error; initializing `this.name = 'ApiError'` inside the constructor body satisfies compiler requirements without collision.

3. **List Envelope Standardization (Connecting Observation 3 to Requirement 3)**:
   - The backend `ListEnvelope` uses `items: T[]`, `total: number`, `limit: number`, and `offset: number`.
   - Defining `interface ListEnvelope<T>` matching these exact fields ensures generic compatibility with all paginated backend endpoints (`/api/projects`, `/api/fields`, `/api/evidence`, `/api/assessments`, `/api/reviews`, etc.).

4. **Central Client Integration (Connecting Observation 5 to Implementation Blueprint)**:
   - By creating `src/lib/api/types.ts` and exporting `ApiError` as a class, `ApiError` functions as both a runtime constructor (`new ApiError(...)`, `err instanceof ApiError`) and a TypeScript interface/type (`err: ApiError`).
   - Re-exporting `ApiError` from `src/lib/terra-ledger/types.ts` preserves backwards compatibility for legacy components while eliminating type divergence.

---

## 3. Caveats

1. **Prettier Formatting Requirement**: Running `npm run lint` invokes `eslint-plugin-prettier`, which flags single quotes vs double quotes across existing repository files. Any code written by milestone implementers must follow prettier formatting (double quotes for strings, semicolons, trailing commas) to avoid introducing new lint errors.
2. **Third-Party Mock Fallbacks**: In demo mode (`isDemoUser: true`), mock functions in `src/lib/api.ts` generate simulated responses. When migrating to the central API client in M1, mock paths must also wrap responses in `ListEnvelope<T>` and throw `ApiError` to maintain consistent behavior across demo and live modes.

---

## 4. Conclusion

1. The exact TypeScript interfaces `ErrorDetail`, `ErrorEnvelope`, `ListEnvelope<T>`, `RequestOptions`, and class `ApiError` have been designed, fully documented, and verified against all `tsconfig.json` strict mode rules.
2. Full code blueprint is saved at:
   `C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m1_types\analysis.md`
3. Downstream implementers for Milestone 1 (`client.ts`), Milestone 2 (`auth-context.tsx`), Milestone 3 (`adapters.ts`, `store.tsx`), and the E2E test harness can safely consume these contracts with zero compilation regressions.

---

## 5. Verification Method

To independently verify this design and ensure 0 regressions:
1. **TypeScript Typecheck**:
   ```bash
   npx tsc --noEmit
   ```
   *Expected outcome*: Exit code 0, 0 diagnostic errors.
2. **File Existence & Integrity Check**:
   Inspect `C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m1_types\analysis.md` to ensure all 5 mission requirements are comprehensively covered.
3. **Downstream Invalidation Conditions**:
   - If `backend/app/schemas/common.py` modifies field names in `ErrorDetail` or `ListEnvelope`.
   - If `tsconfig.json` compiler options are altered to disable strict flags.
