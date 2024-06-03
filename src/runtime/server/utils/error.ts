import { createError, H3Error, sendRedirect } from 'h3'
import { withQuery } from 'ufo'
import type { H3Event } from 'h3'

export function createCustomError(statusCode: number, message: string) {
  return createError({ message, statusCode })
}

export function createUnauthorizedError() {
  return createCustomError(401, 'unauthorized')
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

  console.error(error)
  throw createCustomError(500, 'internal-server-error')
}
