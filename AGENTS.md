# NWIS project rules
- Monorepo: frontend (React JS + Vite), backend (Node 20 + Express), ai-service (FastAPI), data-gen, simulator.
- JavaScript only in frontend/backend (no TypeScript). ES modules. Zod for validation. Prettier + ESLint.
- All SQL via migrations in backend/src/db/migrations. PostGIS SRID 4326. Depths in metres, MW in sg.
- Every extracted fact must store source_doc_id, page, evidence_quote, confidence.
- Every API has OpenAPI docs + at least one test. Never hardcode secrets; use .env.
- UI: Tailwind, dark mode, responsive, accessible colours. Risk colours: green/amber/red.
- After each task: run tests, list changed files, give run instructions.
