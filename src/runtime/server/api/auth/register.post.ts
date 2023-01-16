import { prisma } from "../../utils/prisma";
import { defineEventHandler, readBody, createError } from "h3";
import { createUser } from "../../utils/user";

export default defineEventHandler(async (event) => {
  try {
    const { email, password, name } = await readBody(event);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new Error("email-already-used");
    }

    await createUser({
      email,
      password,
      name,
    });

    return {};
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
