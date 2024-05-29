import { defineEventHandler } from 'h3'
import { handleError, deleteManyRefreshTokenByUser } from '../../../../utils'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth

    if (!auth) {
      throw new Error('unauthorized')
    }

    await deleteManyRefreshTokenByUser(event, auth.userId, auth.sessionId)

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
