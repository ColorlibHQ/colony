---
layout: home
hero:
  name: 蚁群
  text: 不绑定框架的 Ant Design 中后台
  tagline: Ant Design Pro 的全部能力，构建在 Vite 与 React Router 之上。不绑定 Umi，不依赖预发布版本。
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/getting-started
    - theme: alt
      text: 对比 Ant Design Pro
      link: /zh/guide/comparison
    - theme: alt
      text: 在线演示
      link: https://colony-demo.colorlib.com
    - theme: alt
      text: GitHub
      link: https://github.com/ColorlibHQ/colony
features:
  - title: 不绑定上层框架
    details: 基于 Vite 8 与 React Router 8。Ant Design Pro 的构建脚本就是 `max dev` 与 `max build`，使用它意味着必须接受 UmiJS —— 蚁群不需要。
  - title: 不依赖预发布版本
    details: ProComponents 在 npm 上的 `latest` 仍然只声明支持 antd 4/5，Pro 通过锁定 beta 版本绕开该问题。蚁群两者都不依赖。
  - title: 真正的双语
    details: 中文与英文同为一等公民。若新增英文文案缺少对应中文，CI 会直接失败；汉字使用独立的字号体系，而非套用拉丁文度量。
  - title: 体积减半
    details: 最重的页面首屏 JS 为 509 kB，Pro 为 1178 kB（均为 gzip 传输值）。CI 中的体积预算保证它不会反弹。
  - title: 主题工作室
    details: 实时调整 Design Token 并导出主题文件，取色器旁直接显示 WCAG 对比度 —— 没有这个数值，正是许多配色最终不可访问的原因。
  - title: 可视化权限
    details: Pro 只提供 `access.ts` 而没有任何界面。这里权限矩阵本身就是一个页面：勾选即时生效，侧边栏、命令面板与路由守卫同步响应。
---
