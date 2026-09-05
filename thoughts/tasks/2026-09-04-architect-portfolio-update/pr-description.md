## Summary

Rebuilds the portfolio around a typed content layer and a seven-tier Unified Namespace reference architecture, so the page demonstrates a UNS instead of describing one. Demos becomes Work (six case studies), Hero repositions Ben as a Manufacturing Systems Architect, and the repo gains Vitest, GitHub Actions CI, `@theme` design tokens, a public-safety denylist test, and docs that match the code. Dead MQTT/D3/react-scroll code and nine unused packages are removed.

## What problems does this solve

- The old site read as a "Manufacturing Software Engineer" with two demo tabs; the record supports an architect-tier claim (production UNS across three plants, a multi-agent reporting DAG, a semantic layer for machine consumers, OEE data-model forensics). The page now leads with proof (Architecture → Work) before biography.
- Copy was inlined in JSX across five components, so nothing could be audited for public safety. Everything now lives in `src/content/*.ts` with exported interfaces, and `tests/public-safety.test.ts` fails the build on any internal name (SHA-256-hashed tokens plus shape regexes).
- The Contact form shipped a Send button that always rejected (no EmailJS keys), a personal phone number was published, and the resume link 404'd. Contact now degrades to a mailto CTA, the phone is gone, and the resume button renders only when the PDF is a verified deliverable.
- ~440 lines of unreachable code and an undeclared `d3-shape` import. Every component is now reachable from `App.tsx`; deps are exactly what is imported.
- No tests, no CI, no metadata. 15 test files / 86 tests, a four-gate CI workflow, and OG / Twitter / description tags pinned to `PROFILE` by test.

Success is measured by: a reader can click any tier and read the decision it encodes; six case studies each carry Problem → Constraint → Decision → Result and a metric; `lint · typecheck · test · build` is green locally and in CI; the denylist test passes; no `#hex` in components; no `demos` / `Richmond` in the namespace.

## User-facing changes

- **Page order and nav**: Hero → Architecture → Work → Experience → About → Contact; nav reads Architecture · Work · Experience · About · Contact with an active-section indicator (native anchors + `IntersectionObserver`, smooth scroll, reduced-motion aware).
- **Hero**: h2 is now "Manufacturing Systems Architect · Unified Namespace, MES, Agentic AI"; pitch rewritten around designing data models for automated reasoning; primary CTA "Explore the Architecture" → `#architecture`. The three cards stream a fictional ISA-95 namespace (`Enterprise/Plant-A/…`) instead of a real place name.
- **Architecture (new)**: seven clickable tier cards (edge, broker, MES, analytics, historian, warehouse, API) with SVG connectors and an agentic-layer block under tiers 4–7. Selecting a tier shows purpose / why its own tier / decision / technologies. The broker tier embeds an expandable topic explorer over the same namespace the Hero streams, with payload + schema rule.
- **Work (replaces Demos)**: six case-study cards; one expands inline at a time. Studies 1–4 carry small inline diagrams; 5–6 (UNS Simulator, Script Profiler) carry the existing screenshot carousels. The lightbox is now a real `role="dialog"` with focus trap, Escape, and focus return.
- **Experience**: a three-seat arc (integrator / vendor / manufacturer) with a lesson per seat and a seat badge on each job; current title is the employer's title of record, "Software Engineer — Fortune Brands Innovations".
- **About**: two bio paragraphs, skills, four operating principles each tied to evidence; resume button absent until `public/resume.pdf` ships.
- **Contact**: phone number removed; email is a mailto link; location shown from `PROFILE.links.location`; the form renders only when all three EmailJS keys are set at build time, otherwise an "Email me" CTA. Social icons have accessible names.
- **Shell**: JetBrains Mono for mono elements; `image/png` favicon type; meta description, Open Graph, and Twitter card tags.

## Design Decisions

Carried from `3-design.md` (approved 2026-09-04):

- **D1** Hero positions as architect; Experience keeps the employer's title of record (confirmed by Ben 2026-09-05 as "Software Engineer").
- **D2** Technologies and counts on, business-unit brand names off, identifiers (hostnames, site codes, DB names, colleagues) never — enforced by a hashed denylist test so the test file itself publishes nothing.
- **D3** Proof before biography: Architecture and Work precede Experience and About.
- **D4** Architecture is hand-laid React + Framer `layoutId`, not D3; agentic layer drawn as a consumer of tiers 4–7, not a tier.
- **D5** Six case studies in Problem → Constraint → Decision → Result shape; the two demos become studies 5–6.
- **D6** Typed content layer; components only render. A `sections.ts` registry keeps `App`, `Navbar`, and `useActiveSection` on one list.
- **D7** Dead code and nine packages removed; `react-scroll` replaced by native scroll + `useActiveSection`.
- **D8** Contact never ships a control that always fails; resume is verified by test; phone removed.
- **D9** Vitest + Testing Library, CI on push/PR, metadata + favicon fix. `og:url`, canonical, `og:image`, and `vite.config.ts base` deliberately deferred until the hosting target is named.
- **D10** `@theme` tokens for accent / surface / status / gauge colors and `--font-mono`; `<MotionConfig reducedMotion="user">` at the root.

## Changes

### Phase 1: Repo reads clean, nav goes native, tests and CI exist
- Deleted `src/components/{MQTTExplorer,UNSExplorer,NamespaceExplorer,LogSimulator,Mapp}.tsx`, `src/hooks/useMqtt.ts`, `src/App.css`, `src/data/unsTree.ts`, `src/assets/react.svg`, `public/vite.svg`, `tailwind.config.js`.
- `package.json`: dropped `mqtt`, `react-json-view-lite`, `react18-json-view`, `d3`, `@types/d3`, `autoprefixer`, `postcss`, `react-scroll`, `@types/react-scroll`; added `d3-shape`, `@types/d3-shape`, `vitest`, `jsdom`, `@testing-library/{react,dom,jest-dom,user-event}`; scripts `test`, `test:watch`, `typecheck`.
- New `src/content/sections.ts`, `src/hooks/useActiveSection.ts`; `Navbar.tsx` renders `<a href="#id">` with `aria-current`; `index.css` gets `scroll-behavior: smooth` (auto under reduced motion); `App.tsx` wrapped in `MotionConfig`.
- New `tests/setup.ts` (matchMedia + recording IntersectionObserver stubs), `tests/smoke/app.test.tsx`, `tests/hooks/useActiveSection.test.tsx`, `.github/workflows/ci.yml`; `vite.config.ts` test block; `tsconfig.app.json` includes `tests`.

### Phase 2: Hero claims the architect role on the shared namespace model
- New `src/content/uns.ts` (`UnsPayload`, `UnsNode`, `UnsLeaf`, `UNS_ROOT` via `materialize()`, `getLeaves`, `hasPayload`, `MQTT_TOPICS`), `src/content/profile.ts` (`PROFILE`, `Link`).
- `Hero.tsx`: copy from `PROFILE`, cards from `uns.ts`, all hex → token classes (`fill-gauge-*`, `text-status-*`, `bg-surface-card`, `stroke-accent-500`). `Footer.tsx` hex → `dark:bg-surface-footer`.
- `src/index.css` `@theme` block; `index.html` adds JetBrains Mono. Deleted `src/data/unsData.ts`.
- New `tests/public-safety.test.ts`, `tests/content/uns.test.ts`, `tests/smoke/hero.test.tsx`.

### Phase 3: Architecture section becomes the centerpiece
- New `src/content/architecture.ts` (`TIERS`, `AGENTIC_LAYER`, `ARCHITECTURE_COPY`), `src/components/Architecture.tsx`, `src/components/architecture/{ArchitectureDiagram,TierCard,TierDetail,UnsExplorer}.tsx` (`TierDetail` also exports `AgenticDetail`).
- `sections.ts` gains `architecture`; `profile.ts` primary CTA → `#architecture`; `App.tsx` reordered and tints re-alternated.
- New `tests/content/architecture.test.ts`, `tests/components/architecture.test.tsx`.

### Phase 4: Work replaces Demos with six case studies
- New `src/content/caseStudies.ts` (`CASE_STUDIES`, `WORK_COPY`, `Media`, `DiagramKind`), `src/components/Work.tsx`, `src/components/work/{CaseStudyGrid,CaseStudyCard,CaseStudyPanel}.tsx`, `src/components/work/diagrams/{TierStackDiagram,AgentDagDiagram,SemanticLayerDiagram,OeeForensicsDiagram}.tsx`.
- `ImageCarousel.tsx`: `label` prop, thumbnail wrapped in a `<button>`, lightbox `role="dialog" aria-modal`, focus trap, Escape, focus return, `aria-label`s on nav buttons.
- Deleted `src/components/{Demos,UNSSimulatorDemo,ScriptProfilerDemo}.tsx`; `sections.ts` `demos` → `work`.
- New `tests/content/caseStudies.test.ts`, `tests/components/work.test.tsx`, `tests/components/imageCarousel.test.tsx`.

### Phase 5: Experience three-seat arc, About principles and verified resume
- New `src/content/experience.ts` (`JOBS`, `SEATS`, `EXPERIENCE_COPY`); `profile.ts` gains `bio`, `skills`, `principles`, `resume?`, `ABOUT_COPY`.
- `Experience.tsx` renders seats legend + timeline from content; `About.tsx` renders bio / skills / principles and a conditional resume button.
- New `tests/content/experience.test.ts`, `tests/content/profile.test.ts`, `tests/smoke/about-experience.test.tsx`.

### Phase 6: Contact never ships a control that always fails
- New `.env.example`, `src/utils/emailConfig.ts` (`getEmailConfig()` → `EmailConfig | null`), `src/vite-env.d.ts` `ImportMetaEnv` augmentation.
- `Contact.tsx`: `ContactForm` / `MailtoCta` branch on a `config` prop (defaults to `getEmailConfig()`), phone removed, labels wired with `htmlFor`, socials labeled, every href from `PROFILE.links`; `profile.ts` gains `links.location?` and `CONTACT_COPY`. `Footer.tsx` hrefs from `PROFILE.links`.
- New `tests/components/contact.test.tsx` (EmailJS mocked).

### Phase 7: Ship-ready shell and docs
- `index.html`: favicon `type="image/png"`, meta description, `og:type/title/description`, `twitter:card/title/description` mirroring `PROFILE`.
- New `tests/shell.test.ts`. Full rewrites of `CLAUDE.md`, `README.md`, `docs/architecture.md` to describe the finished code.

## Deviations from the Plan

Source: `4-structure.md` (no `5-plan.md`). Report from the implementation-reviewer against `main..HEAD`.

### Implemented as planned
- All seven phases' file lists match the diff exactly: every planned deletion, creation, and modification is present, and nothing else changed.
- `package.json` drops exactly the nine named packages and adds the planned test and `d3-shape` deps plus `test` / `test:watch` / `typecheck` scripts.
- `@theme` block, `MotionConfig` wrapper, `SECTIONS` registry in D3 order, ISA-95 namespace with `materialize()`, seven `TIERS` indexed 1..7 with `readsFrom ⊆` tiers 4–7, `JOBS[0].title === 'Software Engineer'`, exactly four principles, Contact gating on `config`, hashed denylist with self-check, `index.html` metadata pinned to `PROFILE`, dialog-grade lightbox, dense-grid inline panel, shared `layoutId` detail panel.
- Live checkpoint run: 15 files / 86 tests pass; lint, typecheck, build clean; 0 chunk-size warnings; all structure grep checks return as predicted.

### Deviations/surprises
- None. Every "Adaptations" note the structure records per phase (extra derived exports in `sections.ts`, `materialize()` in `uns.ts`, `Contact`'s `config` prop, the D1 title reconfirmation, Open Question 4's resolution keeping the location via `PROFILE.links.location`) was independently verified against the code and matches.

### Additions not in plan
- None beyond what the structure's own "Adaptations" lines disclose.

### Items planned but not implemented
- **Resume PDF / `PROFILE.resume`**: left undefined by Ben's call; `public/resume.pdf` is absent and About renders no button. The test that ties the two together is in place.
- **`vite.config.ts base`, `og:url`, canonical tag, `og:image`**: deferred per Open Question 1 (hosting target unnamed); listed in `docs/architecture.md` under "Deferred Until the Hosting Target Is Named".
- **Public repo links for studies 5–6**: `CaseStudy.links` slot exists; no URLs supplied (Open Question 3).
- **Artifact redaction / `.gitignore` for `thoughts/`** (Open Question 2): the three brand names in `3-design.md` D2 were redacted before this PR's artifact commit; `thoughts/` remains untracked-but-not-ignored, and the personal briefing file stays out of the repo.

Reviewer notes outside the plan (not blocking): `Footer.tsx` and the Navbar logo still hardcode "BD" and a tagline rather than reading `PROFILE`; `useTheme` reads `localStorage` without a try/catch.

## Testing

**How to verify it:**

```bash
git fetch origin && git checkout feat/architect-portfolio-update
npm ci
npm run lint && npm run typecheck && npm test && npm run build
npm run dev   # http://localhost:5173
```

**Automated:**
- [x] `npm run lint` — clean
- [x] `npm run typecheck` — clean
- [x] `npm test` — 15 files, 86 tests, 0 skipped
- [x] `npm run build` — clean, no chunk-size warning
- [x] Structure checkpoint greps: no deleted file tracked, no dropped dep in `src`/`package.json`, no `#hex` in `src/components`, no `Richmond` in `Hero.tsx`/`uns.ts`, no `demos`, no phone number, no `linkedin.com` outside `profile.ts`, no stale terms in docs
- [x] Task-folder artifacts scanned with the denylist before commit — clean

**Manual:**
- [ ] Click each nav link at 375 px and 1280 px, light and dark; the active link follows scroll.
- [ ] Architecture: Tab reaches every tier, Enter selects; broker shows the explorer; the agentic block opens its panel.
- [ ] Work: expand each study; both carousels open the lightbox, Tab stays inside, Escape returns focus to the thumbnail.
- [ ] With no `.env`, Contact shows the "Email me" CTA; with `.env.example` copied and filled, the form renders.
- [ ] OS reduced-motion on: Hero background SVG absent, panels swap without transforms.
- [ ] Inspect the built `<head>` in a social-card debugger once a hosting URL exists.

## Rollback

All work is on one branch with one commit per verified phase; revert by closing the PR or `git revert` of the phase commits newest-first. Nothing outside the repo changes (no infra, no data, no hosting); every deleted file is recoverable from `b9b1098`.

## Description for the changelog

Rebuild the portfolio around a typed content layer and a seven-tier UNS Architecture section, replace Demos with six case studies, gate Contact on EmailJS config, and add Vitest, CI, design tokens, a public-safety denylist test, and social metadata.
