import type { User, Provider } from "../types";
import type { AsyncData } from "#app";
import type { FetchError } from "ofetch";
import type { H3Error } from "h3";
import { resolveURL, withQuery } from "ufo";
import useAuthFetch from "./useAuthFetch";
import { useRuntimeConfig, useRoute, useFetch } from "#app";
import useAuthSession from "./useAuthSession";

type FetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export default function () {
  const { useUser } = useAuthSession();
  const publicConfig = useRuntimeConfig().public.auth;

  /**
   * Login with email/password
   */
  async function login(credentials: {
    email: string;
    password: string;
  }): FetchReturn<{ accessToken: string; user: User }> {}

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
    const user = useUser();
    user.value = await useAuthFetch<User>("/api/auth/me");
  }

  async function logout(): Promise<void> {}

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
