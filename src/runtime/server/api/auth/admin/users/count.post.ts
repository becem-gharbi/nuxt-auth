import { defineEventHandler, readBody } from "h3";
import {
  getAccessTokenFromHeader,
  verifyAccessToken,
  countUsers,
  handleError,
  privateConfig,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    if (!privateConfig.admin?.enable) {
      throw new Error("Admin API is disabled");
    }

    const args = await readBody(event);

    const accessToken = getAccessTokenFromHeader(event);

    if (!accessToken) {
      throw new Error("unauthorized");
    }

    const payload = verifyAccessToken(accessToken);

    if (payload.userRole !== "admin") {
      throw new Error("unauthorized");
    }

    const count = await countUsers(args);

    return count;
  } catch (error) {
    await handleError(error);
  }
});
