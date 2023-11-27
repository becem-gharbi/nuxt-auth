import { defu } from 'defu'
import {
  defineNuxtPlugin,
  useAuth,
  useAuthSession,
  useRequestHeaders
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

  const userAgent = useRequestHeaders(['user-agent'])['user-agent']

  const fetch = $fetch.create({
    async onRequest ({ options }) {
      const { getAccessToken } = useAuthSession()

      const accessToken = await getAccessToken()

      options.headers = defu(options.headers, accessToken && {
        authorization: 'Bearer ' + accessToken,
        'user-agent': userAgent
      })

      options.credentials ||= 'omit'
    }
  })

  return {
    provide: {
      auth: {
        channel,
        fetch
      }
    }
  }
})
