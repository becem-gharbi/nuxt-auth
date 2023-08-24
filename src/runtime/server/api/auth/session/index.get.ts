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

    const accessTokenPayload = verifyAccessToken(event, accessToken);

    const refreshTokens = await findManyRefreshTokenByUser(
      event,
      accessTokenPayload.userId
    );

    return { refreshTokens, current: accessTokenPayload.sessionId };
  } catch (error) {
    await handleError(error);
  }
});
