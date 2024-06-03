import { defineEventHandler, readValidatedBody } from 'h3'
import { z } from 'zod'
import { getConfig, verifyResetPasswordToken, hashSync, handleError } from '../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    const schema = z.object({
      token: z.string().min(1),
      password: z.string().regex(new RegExp(config.private.registration.passwordValidationRegex ?? '')),
    })

    const { password, token } = await readValidatedBody(event, schema.parse)

    const payload = await verifyResetPasswordToken(token)

    const user = await event.context._authAdapter.user.findById(payload.userId)

    if (!user?.requestedPasswordReset) {
      throw new Error('reset-not-requested')
    }

    const hashedPassword = hashSync(password, 12)

    await event.context._authAdapter.user.update(payload.userId, {
      password: hashedPassword,
    })

    await event.context._authAdapter.refreshToken.deleteManyByUserId(payload.userId)

    await event.context._authAdapter.user.update(payload.userId, { requestedPasswordReset: false })

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
