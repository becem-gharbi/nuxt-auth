import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Nuxt Auth',
  description: 'A fairly complete solution to handle authentication for Nuxt',
  themeConfig: {
    logo: '/logo.png',

    search: {
      provider: 'local',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/becem-gharbi/nuxt-auth' },
    ],
  },
})
