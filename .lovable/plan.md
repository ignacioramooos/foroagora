

## Plan: Fix visual palette consistency and reduce empty space

### Problem Summary
Two issues across the site:
1. **Off-palette colors**: `#22D07A` (electric green), `#0D1B2A` (dark navy), amber/red hardcoded values, and Tailwind utility colors used instead of the established CSS variable system. The design principles call for a monochromatic palette with subtle navy accent — not electric green everywhere.
2. **Too much empty space on desktop**: The hero takes 88vh with content only on the left ~40%. Every section uses identical `py-24 md:py-32` padding, creating a monotonous, sparse rhythm. Content often floats in a sea of white.

---

### Changes

#### 1. Replace off-palette green (#22D07A) with accent color from the system
The CSS already defines `--accent: 224 76% 48%` (a navy blue). All `#22D07A` references should use `hsl(var(--accent))` or `text-accent` instead. This affects:
- `LiveStudentCounter.tsx` — pulsing dot
- `CapacityBar.tsx` — bar color and urgency text (keep amber/red for urgency states, but define them as CSS vars)
- `CohortCountdown.tsx` — expired text
- `NewsletterSignup.tsx` — subscribe button, success checkmark
- `ImpactPage.tsx` — pulsing dot, timeline dots
- `PartnersPage.tsx` — success confirmation, icon colors
- `RankingPage.tsx` — current user highlight, positive return color
- `CaseStudyDetailPage.tsx` — verdict callout border
- `HomeCaseStudies.tsx` — if used
- `CaseStudySubmission.tsx` — success state
- `PortfolioTab.tsx` — positive P&L, buy button

#### 2. Replace dark navy backgrounds (#0D1B2A) with foreground color
Instead of hardcoded `#0D1B2A`, use `bg-foreground` (which is near-black) for dark sections. This keeps things in the monochromatic palette. Affects:
- `Index.tsx` — NewsletterSection
- `PartnersPage.tsx` — hero
- `ImpactPage.tsx` — hero
- `CohortCountdown.tsx` — timer boxes

#### 3. Fix Tailwind color leaks
- `RankingPage.tsx`: Replace `text-yellow-400`, `text-gray-400`, `text-amber-600` podium colors with foreground/muted tones (e.g. rank badge using accent or foreground with opacity)

#### 4. Add accent-related CSS variables for semantic states
Add to `:root` in `index.css`:
- `--success: 142 71% 45%` (a muted green, for positive returns/confirmations)
- `--warning: 38 92% 50%` (amber)
- `--danger: 0 72% 51%` (already exists as destructive)

Then use `hsl(var(--success))` instead of hardcoded greens.

#### 5. Reduce hero empty space
- Change `min-h-[88vh]` to `min-h-0` and use padding instead (`pt-32 md:pt-44 pb-20 md:pb-28`)
- On desktop, consider a 2-column layout or allow the text to span wider

#### 6. Tighten section padding globally
- Reduce the default `py-24 md:py-32` to `py-16 md:py-24` for most sections
- Vary spacing between sections instead of using the same padding everywhere — some sections get `py-12 md:py-16`, others stay at `py-16 md:py-24`
- Reduce `gap-16` between grid columns to `gap-10 md:gap-12`

#### 7. Make content fill more width on desktop
- HowItWorks: Remove `max-w-3xl` constraint, use full container or `max-w-4xl`
- ProgramPage sections: Widen from `max-w-3xl` to `max-w-4xl`
- ImpactPage milestones: Remove `max-w-2xl` and let content use more horizontal space
- FinalCTA: Allow text to span wider

#### 8. WhatsApp button
Keep `#25D366` as it's the WhatsApp brand color — this is acceptable.

---

### Files to modify
- `src/index.css` — add success/warning CSS variables
- `src/pages/Index.tsx` — hero spacing, section padding
- `src/pages/ImpactPage.tsx` — palette + spacing
- `src/pages/PartnersPage.tsx` — palette + spacing
- `src/pages/RankingPage.tsx` — palette
- `src/pages/CaseStudiesPage.tsx` — spacing
- `src/pages/ProgramPage.tsx` — spacing
- `src/pages/AboutPage.tsx` — spacing
- `src/pages/GlossaryPage.tsx` — spacing
- `src/components/LiveStudentCounter.tsx` — palette
- `src/components/CapacityBar.tsx` — palette
- `src/components/CohortCountdown.tsx` — palette
- `src/components/NewsletterSignup.tsx` — palette
- `src/components/AnimatedCounter.tsx` — no change needed
- `src/components/HomeCaseStudies.tsx` — palette if needed
- `src/components/dashboard/PortfolioTab.tsx` — palette
- `src/components/dashboard/CaseStudySubmission.tsx` — palette
- `src/pages/CaseStudyDetailPage.tsx` — palette
- `tailwind.config.ts` — add success/warning color tokens

