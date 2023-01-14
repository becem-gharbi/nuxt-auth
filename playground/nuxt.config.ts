import { defineNuxtConfig } from "nuxt/config";
import myModule from "..";

export default defineNuxtConfig({
  //@ts-ignore
  modules: [myModule],
  auth: {
    jwtSecret: process.env.AUTH_JWT_SECRET,
    accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.AUTH_REFRESH_TOKEN_SECRET,

    providerIssuerUrl: process.env.AUTH_PROVIDER_ISSUER_URL,
    providerClientId: process.env.AUTH_PROVIDER_CLIENT_ID,
    providerClientSecret: process.env.AUTH_PROVIDER_CLIENT_SECRET,
    providerScope: process.env.AUTH_PROVIDER_SCOPE,

    smtpHost: process.env.AUTH_SMTP_HOST,
    smtpPort: parseInt(process.env.AUTH_SMTP_PORT!),
    smtpUser: process.env.AUTH_SMTP_USER,
    smtpPass: process.env.AUTH_SMTP_PASS,
    smtpFrom: process.env.AUTH_SMTP_FROM,

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
