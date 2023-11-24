import { resolveURL, withQuery } from 'ufo'
import type { FetchError } from 'ofetch'
import type { H3Error } from 'h3'
import type { AsyncData } from '#app'
import type { User, Provider, PublicConfig } from '../types'
import {
  useRuntimeConfig,
  useRoute,
  useFetch,
  useAuthSession,
  useAuthFetch,
  navigateTo,
  clearNuxtData,
  useNuxtApp
} from '#imports'

type FetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export default function () {
  const { user } = useAuthSession()
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig
  const { _accessToken, _loggedIn } = useAuthSession()

  /**
   * Login with email/password
   */
  async function login (credentials: {
    email: string;
    password: string;
  }): FetchReturn<{ accessToken: string }> {
    return await useFetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: credentials.email,
        password: credentials.password
      }
    }).then(async (res) => {
      if (!res.error.value && res.data.value) {
        await _onLogin(res.data.value.accessToken)
      }

      return res
    })
  }

  /**
   * Login via oauth provider
   */
  function loginWithProvider (provider: Provider): void {
    if (process.client) {
      const route = useRoute()

      // The protected page the user has visited before redirect to login page
      const returnToPath = route.query.redirect?.toString()

      let redirectUrl = resolveURL('/api/auth/login', provider)

      redirectUrl = withQuery(redirectUrl, { redirect: returnToPath })

      window.location.replace(redirectUrl)
    }
  }

  /**
   * Fetch active user, usefull to update `user` state
   */
  async function fetchUser (): Promise<void> {
    try {
      user.value = await useAuthFetch<User>('/api/auth/me')
    } catch (e) {
      user.value = null
    }
  }

  async function logout (): Promise<void> {
    await $fetch('/api/auth/logout', {
      method: 'POST'
    }).finally(_onLogout)
  }

  async function _onLogin (accessToken: string) {
    const route = useRoute()
    const { callHook } = useNuxtApp()
    const returnToPath = route.query.redirect?.toString()
    const redirectTo = returnToPath ?? publicConfig.redirect.home
    _accessToken.set(accessToken)
    _loggedIn.set(true)
    await fetchUser()
    await callHook('auth:loggedIn', true)
    await navigateTo(redirectTo)
  }

  async function _onLogout () {
    const { callHook } = useNuxtApp()
    await callHook('auth:loggedIn', false)
    user.value = null
    _accessToken.clear()
    _loggedIn.set(false)
    clearNuxtData()
    await navigateTo(publicConfig.redirect.logout)
  }

  async function register (userInfo: {
    email: string;
    password: string;
    name: string;
  }): FetchReturn<void> {
    return await useFetch('/api/auth/register', {
      method: 'POST',
      body: userInfo,
      credentials: 'omit'
    })
  }

  async function requestPasswordReset (email: string): FetchReturn<void> {
    return await useFetch('/api/auth/password/request', {
      method: 'POST',
      credentials: 'omit',
      body: {
        email
      }
    })
  }

  async function resetPassword (password: string): FetchReturn<void> {
    const route = useRoute()

    return await useFetch('/api/auth/password/reset', {
      method: 'PUT',
      credentials: 'omit',
      body: {
        password,
        token: route.query.token
      }
    })
  }

  async function requestEmailVerify (email: string): FetchReturn<void> {
    return await useFetch('/api/auth/email/request', {
      method: 'POST',
      credentials: 'omit',
      body: {
        email
      }
    })
  }

  async function changePassword (input: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    return await useAuthFetch('/api/auth/password/change', {
      method: 'PUT',
      body: {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword
      }
    })
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
    _onLogout
  }
}
