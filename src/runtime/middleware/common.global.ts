import { defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from "#app";
import useDirectusAuth from "../composables/useDirectusAuth";

export default defineNuxtRouteMiddleware((to) => {
  const { directusAuth } = useRuntimeConfig().public;

  if (
    to.path === directusAuth.redirect.login ||
    to.path === directusAuth.redirect.callback
  ) {
    const { useUser } = useDirectusAuth();
    const user = useUser();

    if (user.value) {
      return navigateTo(directusAuth.redirect.home);
    }
  }
});
