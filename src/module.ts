import { defineNuxtModule } from '@nuxt/kit'
import { name, version } from '../package.json'
import type { PrivateConfig, PublicConfig } from './runtime/types'
import { setupBackend } from './setup/backend'
import { setupFrontend } from './setup/frontend'

export type ModuleOptions = PrivateConfig & PublicConfig

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    compatibility: {
      nuxt: '^3.8.2',
    },
    configKey: 'auth',
  },

  defaults: {
    backendEnabled: true,
    backendBaseUrl: '/',
    baseUrl: '',
    enableGlobalAuthMiddleware: false,
    loggedInFlagName: 'auth_logged_in',
    accessToken: {
      jwtSecret: '',
      maxAge: 15 * 60,
    },
    refreshToken: {
      cookieName: 'auth_refresh_token',
      jwtSecret: '',
      maxAge: 7 * 24 * 60 * 60,
    },
    redirect: {
      login: '',
      logout: '',
      home: '',
      callback: '',
      passwordReset: '',
      emailVerify: '',
    },
    registration: {
      enabled: true,
      defaultRole: 'user',
      requireEmailVerification: true,
      passwordValidationRegex: '^.+$',
      emailValidationRegex: '^.+$',
    },
    email: {
      actionTimeout: 30 * 60,
      from: '',
      provider: {
        name: 'hook',
      },
    },
  },

  setup(options, nuxt) {
    setupFrontend(options, nuxt)

    if (options.backendEnabled) {
      setupBackend(options, nuxt)
    }
  },
})
