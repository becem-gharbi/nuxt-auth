import { readFileSync } from 'node:fs'
import { resolve as resolveAbsolute } from 'node:path'
import { defineNuxtModule, addPlugin, createResolver, addImports, addServerHandler, addTemplate, logger, addServerPlugin } from '@nuxt/kit'
import { defu } from 'defu'
import { name, version } from '../package.json'

import type { PublicConfig, PrivateConfig } from './runtime/types'

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
      passwordValidationRegex: '',
    },
  },

  setup(options, nuxt) {
    if (!options.redirect.login) {
      logger.warn('[nuxt-auth] Please make sure to set login redirect path')
    }

    if (!options.redirect.logout) {
      logger.warn('[nuxt-auth] Please make sure to set logout redirect path')
    }

    if (!options.redirect.home) {
      logger.warn('[nuxt-auth] Please make sure to set home redirect path')
    }

    if (!options.baseUrl) {
      logger.warn('[nuxt-auth] Please make sure to set baseUrl')
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
    addPlugin(resolve('./runtime/plugins/provider'), { append: true })
    addPlugin(resolve('./runtime/plugins/flow'), { append: true })

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

    if (options.backendEnabled === false) {
      if (!options.backendBaseUrl) {
        logger.warn('[nuxt-auth] Please make sure to set backendBaseUrl')
      }
      return
    }

    /* **************************************************************************** */
    /* ************************** Setup Built-in Backend ************************** */
    /* **************************************************************************** */

    if (!options.refreshToken.jwtSecret) {
      logger.warn('[nuxt-auth] Please make sure to set refresh token\'s secret')
    }

    if (!options.accessToken.jwtSecret) {
      logger.warn('[nuxt-auth] Please make sure to set access token\'s secret')
    }

    if (!options.registration.enabled) {
      logger.warn('[nuxt-auth] Registration is disabled')
    }

    if (!options.oauth && !options.email?.provider) {
      logger.warn('[nuxt-auth] Please make sure to set email provider')
    }

    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      app: {},
      public: {},
      auth: {
        backendEnabled: options.backendEnabled,
        accessToken: options.accessToken,
        refreshToken: options.refreshToken,
        email: options.email,
        oauth: options.oauth,
        registration: options.registration,
      },
    })

    // Transpile CJS dependencies
    nuxt.options.build.transpile.push('bcryptjs')

    // Add server utils
    nuxt.options.nitro = defu(
      {
        alias: {
          '#auth': resolve('./runtime/server/utils'),
        },
      },
      nuxt.options.nitro,
    )

    addTemplate({
      filename: 'types/auth.d.ts',
      getContents: () =>
        [
          'declare module \'#auth\' {',
          `  const encode: typeof import('${resolve('./runtime/server/utils')}').encode`,
          `  const decode: typeof import('${resolve('./runtime/server/utils')}').decode`,
          `  const compareSync: typeof import('${resolve('./runtime/server/utils')}').compareSync`,
          `  const hashSync: typeof import('${resolve('./runtime/server/utils')}').hashSync`,
          `  const sendMail: typeof import('${resolve('./runtime/server/utils')}').sendMail`,
          `  const handleError: typeof import('${resolve('./runtime/server/utils')}').handleError`,
          `  const defineAdapter: typeof import('${resolve('./runtime/server/utils')}').defineAdapter`,
          '}',
        ].join('\n'),
    })

    nuxt.hook('prepare:types', (options) => {
      options.references.push({
        path: resolve(nuxt.options.buildDir, 'types/auth.d.ts'),
      })
    })

    const middleware = resolve('./runtime/server/plugins/middleware')
    addServerPlugin(middleware)

    // Add server routes
    addServerHandler({
      route: '/api/auth/login',
      handler: resolve('./runtime/server/api/auth/login/index.post'),
    })

    if (options.oauth) {
      addServerHandler({
        route: '/api/auth/login/:provider',
        handler: resolve('./runtime/server/api/auth/login/[provider].get'),
      })

      addServerHandler({
        route: '/api/auth/login/:provider/callback',
        handler: resolve('./runtime/server/api/auth/login/[provider]/callback.get'),
      })
    }

    if (options.registration.enabled === true) {
      addServerHandler({
        route: '/api/auth/register',
        handler: resolve('./runtime/server/api/auth/register.post'),
      })
    }

    addServerHandler({
      route: '/api/auth/me',
      handler: resolve('./runtime/server/api/auth/me.get'),
    })

    addServerHandler({
      route: '/api/auth/logout',
      handler: resolve('./runtime/server/api/auth/logout.post'),
    })

    if (options.email?.provider) {
      options.email.templates ||= {}

      if (options.email.templates.emailVerify?.endsWith('.html')) {
        const emailVerifyPath = resolveAbsolute(nuxt.options.srcDir, options.email.templates.emailVerify)
        options.email.templates.emailVerify = readFileSync(emailVerifyPath, 'utf-8')
      }
      else {
        const emailVerifyPath = resolve('./runtime/templates/email_verification.html')
        options.email.templates.emailVerify = readFileSync(emailVerifyPath, 'utf-8')
      }

      if (options.email.templates.passwordReset?.endsWith('.html')) {
        const passwordResetPath = resolveAbsolute(nuxt.options.srcDir, options.email.templates.passwordReset)
        options.email.templates.passwordReset = readFileSync(passwordResetPath, 'utf-8')
      }
      else {
        const passwordResetPath = resolve('./runtime/templates/password_reset.html')
        options.email.templates.passwordReset = readFileSync(passwordResetPath, 'utf-8')
      }

      addServerHandler({
        route: '/api/auth/password/request',
        handler: resolve('./runtime/server/api/auth/password/request.post'),
      })

      addServerHandler({
        route: '/api/auth/email/request',
        handler: resolve('./runtime/server/api/auth/email/request.post'),
      })

      addServerHandler({
        route: '/api/auth/email/verify',
        handler: resolve('./runtime/server/api/auth/email/verify.get'),
      })

      addServerHandler({
        route: '/api/auth/password/reset',
        handler: resolve('./runtime/server/api/auth/password/reset.put'),
      })
    }

    addServerHandler({
      route: '/api/auth/password/change',
      handler: resolve('./runtime/server/api/auth/password/change.put'),
    })

    addServerHandler({
      route: '/api/auth/session/revoke/:id',
      handler: resolve('./runtime/server/api/auth/session/revoke/[id].delete'),
    })

    addServerHandler({
      route: '/api/auth/session/revoke/all',
      handler: resolve('./runtime/server/api/auth/session/revoke/all.delete'),
    })

    addServerHandler({
      route: '/api/auth/session/refresh',
      handler: resolve('./runtime/server/api/auth/session/refresh.post'),
    })

    addServerHandler({
      route: '/api/auth/session',
      handler: resolve('./runtime/server/api/auth/session/index.get'),
    })

    addServerHandler({
      route: '/api/auth/avatar',
      handler: resolve('./runtime/server/api/auth/avatar.get'),
    })
  },
})
