import { defineEventHandler } from 'h3'
import { handleError, createUnauthorizedError } from '../../../../utils'

export default defineEventHandler(async (event) => {
  try {
    const authData = event.context.auth.data

    if (!authData) {
      throw createUnauthorizedError()
    }

    await event.context.auth.adapter.refreshToken.deleteManyByUserId(authData.userId, authData.sessionId)

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
