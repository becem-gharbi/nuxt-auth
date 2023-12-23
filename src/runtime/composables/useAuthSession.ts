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
  Response
} from '../types'
import { useAuthToken } from './useAuthToken'
import {
  useRequestEvent,
  useRuntimeConfig,
  useState,
  useRequestHeaders,
  navigateTo,
  useNuxtApp
} from '#imports'

export function useAuthSession () {
  const event = useRequestEvent()
  const publicConfig = useRuntimeConfig().public.auth
  const privateConfig = useRuntimeConfig().auth

  const _refreshToken = {
    get: () => process.server && getCookie(event, privateConfig.refreshToken.cookieName),
    clear: () => process.server && deleteCookie(event, privateConfig.refreshToken.cookieName)
  }

  const _loggedIn = {
    get: () => process.client && localStorage.getItem(publicConfig.loggedInFlagName),
    set: (value: boolean) => process.client && localStorage.setItem(publicConfig.loggedInFlagName, value.toString())
  }

  const user: Ref<User | null | undefined> = useState<User | null | undefined>('auth-user', () => null)

  async function _refresh () {
    const isRefreshOn = useState('auth-refresh-loading', () => false)

    if (isRefreshOn.value) { return }
    isRefreshOn.value = true

    const headers = useRequestHeaders(['cookie', 'user-agent'])

    const accessToken = useAuthToken()

    await $fetch
      .raw<{ access_token: string, expires_in: number }>('/api/auth/session/refresh', {
        method: 'POST',
        headers
      })
      .then((res) => {
        const setCookie = res.headers.get('set-cookie') ?? ''
        const cookies = splitCookiesString(setCookie)

        for (const cookie of cookies) {
          appendResponseHeader(event, 'set-cookie', cookie)
        }

        if (res._data) {
          accessToken.value = {
            access_token: res._data.access_token,
            expires: new Date().getTime() + res._data.expires_in * 1000
          }
          _loggedIn.set(true)
        }
        return res
      })
      .catch(async () => {
        accessToken.value = null
        _refreshToken.clear()
        _loggedIn.set(false)
        user.value = null
        if (process.client) {
          await navigateTo(publicConfig.redirect.logout)
        }
      }).finally(() => {
        isRefreshOn.value = false
      })
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
    const { $auth } = useNuxtApp()
    return $auth.fetch<Response>('/api/auth/session/revoke/all', {
      method: 'DELETE'
    })
  }

  /**
   * Removes a single stored session of the active user
   */
  function revokeSession (id: Session['id']): Promise<Response> {
    const { $auth } = useNuxtApp()
    return $auth.fetch<Response>(`/api/auth/session/revoke/${id}`, {
      method: 'DELETE'
    })
  }

  /**
   * Get all stored sessions of the active user
   */
  async function getAllSessions (): Promise<Session[]> {
    const { $auth } = useNuxtApp()
    const sessions = await $auth.fetch<Session[]>('/api/auth/session')

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
    _loggedIn,
    user,
    _refresh,
    getAccessToken,
    revokeAllSessions,
    revokeSession,
    getAllSessions
  }
}
