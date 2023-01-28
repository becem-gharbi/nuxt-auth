import { defineEventHandler } from "h3";
import {
  getAccessTokenFromHeader,
  verifyAccessToken,
  handleError,
  findManyRefreshToken,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getAccessTokenFromHeader(event);

    if (!accessToken) {
      throw new Error("Unauthorized");
    }

    const payload = verifyAccessToken(accessToken);

    const refreshTokens = await findManyRefreshToken(payload.userId);

    return { refreshTokens };
  } catch (error) {
    await handleError(error);
  }
});
