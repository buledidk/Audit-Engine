# CLAUDE.md — AuditEngine v10.0.0 AURA

## Project Overview
AuditEngine is a comprehensive UK statutory audit automation platform built on React 19 + Vite 8, with Supabase PostgreSQL for cloud persistence and Claude API for AI-powered audit intelligence.

## Tech Stack
- **Frontend:** React 19, Vite 8, React Router 7
- **Backend:** Express 5, Supabase PostgreSQL
- **AI:** Anthropic Claude 3.5 Sonnet (primary), OpenAI GPT-4 (fallback), Ollama (local)
- **Export:** docx, exceljs, xlsx, pdfkit, pdfmake
- **Testing:** Vitest 4, Testing Library
- **Deploy:** Vercel (auditengine.agency), Docker, GitHub Codespaces

## Key Files
- `src/AuditEngine_AURA.jsx` — Main app shell (v10 entry point)
- `src/router.jsx` — Route definitions for all panels
- `src/AuditEngine.jsx` — Core audit engine (monolith, 1122 lines)
- `src/RegulatoryData.js` — FCA handbook, ISQM, Ethical Standard (3098 lines)
- `src/StandardsLibrary.js` — 37 ISA (UK) standards (2030 lines)
- `src/AuditMethodology.js` — Risk trilogy, audit procedures (2555 lines)
- `src/FRSEncyclopaedia.js` — FRS 100-105, all 35 FRS 102 sections
- `src/StorageEngine.js` — localStorage + Supabase write-through cache
- `src/agents/AgentFramework.js` — Multi-agent orchestration (10 agents)
- `src/services/AuditAccuracyEnhancementEngine.js` — 15 accuracy engines

## Commands
- `npm run dev` — Start Vite dev server
- `npm run build` — Production build (247 modules)
- `npx vitest run` — Run tests (219/219 passing)
- `npm run lint` — ESLint v9 flat config
- `npm run agents` — CLI agent tool

## Architecture Rules
- Work on `main` branch only (no claude/* branches)
- Node 20.x required
- All commits auto-deploy to Vercel
- Keep vercel.json clean (SPA rewrite, multi-region CDG/LHR/SFO)
- Tests must stay at 219/219 before pushing
- Build must produce 0 errors

## Database
- Supabase tables: engagements, engagement_data, documents, document_links, audit_trail
- Schema: database/supabase-schema.sql
- RLS policies defined for all tables
- Offline-first: localStorage is primary, Supabase is cloud sync

## Environment Variables
- VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY — Supabase connection
- VITE_CLAUDE_API_KEY — Anthropic API
- VITE_APP_ENV, VITE_APP_VERSION — App config

## Regulatory Coverage
- ISA (UK) 200-810 (37 standards) + ISQM 1 & 2
- FCA: PRIN, SYSC, CASS, MIFIDPRU, Consumer Duty (PS22/9)
- FRS 100-105 with 2026 amendments
- Compliance: AML, GDPR, Bribery Act, Modern Slavery, Sanctions
- Companies Act 2006 (62 references)
- FRC Ethical Standard 2024
