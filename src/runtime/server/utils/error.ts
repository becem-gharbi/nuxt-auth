import { createError, H3Error, sendRedirect } from 'h3'
import { withQuery } from 'ufo'
import type { H3Event } from 'h3'
import type { NitroApp } from 'nitropack/types'
import { useNitroApp } from 'nitropack/runtime'
import type { KnownErrors } from '../../types/common'
import { getConfig } from './config'
import type { User } from '#auth_adapter'

export function checkUser(data: Pick<User, 'verified' | 'suspended'>) {
  const config = getConfig()

  if (!data.verified && config.private.registration.requireEmailVerification) {
    throw createCustomError(403, 'Account not verified')
  }

  if (data.suspended) {
    throw createCustomError(403, 'Account suspended')
  }
}

export function createCustomError(statusCode: number, message: KnownErrors) {
  return createError({ message, statusCode })
}

export function createUnauthorizedError() {
  return createCustomError(401, 'Unauthorized')
}

export async function handleError(error: unknown, redirect?: { event: H3Event, url: string }) {
  if (error instanceof H3Error) {
    if (redirect) {
      await sendRedirect(redirect.event, withQuery(redirect.url, { error: error.message }))
      return
    }
    else {
      throw error
    }
  }

  const nitroApp = useNitroApp() as NitroApp
  await nitroApp.hooks.callHook('auth:error', error)

  throw createCustomError(500, 'Something went wrong')
}
