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
        text: 'Getting Started',
        base: '/getting-started',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Data integration', link: '/data-integration' },
          { text: 'Adapters', link: '/adapters' },
        ],
      },
      {
        text: 'Configuration',
        base: '/configuration',
        items: [
          { text: 'Tokens', link: '/tokens' },
          { text: 'OAuth', link: '/oauth' },
          { text: 'Registration', link: '/registration' },
          { text: 'Email', link: '/email' },
          { text: 'Redirection', link: '/redirection' },
        ],
      },
      {
        text: 'Usage',
        base: '/usage',
        items: [
          { text: 'Composables', link: '/composables' },
          { text: 'Middleware', link: '/middleware' },
          { text: 'Hooks', link: '/hooks' },
          { text: 'Utils', link: '/utils' },
        ],
      },
      {
        text: 'Upgrades',
        base: '/upgrades',
        items: [
          { text: 'V3', link: '/v3' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/becem-gharbi/nuxt-auth' },
    ],
  },
})
