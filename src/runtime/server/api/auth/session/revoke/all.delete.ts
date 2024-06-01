import { defineEventHandler } from 'h3'
import { handleError } from '../../../../utils'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth

    if (!auth) {
      throw new Error('unauthorized')
    }

    await event.context._authAdapter.refreshToken.deleteManyByUserId(auth.userId, auth.sessionId)

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
