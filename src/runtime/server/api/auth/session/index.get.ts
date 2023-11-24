import { defineEventHandler } from 'h3'
import { handleError, findManyRefreshTokenByUser } from '../../../utils'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth

    if (!auth) {
      throw new Error('unauthorized')
    }

    const refreshTokens = await findManyRefreshTokenByUser(event, auth.userId)

    return { refreshTokens, current: auth.sessionId }
  } catch (error) {
    await handleError(error)
  }
})
