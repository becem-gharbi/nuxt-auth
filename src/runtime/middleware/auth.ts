import { useAuthToken } from '../composables/useAuthToken'
import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo
} from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const publicConfig = useRuntimeConfig().public.auth

  if (
    to.path === publicConfig.redirect.login ||
    to.path === publicConfig.redirect.callback
  ) {
    return
  }

  const isPageFound = to.matched.length > 0

  if ((!isPageFound && process.server) || (publicConfig.enableGlobalAuthMiddleware && to.meta.auth === false)) {
    return
  }

  if (!useAuthToken().value) {
    return navigateTo({
      path: publicConfig.redirect.login,
      query: { redirect: to.path }
    })
  }
})
