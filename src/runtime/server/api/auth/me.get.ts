import { defineEventHandler } from 'h3'
import { handleError, createUnauthorizedError } from '../../utils'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth

    if (!auth) {
      throw createUnauthorizedError()
    }

    const user = await event.context._authAdapter.user.findById(auth.userId)

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
