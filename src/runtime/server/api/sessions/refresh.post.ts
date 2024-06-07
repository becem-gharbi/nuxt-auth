import { defineEventHandler } from 'h3'
import { createAccessToken, getRefreshTokenFromCookie, setRefreshTokenCookie, updateRefreshToken, verifyRefreshToken, deleteRefreshTokenCookie, handleError, createUnauthorizedError, checkUser } from '../../utils'

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(event)

    if (!refreshToken) {
      throw createUnauthorizedError()
    }

    const payload = await verifyRefreshToken(event, refreshToken)

    const user = await event.context.auth.adapter.user.findById(payload.userId)

    if (!user) {
      throw createUnauthorizedError()
    }

    checkUser(user)

    const newRefreshToken = await updateRefreshToken(event, payload.id, user.id)

    setRefreshTokenCookie(event, newRefreshToken)

    const sessionId = payload.id

    return createAccessToken(event, user, sessionId)
  }
  catch (error) {
    deleteRefreshTokenCookie(event)

    await handleError(error)
  }
})
