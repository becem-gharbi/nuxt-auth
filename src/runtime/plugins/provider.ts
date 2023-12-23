import { defu } from 'defu'
import {
  defineNuxtPlugin,
  useAuthSession,
  useRequestHeaders
} from '#imports'

export default defineNuxtPlugin(() => {
  const userAgent = useRequestHeaders(['user-agent'])['user-agent']

  /**
   * A $fetch instance with auto authorization handler
   */
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
