import { defineEventHandler } from 'h3'
import { handleError } from '../../utils'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth

    if (!auth) {
      throw new Error('unauthorized')
    }

    const user = await event.context._authAdapter.user.findById(auth.userId)

    if (!user) {
      throw new Error('unauthorized')
    }

    const { password, ...sanitizedUser } = user

    return sanitizedUser
  }
  catch (error) {
    await handleError(error)
  }
})
