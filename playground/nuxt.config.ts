import { defineNuxtConfig } from "nuxt/config";
import myModule from "..";

export default defineNuxtConfig({
  //@ts-ignore
  modules: [myModule],
  directusAuth: {
    enableGlobalAuthMiddleware: false,
    nuxtBaseUrl: "http://localhost:3000",
    defaultRoleId: "3e520b3b-c173-4d6a-988a-c5abfedd0c2e",
    redirect: {
      home: "/home",
      login: "/auth/login",
      logout: "/auth/login",
      resetPassword: "/auth/reset-password",
    },
  },
});
