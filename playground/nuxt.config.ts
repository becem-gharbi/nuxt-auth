import { defineNuxtConfig } from "nuxt/config";
import myModule from "..";

export default defineNuxtConfig({
  //@ts-ignore
  modules: [myModule],

  auth: {
    accessToken: {
      jwtSecret: process.env.AUTH_ACCESS_TOKEN_SECRET || "hqskjd",
      maxAge: 60,
      customClaims: {
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": '["user", "admin"]',
          "x-hasura-default-role": "{{role}}",
          "x-hasura-user-id": "{{id}}",
        },
      },
    },

    refreshToken: {
      jwtSecret: process.env.AUTH_REFRESH_TOKEN_SECRET || "abc",
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
      github: {
        clientId: process.env.AUTH_OAUTH_GITHUB_CLIENT_ID || "",
        clientSecret: process.env.AUTH_OAUTH_GITHUB_CLIENT_SECRET || "",
        scopes: "email profile",
        authorizeUrl: "https://github.com/login/oauth/authorize",
        tokenUrl: "https://github.com/login/oauth/access_token",
        userUrl: "https://api.github.com/user",
      },
    },

    smtp: {
      host: process.env.AUTH_SMTP_HOST || "",
      port: parseInt(process.env.AUTH_SMTP_PORT!),
      user: process.env.AUTH_SMTP_USER || "",
      pass: process.env.AUTH_SMTP_PASS || "",
      from: process.env.AUTH_SMTP_FROM || "",
    },

    baseUrl: "http://localhost:3000",
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
