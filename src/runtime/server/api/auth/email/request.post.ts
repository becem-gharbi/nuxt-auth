import { defineEventHandler, readBody } from 'h3'
import { resolveURL, withQuery } from 'ufo'
import { z } from 'zod'
import { mustache, getConfig, sendMail, createEmailVerifyToken, findUserByEmail, handleError } from '../../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    if (!config.public.redirect.emailVerify) {
      throw new Error('Please make sure to set emailVerify redirect path')
    }

    const { email } = await readBody(event)

    const schema = z.object({
      email: z.string().email(),
    })

    schema.parse({ email })

    const user = await findUserByEmail(event, email)

    if (user && !user.verified) {
      const emailVerifyToken = await createEmailVerifyToken({
        userId: user.id,
      })

      const redirectUrl = resolveURL(
        config.public.baseUrl,
        '/api/auth/email/verify',
      )

      const link = withQuery(redirectUrl, { token: emailVerifyToken })

      await sendMail({
        to: user.email,
        subject: 'Email verification',
        html: mustache.render(
          config.private.email!.templates!.emailVerify!,
          {
            ...user,
            link,
            validityInMinutes: Math.round(
              config.private.accessToken.maxAge! / 60,
            ),
          },
        ),
      })
    }

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
