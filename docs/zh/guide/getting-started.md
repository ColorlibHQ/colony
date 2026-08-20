# 安装

## 环境要求

Node **20.19+** 或 **22.12+**，以及 pnpm。这是 Vite 8 的最低要求；版本过低会在安装阶段
就报错，而不是等到构建时才失败 —— 这是更好的失败方式。

## 创建新项目

```bash
pnpm create colony-admin my-app
cd my-app
pnpm install
pnpm dev
```

应用运行在 `http://localhost:5273`。

同样支持 npm、yarn 与 bun —— 脚手架会识别是哪个包管理器调用了它，
并给出对应的后续命令。

## 或者直接克隆

```bash
git clone https://github.com/ColorlibHQ/colony.git
cd colony
pnpm install
pnpm dev
```

克隆会同时得到文档站、CI 工作流与 `packages/` 目录；脚手架不会包含这些，
因为它们属于本项目而不属于你的项目。

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动开发服务器，并加载 Mock 接口 |
| `pnpm build` | 类型检查 + 生产构建，**不包含 Mock 服务** |
| `pnpm build:demo` | **包含** Mock 接口的生产构建，用于线上演示 |
| `pnpm preview` | 预览最近一次构建 |
| `pnpm test` | 单元测试（Vitest） |
| `pnpm test:e2e` | 端到端测试（Playwright），运行在真实构建产物上 |
| `pnpm lint` / `pnpm format` | 代码检查 / 格式化 |
| `pnpm size` | 构建并校验 gzip 体积预算 |

::: warning `build` 与 `build:demo` 不可混用
`pnpm build` 会刻意排除 [MSW](https://mswjs.io)。它是 Mock 服务，打包进生产环境会带来
152 kB 及其整棵依赖树，而且它会拦截本应发往真实接口的请求。仅在部署演示站时使用
`build:demo`。
:::

## 首先要修改的地方

1. **`src/data`、`src/mocks`** —— 演示用的假数据，接入真实接口后即可删除。
2. **`src/config/permissions.ts`** —— 角色及其权限定义。
3. **`src/config/navigation.ts`** —— 侧边栏、面包屑与命令面板的唯一数据源，
   在此新增页面，三处会同时生效。
4. **`src/i18n/locales/`** —— 你的文案，详见[国际化](/zh/guide/i18n)。
