import { readBody, defineEventHandler } from 'h3'
import { z } from 'zod'
import { getConfig, createRefreshToken, setRefreshTokenCookie, createAccessToken, compareSync, handleError, signRefreshToken } from '../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    const { email, password } = await readBody(event)

    const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    schema.parse({ email, password })

    const user = await event.context._authAdapter.user.findByEmail(email)

    if (
      !user
      || user.provider !== 'default'
      || !user.password
      || !compareSync(password, user.password)
    ) {
      throw new Error('wrong-credentials')
    }

    if (
      !user.verified
      && config.private.registration.requireEmailVerification
    ) {
      throw new Error('account-not-verified')
    }

    if (user.suspended) {
      throw new Error('account-suspended')
    }

    const payload = await createRefreshToken(event, user)
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
