# 对比 Ant Design Pro

Ant Design Pro 是官方模板，且一直在积极维护。本页并非要论证它不好，而是说明两者
的差异，帮助你判断哪一个更适合你的团队。

**如果**你的团队已经在使用 UmiJS 生态，或者你希望选择由 Ant Design 团队自己维护的方案，
**请使用 Ant Design Pro**。

**如果**你已经熟悉 Vite，且不希望为了一个中后台而引入一整套上层框架，**可以考虑蚁群**。

## 构建方式

Pro 的构建脚本是 `max dev` 与 `max build`，使用它就意味着接受
[`@umijs/max`](https://umijs.org) —— 它的路由、请求层与插件体系。
蚁群使用原生 Vite 与 React Router，你和应用之间没有额外的框架层。

## 组件层

这是最实质的差异。ProComponents（`ProTable`、`ProForm`、`ProLayout`）是 Pro 的核心，
而它在 npm 上的现状是：

| dist-tag | 版本 | 发布时间 | 声明支持的 antd |
| --- | --- | --- | --- |
| `latest` | 2.8.10 | 2025-07-17 | antd `^4.24.15 \|\| ^5.11.2` |
| `beta` | 3.1.14-6 | 2026-07-29 | antd `^6.0.0` |

执行 `npm i @ant-design/pro-components` 安装到的版本并未声明支持 antd v6。
Ant Design Pro 通过锁定 `^3.1.14-2`（预发布版本）来绕开这一点。

蚁群两者都不依赖。其数据表格构建在 antd 自带的 `Table` 之上，只额外增加工具栏层 ——
因为 antd Table 本身已经负责渲染、吸顶表头、虚拟滚动与行选择。

*数据核对于 2026-08-19，来源为 npm registry；引用前请自行复核。*

## 体积

以无头 Chromium 访问各自公开演示站，统计首屏 gzip 传输的 JS：

| | 首屏 JS |
| --- | --- |
| Ant Design Pro | 1178 kB |
| **蚁群**（最重的页面） | **509 kB** |
| 蚁群（登录页） | 330 kB |

蚁群在 CI 中强制执行 gzip 体积预算，避免该数值悄悄回退。

## 各自独有的能力

| | Pro | 蚁群 |
| --- | --- | --- |
| 官方出品，由 antd 团队维护 | ✅ | — |
| 内置语言 | 8 种 | 2 种，均为一等公民 |
| 主题编辑 | 设置抽屉，4 套预设 | 主题工作室，实时 Token，可导出 `theme.ts` |
| 权限控制 | `access.ts`，无界面 | 可视化矩阵，联动菜单、命令面板与路由守卫 |
| 命令面板 | — | ⌘K |
| 端到端测试 | — | Playwright |
| Storybook | — | 规划中 |
| 看板 / 日历 / 收件箱 / 文件 / 审计 / 账务 | — | ✅ |
| CI 体积预算 | — | ✅ |

## 从 Pro 迁移

页面基本一一对应 —— 蚁群实现了 Pro 全部 24 个路由，命名保持一致。迁移工作主要是：

1. 用蚁群的 `DataTable` 替换 `ProTable`，详见[数据表格](/zh/guide/data-table)。
2. 用 React Hook Form 与 Zod 替换 `ProForm`。
3. 用 TanStack Query 替换 Umi 的 `request`。
4. 将 `access.ts` 中的布尔值迁移到 `src/config/permissions.ts`，改写为
   `resource:action` 形式的权限授予。
