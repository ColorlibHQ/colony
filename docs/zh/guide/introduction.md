# 简介

蚁群是一套基于 Ant Design v6、Vite 8 与 TypeScript 的免费 React 中后台模板，
采用 MIT 协议，无需署名。

## 为什么要做这个

Ant Design 每周约有 300 万次 npm 安装，却只有一套官方中后台模板
—— [Ant Design Pro](https://pro.ant.design)。Pro 本身质量很好，但使用它就意味着接受
UmiJS：它的构建脚本就是 `max dev` 与 `max build`。

在 Pro 之下，免费方案相当稀薄。撰写本文时，最活跃的非官方方案只有 273 个 star，
且仍停留在 React 18。

蚁群瞄准的正是中间这块空白：Pro 路由所提供的一切，运行在你已经熟悉的工具链上。

## 包含哪些内容

- **Ant Design Pro 的全部 24 个路由**，命名保持一致
- **8 个 Pro 没有对应实现的页面** —— 看板、日历、收件箱、文件、通知、审计日志、账务、新手引导
- **主题工作室** —— 实时编辑 Design Token，并显示 WCAG 对比度
- **命令面板** —— ⌘K 覆盖全部路由与设置项
- **可视化权限控制** —— 权限矩阵联动菜单、命令面板与路由守卫
- **组件示例页** —— 覆盖全部控件及其真实状态

## 刻意不做的事

- **不使用 UmiJS**，只用 Vite 与 React Router。
- **不使用 ProComponents**，其 npm `latest` 至今仍只声明支持 antd 4/5。
- 依赖树中**不含任何预发布版本**。
- AI 助手页**不引入 `@ant-design/x`** —— 为一个消息列表加输入框付出约 85 kB，
  在体积预算面前并不划算。

## 技术栈

| | |
| --- | --- |
| 构建 | Vite 8（Rolldown） |
| 组件库 | Ant Design 6 |
| 语言 | TypeScript 6，`strict` |
| 路由 | React Router 8 |
| 服务端状态 | TanStack Query 5 |
| 表单 | React Hook Form + Zod 4 |
| 客户端状态 | Zustand 5 |
| 图表 | Recharts 3 |
| 数据模拟 | MSW 2 |
| 国际化 | i18next |
| 测试 | Vitest · Playwright |

TypeScript 选择 6 而非 7，是因为 `typescript-eslint` 在所有 tag 上仍限制为 `<6.1.0`。
对于一个会被大量 fork 的模板来说，开箱即报错的 lint 配置，代价远高于版本落后一个大版本。
