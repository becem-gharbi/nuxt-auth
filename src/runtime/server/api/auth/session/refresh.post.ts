import { defineEventHandler } from 'h3'
import { createAccessToken, getRefreshTokenFromCookie, setRefreshTokenCookie, updateRefreshToken, verifyRefreshToken, deleteRefreshTokenCookie, handleError } from '../../../utils'

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(event)

    const payload = await verifyRefreshToken(event, refreshToken ?? '')

    const user = await event.context._authAdapter.user.findById(payload.userId)

    if (!user) {
      throw new Error('unauthorized')
    }

    if (user.suspended) {
      throw new Error('account-suspended')
    }

    const newRefreshToken = await updateRefreshToken(event, payload.id, user.id)

    setRefreshTokenCookie(event, newRefreshToken)

    const sessionId = payload.id

    const accessToken = await createAccessToken(event, user, sessionId)

    return accessToken
  }
  catch (error) {
    deleteRefreshTokenCookie(event)

    await handleError(error)
  }
})
