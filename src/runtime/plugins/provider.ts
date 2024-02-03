import { defu } from 'defu'
import {
  defineNuxtPlugin,
  useAuthSession,
  useRequestHeaders,
  useRuntimeConfig
} from '#imports'

export default defineNuxtPlugin(() => {
  const publicConfig = useRuntimeConfig().public.auth
  const userAgent = useRequestHeaders(['user-agent'])['user-agent']

  /**
   * A $fetch instance with auto authorization handler
   */
  const fetch = $fetch.create({
    baseURL: publicConfig.backendBaseUrl,

    async onRequest ({ options }) {
      const accessToken = await useAuthSession().getAccessToken()

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
