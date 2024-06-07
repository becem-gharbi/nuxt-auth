import { readFileSync } from 'node:fs'
import { resolve as resolveAbsolute } from 'node:path'
import { createResolver, addServerHandler, addTemplate } from '@nuxt/kit'
import { defu } from 'defu'
import type { Nuxt } from '@nuxt/schema'
import { warnRequiredOption, info } from './utils'
import type { ModuleOptions } from './runtime/types/config'

export function setupBackend(options: ModuleOptions, nuxt: Nuxt) {
  if (!options.backendEnabled) {
    throw new Error('Backend should be enabled')
  }

  if (!options.refreshToken.jwtSecret) {
    warnRequiredOption('refreshToken.jwtSecret')
  }

  if (!options.accessToken.jwtSecret) {
    warnRequiredOption('accessToken.jwtSecret')
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

  const { resolve } = createResolver(import.meta.url)

  // Add server utils
  nuxt.options.nitro = defu(nuxt.options.nitro,
    {
      alias: {
        '#auth_utils': resolve('./runtime/server/utils'),
      },
    },
  )

  addTemplate({
    filename: 'types/auth_utils.d.ts',
    getContents: () =>
      [
        'declare module \'#auth_utils\' {',
          `  const checkUser: typeof import('${resolve('./runtime/server/utils')}').checkUser`,
          `  const encode: typeof import('${resolve('./runtime/server/utils')}').encode`,
          `  const decode: typeof import('${resolve('./runtime/server/utils')}').decode`,
          `  const compareSync: typeof import('${resolve('./runtime/server/utils')}').compareSync`,
          `  const hashSync: typeof import('${resolve('./runtime/server/utils')}').hashSync`,
          `  const sendMail: typeof import('${resolve('./runtime/server/utils')}').sendMail`,
          `  const handleError: typeof import('${resolve('./runtime/server/utils')}').handleError`,
          `  const setEventContext: typeof import('${resolve('./runtime/server/utils')}').setEventContext`,
          `  const defineAdapter: typeof import('${resolve('./runtime/server/utils')}').defineAdapter`,
          `  const definePrismaAdapter: typeof import('${resolve('./runtime/server/utils')}').definePrismaAdapter`,
          `  const defineUnstorageAdapter: typeof import('${resolve('./runtime/server/utils')}').defineUnstorageAdapter`,
          '}',
      ].join('\n'),
  })

  nuxt.hook('prepare:types', (options) => {
    options.references.push({
      path: resolve(nuxt.options.buildDir, 'types/auth_utils.d.ts'),
    })
  })

  // Add server routes
  addServerHandler({
    route: '/api/auth/login',
    handler: resolve('./runtime/server/api/login/index.post'),
  })

  addServerHandler({
    route: '/api/auth/register',
    handler: resolve('./runtime/server/api/register.post'),
  })

  addServerHandler({
    route: '/api/auth/me',
    handler: resolve('./runtime/server/api/me.get'),
  })

  addServerHandler({
    route: '/api/auth/logout',
    handler: resolve('./runtime/server/api/logout.post'),
  })

  addServerHandler({
    route: '/api/auth/password/change',
    handler: resolve('./runtime/server/api/password/change.put'),
  })

  addServerHandler({
    route: '/api/auth/sessions/:id',
    handler: resolve('./runtime/server/api/sessions/[id].delete'),
  })

  addServerHandler({
    route: '/api/auth/sessions',
    handler: resolve('./runtime/server/api/sessions/index.delete'),
  })

  addServerHandler({
    route: '/api/auth/sessions/refresh',
    handler: resolve('./runtime/server/api/sessions/refresh.post'),
  })

  addServerHandler({
    route: '/api/auth/sessions',
    handler: resolve('./runtime/server/api/sessions/index.get'),
  })

  addServerHandler({
    route: '/api/auth/avatar',
    handler: resolve('./runtime/server/api/avatar.get'),
  })

  if (!options.registration.enabled) {
    info('Registration is disabled')
  }

  if (options.oauth && Object.keys(options.oauth).length) {
    if (options.redirect.callback) {
      addServerHandler({
        route: '/api/auth/login/:provider',
        handler: resolve('./runtime/server/api/login/[provider].get'),
      })

      addServerHandler({
        route: '/api/auth/login/:provider/callback',
        handler: resolve('./runtime/server/api/login/[provider]/callback.get'),
      })
    }
    else {
      warnRequiredOption('redirect.callback')
    }
  }
  else {
    info('Oauth login is disabled')
  }

  if (options.email?.from) {
    if (options.redirect.passwordReset) {
      addServerHandler({
        route: '/api/auth/password/request',
        handler: resolve('./runtime/server/api/password/request.post'),
      })

      addServerHandler({
        route: '/api/auth/password/reset',
        handler: resolve('./runtime/server/api/password/reset.put'),
      })
    }
    else {
      warnRequiredOption('redirect.passwordReset')
    }

    if (options.redirect.emailVerify) {
      addServerHandler({
        route: '/api/auth/email/request',
        handler: resolve('./runtime/server/api/email/request.post'),
      })

      addServerHandler({
        route: '/api/auth/email/verify',
        handler: resolve('./runtime/server/api/email/verify.get'),
      })
    }
    else {
      warnRequiredOption('redirect.emailVerify')
    }

    options.email.templates ||= {}

    if (options.email.templates.emailVerify) {
      const emailVerifyPath = resolveAbsolute(nuxt.options.srcDir, options.email.templates.emailVerify)
      options.email.templates.emailVerify = readFileSync(emailVerifyPath, 'utf-8')
    }
    else {
      const emailVerifyPath = resolve('./runtime/templates/email_verification.html')
      options.email.templates.emailVerify = readFileSync(emailVerifyPath, 'utf-8')
    }

    if (options.email.templates.passwordReset) {
      const passwordResetPath = resolveAbsolute(nuxt.options.srcDir, options.email.templates.passwordReset)
      options.email.templates.passwordReset = readFileSync(passwordResetPath, 'utf-8')
    }
    else {
      const passwordResetPath = resolve('./runtime/templates/password_reset.html')
      options.email.templates.passwordReset = readFileSync(passwordResetPath, 'utf-8')
    }
  }
  else {
    info('Email verification and password reset are disabled')
  }
}
