import { defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from "#app";
import useAuthSession from "../composables/useAuthSession";

export default defineNuxtRouteMiddleware((to, from) => {
  const publicConfig = useRuntimeConfig().public.auth;

  if (
    to.path === publicConfig.redirect.login ||
    to.path === publicConfig.redirect.callback
  ) {
    console.log("hit common mdw");

    const { useAccessToken } = useAuthSession();

    const accessToken = useAccessToken();

    if (accessToken.value) {
      // The protected page the user has visited before redirect to login page
      const returnToPath = from.query.redirect?.toString();

      return navigateTo(returnToPath || publicConfig.redirect.home);
    }
  }
});
