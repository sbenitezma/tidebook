# Tidebook — project context

Tidebook is a portfolio project: a booking site for coastal stays (fictional rooms and bungalows),
built as an Nx monorepo with a framework-agnostic design system and the same app in several
frameworks.

## Functional scope (v1)

1. Accommodation list (illustration, name, type room/bungalow, size, beds, max capacity, price per
   night) from mock JSON in `libs/core/src/data`.
2. Search form: check-in (default today), check-out (default tomorrow), adults 1–4, children 0–3.
3. Room selection and booking summary: nights, price per night, subtotal, discount, total, and a
   warning when capacity is exceeded.
4. Promo code via URL (`?promo=CODE`) or input field, validated against the mock list (unknown or
   expired codes show a clear message and apply no discount).
5. Booking confirmation with summary and booking reference, saved to `localStorage` inside
   `try/catch`.
6. Mobile-first and accessible: keyboard navigation, labelled fields, visible focus, AA contrast.

Out of scope for v1: payments, user accounts, backend, i18n, real availability.

Business rules that must stay covered by tests:

- Total = price per night × nights (integer cents, discount rounded to the nearest cent).
- The total is computed by a single pure function in `libs/core` (`quoteStay`).
- Promo codes are never used as raw percentages: they are looked up in the code list and checked
  for expiry.

## Architecture

- Nx + npm workspaces. TypeScript `strict` everywhere. Nx targets are inferred from each
  package's `package.json` scripts (`build`, `test`, `lint`, `typecheck`); caching is set in
  `nx.json`.
- Libraries are consumed from source (`exports` → `src/index.ts`); only apps have a build step.
- `libs/tokens`: design tokens in one TS object, exported as TS constants and as CSS custom
  properties (`--tb-*`).
- `libs/core`: pure TS business logic, no framework and no DOM (its tsconfig has no `DOM` lib).
  Built with TDD (test first). Vitest, coverage close to 100 %.
- `libs/ui`: Lit Web Components, prefix `tb-`. Only tokens for styling, communicate through
  properties and typed `CustomEvent`s (`tb-*` event names, declared in `HTMLElementEventMap`).
  No decorators: `static properties` + `declare` fields.
- `apps/react`: React 19 + Vite, uses the custom elements natively (events as `ontb-change`
  props, typed in `src/custom-elements.ts`).
- `apps/vue`: Vue 3 + Vite, `<script setup>` SFCs. `isCustomElement` for `tb-*` in
  `vite.config.ts`; bindings become properties, events as `@tb-select`, typed through
  `GlobalComponents` in `src/custom-elements.ts` and checked by `vue-tsc`.
- Shared by both apps: page layout CSS (`@tidebook/ui/layout.css`), room illustrations and favicon
  (`libs/ui/public`, Vite `publicDir`), user-facing messages and `formatLongDate` (`libs/core`).
- `apps/e2e`: one Playwright suite run against every app's production build (desktop and
  mobile). Locators by role and label (they pierce shadow DOM). Run with `npx nx e2e e2e`;
  browsers are installed once with `npx playwright install chromium`.
- Storybook (`@storybook/web-components-vite`) lives in `libs/ui`: `.storybook/` config and one
  `*.stories.ts` next to each component, plus a tokens page. Docs and a11y addons, telemetry off.
  Targets `storybook` and `build-storybook` (output `libs/ui/dist/storybook`); stories are
  excluded from the `production` input so they never invalidate app builds.
- Roadmap: optional `apps/angular`
  (`CUSTOM_ELEMENTS_SCHEMA`).
- Apps contain presentation and UI state only. Any business rule goes to `libs/core` first,
  with its test.
- Netlify: one site per app (and one for Storybook), each with its own `netlify.toml` (Nx build,
  Node 22, SPA redirect, `ignore` so it only rebuilds when its app or its libraries change).

## Commands

- `npm run dev` / `npm run dev:vue` — React (5173) / Vue (5174) dev server.
- `npm run storybook` — Storybook (6006).
- `npm run check` — lint, typecheck, test, build and Storybook build for every project.
- `npm run e2e` — Playwright E2E.
- `npm run affected` — the same plus E2E, for what changed only.

## Repository rules

- Code, comments, names, commits and README in English.
- Constructive tone. Present Tidebook as "a portfolio project"; do not mention companies, hiring
  processes or other projects it may be compared to.
- Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`...), small and meaningful.
- Commits use the repository's local git identity only. Never add `Co-Authored-By` trailers or
  any AI mention to commits, PRs or README. Check with `git log -1` after committing.
- Record each technical decision in `docs/decisions.md` (one line with its reason).
- Keep `NEXT-STEP.md` updated with the exact next step at the end of each session.
- Never use `npm install --force` or `--legacy-peer-deps`; find the root cause of conflicts.
