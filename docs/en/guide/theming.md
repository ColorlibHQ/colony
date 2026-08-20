# Theming

Ant Design v6 enables CSS variables by default. That is what makes live token
editing practical here — under v5's CSS-in-JS, every change meant recomputing a
stylesheet.

## Two token systems, on purpose

| | Owns | Where |
| --- | --- | --- |
| antd tokens | Component colours, radii, control heights | `src/config/theme/index.ts` via `ConfigProvider` |
| Colony tokens | The shell: layout, spacing, elevation, typography | `src/styles/tokens.css` |

They sit alongside each other rather than one wrapping the other. Anything antd
already models is configured through `ConfigProvider`; anything only the shell
needs is a CSS variable.

## Presets

Six ship in `src/config/theme/presets.ts`. Each is a small seed — antd derives
the rest:

```ts
{
  id: 'jade',
  labelKey: 'theme.preset.jade',
  colorPrimary: '#2f7d62',
  colorPrimaryDark: '#4ea183', // a light primary rarely survives inversion
  borderRadius: 8,
}
```

`colorPrimaryDark` exists because reusing a light-mode primary on a dark ground
is the classic contrast bug.

## The three-state colour mode

This trips people up, so it is worth stating plainly. The viewer has **three**
states, not two:

```css
:root { /* complete light palette */ }

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) { /* tokens only */ }
}

:root[data-theme='dark'] { /* tokens again */ }
```

`system` mode deliberately writes **no** `data-theme` attribute, which is what
keeps the media query authoritative. Never define a colour only inside a media
or `[data-theme]` block — in the unstamped state it never applies, and the page
renders one theme's text on the other theme's ground.

A blocking script in `index.html` stamps the stored preference before first
paint. Without it the page renders one frame in the default theme and snaps.

## Theme Studio

`/theme-studio` edits tokens against the app's real preference store, so the
sidebar and header change with the preview — there is no sandboxed copy to drift.
It shows the WCAG contrast ratio beside the picker.

Worth knowing: **antd's default blue is 4.10:1 on white.** Fine for large text
and UI boundaries, below AA for body copy.

Export produces a `theme.ts` you can commit:

```ts
import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: { colorPrimary: '#2f7d62', borderRadius: 8 },
};
```

## Density

Three modes — `comfortable`, `compact`, `condensed` — driven by
`data-density` on the root. Enterprise users generally want condensed; marketing
screenshots want comfortable.
