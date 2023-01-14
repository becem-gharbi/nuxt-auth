import {
  defineEventHandler,
  readBody,
  createError,
  getRequestHeader,
} from "h3";
//@ts-ignore
import { useRuntimeConfig } from "#imports";
import jwt from "jsonwebtoken";
import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const authorization = getRequestHeader(event, "Authorization");

    if (!authorization) {
      throw new Error("Unauthorized");
    }

    const accessToken = authorization.split("Bearer ")[1];

    if (!accessToken) {
      throw new Error("Unauthorized");
    }

    const payload = jwt.verify(accessToken, config.auth.accessTokenSecret) as {
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

    return { user };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error,
    });
  }
});
