import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Element Plus Pro Docs",
  description: "Element Plus Pro Docs",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components/index' },
      { text: 'Hooks', link: '/hooks/index' }
    ],

    sidebar: [
      {
        text: 'Components',
        items: [
          { text: 'Index', link: '/components/index' },
          { text: 'useRemoteQueue', link: '/components/useRemoteQueue/index' }
        ]
      },
      {
        text: 'Hooks',
        items: [
          { text: 'Index', link: '/hooks/index' },
          { text: 'useRemoteCache', link: '/components/useRemoteCache/index' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ysh83737/element-plus-pro' }
    ]
  }
})
