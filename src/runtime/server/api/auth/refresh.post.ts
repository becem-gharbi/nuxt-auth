import { defineEventHandler, setCookie, createError, getCookie } from "h3";
//@ts-ignore
import { useRuntimeConfig } from "#imports";
import jwt from "jsonwebtoken";
import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();

    const refreshToken = getCookie(
      event,
      config.public.auth.refreshTokenCookieName
    );

    if (!refreshToken) {
      throw new Error("Unauthorized");
    }

    const payload = jwt.verify(
      refreshToken,
      config.auth.refreshTokenSecret
    ) as {
      userId: number;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      throw new Error("user-not-found");
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      config.auth.accessTokenSecret,
      {
        expiresIn: config.auth.accessTokenExpiresIn,
      }
    );

    const newRefreshToken = jwt.sign(
      { userId: user.id },
      config.auth.refreshTokenSecret
    );

    setCookie(
      event,
      config.public.auth.refreshTokenCookieName,
      newRefreshToken,
      {
        httpOnly: true,
        secure: true,
        maxAge: config.auth.refreshTokenMaxAge,
        sameSite: "lax",
      }
    );

    return { accessToken };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error,
    });
  }
});
