import { deleteCookie, getCookie, splitCookiesString, appendResponseHeader } from 'h3'
import type { Ref } from 'vue'
import type { ResponseOK, PublicConfig, PrivateConfig, AuthenticationData } from '../types'
import { useAuthToken } from './useAuthToken'
import { useRequestEvent, useRuntimeConfig, useState, useRequestHeaders, useNuxtApp, useAuth } from '#imports'
import type { User, Session } from '#build/types/auth_adapter'

export function useAuthSession() {
  const event = useRequestEvent()
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig
  const privateConfig = useRuntimeConfig().auth as PrivateConfig
  const { callHook } = useNuxtApp()

  const _refreshToken = {
    get: () => import.meta.server && getCookie(event!, privateConfig.refreshToken.cookieName!),
    clear: () => import.meta.server && deleteCookie(event!, privateConfig.refreshToken.cookieName!),
  }

  const _loggedInFlag = {
    get value() {
      return import.meta.client ? localStorage.getItem(publicConfig.loggedInFlagName!) === 'true' : false
    },
    set value(value: boolean) {
      if (import.meta.client) {
        localStorage.setItem(publicConfig.loggedInFlagName!, value.toString())
      }
    },
  }

  const user: Ref<User | null | undefined> = useState<User | null | undefined>('auth-user', () => null)

  /**
   * Asynchronously refreshes the authentication session.
   * If the request is successful, updates the access token and its expiration time.
   * If the request fails, clears the refresh token and logs out the user.
   *
   * @return {Promise<void>} A promise that resolves when the refresh operation is complete.
   */
  async function _refresh() {
    async function handler() {
      const token = useAuthToken()
      const reqHeaders = useRequestHeaders(['cookie', 'user-agent'])
      const { _onLogout } = useAuth()

      await $fetch
        .raw<AuthenticationData>('/api/auth/session/refresh', {
          baseURL: publicConfig.backendBaseUrl,
          method: 'POST',
          // Cloudflare Workers does not support "credentials" field
          ...(import.meta.client ? { credentials: 'include' } : {}),
          headers: import.meta.server ? reqHeaders : {},
          async  onResponseError({ response }) {
            await callHook('auth:fetchError', response)
          },
        })
        .then((res) => {
          if (import.meta.server) {
            const cookies = splitCookiesString(res.headers.get('set-cookie') ?? '')

            for (const cookie of cookies) {
              appendResponseHeader(event!, 'set-cookie', cookie)
            }
          }

          if (res._data) {
            token.value = {
              access_token: res._data.access_token,
              expires: new Date().getTime() + res._data.expires_in * 1000,
            }
          }
        })
        .catch(async () => {
          _refreshToken.clear()
          await _onLogout()
        })
    }

    const { $auth } = useNuxtApp()
    $auth._refreshPromise ||= handler()
    await $auth._refreshPromise.finally(() => {
      $auth._refreshPromise = null
    })
  }

  /**
   * Retrieves the access token.
   *
   * @return {Promise<string | null | undefined>} The access token, or null if it is expired and cannot be refreshed, or undefined if the token is not set.
   */
  async function getAccessToken(): Promise<string | null | undefined> {
    const token = useAuthToken()

    if (token.expired) {
      await _refresh()
    }

    return token.value?.access_token
  }

  /**
   * Revokes all active sessions except the current one, enhancing security by invalidating unused sessions.
   *
   * @return {Promise<ResponseOK>} A promise that resolves with a ResponseOK object upon successful revocation of all sessions.
   */
  function revokeAllSessions(): Promise<ResponseOK> {
    return useNuxtApp().$auth.fetch<ResponseOK>('/api/auth/session/revoke/all', {
      method: 'DELETE',
    })
  }

  /**
   * Revokes a single stored session of the active user.
   *
   * @param {Session['id']} id - The ID of the session to revoke.
   * @return {Promise<ResponseOK>} A promise that resolves with a ResponseOK object upon successful revocation of the session.
   */
  function revokeSession(id: Session['id']): Promise<ResponseOK> {
    return useNuxtApp().$auth.fetch<ResponseOK>(`/api/auth/session/revoke/${id}`, {
      method: 'DELETE',
    })
  }

  /**
   * Retrieves information about all active sessions, offering insights into the user's session history.
   *
   * @return {Promise<Session[]>} A promise that resolves with an array of Session objects representing all active sessions. The current session is moved to the top of the array.
   */
  async function getAllSessions(): Promise<Session[]> {
    const sessions = await useNuxtApp().$auth.fetch<Session[]>('/api/auth/session')

    // Move current session on top
    const currentIndex = sessions.findIndex(el => el.current)
    if (currentIndex > 0) {
      const currentSession = sessions.splice(currentIndex, 1)[0]
      sessions.unshift(currentSession)
    }

    return sessions
  }

  return {
    _refreshToken,
    _loggedInFlag,
    user,
    _refresh,
    getAccessToken,
    revokeAllSessions,
    revokeSession,
    getAllSessions,
  }
}
