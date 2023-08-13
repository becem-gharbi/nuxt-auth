import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo,
  useAuthSession,
} from "#imports";

import type { PublicConfig } from "../types";

export default defineNuxtRouteMiddleware((to) => {
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig;

  if (
    to.path === publicConfig.redirect.login ||
    to.path === publicConfig.redirect.callback
  ) {
    return;
  }

  const { useUser } = useAuthSession();

  if (useUser().value) {
    return navigateTo(publicConfig.redirect.home);
  }
});
