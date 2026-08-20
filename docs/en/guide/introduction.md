# Introduction

Colony is a free React admin dashboard built on Ant Design v6, Vite 8 and
TypeScript. MIT licensed, no attribution required.

## Why it exists

Ant Design has around 3 million npm installs a week and one official admin
template — [Ant Design Pro](https://pro.ant.design). Pro is good, and using it
means adopting UmiJS: its build scripts are literally `max dev` and `max build`.

Below Pro, the free tier is thin. At the time of writing the most active
non-official option had 273 GitHub stars and was still on React 18.

Colony aims at the space between: everything Pro's routes give you, on tooling
you already know.

## What is in the box

- **All 24 Ant Design Pro routes**, under the same names
- **Eight pages Pro has no equivalent for** — kanban, calendar, inbox, files,
  notifications, audit log, billing, onboarding
- **Theme Studio** — live token editing with a WCAG contrast readout
- **Command palette** — ⌘K over every route and setting
- **Visual access control** — a permission matrix that drives menu, palette and guards
- **A component gallery** — every control, in the states you will meet them

## What it deliberately does not do

- **No UmiJS.** Vite and React Router.
- **No ProComponents.** Its npm `latest` still declares antd 4/5 only.
- **No prerelease dependencies** anywhere in the tree.
- **No `@ant-design/x`** for the assistant page — ~85 kB for a message list and
  a composer did not justify itself against the budget.

## Stack

| | |
| --- | --- |
| Build | Vite 8 (Rolldown) |
| UI | Ant Design 6 |
| Language | TypeScript 6, `strict` |
| Router | React Router 8 |
| Server state | TanStack Query 5 |
| Forms | React Hook Form + Zod 4 |
| Client state | Zustand 5 |
| Charts | Recharts 3 |
| Mocking | MSW 2 |
| i18n | i18next |
| Tests | Vitest · Playwright |

TypeScript is on 6, not 7, because `typescript-eslint` still caps at `<6.1.0` on
every tag. For a template people fork, a lint setup that fails out of the box
costs more than being one major behind.
