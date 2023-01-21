import { defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from "#app";
import useAuth from "../composables/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  const publicConfig = useRuntimeConfig().public.auth;

  if (
    to.path === publicConfig.redirect.login ||
    to.path === publicConfig.redirect.callback
  ) {
    const { useAccessToken } = useAuth();

    if (useAccessToken().value) {
      return navigateTo(publicConfig.redirect.home);
    }
  }
});
