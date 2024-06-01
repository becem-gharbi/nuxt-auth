import { defineEventHandler, readBody } from 'h3'
import { resolveURL, withQuery } from 'ufo'
import { z } from 'zod'
import { mustache, getConfig, sendMail, createResetPasswordToken, findUserByEmail, handleError, setUserRequestedPasswordReset } from '../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    if (!config.public.redirect.passwordReset) {
      throw new Error('Please make sure to set passwordReset redirect path')
    }

    const { email } = await readBody(event)

    const schema = z.object({
      email: z.string().email(),
    })

    schema.parse({ email })

    const user = await findUserByEmail(event, email)

    if (user && user.provider === 'default') {
      const resetPasswordToken = await createResetPasswordToken({
        userId: user.id,
      })

      const redirectUrl = resolveURL(
        config.public.baseUrl,
        config.public.redirect.passwordReset,
      )
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
              config.private.accessToken.maxAge! / 60,
            ),
          },
        ),
      })

      await setUserRequestedPasswordReset(event, user.id, true)
    }

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
