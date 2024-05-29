export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  imports: {
    autoImport: true,
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600&display=swap',
        },
      ],
    },
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mdc: {
    highlight: {
      langs: ['prisma', 'ts', 'vue', 'js'],
    },
  },
})
