# Contributing

[English](./CONTRIBUTING.md) · [简体中文](./CONTRIBUTING.zh-CN.md)

Issues and pull requests in **English or Chinese** are equally welcome.

## Setup

```bash
pnpm install
pnpm dev
```

## Before opening a PR

```bash
pnpm lint && pnpm format && pnpm test && pnpm build && pnpm test:e2e && pnpm size
```

CI runs all six. They pass locally before they pass there.

## Things that will fail review

**A translation without its pair.** Every English string needs its Chinese
counterpart. CI checks this, and also that the Chinese value is not the English
one wearing a different label — a `zh-CN` value with Latin letters and no Han
characters fails unless it is a brand, an acronym or a filename.

**A new dependency without a case for it.** There is a gzip budget in CI. A
dependency that costs 15 kB to save fifty lines will be questioned. The fuzzy
matcher and the CSV writer are hand-rolled for exactly this reason.

**A prerelease dependency.** The project's central claim is that Ant Design Pro
depends on one. We do not get to.

**A display string where an i18n key belongs.** Module-level arrays of translated
labels freeze whichever locale was active at import.

**A feature without a test.** Behaviour worth building is behaviour worth
pinning. Bugs found by hand should leave a spec behind so they cannot come back
quietly.

## Style

- Pure logic in `lib/`, so it can be tested without React.
- Guard clauses: `if (!el) return`.
- Seeded fixtures, never `Math.random()` — screenshots and visual regression
  depend on stable numbers.
- Comments explain *why*, not *what*.

## Adding a page

1. Add it to `src/config/navigation.ts` — sidebar, breadcrumb and command palette
   all derive from there.
2. Add the route in `src/app/router.tsx`, inside `RequirePermission`.
3. Add its permission to `ROUTE_PERMISSIONS` if it needs one.
4. Add copy to **both** locales.
5. Add it to `APP_ROUTES` in `e2e/helpers.ts` so it gets smoke coverage.
