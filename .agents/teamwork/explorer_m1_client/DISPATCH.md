## 2026-10-31T17:09:46Z
You are the M1 Client Explorer (teamwork_explorer) for Milestone 1: Central API Client & Network Infrastructure.
Your working directory is: C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m1_client\
Your caller / orchestrator is: 8a58b17c-6565-4a0b-8d2e-d3649ec4f95e

MANDATORY FIRST STEP:
Read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\ORIGINAL_REQUEST.md before starting work.
Also read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\orchestrator\PROJECT.md.
Also read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\spec_miner_backend\analysis.md.

Mission:
Investigate and design the exact code enhancements needed for `src/lib/api/client.ts` to satisfy Milestone 1 / Requirement R1:
1. Base URL configuration: Read `import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'`, targeting `/api` endpoints.
2. Bearer Token: Automatically inject `Authorization: Bearer <token>` reading from localStorage key `virsaflow_access_token`.
3. Error Envelope Parsing: Safely unwrap backend JSON error envelopes:
   `{"error": {"code": string, "message": string, "details": any}}`
   Throw a strongly typed `ApiError` instance containing `code`, `message`, `details`, and HTTP `status`.
4. List Envelope Parsing: Safely unwrap `{"items": T[], "total": number, "limit": number, "offset": number}`.
5. Multipart Upload: Provide a helper or method (e.g. `postMultipart<T>(endpoint: string, formData: FormData)`) that attaches the Authorization header but omits `'Content-Type'` so the browser automatically sets `multipart/form-data; boundary=...`.
6. Inspect all current consumers of `client.ts` (`src/lib/farmer/farmer-service.ts`, `src/lib/partnerships/partnerships-service.ts`) to ensure 100% backward compatibility.

Output:
Write your detailed recommendations and code blueprint to:
C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m1_client\analysis.md
Write a self-contained handoff report to:
C:\Users\hp\Desktop\VIrsa\.agents\teamwork\explorer_m1_client\handoff.md
Send a completion message back to orchestrator (8a58b17c-6565-4a0b-8d2e-d3649ec4f95e).
