import { fileURLToPath } from 'url'
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImports,
  addServerHandler,
  addTemplate,
  logger,
  addServerPlugin
} from '@nuxt/kit'
import { defu } from 'defu'
import type { PrismaClient } from '@prisma/client'
import { name, version } from '../package.json'
import type {
  PublicConfig,
  PrivateConfig,
  AccessTokenPayload
} from './runtime/types'

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

    backendBaseUrl: '',

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

    loggedInFlagName: 'auth_logged_in',

    // @ts-ignore
    email: {
      from: 'nuxt-auth',
      templates: {
        emailVerify: `
        <!DOCTYPE html><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><style>@font-face{font-family:Inter;font-style:normal;font-weight:400;mso-font-alt:Verdana;src:url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2')}*{font-family:Inter,Verdana}</style><style>blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}</style></head><body><table align="center" width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin-left:auto;margin-right:auto;padding:.5rem"><tbody><tr style="width:100%"><td><p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">Hello {{name}}</p><p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">We have received a request to verify your email address. If you haven't made this request please ignore the following email. Otherwise, to complete the process, click the following link.</p><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:0px;margin-bottom:20px;text-align:left;"><tbody><tr><td><a href="{{link}}" style="border: 2px solid;line-height: 1.25rem;text-decoration: none;display: inline-block;max-width: 100%;font-size: 0.875rem;font-weight: 500;text-decoration-line: none;color: #109c0d;background-color: transparent;border-color: #109c0d;padding: 10px 34px;border-radius: 6px;">
        <span></span>
        <span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">
        Verify email</span>
        <span></span>
        </a></td></tr></tbody></table><hr style="width: 100%;border: none;border-top: 1px solid #eaeaea;margin-top: 32px;margin-bottom: 32px;"><p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">This link will expire in {{validityInMinutes}} minutes.</p></td></tr></tbody></table></body></html>
        `,
        passwordReset: `
        <!DOCTYPE html><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><style>@font-face{font-family:Inter;font-style:normal;font-weight:400;mso-font-alt:Verdana;src:url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2')}*{font-family:Inter,Verdana}</style><style>blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}</style></head><body><table align="center" width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin-left:auto;margin-right:auto;padding:.5rem"><tbody><tr style="width:100%"><td><p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">Hello {{name}}</p><p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">We have received a request to reset your password. If you haven't made this request please ignore the following email. Otherwise, to complete the process, click the following link.</p><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:0px;margin-bottom:20px;text-align:left;"><tbody><tr><td><a href="{{link}}" style="border: 2px solid;line-height: 1.25rem;text-decoration: none;display: inline-block;max-width: 100%;font-size: 0.875rem;font-weight: 500;text-decoration-line: none;color: #109c0d;background-color: transparent;border-color: #109c0d;padding: 10px 34px;border-radius: 6px;">
        <span></span>
        <span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">
        Reset password</span>
        <span></span>
        </a></td></tr></tbody></table><hr style="width: 100%;border: none;border-top: 1px solid #eaeaea;margin-top: 32px;margin-bottom: 32px;"><p style="font-size: 15px;line-height: 24px;margin: 16px 0;margin-top: 0px;margin-bottom: 20px;color: rgb(55, 65, 81);-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;text-align: left;">This link will expire in {{validityInMinutes}} minutes.</p></td></tr></tbody></table></body></html>
        `
      }
    }
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
        backendEnabled: options.backendEnabled,
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
        accessToken: options.accessToken,

        refreshToken: options.refreshToken,

        email: options.email,

        oauth: options.oauth,

        prisma: options.prisma,

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

    // Add server plugins
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

declare module '#app' {
  interface NuxtApp {
    $auth: {
      fetch: typeof $fetch
    };
  }
  interface RuntimeNuxtHooks {
    'auth:loggedIn': (state: boolean) => void;
  }
}

declare module 'h3' {
  interface H3EventContext {
    prisma: PrismaClient;
    auth: AccessTokenPayload | undefined;
  }
}
