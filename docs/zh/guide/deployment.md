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

`pnpm build` 会依据 `src/config/routes.ts`，为每个路由写出一个真实的 HTML 文件 ——
`dist/table.html`、`dist/dashboard/analysis.html` 等等。每个真实路由都是实际存在的静态
内容，因此直接返回 200；其余路径没有对应文件，会落到 `404.html` 并返回真实的 404，
抓取随之终止。

这种做法不依赖任何平台特定配置，因此在 Cloudflare Pages、Netlify、S3 与 nginx 上表现
一致，也不存在需要与重定向文件保持同步的内容。

采用 `<route>.html` 而非 `<route>/index.html` 是有意为之：静态托管会直接返回前者，
而后者会让每个深链接先 308 跳转到带斜杠的形式。两者都能用，但只有一种会多一次往返。

此前曾尝试用逐条列举的 `_redirects`，但并不可行：Cloudflare Pages 会把 `/index.html`
规范化为 `/`，因此指向它的 rewrite 会继承该跳转，深链接最终 308 到首页，
访问者想要的页面就此丢失。

`scripts/routes.test.ts` 会在路由列表与路由配置不一致时失败；
`scripts/crawl-trap.test.ts` 会在 shell 缺失或通配规则重新出现时失败。

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
