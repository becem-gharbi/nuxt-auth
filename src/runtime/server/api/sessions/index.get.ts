import { defineEventHandler } from 'h3'
import { handleError, createUnauthorizedError } from '../../utils'
import type { SessionOld } from '../../../types/common'

export default defineEventHandler(async (event) => {
  try {
    const authData = event.context.auth.data

    if (!authData) {
      throw createUnauthorizedError()
    }

    const sessions = await event.context.auth.adapter.session.findManyByUserId(authData.userId)

    return sessions.map<SessionOld>(session => ({
      id: session.id,
      current: session.id === authData.sessionId,
      ua: session.userAgent,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }))
  }
  catch (error) {
    await handleError(error)
  }
})
