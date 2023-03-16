import type { User, Provider } from "../types";
import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";
import type { H3Error } from "h3";
import { resolveURL } from "ufo";
import useAuthFetch from "./useAuthFetch";
import { useRuntimeConfig, useRoute, navigateTo, useFetch } from "#app";
import useAuthSession from "./useAuthSession";

type FetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export default function () {
  const { useAccessToken, useUser } = useAuthSession();
  const publicConfig = useRuntimeConfig().public.auth;
  const route = useRoute();

  async function login(credentials: {
    email: string;
    password: string;
  }): FetchReturn<{ accessToken: string; user: User }> {
    return useFetch<{ accessToken: string; user: User }>("/api/auth/login", {
      method: "POST",
      credentials: "include",
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
      window.location.replace(resolveURL("/api/auth/login", provider));
    }
  }

  async function fetchUser(): Promise<void> {
    const user = useUser();
    user.value = await useAuthFetch<User>("/api/auth/me");
  }

  async function logout(): Promise<void> {
    await $fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
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
      credentials: "omit",
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
