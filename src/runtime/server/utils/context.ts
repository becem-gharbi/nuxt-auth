import type { H3Event } from 'h3'
import { getAccessTokenFromHeader, verifyAccessToken } from './token/accessToken'
import type { Adapter } from '#build/types/auth_adapter'

export async function setEventContext(event: H3Event, adapter: Adapter) {
  if (!adapter) {
    throw new Error('[nuxt-auth] Adapter not defined')
  }

  event.context.auth = { adapter }

  const accessToken = getAccessTokenFromHeader(event)

  if (accessToken) {
    await verifyAccessToken(event, accessToken)
      .then((p) => { event.context.auth.data = p })
      .catch(() => { })
  }
}
