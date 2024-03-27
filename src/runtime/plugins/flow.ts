import common from '../middleware/common'
import auth from '../middleware/auth'
import guest from '../middleware/guest'
import { useAuthToken } from '../composables/useAuthToken'
import type { PublicConfig } from '../types'
import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useAuth,
  useRouter,
  useAuthSession
} from '#imports'

export default defineNuxtPlugin(async (nuxtApp) => {
  const publicConfig = nuxtApp.$config.public.auth as PublicConfig
  const router = useRouter()
  const token = useAuthToken()
  const { _loggedInFlag } = useAuthSession()

  addRouteMiddleware('common', common, { global: true })
  addRouteMiddleware('auth', auth, { global: publicConfig.enableGlobalAuthMiddleware })
  addRouteMiddleware('guest', guest)

  nuxtApp.hook('auth:loggedIn', (state) => { _loggedInFlag.value = state })

  /**
  * Makes sure to sync login status between tabs
  */
  nuxtApp.hook('app:mounted', () => {
    addEventListener('storage', (event) => {
      if (event.key === publicConfig.loggedInFlagName) {
        if (event.oldValue === 'true' && event.newValue === 'false' && token.value) {
          useAuth()._onLogout()
        } else if (event.oldValue === 'false' && event.newValue === 'true') {
          location.reload()
        }
      }
    })
  })

  function isFirstTime () {
    const isPageFound = router.currentRoute.value?.matched.length > 0
    const isPrerenderd = typeof nuxtApp.payload.prerenderedAt === 'number'
    const isServerRendered = nuxtApp.payload.serverRendered
    const isServerValid = import.meta.server && !isPrerenderd && isPageFound
    const isClientValid = import.meta.client && (!isServerRendered || isPrerenderd || !isPageFound)
    return isServerValid || isClientValid
  }

  function canFetchUser () {
    const isCallback = router.currentRoute.value?.path === publicConfig.redirect.callback
    const isCallbackValid = isCallback && !router.currentRoute.value?.query.error
    const isRefreshTokenExists = !!useAuthSession()._refreshToken.get()
    return isCallbackValid || _loggedInFlag.value || isRefreshTokenExists
  }

  /**
  * Makes sure to refresh access token and set user state if possible (run once)
  */
  if (isFirstTime() && canFetchUser()) {
    await useAuthSession()._refresh()
    if (token.value) {
      await useAuth().fetchUser()
    }
  }

  /**
  * Calls loggedIn hook and sets the loggedIn flag in localStorage
  */
  if (token.value) {
    await nuxtApp.callHook('auth:loggedIn', true)
  } else {
    _loggedInFlag.value = false
  }
})
