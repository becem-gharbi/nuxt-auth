import type { FetchError } from 'ofetch'
import type { H3Error } from 'h3'
import type { AccessTokenPayload, MailMessage } from './common'
import type { Adapter } from './adapter'

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

export { }
