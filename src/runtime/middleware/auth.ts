import { useAuthToken } from '../composables/useAuthToken'
import type { PublicConfig } from '../types'
import { defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig

  if (
    to.path === publicConfig.redirect.login ||
    to.path === publicConfig.redirect.callback
  ) {
    return
  }

  const isPageFound = to.matched.length > 0
  const isDisabled = publicConfig.enableGlobalAuthMiddleware && to.meta.auth === false

  if (isDisabled || (!isPageFound && import.meta.server)) {
    return
  }

  if (!useAuthToken().value) {
    return navigateTo({
      path: publicConfig.redirect.login,
      query: { redirect: to.path }
    })
  }
})
