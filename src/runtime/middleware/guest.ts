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

  if (useAuthToken().value) {
    return navigateTo(publicConfig.redirect.home)
  }
})
