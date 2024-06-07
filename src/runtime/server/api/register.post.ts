import { defineEventHandler, readValidatedBody } from 'h3'
import { z } from 'zod'
import { getConfig, hashSync, handleError, createCustomError, createAccount, checkUser } from '../utils'

export default defineEventHandler(async (event) => {
  try {
    const config = getConfig()

    const schema = z.object({
      name: z.string().min(1).max(20),
      email: z.string().email().max(40),
      password: z.string().regex(new RegExp(config.private.registration.passwordValidationRegex!)),
    })

    const { email, password, name } = await readValidatedBody(event, schema.parse)

    const user = await event.context.auth.adapter.user.findByEmail(email)

    if (user) {
      checkUser(user)
      throw createCustomError(403, 'Email already used')
    }

    const hashedPassword = hashSync(password, 12)

    await createAccount(event, {
      email,
      name,
      password: hashedPassword,
    })

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
