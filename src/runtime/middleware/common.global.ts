import { defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from "#app";
import useAuth from "../composables/useAuth";

export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig();

  if (
    to.path === config.public.auth.redirect.login ||
    to.path === config.public.auth.redirect.callback
  ) {
    const { useUser } = useAuth();
    const user = useUser();

    if (user.value) {
      return navigateTo(config.public.auth.redirect.home);
    }
  }
});
