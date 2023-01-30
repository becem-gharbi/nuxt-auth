import { defineEventHandler } from "h3";
import {
  getAccessTokenFromHeader,
  verifyAccessToken,
  findUser,
  handleError,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const accessToken = getAccessTokenFromHeader(event);

    if (!accessToken) {
      throw new Error("unauthorized");
    }

    const payload = verifyAccessToken(accessToken);

    const user = await findUser({ id: payload.userId });

    if (!user) {
      throw new Error("unauthorized");
    }

    const { password, ...sanitizedUser } = user;

    return { ...sanitizedUser };
  } catch (error) {
    await handleError(error);
  }
});
