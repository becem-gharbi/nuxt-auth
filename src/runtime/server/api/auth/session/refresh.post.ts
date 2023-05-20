import { defineEventHandler } from "h3";
import {
  createAccessToken,
  getRefreshTokenFromCookie,
  setRefreshTokenCookie,
  updateRefreshToken,
  verifyRefreshToken,
  deleteRefreshTokenCookie,
  findUser,
  handleError,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(event);

    const payload = await verifyRefreshToken(refreshToken);

    const newRefreshToken = await updateRefreshToken(payload.id);

    setRefreshTokenCookie(event, newRefreshToken);

    const user = await findUser({ id: payload.userId });

    if (!user) {
      throw new Error("unauthorized");
    }

    if (user.suspended) {
      throw new Error("account-suspended");
    }

    const sessionId = payload.id;

    const accessToken = createAccessToken(user, sessionId);

    delete user.password;

    return { accessToken, user };
  } catch (error) {
    deleteRefreshTokenCookie(event);

    await handleError(error);
  }
});
