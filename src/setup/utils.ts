export function createRequiredError(field: string) {
  throw new Error(`[nuxt-auth] config option '${field}' is required`)
}
