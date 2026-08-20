# Installation

## Requirements

Node **20.19+** or **22.12+**, and pnpm. Vite 8 sets that floor; older Node will
fail at install rather than at build, which is the better failure.

## Scaffold a new project

```bash
pnpm create colony-admin my-app
cd my-app
pnpm install
pnpm dev
```

The app is on `http://localhost:5273`.

Works with npm, yarn and bun too — the scaffolder detects which one invoked it
and tells you the right commands to run next.

## Or clone

```bash
git clone https://github.com/ColorlibHQ/colony.git
cd colony
pnpm install
pnpm dev
```

Cloning gives you the docs site, the CI workflows and the `packages/` directory
as well; the scaffolder leaves those out, since they belong to this project
rather than yours.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server with the mock API running |
| `pnpm build` | Typecheck and production build — **no mock server** |
| `pnpm build:demo` | Production build **with** the mock API, for a hosted demo |
| `pnpm preview` | Serve the last build |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | End-to-end tests (Playwright) against a real build |
| `pnpm lint` / `pnpm format` | ESLint / Prettier |
| `pnpm size` | Build and check the gzip budget |

::: warning `build` and `build:demo` are not interchangeable
`pnpm build` deliberately excludes [MSW](https://mswjs.io). It is a mock server;
shipping it costs 152 kB plus its dependency tree, and it will happily intercept
requests meant for your real API. Use `build:demo` only for a demo deployment.
:::

## First things to change

1. **`src/data`, `src/mocks`** — the demo fixtures. Delete them once your API is wired.
2. **`src/config/permissions.ts`** — roles and what each one may do.
3. **`src/config/navigation.ts`** — the single source for the sidebar, breadcrumb
   and command palette. Add a page here and it appears in all three.
4. **`src/i18n/locales/`** — your copy. See [Internationalisation](/en/guide/i18n).
