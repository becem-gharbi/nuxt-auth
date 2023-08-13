import type { Ref } from "vue";
import type { User, RefreshToken, Session } from "../types";
import useAuthFetch from "./useAuthFetch";
import { useState, useRequestEvent } from "#app";

export default function () {
  const accessTokenStorageName = "auth_access_token";

  const event = useRequestEvent();

  const useUser: () => Ref<User | null | undefined> = () =>
    useState<User | null | undefined>("auth_user", () => null);

  function isAccessTokenExpired() {}

  /**
   * Internal handler that refreshs access token if needed
   * @returns
   */
  async function refresh(): Promise<void> {}

  /**
   * Removes all stored sessions of the active user
   */
  async function revokeAllSessions(): Promise<void> {
    return useAuthFetch<void>("/api/auth/session/revoke/all", {
      method: "DELETE",
      credentials: "omit",
    });
  }

  /**
   * Removes a single stored session of the active user
   */
  async function revokeSession(id: Session["id"]): Promise<void> {
    return useAuthFetch<void>("/api/auth/session/revoke", {
      method: "DELETE",
      credentials: "omit",
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

  /**
   * Async get access token
   * @returns Fresh access token (refreshed if expired)
   */
  async function getAccessToken() {}

  return {
    useUser,
    getAccessToken,
    refresh,
    revokeAllSessions,
    revokeSession,
    getAllSessions,
  };
}
