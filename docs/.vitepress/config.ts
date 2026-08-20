import { defineConfig } from 'vitepress';

/**
 * Bilingual documentation.
 *
 * VitePress 1.6.4 — the stable line, not the 2.0 alpha. Shipping a prerelease
 * here would be hard to square with a project whose central claim is that
 * Ant Design Pro depends on one.
 *
 * It is also what the Chinese admin-template ecosystem documents with, so the
 * navigation and search behave the way that audience already expects.
 */
export default defineConfig({
  title: 'Colony',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: false,

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#1677ff' }],
  ],

  // The docs are the canonical site, so they carry the sitemap. The demo is a
  // separate host and is deliberately left out of the index.
  sitemap: { hostname: 'https://colony.colorlib.com' },

  // English and Chinese are peers under their own prefixes. Neither is the
  // "translation" of the other, and neither sits at the bare root.
  locales: {
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      description:
        'A free React admin dashboard on Ant Design v6 — without the meta-framework.',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'vs Ant Design Pro', link: '/en/guide/comparison' },
          { text: 'Demo', link: 'https://colony-demo.colorlib.com' },
        ],
        sidebar: {
          '/en/': [
            {
              text: 'Getting started',
              items: [
                { text: 'Introduction', link: '/en/guide/introduction' },
                { text: 'Installation', link: '/en/guide/getting-started' },
                { text: 'Project structure', link: '/en/guide/structure' },
              ],
            },
            {
              text: 'Core concepts',
              items: [
                { text: 'Theming', link: '/en/guide/theming' },
                { text: 'Internationalisation', link: '/en/guide/i18n' },
                { text: 'Access control', link: '/en/guide/access-control' },
                { text: 'Data table', link: '/en/guide/data-table' },
              ],
            },
            {
              text: 'Shipping',
              items: [
                { text: 'Connecting an API', link: '/en/guide/api' },
                { text: 'Deployment', link: '/en/guide/deployment' },
                { text: 'vs Ant Design Pro', link: '/en/guide/comparison' },
              ],
            },
          ],
        },
        editLink: {
          pattern: 'https://github.com/ColorlibHQ/colony/edit/main/docs/:path',
          text: 'Edit this page on GitHub',
        },
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2026 Colorlib',
        },
      },
    },

    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      description: '基于 Ant Design v6 的免费 React 中后台模板 —— 不绑定上层框架。',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh/guide/getting-started' },
          { text: '对比 Ant Design Pro', link: '/zh/guide/comparison' },
          { text: '在线演示', link: 'https://colony-demo.colorlib.com' },
        ],
        sidebar: {
          '/zh/': [
            {
              text: '开始',
              items: [
                { text: '简介', link: '/zh/guide/introduction' },
                { text: '安装', link: '/zh/guide/getting-started' },
                { text: '目录结构', link: '/zh/guide/structure' },
              ],
            },
            {
              text: '核心概念',
              items: [
                { text: '主题', link: '/zh/guide/theming' },
                { text: '国际化', link: '/zh/guide/i18n' },
                { text: '权限控制', link: '/zh/guide/access-control' },
                { text: '数据表格', link: '/zh/guide/data-table' },
              ],
            },
            {
              text: '上线',
              items: [
                { text: '接入接口', link: '/zh/guide/api' },
                { text: '部署', link: '/zh/guide/deployment' },
                { text: '对比 Ant Design Pro', link: '/zh/guide/comparison' },
              ],
            },
          ],
        },
        editLink: {
          pattern: 'https://github.com/ColorlibHQ/colony/edit/main/docs/:path',
          text: '在 GitHub 上编辑此页',
        },
        docFooter: { prev: '上一页', next: '下一页' },
        outline: { label: '本页目录' },
        lastUpdated: { text: '最后更新于' },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        footer: {
          message: '基于 MIT 协议发布',
          copyright: 'Copyright © 2026 Colorlib',
        },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ColorlibHQ/colony' },
    ],
    search: { provider: 'local' },
  },
});
