import { defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from "#app";
import useAuthSession from "../composables/useAuthSession";

export default defineNuxtRouteMiddleware((to) => {
  const publicConfig = useRuntimeConfig().public.auth;

  if (
    to.path === publicConfig.redirect.login ||
    to.path === publicConfig.redirect.callback
  ) {
    return;
  }

  const { useAccessToken } = useAuthSession();

  const accessToken = useAccessToken();

  if (accessToken.value) {
    return navigateTo(publicConfig.redirect.home);
  }
});
