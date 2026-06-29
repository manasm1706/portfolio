# AGENTS.md — CareerOS Development Guide

This file is the single source of truth for anyone — human or AI — working on CareerOS.

If you are an AI coding agent (Codex, Claude Code, Cursor, etc.), **read this entire file before touching any code.** When a prompt conflicts with this document, this document wins. When this document is ambiguous, default to the simplest, cleanest option.

---

## 1. What CareerOS Is

CareerOS is a personal operating system for a software engineering student — a single dashboard that replaces a dozen open tabs (GitHub, LeetCode, Google Calendar, Unstop, Devfolio, Notion) with one calm, fast, premium interface.

It is **not**:
- a CRUD admin panel
- a Notion/Trello clone
- a generic "student dashboard"
- a SaaS product for multiple users

It is built for one person, used every day, and should feel like software — not a template.

**Current phase:** frontend-only MVP, built with realistic mock data. No backend, no real APIs, no auth, no AI logic yet.

---

## 2. Scope Boundaries — Read This Twice

Do **NOT** implement, scaffold, or stub the following until explicitly asked:

- ❌ Authentication / login / user accounts
- ❌ A real backend or database
- ❌ Real API calls (GitHub, LeetCode, Google Calendar, OpenAI, etc.)
- ❌ Actual AI/LLM logic — build the UI shell only
- ❌ Notifications system
- ❌ Multi-user support

All data comes from static, typed mock data inside `src/data/`. Build every screen as if the data source is real — components should not need rewrites when APIs are added later.

---

## 3. Tech Stack

- React 19 (+ React Compiler)
- TypeScript (strict mode)
- Vite
- Tailwind CSS v4
- shadcn/ui
- Motion (animation)
- Lucide Icons (only icon library — never mix)
- React Router
- Recharts (charts)
- Zustand (global state — used sparingly)
- TanStack Query (reserved for future API phase, not used yet)

---

## 4. Architecture

### 4.1 App Shell

```
┌──────────────────────────────────────────────┐
│ Top Navbar (search, command palette, profile)│
├───────────┬───────────────────────┬──────────┤
│  Sidebar  │     Main Content      │ Utility  │
│ (nav)     │     (current page)    │ Panel    │
└───────────┴───────────────────────┴──────────┘
```

Sidebar and Navbar are persistent. Only the main content area changes per route. The utility panel is contextual (e.g. shows resources relevant to the current page).

### 4.2 Primary Navigation (flat, no nested menus)

```
/dashboard
/calendar
/opportunities   (internships + hackathons + competitions + open source)
/coding          (GitHub + LeetCode + Codeforces + CodeChef tabs)
/projects
/resources
/analytics
/ai              (UI shell only, no real logic)
/profile
/settings
```

Keep routes shallow. Never go deeper than one level (`/projects/:id` is fine, `/projects/:id/edit/details/section` is not).

### 4.3 Folder Structure

```
src/
  app/            # routing, providers, root layout
  components/      # shared, reusable UI (Button, Card, Modal, Sidebar, CommandPalette...)
  features/        # feature-owned components/hooks/types
    dashboard/
    calendar/
    opportunities/
    coding/
    projects/
    resources/
    analytics/
    ai/
    profile/
    settings/
  data/            # typed mock data (the "fake backend")
  hooks/           # shared hooks only
  lib/             # utils, helpers, formatters
  store/           # zustand stores (theme, sidebar, search — keep minimal)
  types/           # shared TypeScript types
  styles/          # global css, design tokens
  assets/
```

Rules:
- If a component is used on more than one page → move it to `components/`.
- If a component is feature-specific → it stays inside that feature's folder.
- No catch-all `helpers/` or `misc/` folders.

### 4.4 State Management

- Default to local component state.
- Use Zustand **only** for: theme, sidebar collapsed/expanded, command palette open state, global search query.
- Never put page-specific data into global state.

### 4.5 Data Strategy

```
src/data/*.ts (typed objects)
        ↓
   components/pages consume directly
```

No fetch calls. No loading spinners for static mock data unless deliberately simulating a future async state for a skeleton-loading demo.

---

## 5. Design System

### 5.1 Principles

1. **Information first** — nothing decorative competes with content.
2. **Premium minimalism** — achieved through spacing, type, and consistency, not effects.
3. **Calm, not flashy** — should be pleasant to look at for hours, daily.
4. **Every element has a job** — if a widget doesn't help answer "what should I do / what's next / how am I doing," cut it.

### 5.2 Visual Inspiration

Linear, Vercel Dashboard, Raycast, GitHub, Stripe Dashboard, Arc Browser, Apple HIG. Take cues, don't clone.

### 5.3 Hard "Never" List

Never generate:
- glassmorphism stacked everywhere
- neon / RGB gamer aesthetics
- large decorative gradients
- floating blobs, particles, animated backgrounds
- scroll-hijacking or heavy parallax
- Bootstrap or Material-UI look-alike components
- crypto-dashboard aesthetics
- heavy box-shadows or overly rounded corners
- stock photography or random Unsplash images

### 5.4 Color Tokens

| Token | Hex | Use |
|---|---|---|
| Background | `#09090B` | App background |
| Surface | `#111214` | Cards, containers |
| Elevated Surface | `#17181B` | Modals, dropdowns, dialogs |
| Border | `#24262B` | Subtle dividers only |
| Primary (accent) | `#4F8CFF` | Buttons, links, active states |
| Secondary | `#8B5CF6` | AI features, special highlights |
| Success | `#22C55E` | |
| Warning | `#F59E0B` | |
| Danger | `#EF4444` | |
| Text Primary | `#FFFFFF` | |
| Text Secondary | `#A1A1AA` | |
| Text Muted | `#71717A` | |

Never hardcode hex values inline in components — pull from Tailwind theme / CSS variables.

### 5.5 Typography

- Font: **Geist** (fallback **Inter**)
- One large heading per page max
- Prefer medium weight; use bold sparingly
- Let whitespace create hierarchy, not font-size jumps

### 5.6 Spacing & Radius

- Spacing scale: `4 · 8 · 12 · 16 · 24 · 32 · 48`
- Border radius: `12px` standard, used consistently everywhere

### 5.7 Motion

Allowed: fade, scale, slide, hover-lift, skeleton loading, progress fill.
Not allowed: bounce, elastic, spin-for-effect, long transitions, decorative motion.
**Max duration: 250ms.** Motion should clarify state changes, never entertain.

### 5.8 Charts

Prefer line / area charts, small bar charts, progress rings. Avoid pie-chart soup and rainbow palettes — stick to the token colors above.

### 5.9 Icons

Lucide only. Icons support a label; they never replace one.

---

## 6. Component & Widget Rules

- One component = one responsibility. `GitHubWidget`, not `DashboardGitHubStatsCardContainerWrapper`.
- **Widgets are portable.** Build `GitHubWidget`, `LeetCodeWidget`, `ProjectWidget`, `OpportunityWidget`, `AnalyticsWidget` etc. as standalone components that can be dropped onto the Dashboard or any other page — they should never be hardcoded to one page's layout.
- Cards answer exactly one question. Don't let a card grow into a mini-app.
- Avoid nested cards where possible.

---

## 7. Content & Mock Data Rules

### 7.1 Make data feel real

| ❌ Bad | ✅ Good |
|---|---|
| `Project 1` | `SafeReady — 82% — Updated yesterday` |
| `Competition A` | `Flipkart GRID — Opening Soon — Prep 68%` |
| `10, 20, 30` on a chart | A believable 6-month commit/LeetCode trend |

### 7.2 External links

**Never hardcode real URLs.** Use a plain label only — the project owner will wire up real links later.

```
✅ "Website" → Flipkart GRID
✅ "GitHub" 
✅ "Documentation"
❌ https://unstop.com/...
```

### 7.3 Images

No stock photos, no random Unsplash. Use Lucide icons, initials-based avatars, simple SVGs, or flat token-colored placeholders.

---

## 8. Code Quality Standards

- TypeScript strict mode — no `any`.
- Small, focused components and functions; split files before they get unwieldy.
- Comments only where the "why" isn't obvious from the code itself.
- Every page must handle: empty state, loading/skeleton state, and a "no data yet" state with a meaningful next action (not just "No Data").
- Accessibility is mandatory, not a nice-to-have: semantic HTML, visible focus states, keyboard navigation, sufficient contrast.
- Responsive across desktop → laptop → tablet → mobile. Reorganize content for small screens — never just hide important information.

---

## 9. Workflow Rules for AI Agents

1. **One sprint, one scope.** If asked to build the Dashboard, do not also touch Calendar, Sidebar, or global styles unless explicitly told to.
2. **No silent scope creep.** Don't "improve" unrelated files while working on a feature.
3. **No unfinished work.** Don't leave `// TODO: style this later` or placeholder layouts — every shipped component should look production-ready, even with mock data.
4. **Ask via assumption, not blocking.** If something is ambiguous, make the most reasonable choice consistent with this file and state the assumption briefly — don't stall on it.
5. Typical prompt shape to expect:
   ```
   Read AGENTS.md.
   Sprint: Dashboard widgets only.
   Build: Today's Focus, GitHub Overview, LeetCode Progress widgets.
   Do not touch routing, sidebar, or other pages.
   ```

---

## 10. Definition of Done

A feature is complete only when all of these are true:

- [ ] Matches the design tokens (colors, spacing, radius, type) — no inline magic values
- [ ] Responsive on desktop, tablet, and mobile
- [ ] Animations (if any) ≤ 250ms and purposeful
- [ ] Empty / loading / populated states all handled
- [ ] Mock data reads as believable, not placeholder-y
- [ ] No hardcoded external URLs — labels only
- [ ] Component is reusable where it should be (widgets aren't page-locked)
- [ ] Keyboard-navigable, semantic HTML, visible focus states
- [ ] No leftover TODOs or unfinished styling

---

## 11. High-Level Build Order (reference only)

1. Foundation — Tailwind, shadcn, theme, base layout
2. Design system — Button, Card, Badge, Modal, Tabs, Sidebar, Navbar, Command Palette
3. App shell — Sidebar + Navbar + responsive layout
4. Dashboard — widgets first, then arrangement
5. Calendar
6. Opportunities (internships, hackathons, competitions, open source — one unified tracker)
7. Coding dashboard (GitHub / LeetCode / Codeforces / CodeChef tabs)
8. Projects
9. Resources (searchable knowledge library)
10. Analytics
11. AI Coach (UI shell only)
12. Profile & Settings

Future (explicitly out of scope for now): real API integrations, auth, backend/cloud sync, notifications, offline/PWA support.

---

## 12. The One-Sentence Test

Before shipping anything, ask: **"Does this make CareerOS feel calmer and more like real software, or does it make it feel like another dashboard?"**

If it's the latter, redo it.