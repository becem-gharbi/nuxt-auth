import { Ref } from "vue";
import { appendHeader } from "h3";
import type { User, Provider, RefreshToken } from "../types";
import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";
import useAuthFetch from "./useAuthFetch";
import jwtDecode from "jwt-decode";

import {
  useRuntimeConfig,
  useRoute,
  navigateTo,
  useState,
  useFetch,
  useRequestEvent,
  useRequestHeaders,
} from "#app";

import type { H3Error } from "h3";

type FetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export default function () {
  const privateConfig = useRuntimeConfig().auth;
  const publicConfig = useRuntimeConfig().public.auth;

  const useUser: () => Ref<User | null | undefined> = () =>
    useState<User | null | undefined>("auth_user", () => null);

  const useAccessToken: () => Ref<string | undefined | null> = () =>
    useState<string | undefined | null>("auth_access_token", () => null);

  const event = useRequestEvent();

  const route = useRoute();

  function isAccessTokenExpired() {
    const accessToken = useAccessToken();

    if (accessToken.value) {
      const decoded = jwtDecode(accessToken.value) as { exp: number };
      const expires = decoded.exp * 1000;
      return expires < Date.now();
    }

    return true;
  }

  function extractCookie(cookies: string, name: string) {
    const value = `; ${cookies}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  }

  async function login(credentials: {
    email: string;
    password: string;
  }): FetchReturn<{ accessToken: string; user: User }> {
    return useFetch<{ accessToken: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: {
        email: credentials.email,
        password: credentials.password,
      },
    }).then(async (res) => {
      const accessToken = useAccessToken();
      const user = useUser();

      accessToken.value = res.data.value?.accessToken;
      user.value = res.data.value?.user;

      if (accessToken.value) {
        await navigateTo(publicConfig.redirect.home);
      }

      return res;
    });
  }

  function loginWithProvider(provider: Provider): void {
    if (process.client) {
      window.location.replace(`/api/auth/login/${provider}`);
    }
  }

  async function prefetch(): Promise<void> {
    await refresh();

    const accessToken = useAccessToken();

    if (!accessToken.value) {
      await logout();
      throw new Error("unauthorized");
    }
  }

  async function refresh(): Promise<void> {
    const accessToken = useAccessToken();
    const user = useUser();

    try {
      const cookies = useRequestHeaders(["cookie"]).cookie || "";

      if (process.server) {
        accessToken.value = extractCookie(
          cookies,
          privateConfig.accessToken.cookieName
        );
      } else {
        accessToken.value = isAccessTokenExpired() ? null : accessToken.value;
      }

      if (accessToken.value) {
        if (!user.value) {
          user.value = await $fetch<User>("/api/auth/me", {
            headers: {
              Authorization: "Bearer " + accessToken.value,
            },
          });
        }
        return;
      }

      if (process.server) {
        const refreshToken = extractCookie(
          cookies,
          privateConfig.refreshToken.cookieName
        );

        if (!refreshToken) {
          return;
        }
      }

      const res = await $fetch<{ accessToken: string; user: User }>(
        "/api/auth/session/refresh",
        {
          method: "POST",
          headers: process.server ? { cookie: cookies } : {},
          onResponse({ response }) {
            if (process.server) {
              const cookies = (response?.headers.get("set-cookie") || "").split(
                ","
              );
              for (const cookie of cookies) {
                appendHeader(event, "set-cookie", cookie);
              }
            }
          },
        }
      );

      accessToken.value = res.accessToken;
      user.value = res.user;
    } catch (e) {
      accessToken.value = null;
      user.value = null;
    }
  }

  async function fetchUser(): Promise<void> {
    const user = useUser();
    user.value = await useAuthFetch<User>("/api/auth/me");
  }

  async function logout(): Promise<void> {
    await $fetch("/api/auth/logout", {
      method: "POST",
    }).finally(() => {
      const accessToken = useAccessToken();
      const user = useUser();

      user.value = null;
      accessToken.value = null;

      return navigateTo(publicConfig.redirect.logout);
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
    });
  }

  async function requestPasswordReset(email: string): FetchReturn<void> {
    return useFetch("/api/auth/password/request", {
      method: "POST",
      body: {
        email,
      },
    });
  }

  async function resetPassword(password: string): FetchReturn<void> {
    return useFetch("/api/auth/password/reset", {
      method: "PUT",
      body: {
        password: password,
        token: route.query.token,
      },
    });
  }

  async function requestEmailVerify(email: string): FetchReturn<void> {
    return useFetch("/api/auth/email/request", {
      method: "POST",
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

  async function revokeSessions(): Promise<void> {
    return useAuthFetch<void>("/api/auth/session/revoke", {
      method: "DELETE",
    });
  }

  async function getSessions(): Promise<{ refreshTokens: RefreshToken[] }> {
    return useAuthFetch<{ refreshTokens: RefreshToken[] }>("/api/auth/session");
  }

  return {
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
    requestEmailVerify,
    prefetch,
    changePassword,
    revokeSessions,
    getSessions,
  };
}
