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

`pnpm build` instead generates a `_redirects` naming each route from
`src/config/routes.ts`, so anything unlisted falls through to `404.html` with a
real 404 and crawling stops. `scripts/routes.test.ts` fails if that list and the
router disagree; `scripts/crawl-trap.test.ts` fails if a catch-all ever
reappears.

Cloudflare Pages serves a top-level `404.html` for unmatched paths, which is why
one is emitted.

For other hosts, enumerate rather than wildcard:

**Nginx** — exact locations, with a real 404 fallback:
```nginx
location = /            { try_files /index.html =404; }
location = /dashboard/analysis { try_files /index.html =404; }
# … one per route, then:
location / { return 404; }
```

**Vercel** — list the routes in `rewrites` rather than `/(.*)`.

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
