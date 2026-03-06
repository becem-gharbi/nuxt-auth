import { defineNitroPlugin } from 'nitropack/runtime'
import { consola } from 'consola'
import { getConfig } from '../utils'

function warnRequiredOption(field: string) {
  consola.warn(`[nuxt-auth] config option \`${field}\` is required`)
}

function info(message: string) {
  consola.info(`[nuxt-auth] ${message}`)
}

export default defineNitroPlugin(() => {
  const config = getConfig()

  if (!config.public.redirect.login) {
    warnRequiredOption('redirect.login')
  }

  if (!config.public.redirect.logout) {
    warnRequiredOption('redirect.logout')
  }

  if (!config.public.redirect.home) {
    warnRequiredOption('redirect.home')
  }

  if (!config.public.baseUrl) {
    warnRequiredOption('baseUrl')
  }

  if (!config.public.backendEnabled && !config.public.backendBaseUrl) {
    warnRequiredOption('backendBaseUrl')
  }

  if (!config.public.backendEnabled)
    return

  if (!config.private.registration.enabled) {
    info('Registration is disabled')
  }

  if (!config.private.refreshToken.jwtSecret) {
    warnRequiredOption('refreshToken.jwtSecret')
  }

  if (!config.private.accessToken.jwtSecret) {
    warnRequiredOption('accessToken.jwtSecret')
  }

  if (config.private.oauth) {
    for (const [provider, providerConfig] of Object.entries(config.private.oauth)) {
      if (!providerConfig.clientId)
        warnRequiredOption(`oauth.${provider}.clientId`)
      if (!providerConfig.clientSecret)
        warnRequiredOption(`oauth.${provider}.clientSecret`)
      if (!providerConfig.authorizeUrl)
        warnRequiredOption(`oauth.${provider}.authorizeUrl`)
      if (!providerConfig.tokenUrl)
        warnRequiredOption(`oauth.${provider}.tokenUrl`)
      if (!providerConfig.userUrl)
        warnRequiredOption(`oauth.${provider}.userUrl`)
    }
  }

  if (config.public.redirect.emailVerify || config.public.redirect.passwordReset) {
    if (!config.private.email?.from)
      warnRequiredOption('email.from')
  }
})
