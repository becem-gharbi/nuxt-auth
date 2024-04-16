import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import { resolve as resolveAbsolute } from 'path'
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
      nuxt: '^3.8.2'
    },
    configKey: 'auth'
  },

  defaults: {
    backendEnabled: true,
    backendBaseUrl: '/',

    baseUrl: '',

    accessToken: {
      jwtSecret: '',
      maxAge: 15 * 60
    },

    refreshToken: {
      cookieName: 'auth_refresh_token',
      jwtSecret: '',
      maxAge: 7 * 24 * 60 * 60
    },

    enableGlobalAuthMiddleware: false,

    redirect: {
      login: '',
      logout: '',
      home: '',
      callback: '',
      passwordReset: '',
      emailVerify: ''
    },

    registration: {
      enable: true,
      defaultRole: 'user',
      requireEmailVerification: true,
      passwordValidationRegex: ''
    },

    prisma: {},

    loggedInFlagName: 'auth_logged_in'
  },

  setup (options, nuxt) {
    if (!options.redirect.login) {
      logger.warn(`[${name}] Please make sure to set login redirect path`)
    }

    if (!options.redirect.logout) {
      logger.warn(`[${name}] Please make sure to set logout redirect path`)
    }

    if (!options.redirect.home) {
      logger.warn(`[${name}] Please make sure to set home redirect path`)
    }

    if (!options.baseUrl) {
      logger.warn(`[${name}] Please make sure to set baseUrl`)
    }

    // Initialize the module options
    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      app: {},

      auth: {
        refreshToken: options.refreshToken
      },

      public: {
        auth: {
          backendBaseUrl: options.backendBaseUrl,
          baseUrl: options.baseUrl,
          enableGlobalAuthMiddleware: options.enableGlobalAuthMiddleware,
          loggedInFlagName: options.loggedInFlagName,
          redirect: {
            login: options.redirect.login,
            logout: options.redirect.logout,
            home: options.redirect.home,
            callback: options.redirect.callback,
            passwordReset: options.redirect.passwordReset,
            emailVerify: options.redirect.emailVerify
          }
        }
      }
    })

    // Get the runtime directory
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    // Add nuxt plugins
    addPlugin(resolve(runtimeDir, 'plugins/provider'), { append: true })
    addPlugin(resolve(runtimeDir, 'plugins/flow'), { append: true })

    // Add composables
    addImports([
      {
        name: 'useAuth',
        from: resolve(runtimeDir, 'composables/useAuth')
      },
      {
        name: 'useAuthFetch',
        from: resolve(runtimeDir, 'composables/useAuthFetch')
      },
      {
        name: 'useAuthSession',
        from: resolve(runtimeDir, 'composables/useAuthSession')
      }
    ])

    if (options.backendEnabled === false) {
      if (!options.backendBaseUrl) {
        logger.warn(`[${name}] Please make sure to set backendBaseUrl`)
      }
      return
    }

    /* **************************************************************************** */
    /* ************************** Setup Built-in Backend ************************** */
    /* **************************************************************************** */

    if (!options.refreshToken.jwtSecret) {
      logger.warn(`[${name}] Please make sure to set refresh token's secret`)
    }

    if (!options.accessToken.jwtSecret) {
      logger.warn(`[${name}] Please make sure to set access token's secret`)
    }

    if (!options.registration?.enable) {
      logger.warn(`[${name}] Registration is disabled`)
    }

    if (!options.oauth && !options.email?.provider) {
      logger.warn(`[${name}] Please make sure to set email provider`)
    }

    // Initialize the module options
    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      app: {},
      public: {},

      auth: {
        backendEnabled: options.backendEnabled,

        accessToken: options.accessToken,

        refreshToken: options.refreshToken,

        email: options.email,

        oauth: options.oauth,

        prisma: options.prisma as any,

        registration: options.registration,

        webhookKey: options.webhookKey
      }
    })

    // Transpile CJS dependencies
    nuxt.options.build.transpile.push(runtimeDir, 'bcryptjs')

    // Add server utils
    nuxt.options.nitro = defu(
      {
        alias: {
          '#auth': resolve('./runtime/server/utils')
        }
      },
      nuxt.options.nitro
    )

    addTemplate({
      filename: 'types/auth.d.ts',
      getContents: () =>
        [
          "declare module '#auth' {",
          `  const encode: typeof import('${resolve(
            runtimeDir,
            'server/utils'
          )}').encode`,
          `  const decode: typeof import('${resolve(
            runtimeDir,
            'server/utils'
          )}').decode`,
          `  const compareSync: typeof import('${resolve(
            runtimeDir,
            'server/utils'
          )}').compareSync`,
          `  const hashSync: typeof import('${resolve(
            runtimeDir,
            'server/utils'
          )}').hashSync`,
          `  const sendMail: typeof import('${resolve(
            runtimeDir,
            'server/utils'
          )}').sendMail`,
          `  const handleError: typeof import('${resolve(
            runtimeDir,
            'server/utils'
          )}').handleError`,
          `  const getConfig: typeof import('${resolve(
            runtimeDir,
            'server/utils'
          )}').getConfig`,
          '}'
        ].join('\n')
    })

    // Register module types
    nuxt.hook('prepare:types', (options) => {
      options.references.push({
        path: resolve(nuxt.options.buildDir, 'types/auth.d.ts')
      })
    })

    if (options.prisma !== false) {
      const supportedEdges = [
        'cloudflare-pages',
        'netlify-edge',
        'vercel-edge',
        'cloudflare'
      ]
      const preset = nuxt.options.nitro.preset as string
      const isEdge = supportedEdges.includes(preset)

      if (preset && isEdge) {
        logger.info(`[${name}] Detected edge environment <${preset}>`)
        const prisma = resolve(runtimeDir, 'server/plugins/prisma.edge')
        addServerPlugin(prisma)
      } else {
        const prisma = resolve(runtimeDir, 'server/plugins/prisma')
        addServerPlugin(prisma)
      }
    }

    const middleware = resolve(runtimeDir, 'server/plugins/middleware')
    addServerPlugin(middleware)

    // Add server routes
    addServerHandler({
      route: '/api/auth/login',
      handler: resolve(runtimeDir, 'server/api/auth/login/index.post')
    })

    if (options.oauth) {
      addServerHandler({
        route: '/api/auth/login/:provider',
        handler: resolve(runtimeDir, 'server/api/auth/login/[provider].get')
      })

      addServerHandler({
        route: '/api/auth/login/:provider/callback',
        handler: resolve(
          runtimeDir,
          'server/api/auth/login/[provider]/callback.get'
        )
      })
    }

    if (options.registration.enable === true) {
      addServerHandler({
        route: '/api/auth/register',
        handler: resolve(runtimeDir, 'server/api/auth/register.post')
      })
    }

    addServerHandler({
      route: '/api/auth/me',
      handler: resolve(runtimeDir, 'server/api/auth/me.get')
    })

    addServerHandler({
      route: '/api/auth/logout',
      handler: resolve(runtimeDir, 'server/api/auth/logout.post')
    })

    if (options.email?.provider) {
      options.email.templates ||= {}

      if (options.email.templates.emailVerify) {
        if (options.email.templates.emailVerify.endsWith('.html')) {
          const emailVerifyPath = resolveAbsolute(nuxt.options.srcDir, options.email.templates.emailVerify)
          options.email.templates.emailVerify = readFileSync(emailVerifyPath, 'utf-8')
        }
      } else {
        const emailVerifyPath = resolve(runtimeDir, 'templates/email_verification.html')
        options.email.templates.emailVerify = readFileSync(emailVerifyPath, 'utf-8')
      }

      if (options.email.templates.passwordReset) {
        if (options.email.templates.passwordReset.endsWith('.html')) {
          const passwordResetPath = resolveAbsolute(nuxt.options.srcDir, options.email.templates.passwordReset)
          options.email.templates.passwordReset = readFileSync(passwordResetPath, 'utf-8')
        }
      } else {
        const passwordResetPath = resolve(runtimeDir, 'templates/password_reset.html')
        options.email.templates.passwordReset = readFileSync(passwordResetPath, 'utf-8')
      }

      addServerHandler({
        route: '/api/auth/password/request',
        handler: resolve(runtimeDir, 'server/api/auth/password/request.post')
      })

      addServerHandler({
        route: '/api/auth/email/request',
        handler: resolve(runtimeDir, 'server/api/auth/email/request.post')
      })

      addServerHandler({
        route: '/api/auth/email/verify',
        handler: resolve(runtimeDir, 'server/api/auth/email/verify.get')
      })

      addServerHandler({
        route: '/api/auth/password/reset',
        handler: resolve(runtimeDir, 'server/api/auth/password/reset.put')
      })
    }

    addServerHandler({
      route: '/api/auth/password/change',
      handler: resolve(runtimeDir, 'server/api/auth/password/change.put')
    })

    addServerHandler({
      route: '/api/auth/session/revoke/:id',
      handler: resolve(
        runtimeDir,
        'server/api/auth/session/revoke/[id].delete'
      )
    })

    addServerHandler({
      route: '/api/auth/session/revoke/all',
      handler: resolve(runtimeDir, 'server/api/auth/session/revoke/all.delete')
    })

    addServerHandler({
      route: '/api/auth/session/refresh',
      handler: resolve(runtimeDir, 'server/api/auth/session/refresh.post')
    })

    addServerHandler({
      route: '/api/auth/session',
      handler: resolve(runtimeDir, 'server/api/auth/session/index.get')
    })

    addServerHandler({
      route: '/api/auth/avatar',
      handler: resolve(runtimeDir, 'server/api/auth/avatar.get')
    })

    if (options.webhookKey) {
      addServerHandler({
        route: '/api/auth/session/revoke/expired',
        handler: resolve(
          runtimeDir,
          'server/api/auth/session/revoke/expired.delete'
        )
      })
    }
  }
})
