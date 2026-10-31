# VirsaFlow — Agricultural MRV Platform

This repository contains the VirsaFlow marketing website and full agricultural MRV demonstration workspace, including the Command Centre, Satellite Intelligence viewer, Evidence Explorer, Project Passport/Dossier, and Marketplace.

## Navigation Routes
* `/` — Public landing page.
* `/auth?next=/dashboard` — Workspace authentication & instant demo access.
* `/dashboard` — VirsaFlow Command Centre (live MRV synthesis, satellite monitoring, evidence graphs).
* `/marketplace` — Agricultural MRV Project Directory & Offtake Pipeline.
* `/passport` — Project Passport & Institutional Due Diligence Dossier.

## Run locally
1. Install Node.js LTS and npm.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local URL printed by Vite (typically http://localhost:8080).

## Demonstration Mode
Authentication and verification features run in preconfigured demonstration mode. No live backend authentication or operational credentials are required for auditor access.
