import type { Ref } from "vue";
import type { User, RefreshToken, Session } from "../types";
import { appendHeader } from "h3";
import useAuthFetch from "./useAuthFetch";
import jwtDecode from "jwt-decode";
import {
  useRuntimeConfig,
  useState,
  useRequestEvent,
  useRequestHeaders,
} from "#app";
import { getCookie } from "h3";
import { watch } from "#imports";

export default function () {
  const event = useRequestEvent();

  const useUser: () => Ref<User | null | undefined> = () =>
    useState<User | null | undefined>("auth_user", () => null);

  const useAccessToken: () => Ref<string | undefined | null> = () =>
    useState<string | undefined | null>("auth_access_token", () =>
      process.client ? localStorage.getItem("auth_access_token") : null
    );

  const accessToken = useAccessToken();

  watch(
    accessToken,
    (value) => {
      if (process.client) {
        value
          ? localStorage.setItem("auth_access_token", value)
          : localStorage.removeItem("auth_access_token");
      }
    },
    { immediate: true }
  );

  function isAccessTokenExpired() {
    const accessToken = useAccessToken();

    if (accessToken.value) {
      const decoded = jwtDecode(accessToken.value) as { exp: number };
      const expires = decoded.exp * 1000;
      return expires < Date.now();
    }

    return true;
  }

  async function refresh(): Promise<void> {
    const accessToken = useAccessToken();
    const user = useUser();

    try {
      const cookies = useRequestHeaders(["cookie"]).cookie || "";

      if (process.client) {
        accessToken.value = isAccessTokenExpired() ? null : accessToken.value;
      }

      if (accessToken.value) {
        if (!user.value) {
          user.value = await $fetch<User>("/api/auth/me", {
            credentials: "omit",
            headers: {
              Authorization: "Bearer " + accessToken.value,
            },
          });
        }
        return;
      }

      if (process.server) {
        const refreshToken = getCookie(
          event,
          useRuntimeConfig().auth.refreshToken.cookieName
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
          credentials: "include",
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

  async function revokeAllSessions(): Promise<void> {
    return useAuthFetch<void>("/api/auth/session/revoke/all", {
      method: "DELETE",
      credentials: "omit",
    });
  }

  async function revokeSession(id: number): Promise<void> {
    return useAuthFetch<void>("/api/auth/session/revoke", {
      method: "DELETE",
      credentials: "omit",
      body: {
        id,
      },
    });
  }

  async function getAllSessions(): Promise<Session[]> {
    const { refreshTokens, current } = await useAuthFetch<{
      refreshTokens: RefreshToken[];
      current: number;
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

  /**
   * Async get access token
   * @returns Fresh access token (refreshed if expired)
   */
  async function getAccessToken() {
    if (process.client) {
      await refresh();
    }

    const accessToken = useAccessToken();

    return accessToken.value;
  }

  return {
    useUser,
    getAccessToken,
    useAccessToken,
    refresh,
    revokeAllSessions,
    revokeSession,
    getAllSessions,
  };
}
