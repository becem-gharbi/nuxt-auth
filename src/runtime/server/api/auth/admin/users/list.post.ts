import { defineEventHandler, readBody } from "h3";
import {
  getAccessTokenFromHeader,
  verifyAccessToken,
  findUsers,
  handleError,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const args = await readBody(event);

    const accessToken = getAccessTokenFromHeader(event);

    if (!accessToken) {
      throw new Error("unauthorized");
    }

    const payload = verifyAccessToken(event, accessToken);

    if (payload.userRole !== "admin") {
      throw new Error("unauthorized");
    }

    const users = await findUsers(event, args);

    return users.map((user) => {
      const { password, ...sanitizedUser } = user;
      return sanitizedUser;
    });
  } catch (error) {
    await handleError(error);
  }
});
