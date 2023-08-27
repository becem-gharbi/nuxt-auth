import { decodeJwt } from "jose";
import {
  useRequestEvent,
  useRuntimeConfig,
  useState,
  useCookie,
  useRequestHeaders,
  navigateTo,
  useAuthFetch,
} from "#imports";
import {
  deleteCookie,
  getCookie,
  setCookie,
  splitCookiesString,
  appendResponseHeader,
} from "h3";
import type { Ref } from "vue";
import type {
  User,
  RefreshToken,
  Session,
  PublicConfig,
  PrivateConfig,
} from "../types";

export default function () {
  const event = useRequestEvent();
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig;
  const privateConfig = useRuntimeConfig().auth as PrivateConfig;
  const loggedInName = "auth_logged_in";
  const accessTokenCookieName = "auth_access_token";
  const refreshTokenCookieName = privateConfig?.refreshToken.cookieName!;
  const msRefreshBeforeExpires = 3000;

  const accessToken = {
    get: () =>
      process.server
        ? event.context[accessTokenCookieName] ||
          getCookie(event, accessTokenCookieName)
        : useCookie(accessTokenCookieName).value,
    set: (value: string) => {
      if (process.server) {
        event.context[accessTokenCookieName] = value;
        setCookie(event, accessTokenCookieName, value, {
          sameSite: "lax",
          secure: true,
        });
      } else {
        useCookie(accessTokenCookieName, {
          sameSite: "lax",
          secure: true,
        }).value = value;
      }
    },
    clear: () => {
      if (process.server) {
        deleteCookie(event, accessTokenCookieName);
      } else {
        useCookie(accessTokenCookieName).value = null;
      }
    },
  };

  const refreshToken = {
    get: () => process.server && getCookie(event, refreshTokenCookieName),
  };

  const loggedIn = {
    get: () => process.client && localStorage.getItem(loggedInName),
    set: (value: boolean) =>
      process.client && localStorage.setItem(loggedInName, value.toString()),
  };

  const user: Ref<User | null | undefined> = useState<User | null | undefined>(
    "auth-user",
    () => null
  );

  function isTokenExpired(token: string) {
    const { exp } = decodeJwt(token);
    const expires = exp! * 1000 - msRefreshBeforeExpires;
    return expires < Date.now();
  }

  async function refresh() {
    const isRefreshOn = useState("auth-refresh-loading", () => false);

    if (isRefreshOn.value) {
      return;
    }

    isRefreshOn.value = true;

    const cookie = useRequestHeaders(["cookie"]).cookie || "";

    await $fetch
      .raw<{ accessToken: string }>("/api/auth/session/refresh", {
        baseURL: publicConfig.baseUrl,
        method: "POST",
        headers: {
          cookie,
        },
      })
      .then((res) => {
        const setCookie = res.headers.get("set-cookie") || "";

        const cookies = splitCookiesString(setCookie);

        for (const cookie of cookies) {
          appendResponseHeader(event, "set-cookie", cookie);
        }

        if (res._data) {
          accessToken.set(res._data.accessToken);
          loggedIn.set(true);
        }
        isRefreshOn.value = false;
        return res;
      })
      .catch(async () => {
        isRefreshOn.value = false;
        accessToken.clear();
        loggedIn.set(false);
        user.value = null;
        if (process.client) {
          await navigateTo(publicConfig.redirect.logout);
        }
      });
  }

  /**
   * Async get access token
   * @returns Fresh access token (refreshed if expired)
   */
  async function getAccessToken() {
    const access_token = accessToken.get();

    if (access_token && isTokenExpired(access_token)) {
      await refresh();
    }

    return accessToken.get();
  }

  /**
   * Removes all stored sessions of the active user
   */
  async function revokeAllSessions(): Promise<void> {
    return useAuthFetch<void>("/api/auth/session/revoke/all", {
      method: "DELETE",
    });
  }

  /**
   * Removes a single stored session of the active user
   */
  async function revokeSession(id: Session["id"]): Promise<void> {
    return useAuthFetch<void>("/api/auth/session/revoke", {
      method: "DELETE",
      body: {
        id,
      },
    });
  }

  /**
   * Get all stored sessions of the active user
   */
  async function getAllSessions(): Promise<Session[]> {
    const { refreshTokens, current } = await useAuthFetch<{
      refreshTokens: RefreshToken[];
      current: Session["id"];
    }>("/api/auth/session");

    const sessions: Session[] = refreshTokens.map((refreshToken) => {
      return {
        id: refreshToken.id,
        current: refreshToken.id === current,
        userId: refreshToken.userId,
        ua: refreshToken.userAgent,
        updatedAt: refreshToken.updatedAt,
        createdAt: refreshToken.createdAt,
      };
    });

    return sessions;
  }

  return {
    accessToken,
    refreshToken,
    loggedIn,
    user,
    refresh,
    getAccessToken,
    revokeAllSessions,
    revokeSession,
    getAllSessions,
  };
}
