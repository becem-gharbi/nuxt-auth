import type { PublicConfig } from '../types/config'
import { defineNuxtPlugin, useAuthSession, useRequestHeaders } from '#imports'

export default defineNuxtPlugin({
  name: 'auth:provider',
  enforce: 'post',

  setup: (nuxtApp) => {
    const publicConfig = nuxtApp.$config.public.auth as PublicConfig
    const reqHeaders = useRequestHeaders(['user-agent'])

    /**
     * A $fetch instance with auto authorization handler
     */
    const fetch = $fetch.create({
      baseURL: publicConfig.backendBaseUrl,

      async onRequest({ options }) {
        const accessToken = await useAuthSession().getAccessToken()

        if (accessToken) {
          for (const [key, value] of Object.entries(reqHeaders)) {
            if (value) options.headers.append(key, value)
          }

          options.headers.append('Authorization', 'Bearer ' + accessToken)
        }

        options.credentials ||= 'omit'
      },

      async onResponseError({ response }) {
        await nuxtApp.callHook('auth:fetchError', response)
      },
    })

    return {
      provide: {
        auth: {
          fetch,
          _refreshPromise: null,
        },
      },
    }
  },
})
