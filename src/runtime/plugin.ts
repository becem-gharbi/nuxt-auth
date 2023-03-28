import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useRuntimeConfig,
  useRoute,
} from "#app";
import common from "./middleware/common.global";
import auth from "./middleware/auth";
import guest from "./middleware/guest";
import useAuthSession from "./composables/useAuthSession";

export default defineNuxtPlugin(async () => {
  const publicConfig = useRuntimeConfig().public.auth;

  addRouteMiddleware(common);

  addRouteMiddleware("auth", auth, {
    global: publicConfig.enableGlobalAuthMiddleware,
  });

  addRouteMiddleware("guest", guest);

  const route = useRoute();

  if (
    process.server ||
    localStorage.getItem("loggedIn") === "true" ||
    route.path === publicConfig.redirect.home
  ) {
    const { refresh } = useAuthSession();
    await refresh();
  }
});
