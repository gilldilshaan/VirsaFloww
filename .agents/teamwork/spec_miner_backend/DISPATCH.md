## 2026-10-31T16:56:42Z
From: 8a58b17c-6565-4a0b-8d2e-d3649ec4f95e
Priority: MESSAGE_PRIORITY_HIGH

You are the Backend Specification Investigator (teamwork_spec_miner).
Your working directory is: C:\Users\hp\Desktop\VIrsa\.agents\teamwork\spec_miner_backend\
Your caller / orchestrator is: 8a58b17c-6565-4a0b-8d2e-d3649ec4f95e

MANDATORY FIRST STEP:
Read C:\Users\hp\Desktop\VIrsa\.agents\teamwork\ORIGINAL_REQUEST.md before starting any work.

Mission:
Investigate the authoritative FastAPI backend codebase in C:\Users\hp\Desktop\VIrsa\backend\ to extract all API specifications, data models, validation rules, and error envelopes required for frontend integration.

Scope & Tasks:
1. Examine FastAPI routers, endpoints, and HTTP methods across all backend modules:
   - Auth (`/api/auth/session`, `/api/auth/me`, token format, session expiration, RBAC roles)
   - Projects (`/api/projects`), Fields (`/api/fields`), boundaries / GeoJSON / PostGIS coordinates
   - Evidence (`/api/evidence`): multipart file upload requirements, SHA-256 calculation, immutability, superseding mechanics, HTTP 409 conflict responses
   - Assessments, Reviews, Seasons, Activities, Notifications, Audit, Marketplace, Buyer Enquiries, Satellite, Graphs, Explanations
2. Document the exact JSON response envelopes:
   - Error envelope format: `{"error": {"code", "message", "details"}}`
   - Paginated list envelope format: `{"items", "total", "limit", "offset"}`
   - Standard object response formats
3. Extract exact Pydantic schemas, field names, nullable fields, date/time string formats, and ID types (UUID vs int vs str).
4. Identify MRV calculation rules and project status restrictions (UNVERIFIED, NEEDS_REVIEW, READY_FOR_VERIFICATION - ensure no VERIFIED status can be fabricated).
5. Document authentication mechanics: Header format (`Authorization: Bearer <token>`), cookie handling if any, token storage expectation (`virsaflow_access_token`).

Output:
Write your full detailed specification analysis to:
C:\Users\hp\Desktop\VIrsa\.agents\teamwork\spec_miner_backend\analysis.md
Write a self-contained handoff report to:
C:\Users\hp\Desktop\VIrsa\.agents\teamwork\spec_miner_backend\handoff.md
Send a completion message back to orchestrator (8a58b17c-6565-4a0b-8d2e-d3649ec4f95e) referencing handoff.md.
