import { defineEventHandler, readValidatedBody } from 'h3'
import { z } from 'zod'
import { getConfig, verifyResetPasswordToken, hashSync, handleError, createCustomError } from '../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    const schema = z.object({
      token: z.string().min(1),
      password: z.string().regex(new RegExp(config.private.registration.passwordValidationRegex!)),
    })

    const { password, token } = await readValidatedBody(event, schema.parse)

    const payload = await verifyResetPasswordToken(token)

    const user = await event.context.auth.adapter.user.findById(payload.userId)

    if (!user?.requestedPasswordReset) {
      throw createCustomError(403, 'Password reset not requested')
    }

    const hashedPassword = hashSync(password, 12)

    await event.context.auth.adapter.user.update(payload.userId, {
      password: hashedPassword,
    })

    await event.context.auth.adapter.refreshToken.deleteManyByUserId(payload.userId)

    await event.context.auth.adapter.user.update(payload.userId, { requestedPasswordReset: false })

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
