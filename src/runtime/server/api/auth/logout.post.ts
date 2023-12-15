import { defineEventHandler } from 'h3'
import {
  deleteRefreshTokenCookie,
  deleteProviderTokenCookie,
  getRefreshTokenFromCookie,
  verifyRefreshToken,
  deleteRefreshToken,
  handleError
} from '../../utils'

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(event)

    const payload = await verifyRefreshToken(event, refreshToken ?? '')

    await deleteRefreshToken(event, payload.id)

    deleteRefreshTokenCookie(event)
    deleteProviderTokenCookie(event)

    return { status: 'ok' }
  } catch (error) {
    deleteRefreshTokenCookie(event)
    deleteProviderTokenCookie(event)

    await handleError(error)
  }
})
