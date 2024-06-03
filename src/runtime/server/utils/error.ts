import { createError, H3Error, sendRedirect } from 'h3'
import { withQuery } from 'ufo'
import type { H3Event } from 'h3'

/**
 * Checks error type and set status code accordingly
 */
export async function handleError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  redirect?: { event: H3Event, url: string },
) {
  const h3Error = new H3Error('server-error')
  h3Error.statusCode = 500

  if (error) {
    if (error.message === 'unauthorized') {
      h3Error.message = 'unauthorized'
      h3Error.statusCode = 401
    }
    else {
      // TODO: only return known messages
      console.error(error.message)
      h3Error.message = error.message
      h3Error.statusCode = 400
    }
  }

  if (redirect) {
    await sendRedirect(redirect.event, withQuery(redirect.url, { error: h3Error.message }))
    return
  }

  throw createError(h3Error)
}
