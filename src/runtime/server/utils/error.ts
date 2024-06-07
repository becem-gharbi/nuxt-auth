import { createError, H3Error, sendRedirect } from 'h3'
import { withQuery } from 'ufo'
import type { H3Event } from 'h3'
import type { NitroApp } from 'nitropack'
import type { KnownErrors } from '../../types/common'

// @ts-expect-error importing an internal module
import { useNitroApp } from '#imports'

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
