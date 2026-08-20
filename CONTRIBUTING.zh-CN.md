# 参与贡献

[English](./CONTRIBUTING.md) · [简体中文](./CONTRIBUTING.zh-CN.md)

**中文与英文**的 issue 和 PR 同样欢迎。

## 环境准备

```bash
pnpm install
pnpm dev
```

## 提交 PR 之前

```bash
pnpm lint && pnpm format && pnpm test && pnpm build && pnpm test:e2e && pnpm size
```

CI 会执行全部六项检查。它们应当先在本地通过。

## 会被打回的情况

**只有单侧文案。** 每条英文文案都必须有对应中文。CI 会校验这一点，
并且会检查中文是否只是换了标签的英文 —— 含拉丁字母且不含汉字的 `zh-CN` 文案
会直接失败，除非它是品牌名、技术缩写或文件名。

**没有充分理由的新依赖。** CI 中有 gzip 体积预算。为省下五十行代码而引入 15 kB
的依赖会被质疑。模糊匹配与 CSV 生成之所以手写，正是出于这个原因。

**引入预发布版本的依赖。** 本项目的核心论点就是 Ant Design Pro 依赖了预发布版本，
我们自己不能这么做。

**在应当使用 i18n key 的地方写死文案。** 模块级的已翻译文案数组，
会把语言冻结在导入时刻的那一种。

**没有测试的功能。** 值得实现的行为就值得被固定下来。手工发现的缺陷应当留下一条
用例，避免它悄悄复发。

## 代码风格

- 纯逻辑放在 `lib/`，以便脱离 React 直接测试。
- 使用提前返回：`if (!el) return`。
- 假数据使用固定种子，不用 `Math.random()` —— 截图与视觉回归依赖稳定的数值。
- 注释解释*为什么*，而不是*做了什么*。

## 新增页面

1. 在 `src/config/navigation.ts` 中注册 —— 侧边栏、面包屑与命令面板都由它派生。
2. 在 `src/app/router.tsx` 的 `RequirePermission` 内添加路由。
3. 如需权限控制，在 `ROUTE_PERMISSIONS` 中补充对应权限。
4. **两种语言**的文案都要补齐。
5. 将其加入 `e2e/helpers.ts` 的 `APP_ROUTES`，以获得冒烟测试覆盖。
