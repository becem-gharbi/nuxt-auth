import jwt_decode from "jwt-decode";
import type { Ref } from "vue";
import { appendHeader } from "h3";
import type { User, Provider } from "../types";
import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";

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
  const useInitialized: () => Ref<boolean> = () =>
    useState("auth_initialized", () => false);
  const useUser: () => Ref<User | null> = () =>
    useState<User | null>("auth_user", () => null);
  const useAccessToken: () => Ref<string | null> = () =>
    useState<string | null>("auth_access_token", () => null);
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

  async function login(input: {
    email: string;
    password: string;
  }): FetchReturn<{ accessToken: string }> {
    const accessToken = useAccessToken();

    return useFetch<UseFetchDataT<{ accessToken: string }>, UseFetchErrorT>(
      "/api/auth/login",
      {
        method: "POST",
        credentials: "include",
        body: {
          email: input.email,
          password: input.password,
        },
      }
    ).then(async (res) => {
      if (res.data.value) {
        accessToken.value = res.data.value.accessToken;
        await fetchUser();
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
    if (accessToken.value) {
      if (isAccessTokenExpired()) {
        await refresh();
        if (!accessToken.value) {
          await logout();
          throw new Error("Unauthorized");
        }
      }
    }
  }

  async function refresh(): Promise<void> {
    let cookie: string | undefined;
    const accessToken = useAccessToken();

    try {
      if (process.server) {
        const headers = useRequestHeaders(["Cookie"]);
        cookie = headers.cookie;

        if (!cookie || !cookie.includes(publicConfig.refreshTokenCookieName)) {
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

  async function fetchUser(): Promise<void> {
    const accessToken = useAccessToken();
    const user = useUser();

    if (!accessToken.value) {
      user.value = null;
      return;
    }

    await prefetch();

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

  async function logout(): Promise<void> {
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
    await navigateTo(publicConfig.redirect.logout);
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
    requestEmailVerify,
    prefetch,
  };
}
