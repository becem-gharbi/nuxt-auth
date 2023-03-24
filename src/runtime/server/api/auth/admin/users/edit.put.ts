import { defineEventHandler, readBody } from "h3";
import {
  getAccessTokenFromHeader,
  verifyAccessToken,
  editUser,
  handleError,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const { id, data } = await readBody(event);

    const accessToken = getAccessTokenFromHeader(event);

    if (!accessToken) {
      throw new Error("unauthorized");
    }

    const payload = verifyAccessToken(accessToken);

    if (payload.userRole !== "admin") {
      throw new Error("unauthorized");
    }

    const user = await editUser(id, data);

    const { password, ...sanitizedUser } = user;

    return sanitizedUser;
  } catch (error) {
    await handleError(error);
  }
});
