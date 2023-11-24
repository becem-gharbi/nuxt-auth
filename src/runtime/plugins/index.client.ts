import {
  defineNuxtPlugin,
  useAuth,
  useAuthSession
} from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('nuxt-auth')

  nuxtApp.hook('app:mounted', () => {
    const { user } = useAuthSession()
    const { _onLogout } = useAuth()

    if (channel) {
      channel.onmessage = (event) => {
        if (event.data === 'logout' && user.value) {
          _onLogout()
        }
      }
    }
  })

  return {
    provide: {
      auth: {
        channel
      }
    }
  }
})
