import { ZodError } from "zod";
import { createError, H3Error, sendRedirect } from "h3";
import type { H3Event } from "h3";
import { Prisma } from "@prisma/client";

export async function handleError(
  error: any,
  redirect?: { event: H3Event; url: string }
) {
  const h3Error = new H3Error();

  if (error instanceof Prisma.PrismaClientInitializationError) {
    h3Error.message = "Server error";
    h3Error.statusCode = 500;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //Query engine related issues
    if (error.code.startsWith("P2")) {
      h3Error.message = error.message;
      h3Error.statusCode = 400;
    }
    //Other server side errors (db, migration, introspection.. )
    else {
      h3Error.message = "Server error";
      h3Error.statusCode = 500;
    }
  } else if (error instanceof ZodError) {
    h3Error.message = error.issues[0].path + " | " + error.issues[0].message;
    h3Error.statusCode = 400;
  } else {
    h3Error.message = error.message;
    h3Error.statusCode = 400;
  }

  if (redirect) {
    await sendRedirect(event, `${redirect.url}?error=${h3Error.message}`);
    return;
  }

  throw createError(h3Error);
}
