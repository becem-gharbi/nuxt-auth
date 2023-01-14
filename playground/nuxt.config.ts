import { defineNuxtConfig } from "nuxt/config";
import myModule from "..";

export default defineNuxtConfig({
  //@ts-ignore
  modules: [myModule],
  auth: {
    jwtSecret: process.env.AUTH_JWT_SECRET,
    googleClientId: process.env.AUTH_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    smtpHost: process.env.AUTH_SMTP_HOST,
    smtpPort: process.env.AUTH_SMTP_PORT,
    smtpUser: process.env.AUTH_SMTP_USER,
    smtpPass: process.env.AUTH_SMTP_PASS,
    smtpFrom: process.env.AUTH_SMTP_FROM,
    accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.AUTH_REFRESH_TOKEN_SECRET,

    baseUrl: "http://localhost:3000",
    enableGlobalAuthMiddleware: false,
    refreshTokenCookieName: "directus_refresh_token",
    redirect: {
      login: "/auth/login",
      logout: "/auth/login",
      home: "/home",
      callback: "/auth/callback",
      resetPassword: "/auth/reset-password",
    },
  },
});
