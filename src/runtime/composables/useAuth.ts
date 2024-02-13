import { joinURL } from 'ufo'
import type { Provider, Response, User } from '../types'
import { useAuthToken } from './useAuthToken'
import {
  useRuntimeConfig,
  useRoute,
  useAuthSession,
  navigateTo,
  useNuxtApp
} from '#imports'

export function useAuth () {
  const publicConfig = useRuntimeConfig().public.auth

  /**
   * Login with email/password
   */
  async function login (credentials: {
    email: string;
    password: string;
  }): Promise<{ access_token: string, expires_in: number }> {
    const res = await $fetch<{ access_token: string, expires_in: number }>('/api/auth/login', {
      baseURL: publicConfig.backendBaseUrl,
      method: 'POST',
      credentials: 'include',
      body: {
        email: credentials.email,
        password: credentials.password
      }
    })

    useAuthToken().value = {
      access_token: res.access_token,
      expires: new Date().getTime() + res.expires_in * 1000
    }
    await _onLogin()

    return res
  }

  /**
   * Login via oauth provider
   */
  function loginWithProvider (provider: Provider) {
    // The protected page the user has visited before redirect to login page
    const returnToPath = useRoute().query.redirect?.toString()

    return navigateTo({
      path: joinURL(publicConfig.backendBaseUrl, '/api/auth/login', provider),
      query: {
        redirect: returnToPath
      }
    },
    {
      external: true
    })
  }

  /**
   * Fetch active user, usefull to update `user` state
   */
  async function fetchUser () {
    const { user } = useAuthSession()
    try {
      const data = await useNuxtApp().$auth.fetch<User>('/api/auth/me')
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
    await $fetch<Response>('/api/auth/logout', {
      baseURL: publicConfig.backendBaseUrl,
      method: 'POST',
      credentials: 'include'
    }).finally(_onLogout)
  }

  async function _onLogin () {
    await fetchUser()
    if (useAuthSession().user.value === null) { return }
    const returnToPath = useRoute().query.redirect?.toString()
    const redirectTo = returnToPath ?? publicConfig.redirect.home
    useAuthSession()._loggedInFlag.value = true
    await useNuxtApp().callHook('auth:loggedIn', true)
    await navigateTo(redirectTo)
  }

  async function _onLogout () {
    await useNuxtApp().callHook('auth:loggedIn', false)
    useAuthToken().value = null
    useAuthSession()._loggedInFlag.value = false
    await navigateTo(publicConfig.redirect.logout, { external: true })
  }

  async function register (userInfo: {
    email: string;
    password: string;
    name: string;
  }): Promise<Response> {
    return await $fetch<Response>('/api/auth/register', {
      baseURL: publicConfig.backendBaseUrl,
      method: 'POST',
      body: userInfo,
      credentials: 'omit'
    })
  }

  async function requestPasswordReset (email: string): Promise<Response> {
    return await $fetch<Response>('/api/auth/password/request', {
      baseURL: publicConfig.backendBaseUrl,
      method: 'POST',
      credentials: 'omit',
      body: {
        email
      }
    })
  }

  async function resetPassword (password: string): Promise<Response> {
    return await $fetch<Response>('/api/auth/password/reset', {
      baseURL: publicConfig.backendBaseUrl,
      method: 'PUT',
      credentials: 'omit',
      body: {
        password,
        token: useRoute().query.token
      }
    })
  }

  async function requestEmailVerify (email: string): Promise<Response> {
    return await $fetch<Response>('/api/auth/email/request', {
      baseURL: publicConfig.backendBaseUrl,
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
