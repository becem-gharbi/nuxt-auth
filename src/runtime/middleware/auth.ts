import { defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from "#app";
import useAuthSession from "../composables/useAuthSession";

export default defineNuxtRouteMiddleware(async (to) => {
  const publicConfig = useRuntimeConfig().public.auth;

  if (
    to.path === publicConfig.redirect.login ||
    to.path === publicConfig.redirect.callback
  ) {
    return;
  }

  if (publicConfig.enableGlobalAuthMiddleware === true) {
    if (to.meta.auth === false) {
      return;
    }
  }

  const { getAccessToken } = useAuthSession();

  const accessToken = await getAccessToken();

  if (!accessToken) {
    return navigateTo(publicConfig.redirect.login);
  }
});
