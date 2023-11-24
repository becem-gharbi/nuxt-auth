import type { H3Event } from 'h3'
import { getAccessTokenFromHeader, verifyAccessToken } from '#auth'
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event: H3Event) => {
    if (event.path.startsWith('/api') === false) {
      return
    }

    const accessToken = getAccessTokenFromHeader(event)

    if (accessToken) {
      await verifyAccessToken(event, accessToken)
        .then(p => (event.context.auth = p))
        .catch()
    }
  })
})
