# PROJECT_PROGRESS

## Project Overview

Premium, cinematic digital marketing portfolio frontend for **Samah**. Built as a fully decoupled Next.js application living inside the Laravel monorepo at `frontend/`, with zero Laravel source modifications. Communicates via a typed API layer (mock-backed in Phase 1).

## Current Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first tokens)
- GSAP + `@gsap/react` + ScrollTrigger
- Framer Motion, Lenis, SplitType
- Three.js + React Three Fiber + Drei
- Zustand, Zod, React Hook Form
- next-themes, Lucide

## Folder Structure

```
frontend/
  app/                 # routes, layout, SEO (sitemap, robots)
  components/
    intro/             # opening animation
    layout/            # header, footer, cursor, background, mobile nav
    hero/              # hero + R3F phone scene
    about/ services/ portfolio/ stats/
    providers/ ui/
  constants/ hooks/ lib/ services/api/ stores/ styles/ types/
  public/images/
  PROJECT_PROGRESS.md
```

## Completed Features

- [x] Next.js scaffold in `frontend/` (Laravel untouched)
- [x] Typography: **Edu VIC WA NT Hand** for headings only + Outfit for body
- [x] Tobago (`#422B23`) site-wide base background; Rose accent; Fantasy/Vanilla Ice heading contrast rule
- [x] Theme provider (Tobago-first dark)
- [x] Aurora + noise background layers + glass panels
- [x] Typed API client + mock adapters (about, services, projects, stats)
- [x] Lenis smooth scrolling (respects reduced motion)
- [x] Custom cursor (Rose glow + magnetic labels)
- [x] Magnetic buttons, desktop nav, mobile bottom nav, footer
- [x] Intro animation (skippable, reduced-motion safe)
- [x] Hero marketing dashboard (analytics panel, growth bars, channel tiles) — fixed in hero only
- [x] About (photo, timeline, achievements, mission)
- [x] Services (interactive hover demos)
- [x] Portfolio grid + Framer Motion case-study modal
- [x] Statistics counters + chart draw
- [x] Admin console: login, sidebar nav, dashboard + module pages (mock auth)
- [x] Admin login authenticated by **Laravel Sanctum** (Next only proxies + stores httpOnly session cookie)
- [x] Next.js wired to `NEXT_PUBLIC_API_URL` (mock fallback still available)

## Features In Progress

- None

## Planned Features

- Industries, Case Studies page, Testimonials, Process timeline
- AI Marketing Assistant
- Multi-step Booking wizard
- Blog preview (WordPress/Laravel-fed)
- FAQ, Contact map + live availability
- Wire mock API to real Laravel REST endpoints

## Technical Decisions

- **Decoupled `frontend/` folder** — keeps Laravel Boost/Pest stack intact; API swap later via `NEXT_PUBLIC_API_URL`.
- **Mock-first API services** — same function signatures for production fetch.
- **GSAP for scroll/timeline; Framer for modal UI state** — matches plan animation conventions.
- **Lazy R3F morphing crystal + mobile/reduced-motion fallback** — one persistent object travels with scroll instead of a hero-only phone.
- **Tobago site-wide base + Fantasy/Vanilla Ice headings** — avoids low-contrast dark-on-dark heading bug; WCAG-conscious contrast on dark UI.
- **Edu VIC WA NT Hand for headings only** — Outfit remains body; never apply display font to long copy.
- **SVG placeholder imagery** — brand-aligned until real photography/assets arrive.

## Dependencies Added

- `gsap`, `@gsap/react` — core animation + React lifecycle
- `framer-motion` — modal/presence
- `lenis` — smooth scroll
- `split-type` — hero text reveal
- `three`, `@react-three/fiber`, `@react-three/drei` — hero 3D
- `zustand` — UI store (intro/cursor)
- `zod`, `react-hook-form`, `@hookform/resolvers` — forms-ready
- `next-themes`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`

## TODO List

- [ ] Replace SVG placeholders with photography / real case assets
- [ ] Connect Laravel API endpoints
- [ ] Phase 2 sections (testimonials, booking, AI, blog, FAQ, contact)
- [ ] Lighthouse pass and asset compression audit

## Known Issues

- Custom cursor disabled on coarse pointers (intentional)
- Newsletter form is client-only shell (no backend yet)
- Privacy page is a placeholder

## Future Improvements

- ScrollTrigger + Lenis sync helper if scrubbed sections expand
- Shared magnetic wrapper for links (not only buttons)
- Service worker / partial prerender tuning

## Changelog

### 2026-07-27 — Laravel PHP backend API

- Installed Sanctum; added `/api/v1` public + admin routes
- Domain tables: projects, services, about, stats, testimonials, messages, bookings, blogs, gallery, AI conversations, SEO
- Seeded admin `admin@samah.studio` / `admin123` + portfolio content
- Frontend `.env.local` points to `http://localhost:8000` with `NEXT_PUBLIC_USE_MOCK=false`
- Pest feature tests for about/projects/auth passing

### 2026-07-26 — Admin console shell

- Added `/admin/login` with cookie session middleware guard
- Admin sidebar: Dashboard, Projects, Blogs, Services, Statistics, Testimonials, Messages, Bookings, AI Conversations, Gallery, Analytics, Settings, SEO, Dark Mode
- Dashboard/Projects/Services/Statistics wired to mock API; other modules are ready shells
- Demo credentials via `NEXT_PUBLIC_ADMIN_EMAIL` / `NEXT_PUBLIC_ADMIN_PASSWORD`

### 2026-07-26 — Portfolio modal, Biography polish, section dividers

- Fixed Featured Projects popups via body portal, scroll lock, Escape close, restored system cursor while open
- Rebuilt Biography layout (sticky portrait, clearer timeline, safer scroll reveals)
- Added animated `SectionDivider` between major sections

- Swapped display font to Edu VIC WA NT Hand (headings only)
- Made Tobago the site-wide base background; Rose accent on dark
- Enforced Fantasy/Vanilla Ice heading contrast on Tobago
- Replaced hero phone with persistent scroll-morphing R3F crystal (stages through About → Services → Portfolio → Stats → AI/footer)
- Verified `npm run build` succeeds

### 2026-07-26 — Phase 1 foundation + core experience

- Scaffolded Next.js 15 app at `frontend/`
- Implemented design tokens, shell, intro, hero, About, Services, Portfolio modal, Stats, Footer
- Added mock API layer and SEO baseline files
- Verified `npm run build` succeeds (static generation for `/`, `/privacy`, sitemap, robots)
