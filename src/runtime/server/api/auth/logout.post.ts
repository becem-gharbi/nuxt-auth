import { defineEventHandler, createError } from "h3";
import {
  deleteRefreshTokenCookie,
  getRefreshTokenFromCookie,
  verifyRefreshToken,
  deleteAccessTokenCookie,
  deleteRefreshToken,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(event);

    const payload = await verifyRefreshToken(refreshToken);

    await deleteRefreshToken(payload.id);

    deleteRefreshTokenCookie(event);
    deleteAccessTokenCookie(event);

    return {};
  } catch (error) {
    deleteRefreshTokenCookie(event);
    deleteAccessTokenCookie(event);

    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
