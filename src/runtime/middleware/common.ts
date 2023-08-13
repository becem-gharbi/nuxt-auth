import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo,
  useAuthSession,
} from "#imports";

import type { PublicConfig } from "../types";

export default defineNuxtRouteMiddleware((to, from) => {
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig;

  if (
    to.path === publicConfig.redirect.login ||
    to.path === publicConfig.redirect.callback
  ) {
    const { useUser } = useAuthSession();

    if (useUser().value) {
      const returnToPath = from.query.redirect?.toString();
      const redirectTo = returnToPath || publicConfig.redirect.home;
      return navigateTo(redirectTo);
    }
  }
});
