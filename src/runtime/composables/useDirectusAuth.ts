import jwt_decode from "jwt-decode";

import type { Ref } from "vue";

import { appendHeader } from "h3";

import type {
  ResponseLogin,
  AuthProvider,
  ResponseRefresh,
  User,
  UseDirectusFetchReturn,
} from "../types";

import {
  useRuntimeConfig,
  useRoute,
  navigateTo,
  useState,
  useRequestEvent,
  useRequestHeaders,
} from "#app";

import useDirectusFetch from "./useDirectusFetch";

export default function () {
  const { directusAuth } = useRuntimeConfig().public;
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

  async function login(credentials: {
    email: string;
    password: string;
  }): UseDirectusFetchReturn<ResponseLogin> {
    const accessToken = useAccessToken();
    return useDirectusFetch<ResponseLogin>("/auth/login", {
      method: "POST",
      credentials: "include",
      body: {
        email: credentials.email,
        password: credentials.password,
        mode: "cookie",
      },
    }).then(async (res) => {
      if (res.data.value) {
        accessToken.value = res.data.value.data.access_token;
        await fetchUser();
        await navigateTo(directusAuth.redirect.home);
      }
      return res;
    });
  }

  async function loginWithProvider(provider: AuthProvider) {
    const redirectUrl = getRedirectUrl(directusAuth.redirect.callback);

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

        if (!cookie || !cookie.includes(directusAuth.refreshTokenCookieName)) {
          accessToken.value = null;
          return;
        }
      }

      const res = await $fetch.raw<ResponseRefresh>("/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: cookie ? { cookie } : {},
      });

      if (process.server) {
        const cookie = res.headers.get("set-cookie") || "";
        appendHeader(event, "set-cookie", cookie);
      }

      accessToken.value = res._data?.data.access_token || null;
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
      const res = await $fetch<{ data: User }>("/users/me", {
        headers: {
          Authorization: "Bearer " + accessToken.value,
        },
      });

      user.value = res.data;
    } catch (error) {
      user.value = null;
    }
  }

  async function logout() {
    const accessToken = useAccessToken();
    const user = useUser();

    if (accessToken.value) {
      await $fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      accessToken.value = null;
    }

    user.value = null;
    await navigateTo(directusAuth.redirect.logout);
  }

  function register(user: User): UseDirectusFetchReturn<User> {
    user.role = directusAuth.defaultRoleId;

    return useDirectusFetch<User>("/users", {
      method: "POST",
      body: user,
    });
  }

  function getRedirectUrl(path: string) {
    return directusAuth.nuxtBaseUrl + path;
  }

  async function requestPasswordReset(
    email: string
  ): UseDirectusFetchReturn<void> {
    return useDirectusFetch<void>("/auth/password/request", {
      method: "POST",
      body: {
        email,
        reset_url: getRedirectUrl(directusAuth.redirect.resetPassword),
      },
    });
  }

  async function resetPassword(password: string): UseDirectusFetchReturn<void> {
    return useDirectusFetch<void>("/auth/password/reset", {
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
