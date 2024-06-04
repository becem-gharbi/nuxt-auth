import { defineEventHandler } from 'h3'
import { handleError, createUnauthorizedError } from '../../../utils'
import type { Session } from '#build/types/auth_adapter'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth

    if (!auth) {
      throw createUnauthorizedError()
    }

    const refreshTokens = await event.context._authAdapter.refreshToken.findManyByUserId(auth.userId)

    return refreshTokens.map<Session>(token => ({
      id: token.id,
      current: token.id === auth.sessionId,
      ua: token.userAgent,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt,
    }))
  }
  catch (error) {
    await handleError(error)
  }
})
