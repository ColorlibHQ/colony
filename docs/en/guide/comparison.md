# vs Ant Design Pro

Ant Design Pro is the official template and it is actively maintained. This page
is not an argument that it is bad — it is a description of what is different, so
you can tell which one fits your team.

**Use Ant Design Pro if** your team already works in the UmiJS ecosystem, or you
want the option that the Ant Design organisation itself maintains.

**Use Colony if** you already know Vite and would rather not adopt a
meta-framework to get an admin panel.

## The build

Pro's scripts are `max dev` and `max build`. Using it means adopting
[`@umijs/max`](https://umijs.org) — its routing, its request layer, its plugin
system. Colony is plain Vite and React Router; there is no framework between you
and the app.

## The component layer

This is the substantive difference. ProComponents — `ProTable`, `ProForm`,
`ProLayout` — is what makes Pro *Pro*. Its npm state:

| dist-tag | version | published | declared antd support |
| --- | --- | --- | --- |
| `latest` | 2.8.10 | 2025-07-17 | antd `^4.24.15 \|\| ^5.11.2` |
| `beta` | 3.1.14-6 | 2026-07-29 | antd `^6.0.0` |

`npm i @ant-design/pro-components` installs a package that does not declare antd
v6 support. Ant Design Pro pins `^3.1.14-2` — a prerelease — to work around it.

Colony depends on neither. Its data table is built on antd's own `Table` plus a
toolbar layer, because antd Table already owns rendering, sticky headers, virtual
scrolling and selection.

*Figures verified 2026-08-19 from the npm registry; check them yourself before
quoting them.*

## Weight

Gzip transferred on first paint, measured in headless Chromium against each
project's public demo:

| | JS on first paint |
| --- | --- |
| Ant Design Pro | 1,178 kB |
| **Colony**, heaviest route | **509 kB** |
| Colony, sign-in | 330 kB |

Colony enforces a gzip budget in CI, so this does not quietly regress.

## What each has that the other does not

| | Pro | Colony |
| --- | --- | --- |
| Official, maintained by the antd org | ✅ | — |
| Locales shipped | 8 | 2, both first-class |
| Theme editor | Setting drawer, 4 presets | Theme Studio, live tokens, exports `theme.ts` |
| Access control | `access.ts`, no UI | Visual matrix; drives menu, palette and guards |
| Command palette | — | ⌘K |
| E2E tests | — | Playwright |
| Storybook | — | planned |
| Kanban / calendar / inbox / files / audit / billing | — | ✅ |
| Bundle budget in CI | — | ✅ |

## Migrating from Pro

The pages map closely — Colony ships all 24 of Pro's routes under the same names.
The work is mostly:

1. Replace `ProTable` with Colony's `DataTable`. See [Data table](/en/guide/data-table).
2. Replace `ProForm` with React Hook Form and Zod.
3. Replace Umi's `request` with TanStack Query.
4. Move `access.ts` booleans into `src/config/permissions.ts` as
   `resource:action` grants.
