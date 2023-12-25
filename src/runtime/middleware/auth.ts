import type { PublicConfig } from '../types'
import { useAuthToken } from '../composables/useAuthToken'
import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo
} from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig

  if (
    to.path === publicConfig.redirect.login ||
    to.path === publicConfig.redirect.callback
  ) {
    return
  }

  if (publicConfig.enableGlobalAuthMiddleware === true) {
    if (to.meta.auth === false) {
      return
    }
  }

  if (!useAuthToken().value) {
    return navigateTo({
      path: publicConfig.redirect.login,
      query: { redirect: to.path }
    })
  }
})
