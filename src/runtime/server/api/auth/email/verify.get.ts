import { defineEventHandler, getValidatedQuery, sendRedirect } from 'h3'
import { z } from 'zod'
import { getConfig, verifyEmailVerifyToken, handleError } from '../../../utils'

// TODO: update docs `token-not-found` message removed

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    if (!config.public.redirect.emailVerify) {
      throw new Error('Please make sure to set emailVerify redirect path')
    }

    const schema = z.object({
      token: z.string().min(1),
    })

    const { token } = await getValidatedQuery(event, schema.parse)

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
