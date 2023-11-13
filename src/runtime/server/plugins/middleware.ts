import { getAccessTokenFromHeader, verifyAccessToken } from '#auth'
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    const accessToken = getAccessTokenFromHeader(event)

    if (accessToken) {
      await verifyAccessToken(accessToken)
        .then(p => (event.context.auth = p))
        .catch()
    }
  })
})
