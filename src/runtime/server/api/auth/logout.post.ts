import { defineEventHandler, createError } from "h3";
import {
  deleteRefreshToken,
  deleteRefreshTokenCookie,
  getRefreshTokenFromCookie,
  verifyRefreshToken,
} from "../../utils/token";

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(event);

    if (!refreshToken) {
      throw new Error("Unauthorized");
    }

    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new Error("Unauthorized");
    }

    await deleteRefreshToken(payload.id);

    deleteRefreshTokenCookie(event);
    return {};
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
