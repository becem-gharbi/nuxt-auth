import { defineEventHandler, createError } from "h3";
import { getAccessTokenFromHeader, verifyAccessToken, findUser } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getAccessTokenFromHeader(event);

    if (!accessToken) {
      throw new Error("Unauthorized");
    }

    const payload = verifyAccessToken(accessToken);

    const user = await findUser({ id: payload.userId });

    if (!user) {
      throw new Error("user-not-found");
    }

    const { password, ...sanitizedUser } = user;

    return { ...sanitizedUser };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
