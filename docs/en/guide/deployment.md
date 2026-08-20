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

## SPA fallback

Client-side routing needs unknown paths served `index.html`, or a deep link
returns 404 from the host before React ever runs.

**Netlify** — `public/_redirects`:
```
/*  /index.html  200
```

**Vercel** — `vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**Nginx**:
```nginx
location / { try_files $uri $uri/ /index.html; }
```

**Cloudflare Pages** handles it automatically.

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
