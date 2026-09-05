# Ben Duran — Manufacturing Systems Architect

A single-page portfolio built with React 19 + TypeScript. It demonstrates a Unified Namespace instead of describing one: a fictional ISA-95 namespace model (`src/content/uns.ts`) feeds both the Hero's live cards and the Architecture section's topic explorer, and every section renders from a typed content layer under `src/content/`.

**Sections, in page order:**
- **Hero** — positioning, plus three simulated dashboard cards (MQTT stream, OEE gauge, UNS path) over the shared namespace
- **Architecture** — the centerpiece: a seven-tier reference architecture with an agentic layer; click a tier to read its purpose, why it is separate, and the decision it encodes; the broker tier opens a topic explorer
- **Work** — six case studies in Problem → Constraint → Decision → Result shape; four carry inline SVG diagrams, two carry screenshot carousels (UNS Simulator, Ignition Script Profiler module)
- **Experience** — the integrator / vendor / manufacturer three-seat arc and a timeline
- **About** — bio, skills, four operating principles, and a resume link when one is published
- **Contact** — an EmailJS form when configured, otherwise a mailto link

No backend, no router, no live broker connection.

---

## Tech Stack

- **React 19** + **TypeScript** (strict)
- **Vite 6** — build tool and dev server
- **Tailwind CSS v4** — class-based dark mode; design tokens in an `@theme` block in `src/index.css`
- **Framer Motion 12** — scroll-triggered and mount animations; `<MotionConfig reducedMotion="user">` at the root
- **d3-shape** — `arc()` only, for the Hero OEE gauge
- **Lucide React** — icons
- **Vitest 5 + Testing Library** — content invariants, a public-safety denylist, component and smoke tests
- **GitHub Actions** — lint, typecheck, test, build on every push and pull request

---

## Prerequisites

- Node.js 22.12 or newer (Vitest 5's floor; CI runs Node 22)
- npm 10 or newer

---

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/benjamind10/portfolio-new.git
cd portfolio-new

# 2. Install dependencies
npm install

# 3. (Optional) enable the contact form
cp .env.example .env   # then fill in the three EmailJS values

# 4. Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

## Environment

No environment variables are required. The contact form is opt-in and resolved at build time:

| Variable | Purpose |
|----------|---------|
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service id |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template id (receives `from_name`, `from_email`, `subject`, `message`) |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |

When all three are set (in a git-ignored `.env` locally, or in the hosting environment for production builds) the Contact section renders the EmailJS form. When any is missing it renders a mailto link instead, so the site never ships a form that cannot send. `.env.example` lists the keys; the types live in `src/vite-env.d.ts`; `src/utils/emailConfig.ts` resolves them.

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) + production build → `dist/` |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | `tsc -b` over the app, tests, and config |
| `npm test` | Run the Vitest suite once (jsdom) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run preview` | Serve the production build locally |

CI (`.github/workflows/ci.yml`) runs `lint → typecheck → test → build` in that order; the same four commands are the local gate before a pull request.

---

## Project Structure

```
index.html            HTML shell: favicon, meta description, Open Graph and Twitter tags, fonts, pre-paint theme script
src/
├── App.tsx           Mounts the sections in SECTIONS order inside MotionConfig
├── components/       One file per section, plus architecture/, work/ (with diagrams/), and common/
├── content/          Typed content layer: sections, profile, uns, architecture, caseStudies, experience
├── hooks/            useTheme, useActiveSection
├── utils/            cn (classnames), emailConfig
└── assets/           Profile photo and case-study screenshots
tests/                Vitest: content invariants, public-safety denylist, component, smoke, and shell tests
public/
└── computer-chip.png Favicon
docs/
└── architecture.md   Deep reference: component tree, content layer, data flows
```

To publish a resume, add `public/resume.pdf` and set `PROFILE.resume` in `src/content/profile.ts`; a test fails if one is set without the other.

---

## Contact

- Email: ben.duran@proton.me
- GitHub: [benjamind10](https://github.com/benjamind10)
- LinkedIn: [benjamin-duran](https://linkedin.com/in/benjamin-duran-3a880a1b9)
