---
date: 2026-09-04
git_commit: b9b1098
branch: main
status: implemented
design: 3-design.md
research: 2-research.md
---

# Structure: Architect-Grade Portfolio SPA Update

## Approach

One typed content layer under `src/content/` drives every section, and one fictional-but-ISA-95-realistic namespace model (`src/content/uns.ts`) feeds both the Hero cards and the new Architecture section's explorer, so the page demonstrates a Unified Namespace instead of describing one. Components become pure renderers; the hand-laid React + Framer Motion Architecture section is the centerpiece, Demos becomes Work with six case studies, and the repo is brought to declared deps, zero dead code, native scroll, `@theme` tokens, Vitest, and GitHub Actions. Phases are vertical slices: each lands one section or one repo-quality slice end to end, with its own tests, and closes on a green `lint · typecheck · test · build`.

## Desired End State

- `App.tsx` mounts Hero → Architecture → Work → Experience → About → Contact → Footer; nav reads Architecture · Work · Experience · About · Contact; section ids are `hero architecture work experience about contact`; the string `demos` appears nowhere in `src/`.
- Hero h2 reads "Manufacturing Systems Architect · Unified Namespace, MES, Agentic AI"; the three Hero cards and the Architecture broker explorer both read `UNS_ROOT` from `src/content/uns.ts`; the string `Richmond` appears nowhere in the namespace (`grep -rn "Richmond" src/components/Hero.tsx src/content/uns.ts` prints nothing; the real location line is `PROFILE.links.location`, rendered by Contact, per Open Question 4).
- All site copy lives in `src/content/{sections,profile,uns,architecture,caseStudies,experience}.ts`; every exported content object has an exported interface; no `any` in `src/content/`.
- Six case studies each carry non-empty `problem`, `constraint`, `decision`, `result` and at least one metric; studies 5 and 6 embed `ImageCarousel`, whose lightbox has `role="dialog"`, `aria-modal`, a focus trap, and focus return.
- These paths no longer exist: `src/components/{MQTTExplorer,UNSExplorer,NamespaceExplorer,LogSimulator,Mapp,Demos,UNSSimulatorDemo,ScriptProfilerDemo}.tsx`, `src/hooks/useMqtt.ts`, `src/App.css`, `src/data/`, `src/assets/react.svg`, `public/vite.svg`, `tailwind.config.js`. `package.json` no longer lists `mqtt`, `react-json-view-lite`, `react18-json-view`, `d3`, `@types/d3`, `autoprefixer`, `postcss`, `react-scroll`, `@types/react-scroll`; it lists `d3-shape` and `@types/d3-shape` directly.
- `src/index.css` has an `@theme` block for accent, surface, status, and gauge colors plus `--font-mono` (JetBrains Mono); no six-digit `#hex` literal remains under `src/components/`; `<MotionConfig reducedMotion="user">` wraps the tree.
- `npm run lint && npm run typecheck && npm test && npm run build` passes locally and in `.github/workflows/ci.yml` on push and pull request; `vite build` prints no chunk-size warning.
- The public-safety test scans `src/**/*.{ts,tsx}` and `index.html` against hashed denylist tokens and shape patterns, and contains a self-check proving it fails on a known-bad fixture.
- Contact renders the EmailJS form only when all three `VITE_EMAILJS_*` keys resolve at build time, otherwise a mailto CTA; no phone number is on the page; `.env.example` documents the keys; `ImportMetaEnv` is typed.
- The About resume button renders only when `PROFILE.resume` is set, and a test fails if it is set while `public/resume.pdf` is absent.
- `index.html` carries meta description, Open Graph, and Twitter card tags and a `type="image/png"` favicon; `CLAUDE.md`, `README.md`, and `docs/architecture.md` describe the code as it exists.

## Implementation Progress

- [x] Phase 1: Repo reads clean, nav goes native, tests and CI exist
- [x] Phase 2: Hero claims the architect role on the shared namespace model
- [x] Phase 3: Architecture section becomes the centerpiece and the page reorders around it
- [x] Phase 4: Work replaces Demos with six case studies
- [x] Phase 5: Experience tells the three-seat arc, About carries principles and a verified resume link
- [x] Phase 6: Contact never ships a control that always fails
- [x] Phase 7: Ship-ready shell with metadata and docs that match the code

## Resolved Decisions

Carried forward from `3-design.md` (approved 2026-09-04). Settled; listed for traceability.

### D1: Hero positions as architect, Experience keeps the employer's title
**Decision:** Hero h2 becomes "Manufacturing Systems Architect · Unified Namespace, MES, Agentic AI"; Experience keeps "MES Engineer — Fortune Brands Innovations" as record. The pitch leads with designing data models that make automated reasoning possible.
**Rationale:** Positioning and record stay distinct, avoiding title drift while putting "architect" above the fold. Current h2 is "Manufacturing Software Engineer" (`Hero.tsx:203-215`); the employer title is at `Experience.tsx:9`. Condition: Ben confirms the current title before Phase 5 closes.

### D2: Technologies and counts on, brand names off, identifiers never
**Decision:** Vendors/technologies and scale counts are published; business-unit brand names are not ("three plants in three states"); hostnames, site codes, database names, object IDs, and colleague/manager names are enforced absent by test. The fictional namespace is renamed from `Enterprise/Richmond/...` to an ISA-95 shape like `Enterprise/Plant-A/Extrusion/Line19/...`.
**Rationale:** Counts prove scale without identifying anything; the test turns policy into a build failure. Current namespace at `Hero.tsx:8-14`, `unsData.ts:10-183`. Structure refinement: the denylist is stored as SHA-256 hashes of lowercased tokens plus shape regexes, so the test file itself never publishes the names it guards against.

### D3: Proof before biography
**Decision:** Page order Hero → Architecture → Work → Experience → About (with Principles) → Contact → Footer; nav Architecture · Work · Experience · About · Contact; ids `hero architecture work experience about contact`; `demos` retired.
**Rationale:** Matches the ticket's success metric. Current order at `App.tsx:14-20`, nav at `Navbar.tsx:10-15`.

### D4: Architecture section is hand-laid React, not D3
**Decision:** Seven tier cards in a CSS grid, inline SVG connectors, Framer `layoutId` detail panel, all data from `architecture.ts`; the agentic layer (MCP servers, semantic layer, multi-agent DAG) drawn as a consumer of tiers 4–7; the broker tier's detail embeds an `UnsExplorer` reading `uns.ts`.
**Rationale:** Behaves like software rather than a picture of software and reuses the page's motion vocabulary; avoids the imperative D3 pattern that died in `NamespaceExplorer.tsx:20-68`. Only `arc()` from `d3-shape` remains (`Hero.tsx:4,60-76`).

### D5: Six case studies in Problem → Constraint → Decision → Result shape
**Decision:** In order: (1) seven-tier production UNS; (2) multi-agent reporting DAG with the ticket → research → plan → execute → verify workflow inside it; (3) semantic layer for machine consumption; (4) OEE data-model forensics; (5) UNS Simulator (5 screenshots); (6) Ignition Script Profiler module (2 screenshots). 1–4 are text plus a small inline diagram; 5–6 embed `ImageCarousel`. Card grid with inline expanding panel, no tabs.
**Rationale:** Each new study is an architect-tier claim the record supports; the demos become supporting evidence. Current tabs at `Demos.tsx:6-13`; images at `UNSSimulatorDemo.tsx:3-7`, `ScriptProfilerDemo.tsx:3-4`.

### D6: Typed content layer
**Decision:** All copy moves into `src/content/*.ts` with exported interfaces; `unsData.ts` is promoted to `uns.ts` with a real `UnsPayload` type. Components render only.
**Rationale:** Precondition for the denylist test and for six-section consistency. Copy is currently inline at `Hero.tsx:203-215`, `About.tsx:37-60`, `Experience.tsx:7-58`, `Contact.tsx:46-71`, `Footer.tsx:12-20`; the `any` is at `unsData.ts:6`. Structure refinement: a small `sections.ts` registry (id, label, nav order) joins the five modules the design named so `App`, `Navbar`, and `useActiveSection` share one list.

### D7: Dead code and dependency purge, react-scroll replaced by native scroll
**Decision:** Delete the six dead source files plus `App.css`, `unsTree.ts`, starter SVGs, `tailwind.config.js`; drop nine packages; add `d3-shape` + `@types/d3-shape`; replace `react-scroll` with `scroll-behavior: smooth`, existing `scroll-mt-24`, and a `useActiveSection` hook over `IntersectionObserver`. `utils/cn.ts` stays for the new components.
**Rationale:** A discipline pitch cannot ship 440 lines of unreachable code. Inventory at research §9–10; `d3-shape` is imported live but undeclared (`Hero.tsx:4`, `package-lock.json:2756`); react-scroll usage at `Navbar.tsx:4,21-46,80-93`.

### D8: Contact degrades gracefully, resume is verified, phone is removed
**Decision:** Type `ImportMetaEnv`, add `.env.example`, render a mailto CTA when any EmailJS key is missing; re-enable the resume button (`About.tsx:71-78`) only with `public/resume.pdf` present; remove the phone number (`Contact.tsx:67`).
**Rationale:** Never ship a control that always fails (`Contact.tsx:22-31` throws pre-network today, research §11) and never publish a personal phone number.

### D9: Real but small quality gates
**Decision:** Vitest + Testing Library; content-invariant tests, a public-safety denylist test, and render smoke tests; `.github/workflows/ci.yml` running lint, `tsc -b`, test, build. Meta description, OG, Twitter tags, favicon `type` fix. Deploy automation and canonical URL wait on the hosting target.
**Rationale:** Cheap, and exactly the guardrail the case studies say he builds. No tests, CI, or metadata exist today (research §12); favicon type mismatch at `index.html:5`.

### D10: Tokens, a mono face, and root-level reduced motion
**Decision:** `@theme` block in `index.css` for accent, surface, status, gauge colors; JetBrains Mono mapped to `--font-mono`; `<MotionConfig reducedMotion="user">` at the root. Indigo, Inter, shadow scale, and section rhythm unchanged.
**Rationale:** Tokens are the Tailwind v4 idiom the inert `tailwind.config.js` pretends to use; hex literals at `Hero.tsx:79,168,181,338,357`, `Footer.tsx:7`; `Experience`, `ScrollToTopButton`, and `ImageCarousel` currently ignore reduced motion (research §5).

## Not Doing

- No router, CMS, backend, or live MQTT connection (D7; the simulated explorer covers the intent).
- No D3 layout or force graph for the Architecture section (D4).
- No markdown/MDX content pipeline (D6).
- No full visual restyle beyond tokens and a mono face (D10).
- No Playwright or visual-regression tests (D9).
- No blog, talks page, or analytics.
- No deploy automation or `vite.config.ts base` until the hosting target is named (Open Question 1).
- No dependency major-version upgrades (framer-motion 13, lucide 1.x, vite 8, TS 7); research §10 lists them, the design did not take them on.

## Phase Overview

Every phase's automated checkpoint includes the gate `npm run lint && npm run typecheck && npm test && npm run build`, abbreviated below as **the gate**. Each phase updates the `CLAUDE.md` rows its behavior invalidates; Phase 7 does the full consistency pass.

### ✅ Phase 1: Repo reads clean, nav goes native, tests and CI exist
**Completed:** Deleted `src/components/{MQTTExplorer,UNSExplorer,NamespaceExplorer,LogSimulator,Mapp}.tsx`, `src/hooks/useMqtt.ts`, `src/App.css`, `src/data/unsTree.ts`, `src/assets/react.svg`, `public/vite.svg`, `tailwind.config.js`. Modified `package.json` + `package-lock.json` (nine packages dropped; `d3-shape`, `@types/d3-shape`, `vitest`, `jsdom`, `@testing-library/{react,dom,jest-dom,user-event}` added; `test`/`test:watch`/`typecheck` scripts), `src/components/Navbar.tsx`, `src/index.css`, `src/App.tsx`, `src/components/Hero.tsx`, `tsconfig.app.json`, `vite.config.ts`, `CLAUDE.md`. Created `src/content/sections.ts`, `src/hooks/useActiveSection.ts`, `tests/setup.ts`, `tests/smoke/app.test.tsx`, `tests/hooks/useActiveSection.test.tsx`, `.github/workflows/ci.yml`. Adaptations: `@testing-library/dom` added explicitly (peer dep of `@testing-library/react` 16); `sections.ts` also exports `SECTION_IDS` and `NAV_SECTIONS` derived from `SECTIONS`; `index.css` resets `scroll-behavior` to `auto` under `prefers-reduced-motion`; `vite.config.ts` imports `defineConfig` from `vitest/config`.
**Goal:** The repo compiles only reachable code with only declared dependencies, section navigation runs on native scroll with an active-section indicator, every animated component honors reduced motion, and a test runner plus CI workflow exist so every later phase can carry tests.
**Files:**
- Delete: `src/components/MQTTExplorer.tsx`, `src/components/UNSExplorer.tsx`, `src/components/NamespaceExplorer.tsx`, `src/components/LogSimulator.tsx`, `src/components/Mapp.tsx`, `src/hooks/useMqtt.ts`, `src/App.css`, `src/data/unsTree.ts`, `src/assets/react.svg`, `public/vite.svg`, `tailwind.config.js`.
- Modify: `package.json` (drop `mqtt`, `react-json-view-lite`, `react18-json-view`, `d3`, `@types/d3`, `autoprefixer`, `postcss`, `react-scroll`, `@types/react-scroll`; add `d3-shape`, `@types/d3-shape`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`; scripts `test`, `test:watch`, `typecheck`), `package-lock.json`, `src/components/Navbar.tsx` (anchors + `useActiveSection`, links from `sections.ts`), `src/index.css` (`html { scroll-behavior: smooth }`), `src/App.tsx` (`MotionConfig` wrapper), `src/components/Hero.tsx` (add `scroll-mt-24` to `#hero`, `Hero.tsx:148`), `tsconfig.app.json` (include `tests`), `vite.config.ts` (vitest `test` block with jsdom + setup file), `CLAUDE.md` (tech stack rows, directory layout rows, gotchas 1–2, `VITE_MQTTBROKER` env claim).
- Create: `src/content/sections.ts`, `src/hooks/useActiveSection.ts`, `tests/setup.ts`, `tests/smoke/app.test.tsx`, `tests/hooks/useActiveSection.test.tsx`, `.github/workflows/ci.yml`.
**Interfaces:**
- `sections.ts`: `interface Section { id: SectionId; label: string; inNav: boolean }`; `type SectionId = 'hero' | 'about' | 'experience' | 'demos' | 'contact'` (widened in Phases 3–4); `export const SECTIONS: readonly Section[]` in page order; nav order derives from it.
- `useActiveSection(ids: readonly string[], options?: { rootMargin?: string }): string | null` — one `IntersectionObserver`, returns the id of the most-visible observed section; `rootMargin` compensates the 96 px sticky nav that `offset={-96}` handles today.
- Navbar links render `<a href="#id">` with the existing class recipe and `aria-current="true"` on the active link; the logo links to `#hero`.
- `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`, `"typecheck": "tsc -b"`; `build` unchanged.
- `tests/setup.ts`: registers jest-dom matchers and stubs `window.matchMedia` and `IntersectionObserver` (jsdom has neither).
- `ci.yml`: triggers `push` and `pull_request`; Node 22; `npm ci` then lint, typecheck, test, build as separate steps.
**Depends on:** nothing
**Checkpoint:**
- Automated: the gate; `git ls-files src/components/MQTTExplorer.tsx src/components/UNSExplorer.tsx src/components/NamespaceExplorer.tsx src/components/LogSimulator.tsx src/components/Mapp.tsx src/hooks/useMqtt.ts src/App.css src/data/unsTree.ts tailwind.config.js | wc -l` prints `0`; `grep -rnE "react-scroll|from 'd3'|from 'mqtt'|react-json-view|react18-json-view" src package.json` prints nothing; `npm ls d3-shape react-scroll` shows `d3-shape` at top level and no `react-scroll`; `npm run build 2>&1 | grep -c "chunks are larger"` prints `0`; the app smoke test finds `nav`, `main`, and one landmark per `SECTIONS` id; the hook test fires a stubbed intersection entry and asserts the returned id changes.
- Manual: `npm run dev`; click each nav link → smooth scroll lands each section below the sticky nav; scroll by hand → the active link follows; turn on OS reduced-motion → Experience items and the scroll-to-top button appear without slide/scale transforms.
**Test seams:**

| Behavior | Fake boundary | Location |
|---|---|---|
| Active nav link follows the visible section | `IntersectionObserver` stub exposing a `trigger(entries)` helper | `tests/setup.ts`, `tests/hooks/useActiveSection.test.tsx` |
| Whole app renders under jsdom | `matchMedia` stub (consumed by `useTheme`, `useReducedMotion`) | `tests/setup.ts`, `tests/smoke/app.test.tsx` |

### ✅ Phase 2: Hero claims the architect role on the shared namespace model
**Completed:** Created `src/content/uns.ts`, `src/content/profile.ts`, `tests/content/uns.test.ts`, `tests/public-safety.test.ts`, `tests/smoke/hero.test.tsx`. Deleted `src/data/unsData.ts` (and `src/data/`). Modified `src/components/Hero.tsx` (copy from `PROFILE`; `OEE_NODES`/`MQTT_TOPICS` from `uns.ts`; all hex → `@theme` utility classes), `src/components/Footer.tsx` (`dark:bg-surface-footer`), `src/index.css` (`@theme` block), `index.html` (JetBrains Mono in the Google Fonts request), `CLAUDE.md` (tech-stack, layout, component-map, data-flow, convention, and gotcha rows). Adaptations: `uns.ts` builds `fullPath` from a nested spec via `materialize()` rather than hand-typing every path, and additionally exports `UnsLeaf` + `hasPayload()` so Hero can narrow leaves to payload-bearing nodes under the optional `payload?` contract; added a `--color-status-idle` token beyond the three listed; `grep -rn "Richmond" src` still matches `Contact.tsx:71` ("Richmond, VA", the real location — a Phase 6 file, not the namespace), so the namespace-scoped check was `grep -rn "Richmond" src/components/Hero.tsx src/content` → nothing.
**Goal:** The Hero reads its copy from `profile.ts` and its three cards from `uns.ts` under the new ISA-95 namespace; design tokens and the mono face exist; the public-safety test is live and guards every content file from here on.
**Files:**
- Create: `src/content/profile.ts`, `src/content/uns.ts`, `tests/public-safety.test.ts`, `tests/content/uns.test.ts`, `tests/smoke/hero.test.tsx`.
- Delete: `src/data/unsData.ts` (and the now-empty `src/data/`).
- Modify: `src/components/Hero.tsx` (copy from `PROFILE`, topics and leaves from `uns.ts`, hex → token classes), `src/components/Footer.tsx` (hex at `Footer.tsx:7` → token), `src/index.css` (`@theme` block), `index.html` (JetBrains Mono in the Google Fonts request), `CLAUDE.md` (`data/` rows, Hero row, D3 row).
**Interfaces:**
- `uns.ts`: `interface UnsPayload { oee: number; availability: number; performance: number; quality: number }` (0–1 floats); `interface UnsNode { name: string; fullPath: string; payload?: UnsPayload; children?: readonly UnsNode[] }`; `export const UNS_ROOT: UnsNode` (root `Enterprise`, first child not a real place name); `export function getLeaves(node: UnsNode): UnsNode[]`; `export const MQTT_TOPICS: readonly string[]` derived from leaves, replacing the hand-typed list at `Hero.tsx:8-14`.
- `profile.ts`: `interface Profile { name: string; headline: string; pitch: string; cta: { primary: Link; secondary: Link }; links: { github: string; linkedin: string; email: string } }`, `interface Link { label: string; href: string }`; `export const PROFILE: Profile`. Primary CTA still targets `#demos` in this phase (repointed in Phase 3); secondary `#contact`.
- `@theme` tokens: `--color-accent-*`, `--color-surface-{card,footer}`, `--color-status-{running,stopped,error}`, `--color-gauge-{good,warn,bad,track,label}`, `--font-mono: 'JetBrains Mono', ui-monospace, …`.
- `tests/public-safety.test.ts`: `DENY_TOKEN_HASHES: ReadonlySet<string>` (SHA-256 of lowercased single tokens and adjacent-token bigrams; the plaintext list is kept off-repo and a comment states the regeneration one-liner), `DENY_PATTERNS: readonly RegExp[]` (internal hostname suffixes, IPv4 literals, site-code shape, database-name shape); scans `src/**/*.{ts,tsx}` and `index.html` via `fs`; one test asserts a known-bad fixture string is caught.
**Depends on:** Phase 1
**Checkpoint:**
- Automated: the gate; `grep -rnE "#[0-9a-fA-F]{6}" src/components` prints nothing; `grep -rn "Richmond" src` prints nothing; `test -d src/data` fails; `uns.test.ts` asserts every node's `fullPath` equals its parent's path plus `/name`, every leaf has a payload with four values in `[0, 1]`, and `MQTT_TOPICS.length === getLeaves(UNS_ROOT).length`; `public-safety.test.ts` passes including its self-check; `hero.test.tsx` asserts the h2 text equals `PROFILE.headline`.
- Manual: Hero at 375 px and 1280 px, light and dark; the topic in the MQTT card and the breadcrumb in the UNS card share the `uns.ts` root; the gauge colors come from tokens (inspect computed style); reduced-motion on → background SVG absent and cards static; mono elements render in JetBrains Mono.
**Test seams:**

| Behavior | Fake boundary | Location |
|---|---|---|
| No denylisted token reaches the repo | none; reads real files through `fs` and hashes tokens | `tests/public-safety.test.ts` |
| Hero cards tick without real time passing | `vi.useFakeTimers()` around the three intervals (`Hero.tsx:113-143`) | `tests/smoke/hero.test.tsx` |

### ✅ Phase 3: Architecture section becomes the centerpiece and the page reorders around it
**Completed:** Created `src/content/architecture.ts`, `src/components/Architecture.tsx`, `src/components/architecture/{ArchitectureDiagram,TierCard,TierDetail,UnsExplorer}.tsx`, `tests/content/architecture.test.ts`, `tests/components/architecture.test.tsx`. Modified `src/App.tsx` (Hero → Architecture → Demos → Experience → About → Contact), `src/content/sections.ts` (`architecture` added; D3 order with `demos` in the Work slot, label still "Projects" until Phase 4), `src/content/profile.ts` (primary CTA → `#architecture`), `CLAUDE.md` (intro, layout, component map, new data-flow entry). `Navbar.tsx` needed no change. Adaptations: alternating tint now follows the new positions, which meant one-line `className` swaps in `Demos.tsx`, `About.tsx` (tint removed) and `Experience.tsx`, `Contact.tsx` (tint added); `architecture.ts` additionally exports `ARCHITECTURE_COPY` (section title/subtitle, agentic-layer name/summary) so no prose sits in JSX; `TierDetail.tsx` also exports a named `AgenticDetail` for the `'agentic'` selection, both sharing `layoutId="architecture-detail"`; `ArchitectureDiagram.tsx` exports `type SelectionId = TierId | 'agentic'`; the detail panel uses mount-only content animation (no `AnimatePresence` exit) so only one tier's text is ever in the DOM; the component test asserts `toBeInTheDocument` rather than `toBeVisible` because framer leaves `opacity: 0` on the initial frame under jsdom.
**Goal:** A reader can click any of seven tiers or the agentic layer and read what it does, why it is separate, and what decision it encodes; the broker tier opens a topic explorer on the same namespace the Hero streams; the page and nav take their final D3 order with `Demos` still in the Work slot.
**Files:**
- Create: `src/content/architecture.ts`, `src/components/Architecture.tsx`, `src/components/architecture/ArchitectureDiagram.tsx`, `src/components/architecture/TierCard.tsx`, `src/components/architecture/TierDetail.tsx`, `src/components/architecture/UnsExplorer.tsx`, `tests/content/architecture.test.ts`, `tests/components/architecture.test.tsx`.
- Modify: `src/App.tsx` (order Hero → Architecture → Demos → Experience → About → Contact; alternating tint follows the new positions), `src/content/sections.ts` (add `architecture`, reorder, nav labels), `src/components/Navbar.tsx` (only if rendering from `SECTIONS` needs adjusting), `src/content/profile.ts` (primary CTA → `#architecture`), `CLAUDE.md` (component map, section order).
**Interfaces:**
- `architecture.ts`: `type TierId = 'edge' | 'broker' | 'mes' | 'analytics' | 'historian' | 'warehouse' | 'api'`; `interface Tier { id: TierId; index: 1 | 2 | 3 | 4 | 5 | 6 | 7; name: string; purpose: string; whySeparate: string; decision: string; technologies: readonly string[]; schemaRule?: string }`; `interface AgenticComponent { id: 'mcp' | 'semantic' | 'dag'; name: string; purpose: string; readsFrom: readonly TierId[] }`; `export const TIERS: readonly Tier[]`; `export const AGENTIC_LAYER: readonly AgenticComponent[]`.
- `ArchitectureDiagram({ tiers, agentic, selectedId, onSelect })` — grid of `TierCard` buttons (`aria-pressed`), inline SVG connectors, agentic layer drawn beside tiers 4–7.
- `TierDetail({ tier })` — `layoutId` panel with purpose / why separate / decision / technologies; when `tier.id === 'broker'` renders `<UnsExplorer root={UNS_ROOT} schemaRule={tier.schemaRule} />`.
- `UnsExplorer({ root, schemaRule?, initiallyExpandedDepth? })` — expandable tree, leaf shows its `UnsPayload` and the schema rule text.
- `Architecture` owns `selectedId: TierId | 'agentic'` state, default `'broker'`.
**Depends on:** Phase 2
**Checkpoint:**
- Automated: the gate; `architecture.test.ts` asserts exactly 7 tiers with indexes 1..7 unique and ascending, non-empty `name`/`purpose`/`whySeparate`/`decision` on each, `schemaRule` present on `broker`, and every `readsFrom` id exists in `TIERS`; `architecture.test.tsx` clicks each tier button and asserts that tier's `decision` text is visible and no other tier's is, and clicking `broker` shows a `fullPath` from `getLeaves(UNS_ROOT)`; app smoke test asserts DOM order of section ids matches `SECTIONS`.
- Manual: 375 px stacks tiers vertically with connectors still legible; 1280 px grid reads left to right; light and dark; `layoutId` transition plays; reduced-motion on → panel swaps without transform; keyboard: Tab reaches every tier, Enter selects.
**Test seams:**

| Behavior | Fake boundary | Location |
|---|---|---|
| Selecting a tier reveals its detail | none; real click through Testing Library | `tests/components/architecture.test.tsx` |
| Content invariants hold for tiers and agentic layer | none; imports the module | `tests/content/architecture.test.ts` |

### ✅ Phase 4: Work replaces Demos with six case studies
**Completed:** Created `src/content/caseStudies.ts`, `src/components/Work.tsx`, `src/components/work/{CaseStudyGrid,CaseStudyCard,CaseStudyPanel}.tsx`, `src/components/work/diagrams/{TierStackDiagram,AgentDagDiagram,SemanticLayerDiagram,OeeForensicsDiagram}.tsx`, `tests/content/caseStudies.test.ts`, `tests/components/work.test.tsx`, `tests/components/imageCarousel.test.tsx`. Deleted `src/components/{Demos,UNSSimulatorDemo,ScriptProfilerDemo}.tsx`. Modified `src/components/common/ImageCarousel.tsx` (`label` prop; lightbox `role="dialog" aria-modal aria-label`; focus to Close on open, Tab/Shift+Tab trap, Escape, focus return; `images` readonly), `src/content/sections.ts` (`demos` → `work`, label "Work"), `src/App.tsx` (Work in the Demos slot, untinted), `CLAUDE.md` (intro, layout, component map, new Work data-flow entry). `src/content/profile.ts` needed no change (no CTA pointed at `#demos` after Phase 3). Adaptations: the inline thumbnail is now wrapped in a `<button>` so the lightbox has a focusable opener to return focus to, and prev/next/close buttons gained `aria-label`s; `CaseStudyCard` sets `aria-controls` only while expanded (no dangling id) and uses only phrasing elements inside the `<button>`; clicking the expanded card collapses it (`selectedId` defaults to `null`); `CaseStudyGrid` renders the panel directly after its card with `col-span-full` under `grid-flow-row-dense`, so it opens beneath the clicked row at any column count; `TierStackDiagram` reads `TIERS` from `architecture.ts` rather than duplicating tier names; `caseStudies.ts` additionally exports `WORK_COPY`, `CaseStudyImage`, and `Metric`; Prettier was run on the new and modified files, which reflowed the `SectionId` union onto one line.
**Goal:** The Work section renders six case studies from `caseStudies.ts` as a card grid with an inline expanding panel; screenshot studies embed `ImageCarousel`, text studies embed a small diagram; the lightbox is a real dialog; `Demos` and the `demos` id are gone.
**Files:**
- Create: `src/content/caseStudies.ts`, `src/components/Work.tsx`, `src/components/work/CaseStudyGrid.tsx`, `src/components/work/CaseStudyCard.tsx`, `src/components/work/CaseStudyPanel.tsx`, `src/components/work/diagrams/TierStackDiagram.tsx`, `src/components/work/diagrams/AgentDagDiagram.tsx`, `src/components/work/diagrams/SemanticLayerDiagram.tsx`, `src/components/work/diagrams/OeeForensicsDiagram.tsx`, `tests/content/caseStudies.test.ts`, `tests/components/work.test.tsx`, `tests/components/imageCarousel.test.tsx`.
- Delete: `src/components/Demos.tsx`, `src/components/UNSSimulatorDemo.tsx`, `src/components/ScriptProfilerDemo.tsx`.
- Modify: `src/components/common/ImageCarousel.tsx` (dialog ARIA, focus trap, focus return, `label` prop), `src/content/sections.ts` (`demos` → `work`, label "Work"), `src/App.tsx`, `src/content/profile.ts` (any CTA still pointing at `#demos` → `#work`), `CLAUDE.md` (component map, gotcha 2).
**Interfaces:**
- `caseStudies.ts`: `type DiagramKind = 'tier-stack' | 'agent-dag' | 'semantic-layer' | 'oee-forensics'`; `type Media = { kind: 'carousel'; images: readonly { src: string; alt: string }[] } | { kind: 'diagram'; diagram: DiagramKind }`; `interface CaseStudy { id: string; title: string; summary: string; problem: string; constraint: string; decision: string; result: string; metrics: readonly { value: string; label: string }[]; tags: readonly string[]; media: Media; links?: readonly Link[] }`; `export const CASE_STUDIES: readonly CaseStudy[]` (6, D5 order).
- `Work` owns `selectedId: string | null`; `CaseStudyCard` is a `<button aria-expanded aria-controls>`; `CaseStudyPanel` renders the four narrative fields, metrics, and `media` via a `switch` on `media.kind` / `diagram`.
- `ImageCarousel({ images, label })` — lightbox root gets `role="dialog" aria-modal="true" aria-label={label}`; focus moves to the close button on open, Tab/Shift+Tab cycle within, Escape closes, focus returns to the clicked thumbnail.
**Depends on:** Phase 3
**Checkpoint:**
- Automated: the gate; `caseStudies.test.ts` asserts length 6, ids unique, all four narrative fields non-empty, `metrics.length ≥ 1`, and the two `carousel` studies reference 5 and 2 images respectively; `work.test.tsx` selects a card and asserts its `decision` is visible with `aria-expanded="true"`, then selects another and asserts the first collapsed; `imageCarousel.test.tsx` opens the lightbox and asserts `role="dialog"`, `aria-modal`, focus on the close button, Escape closes, focus returns; `grep -rn "demos" src` prints nothing; `git ls-files src/components/Demos.tsx src/components/UNSSimulatorDemo.tsx src/components/ScriptProfilerDemo.tsx | wc -l` prints `0`.
- Manual: grid at 375 px (one column) and 1280 px; both carousels still show all their screenshots and open the lightbox; the four diagrams are legible in light and dark; reduced-motion on → panel expands without transform.
**Test seams:**

| Behavior | Fake boundary | Location |
|---|---|---|
| Lightbox traps and returns focus | `createPortal` renders into jsdom `document.body`; assert with `document.activeElement` | `tests/components/imageCarousel.test.tsx` |
| Only one study is expanded at a time | none; real clicks | `tests/components/work.test.tsx` |

### ✅ Phase 5: Experience tells the three-seat arc, About carries principles and a verified resume link
**Completed:** Created `src/content/experience.ts`, `tests/content/experience.test.ts`, `tests/content/profile.test.ts`, `tests/smoke/about-experience.test.tsx`. Modified `src/components/Experience.tsx` (renders `JOBS` and `SEATS`; local `jobs` array dropped; seat legend above the timeline and a seat badge per job; no local reduced-motion handling, the root `MotionConfig` covers it), `src/components/About.tsx` (bio paragraphs, skills, and principles from `PROFILE`; conditional resume button with the `Download` icon replacing the commented block), `src/content/profile.ts` (`bio`, `skills`, `principles`, `resume?` plus `Principle`, `Resume`, `AboutCopy` interfaces), `CLAUDE.md` (layout rows, component map, gotcha 5). Adaptations: `experience.ts` additionally exports `EXPERIENCE_COPY` (title, arc-intro subtitle, timeline label) and `profile.ts` exports `ABOUT_COPY` (section title, principles heading) so no prose sits in JSX, matching Phases 3–4; `Job` splits `title` and `org` (`JOBS[0].title === 'MES Engineer'`, `org === 'Fortune Brands Innovations'`) and the component renders them as `title — org`; `mode` is omitted on the on-site role; `PROFILE.resume` is left undefined because `public/resume.pdf` is absent (D8), so the About button is absent and the smoke test asserts that state; job copy reuses the previously public `Experience.tsx` wording verbatim; Ben confirmed the D1 title on 2026-09-05: `JOBS[0].title` is now `'Software Engineer'` (id `fbin-software-engineer`); `PROFILE.resume` stays undefined by his call.
**Goal:** Experience renders from `experience.ts` with each role tagged to the integrator / vendor / manufacturer seat and a short arc intro; About renders bio, skills, four operating principles, and a resume button that can only appear when the PDF exists.
**Files:**
- Create: `src/content/experience.ts`, `tests/content/experience.test.ts`, `tests/content/profile.test.ts`, `tests/smoke/about-experience.test.tsx`.
- Modify: `src/components/Experience.tsx` (render from `JOBS` and `SEATS`; drop its local `jobs` array at `Experience.tsx:7-58`; rely on root `MotionConfig` for reduced motion), `src/components/About.tsx` (bio/skills/principles from `PROFILE`; conditional resume button replacing the comment at `About.tsx:71-78`), `src/content/profile.ts` (add `bio`, `skills`, `principles`, `resume?`), `CLAUDE.md` (gotcha 4, About row).
**Interfaces:**
- `experience.ts`: `type Seat = 'integrator' | 'vendor' | 'manufacturer'`; `interface Job { id: string; title: string; org: string; dates: string; mode?: string; summary: string; seat: Seat; tags: readonly string[] }`; `export const JOBS: readonly Job[]` (4, newest first; `JOBS[0].title` stays "MES Engineer" until Ben confirms otherwise); `export const SEATS: Record<Seat, { label: string; lesson: string }>`.
- `profile.ts` additions: `bio: readonly string[]`, `skills: readonly string[]`, `principles: readonly { title: string; evidence: string }[]` (the four from the design), `resume?: { href: '/resume.pdf'; label: string }`.
- About renders the download button only when `PROFILE.resume` is defined.
**Depends on:** Phase 2 (`profile.ts`); sequenced after Phases 3–4 for section order only
**Checkpoint:**
- Automated: the gate; `experience.test.ts` asserts 4 jobs, every `seat` is a key of `SEATS`, and all three seats appear at least once; `profile.test.ts` asserts `principles.length === 4` and, if `resume` is defined, `fs.existsSync('public/resume.pdf')`; smoke test asserts the About resume link is present exactly when `PROFILE.resume` is defined.
- Manual: Ben confirms the `JOBS[0].title` string (D1 condition); Ben drops `public/resume.pdf` and sets `PROFILE.resume`, or leaves `resume` undefined; timeline and principles at 375 px and 1280 px, light and dark.
**Test seams:**

| Behavior | Fake boundary | Location |
|---|---|---|
| Resume link never 404s | real `fs.existsSync` against `public/` | `tests/content/profile.test.ts` |

### ✅ Phase 6: Contact never ships a control that always fails
**Completed:** Created `.env.example`, `src/utils/emailConfig.ts`, `tests/components/contact.test.tsx`. Modified `src/vite-env.d.ts` (`ImportMetaEnv` augmentation), `src/components/Contact.tsx` (local `ContactForm` / `MailtoCta` components branched on `config`; phone line removed; `aria-label` on the three socials; every href from `PROFILE.links`; copy from `CONTACT_COPY`; labels gained `htmlFor`/`id`), `src/components/Footer.tsx` (hrefs from `PROFILE.links`), `src/content/profile.ts` (`links.location?`, `ContactCopy` + `CONTACT_COPY` with section copy and the mailto CTA wording), `CLAUDE.md` (Environment Setup, gotcha 3, Contact/Footer/profile/utils/tests/.env.example rows), `README.md` (setup step 3 + new Environment section replacing the stale `VITE_MQTTBROKER` note). Adaptations: `Contact` takes an optional `config?: EmailConfig | null` prop defaulting to `getEmailConfig()` (the outline's test seam), and `ContactForm` / `MailtoCta` stay non-exported so `Contact.tsx` keeps a single default export; the phone line was at `Contact.tsx:70` and the location at `:74` rather than `:67`/`:71`; the email in the info block became a `mailto:` link; `getEmailConfig` trims values so whitespace-only keys count as missing; Open Question 4 resolved by keeping the location via `PROFILE.links.location` and scoping the Desired End State `Richmond` check to the namespace files.
**Goal:** With all three EmailJS keys present at build time the form renders and sends; with any missing, a mailto CTA renders instead; the phone number is gone; Contact and Footer read one canonical set of links with accessible names; the env contract is typed and documented.
**Files:**
- Create: `.env.example`, `src/utils/emailConfig.ts`, `tests/components/contact.test.tsx`.
- Modify: `src/vite-env.d.ts` (`ImportMetaEnv` augmentation), `src/components/Contact.tsx` (branch on config; remove phone at `Contact.tsx:67`; `aria-label` on the three socials at `Contact.tsx:80-101`; links from `PROFILE.links`), `src/components/Footer.tsx` (links from `PROFILE.links`), `src/content/profile.ts` (`links.location?`, copy for the mailto CTA), `CLAUDE.md` (Environment Setup section, gotcha 3), `README.md` (env section).
**Interfaces:**
- `vite-env.d.ts`: `interface ImportMetaEnv { readonly VITE_EMAILJS_SERVICE_ID?: string; readonly VITE_EMAILJS_TEMPLATE_ID?: string; readonly VITE_EMAILJS_PUBLIC_KEY?: string }`.
- `emailConfig.ts`: `interface EmailConfig { serviceId: string; templateId: string; publicKey: string }`; `export function getEmailConfig(env: ImportMetaEnv = import.meta.env): EmailConfig | null` — `null` unless all three are non-empty.
- `Contact` renders `<ContactForm config={…} />` when config is non-null, else `<MailtoCta email={PROFILE.links.email} />`; the form's `send` call takes its ids from `config`, never from `import.meta.env` directly.
- `.env.example` lists the three keys with empty values and a one-line comment each; `.gitignore` keeps matching `.env` only (verified: line 26 is the literal `.env`).
**Depends on:** Phase 2 (`profile.ts`)
**Checkpoint:**
- Automated: the gate; `contact.test.tsx` renders Contact with `getEmailConfig` returning `null` and asserts a `mailto:` link and no `<form>`, then with a full config and asserts the `<form>` and no mailto CTA; `grep -rn "201\.496" src` prints nothing; `grep -c "aria-label" src/components/Contact.tsx` is at least 3; `grep -rc "linkedin.com" src/components` prints `0` for every file (the URL lives only in `profile.ts`); `test -f .env.example`.
- Manual: `npm run dev` with no `.env` → mailto CTA; copy `.env.example` to `.env` with placeholder values → form renders and a submit shows the error state (EmailJS rejects placeholders) rather than throwing; light and dark at 375 px and 1280 px.
**Test seams:**

| Behavior | Fake boundary | Location |
|---|---|---|
| Form vs mailto branch | inject `EmailConfig | null` through a `config` prop or `vi.mock` of `emailConfig` | `tests/components/contact.test.tsx` |
| Send never hits the network | `vi.mock('@emailjs/browser')` | `tests/components/contact.test.tsx` |

### ✅ Phase 7: Ship-ready shell with metadata and docs that match the code
**Completed:** Created `tests/shell.test.ts` (reads `index.html` with `fs`, parses it with jsdom's `DOMParser`, asserts favicon `type="image/png"`, `lang="en"`, viewport, both Google Fonts, and that `description` / `og:description` / `twitter:description` equal `PROFILE.pitch` and `og:title` / `twitter:title` equal `PROFILE.name — PROFILE.headline`). Modified `index.html` (favicon `type` fixed from `image/svg+xml`; `meta description`, `og:type` website, `og:title`, `og:description`, `twitter:card` summary, `twitter:title`, `twitter:description`; a comment names the `PROFILE` fields they mirror), `CLAUDE.md` (HTML-shell tech-stack row; layout rows for `shell.test.ts`, `index.html`, `public/computer-chip.png`, `docs/architecture.md`, `thoughts/`; stale `w-20` divider convention replaced by the `SectionHeader` rule; gotchas 6 (metadata mirrors `PROFILE`, hosting-dependent tags absent) and 7 (`thoughts/` untracked); Further Reading), `README.md` (full rewrite: section list replaces the dead-demo list, stack without mqtt.js / D3 v7, Node 22.12 floor from Vitest 5's engines, clone URL `portfolio-new.git`, commands incl. `test` / `test:watch` / `typecheck`, current project structure, resume-publishing note), `docs/architecture.md` (full rewrite: component tree, content-layer module table, data flows, tokens, test inventory, styling, assets, deferred-on-hosting list; dead-code inventory and MQTT/react-scroll/Demos sections removed). `vite.config.ts` untouched. Adaptations: `og:image` omitted — the only file under `public/` is the 512×512 favicon, which is not a social-card image, and without a hosting target there is no absolute URL for scrapers to resolve; `og:url` / canonical / `base` omitted per Open Question 1; `twitter:title` and `twitter:description` added alongside `twitter:card` so the card has text without relying on OG fallback; the `og:title` form `PROFILE.name — PROFILE.headline` is the test's contract. Checkpoint run 2026-09-05: gate green (15 files / 86 tests), chunk-warning count 0, doc grep empty, `vite preview` → `GET /` 200 with the OG tags present in the served HTML.
**Goal:** The HTML shell carries social and search metadata, the favicon type is correct, deploy wiring is added if the hosting target is known, and `CLAUDE.md`, `README.md`, and `docs/architecture.md` describe the finished code.
**Files:**
- Create: `tests/shell.test.ts`.
- Modify: `index.html` (meta description, `og:title`, `og:description`, `og:type`, `og:image` if an image is supplied, `twitter:card`, favicon `type="image/png"`), `vite.config.ts` (`base` only if the answer to Open Question 1 is GitHub Pages), `CLAUDE.md` (full rewrite of tech stack, layout, component map, data flows, gotchas, further reading), `README.md` (live-demo list, clone URL `portfolio-new.git`, env, scripts including `test` and `typecheck`), `docs/architecture.md` (component tree, content layer, dead-code inventory removed, data flows).
**Interfaces:**
- `index.html` `<head>` gains `<meta name="description">`, Open Graph, and Twitter card tags whose text matches `PROFILE.headline` / `PROFILE.pitch`; `shell.test.ts` reads `index.html` with `fs` and asserts each tag exists and the favicon `type` is `image/png`.
- `CLAUDE.md` Dev Commands lists `npm test` and `npm run typecheck`; Known Gotchas is rewritten to the surviving facts (EmailJS env contract, resume via `PROFILE.resume`, `thoughts/` untracked).
**Depends on:** Phases 1–6
**Checkpoint:**
- Automated: the gate; `shell.test.ts` passes; `npm run build 2>&1 | grep -c "chunks are larger"` prints `0`; `grep -nE "react-scroll|MQTTExplorer|unsTree|VITE_MQTTBROKER" CLAUDE.md README.md docs/architecture.md` prints nothing; `npm run preview` serves `/` with status 200.
- Manual: the design's verification pass — light and dark at 375 px and 1280 px with `prefers-reduced-motion` on and off, every section; inspect the built `<head>` tags by hand or in a social-card debugger; run `/bd-drift-check` for a full doc audit beyond the rows these phases touched.

## Open Questions

1. **Hosting target (D9 condition, owed by Ben).** Decides whether `vite.config.ts` gets `base` and whether `og:url` / a canonical tag ship in Phase 7. If unanswered when Phase 7 runs, ship without both; adding them later is a two-line change.
   **Phase 7 (2026-09-05):** still unanswered; shipped without `base`, `og:url`, a canonical tag, or `og:image`. `docs/architecture.md` lists the four items under "Deferred Until the Hosting Target Is Named".
2. **Task artifacts contain names the site must never publish.** `3-design.md` D2 spells out the three business-unit brands in its "Alternatives" line, and `thoughts/tasks/2026-09-04-ben-duran-briefing.md` names the manager, director, site codes, and brands. `/bd-pull-request` bakes task artifacts into the PR before its cleanup commit, which on a public repo puts those names into git history permanently, and `thoughts/` is currently untracked but not ignored. Recommendation: before the PR phase, redact the brand names from D2's alternatives text, add `thoughts/` to `.gitignore`, and keep the briefing out of the repo entirely. Needs Ben's call.
3. **Public repo links for studies 5–6.** The design accepted screenshot-only; `CaseStudy.links` is the slot if Ben supplies URLs.

4. **Location line vs. the `Richmond` check (deferred to Phase 6 on 2026-09-04).** Phase 2 left `Contact.tsx:71` ("Richmond, VA") in place; the check `grep -rn "Richmond" src` passes for Hero and `src/content` but not for Contact. Phase 6 owns Contact and must decide: drop the location line, or keep it via `PROFILE.links.location` and amend the Desired End State bullet so the `Richmond` check is scoped to the namespace.
   **Resolved 2026-09-05 (Phase 6):** kept. The location is now `PROFILE.links.location` (`src/content/profile.ts`), rendered by Contact only when set; the Desired End State bullet scopes the `Richmond` check to `src/components/Hero.tsx src/content/uns.ts`. A region is not a plant or site, so D2 is unaffected.

## Rollback

All work lands on one task branch with one commit per verified phase; revert by closing the PR or `git revert` of the phase commits newest-first. Nothing outside the repo changes (no infra, no data, no hosting), and every deleted file is recoverable from `b9b1098`.

## File-Disjoint Check

Phases are **not** parallelizable; run them sequentially in one worktree. Shared files: `src/App.tsx` (1, 3, 4), `src/components/Navbar.tsx` (1, 3), `src/content/sections.ts` (1, 3, 4), `src/content/profile.ts` (2, 3, 4, 5, 6), `index.html` (2, 7), `src/index.css` (1, 2), `package.json` (1), `CLAUDE.md` (all), `README.md` (6, 7). Phases 5 and 6 touch disjoint components and could swap order, but both extend `profile.ts`; keep them sequential.
