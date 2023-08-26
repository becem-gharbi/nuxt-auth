import { defineEventHandler } from "h3";
import {
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

    const payload = await verifyAccessToken(event, accessToken);

    await deleteManyRefreshTokenByUser(event, payload.userId);

    return "ok";
  } catch (error) {
    await handleError(error);
  }
});
