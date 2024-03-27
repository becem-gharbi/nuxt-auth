import { defu } from 'defu'
import type { $Fetch } from 'ofetch'
import type { PublicConfig } from '../types'
import { defineNuxtPlugin, useAuthSession, useRequestHeaders } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const publicConfig = nuxtApp.$config.public.auth as PublicConfig
  const reqHeaders = useRequestHeaders(['user-agent'])

  /**
   * A $fetch instance with auto authorization handler
   */
  const fetch = $fetch.create({
    baseURL: publicConfig.backendBaseUrl,

    async onRequest ({ options }) {
      const accessToken = await useAuthSession().getAccessToken()

      if (accessToken) {
        options.headers = defu(options.headers, reqHeaders, {
          authorization: 'Bearer ' + accessToken
        })
      }

      options.credentials ||= 'omit'
    }
  })

  return {
    provide: {
      auth: {
        fetch: fetch as $Fetch,
        _refreshPromise: null
      }
    }
  }
})
