import { defu } from 'defu'
import {
  defineNuxtPlugin,
  useAuth,
  useAuthSession,
  useRequestHeaders,
  useRuntimeConfig
} from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    addEventListener('storage', (event) => {
      const loggedInName = useRuntimeConfig().public.auth.loggedInFlagName

      if (event.key === loggedInName) {
        if (event.oldValue === 'true' && event.newValue === 'false') {
          useAuth()._onLogout()
        }
      }
    })
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
        fetch
      }
    }
  }
})
