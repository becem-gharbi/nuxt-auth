import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import {
  getConfig,
  deleteManyRefreshTokenByUser,
  getAccessTokenFromHeader,
  verifyAccessToken,
  changePassword,
  findUser,
  verifyPassword,
  handleError
} from '#auth'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    const { currentPassword, newPassword } = await readBody(event)

    const schema = z.object({
      currentPassword: z.string(),
      newPassword: z
        .string()
        .regex(new RegExp(config.private.registration.passwordValidationRegex))
    })

    schema.parse({ currentPassword, newPassword })

    const accessToken = getAccessTokenFromHeader(event)

    if (!accessToken) {
      throw new Error('unauthorized')
    }

    const payload = await verifyAccessToken(accessToken)

    const user = await findUser(event, { id: payload.userId })

    if (
      !user ||
      user.provider !== 'default' ||
      !verifyPassword(currentPassword, user.password)
    ) {
      throw new Error('wrong-password')
    }

    await changePassword(event, user.id, newPassword)

    await deleteManyRefreshTokenByUser(
      event,
      payload.userId,
      payload.sessionId
    )

    return 'ok'
  } catch (error) {
    await handleError(error)
  }
})
