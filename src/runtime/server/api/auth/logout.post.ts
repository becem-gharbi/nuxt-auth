import { defineEventHandler } from "h3";
import {
  deleteRefreshTokenCookie,
  getRefreshTokenFromCookie,
  verifyRefreshToken,
  deleteAccessTokenCookie,
  deleteRefreshToken,
  handleError,
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

    await handleError(error);
  }
});
