import prisma from "../../utils/prisma";
import jwt from "jsonwebtoken";
import { defineEventHandler, readBody, createError, setCookie } from "h3";
import bcrypt from "bcrypt";
//@ts-ignore
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();

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
      throw createError({
        statusCode: 400,
        message: "wrong-credentials",
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      config.auth.accessTokenSecret,
      {
        expiresIn: config.auth.accessTokenExpiresIn,
      }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      config.auth.refreshTokenSecret
    );

    setCookie(event, config.public.auth.refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: config.auth.refreshTokenMaxAge,
      sameSite: "lax",
    });

    return { accessToken };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error,
    });
  }
});
