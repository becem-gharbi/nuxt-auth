import { defineEventHandler, readBody } from "h3";
import {
  getAccessTokenFromHeader,
  verifyAccessToken,
  countUsers,
  handleError,
  getConfig,
} from "#auth";

export default defineEventHandler(async (event) => {
  const config = getConfig(event);

  try {
    if (!config.private.admin?.enable) {
      throw new Error("Admin API is disabled");
    }

    const args = await readBody(event);

    const accessToken = getAccessTokenFromHeader(event);

    if (!accessToken) {
      throw new Error("unauthorized");
    }

    const payload = verifyAccessToken(event, accessToken);

    if (payload.userRole !== "admin") {
      throw new Error("unauthorized");
    }

    const count = await countUsers(event, args);

    return count;
  } catch (error) {
    await handleError(error);
  }
});
