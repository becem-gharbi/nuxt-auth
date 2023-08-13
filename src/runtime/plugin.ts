import { defineNuxtPlugin, addRouteMiddleware, useRuntimeConfig } from "#app";
import common from "./middleware/common.global";
import auth from "./middleware/auth";
import guest from "./middleware/guest";

export default defineNuxtPlugin(async () => {
  const publicConfig = useRuntimeConfig().public.auth;

  addRouteMiddleware(common);

  addRouteMiddleware("auth", auth, {
    global: publicConfig.enableGlobalAuthMiddleware,
  });

  addRouteMiddleware("guest", guest);
});
