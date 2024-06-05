import { defineEventHandler } from 'h3'
import { deleteRefreshTokenCookie, getRefreshTokenFromCookie, verifyRefreshToken, handleError, createUnauthorizedError } from '../../utils'

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(event)

    if (!refreshToken) {
      throw createUnauthorizedError()
    }

    const payload = await verifyRefreshToken(event, refreshToken)

    await event.context._authAdapter.refreshToken.delete(payload.id, payload.userId)

    deleteRefreshTokenCookie(event)

    return { status: 'ok' }
  }
  catch (error) {
    deleteRefreshTokenCookie(event)

    await handleError(error)
  }
})
