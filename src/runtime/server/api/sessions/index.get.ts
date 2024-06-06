import { defineEventHandler } from 'h3'
import { handleError, createUnauthorizedError } from '../../utils'
import type { Session } from '../../../types/common'

export default defineEventHandler(async (event) => {
  try {
    const authData = event.context.auth.data

    if (!authData) {
      throw createUnauthorizedError()
    }

    const refreshTokens = await event.context.auth.adapter.refreshToken.findManyByUserId(authData.userId)

    return refreshTokens.map<Session>(token => ({
      id: token.id,
      current: token.id === authData.sessionId,
      ua: token.userAgent,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt,
    }))
  }
  catch (error) {
    await handleError(error)
  }
})
