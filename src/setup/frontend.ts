import { addPlugin, createResolver, addImports } from '@nuxt/kit'
import { defu } from 'defu'
import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from '../runtime/types'
import { createRequiredError } from './utils'

export function setupFrontend(options: ModuleOptions, nuxt: Nuxt) {
  if (!options.redirect.login) {
    throw createRequiredError('redirect.login')
  }

  if (!options.redirect.logout) {
    throw createRequiredError('redirect.logout')
  }

  if (!options.redirect.home) {
    throw createRequiredError('redirect.home')
  }

  if (!options.baseUrl) {
    throw createRequiredError('baseUrl')
  }

  if (options.backendEnabled === false && !options.backendBaseUrl) {
    throw createRequiredError('backendBaseUrl')
  }

  // Initialize the module options
  nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
    app: {},
    auth: {
      refreshToken: options.refreshToken,
    },
    public: {
      auth: {
        backendBaseUrl: options.backendBaseUrl,
        baseUrl: options.baseUrl,
        enableGlobalAuthMiddleware: options.enableGlobalAuthMiddleware,
        loggedInFlagName: options.loggedInFlagName,
        redirect: options.redirect,
      },
    },
  })

  const { resolve } = createResolver(import.meta.url)

  // Add nuxt plugins
  addPlugin(resolve('../runtime/plugins/provider'), { append: true })
  addPlugin(resolve('../runtime/plugins/flow'), { append: true })

  // Add composables
  addImports([
    {
      name: 'useAuth',
      from: resolve('../runtime/composables/useAuth'),
    },
    {
      name: 'useAuthSession',
      from: resolve('../runtime/composables/useAuthSession'),
    },
  ])
}
