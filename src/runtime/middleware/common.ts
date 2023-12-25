import type { PublicConfig } from '../types'
import { useAuthToken } from '../composables/useAuthToken'
import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo
} from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig

  if (
    to.path === publicConfig.redirect.login ||
    to.path === publicConfig.redirect.callback
  ) {
    const token = useAuthToken()

    if (token.value) {
      const returnToPath = from.query.redirect?.toString()
      const redirectTo = returnToPath ?? publicConfig.redirect.home
      return navigateTo(redirectTo)
    }
  }
})
