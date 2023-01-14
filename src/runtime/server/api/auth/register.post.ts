import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import { defineEventHandler, readBody, createError } from "h3";

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

    const hashedPassword = bcrypt.hashSync(password, 12);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return { ok: true };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
