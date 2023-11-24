import { defineEventHandler, getRequestHeader } from 'h3'
import { getConfig, handleError, deleteManyRefreshTokenExpired } from '../../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    const webhookKey = config.private.webhookKey

    if (getRequestHeader(event, 'Webhook-Key') !== webhookKey) {
      throw new Error('unauthorized')
    }

    await deleteManyRefreshTokenExpired(event)

    return { status: 'ok' }
  } catch (error) {
    await handleError(error)
  }
})
