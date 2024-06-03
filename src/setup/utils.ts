import { logger } from '@nuxt/kit'

export function warnRequiredOption(field: string) {
  logger.warn(`[nuxt-auth] config option '${field}' is required`)
}
