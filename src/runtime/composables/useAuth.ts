import { resolveURL, withQuery } from "ufo";
import {
  useRuntimeConfig,
  useRoute,
  useFetch,
  useAuthSession,
  useAuthFetch,
  navigateTo,
  clearNuxtData,
  useNuxtApp,
} from "#imports";

import type { User, Provider, PublicConfig } from "../types";
import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";
import type { H3Error } from "h3";

type FetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export default function () {
  const { user } = useAuthSession();
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig;
  const { _accessToken, _loggedIn } = useAuthSession();

  /**
   * Login with email/password
   */
  async function login(credentials: {
    email: string;
    password: string;
  }): FetchReturn<{ accessToken: string }> {
    const route = useRoute();
    const { callHook } = useNuxtApp();

    return useFetch("/api/auth/login", {
      method: "POST",
      body: {
        email: credentials.email,
        password: credentials.password,
      },
    }).then(async (res) => {
      if (!res.error.value && res.data.value) {
        const returnToPath = route.query.redirect?.toString();
        const redirectTo = returnToPath || publicConfig.redirect.home;

        _accessToken.set(res.data.value.accessToken);
        _loggedIn.set(true);

        // A workaround to insure access token cookie is set
        setTimeout(async () => {
          await fetchUser();
          await callHook("auth:loggedIn", true);
          await navigateTo(redirectTo);
        }, 100);
      }

      return res;
    });
  }

  /**
   * Login via oauth provider
   */
  function loginWithProvider(provider: Provider): void {
    if (process.client) {
      const route = useRoute();

      // The protected page the user has visited before redirect to login page
      const returnToPath = route.query.redirect?.toString();

      let redirectUrl = resolveURL("/api/auth/login", provider);

      redirectUrl = withQuery(redirectUrl, { redirect: returnToPath });

      window.location.replace(redirectUrl);
    }
  }

  /**
   * Fetch active user, usefull to update `user` state
   */
  async function fetchUser(): Promise<void> {
    try {
      user.value = await useAuthFetch<User>("/api/auth/me");
    } catch (e) {
      user.value = null;
    }
  }

  async function logout(): Promise<void> {
    const { callHook } = useNuxtApp();

    await callHook("auth:loggedIn", false);

    await $fetch("/api/auth/logout", {
      baseURL: publicConfig.baseUrl,
      method: "POST",
    }).finally(async () => {
      _accessToken.clear();
      _loggedIn.set(false);
      user.value = null;
      clearNuxtData();
      await navigateTo(publicConfig.redirect.logout);
    });
  }

  async function register(userInfo: {
    email: string;
    password: string;
    name: string;
  }): FetchReturn<void> {
    return useFetch("/api/auth/register", {
      method: "POST",
      body: userInfo,
      credentials: "omit",
    });
  }

  async function requestPasswordReset(email: string): FetchReturn<void> {
    return useFetch("/api/auth/password/request", {
      method: "POST",
      credentials: "omit",
      body: {
        email,
      },
    });
  }

  async function resetPassword(password: string): FetchReturn<void> {
    const route = useRoute();

    return useFetch("/api/auth/password/reset", {
      method: "PUT",
      credentials: "omit",
      body: {
        password: password,
        token: route.query.token,
      },
    });
  }

  async function requestEmailVerify(email: string): FetchReturn<void> {
    return useFetch("/api/auth/email/request", {
      method: "POST",
      credentials: "omit",
      body: {
        email,
      },
    });
  }

  async function changePassword(input: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    return useAuthFetch("/api/auth/password/change", {
      method: "PUT",
      body: {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      },
    });
  }

  return {
    login,
    loginWithProvider,
    fetchUser,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    requestEmailVerify,
    changePassword,
  };
}
