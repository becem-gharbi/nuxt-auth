import { Ref } from "vue";
import { appendHeader, setHeader } from "h3";
import type { User, Provider } from "../types";
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

type ErrorT = {
  message: string;
};

type UseFetchDataT<T> = T | null;

type UseFetchErrorT = FetchError<ErrorT> | null;

type FetchReturn<T> = Promise<AsyncData<UseFetchDataT<T>, UseFetchErrorT>>;

export default function () {
  const publicConfig = useRuntimeConfig().public.auth;

  const useUser: () => Ref<User | null> = () =>
    useState<User | null>("auth_user", () => null);

  const useAccessToken: () => Ref<string | undefined | null> = () =>
    useState<string | undefined | null>("auth_access_token", () => null);

  const useAccessTokenCookie = () =>
    useCookie(publicConfig.accessTokenCookieName);

  const useRefreshTokenCookie = () =>
    useCookie(publicConfig.refreshTokenCookieName);

  const event = useRequestEvent();

  function isAccessTokenExpired() {
    const accessToken = useAccessToken();

    if (accessToken.value) {
      const decoded = jwtDecode(accessToken.value) as { exp: number };
      const expires = decoded.exp * 1000;
      return expires < Date.now();
    }

    return true;
  }

  async function login(input: {
    email: string;
    password: string;
  }): FetchReturn<{ accessToken: string }> {
    return useFetch<UseFetchDataT<{ accessToken: string }>, UseFetchErrorT>(
      "/api/auth/login",
      {
        method: "POST",
        body: {
          email: input.email,
          password: input.password,
        },
      }
    ).then(async (res) => {
      const accessToken = useAccessToken();

      accessToken.value = res.data.value?.accessToken;

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
    const accessToken = useAccessToken();

    await refresh();

    if (!accessToken.value) {
      await logout();
      throw new Error("unauthorized");
    }
  }

  async function refresh(): Promise<void> {
    try {
      const accessToken = useAccessToken();

      if (process.server) {
        accessToken.value = useAccessTokenCookie().value;
      } else {
        accessToken.value = isAccessTokenExpired() ? null : accessToken.value;
      }

      if (accessToken.value) {
        return;
      }

      if (process.server && !useRefreshTokenCookie().value) {
        return;
      }

      const cookie = useRequestHeaders(["cookie"]).cookie || "";

      const res = await $fetch.raw<{ accessToken: string }>(
        "/api/auth/refresh",
        {
          method: "POST",
          headers: process.server ? { cookie } : {},
        }
      );

      if (process.server) {
        const cookies = (res.headers.get("set-cookie") || "").split(",");
        for (const cookie of cookies) {
          appendHeader(event, "set-cookie", cookie);
        }
      }

      accessToken.value = res._data?.accessToken;
    } catch (e) {}
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
      accessToken.value = null;
      return navigateTo(publicConfig.redirect.logout);
    });
  }

  async function register(input: {
    email: string;
    password: string;
    name: string;
  }): FetchReturn<void> {
    return useFetch<UseFetchDataT<void>, UseFetchErrorT>("/api/auth/register", {
      method: "POST",
      body: input,
    });
  }

  async function requestPasswordReset(email: string): FetchReturn<void> {
    return useFetch<UseFetchDataT<void>, UseFetchErrorT>(
      "/api/auth/password/request",
      {
        method: "POST",
        body: {
          email,
        },
      }
    );
  }

  async function resetPassword(password: string): FetchReturn<void> {
    const route = useRoute();
    return useFetch<UseFetchDataT<void>, UseFetchErrorT>(
      "/api/auth/password/reset",
      {
        method: "PUT",
        body: {
          password: password,
          token: route.query.token,
        },
      }
    );
  }

  async function requestEmailVerify(email: string): FetchReturn<void> {
    return useFetch<UseFetchDataT<void>, UseFetchErrorT>(
      "/api/auth/email/request",
      {
        method: "POST",
        body: {
          email,
        },
      }
    );
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
  };
}
