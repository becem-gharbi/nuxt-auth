import { ZodError } from "zod";
import { createError, H3Error, sendRedirect } from "h3";
import { withQuery } from "ufo";
import type { H3Event } from "h3";

/**
 * Checks error type and set status code accordingly
 */
export async function handleError(
  error: any,
  redirect?: { event: H3Event; url: string }
) {
  const h3Error = new H3Error("error");

  if (error) {
    //
    if (error instanceof ZodError) {
      h3Error.message = error.issues[0].path + " | " + error.issues[0].message;
      h3Error.statusCode = 400;
    }

    //
    else {
      h3Error.message = error.message;
      h3Error.statusCode = 400;
    }
  }

  if (redirect) {
    await sendRedirect(
      redirect.event,
      withQuery(redirect.url, { error: h3Error.message })
    );
    return;
  }

  throw createError(h3Error);
}
