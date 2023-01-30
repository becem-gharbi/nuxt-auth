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
import { UAParser } from "ua-parser-js";

export default function () {
  const privateConfig = useRuntimeConfig().auth;
  const event = useRequestEvent();

  const useUser: () => Ref<User | null | undefined> = () =>
    useState<User | null | undefined>("auth_user", () => null);

  const useAccessToken: () => Ref<string | undefined | null> = () =>
    useState<string | undefined | null>("auth_access_token", () => null);

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

  async function revokeAllSessions(): Promise<void> {
    return useAuthFetch<void>("/api/auth/session/revoke/all", {
      method: "DELETE",
    });
  }

  async function revokeSession(id: number): Promise<void> {
    return useAuthFetch<void>("/api/auth/session/revoke", {
      method: "DELETE",
      body: {
        id,
      },
    });
  }

  async function getAllSessions(): Promise<Session[]> {
    const { refreshTokens } = await useAuthFetch<{
      refreshTokens: RefreshToken[];
    }>("/api/auth/session");

    const sessions: Session[] = refreshTokens.map((refreshToken) => {
      const uaParser = new UAParser(refreshToken.userAgent || undefined);

      return {
        id: refreshToken.id,
        userId: refreshToken.userId,
        browser: uaParser.getBrowser(),
        device: uaParser.getDevice(),
        os: uaParser.getOS(),
        updatedAt: refreshToken.updatedAt,
        createdAt: refreshToken.createdAt,
      };
    });

    return sessions;
  }

  return {
    useUser,
    useAccessToken,
    refresh,
    revokeAllSessions,
    revokeSession,
    getAllSessions,
  };
}
