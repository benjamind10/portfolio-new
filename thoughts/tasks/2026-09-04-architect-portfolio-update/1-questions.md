---
date: 2026-09-04
---

# Questions: Architect-Grade Portfolio SPA Update

## Context
A broad refresh of the existing React 19 + Vite + Tailwind v4 portfolio SPA so the site itself reads as evidence of strong systems/architecture skill (Unified Namespace, MQTT/Sparkplug, Ignition, MES, agentic-AI-assisted engineering). The site is a single scrollable page with five sections (Hero, About, Experience, Projects/Demos, Contact) plus Navbar, Footer, and a scroll-to-top button. Nothing is pre-excluded from scope; the design phase decides what "everything in" means. Two prior redesign rounds (2026-03-29 and 2026-04-05) are documented under `docs/`.

## Key Context Pointers

- Repositories: `C:\dev\portfolio-new` (this repo, branch `main`, GitHub user `benjamind10`)
- Libraries / dependencies (from `package.json`): `react@19`, `vite@6`, `tailwindcss@4` (+ `@tailwindcss/vite`), `framer-motion@12`, `lucide-react`, `d3@7`, `mqtt@5`, `react-json-view-lite`, `react18-json-view`, `react-scroll`, `@emailjs/browser`
- Filepaths — the owner's professional profile as currently published (the only on-disk source of "who the owner is"):
  - `src/components/About.tsx` (bio paragraph + skills list)
  - `src/components/Experience.tsx` (`jobs` array: 4 roles, 2022–present)
  - `src/components/Hero.tsx` (headline, tagline, 3 animated dashboard cards)
- Filepaths — prior work: `docs/architecture.md`, `docs/tickets/`, `docs/research/`, `docs/plans/`, `docs/reviews/` (34 files across two rounds)
- Project instructions: `CLAUDE.md` (root) — known to be partially stale (see Q7)

## Research Questions

### Q1: What story does the site currently tell, section by section?
**Unknown:** The exact copy, structure, and claims in each rendered section — what the Hero says, what About/Experience/Demos/Contact/Footer communicate, and where that content lives (hardcoded JSX vs data arrays vs `src/data/*`). Which sections reference architecture-level work (UNS design, multi-facility deployment, module authoring) and how prominently.
**Why it matters:** Any content refresh must know the current narrative, tone, and where copy is authored so it can be extended without scattering strings across components.
**Research needed:** Read `src/App.tsx` for section order, then each of `Hero.tsx`, `About.tsx`, `Experience.tsx`, `Demos.tsx`, `UNSSimulatorDemo.tsx`, `ScriptProfilerDemo.tsx`, `Contact.tsx`, `Footer.tsx`, `Navbar.tsx` under `src/components/`. Catalogue all user-visible strings and links (GitHub, LinkedIn, mailto, `#demos`, `#contact`). Note which content is data-driven (e.g., the `jobs` array in `Experience.tsx`, `unsData` in `src/data/unsData.ts`) versus inline JSX.

### Q2: What is the site's design language today (tokens, typography, motion, theming)?
**Unknown:** The concrete visual system: color palette with hex values (indigo accents, gray scales, status colors green/yellow/red used in the Hero cards, `#6366f1` / `#f59e0b` / `#ef4444` in the OEE gauge), typography (which font is loaded and how — `src/index.css` declares `Inter` but the load mechanism is unverified), spacing rhythm, border/shadow conventions, alternating section backgrounds, and the shared primitives (`SectionHeader`, `FadeInWrapper`, `ImageCarousel`, `ScrollToTopButton`). How dark mode is wired (`@custom-variant dark` in `src/index.css`, `useTheme`, `localStorage`) and whether `tailwind.config.js` still has any effect under Tailwind v4.
**Why it matters:** New sections and components must match or deliberately extend the existing language; the design phase needs the palette and motion conventions written down.
**Research needed:** Read `src/index.css`, `tailwind.config.js`, `index.html` (font links), `src/hooks/useTheme.ts`, everything in `src/components/common/`, and `src/components/ScrollToTopButton.tsx`. Extract all Tailwind color classes in use across `src/components/**` and group them into palette roles. Document Framer Motion patterns (`whileInView` via `FadeInWrapper`, mount-time `initial/animate` in Hero, `useReducedMotion` usage, `AnimatePresence`). Cross-reference `docs/plans/visual-polish.md` and `docs/reviews/visual-polish-review.md` for the intended system and confirm it matches code.

### Q3: How do the Hero dashboard cards and the UNS data models work end to end?
**Unknown:** The mechanics of the three animated cards (MQTT stream simulation, OEE gauge built with `d3-shape` `arc()`, UNS path card): timers, state, data sources, reduced-motion handling, and the layout-stability measures from the "hero layout bounce" fix. The shapes of `src/data/unsData.ts` (`UnsNode` with `fullPath` + OEE payload) and `src/data/unsTree.ts` (`{name, children}`) and everything that consumes each.
**Why it matters:** These cards are the site's existing live "architecture showcase"; any expansion of interactive UNS/MQTT visualization builds on or replaces them, and the two parallel UNS data models are a candidate for consolidation.
**Research needed:** Trace `src/components/Hero.tsx` fully: `generateMqttMessage`, `getLeaves(unsData)`, `buildArcPath`, `oeeColor`, all `useEffect` intervals and their cleanup. Find all importers of `unsData` and `unsTree`. Compare against `docs/plans/enhanced-hero.md`, `docs/plans/hero-layout-bounce-fix.md`, and `docs/reviews/enhanced-hero-review.md` to see what shipped.

### Q4: What do the unused components, hook, and dependencies actually contain, and what state are they in?
**Unknown:** The functionality and quality of dead code: `src/components/MQTTExplorer.tsx` (simulated + live MQTT over `VITE_MQTTBROKER`), `UNSExplorer.tsx`, `NamespaceExplorer.tsx` (D3 SVG tree), `LogSimulator.tsx`, `Mapp.tsx` (unknown purpose, not in CLAUDE.md), and `src/hooks/useMqtt.ts` (module-scope connect). Which npm dependencies are imported by live code versus only by dead code or not at all (`d3` full vs `d3-shape`, `mqtt`, `react-json-view-lite`, `react18-json-view`, `react-scroll`, `autoprefixer` / `postcss` under Tailwind v4).
**Why it matters:** These are either revivable assets for a richer interactive demo tier or dead weight in the bundle; the design phase needs to know which is which before deciding to revive, rewrite, or delete.
**Research needed:** Read each dead component and `useMqtt.ts`; note props, data sources, styling era (do they use the current design tokens?), and whether they type-check. For each dependency in `package.json`, grep `src/` for imports and record live / dead-only / unused. Note the orphan ticket `docs/tickets/2026-03-29_feature_demo-section-overhaul.md` that replaced interactive demos with images.

### Q5: How does the Projects/Demos tier work — tabs, carousel, lightbox, descriptions, assets?
**Unknown:** How `Demos.tsx` tabs, `ImageCarousel.tsx` (prev/next, indicators, lightbox modal from the 2026-04-05 work), `UNSSimulatorDemo.tsx`, and `ScriptProfilerDemo.tsx` compose; what descriptive copy accompanies each demo; the full asset set (`src/assets/uns-sim-1..5.png`, `script-profiler-1..2.png`, `public/computer-chip.png`, unused `src/assets/react.svg`); and the accessibility gaps the lightbox review flagged (focus trap, ARIA).
**Why it matters:** Adding case studies or more projects means extending this tier; its component contract determines whether new project types (write-ups, diagrams, live widgets) fit or need a new container.
**Research needed:** Read `src/components/Demos.tsx`, `src/components/common/ImageCarousel.tsx`, `UNSSimulatorDemo.tsx`, `ScriptProfilerDemo.tsx`. List props and the data each demo passes. Check `docs/reviews/demo-image-lightbox-modal-review.md` for open follow-ups.

### Q6: What is the build, quality, and delivery baseline?
**Unknown:** Whether `npm run build` (`tsc -b && vite build`) and `npm run lint` pass cleanly today; production bundle size and largest chunks (suspects: `d3`, `mqtt`, two JSON viewers); Vite config specifics; the absence of tests (no vitest/jest/playwright found), CI (no `.github/workflows`), and deploy config (no vercel/netlify/CNAME/gh-pages); the current Contact form behavior (`Contact.tsx` calls `emailjs.send` using `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY`, but no `.env` exists in the repo); how the site is currently hosted, if discoverable from git remotes or docs.
**Why it matters:** A portfolio meant to demonstrate engineering rigor is judged on its own build hygiene; bundle weight and a silently failing contact form undermine the message. Baseline numbers set the bar for any additions.
**Research needed:** Run `npm run build` and `npm run lint` and capture output (including Vite's chunk-size table). Read `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `.prettierrc`, `.gitignore`. Read `src/components/Contact.tsx` end to end and trace the env-var path and failure mode when the vars are undefined. Check `git remote -v` and any deploy hints in `docs/`.

### Q7: Where do CLAUDE.md, docs/architecture.md, and prior plans diverge from the code?
**Unknown:** Confirmed drift so far: CLAUDE.md says the contact form has no handler (it uses EmailJS); says `.env` is committed (it is not); omits `SectionHeader`, `ScrollToTopButton`, `Mapp.tsx`, the lightbox, and `@emailjs/browser`; the resume download is commented out in `About.tsx` and `public/resume.pdf` is missing. Unverified: whether `docs/plans/agentic-ai-about-and-experience-copy.md` and `docs/plans/hero-layout-bounce-fix.md` (no review files) fully shipped, and whether the light-mode-colors review's missed Subject/Message label fix landed.
**Why it matters:** Downstream phases read these docs as ground truth; stale guidance produces wrong plans. The docs are also part of what a reviewer of this repo sees.
**Research needed:** Diff `CLAUDE.md` and `docs/architecture.md` claims against the file list and code. For each plan without a review, compare its phase checklist against current component code and `git log -p` for the touched files. Check `Contact.tsx` label classes for light-mode contrast.

### Q8: What do the current library versions offer for richer architecture visualization and page structure?
**Unknown:** Capabilities and version-specific behavior of the installed stack relevant to a more ambitious single-page site: Framer Motion 12 (scroll-linked `useScroll` / `useTransform`, `layout` animations, `AnimatePresence` modes, reduced-motion API), Tailwind v4 (`@theme` design tokens, container queries, `@custom-variant`, whether `tailwind.config.js` is read at all), React 19 (`Suspense` / `lazy` for code-splitting heavy demos, `useTransition`), Vite 6 (manual chunking, asset handling), and D3 v7 modules for tree/hierarchy/force layouts versus the `d3-shape`-only usage today. Also whether `react-scroll` remains the appropriate section-nav mechanism versus native `scroll-behavior` plus IntersectionObserver.
**Why it matters:** Determines what interactive architecture showcases (UNS tree explorers, data-flow diagrams, scroll-driven narratives) are feasible without new dependencies, and how to keep the bundle lean.
**Research needed:** External research (web-search-researcher / Context7) on Framer Motion 12, Tailwind CSS v4, React 19, Vite 6, and D3 v7 hierarchy modules. Pin findings to the exact versions in `package.json`.

## Decisions to Resolve

### D1: What counts as "architect evidence" on this site?
**Decision:** Which forms of proof to feature — written case studies (problem, constraints, decisions, outcomes), interactive architecture diagrams (UNS topology, data flow from PLC to MES), decision-record style write-ups, quantified outcomes (facilities, tags, latency), open-source/module work, or a mix.
**Options:** A) Narrative case studies with static diagrams  B) Interactive explorers (live UNS tree, simulated broker, data-flow animation)  C) Both, with case studies as the spine and interactive widgets embedded
**Needs:** human input; informed by Q3/Q4 (what interactive assets already exist)

### D2: Which new sections or content types are in?
**Decision:** Whether to add sections beyond the current five — e.g., Architecture / Case Studies, Agentic AI Workflow / Tooling, Writing / Talks, Open Source, Principles / How I Work, Testimonials.
**Options:** A) Deepen the existing five only  B) Add 1–2 high-impact sections (Case Studies + How I Work)  C) Full expansion
**Needs:** human input

### D3: Fate of the dead interactive components
**Decision:** Revive `MQTTExplorer` / `UNSExplorer` / `NamespaceExplorer` / `LogSimulator` as a live demo tier, rewrite them to the current design system, or delete them and their dependencies.
**Options:** A) Revive and restyle  B) Rebuild new interactive widgets from scratch, delete old  C) Delete, stay image-based
**Needs:** human input + Q4 findings

### D4: What real-world detail can be published?
**Decision:** How specific the case studies can be about employer work (Fortune Brands multi-facility UNS, GPA MQTT pipelines, the Ignition Java module, the UNS simulator) — names, numbers, screenshots, architecture diagrams — given confidentiality.
**Options:** A) Anonymized / genericized ("a multi-site manufacturer")  B) Named employers, generalized specifics  C) Full detail where permitted
**Needs:** human input (only the owner knows the constraints)

### D5: Resume download
**Decision:** Restore the commented-out resume button and ship `public/resume.pdf`, replace with a link to LinkedIn, or leave out.
**Options:** A) Restore with a PDF the owner provides  B) Link out  C) Omit
**Needs:** human input

### D6: Contact form delivery
**Decision:** Keep EmailJS (requires the owner to supply three `VITE_EMAILJS_*` values at build/deploy time), switch to a simpler `mailto:` / direct-links panel, or use a different form backend.
**Options:** A) Keep EmailJS, document env setup  B) Replace with direct links  C) Other provider
**Needs:** human input + Q6 (current behavior without env vars)

### D7: Visual direction
**Decision:** Evolve the current indigo / Inter / gray design language, or rebrand (new palette, display typeface, a more "industrial console" aesthetic to match the domain).
**Options:** A) Evolve in place  B) Targeted rebrand of accent + type  C) Full visual redesign
**Needs:** human input + Q2

### D8: Engineering-rigor additions
**Decision:** Whether tests (component/visual), CI (lint + build on PR), a deploy pipeline, bundle budgets, Lighthouse / a11y checks, and refreshed CLAUDE.md / docs are part of this update.
**Options:** A) Yes — the repo is itself part of the portfolio  B) Build/lint gate only  C) Out of scope
**Needs:** human input + Q6 baseline

### D9: Dependency cleanup
**Decision:** Remove unused packages (`react18-json-view` vs `react-json-view-lite` duplication, full `d3` when only `d3-shape` is used, `mqtt` if live mode is dropped, `autoprefixer` / `postcss` under Tailwind v4) or keep them for revived features.
**Options:** A) Prune to what live code imports  B) Keep pending D3 outcome
**Needs:** Q4 findings + D3 resolution

## Research Plan
1. **Q6 first** (build / lint / bundle baseline, contact form reality) — cheap, factual, and it grounds D6, D8, D9.
2. **Q7** (docs drift) in parallel — corrects the ground truth every later phase relies on.
3. **Q1 + Q2** (content inventory + design system) — the foundation for D1, D2, D7.
4. **Q3 + Q4 + Q5** (Hero mechanics, dead code, demos tier) — together these decide what interactive assets exist for D1 / D3.
5. **Q8** (library capabilities) last, external research; scope it to whatever Q3–Q5 reveal as the likely interactive direction.
