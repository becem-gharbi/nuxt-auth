import { defineEventHandler } from 'h3'
import { handleError, createUnauthorizedError } from '../../utils'

export default defineEventHandler(async (event) => {
  try {
    const authData = event.context.auth.data

    if (!authData) {
      throw createUnauthorizedError()
    }

    const user = await event.context.auth.adapter.user.findById(authData.userId)

    if (!user) {
      throw createUnauthorizedError()
    }

    const { password, ...sanitizedUser } = user

    return sanitizedUser
  }
  catch (error) {
    await handleError(error)
  }
})
