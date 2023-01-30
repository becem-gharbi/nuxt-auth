import { defineEventHandler } from "h3";
import {
  getAccessTokenFromHeader,
  verifyAccessToken,
  handleError,
  findManyRefreshTokenByUser,
  getRefreshTokenFromCookie,
  verifyRefreshToken,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getAccessTokenFromHeader(event);

    if (!accessToken) {
      throw new Error("unauthorized");
    }

    const accessTokenPayload = verifyAccessToken(accessToken);

    const refreshToken = getRefreshTokenFromCookie(event);

    const refreshTokenPayload = await verifyRefreshToken(refreshToken);

    const refreshTokens = await findManyRefreshTokenByUser(
      accessTokenPayload.userId
    );

    return { refreshTokens, active: refreshTokenPayload.id };
  } catch (error) {
    await handleError(error);
  }
});
