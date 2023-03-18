import { defineEventHandler } from "h3";
import {
  getAccessTokenFromHeader,
  verifyAccessToken,
  handleError,
  findManyRefreshTokenByUser,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getAccessTokenFromHeader(event);

    if (!accessToken) {
      throw new Error("unauthorized");
    }

    const accessTokenPayload = verifyAccessToken(accessToken);

    const refreshTokens = await findManyRefreshTokenByUser(
      accessTokenPayload.userId
    );

    return { refreshTokens, active: accessTokenPayload.sessionId };
  } catch (error) {
    await handleError(error);
  }
});
