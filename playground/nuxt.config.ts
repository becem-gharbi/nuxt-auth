import { defineNuxtConfig } from "nuxt/config";
import myModule from "..";

export default defineNuxtConfig({
  //@ts-ignore
  modules: [myModule],
  auth: {
    accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.AUTH_REFRESH_TOKEN_SECRET,

    oauth: {
      google: {
        clientId: process.env.AUTH_OAUTH_GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.AUTH_OAUTH_GOOGLE_CLIENT_SECRET || "",
        scopes: "email profile",
        authorizeUrl: "https://accounts.google.com/o/oauth2/auth",
        getTokenUrl: "https://accounts.google.com/o/oauth2/token",
        getUserUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
      github: {
        clientId: process.env.AUTH_OAUTH_GITHUB_CLIENT_ID || "",
        clientSecret: process.env.AUTH_OAUTH_GITHUB_CLIENT_SECRET || "",
        scopes: "email profile",
        authorizeUrl: "https://github.com/login/oauth/authorize",
        getTokenUrl: "https://github.com/login/oauth/access_token",
        getUserUrl: "https://api.github.com/user",
      },
    },

    smtpHost: process.env.AUTH_SMTP_HOST,
    smtpPort: parseInt(process.env.AUTH_SMTP_PORT!),
    smtpUser: process.env.AUTH_SMTP_USER,
    smtpPass: process.env.AUTH_SMTP_PASS,
    smtpFrom: process.env.AUTH_SMTP_FROM,

    baseUrl: "http://localhost:3000",
    enableGlobalAuthMiddleware: false,
    refreshTokenCookieName: "auth_refresh_token",
    redirect: {
      login: "/auth/login",
      logout: "/auth/login",
      home: "/home",
      callback: "/auth/callback",
      passwordReset: "/auth/password-reset",
      emailVerify: "/auth/email-verify",
    },
  },
});
