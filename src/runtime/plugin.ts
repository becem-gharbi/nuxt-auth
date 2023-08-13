import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useRuntimeConfig,
  useState,
  useAuth,
  useRoute,
  useAuthSession,
  useNuxtApp,
} from "#imports";
import common from "./middleware/common";
import auth from "./middleware/auth";
import guest from "./middleware/guest";

import type { PublicConfig } from "./types";

export default defineNuxtPlugin(async () => {
  try {
    const publicConfig = useRuntimeConfig().public.auth as PublicConfig;

    addRouteMiddleware("common", common, { global: true });

    addRouteMiddleware("auth", auth, {
      global: publicConfig.enableGlobalAuthMiddleware,
    });

    addRouteMiddleware("guest", guest);

    const initialized = useState("auth-initialized", () => false);

    const { loggedIn } = useAuthSession();

    if (initialized.value === false) {
      const { path } = useRoute();

      const { fetchUser } = useAuth();
      const { refreshToken, accessToken, refresh } = useAuthSession();

      if (accessToken.get()) {
        await fetchUser();
      } else {
        const isCallback = path === publicConfig.redirect.callback;
        const isLoggedIn = loggedIn.get() === "true";

        if (isCallback || isLoggedIn || refreshToken.get()) {
          await refresh();
          if (accessToken.get()) {
            await fetchUser();
          }
        }
      }
    }

    initialized.value = true;

    const { useUser } = useAuthSession();

    if (useUser().value) {
      loggedIn.set(true);
      const { callHook } = useNuxtApp();
      await callHook("auth:loggedIn", true);
    } else {
      loggedIn.set(false);
    }
  } catch (e) {
    console.log(e);
  }
});
