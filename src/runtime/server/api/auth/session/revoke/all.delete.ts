import { defineEventHandler } from "h3";
import {
  deleteRefreshTokenCookie,
  handleError,
  getAccessTokenFromHeader,
  verifyAccessToken,
  deleteManyRefreshTokenByUser,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getAccessTokenFromHeader(event);

    if (!accessToken) {
      throw new Error("unauthorized");
    }

    const payload = verifyAccessToken(accessToken);

    await deleteManyRefreshTokenByUser(payload.userId);

    deleteRefreshTokenCookie(event);

    return {};
  } catch (error) {
    await handleError(error);
  }
});
