import { ZodError } from "zod";
import { createError, H3Error, sendRedirect } from "h3";
import type { H3Event } from "h3";

export async function handleError(
  error: any,
  redirect?: { event: H3Event; url: string }
) {
  const h3Error = new H3Error();

  if (error instanceof ZodError) {
    h3Error.message = error.issues[0].path + ":" + error.issues[0].message;
    h3Error.statusCode = 400;
  }

  if (redirect) {
    await sendRedirect(event, redirect.url);
    return;
  }

  throw createError(h3Error);
}
