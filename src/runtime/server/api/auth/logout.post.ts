import { defineEventHandler, createError } from "h3";
import {
  deleteManyRefreshToken,
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

    const payload = await verifyRefreshToken(refreshToken);

    await deleteManyRefreshToken(payload.id);

    deleteRefreshTokenCookie(event);
    return {};
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
