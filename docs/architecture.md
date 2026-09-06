# Architecture Reference

Deep-reference document for the portfolio SPA. See [CLAUDE.md](../CLAUDE.md) for the quick-start overview and conventions.

---

## Component Tree

```
index.html                                  meta description / OG / Twitter tags, image/png favicon, fonts, pre-paint theme script
└── src/main.tsx                            StrictMode + createRoot
    └── <App />                             src/App.tsx — <MotionConfig reducedMotion="user">
        ├── <Navbar />                      src/components/Navbar.tsx — useTheme, useActiveSection, NAV_SECTIONS
        ├── <main>
        │   ├── <Hero />                    src/components/Hero.tsx — PROFILE copy; three cards over UNS_ROOT / MQTT_TOPICS
        │   ├── <Architecture />            src/components/Architecture.tsx — owns selectedId (TierId | 'agentic')
        │   │   ├── <ArchitectureDiagram /> src/components/architecture/ArchitectureDiagram.tsx
        │   │   │   └── <TierCard /> × 7    src/components/architecture/TierCard.tsx — aria-pressed buttons
        │   │   └── <TierDetail /> | <AgenticDetail />  src/components/architecture/TierDetail.tsx
        │   │       └── <UnsExplorer />     src/components/architecture/UnsExplorer.tsx (broker tier only)
        │   ├── <Work />                    src/components/Work.tsx — owns selectedId (string | null)
        │   │   └── <CaseStudyGrid />       src/components/work/CaseStudyGrid.tsx
        │   │       ├── <CaseStudyCard /> × 6   src/components/work/CaseStudyCard.tsx — aria-expanded buttons
        │   │       └── <CaseStudyPanel />  src/components/work/CaseStudyPanel.tsx (the selected study only)
        │   │           ├── <ImageCarousel />   src/components/common/ImageCarousel.tsx (study 6)
        │   │           └── one of TierStackDiagram | AgentDagDiagram | SemanticLayerDiagram | OeeForensicsDiagram | KnowledgeGraphDiagram
        │   │                               src/components/work/diagrams/ (studies 1–5)
        │   ├── <Experience />              src/components/Experience.tsx — SEATS legend + JOBS timeline
        │   ├── <About />                   src/components/About.tsx — bio, skills, principles, optional resume
        │   └── <Contact />                 src/components/Contact.tsx — ContactForm | MailtoCta
        ├── <Footer />                      src/components/Footer.tsx — PROFILE.links
        └── <ScrollToTopButton />           src/components/ScrollToTopButton.tsx — visible after 320 px
```

**Shared components:**
- `src/components/common/SectionHeader.tsx` — title, `w-16 h-1 bg-indigo-500` divider, optional subtitle; every section uses it
- `src/components/common/FadeInWrapper.tsx` — Framer Motion `whileInView` fade-in (`delay`, `yOffset`, `className`; `viewport={{ once: true, amount: 0.2 }}`; drops the offset and delay under reduced motion)
- `src/components/common/ImageCarousel.tsx` — prev/next carousel; the image is a `<button>` that opens a portaled lightbox (`role="dialog" aria-modal="true" aria-label={label}`) with focus on Close, a Tab/Shift+Tab trap, Escape to close, and focus return to the opener

**Utilities:**
- `src/utils/cn.ts` — classname helper (`classes.filter(Boolean).join(' ')`)
- `src/utils/emailConfig.ts` — `getEmailConfig(env = import.meta.env): EmailConfig | null`

Every component under `src/components/` is reachable from `App.tsx`; there is no dead code.

---

## Content Layer — `src/content/`

Components render; copy and structure live here. Every exported value has an exported interface, and `tests/public-safety.test.ts` scans this directory (and everything else under `src/`) on every run.

| Module | Exports | Consumers |
|--------|---------|-----------|
| `sections.ts` | `SectionId` (closed union `hero \| architecture \| work \| experience \| about \| contact`), `Section { id, label, inNav }`, `SECTIONS` (page order), `SECTION_IDS`, `NAV_SECTIONS` | `App` (order), `Navbar` (links), `useActiveSection` (observed ids) |
| `profile.ts` | `PROFILE: Profile { name, headline, pitch, cta, links { github, linkedin, email, location? }, bio, skills, principles, resume? }`, `ABOUT_COPY`, `CONTACT_COPY`, plus `Link`, `Principle`, `Resume` | `Hero`, `About`, `Contact`, `Footer`; `index.html` mirrors `headline` / `pitch` by hand (checked by `tests/shell.test.ts`) |
| `uns.ts` | `UnsPayload { oee, availability, performance, quality }` (0–1 floats), `UnsNode { name, fullPath, payload?, children? }`, `UnsLeaf`, `UNS_ROOT`, `getLeaves()`, `hasPayload()`, `MQTT_TOPICS` | `Hero` (cards), `UnsExplorer` (via `TierDetail`) |
| `architecture.ts` | `TierId` (7-member union), `Tier { id, index 1–7, name, purpose, whySeparate, decision, technologies, schemaRule? }`, `TIERS`, `AgenticComponent { id: mcp \| semantic \| dag, name, purpose, readsFrom }`, `AGENTIC_LAYER`, `ARCHITECTURE_COPY` | `Architecture`, `ArchitectureDiagram`, `TierDetail`, `TierStackDiagram` |
| `caseStudies.ts` | `CaseStudy { id, title, summary, problem, constraint, decision, result, metrics, tags, media, links? }`, `Media` (`carousel` with images \| `diagram` with a `DiagramKind`), `CaseStudyImage`, `Metric`, `CASE_STUDIES` (6), `HIDDEN_CASE_STUDIES` (1, the script-profiler study kept off the grid; no component reads it), `WORK_COPY` | `Work`, `CaseStudyGrid`, `CaseStudyCard`, `CaseStudyPanel` |
| `experience.ts` | `Seat` (`integrator \| vendor \| manufacturer`), `SeatInfo { label, lesson }`, `SEATS`, `Job { id, title, org, dates, mode?, summary, seat, tags }`, `JOBS` (4, newest first), `EXPERIENCE_COPY` | `Experience` |

### The namespace model

`uns.ts` declares a nested spec (`Enterprise → Plant-A → areas → lines → work cells`) and `materialize()` derives each node's `fullPath` from its ancestry, so paths can never disagree with the tree. Leaves carry an `UnsPayload`; `oee` is computed as `availability × performance × quality`. `MQTT_TOPICS` is one `<leaf.fullPath>/state` per leaf. The names are fictional and ISA-95-shaped; nothing here is a real plant, site, host, or machine, and the denylist test keeps it that way.

---

## Data Flows

### Theme toggle

```
Navbar Sun/Moon click
→ useTheme.toggle()                        src/hooks/useTheme.ts
→ setTheme('light' | 'dark')
→ useEffect: <html> classList add/remove 'dark' / 'light'; localStorage.setItem('theme', …)
→ Tailwind `dark:` variants respond (@custom-variant dark in src/index.css)
```

Initial value: `localStorage.theme`, else `prefers-color-scheme: dark`. An inline script at the bottom of `index.html` applies the same rule before React mounts so there is no flash. `useTheme` is instantiated once, in `Navbar`.

### Section navigation

```
SECTIONS (content/sections.ts)
→ Navbar: <a href="#id"> for each NAV_SECTIONS entry; logo → #hero
→ html { scroll-behavior: smooth } (auto under prefers-reduced-motion) + section.scroll-mt-24
→ useActiveSection(SECTION_IDS): one IntersectionObserver, rootMargin '-96px 0px 0px 0px' (the sticky nav's height), thresholds 0…1 in tenths
→ most-visible id → aria-current="true" + indigo text on the matching link
```

Pass `useActiveSection` a stable array (`SECTION_IDS` is a module constant); a fresh array every render would rebuild the observer.

### Hero cards

```
UNS_ROOT → getLeaves().filter(hasPayload) → OEE nodes; MQTT_TOPICS
→ three setIntervals (2500 / 4000 / 3500 ms) advance the MQTT message, the OEE node, and the UNS breadcrumb
→ OEE gauge: d3-shape arc(); fill class from oeeFillClass() → fill-gauge-good | warn | bad
→ equipment state colour: text-status-running | idle | stopped | error
```

Everything is simulated locally; there is no broker connection and no MQTT dependency. Under reduced motion the background SVG is dropped and the cards render statically.

### Architecture section

```
TIERS + AGENTIC_LAYER
→ Architecture owns selectedId: TierId | 'agentic' (default 'broker')
→ ArchitectureDiagram: 7 TierCard buttons (aria-pressed) in a grid, inline SVG connectors, an agentic-layer button spanning the tiers it reads from (4–7)
→ TierDetail (layoutId "architecture-detail"): purpose / whySeparate / decision / technologies
   └── tier.id === 'broker' → <UnsExplorer root={UNS_ROOT} schemaRule={tier.schemaRule} />
→ AgenticDetail (same layoutId) for the 'agentic' selection
```

Only the selected tier's text is in the DOM (mount-only content animation, no exit), which is what lets the component test assert "this decision and no other".

### Work section

```
CASE_STUDIES + WORK_COPY
→ Work owns selectedId: string | null (nothing open by default; clicking the open card collapses it)
→ CaseStudyGrid (grid-flow-row-dense): CaseStudyCard buttons; the selected study's CaseStudyPanel follows its card with col-span-full
→ CaseStudyPanel: problem / constraint / decision / result, metrics, then
   media.kind === 'carousel' → <ImageCarousel images label />
   media.kind === 'diagram'  → TierStackDiagram | AgentDagDiagram | SemanticLayerDiagram | OeeForensicsDiagram | KnowledgeGraphDiagram
```

`TierStackDiagram` reads `TIERS` rather than duplicating tier names.

### Contact

```
getEmailConfig(import.meta.env)            src/utils/emailConfig.ts
→ all three VITE_EMAILJS_* keys non-empty → <ContactForm config /> → emailjs.send(config.serviceId, config.templateId, fields, config.publicKey)
→ any key missing → <MailtoCta email={PROFILE.links.email} />
```

Vite inlines `import.meta.env.VITE_*` at build time, so the branch is fixed per build. `Contact` accepts an optional `config` prop so tests can drive either branch without touching the environment. The form's ids come only from the resolved config, never from `import.meta.env` directly.

### Reduced motion

`<MotionConfig reducedMotion="user">` in `App.tsx` makes every framer-motion element skip transforms (opacity still animates) when `prefers-reduced-motion` is set. `Hero` and `FadeInWrapper` additionally call `useReducedMotion()` to drop the background SVG and the stagger delays. `index.css` resets `scroll-behavior` to `auto` under the same media query.

---

## Design Tokens

`src/index.css` holds the only hex literals in the project, inside an `@theme` block. Tailwind v4 turns each into a utility:

| Token family | Tokens | Utilities used |
|--------------|--------|----------------|
| Accent | `--color-accent-500/600` | mirrors `indigo-500/600` |
| Surfaces | `--color-surface-card`, `--color-surface-footer` | `bg-surface-card` (Hero cards, dark), `dark:bg-surface-footer` |
| Equipment state | `--color-status-running/idle/stopped/error` | `text-status-*` in the MQTT card |
| OEE gauge | `--color-gauge-good/warn/bad/track/label` | `fill-gauge-*` on the d3-shape arcs |
| Type | `--font-mono` (JetBrains Mono) | `font-mono` on topics, paths, payloads |

Inter (body) and JetBrains Mono are both requested from Google Fonts in `index.html`.

---

## Tests — `tests/`

Vitest 5 + Testing Library under jsdom; `tests/setup.ts` registers jest-dom matchers and stubs `window.matchMedia` and `IntersectionObserver` (the latter as a recording mock with a `trigger(entries)` helper).

| File | Guards |
|------|--------|
| `public-safety.test.ts` | No denylisted token (SHA-256-hashed; brands, colleagues, site codes, hostnames, database names, MCP connection names) or shape (IPv4, `.corp`/`.local`, site-code and database-name patterns) in `src/**/*.{ts,tsx}` or `index.html`; includes a self-check on a known-bad fixture |
| `shell.test.ts` | `index.html` favicon `type="image/png"`; description / `og:*` / `twitter:*` text equals `PROFILE.pitch` and `PROFILE.name — PROFILE.headline`; both fonts requested |
| `content/uns.test.ts` | `fullPath` chain, leaf payloads in [0, 1], `MQTT_TOPICS.length === leaves` |
| `content/architecture.test.ts` | 7 tiers indexed 1..7, non-empty fields, broker `schemaRule`, `readsFrom ⊆ TIERS` |
| `content/caseStudies.test.ts` | 6 studies, unique ids in order (`i3x-knowledge-graph` second), four narrative fields + ≥ 1 metric, 5 diagrams, the carousel study references 5 images; the hidden profiler study keeps its 2 and shares no id with the grid |
| `content/experience.test.ts` | 4 jobs, every seat is a `SEATS` key, all three seats present, `JOBS[0].title` is the title of record |
| `content/profile.test.ts` | Exactly 4 principles; if `PROFILE.resume` is set, `public/resume.pdf` exists |
| `components/architecture.test.tsx` | Click each tier → only its decision shows; broker shows a leaf path; agentic panel |
| `components/work.test.tsx` | One study expanded at a time; `aria-expanded`; carousel studies show images |
| `components/imageCarousel.test.tsx` | Lightbox dialog semantics, focus trap, Escape, focus return |
| `components/contact.test.tsx` | `getEmailConfig` null-unless-complete; mailto vs form branch; send uses the injected config (EmailJS mocked); labeled socials |
| `smoke/app.test.tsx` | Landmarks; one `section[id]` per `SECTIONS` entry in order; nav anchors |
| `smoke/hero.test.tsx` | Hero renders `PROFILE` copy; cards tick under fake timers |
| `smoke/about-experience.test.tsx` | About renders bio / skills / principles, resume link iff `PROFILE.resume`; Experience renders every job and seat |
| `hooks/useActiveSection.test.tsx` | Returned id follows the most-visible stubbed entry |

CI (`.github/workflows/ci.yml`, Node 22) runs `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` as separate steps on push and pull request.

---

## Styling Conventions

| Convention | Detail |
|------------|--------|
| CSS framework | Tailwind CSS v4 via `@tailwindcss/vite`; no `tailwind.config.js`, no PostCSS config |
| Dark mode | Class-based: `dark:` prefix; `.dark` toggled on `<html>` by `useTheme` and the pre-paint script |
| Accent color | `indigo-500` / `indigo-600` for interactive elements |
| Section header | `<SectionHeader title subtitle? />` — do not hand-roll a heading + divider |
| Max-width | `max-w-6xl mx-auto` on all section wrappers |
| Scroll targets | every `<section>` has `id` and `scroll-mt-24` |
| Colours | tokens only in `src/components/` (`bg-surface-*`, `fill-gauge-*`, `text-status-*`); hex lives in `index.css` |
| `cn()` utility | `src/utils/cn.ts` — simple filter+join; not clsx or shadcn/ui |
| Formatting | Prettier: single quotes, 2-space indent, 80 chars, ES5 trailing commas |

---

## Assets

| File | Location | Purpose |
|------|----------|---------|
| Profile photo | `src/assets/profile_pic.jpg` | About section avatar |
| UNS Simulator screenshots ×5 | `src/assets/uns-sim-1..5.png` | Case study 6 carousel |
| Script Profiler screenshots ×2 | `src/assets/script-profiler-1..2.png` | Hidden study in `HIDDEN_CASE_STUDIES`, not rendered |
| Favicon | `public/computer-chip.png` (512×512) | Browser tab icon; declared `type="image/png"` in `index.html` |
| Resume (optional) | `public/resume.pdf` | Served only when present **and** `PROFILE.resume` is set; `tests/content/profile.test.ts` fails if the two disagree |

---

## Deferred Until the Hosting Target Is Named

- `vite.config.ts` `base` (needed only for a sub-path host such as GitHub Pages)
- `og:url`, a `<link rel="canonical">`, and an absolute `og:image` URL in `index.html`
- Deploy automation in `.github/workflows/`
