# 部署

构建产物是静态 SPA，任何静态托管服务均可。

```bash
pnpm build     # -> dist/
```

::: danger 请使用 `build` 而非 `build:demo`
`build:demo` 会把 Mock 服务打进产物，拦截本应发往真实接口的请求；同时还会复制
`demo-public/`，其中的 `robots.txt` 会屏蔽整站抓取 —— 这对处于 SPA 回退之后的演示站是
正确的，但用在你的应用上会让它悄悄从搜索引擎消失。
:::

## SPA 回退，以及如何避免爬虫陷阱

客户端路由要求把真实路径回退到 `index.html`，否则深链接会在 React 运行之前
就被托管服务返回 404。

常见做法是一条通配规则：

```
/*  /index.html  200
```

**请不要这么做。** 它会对*任意* URL 返回 200。爬虫随手构造一个 `/a/b/c` 也能拿到页面，
并从中发现更多虚构链接，永远不会结束 —— 这是一个无界的抓取空间。
2026 年，另一个 Colorlib 演示站正是因为这种结构产生了四位数的 Cloudflare 账单。

`pnpm build` 会依据 `src/config/routes.ts` 生成逐条列举路由的 `_redirects`，
未列出的路径会落到 `404.html` 并返回真实的 404，抓取随之终止。
`scripts/routes.test.ts` 会在该列表与路由不一致时失败；
`scripts/crawl-trap.test.ts` 会在通配规则重新出现时失败。

Cloudflare Pages 会为未匹配路径提供顶层 `404.html`，这也是构建产物中包含它的原因。

其他托管平台同样应当逐条列举，而不是使用通配：

**Nginx** —— 精确匹配，并以真实 404 兜底：
```nginx
location = /            { try_files /index.html =404; }
location = /dashboard/analysis { try_files /index.html =404; }
# … 每个路由一条，最后：
location / { return 404; }
```

**Vercel** —— 在 `rewrites` 中逐条列出路由，而不是使用 `/(.*)`。

## 压缩

请开启 gzip 或 brotli。本项目引用的体积数据均为 gzip 值；未压缩时最重的页面约为
3 倍大小，未开启压缩的托管会悄悄抵消掉全部体积优化。

## 缓存

产物文件名带内容哈希，因此 `assets/*` 可以长期强缓存，而 `index.html` 不应缓存：

```nginx
location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
location = /index.html { add_header Cache-Control "no-cache"; }
```

## 子路径部署

部署到子路径需要同时设置 `vite.config.ts` 中的 `base` **和**路由的 `basename`。
只设置其中一个会得到一个空白页面，而网络面板里全是 200 ——
资源加载成功，但路由匹配不上。

## 中国大陆访问

如果你的用户在中国大陆，请在上线**之前**验证托管服务在当地的可达性，而不是上线之后。
同时建议将仓库镜像到 [Gitee](https://gitee.com) —— GitHub 在国内访问较慢且时断时续，
而 Gitee 是许多国内开发者实际浏览代码的地方。
