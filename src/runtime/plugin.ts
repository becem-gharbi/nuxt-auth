import { defineNuxtPlugin, addRouteMiddleware, useRuntimeConfig } from "#app";
import useAuth from "../runtime/composables/useAuth";
import common from "./middleware/common.global";
import auth from "./middleware/auth";
import guest from "./middleware/guest";

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();
  const { useAccessToken, useInitialized } = useAuth();
  const accessToken = useAccessToken();
  const initialized = useInitialized();

  addRouteMiddleware(common);

  addRouteMiddleware("auth", auth, {
    global: config.public.auth.enableGlobalAuthMiddleware,
  });

  addRouteMiddleware("guest", guest);

  if (initialized.value) {
    return;
  }

  initialized.value = true;

  const { refresh, fetchUser } = useAuth();

  await refresh();

  if (accessToken.value) {
    await fetchUser();
  }
});
