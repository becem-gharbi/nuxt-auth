import { defineNuxtPlugin, addRouteMiddleware, useRuntimeConfig } from "#app";
import useDirectusAuth from "./composables/useDirectusAuth";
import common from "./middleware/common.global";
import auth from "./middleware/auth";
import guest from "./middleware/guest";

export default defineNuxtPlugin(async () => {
  const { directusAuth } = useRuntimeConfig().public;
  const { useAccessToken, useInitialized } = useDirectusAuth();
  const accessToken = useAccessToken();
  const initialized = useInitialized();

  addRouteMiddleware(common);

  addRouteMiddleware("auth", auth, {
    global: directusAuth.enableGlobalAuthMiddleware,
  });

  addRouteMiddleware("guest", guest);

  if (initialized.value) {
    return;
  }

  initialized.value = true;

  const { refresh, fetchUser } = useDirectusAuth();

  await refresh();

  if (accessToken.value) {
    await fetchUser();
  }
});
