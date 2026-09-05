# Retro: Architect-Grade Portfolio SPA Update

## What went well

- **Vertical-slice phases with their own tests.** Each of the seven phases closed on a green `lint · typecheck · test · build`, so the PR-phase verification was mechanical: 15 files / 86 tests, and every structure checkpoint grep came back exactly as the outline predicted.
- **Typed content layer first.** Moving copy into `src/content/` in Phase 2 made the hashed public-safety denylist possible, and every later section inherited the guard for free.
- **Per-phase "Completed / Adaptations" notes in `4-structure.md`.** Because every refinement was written down where it happened, the implementation-reviewer's four-bucket report had an empty deviations bucket. That is the outcome the document-precedence ladder is meant to produce.
- **Implementing straight from the structure outline** (no `5-plan.md`) was enough for this codebase: the outline's Files / Interfaces / Checkpoint per phase carried sufficient precision.
- **Open questions with owners and deadlines.** Open Question 4 (the `Richmond` check vs. the location line) was deferred to the phase that owned the file and resolved there with the Desired End State amended, rather than blocking Phase 2.

## What went wrong

- **Open Question 2 was flagged but left for the PR phase.** The structure doc knew the design's D2 "Alternatives" line named three business-unit brands and that `/bd-pull-request` would bake the folder into a public repo's history, yet nothing redacted it until this session ran an ad-hoc denylist scan over the task folder. The line had to be edited at PR time.
- **Base branch and credentials were not verified before starting.** The requested `dev` base did not exist on the remote, and the active `gh` account was a read-only work account rather than the repo owner's. The first push and PR attempts 403'd; the user had to switch accounts mid-run and change the base to `main`.
- **The artifact commit is blocked by the harness in auto mode.** `git add` of the untracked `thoughts/` folder was denied by the permission classifier twice (with and without `-f`), so the PR description and this retro were written to disk and attached to the PR but could not be committed by the agent. Step 5's cleanup commit is therefore moot unless the user commits the artifacts by hand.
- **Small D6 leaks survived all seven phases.** `Footer.tsx` and the Navbar logo still hardcode "BD" and a tagline, and `useTheme` reads `localStorage` unguarded. Neither test nor checklist caught them; the codebase-analyzer at PR time did.
- **No coverage provider**, so "coverage maintained" could only be answered as N/A.

## Lessons for next time

- **`/bd-pull-request` should scan the task folder before the artifact commit when the repo is public.** Concretely: if a `public-safety`-style denylist exists in the repo, run it over `thoughts/tasks/<folder>/` and stop on any hit. This session's scan was improvised in a scratch script; it should be a numbered sub-step of Step 2.
- **`/bd-pull-request` Step 0 should verify push rights, not just branch existence.** Add `git push --dry-run origin HEAD` and `gh api repos/<owner>/<repo> --jq .permissions.push` alongside the `git branch -r` check, and stop with the fix (`gh auth switch`) if either fails.
- **`/bd-design` should redact denylisted tokens from its own prose** when the design adopts a public-specificity policy like D2. The "Alternatives" line is the natural place for a brand name to sneak in.
- **Decide the artifact policy per repo, not per PR.** For a public personal repo, either add `thoughts/` to `.gitignore` and skip Steps 2b/5, or accept that artifacts land in history and scan them. Leaving it as "untracked but not ignored" forces the decision onto whoever runs the PR skill.
- **Add a D6 checkpoint grep for hardcoded name strings** (e.g. `grep -rn "Ben Duran\|\"BD\"" src/components`) to any phase that touches Navbar or Footer.
- **Harness note:** in auto mode the classifier treats staging an untracked folder that CLAUDE.md marks as sensitive as a blocked action. Either run the PR skill in a mode that prompts instead of denying, or add a scoped Bash allow rule for `git add thoughts/tasks/*` when the user has approved the artifact commit.
