// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["@/assets/fonts/gellix/style.css"],
  
  modules: ["@bg-dev/nuxt-auth", "@nuxtjs/tailwindcss", "@bg-dev/nuxt-naiveui"],

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      title: "Nuxt Auth",
      htmlAttrs: {
        lang: "en",
      },
    },
  },

  tailwindcss: {
    viewer: false,
  },

  naiveui: {
    themeConfig: {
      shared: {
        common: {
          fontFamily: "Gellix",
        },
      },
    },
  },

  auth: {
    registration: {
      defaultRole: "user",
      requireEmailVerification: false,
    },

    accessToken: {
      jwtSecret: process.env.AUTH_ACCESS_TOKEN_SECRET || "abc",
    },

    refreshToken: {
      jwtSecret: process.env.AUTH_REFRESH_TOKEN_SECRET || "efg",
    },

    baseUrl: process.env.BASE_URL || "http://localhost:3000",
    enableGlobalAuthMiddleware: false,

    redirect: {
      home: "/home",
      login: "/auth/login",
      logout: "/auth/login",
      passwordReset: "/auth/reset-password",
      callback: "/auth/callback",
      emailVerify: "/auth/verify-email",
    },
    oauth: {
      google: {
        clientId: process.env.AUTH_OAUTH_GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.AUTH_OAUTH_GOOGLE_CLIENT_SECRET || "",
        scopes: "email profile",
        authorizeUrl: "https://accounts.google.com/o/oauth2/auth",
        tokenUrl: "https://accounts.google.com/o/oauth2/token",
        userUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
    },
    smtp: {
      from: process.env.AUTH_SMTP_FROM || "",
      host: process.env.AUTH_SMTP_HOST || "",
      port: parseInt(process.env.AUTH_SMTP_PORT || ""),
      pass: process.env.AUTH_SMTP_PASS || "",
      user: process.env.AUTH_SMTP_USER || "",
    },
  },

  vite: {
    server: {
      fs: {
        allow: ["../package"],
      },
    },
  },
});
