import { useAuthToken } from '../composables/useAuthToken'
import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo,
  useNuxtApp
} from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const publicConfig = useRuntimeConfig().public.auth

  if (
    to.path === publicConfig.redirect.login ||
    to.path === publicConfig.redirect.callback
  ) {
    return
  }

  // Makes sure no infinite redirections on ssr error
  const isSSRError = process.server && typeof useNuxtApp().payload.error !== 'undefined'

  if (isSSRError || (publicConfig.enableGlobalAuthMiddleware && to.meta.auth === false)) {
    return
  }

  if (!useAuthToken().value) {
    return navigateTo({
      path: publicConfig.redirect.login,
      query: { redirect: to.path }
    })
  }
})
