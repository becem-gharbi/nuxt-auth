import { ZodError } from "zod";
import { createError, H3Error, sendRedirect } from "h3";
import type { H3Event } from "h3";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import { logger } from "@nuxt/kit";

export async function handleError(
  error: any,
  redirect?: { event: H3Event; url: string }
) {
  const h3Error = new H3Error();

  if (error instanceof Prisma.PrismaClientInitializationError) {
    h3Error.message = "Server error";
    h3Error.statusCode = 500;
    logger.error("Databse connection failed. Please check DATABASE_URL env");
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
  } else if (
    error instanceof jwt.JsonWebTokenError ||
    error instanceof jwt.TokenExpiredError ||
    error.message === "unauthorized"
  ) {
    h3Error.message = "unauthorized";
    h3Error.statusCode = 401;
  } else {
    h3Error.message = error.message;
    h3Error.statusCode = 400;
  }

  if (redirect) {
    await sendRedirect(
      redirect.event,
      `${redirect.url}?error=${h3Error.message}`
    );
    return;
  }

  throw createError(h3Error);
}
