import { defineEventHandler } from 'h3'
import { handleError, createUnauthorizedError } from '../../utils'

export default defineEventHandler(async (event) => {
  try {
    const authData = event.context.auth.data

    if (!authData) {
      throw createUnauthorizedError()
    }

    const sessions = await event.context.auth.adapter.session.findManyByUserId(authData.userId)

    return {
      active: sessions,
      current: sessions.find(session => session.id === authData.sessionId),
    }
  }
  catch (error) {
    await handleError(error)
  }
})
