import { defineEventHandler, readValidatedBody } from 'h3'
import { z } from 'zod'
import { getConfig, hashSync, compareSync, handleError, createUnauthorizedError, createCustomError } from '../../utils'

export default defineEventHandler(async (event) => {
  try {
    const config = getConfig()

    const authData = event.context.auth.data

    if (authData?.provider !== 'default') {
      throw createUnauthorizedError()
    }

    const schema = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().regex(new RegExp(config.private.registration.passwordValidationRegex!)),
    })

    const { currentPassword, newPassword } = await readValidatedBody(event, schema.parse)

    const user = await event.context.auth.adapter.user.findById(authData.userId)

    if (!user?.password || !compareSync(currentPassword, user.password)) {
      throw createCustomError(401, 'Wrong password')
    }

    const hashedPassword = hashSync(newPassword, 12)

    await event.context.auth.adapter.user.update(user.id, {
      password: hashedPassword,
    })

    await event.context.auth.adapter.refreshToken.deleteManyByUserId(authData.userId, authData.sessionId)

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
