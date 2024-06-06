import type { FetchError } from 'ofetch'
import type { H3Error } from 'h3'
import type { Adapter, RefreshToken, User } from '#build/types/auth_adapter'

export interface Session {
  current: boolean
  id: RefreshToken['id']
  ua: RefreshToken['userAgent']
  updatedAt: RefreshToken['updatedAt']
  createdAt: RefreshToken['createdAt']
}

export type AccessTokenPayload = {
  fingerprint: string | null
  userId: User['id']
  sessionId: RefreshToken['id']
  userRole: User['role']
  provider: User['provider']
}

declare module 'h3' {
  interface H3EventContext {
    _authAdapter: Adapter
    auth?: AccessTokenPayload
  }
}

declare module 'nitropack' {
  interface NitroRuntimeHooks {
    'auth:email': (from: string, msg: MailMessage) => Promise<void> | void
  }
}

declare module '#app' {
  interface NuxtApp {
    $auth: {
      fetch: typeof $fetch
      _refreshPromise: Promise<void> | null
    }
  }
  interface RuntimeNuxtHooks {
    'auth:loggedIn': (state: boolean) => Promise<void> | void
    'auth:fetchError': (response: FetchError<H3Error>['response']) => Promise<void> | void
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: boolean
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $auth: {
      fetch: typeof $fetch
      _refreshPromise: Promise<void> | null
    }
  }
}

export type KnownErrors =
  'Unauthorized'
  | 'Account suspended'
  | 'Account not verified'
  | 'Wrong credentials'
  | 'Email already used'
  | 'Email not accepted'
  | 'Wrong password'
  | 'Password reset not requested'
  | 'Oauth name not accessible'
  | 'Oauth email not accessible'
  | 'Registration disabled'
  | 'Something went wrong'

export type MailMessage = {
  to: string
  subject: string
  html: string
}

export interface AuthenticationData {
  access_token: string
  expires_in: number
}

export interface ResponseOK {
  status: 'ok'
}
