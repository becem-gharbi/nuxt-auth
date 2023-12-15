import { decodeJwt } from 'jose'
import Cookies from 'js-cookie'
import {
  deleteCookie,
  getCookie,
  setCookie,
  splitCookiesString,
  appendResponseHeader
} from 'h3'
import type { Ref } from 'vue'
import type {
  User,
  Session,
  Response
} from '../types'
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
  const loggedInName = publicConfig.loggedInFlagName
  const accessTokenCookieName = publicConfig.accessTokenCookieName
  const refreshTokenCookieName = process.server
    ? privateConfig.refreshToken.cookieName!
    : ''
  const msRefreshBeforeExpires = 3000

  const _accessToken = {
    get: () : string | undefined =>
      process.server
        ? event.context[accessTokenCookieName] ||
          getCookie(event, accessTokenCookieName)
        : Cookies.get(accessTokenCookieName),
    set: (value: string) => {
      if (process.server) {
        event.context[accessTokenCookieName] = value
        setCookie(event, accessTokenCookieName, value, {
          sameSite: 'lax',
          secure: true
        })
      } else {
        Cookies.set(accessTokenCookieName, value, {
          sameSite: 'lax',
          secure: true
        })
      }
    },
    clear: () => {
      if (process.server) {
        deleteCookie(event, accessTokenCookieName)
        deleteCookie(event, providerTokenCookieName)
      } else {
        Cookies.remove(accessTokenCookieName)
      }
    }
  }

  const _refreshToken = {
    get: () => process.server && getCookie(event, refreshTokenCookieName),
    clear: () => process.server && deleteCookie(event, refreshTokenCookieName)
  }

  const _loggedIn = {
    get: () => process.client && localStorage.getItem(loggedInName),
    set: (value: boolean) =>
      process.client && localStorage.setItem(loggedInName, value.toString())
  }

  const user: Ref<User | null | undefined> = useState<
    User | null | undefined
  >('auth-user', () => null)

  function isTokenExpired (token: string) {
    const { exp } = decodeJwt(token)
    const expires = exp! * 1000 - msRefreshBeforeExpires
    return expires < Date.now()
  }

  async function _refresh () {
    const isRefreshOn = useState('auth-refresh-loading', () => false)

    if (isRefreshOn.value) {
      return
    }

    isRefreshOn.value = true

    const headers = useRequestHeaders(['cookie', 'user-agent'])

    await $fetch
      .raw<{ accessToken: string }>('/api/auth/session/refresh', {
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
          _accessToken.set(res._data.accessToken)
          _loggedIn.set(true)
        }
        isRefreshOn.value = false
        return res
      })
      .catch(async () => {
        isRefreshOn.value = false
        _accessToken.clear()
        _refreshToken.clear()
        _loggedIn.set(false)
        user.value = null
        if (process.client) {
          await navigateTo(publicConfig.redirect.logout)
        }
      })
  }

  /**
   * Async get access token
   * @returns Fresh access token (refreshed if expired)
   */
  async function getAccessToken () {
    const accessToken = _accessToken.get()

    if (accessToken && isTokenExpired(accessToken)) {
      await _refresh()
    }

    return _accessToken.get()
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
    _accessToken,
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
