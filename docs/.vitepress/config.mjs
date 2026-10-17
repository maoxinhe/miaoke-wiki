import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '喵科大服务站',
  description: '团队运维手册 · 基础问题解答 · AI 知识库',
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#2b5fa8' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
  ],

  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: '喵科大服务站',
    outline: { label: '本页目录', level: [2, 3] },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    lastUpdated: { text: '最后更新于', formatOptions: { dateStyle: 'short', timeStyle: 'short' } },
    docFooter: { prev: '上一篇', next: '下一篇' },
    editLink: {
      pattern: 'https://github.com/YOUR_ORG/miaoke-wiki/edit/main/docs/:path',
      text: '编辑此页 · 完善本站'
    },

    nav: [
      { text: '首页', link: '/' },
      {
        text: '运维手册',
        items: [
          { text: '总览', link: '/运维手册/' },
          { text: '服务器与系统', link: '/运维手册/服务器与系统' },
          { text: '部署与发布', link: '/运维手册/部署与发布' },
          { text: '监控与告警', link: '/运维手册/监控与告警' },
          { text: '数据库与存储', link: '/运维手册/数据库与存储' },
          { text: '网络与安全', link: '/运维手册/网络与安全' },
          { text: '故障排查手册', link: '/运维手册/故障排查' },
          { text: '备份与恢复', link: '/运维手册/备份与恢复' }
        ]
      },
      {
        text: '基础问题解答',
        items: [
          { text: '总览', link: '/基础问题解答/' },
          { text: '账号与权限', link: '/基础问题解答/账号与权限' },
          { text: '软件与工具', link: '/基础问题解答/软件与工具' },
          { text: '网络与连接', link: '/基础问题解答/网络与连接' },
          { text: '常见报错', link: '/基础问题解答/常见报错' },
          { text: '其他问题', link: '/基础问题解答/其他问题' }
        ]
      },
      {
        text: 'AI 知识库',
        items: [
          { text: '总览', link: '/AI知识库/' },
          { text: '入门与概念', link: '/AI知识库/入门与概念' },
          { text: '工具与平台', link: '/AI知识库/工具与平台' },
          { text: '提示词工程', link: '/AI知识库/提示词工程' },
          { text: 'API 与集成', link: '/AI知识库/API与集成' },
          { text: '案例与模板', link: '/AI知识库/案例与模板' },
          { text: '最佳实践与合规', link: '/AI知识库/最佳实践与合规' }
        ]
      },
      { text: '参与贡献', link: '/贡献指南' }
    ],

    sidebar: {
      '/运维手册/': [
        {
          text: '运维手册',
          collapsed: false,
          items: [
            { text: '总览', link: '/运维手册/' },
            { text: '服务器与系统', link: '/运维手册/服务器与系统' },
            { text: '部署与发布', link: '/运维手册/部署与发布' },
            { text: '监控与告警', link: '/运维手册/监控与告警' },
            { text: '数据库与存储', link: '/运维手册/数据库与存储' },
            { text: '网络与安全', link: '/运维手册/网络与安全' },
            { text: '故障排查手册', link: '/运维手册/故障排查' },
            { text: '备份与恢复', link: '/运维手册/备份与恢复' }
          ]
        }
      ],
      '/基础问题解答/': [
        {
          text: '基础问题解答',
          collapsed: false,
          items: [
            { text: '总览', link: '/基础问题解答/' },
            { text: '账号与权限', link: '/基础问题解答/账号与权限' },
            { text: '软件与工具', link: '/基础问题解答/软件与工具' },
            { text: '网络与连接', link: '/基础问题解答/网络与连接' },
            { text: '常见报错', link: '/基础问题解答/常见报错' },
            { text: '其他问题', link: '/基础问题解答/其他问题' }
          ]
        }
      ],
      '/AI知识库/': [
        {
          text: 'AI 知识库',
          collapsed: false,
          items: [
            { text: '总览', link: '/AI知识库/' },
            { text: '入门与概念', link: '/AI知识库/入门与概念' },
            { text: '工具与平台', link: '/AI知识库/工具与平台' },
            { text: '提示词工程', link: '/AI知识库/提示词工程' },
            { text: 'API 与集成', link: '/AI知识库/API与集成' },
            { text: '案例与模板', link: '/AI知识库/案例与模板' },
            { text: '最佳实践与合规', link: '/AI知识库/最佳实践与合规' }
          ]
        }
      ]
    },

    footer: {
      message: '喵科大服务站 · 团队内部知识库，仅限授权成员访问',
      copyright: 'Copyright © 2026 喵科大团队'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '未找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    }
  },

  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    lineNumbers: true
  }
})
