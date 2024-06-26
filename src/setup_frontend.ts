import { addPlugin, createResolver, addImports, addRouteMiddleware } from '@nuxt/kit'
import { defu } from 'defu'
import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from './runtime/types/config'
import { warnRequiredOption } from './utils'

export function setupFrontend(options: ModuleOptions, nuxt: Nuxt) {
  if (!options.redirect.login) {
    warnRequiredOption('redirect.login')
  }

  if (!options.redirect.logout) {
    warnRequiredOption('redirect.logout')
  }

  if (!options.redirect.home) {
    warnRequiredOption('redirect.home')
  }

  if (!options.baseUrl) {
    warnRequiredOption('baseUrl')
  }

  if (options.backendEnabled === false && !options.backendBaseUrl) {
    warnRequiredOption('backendBaseUrl')
  }

  // Initialize the module options
  nuxt.options.runtimeConfig.public = defu(nuxt.options.runtimeConfig.public, {
    auth: {
      backendBaseUrl: options.backendBaseUrl,
      baseUrl: options.baseUrl,
      enableGlobalAuthMiddleware: options.enableGlobalAuthMiddleware,
      loggedInFlagName: options.loggedInFlagName,
      redirect: options.redirect,
      refreshToken: {
        cookieName: options.refreshToken.cookieName,
      },
    },
  })

  const { resolve } = createResolver(import.meta.url)

  // Add nuxt plugins
  addPlugin(resolve('./runtime/plugins/provider'))
  addPlugin(resolve('./runtime/plugins/flow'))

  // Add composables
  addImports([
    {
      name: 'useAuth',
      from: resolve('./runtime/composables/useAuth'),
    },
    {
      name: 'useAuthSession',
      from: resolve('./runtime/composables/useAuthSession'),
    },
  ])

  addRouteMiddleware({
    name: 'auth',
    path: resolve('./runtime/middleware/auth'),
    global: !!options.enableGlobalAuthMiddleware,
  })

  addRouteMiddleware({
    name: 'guest',
    path: resolve('./runtime/middleware/guest'),
  })

  addRouteMiddleware({
    name: '_auth-common',
    path: resolve('./runtime/middleware/common'),
    global: true,
  })

  nuxt.options.alias = defu(nuxt.options.alias, {
    '#auth_adapter': resolve('./runtime/types/adapter.d.ts'),
  })
}
