import { defineEventHandler } from 'h3'
import { handleError, createUnauthorizedError, getConfig } from '../../utils'
import type { Session } from '#auth_adapter'

export default defineEventHandler(async (event) => {
  try {
    const authData = event.context.auth.data

    if (!authData) {
      throw createUnauthorizedError()
    }

    const config = getConfig()
    const sessions = await event.context.auth.adapter.session.findManyByUserId(authData.userId)

    const expired: Session[] = []
    const active: Session[] = []

    sessions.forEach((session) => {
      const isExpired = new Date().getTime() - new Date(session.updatedAt).getTime() > config.private.refreshToken.maxAge! * 1000
      isExpired ? expired.push(session) : active.push(session)
    })

    await Promise.all(expired.map(session => event.context.auth.adapter.session.delete(session.id, authData.userId)))

    return {
      active,
      current: active.find(session => session.id === authData.sessionId),
    }
  }
  catch (error) {
    await handleError(error)
  }
})
