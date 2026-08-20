# Project structure

```
src/
├── app/            Router, providers, query client, theme provider
├── components/
│   ├── access/     Permission gates: <Can>, useCan, RequirePermission
│   ├── command/    ⌘K palette
│   ├── common/     PageHeader, StatCard, exception art
│   ├── data-table/ DataTable and safe CSV export
│   └── layout/     Sider, header
├── config/
│   ├── navigation.ts   ← single source for sidebar, breadcrumb and palette
│   ├── permissions.ts  ← roles, permissions, route requirements
│   └── theme/          antd token config and presets
├── i18n/           i18next setup and locale bundles
├── layouts/        AppLayout, AuthLayout
├── lib/            Pure logic: access, contrast, fuzzy, chart theme
├── mocks/          MSW handlers and fixtures — delete once your API is live
├── pages/          One folder per section
├── stores/         Zustand: preferences, auth
└── styles/         tokens.css, global.css
```

## Two files worth knowing

**`src/config/navigation.ts`** is the single source of truth for routes. The
sidebar, the breadcrumb and the command palette all derive from it. They used to
keep parallel copies and the breadcrumb's fell out of date twice, printing raw
lowercase route segments. Add a page here and it appears in all three.

**`src/config/permissions.ts`** holds roles, `resource:action` permissions and
which permission each route requires. Nothing in the app asks "is this user an
admin", only "may this user do this".

## Conventions

- **Labels are i18n keys**, never display strings. A module-level array of
  translated labels freezes them in whichever locale was active at import.
- **Pure logic lives in `lib/`** so it can be tested without React.
- **Guard clauses** — `if (!el) return`.
- **Fixtures are seeded**, never `Math.random()`, so screenshots and visual
  regression stay stable.
