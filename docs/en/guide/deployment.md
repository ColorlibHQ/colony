# Deployment

The build is a static SPA. Any static host works.

```bash
pnpm build     # -> dist/
```

::: danger Use `build`, not `build:demo`
`build:demo` bundles the mock server, which will intercept requests meant for
your real API. It also copies `demo-public/` — including a `robots.txt` that
closes the entire site to crawlers. Correct for a demo behind an SPA fallback;
it would silently deindex your app.
:::

## SPA fallback, without the crawl trap

Client-side routing needs real paths served `index.html`, or a deep link returns
404 from the host before React ever runs.

The usual advice is a catch-all:

```
/*  /index.html  200
```

**Do not do that.** It answers 200 for *every* URL. A crawler that invents
`/a/b/c` gets a page, finds more invented links, and never terminates — an
unbounded crawl space. That exact shape ran up a four-figure Cloudflare bill on
another Colorlib demo in 2026.

`pnpm build` instead writes the SPA shell to a real file per route —
`dist/table.html`, `dist/dashboard/analysis.html`, and so on — from the list in
`src/config/routes.ts`. Every real route is genuine static content, so it is a
plain 200; anything else has no file and falls through to `404.html` with a real
404, which is where crawling stops.

This needs no host-specific configuration, so it behaves the same on Cloudflare
Pages, Netlify, S3 or nginx. Nothing to keep in sync with a redirects file.

`<route>.html` rather than `<route>/index.html` is deliberate: static hosts serve
the former directly, while the latter earns a 308 to the trailing-slash form on
every deep link. Both work; only one costs a round trip.

An earlier attempt used `_redirects` listing each route, and it did not work:
Cloudflare Pages canonicalises `/index.html` to `/`, so a rewrite pointing there
inherits the redirect and a deep link 308s to the root, losing the page the
visitor asked for.

`scripts/routes.test.ts` fails if the route list and the router disagree;
`scripts/crawl-trap.test.ts` fails if a shell goes missing or a catch-all
reappears.

## Compression

Serve gzip or brotli. The numbers this project quotes are gzip; uncompressed the
heaviest route is roughly 3× larger, and an uncompressed host quietly undoes the
bundle work.

## Caching

Assets are content-hashed, so cache `assets/*` hard and `index.html` not at all:

```nginx
location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
location = /index.html { add_header Cache-Control "no-cache"; }
```

## Base path

Deploying under a subpath needs `base` in `vite.config.ts` **and** `basename` on
the router. Setting only one produces a blank page with 200s in the network tab —
assets load, routes do not match.

## China

If your users are in mainland China, verify the host is reachable from there
before launch rather than after. Consider mirroring the repository to
[Gitee](https://gitee.com) — GitHub is slow and intermittently unreachable, and
Gitee is where many Chinese developers browse.
