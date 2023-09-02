import type { PublicConfig } from '../types'
import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo,
  useAuthSession
} from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const publicConfig = useRuntimeConfig().public.auth as PublicConfig

  if (
    to.path === publicConfig.redirect.login ||
    to.path === publicConfig.redirect.callback
  ) {
    return
  }

  const { user } = useAuthSession()

  if (user.value) {
    return navigateTo(publicConfig.redirect.home)
  }
})
