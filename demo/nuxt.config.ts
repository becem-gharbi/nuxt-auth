// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  ssr: true,

  modules: ['@bg-dev/nuxt-auth'],

  nitro: { preset: process.env.NITRO_PRESET },

  auth: {
    baseUrl: process.env.AUTH_BASE_URL,

    accessToken: {
      jwtSecret: process.env.AUTH_ACCESS_TOKEN_SECRET!
    },

    refreshToken: {
      jwtSecret: process.env.AUTH_REFRESH_TOKEN_SECRET!
    },

    oauth: {
      google: {
        clientId: process.env.AUTH_OAUTH_GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.AUTH_OAUTH_GOOGLE_CLIENT_SECRET || '',
        scopes: 'email profile',
        authorizeUrl: 'https://accounts.google.com/o/oauth2/auth',
        tokenUrl: 'https://accounts.google.com/o/oauth2/token',
        userUrl: 'https://www.googleapis.com/oauth2/v3/userinfo'
      }
    },

    registration: {
      defaultRole: 'user',
      requireEmailVerification: false
    },

    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      home: '/home',
      callback: '/auth/callback',
      passwordReset: '/auth/password-reset',
      emailVerify: '/auth/email-verify'
    },

    email: {
      from: process.env.AUTH_EMAIL_FROM!,
      provider: {
        name: 'sendgrid',
        apiKey: process.env.AUTH_EMAIL_SENDGRID_API_KEY!
      }
    },

    prisma: {
      datasourceUrl: process.env.DATABASE_URL // cloudflare
    }
  }
})
