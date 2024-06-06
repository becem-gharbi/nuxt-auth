import type { H3Event } from 'h3'
import { getConfig } from './config'
import { generateAvatar } from './avatar'
import { createCustomError } from './error'
import type { User } from '#build/types/auth_adapter'

interface CreateAccountInput {
  name: string
  email: string
  password?: string
  verified?: boolean
  provider?: User['provider']
  picture?: string
}

export async function createAccount(event: H3Event, data: CreateAccountInput) {
  const config = getConfig()

  if (config.private.registration.enabled === false) {
    throw createCustomError(500, 'Registration disabled')
  }

  const regex = new RegExp(config.private.registration.emailValidationRegex!)

  if (!regex.test(data.email)) {
    throw createCustomError(403, 'Email not accepted')
  }

  return event.context.auth.adapter.user.create({
    name: data.name,
    email: data.email,
    password: data.password ?? null,
    verified: data.verified ?? false,
    provider: data.provider ?? 'default',
    picture: data.picture ?? generateAvatar(data.name),
    role: config.private.registration.defaultRole,
  })
}
