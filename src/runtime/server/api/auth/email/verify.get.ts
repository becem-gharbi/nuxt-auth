import { defineEventHandler, getQuery, sendRedirect } from 'h3'
import { z } from 'zod'
import { getConfig, verifyEmailVerifyToken, handleError } from '../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    if (!config.public.redirect.emailVerify) {
      throw new Error('Please make sure to set emailVerify redirect path')
    }

    const token = getQuery(event).token?.toString()

    const schema = z.object({
      token: z.string(),
    })

    schema.parse({ token })

    if (!token) {
      throw new Error('token-not-found')
    }

    const payload = await verifyEmailVerifyToken(token)

    await event.context._authAdapter.user.update(payload.userId, { verified: true })

    await sendRedirect(event, config.public.redirect.emailVerify)
  }
  catch (error) {
    await handleError(error, {
      event,
      url: config.public.redirect.emailVerify!,
    })
  }
})
