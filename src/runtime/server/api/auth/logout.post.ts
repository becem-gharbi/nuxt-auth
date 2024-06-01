import { defineEventHandler } from 'h3'
import { deleteRefreshTokenCookie, getRefreshTokenFromCookie, verifyRefreshToken, handleError } from '../../utils'

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(event)

    const payload = await verifyRefreshToken(event, refreshToken ?? '')

    await event.context._authAdapter.refreshToken.delete(payload.id)

    deleteRefreshTokenCookie(event)

    return { status: 'ok' }
  }
  catch (error) {
    deleteRefreshTokenCookie(event)

    await handleError(error)
  }
})
