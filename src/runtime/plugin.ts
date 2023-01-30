import { defineNuxtPlugin, addRouteMiddleware, useRuntimeConfig } from "#app";
import common from "./middleware/common.global";
import auth from "./middleware/auth";
import guest from "./middleware/guest";
import useAuthSession from "./composables/useAuthSession";

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();

  addRouteMiddleware(common);

  addRouteMiddleware("auth", auth, {
    global: config.public.auth.enableGlobalAuthMiddleware,
  });

  addRouteMiddleware("guest", guest);

  if (process.server) {
    const { refresh } = useAuthSession();
    await refresh();
  }
});
