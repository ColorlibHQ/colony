# 主题

Ant Design v6 默认启用 CSS 变量。正因如此，实时编辑 Token 才真正可行 ——
在 v5 的 CSS-in-JS 下，每次修改都意味着重新计算整份样式表。

## 两套 Token，各司其职

| | 负责 | 位置 |
| --- | --- | --- |
| antd Token | 组件配色、圆角、控件高度 | `src/config/theme/index.ts`，通过 `ConfigProvider` |
| 蚁群 Token | 框架布局：间距、阴影层级、排版 | `src/styles/tokens.css` |

两者并列存在，而非互相包裹。antd 已经建模的部分通过 `ConfigProvider` 配置；
只有框架自身需要的部分才使用 CSS 变量。

## 预设

`src/config/theme/presets.ts` 中内置了 6 套。每套只是一组种子值，其余由 antd 推导：

```ts
{
  id: 'jade',
  labelKey: 'theme.preset.jade',
  colorPrimary: '#2f7d62',
  colorPrimaryDark: '#4ea183', // 浅色主色直接用于深色底通常并不成立
  borderRadius: 8,
}
```

之所以需要 `colorPrimaryDark`，是因为把浅色模式的主色照搬到深色背景上，
是最典型的对比度问题。

## 三种颜色模式状态

这一点经常被误解，值得说清楚。用户侧有**三种**状态，而不是两种：

```css
:root { /* 完整的浅色调色板 */ }

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) { /* 仅覆盖 Token */ }
}

:root[data-theme='dark'] { /* 再次覆盖 Token */ }
```

「跟随系统」模式刻意**不写入** `data-theme` 属性，正是这一点让媒体查询保持权威。
切勿只在媒体查询或 `[data-theme]` 块内定义某个颜色 —— 在未标记状态下它不会生效，
页面就会出现一种主题的文字配另一种主题的背景。

`index.html` 中有一段阻塞脚本，会在首次绘制前写入已保存的偏好。
没有它，页面会先以默认主题渲染一帧再突然切换。

## 主题工作室

`/theme-studio` 直接编辑应用真实的偏好存储，因此侧边栏与顶栏会随预览一起变化 ——
不存在会与真实主题脱节的沙盒副本。取色器旁会显示 WCAG 对比度。

值得注意：**antd 默认蓝在白底上的对比度是 4.10:1**。用于大号文字和界面分隔线没问题，
作为正文颜色则达不到 AA。

导出会生成可直接提交的 `theme.ts`：

```ts
import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: { colorPrimary: '#2f7d62', borderRadius: 8 },
};
```

## 密度

三档 —— `comfortable`、`compact`、`condensed`，由根节点上的 `data-density` 驱动。
企业用户通常偏好极简档，而宣传截图更适合宽松档。
