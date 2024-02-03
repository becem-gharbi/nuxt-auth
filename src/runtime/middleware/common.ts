import { useAuthToken } from '../composables/useAuthToken'
import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo
} from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const publicConfig = useRuntimeConfig().public.auth

  if (
    to.path === publicConfig.redirect.login ||
    to.path === publicConfig.redirect.callback
  ) {
    if (useAuthToken().value) {
      const returnToPath = from.query.redirect?.toString()
      const redirectTo = returnToPath ?? publicConfig.redirect.home
      return navigateTo(redirectTo)
    }
  }
})
