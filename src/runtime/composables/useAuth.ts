import { resolveURL, withQuery } from 'ufo'
import type { FetchError } from 'ofetch'
import type { H3Error } from 'h3'
import type { AsyncData } from '#app'
import type { Provider, PublicConfig, Response } from '../types'
import { useAuthToken } from './useAuthToken'
import {
  useRuntimeConfig,
  useRoute,
  useFetch,
  useAuthSession,
  navigateTo,
  clearNuxtData,
  useNuxtApp
} from '#imports'

type useFetchReturn<T> = Promise<AsyncData<T | null, FetchError<H3Error> | null>>;

export function useAuth () {
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig

  /**
   * Login with email/password
   */
  async function login (credentials: {
    email: string;
    password: string;
  }): useFetchReturn<{ access_token: string, expires_in:number }> {
    const res = await useFetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: credentials.email,
        password: credentials.password
      }
    })

    if (!res.error.value && res.data.value) {
      useAuthToken().value = {
        access_token: res.data.value.access_token,
        expires: new Date().getTime() + res.data.value.expires_in * 1000
      }
      await _onLogin()
    }
    return res
  }

  /**
   * Login via oauth provider
   */
  function loginWithProvider (provider: Provider) {
    if (process.server) { return }

    // The protected page the user has visited before redirect to login page
    const returnToPath = useRoute().query.redirect?.toString()

    let redirectUrl = resolveURL('/api/auth/login', provider)

    redirectUrl = withQuery(redirectUrl, { redirect: returnToPath })

    window.location.replace(redirectUrl)
  }

  /**
   * Fetch active user, usefull to update `user` state
   */
  async function fetchUser () {
    const { user } = useAuthSession()
    try {
      const data = await useNuxtApp().$auth.fetch('/api/auth/me')
      user.value = {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      }
    } catch (e) {
      user.value = null
    }
  }

  async function logout () {
    await $fetch('/api/auth/logout', {
      method: 'POST'
    }).finally(_onLogout)
  }

  async function _onLogin () {
    await fetchUser()
    if (useAuthSession().user.value === null) { return }
    const returnToPath = useRoute().query.redirect?.toString()
    const redirectTo = returnToPath ?? publicConfig.redirect.home
    useAuthSession()._loggedIn.set(true)
    await useNuxtApp().callHook('auth:loggedIn', true)
    await navigateTo(redirectTo)
  }

  async function _onLogout () {
    await useNuxtApp().callHook('auth:loggedIn', false)
    useAuthToken().value = null
    useAuthSession()._loggedIn.set(false)
    await navigateTo(publicConfig.redirect.logout)
    clearNuxtData()
    useAuthSession().user.value = null
  }

  async function register (userInfo: {
    email: string;
    password: string;
    name: string;
  }): useFetchReturn<Response> {
    return await useFetch('/api/auth/register', {
      method: 'POST',
      body: userInfo,
      credentials: 'omit'
    })
  }

  async function requestPasswordReset (email: string): useFetchReturn<Response> {
    return await useFetch('/api/auth/password/request', {
      method: 'POST',
      credentials: 'omit',
      body: {
        email
      }
    })
  }

  async function resetPassword (password: string): useFetchReturn<Response> {
    return await useFetch('/api/auth/password/reset', {
      method: 'PUT',
      credentials: 'omit',
      body: {
        password,
        token: useRoute().query.token
      }
    })
  }

  async function requestEmailVerify (email: string): useFetchReturn<Response> {
    return await useFetch('/api/auth/email/request', {
      method: 'POST',
      credentials: 'omit',
      body: {
        email
      }
    })
  }

  function changePassword (input: {
    currentPassword: string;
    newPassword: string;
  }): Promise<Response> {
    return useNuxtApp().$auth.fetch<Response>('/api/auth/password/change', {
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
