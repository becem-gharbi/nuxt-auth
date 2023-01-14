import { defineNuxtConfig } from "nuxt/config";
import myModule from "..";

export default defineNuxtConfig({
  //@ts-ignore
  modules: [myModule],
  auth: {
    jwtSecret: process.env.AUTH_JWT_SECRET,
    accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.AUTH_REFRESH_TOKEN_SECRET,

    oauthClientId: process.env.AUTH_PROVIDER_CLIENT_ID,
    oauthClientSecret: process.env.AUTH_PROVIDER_CLIENT_SECRET,
    oauthAuthorizeUrl: "https://accounts.google.com/o/oauth2/auth",
    oauthGetTokenUrl: "https://accounts.google.com/o/oauth2/token",
    oauthGetUserUrl: "https://www.googleapis.com/oauth2/v3/userinfo",

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
