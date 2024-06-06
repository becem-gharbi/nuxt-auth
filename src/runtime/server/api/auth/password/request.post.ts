import { defineEventHandler, readValidatedBody } from 'h3'
import { resolveURL, withQuery } from 'ufo'
import { z } from 'zod'
import { mustache, getConfig, sendMail, createResetPasswordToken, handleError } from '../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    const schema = z.object({
      email: z.string().email(),
    })

    const { email } = await readValidatedBody(event, schema.parse)

    const user = await event.context.auth.adapter.user.findByEmail(email)

    if (user && user.provider === 'default') {
      const resetPasswordToken = await createResetPasswordToken({
        userId: user.id,
      })

      const redirectUrl = resolveURL(config.public.baseUrl, config.public.redirect.passwordReset!)
      const link = withQuery(redirectUrl, { token: resetPasswordToken })

      await sendMail({
        to: user.email,
        subject: 'Password Reset',
        html: mustache.render(
          config.private.email!.templates!.passwordReset!,
          {
            ...user,
            link,
            validityInMinutes: Math.round(
              config.private.email!.actionTimeout! / 60,
            ),
          },
        ),
      })

      await event.context.auth.adapter.user.update(user.id, { requestedPasswordReset: true })
    }

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
