import { defineEventHandler } from 'h3'
import { getConfig, createAccessToken, getRefreshTokenFromCookie, setRefreshTokenCookie, updateRefreshToken, verifyRefreshToken, deleteRefreshTokenCookie, handleError, createUnauthorizedError, createCustomError } from '../../../utils'

export default defineEventHandler(async (event) => {
  try {
    const config = getConfig()

    const refreshToken = getRefreshTokenFromCookie(event)

    if (!refreshToken) {
      throw createUnauthorizedError()
    }

    const payload = await verifyRefreshToken(event, refreshToken)

    const user = await event.context._authAdapter.user.findById(payload.userId)

    if (!user) {
      throw createUnauthorizedError()
    }

    if (user.suspended) {
      throw createCustomError(403, 'Account suspended')
    }

    if (!user.verified && config.private.registration.requireEmailVerification) {
      throw createCustomError(403, 'Account not verified')
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
