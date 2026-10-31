## 2026-10-31T16:55:15Z

Integrate the existing VirsaFloww ("The Carbon Credit OS", Panjdhara Private Limited) React frontend with its FastAPI backend for production readiness, ensuring the frontend communicates through a central API client, consumes real PostgreSQL-backed data via FastAPI, and strictly preserves the existing application design, UI/UX, navigation, MRV rules, and data-integrity guarantees.

Working directory: C:\Users\hp\Desktop\VIrsa
Integrity mode: development

## Critical Operational Constraints
- Confirm the current Git branch is `feature/frontend-backend-integration`.
- Preserve all existing uncommitted changes, especially `src/routeTree.gen.ts`.
- Preserve the untracked `.agents/` directory and all its contents.
- Do not run `git reset --hard`, `git clean`, `git restore`, or destructive Git commands.
- Do not overwrite or regenerate existing files without inspecting their current contents.
- Inspect the complete frontend and backend architecture before making changes.
- Work incrementally and verify each integration stage.
- Do not modify production database settings or execute destructive database operations.
- If any requirement cannot be safely implemented, explain the blocker instead of making assumptions.
- Do not stop after analysis; proceed with implementation and testing.

## Requirements
- R1. Central API Client & Network Communication
- R2. Authentication & Session Management
- R3. Domain Data Integration & Type Adapters
- R4. State Management, UI States & Live/Demo Separation
- R5. Non-Destructive Operation, Git Safety & Quality Verification
