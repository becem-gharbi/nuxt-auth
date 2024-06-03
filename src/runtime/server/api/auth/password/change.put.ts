import { defineEventHandler, readValidatedBody } from 'h3'
import { z } from 'zod'
import { getConfig, hashSync, compareSync, handleError, createUnauthorizedError } from '../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    // TODO: add provider to access token payload
    const auth = event.context.auth

    if (!auth) {
      throw createUnauthorizedError()
    }

    const schema = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().regex(new RegExp(config.private.registration.passwordValidationRegex ?? '')),
    })

    const { currentPassword, newPassword } = await readValidatedBody(event, schema.parse)

    const user = await event.context._authAdapter.user.findById(auth.userId)

    if (
      !user
      || user.provider !== 'default'
      || !user.password
      || !compareSync(currentPassword, user.password)
    ) {
      throw new Error('wrong-password')
    }

    const hashedPassword = hashSync(newPassword, 12)

    await event.context._authAdapter.user.update(user.id, {
      password: hashedPassword,
    })

    await event.context._authAdapter.refreshToken.deleteManyByUserId(auth.userId, auth.sessionId)

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
