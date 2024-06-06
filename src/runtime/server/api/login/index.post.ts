import { readValidatedBody, defineEventHandler } from 'h3'
import { z } from 'zod'
import { getConfig, createRefreshToken, setRefreshTokenCookie, createAccessToken, compareSync, handleError, signRefreshToken, createCustomError } from '../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    const schema = z.object({
      email: z.string().email().max(40),
      password: z.string().min(1),
    })

    const { email, password } = await readValidatedBody(event, schema.parse)

    const user = await event.context.auth.adapter.user.findByEmail(email)

    if (user?.provider !== 'default' || !user.password || !compareSync(password, user.password)) {
      throw createCustomError(401, 'Wrong credentials')
    }

    if (!user.verified && config.private.registration.requireEmailVerification) {
      throw createCustomError(403, 'Account not verified')
    }

    if (user.suspended) {
      throw createCustomError(403, 'Account suspended')
    }

    if (user.requestedPasswordReset) {
      await event.context.auth.adapter.user.update(user.id, { requestedPasswordReset: false })
    }

    const payload = await createRefreshToken(event, user.id)
    const refreshToken = await signRefreshToken(payload)
    setRefreshTokenCookie(event, refreshToken)
    const sessionId = payload.id

    return createAccessToken(event, user, sessionId)
  }
  catch (error) {
    await handleError(error)
  }
})
