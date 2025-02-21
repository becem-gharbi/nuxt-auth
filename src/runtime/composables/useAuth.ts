import { joinURL } from 'ufo'
import type { ResponseOK, AuthenticationData } from '../types/common'
import type { PublicConfig } from '../types/config'
import { useAuthToken } from './useAuthToken'
import { useRuntimeConfig, useRoute, useAuthSession, navigateTo, useNuxtApp } from '#imports'
import type { User } from '#auth_adapter'

interface LoginInput {
  email: string
  password: string
}

interface RegisterInput {
  email: string
  password: string
  name: string
}

interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

export function useAuth() {
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig
  const token = useAuthToken()
  const nuxtApp = useNuxtApp()

  /**
   * Asynchronously logs in the user with the provided email and password.
   *
   * @param {LoginInput} input - The login input object containing the email and password.
   * @return {Promise<AuthenticationData>} A promise that resolves to the authentication data if the login is successful.
   */
  async function login(input: LoginInput): Promise<AuthenticationData> {
    const res = await $fetch<AuthenticationData>('/api/auth/login', {
      baseURL: publicConfig.backendBaseUrl,
      method: 'POST',
      credentials: 'include',
      body: {
        email: input.email,
        password: input.password,
      },
      async  onResponseError({ response }) {
        await nuxtApp.callHook('auth:fetchError', response)
      },
    })

    token.value = {
      access_token: res.access_token,
      expires: new Date().getTime() + res.expires_in * 1000,
    }
    await _onLogin()

    return res
  }

  /**
   * Asynchronously logs in the user with the specified oauth provider.
   *
   * @param {User['provider']} provider - The oauth provider to log in with.
   * @return {Promise<void>} A promise that resolves when the login is complete.
   */
  async function loginWithProvider(provider: User['provider']): Promise<void> {
    // The protected page the user has visited before redirect to login page
    const returnToPath = useRoute().query.redirect?.toString()

    await navigateTo({
      path: joinURL(publicConfig.backendBaseUrl!, '/api/auth/login', provider),
      query: {
        redirect: returnToPath,
      },
    },
    {
      external: true,
    })
  }

  /**
   * Fetches the user data.
   * If the fetch is successful, the user value is updated with the fetched user data.
   * If an error occurs during the fetch, the user value is set to null.
   *
   * @return {Promise<void>} A Promise that resolves when the user data is fetched or an error occurs.
   */
  async function fetchUser(): Promise<void> {
    const { user } = useAuthSession()
    try {
      user.value = await nuxtApp.$auth.fetch<User>('/api/auth/me')
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (err) {
      user.value = null
    }
  }

  /**
   * Logs the user out.
   *
   * @return {Promise<void>} A promise that resolves when the logout request is complete.
   */
  async function logout(): Promise<void> {
    await $fetch<ResponseOK>('/api/auth/logout', {
      baseURL: publicConfig.backendBaseUrl,
      method: 'POST',
      credentials: 'include',
      async  onResponseError({ response }) {
        await nuxtApp.callHook('auth:fetchError', response)
      },
    }).finally(_onLogout)
  }

  /**
   * Logs the user in by fetching the user data, checking if the user is logged in,
   * and redirecting to the specified page after calling the 'auth:loggedIn' hook.
   *
   * @return {Promise<void>} A promise that resolves when the login process is complete.
   */
  async function _onLogin(): Promise<void> {
    await fetchUser()
    if (useAuthSession().user.value === null) {
      return
    }
    const returnToPath = useRoute().query.redirect?.toString()
    const redirectTo = returnToPath ?? publicConfig.redirect.home
    await nuxtApp.callHook('auth:loggedIn', true)
    await navigateTo(redirectTo)
  }

  /**
   * Logs the user out by calling the 'auth:loggedIn' hook with the value 'false',
   * setting the token value to null, and navigating to the logout page if the code
   * is running on the client side.
   *
   * @return {Promise<void>} A promise that resolves when the logout process is complete.
   */
  async function _onLogout(): Promise<void> {
    await nuxtApp.callHook('auth:loggedIn', false)
    token.value = null
    if (import.meta.client) {
      await navigateTo(publicConfig.redirect.logout, { external: true })
    }
  }

  /**
   * Registers a new user by sending a POST request to the '/api/auth/register' endpoint.
   *
   * @param {RegisterInput} input - The input object containing the user's name, email, and password.
   * @return {Promise<ResponseOK>} - A promise that resolves to a ResponseOK object if the registration is successful.
   */
  async function register(input: RegisterInput): Promise<ResponseOK> {
    return await $fetch<ResponseOK>('/api/auth/register', {
      baseURL: publicConfig.backendBaseUrl,
      method: 'POST',
      body: {
        name: input.name,
        email: input.email,
        password: input.password,
      },
      credentials: 'omit',
      async  onResponseError({ response }) {
        await nuxtApp.callHook('auth:fetchError', response)
      },
    })
  }

  /**
   * Sends a request to reset the user's password.
   *
   * @param {string} email - The email address of the user.
   * @return {Promise<ResponseOK>} A Promise that resolves to the response from the server.
   */
  async function requestPasswordReset(email: string): Promise<ResponseOK> {
    return await $fetch<ResponseOK>('/api/auth/password/request', {
      baseURL: publicConfig.backendBaseUrl,
      method: 'POST',
      credentials: 'omit',
      body: {
        email,
      },
      async  onResponseError({ response }) {
        await nuxtApp.callHook('auth:fetchError', response)
      },
    })
  }

  /**
   * Resets the user's password.
   *
   * @param {string} password - The new password for the user.
   * @return {Promise<ResponseOK>} A Promise that resolves to the response from the server.
   */
  async function resetPassword(password: string): Promise<ResponseOK> {
    return await $fetch<ResponseOK>('/api/auth/password/reset', {
      baseURL: publicConfig.backendBaseUrl,
      method: 'PUT',
      credentials: 'omit',
      body: {
        password,
        token: useRoute().query.token,
      },
      async  onResponseError({ response }) {
        await nuxtApp.callHook('auth:fetchError', response)
      },
    })
  }

  /**
   * Sends a request to verify the user's email address.
   *
   * @param {string} email - The email address of the user.
   * @return {Promise<ResponseOK>} A Promise that resolves to the response from the server.
   */
  async function requestEmailVerify(email: string): Promise<ResponseOK> {
    return await $fetch<ResponseOK>('/api/auth/email/request', {
      baseURL: publicConfig.backendBaseUrl,
      method: 'POST',
      credentials: 'omit',
      body: {
        email,
      },
      async  onResponseError({ response }) {
        await nuxtApp.callHook('auth:fetchError', response)
      },
    })
  }

  /**
   * Changes the user's password.
   *
   * @param {ChangePasswordInput} input - An object containing the current password and the new password.
   * @return {Promise<ResponseOK>} - A promise that resolves to a ResponseOK object if the password change is successful.
   */
  function changePassword(input: ChangePasswordInput): Promise<ResponseOK> {
    return nuxtApp.$auth.fetch<ResponseOK>('/api/auth/password/change', {
      method: 'PUT',
      body: {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      },
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
    _onLogout,
  }
}
