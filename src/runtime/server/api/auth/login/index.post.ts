import { prisma } from "../../../utils/prisma";
import { defineEventHandler, readBody, createError } from "h3";
import bcrypt from "bcrypt";
import {
  createRefreshToken,
  setRefreshTokenCookie,
  createAccessToken,
} from "../../../utils/token";

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (
      !user ||
      !user.password ||
      !bcrypt.compareSync(password, user.password)
    ) {
      throw new Error("wrong-credentials");
    }

    const refreshToken = await createRefreshToken(user.id);

    setRefreshTokenCookie(event, {
      id: refreshToken.id,
      uid: refreshToken.uid,
      userId: refreshToken.userId,
    });

    const accessToken = createAccessToken({
      userId: user.id,
    });

    return { accessToken };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
