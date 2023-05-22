import { defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from "#app";
import useAuthSession from "../composables/useAuthSession";

/**
 * Handles redirects when hitting a protected page
 */
export default defineNuxtRouteMiddleware((to, from) => {
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

  const { useAccessToken } = useAuthSession();

  const accessToken = useAccessToken();

  if (!accessToken.value) {
    return navigateTo({
      path: publicConfig.redirect.login,
      query: { redirect: from.path },
    });
  }
});
