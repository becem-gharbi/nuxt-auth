import {
  deleteCookie,
  getCookie,
  splitCookiesString,
  appendResponseHeader
} from 'h3'
import type { Ref } from 'vue'
import type {
  User,
  Session,
  Response, PublicConfig
} from '../types'
import { useAuthToken } from './useAuthToken'
import {
  useRequestEvent,
  useRuntimeConfig,
  useState,
  useRequestHeaders,
  useNuxtApp,
  useAuth
} from '#imports'

export function useAuthSession () {
  const event = useRequestEvent()
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig
  const privateConfig = useRuntimeConfig().auth

  const _refreshToken = {
    get: () => process.server && getCookie(event!, privateConfig.refreshToken.cookieName),
    clear: () => process.server && deleteCookie(event!, privateConfig.refreshToken.cookieName)
  }

  const _loggedInFlag = {
    get value () {
      return process.client ? localStorage.getItem(publicConfig.loggedInFlagName!) === 'true' : false
    },
    set value (value: boolean) {
      process.client && localStorage.setItem(publicConfig.loggedInFlagName!, value.toString())
    }
  }

  const user: Ref<User | null | undefined> = useState<User | null | undefined>('auth-user', () => null)

  async function _refresh () {
    async function handler () {
      const accessToken = useAuthToken()

      await $fetch
        .raw<{ access_token: string, expires_in: number }>('/api/auth/session/refresh', {
          baseURL: publicConfig.backendBaseUrl,
          method: 'POST',
          // Cloudflare Workers does not support "credentials" field
          ...(process.client ? { credentials: 'include' } : {}),
          headers: process.server ? useRequestHeaders(['cookie', 'user-agent']) : {}
        })
        .then((res) => {
          if (process.server) {
            const cookies = splitCookiesString(res.headers.get('set-cookie') ?? '')

            for (const cookie of cookies) {
              appendResponseHeader(event!, 'set-cookie', cookie)
            }
          }

          if (res._data) {
            accessToken.value = {
              access_token: res._data.access_token,
              expires: new Date().getTime() + res._data.expires_in * 1000
            }
          }
        })
        .catch(async () => {
          _refreshToken.clear()
          await useAuth()._onLogout()
        })
    }

    const { $auth } = useNuxtApp()
    $auth._refreshPromise ||= handler()
    await $auth._refreshPromise.finally(() => { $auth._refreshPromise = null })
  }

  /**
   * Async get access token
   * @returns Fresh access token (refreshed if expired)
   */
  async function getAccessToken (): Promise<string | null | undefined> {
    const accessToken = useAuthToken()

    if (accessToken.expired) {
      await _refresh()
    }

    return accessToken.value?.access_token
  }

  /**
   * Removes all stored sessions of the active user
   */
  function revokeAllSessions (): Promise<Response> {
    return useNuxtApp().$auth.fetch<Response>('/api/auth/session/revoke/all', {
      method: 'DELETE'
    })
  }

  /**
   * Removes a single stored session of the active user
   */
  function revokeSession (id: Session['id']): Promise<Response> {
    return useNuxtApp().$auth.fetch<Response>(`/api/auth/session/revoke/${id}`, {
      method: 'DELETE'
    })
  }

  /**
   * Get all stored sessions of the active user
   */
  async function getAllSessions (): Promise<Session[]> {
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
    getAllSessions
  }
}
