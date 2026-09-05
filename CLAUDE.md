# CLAUDE.md — Portfolio Project

Ben Duran's Industry 4.0 portfolio — a React 19 + TypeScript single-page application showcasing skills in Ignition, MQTT, and Unified Namespace (UNS). No backend, no router, no global state library. Single scrollable page with five sections.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 (class-based dark mode) |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Data viz | `d3-shape` only (`arc()` for the Hero OEE gauge) |
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
├── index.css                  Global CSS (Tailwind imports, html scroll-behavior: smooth)
├── components/
│   ├── common/
│   │   ├── FadeInWrapper.tsx  Framer Motion scroll-triggered fade-in wrapper
│   │   ├── ImageCarousel.tsx  Reusable prev/next image carousel with Framer Motion
│   │   └── SectionHeader.tsx  Section title + indigo divider + optional subtitle
│   ├── Navbar.tsx             Sticky nav, theme toggle, mobile menu; anchors from content/sections.ts
│   ├── Hero.tsx               Landing section with 3 animated dashboard cards (MQTT stream, OEE gauge, UNS path)
│   ├── About.tsx              Profile photo, bio, skills, resume download
│   ├── Experience.tsx         Work timeline (4 jobs, whileInView animation)
│   ├── Demos.tsx              Tab container for image-based demos (UNS Simulator, Ignition Java Module)
│   ├── UNSSimulatorDemo.tsx   Carousel of 5 UNS simulator screenshots
│   ├── ScriptProfilerDemo.tsx Carousel of Ignition Java module screenshots
│   ├── ScrollToTopButton.tsx  Fixed scroll-to-top button, shown after 320 px
│   ├── Contact.tsx            Contact form (EmailJS) + info
│   └── Footer.tsx             Branding and social links
├── content/
│   └── sections.ts            Section registry: id, label, inNav — page order and nav order
├── hooks/
│   ├── useTheme.ts            Dark/light toggle with localStorage persistence
│   └── useActiveSection.ts    IntersectionObserver over section ids → active nav link
├── data/
│   └── unsData.ts             UnsNode tree (fullPath + OEE payload) → Hero cards
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
├── smoke/app.test.tsx         Renders App: landmarks, one section per SECTIONS id, nav anchors
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
| `App.tsx` | Assembles all sections in page order |
| `Navbar.tsx` | Sticky nav; only consumer of `useTheme` |
| `Hero.tsx` | Animated intro + 3 dashboard cards: MQTT stream, OEE gauge, UNS path (self-contained, no real MQTT) |
| `About.tsx` | Profile, skills, resume download link |
| `Experience.tsx` | Timeline with `motion.div whileInView` animations |
| `Demos.tsx` | Tab switcher — 2 tabs: UNS Simulator, Ignition Java Module |
| `UNSSimulatorDemo.tsx` | Image carousel of 5 UNS simulator screenshots |
| `ScriptProfilerDemo.tsx` | Image carousel of Ignition Java module screenshots |
| `ImageCarousel.tsx` | Reusable carousel: prev/next nav, position indicator, Framer Motion transitions |
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

### 3. Reduced Motion
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
4. **`public/resume.pdf` must exist** — the About section has a hard-coded download link to `/resume.pdf`; if the file is missing, the button 404s silently

---

## Further Reading

- [docs/architecture.md](docs/architecture.md) — full component tree, MQTT flow diagrams, UNS data shapes, theming internals, dead code inventory
