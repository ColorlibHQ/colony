---
layout: home
hero:
  name: Colony
  text: Ant Design admin, without the lock-in
  tagline: Everything Ant Design Pro gives you, on plain Vite and React Router. No meta-framework, no prerelease dependencies.
  actions:
    - theme: brand
      text: Get started
      link: /en/guide/getting-started
    - theme: alt
      text: vs Ant Design Pro
      link: /en/guide/comparison
    - theme: alt
      text: GitHub
      link: https://github.com/ColorlibHQ/colony
features:
  - title: No meta-framework
    details: Vite 8 and React Router 8. Ant Design Pro's build scripts are `max dev` and `max build` — using it means adopting UmiJS. This does not.
  - title: No prerelease dependencies
    details: ProComponents' npm `latest` still declares antd 4/5 only, and Pro pins a beta to work around it. Colony depends on neither.
  - title: Genuinely bilingual
    details: English and Chinese are peers. CI fails if an English string lands without its Chinese pair, and Han glyphs get their own type scale rather than Latin metrics.
  - title: Half the weight
    details: 509 kB of JavaScript on the heaviest route against Pro's 1,178 kB, both measured gzip on first paint. A budget in CI keeps it there.
  - title: Theme Studio
    details: Edit Ant Design tokens live and export a theme file. Shows the WCAG contrast ratio beside the picker, because a picker without one is how inaccessible themes ship.
  - title: Visual access control
    details: Pro ships `access.ts` and no interface. Here the permission matrix is a page — flip a checkbox and the sidebar, command palette and route guards all follow.
---
