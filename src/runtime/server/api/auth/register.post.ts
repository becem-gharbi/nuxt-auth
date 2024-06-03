import { defineEventHandler, readValidatedBody } from 'h3'
import { z } from 'zod'
import { getConfig, hashSync, handleError, generateAvatar, createCustomError } from '../../utils'

export default defineEventHandler(async (event) => {
  const config = getConfig()

  try {
    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().regex(new RegExp(config.private.registration.passwordValidationRegex ?? '')),
    })

    const { email, password, name } = await readValidatedBody(event, schema.parse)

    const user = await event.context._authAdapter.user.findByEmail(email)

    if (user) {
      if (!user.verified && config.private.registration.requireEmailVerification) {
        throw createCustomError(403, 'account-not-verified')
      }
      throw createCustomError(403, `email-used-with-${user.provider}`)
    }

    const hashedPassword = hashSync(password, 12)

    await event.context._authAdapter.user.create({
      email,
      password: hashedPassword,
      name,
      provider: 'local',
      picture: generateAvatar(name),
      role: config.private.registration.defaultRole,
      verified: false,
    })

    return { status: 'ok' }
  }
  catch (error) {
    await handleError(error)
  }
})
