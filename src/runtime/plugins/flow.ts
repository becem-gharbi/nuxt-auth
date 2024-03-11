import common from '../middleware/common'
import auth from '../middleware/auth'
import guest from '../middleware/guest'
import { useAuthToken } from '../composables/useAuthToken'
import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useRuntimeConfig,
  useAuth,
  useRouter,
  useAuthSession
} from '#imports'

export default defineNuxtPlugin(async (nuxtApp) => {
  try {
    const publicConfig = useRuntimeConfig().public.auth
    const router = useRouter()

    addRouteMiddleware('common', common, { global: true })
    addRouteMiddleware('auth', auth, { global: publicConfig.enableGlobalAuthMiddleware })
    addRouteMiddleware('guest', guest)

    const { _loggedInFlag } = useAuthSession()
    const token = useAuthToken()

    /**
     * Makes sure to refresh access token and set user state if possible (run once)
     */
    const isPageFound = router.currentRoute.value?.matched.length > 0
    const isPrerenderd = typeof nuxtApp.payload.prerenderedAt === 'number'
    const isServerRendered = nuxtApp.payload.serverRendered
    const firstTime = (process.server && !isPrerenderd && isPageFound) || (process.client && (!isServerRendered || isPrerenderd || !isPageFound))

    if (firstTime) {
      const isCallback = router.currentRoute.value?.path === publicConfig.redirect.callback
      const { _refreshToken, _refresh } = useAuthSession()

      if (isCallback || _loggedInFlag.value || _refreshToken.get()) {
        await _refresh()
        if (token.value) {
          await useAuth().fetchUser()
        }
      }
    }

    /**
     * Calls loggedIn hook and sets the loggedIn flag in localStorage
     */
    if (token.value) {
      _loggedInFlag.value = true
      await nuxtApp.callHook('auth:loggedIn', true)
    } else {
      _loggedInFlag.value = false
    }

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
  } catch (e) { }
})
