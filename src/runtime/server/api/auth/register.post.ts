import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { getConfig, createUser, findUser, handleError } from '#auth'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    const { email, password, name } = await readBody(event)

    const schema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z
        .string()
        .regex(new RegExp(config.private.registration.passwordValidationRegex))
    })

    schema.parse({ email, password, name })

    const user = await findUser(event, { email })

    if (user) {
      throw new Error(`email-used-with-${user.provider}`)
    }

    await createUser(event, {
      email,
      password,
      name
    })

    return 'ok'
  } catch (error) {
    await handleError(error)
  }
})
