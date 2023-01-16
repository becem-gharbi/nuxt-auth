import jwt_decode from "jwt-decode";

import type { Ref } from "vue";

import { appendHeader } from "h3";

import type {
  AuthProvider,
  User,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
  requestPasswordResetRequest,
  resetPasswordRequest,
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

  async function login(input: LoginRequest) {
    const accessToken = useAccessToken();

    return useFetch<LoginResponse>("/api/auth/login", {
      method: "POST",
      credentials: "include",
      body: {
        email: input.email,
        password: input.password,
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
    if (process.client) {
      window.location.replace(`/api/auth/login/${provider}`);
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

      const res = await $fetch.raw<RefreshResponse>("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: cookie ? { cookie } : {},
      });

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
      user.value = await $fetch<User>("/api/auth/me", {
        headers: {
          Authorization: "Bearer " + accessToken.value,
        },
      });
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

  function register(input: RegisterRequest) {
    return useFetch<User>("/api/auth/register", {
      method: "POST",
      body: input,
    });
  }

  function getRedirectUrl(path: string) {
    return config.public.auth.baseUrl + path;
  }

  async function requestPasswordReset(input: requestPasswordResetRequest) {
    return useFetch<void>("/auth/password/request", {
      method: "POST",
      body: {
        email: input.email,
        reset_url: getRedirectUrl(config.public.auth.redirect.resetPassword),
      },
    });
  }

  async function resetPassword(input: resetPasswordRequest) {
    return useFetch<void>("/auth/password/reset", {
      method: "POST",
      body: {
        password: input.password,
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
