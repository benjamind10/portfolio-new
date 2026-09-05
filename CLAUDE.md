# CLAUDE.md — Portfolio Project

Ben Duran's Industry 4.0 portfolio — a React 19 + TypeScript single-page application showcasing skills in Ignition, MQTT, and Unified Namespace (UNS). No backend, no router, no global state library. Single scrollable page with six sections in the order Hero → Architecture → Work → Experience → About → Contact.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 (class-based dark mode, `@theme` tokens in `src/index.css`) |
| Fonts | Inter (body) + JetBrains Mono (`font-mono`), both from Google Fonts in `index.html` |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Data viz | `d3-shape` only (`arc()` for the Hero OEE gauge; gauge colors are `@theme` tokens, not hex) |
| Scroll nav | Native anchors + `scroll-behavior: smooth` + `useActiveSection` (IntersectionObserver) |
| Tests | Vitest 5 + Testing Library (jsdom), `tests/` |
| CI | GitHub Actions `.github/workflows/ci.yml` — lint, typecheck, test, build on push and PR |
| Code quality | ESLint + TypeScript strict + Prettier |

---

## Directory Layout

```
src/
├── App.tsx                    Root component — MotionConfig(reducedMotion="user") wrapper, orders all sections
├── main.tsx                   React entry point
├── index.css                  Global CSS (Tailwind imports, @theme tokens, html scroll-behavior: smooth)
├── components/
│   ├── common/
│   │   ├── FadeInWrapper.tsx  Framer Motion scroll-triggered fade-in wrapper
│   │   ├── ImageCarousel.tsx  Reusable prev/next image carousel; lightbox is a role="dialog" with focus trap + focus return; requires `label`
│   │   └── SectionHeader.tsx  Section title + indigo divider + optional subtitle
│   ├── architecture/
│   │   ├── ArchitectureDiagram.tsx  7 TierCards in a grid + SVG connectors + agentic-layer button under tiers 4–7
│   │   ├── TierCard.tsx       aria-pressed tier button; shared-layout indigo ring on the selected card
│   │   ├── TierDetail.tsx     layoutId panel: purpose / why separate / decision / technologies; broker embeds UnsExplorer. Also exports AgenticDetail
│   │   └── UnsExplorer.tsx    Expandable topic tree over UNS_ROOT; selected leaf shows payload + schema rule
│   ├── work/
│   │   ├── CaseStudyGrid.tsx  Dense card grid; renders the selected study's panel inline after its card (col-span-full)
│   │   ├── CaseStudyCard.tsx  aria-expanded / aria-controls disclosure button: title, summary, first metric, tags
│   │   ├── CaseStudyPanel.tsx Problem / Constraint / Decision / Result + metrics + media (switch on media.kind / diagram)
│   │   └── diagrams/          TierStackDiagram (reads TIERS), AgentDagDiagram, SemanticLayerDiagram, OeeForensicsDiagram (SVG)
│   ├── Navbar.tsx             Sticky nav, theme toggle, mobile menu; anchors from content/sections.ts
│   ├── Hero.tsx               Landing section: copy from content/profile.ts, 3 animated cards over content/uns.ts (MQTT stream, OEE gauge, UNS path)
│   ├── Architecture.tsx       Centerpiece: owns selectedId (TierId | 'agentic', default 'broker'); renders diagram + detail from content/architecture.ts
│   ├── About.tsx              Profile photo, bio, skills, four operating principles from PROFILE; resume button only when PROFILE.resume is set
│   ├── Experience.tsx         Three-seat arc (SEATS legend + per-job seat badge) and timeline over JOBS (whileInView animation)
│   ├── Work.tsx               Six case studies from content/caseStudies.ts; owns selectedId (string | null, click again to collapse)
│   ├── ScrollToTopButton.tsx  Fixed scroll-to-top button, shown after 320 px
│   ├── Contact.tsx            Contact form (EmailJS) + info
│   └── Footer.tsx             Branding and social links
├── content/                   Typed content layer — every export has an exported interface
│   ├── sections.ts            Section registry: id, label, inNav — page order and nav order
│   ├── profile.ts             PROFILE: name, headline, pitch, CTAs (primary → #architecture), links, bio, skills, principles, resume? → Hero, About; ABOUT_COPY
│   ├── architecture.ts        TIERS (7, TierId union), AGENTIC_LAYER (mcp/semantic/dag, readsFrom tiers 4–7), ARCHITECTURE_COPY → Architecture
│   ├── caseStudies.ts         CASE_STUDIES (6, D5 order; problem/constraint/decision/result, metrics, tags, media), WORK_COPY → Work
│   ├── experience.ts          JOBS (4, newest first, each tagged to a Seat), SEATS (integrator / vendor / manufacturer + lesson), EXPERIENCE_COPY → Experience
│   └── uns.ts                 UNS_ROOT (fictional ISA-95 tree, UnsPayload leaves), getLeaves, MQTT_TOPICS → Hero cards + UnsExplorer
├── hooks/
│   ├── useTheme.ts            Dark/light toggle with localStorage persistence
│   └── useActiveSection.ts    IntersectionObserver over section ids → active nav link
├── utils/
│   └── cn.ts                  Classname utility: filter(Boolean).join(' ')
└── assets/
    ├── profile_pic.jpg
    ├── script-profiler-1.png
    ├── script-profiler-2.png
    ├── uns-sim-1.png
    ├── uns-sim-2.png
    ├── uns-sim-3.png
    ├── uns-sim-4.png
    └── uns-sim-5.png
tests/
├── setup.ts                   jest-dom matchers; matchMedia + IntersectionObserver stubs
├── public-safety.test.ts      Denylist scan of src/**/*.{ts,tsx} + index.html (hashed tokens + shape regexes)
├── content/uns.test.ts        UNS tree invariants: fullPath chain, leaf payloads in [0,1], topic count
├── content/architecture.test.ts  7 tiers indexed 1..7, non-empty fields, broker schemaRule, readsFrom ⊆ tiers 4–7
├── content/caseStudies.test.ts  6 studies, unique ids in D5 order, four narrative fields + ≥1 metric each, carousels reference 5 and 2 images
├── content/experience.test.ts  4 jobs, every seat is a SEATS key, all three seats present, JOBS[0].title is the title of record
├── content/profile.test.ts  Exactly 4 principles; if PROFILE.resume is set, public/resume.pdf must exist
├── components/architecture.test.tsx  Click each tier → only its decision shows; broker shows a UNS leaf path; agentic panel
├── components/work.test.tsx   Select a card → aria-expanded + its decision; select another → first collapses; carousel studies show images
├── components/imageCarousel.test.tsx  Lightbox: role=dialog, aria-modal, focus on Close, Tab cycles inside, Escape closes, focus returns
├── smoke/app.test.tsx         Renders App: landmarks, one section per SECTIONS id, nav anchors
├── smoke/hero.test.tsx        Hero renders PROFILE copy; cards tick under fake timers
├── smoke/about-experience.test.tsx  About renders bio / skills / principles, resume link iff PROFILE.resume; Experience renders every job and seat
└── hooks/useActiveSection.test.tsx
.github/workflows/ci.yml       lint → typecheck → test → build
```

---

## Dev Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # tsc -b && vite build (type-checks first)
npm run lint      # ESLint on all .ts/.tsx files
npm run typecheck # tsc -b (app + node projects, includes tests/)
npm test          # vitest run (jsdom)
npm run test:watch
npm run preview   # Serve the dist/ build locally
```

CI runs the same four gates in order: `npm run lint && npm run typecheck && npm test && npm run build`.

---

## Environment Setup

No environment variables are needed to run the site. The contact form reads `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` from a git-ignored `.env`; without them, submitting the form shows its error state (see Known Gotchas). There is no MQTT broker variable; the Hero's MQTT card is a local simulation.

---

## Component Map

| Component | Purpose |
|-----------|---------|
| `App.tsx` | Assembles all sections in `SECTIONS` order: Hero, Architecture, Work, Experience, About, Contact; tints alternate (Architecture, Experience, Contact tinted) |
| `Navbar.tsx` | Sticky nav; only consumer of `useTheme` |
| `Hero.tsx` | Intro copy from `PROFILE`; 3 dashboard cards (MQTT stream, OEE gauge, UNS path) driven by `UNS_ROOT` leaves and `MQTT_TOPICS` — simulated, no real MQTT |
| `Architecture.tsx` | Seven-tier reference architecture + agentic layer from `TIERS` / `AGENTIC_LAYER`; click a tier (or the agentic block) → `TierDetail` / `AgenticDetail`; broker detail embeds `UnsExplorer` over `UNS_ROOT` |
| `About.tsx` | Profile photo, bio paragraphs, skills, and four operating principles from `PROFILE`; resume download rendered only when `PROFILE.resume` is set |
| `Experience.tsx` | Three-seat arc (`SEATS`: integrator / vendor / manufacturer) and a timeline over `JOBS` from `content/experience.ts`; per-item `motion.div whileInView`, reduced motion via the root `MotionConfig` |
| `Work.tsx` | Six case studies from `CASE_STUDIES` as a card grid; one expands inline at a time into `CaseStudyPanel`; studies 1–4 embed a diagram, 5–6 embed `ImageCarousel` |
| `ImageCarousel.tsx` | Reusable carousel: prev/next nav, position indicator, Framer Motion transitions; click the image → lightbox dialog (focus trap, Escape, focus return) |
| `Contact.tsx` | Contact info + non-functional form |
| `FadeInWrapper.tsx` | `whileInView` fade-in; wraps any content |

---

## Key Data Flows

### 1. Theme Toggle
```
User clicks Sun/Moon in Navbar
→ useTheme.toggle()
→ setTheme (React state)
→ useEffect: document.documentElement.classList toggle 'dark'/'light'
→ localStorage.setItem('theme', ...)
→ All dark: CSS classes respond
```

### 2. Section Navigation
```
content/sections.ts SECTIONS (page order; inNav marks nav links)
→ Navbar renders <a href="#id"> for NAV_SECTIONS; logo → #hero
→ html { scroll-behavior: smooth } + section.scroll-mt-24 land below the 96 px sticky nav
→ useActiveSection(SECTION_IDS): one IntersectionObserver (rootMargin -96px) → most-visible id
→ matching link gets aria-current="true" + indigo text
```

### 3. Hero Cards
```
content/uns.ts UNS_ROOT (Enterprise/Plant-A/… with UnsPayload leaves)
→ getLeaves(UNS_ROOT).filter(hasPayload) = OEE_NODES; MQTT_TOPICS = one `<leaf>/state` per leaf
→ Hero: three setIntervals (2500 / 4000 / 3500 ms) pick the next message / OEE node / UNS path
→ gauge color class from oeeFillClass() (fill-gauge-good|warn|bad); state color from text-status-*
```

### 4. Architecture Section
```
content/architecture.ts TIERS (7, index 1..7) + AGENTIC_LAYER (readsFrom ⊆ tiers 4–7)
→ Architecture owns selectedId: TierId | 'agentic' (default 'broker')
→ ArchitectureDiagram: TierCard buttons (aria-pressed) + SVG connectors; agentic button spans the consumed columns
→ TierDetail (layoutId "architecture-detail") shows purpose / whySeparate / decision / technologies
→ tier.id === 'broker' → <UnsExplorer root={UNS_ROOT} schemaRule={tier.schemaRule} /> — same tree the Hero streams
```

### 5. Work Section
```
content/caseStudies.ts CASE_STUDIES (6, D5 order) + WORK_COPY
→ Work owns selectedId: string | null (nothing expanded by default; clicking the open card collapses it)
→ CaseStudyGrid (grid-flow-row-dense): CaseStudyCard buttons; the selected study's CaseStudyPanel is rendered right after its card with col-span-full
→ CaseStudyPanel: problem / constraint / decision / result, metrics, then media.kind === 'carousel' → ImageCarousel | 'diagram' → one of four diagram components
```

### 6. Reduced Motion
```
<MotionConfig reducedMotion="user"> in App.tsx
→ every framer-motion element honors prefers-reduced-motion (transforms skipped, opacity kept)
Hero and FadeInWrapper additionally read useReducedMotion() to drop the background SVG / delays
```

---

## Coding Conventions

- **Prettier**: single quotes, 2-space indent, 80-char lines, ES5 trailing commas
- **Dark mode**: always pair light and dark variants — `text-gray-900 dark:text-white`
- **Accent color**: use `indigo-500` / `indigo-600` for interactive/highlight elements
- **Design tokens**: no six-digit hex literals in `src/components/` — add a `--color-*` / `--font-*` to the `@theme` block in `src/index.css` and use the generated utility (`bg-surface-card`, `fill-gauge-good`, `text-status-running`, `font-mono`)
- **Copy lives in `src/content/`**: components render `PROFILE`, `UNS_ROOT`, etc.; do not inline prose or namespace paths in JSX
- **Section divider**: `<div className="w-20 h-1 bg-indigo-500 rounded mb-8" />`
- **Max-width**: `max-w-6xl mx-auto` on all section containers
- **Scroll sections**: every `<section>` needs `id="..."` and `className="scroll-mt-24"`
- **Animations**: use `<FadeInWrapper>` for scroll-triggered; use `motion.div` with `initial/animate` for mount-triggered (Hero pattern)
- **Classnames**: use `cn()` from `src/utils/cn.ts` when conditionally joining classes

---

## Known Gotchas

1. **Adding a section means editing `src/content/sections.ts`** — `SectionId` is a closed union; the app smoke test asserts the DOM's `main section[id]` order equals `SECTIONS`, so add the entry there and mount the component in `App.tsx` in the same position
2. **`useActiveSection` wants a stable `ids` array** — pass the module constant `SECTION_IDS` (or memoize); a fresh array each render rebuilds the observer
3. **Contact form fails without EmailJS env** — `emailjs.send` rejects before any network call when the three `VITE_EMAILJS_*` keys are undefined, and the UI shows "Something went wrong"
4. **`tests/public-safety.test.ts` fails the build on internal names** — it scans `src/**/*.{ts,tsx}` and `index.html` for SHA-256-hashed tokens (brands, colleagues, site codes, hostnames, database names) and shape regexes (IPv4, `.corp`/`.local`, `ABC12`/`1AB` site codes, `XX00MES` databases). Never add plaintext to the hash list; the regeneration one-liner is in the file header. The fictional namespace is `Enterprise/Plant-A/…`, never a real place
5. **Resume button is gated by `PROFILE.resume`** — About renders the download link only when `PROFILE.resume` is set in `src/content/profile.ts`, and `tests/content/profile.test.ts` fails if it is set while `public/resume.pdf` is absent. To ship the resume, add the PDF and set `resume: { href: '/resume.pdf', label: 'Download Resume' }`

---

## Further Reading

- [docs/architecture.md](docs/architecture.md) — full component tree, MQTT flow diagrams, UNS data shapes, theming internals, dead code inventory
