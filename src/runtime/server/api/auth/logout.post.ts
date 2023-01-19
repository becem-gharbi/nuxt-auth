import { defineEventHandler, createError } from "h3";
import {
  deleteRefreshTokenCookie,
  getRefreshTokenFromCookie,
  verifyRefreshToken,
} from "#auth";
import { deleteRefreshToken } from "../../utils/token";

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(event);

    if (!refreshToken) {
      throw new Error("Unauthorized");
    }

    const payload = await verifyRefreshToken(refreshToken);

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
