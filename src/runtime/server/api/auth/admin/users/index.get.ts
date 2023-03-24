import { defineEventHandler, getQuery } from "h3";
import {
  getAccessTokenFromHeader,
  verifyAccessToken,
  findUsers,
  handleError,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const args = getQuery(event);

    const accessToken = getAccessTokenFromHeader(event);

    if (!accessToken) {
      throw new Error("unauthorized");
    }

    const payload = verifyAccessToken(accessToken);

    if (payload.userRole !== "admin") {
      throw new Error("unauthorized");
    }

    const users = await findUsers(args);

    return users;
  } catch (error) {
    await handleError(error);
  }
});
