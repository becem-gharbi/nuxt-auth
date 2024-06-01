import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { getConfig, createUser, findUserByEmail, handleError } from '../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    const { email, password, name } = await readBody<{ email: string, password: string, name: string }>(event)

    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z
        .string()
        .regex(new RegExp(config.private.registration.passwordValidationRegex ?? '')),
    })

    schema.parse({ email, password, name })

    const user = await findUserByEmail(event, email)

    if (user) {
      if (!user.verified && config.private.registration.requireEmailVerification) {
        throw new Error('account-not-verified')
      }
      throw new Error(`email-used-with-${user.provider}`)
    }

    await createUser(event, {
      email,
      password,
      name,
      picture: '',
    })

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
