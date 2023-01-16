import { defineEventHandler, createError } from "h3";
import { getAccessTokenFromHeader, verifyAccessToken } from "../../utils/token";
import { findUser } from "../../utils/user";

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getAccessTokenFromHeader(event);

    if (!accessToken) {
      throw new Error("Unauthorized");
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      throw new Error("Unauthorized");
    }

    const user = await findUser({ id: payload.userId });

    if (!user) {
      throw new Error("user-not-found");
    }

    return { user };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
