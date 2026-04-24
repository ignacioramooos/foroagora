# Foro Agora Project Overview

Last updated: 2026-04-23

## 1. Executive Summary

Foro Agora is a React + Supabase web platform focused on financial education for youth in Uruguay. It combines:

- Public-facing pages for mission, program, registration, and partnerships.
- Authentication and onboarding.
- A protected student dashboard with content, portfolio simulation, events, and tools.
- An admin panel for content management.
- Supabase-backed persistence and role-based access controls.
- Supabase Edge Functions for stock quote/history data used in the portfolio simulator.

Current state is strong for live demo and core operations. Several modules are already production-oriented, while a few areas remain intentionally lightweight (for example, some progress logic and selected dashboard widgets).

## 2. Product Purpose and Positioning

Primary positioning in the codebase:

- Educational first, not financial advice.
- Fundamental analysis over speculative trading.
- Spanish-first copy and Uruguay context (departments, local references, cohorts, in-person classes).

Product goals visible in implementation:

- Convert public traffic into registered users.
- Guide users through onboarding into a dashboard learning experience.
- Provide practical learning via content, events, and portfolio simulation.
- Enable operational publishing through admin tools.

## 3. Stack, Runtime, and Tooling

### Frontend

- React 18 + TypeScript
- Vite 5
- React Router
- Tailwind CSS + shadcn/ui + Radix primitives
- Framer Motion
- Recharts

### Backend and Platform

- Supabase Auth
- Supabase Postgres + RLS
- Supabase Realtime (used for counters)
- Supabase Edge Functions (Yahoo Finance proxy behavior)

### DX and QA

- Vitest + Testing Library + jsdom
- ESLint + TypeScript rules
- NPM scripts: `dev`, `build`, `lint`, `test`

## 4. System Architecture

### Entry and providers

- `src/main.tsx` mounts app root.
- `src/App.tsx` composes providers and routes.

Global providers:

- Theme provider (light/dark + persisted preference + keyboard shortcut).
- React Query provider.
- Tooltip and toast providers.
- BrowserRouter.
- Auth provider (session/profile state and auth operations).

### Routing model

- Public pages are rendered with shared navbar/footer shell.
- Protected dashboard route enforces auth redirect to `/auth` for anonymous users.
- Admin page is role-gated at page level via `user_roles` lookup.

## 5. Public Website Surface

### Public routes

- `/`
- `/nosotros`
- `/programa`
- `/registro`
- `/contacto`
- `/recursos`
- `/glosario`
- `/partners`
- `/brokers`
- `/ranking`
- `/auth`
- not-found fallback

### Dynamic public components and behavior

- Live student counter from `profiles` count + realtime refresh.
- Active cohort countdown and capacity display from `cohorts`.
- Newsletter subscription persistence to `newsletter_subscribers`.
- Floating WhatsApp CTA button.
- Hero scroll hint and navbar scroll progress indicator.

### Public forms (now persisted)

- Registration form (`/registro`) now inserts into `class_registrations`.
- Contact form (`/contacto`) now inserts into `contact_messages`.

Both include asynchronous submit handling and loading UI.

## 6. Auth and Onboarding

### Auth methods

- Email/password sign-in and sign-up via Supabase.
- Google OAuth via Lovable auth wrapper, then Supabase session sync.

### Onboarding flow

After account creation/login, users complete a 3-step profile onboarding that stores:

- Full name and age range.
- Department, institution, acquisition source.
- Interests and terms acceptance.

Profile completion is tracked with `onboarding_completed`.

### Profile model in app

`AuthContext` returns `UserProfile` with:

- identity fields,
- onboarding flag,
- learner counters used in dashboard.

Recent improvement:

- hardcoded dashboard stats were removed,
- `completedClasses` and `publishedTheses` are now derived from DB counts (with safe fallback).

## 7. Dashboard Capabilities

Main dashboard route: `/dashboard`.

Tabs:

- Inicio
- Clases
- Mi Portafolio
- Mi Progreso
- Herramientas
- Comunidad
- Mis Tesis
- Eventos
- Configuracion

### 7.1 Home

- User greeting and progress summary.
- Upcoming registered events from DB.
- Community highlights from DB.
- Loading skeletons for async sections.

### 7.2 Content Library

- Reads `content_items` where `is_published=true`.
- Filters by type (`video`, `article`, `material`).
- Modal display by content type (YouTube embed, text, file link).
- Loading skeletons added.

### 7.3 Portfolio Simulator

Persistent, education-only simulation:

- Auto-creates portfolio for new user.
- Reads/writes holdings and transactions.
- Buy/sell actions update cash and positions.
- Uses edge functions for quotes/history.
- Portfolio chart now uses transaction-derived historical curve (not just start/end points).
- Ranking integration via `last_portfolio_value`.

### 7.4 Learning Progress

- Timeline module view still uses mock module definitions.

### 7.5 Toolkit

- Opportunity cost calculator.
- Basic financial health checker.
- Investor profile quiz.
- Embedded glossary.

### 7.6 Community

- Now DB-backed via `community_posts`.
- Grouped render by post type (`announcement`, `analysis`).
- Empty-state fallback if no published posts.

### 7.7 Thesis Builder

- Migrated from local-only mock state to DB persistence.
- Reads/inserts using `case_studies`.
- Keeps existing UX while persisting drafts.

### 7.8 Events

- Reads active events from `events`.
- Registers user in `event_registrations` with uniqueness guard at DB level.
- Shows both "my events" and available events.
- Skeleton loading state added.

### 7.9 Settings

- Basic account identity display and logout.

## 8. Admin Capabilities

Admin panel (`/admin`) includes:

- role-gated access,
- content list/filter,
- create/edit/delete for `content_items`,
- publish and sort controls,
- type-specific fields (video/article/material).

Operationally, this is the main no-code publishing surface for dashboard lessons/resources.

## 9. Ranking

Public ranking page:

- reads portfolios and associated profile names,
- computes return vs initial 10,000 baseline,
- highlights current user,
- renders podium only when there are at least 3 entries,
- includes refresh action.

## 10. Database Model Snapshot

### Core tables actively used

- `profiles`
- `user_roles`
- `content_items`
- `events`
- `event_registrations`
- `cohorts`
- `newsletter_subscribers`
- `portfolios`
- `portfolio_holdings`
- `portfolio_transactions`
- `partners`
- `partner_inquiries`
- `class_registrations` (new)
- `contact_messages` (new)
- `community_posts` (new)

### Additional typed tables currently present

- `case_studies`
- `certificates`
- `lessons`
- `lesson_progress`

### Enums and DB function

- `app_role`
- `content_type`
- `has_role(...)`

## 11. Recent Migrations Added

### `20260423113000_0f3b4bc1-forms-persistence.sql`

Creates and configures:

- `class_registrations`
- `contact_messages`

Includes RLS + insert policies for anonymous/authenticated submissions.

### `20260423120000_8c7e2a39-community-posts.sql`

Creates and seeds:

- `community_posts`

Includes RLS policy for published reads and insert policy, plus initial demo posts.

## 12. Edge Functions

### `stock-price`

- Accepts `tickers` query param.
- Fetches quote metadata from Yahoo chart endpoint.
- Returns normalized quote structure.
- Includes small in-memory cache for repeated calls.

### `stock-history`

- Accepts `ticker` and `range`.
- Maps range to interval and returns normalized data series.
- Used for chart rendering in portfolio dialog.

## 13. UX and Design System

- Tokenized theme with CSS variables and dark mode class strategy.
- Editorial typography (Instrument Sans + Source Serif 4).
- Extensive reusable UI primitives under `src/components/ui`.
- Motion and progressive reveal effects across marketing pages.
- Mobile dashboard bottom nav updated to include Events as a primary action.

## 14. Quality and Validation Status

### Runtime validation

- Production build: passing.
- Tests: passing (basic suite currently minimal).

### Lint status

- No blocking lint errors after recent cleanup.
- Remaining lint output is warnings (mainly fast-refresh and selected hook dependency advisories).

### Practical implications

- App is stable for demo and core operation.
- Quality gates can be tightened further if team wants stricter CI.

## 15. Production Readiness by Area

### Strong

- Auth/session/onboarding
- Content admin + content consumption
- Events registration and display
- Portfolio persistence + ranking
- Newsletter, partner inquiries, registration/contact persistence

### Moderate / Partial

- Learning progress uses mock module metadata
- Some dashboard analytics still simplified
- Case studies pipeline is present but can be expanded

### Pending polish opportunities

- More test coverage around dashboard state and auth edge-cases
- Resolve remaining lint warnings for stricter CI baseline
- Add chunk splitting strategy (bundle size warning from Vite build)

## 16. Risks and Constraints

1. Bundle size warning indicates future performance optimization opportunity.
2. Warning-level lint debt may hide subtle issues over time if ignored.
3. Some educational metrics are still heuristic rather than full analytics.
4. Google Sheets webhook for events remains optional and placeholder-driven.

## 17. Recommended Roadmap

### Near term (1-2 sprints)

1. Add CI gates for build + tests + lint (warnings policy decision).
2. Expand test coverage for auth flows, forms persistence, and portfolio operations.
3. Move progress timeline from mock to DB-driven lesson progression.
4. Add admin/ops view for class registrations and contact messages.

### Mid term

1. Optimize JS chunking and route-level code splitting.
2. Improve analytics and reporting dashboards.
3. Expand case study workflow (publish/review/moderation).

## 18. Capability Checklist

### Public site

- Marketing pages
- Program narrative and curriculum view
- Glossary with search/filter/index
- Live counters and cohort capacity UI
- Persisted registration and contact forms
- Partner inquiries
- Broker directory
- Ranking page

### Account and identity

- Email auth
- Google OAuth
- Onboarding persistence
- Theme toggle + keyboard shortcut

### Student experience

- Content library
- Portfolio simulator
- Events signup
- Community feed (DB)
- Thesis drafts (DB)
- Toolkit calculators/quiz

### Admin

- Role-gated CMS for content items

### Backend

- Supabase RLS-secured tables
- Edge market data endpoints
- Migration-backed schema evolution

## 19. Final Assessment

The project has moved from mixed prototype/demo state toward a solid early production baseline.

Most critical operational gaps identified earlier are now addressed:

- registration persistence,
- contact persistence,
- community data persistence,
- thesis persistence,
- improved dashboard chart realism,
- UI polish for demo reliability.

What remains is mainly hardening and scaling work (test depth, warning cleanup policy, performance optimization, and richer analytics).
