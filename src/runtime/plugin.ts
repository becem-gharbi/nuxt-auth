import { defineNuxtPlugin, addRouteMiddleware, useRuntimeConfig } from "#app";
import useAuth from "../runtime/composables/useAuth";
import common from "./middleware/common.global";
import auth from "./middleware/auth";
import guest from "./middleware/guest";

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();

  addRouteMiddleware(common);

  addRouteMiddleware("auth", auth, {
    global: config.public.auth.enableGlobalAuthMiddleware,
  });

  addRouteMiddleware("guest", guest);

  if (process.server) {
    const { refresh, useAccessToken } = useAuth();
    await refresh();

    //console.log("after plugin refresh", useAccessToken().value);
  }
});
