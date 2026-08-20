# 部署

构建产物是静态 SPA，任何静态托管服务均可。

```bash
pnpm build     # -> dist/
```

::: danger 请使用 `build` 而非 `build:demo`
`build:demo` 会把 Mock 服务打进产物，它将拦截本应发往真实接口的请求。
:::

## SPA 回退

客户端路由要求把未知路径回退到 `index.html`，否则深链接会在 React 运行之前
就被托管服务返回 404。

**Netlify** —— `public/_redirects`：
```
/*  /index.html  200
```

**Vercel** —— `vercel.json`：
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**Nginx**：
```nginx
location / { try_files $uri $uri/ /index.html; }
```

**Cloudflare Pages** 会自动处理。

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
