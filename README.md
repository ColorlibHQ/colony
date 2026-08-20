<div align="center">

# Colony · 蚁群

**A free React admin dashboard built on Ant Design v6 — without the meta-framework.**

[English](./README.md) · [简体中文](./README.zh-CN.md)

</div>

---

> **Status: alpha.** Phase 1 is complete — all 24 Ant Design Pro routes exist,
> plus a component gallery Pro does not have. Phase 2 (Theme Studio, command
> palette, visual RBAC) is next. See [the roadmap](#roadmap).

## Why this exists

Ant Design Pro is the official admin template, and it's good. But using it means adopting
[`@umijs/max`](https://umijs.org) — its build scripts are literally `max dev` and `max build`.
If your team already knows Vite, that's a whole meta-framework to learn to get a dashboard.

There's a second problem. ProComponents — `ProTable`, `ProForm`, `ProLayout` — is what makes
Pro *Pro*, and its npm state today is:

| dist-tag | version | published | declared antd support |
|---|---|---|---|
| `latest` | 2.8.10 | 2025-07-17 | antd 4 / 5 only |
| `beta` | 3.1.14-6 | 2026-07-29 | antd ^6.0.0 |

`npm i @ant-design/pro-components` installs a package that does not declare antd v6 support and
has had no stable release in 13 months. Ant Design Pro works around this by pinning a prerelease.

**Colony takes no dependency on ProComponents.** No prereleases in the tree.

## Stack

| | |
|---|---|
| Build | Vite 8 (Rolldown) |
| UI | Ant Design 6 |
| Language | TypeScript 6, `strict` |
| Router | React Router 8 |
| Server state | TanStack Query 5 |
| Tables | antd Table + a toolbar layer |
| Forms | React Hook Form + Zod 4 |
| Client state | Zustand 5 |
| Charts | Recharts 3 |
| Mocking | MSW 2 |
| i18n | i18next — `en-US` and `zh-CN`, both first-class |
| Tests | Vitest 4 (59) · Playwright (100) |

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:5273
```

```bash
pnpm build        # typecheck + production build
pnpm test         # unit tests
pnpm lint         # eslint
```

## Weight

Measured as gzip transferred on first paint, in a headless Chromium against each
project's own public demo:

| | JS on first paint |
|---|---|
| **Colony** — heaviest route (`/dashboard/analysis`) | **509 kB** |
| Colony — `/auth/login` | 330 kB |
| Ant Design Pro | 1,178 kB |
| design-sparx (the 273-star alternative) | 763 kB |
| soybean-admin (Vue + Naive UI) | 603 kB |
| vue-vben-admin (Vue) | 312 kB |

CI enforces a gzip budget (`pnpm size`) and fails the build if it is exceeded.
MSW is excluded from `pnpm build` — use `pnpm build:demo` for a build with the
mock API, which is what the hosted demo runs.

## Bilingual by construction

`zh-CN` is authored, not machine-translated, and CI fails if an English key lands without its
Chinese pair. Typography carries two parallel metric scales — Han glyphs need more leading and
less tracking than Latin, so `tokens.css` swaps line-height, letter-spacing and the font stack
off `:root:lang(zh)`. Every screen is reviewed in four states: light/dark × EN/ZH.

## Roadmap

- [x] **Phase 0** — foundation: tokens, theming, i18n, shell, CI
- [x] **Phase 1** — parity with all 24 Ant Design Pro routes
- [ ] **Phase 2** — Theme Studio ✅ · command palette ✅ · visual RBAC ✅ · 8 pages Pro lacks
- [ ] **Phase 3** — bilingual docs site, Gitee mirror
- [ ] **Phase 4** — 1.0

## License

MIT © [Colorlib](https://colorlib.com)
