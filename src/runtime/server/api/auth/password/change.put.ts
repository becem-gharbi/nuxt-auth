import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { getConfig, deleteManyRefreshTokenByUser, changePassword, findUser, verifyPassword, handleError } from '../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    const { currentPassword, newPassword } = await readBody(event)

    const schema = z.object({
      currentPassword: z.string(),
      newPassword: z
        .string()
        .regex(new RegExp(config.private.registration.passwordValidationRegex ?? '')),
    })

    schema.parse({ currentPassword, newPassword })

    const auth = event.context.auth

    if (!auth) {
      throw new Error('unauthorized')
    }

    const user = await findUser(event, { id: auth.userId })

    if (
      !user
      || user.provider !== 'default'
      || !verifyPassword(currentPassword, user.password!)
    ) {
      throw new Error('wrong-password')
    }

    await changePassword(event, user.id, newPassword)

    await deleteManyRefreshTokenByUser(event, auth.userId, auth.sessionId)

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
