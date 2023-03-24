import { defineEventHandler, readBody } from "h3";
import {
  getAccessTokenFromHeader,
  verifyAccessToken,
  countUsers,
  handleError,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
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

    return { count };
  } catch (error) {
    await handleError(error);
  }
});
