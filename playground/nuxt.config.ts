import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../src/module'],

  ssr: process.env.NUXT_SSR !== 'false',

  app: {
    head: {
      title: 'Nuxt Auth',
    },
  },

  compatibilityDate: '2025-02-21',

  auth: {
    baseUrl: 'http://localhost:3000',

    accessToken: {
      jwtSecret: '',
      maxAge: 14,
      customClaims: {
        'https://hasura.io/jwt/claims': {
          'x-hasura-allowed-roles': ['user', 'admin'],
          'x-hasura-default-role': '{{role}}',
          'x-hasura-user-id': '{{id}}',
        },
      },
    },

    refreshToken: {
      jwtSecret: '',
    },

    oauth: {
      google: {
        clientId: '',
        clientSecret: '',
        scopes: 'email profile',
        authorizeUrl: 'https://accounts.google.com/o/oauth2/auth',
        tokenUrl: 'https://accounts.google.com/o/oauth2/token',
        userUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
      },
      // github: {
      //   clientId: '',
      //   clientSecret: '',
      //   scopes: 'user:email',
      //   authorizeUrl: 'https://github.com/login/oauth/authorize',
      //   tokenUrl: 'https://github.com/login/oauth/access_token',
      //   userUrl: 'https://api.github.com/user',
      // },
    },

    registration: {
      defaultRole: 'user',
      requireEmailVerification: false,
    },

    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      home: '/home',
      callback: '/auth/callback',
      passwordReset: '/auth/password-reset',
      emailVerify: '/auth/email-verify',
    },
  },
})
