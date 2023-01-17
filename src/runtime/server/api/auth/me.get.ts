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

    const user = await findUser({ id: payload.userId });

    if (!user) {
      throw new Error("user-not-found");
    }

    const { password, ...sanitizedUser } = user;

    return { user: sanitizedUser };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
