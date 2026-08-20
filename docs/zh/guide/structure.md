# 目录结构

```
src/
├── app/            路由、Provider、Query Client、主题 Provider
├── components/
│   ├── access/     权限组件：<Can>、useCan、RequirePermission
│   ├── command/    ⌘K 命令面板
│   ├── common/     PageHeader、StatCard、异常页插图
│   ├── data-table/ DataTable 与安全的 CSV 导出
│   └── layout/     侧边栏、顶栏
├── config/
│   ├── navigation.ts   ← 侧边栏、面包屑与命令面板的唯一数据源
│   ├── permissions.ts  ← 角色、权限与路由所需权限
│   └── theme/          antd Token 配置与预设
├── i18n/           i18next 配置与语言包
├── layouts/        AppLayout、AuthLayout
├── lib/            纯逻辑：权限、对比度、模糊匹配、图表主题
├── mocks/          MSW handlers 与假数据 —— 接入真实接口后即可删除
├── pages/          每个模块一个目录
├── stores/         Zustand：偏好设置、身份
└── styles/         tokens.css、global.css
```

## 两个值得了解的文件

**`src/config/navigation.ts`** 是路由的唯一数据源。侧边栏、面包屑与命令面板都由它派生。
它们过去各自维护一份副本，而面包屑那份先后两次过期，导致页面直接显示原始的小写路由片段。
在这里新增一个页面，三处会同时生效。

**`src/config/permissions.ts`** 保存角色、`resource:action` 权限，以及每个路由所需的权限。
应用中不会出现「这个用户是不是管理员」这样的判断，只会问「这个用户是否可以执行该操作」。

## 约定

- **文案一律使用 i18n key**，不写死显示文本。模块级的已翻译文案数组会把语言
  冻结在导入时刻的那一种。
- **纯逻辑放在 `lib/`**，以便脱离 React 直接测试。
- **提前返回** —— `if (!el) return`。
- **假数据使用固定种子**，不用 `Math.random()`，以保证截图与视觉回归稳定。
