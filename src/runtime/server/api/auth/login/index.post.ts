import { readValidatedBody, defineEventHandler } from 'h3'
import { z } from 'zod'
import { getConfig, createRefreshToken, setRefreshTokenCookie, createAccessToken, compareSync, handleError, signRefreshToken, createCustomError } from '../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    })

    const { email, password } = await readValidatedBody(event, schema.parse)

    const user = await event.context._authAdapter.user.findByEmail(email)

    if (
      !user
      || user.provider !== 'default'
      || !user.password
      || !compareSync(password, user.password)
    ) {
      throw createCustomError(401, 'wrong-credentials')
    }

    if (
      !user.verified
      && config.private.registration.requireEmailVerification
    ) {
      throw createCustomError(403, 'account-not-verified')
    }

    if (user.suspended) {
      throw createCustomError(403, 'account-suspended')
    }

    const payload = await createRefreshToken(event, user.id)
    const refreshToken = await signRefreshToken(payload)
    setRefreshTokenCookie(event, refreshToken)
    const sessionId = payload.id
    const accessToken = await createAccessToken(event, user, sessionId)

    return accessToken
  }
  catch (error) {
    await handleError(error)
  }
})
