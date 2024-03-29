import type { H3Event } from 'h3'
import type { NitroApp } from 'nitropack'
import { getAccessTokenFromHeader, verifyAccessToken } from '../utils'
// @ts-ignore
// eslint-disable-next-line import/named
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp:NitroApp) => {
  nitroApp.hooks.hook('request', async (event: H3Event) => {
    const accessToken = getAccessTokenFromHeader(event)

    if (accessToken) {
      await verifyAccessToken(event, accessToken)
        .then(p => (event.context.auth = p))
        .catch()
    }
  })
})
