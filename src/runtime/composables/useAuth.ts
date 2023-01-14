import jwt_decode from "jwt-decode";

import type { Ref } from "vue";

import { appendHeader } from "h3";

import type {
  ResponseLogin,
  AuthProvider,
  ResponseRefresh,
  User,
} from "../types";

import {
  useRuntimeConfig,
  useRoute,
  navigateTo,
  useState,
  useRequestEvent,
  useRequestHeaders,
} from "#app";

export default function () {
  const config = useRuntimeConfig();
  const useInitialized: () => Ref<boolean> = () =>
    useState("directus_auth_initialized", () => false);
  const useUser: () => Ref<User | null> = () =>
    useState<User | null>("directus_auth_user", () => null);
  const useAccessToken: () => Ref<string | null> = () =>
    useState<string | null>("directus_auth_access_token", () => null);
  const event = useRequestEvent();
  const route = useRoute();

  function isAccessTokenExpired() {
    const accessToken = useAccessToken();
    if (accessToken.value) {
      const decoded = jwt_decode(accessToken.value) as { exp: number };
      const expires = decoded.exp * 1000;
      return expires < Date.now();
    }
    return true;
  }

  async function login(credentials: { email: string; password: string }) {
    const accessToken = useAccessToken();
    return useFetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      body: {
        email: credentials.email,
        password: credentials.password,
      },
    }).then(async (res) => {
      if (res.data.value) {
        accessToken.value = res.data.value.accessToken;
        await fetchUser();
        await navigateTo(config.public.auth.redirect.home);
      }
      return res;
    });
  }

  async function loginWithProvider(provider: AuthProvider) {
    const redirectUrl = getRedirectUrl(config.public.auth.redirect.callback);

    if (process.client) {
      window.location.replace(
        `/auth/login/${provider}?redirect=${redirectUrl}`
      );
    }
  }

  async function refresh() {
    let cookie: string | undefined;
    const accessToken = useAccessToken();

    try {
      if (process.server) {
        const headers = useRequestHeaders(["Cookie"]);
        cookie = headers.cookie;

        if (
          !cookie ||
          !cookie.includes(config.public.auth.refreshTokenCookieName)
        ) {
          accessToken.value = null;
          return;
        }
      }

      const res = await $fetch.raw<{ accessToken: string }>(
        "/api/auth/refresh",
        {
          method: "POST",
          credentials: "include",
          headers: cookie ? { cookie } : {},
        }
      );

      if (process.server) {
        const cookie = res.headers.get("set-cookie") || "";
        appendHeader(event, "set-cookie", cookie);
      }

      accessToken.value = res._data?.accessToken || null;
    } catch (error) {
      accessToken.value = null;
    }
  }

  async function fetchUser() {
    const accessToken = useAccessToken();
    const user = useUser();

    if (!accessToken.value) {
      user.value = null;
      return;
    }

    if (isAccessTokenExpired()) {
      await refresh();
      if (!accessToken.value) {
        await logout();
        return;
      }
    }

    try {
      const res = await $fetch<any>("/api/auth/me", {
        headers: {
          Authorization: "Bearer " + accessToken.value,
        },
      });

      user.value = res;
    } catch (error) {
      user.value = null;
    }
  }

  async function logout() {
    const accessToken = useAccessToken();
    const user = useUser();

    if (accessToken.value) {
      await $fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      accessToken.value = null;
    }

    user.value = null;
    await navigateTo(config.public.auth.redirect.logout);
  }

  function register(user: User) {
    return useFetch("/api/auth/register", {
      method: "POST",
      body: user,
    });
  }

  function getRedirectUrl(path: string) {
    return config.public.auth.baseUrl + path;
  }

  async function requestPasswordReset(email: string) {
    return useFetch<void>("/auth/password/request", {
      method: "POST",
      body: {
        email,
        reset_url: getRedirectUrl(config.public.auth.redirect.resetPassword),
      },
    });
  }

  async function resetPassword(password: string) {
    return useFetch<void>("/auth/password/reset", {
      method: "POST",
      body: {
        password,
        token: route.query.token,
      },
    });
  }

  return {
    useInitialized,
    useUser,
    useAccessToken,
    login,
    loginWithProvider,
    refresh,
    fetchUser,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    isAccessTokenExpired,
  };
}
