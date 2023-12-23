import common from '../middleware/common'
import auth from '../middleware/auth'
import guest from '../middleware/guest'
import { useAuthToken } from '../composables/useAuthToken'
import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useRuntimeConfig,
  useState,
  useAuth,
  useRoute,
  useAuthSession
} from '#imports'

export default defineNuxtPlugin(async (nuxtApp) => {
  try {
    const publicConfig = useRuntimeConfig().public.auth

    addRouteMiddleware('common', common, { global: true })
    addRouteMiddleware('auth', auth, { global: publicConfig.enableGlobalAuthMiddleware })
    addRouteMiddleware('guest', guest)

    const initialized = useState('auth-initialized', () => false)
    const { _loggedIn } = useAuthSession()

    if (initialized.value === false) {
      initialized.value = true

      const { path } = useRoute()
      const { fetchUser } = useAuth()
      const token = useAuthToken()

      if (token.value) {
        await fetchUser()
      } else {
        const isCallback = path === publicConfig.redirect.callback
        const isLoggedIn = _loggedIn.get() === 'true'
        const { _refreshToken, _refresh } = useAuthSession()

        if (isCallback || isLoggedIn || _refreshToken.get()) {
          await _refresh()
          if (token.value) {
            await fetchUser()
          }
        }
      }
    }

    const { user } = useAuthSession()

    if (user.value) {
      _loggedIn.set(true)
      await nuxtApp.callHook('auth:loggedIn', true)
    } else {
      _loggedIn.set(false)
    }

    nuxtApp.hook('app:mounted', () => {
      addEventListener('storage', (event) => {
        if (event.key === publicConfig.loggedInFlagName) {
          if (event.oldValue === 'true' && event.newValue === 'false') {
            useAuth()._onLogout()
          } else if (event.oldValue === 'false' && event.newValue === 'true') {
            location.reload()
          }
        }
      })
    })
  } catch (e) {}
})
