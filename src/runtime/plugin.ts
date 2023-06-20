import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useRuntimeConfig,
  useRoute,
  useNuxtApp,
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

  const { refresh, useAccessToken } = useAuthSession();

  const accessToken = useAccessToken();

  const nuxtApp = useNuxtApp();

  if (
    process.client &&
    route.path !== publicConfig.redirect.callback &&
    !accessToken.value
  ) {
    return;
  }

  await refresh();

  if (accessToken.value) {
    await nuxtApp.callHook("auth:loggedIn", true);
  }
});
