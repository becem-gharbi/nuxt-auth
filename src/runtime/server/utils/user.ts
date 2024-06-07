import type { H3Event } from 'h3'
import type { NitroApp } from 'nitropack'
import { getConfig } from './config'
import { generateAvatar } from './avatar'
import { createCustomError } from './error'
import type { User } from '#auth_adapter'

// @ts-expect-error importing an internal module
import { useNitroApp } from '#imports'

interface CreateAccountInput {
  name: User['name']
  email: User['email']
  password?: User['password']
  verified?: User['verified']
  provider?: User['provider']
  picture?: User['picture']
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

  const user = await event.context.auth.adapter.user.create({
    name: data.name,
    email: data.email,
    password: data.password,
    verified: data.verified ?? false,
    provider: data.provider ?? 'default',
    picture: data.picture ?? generateAvatar(data.name),
    role: config.private.registration.defaultRole,
  })

  const nitroApp = useNitroApp() as NitroApp
  await nitroApp.hooks.callHook('auth:registration', user)

  return user
}
