import { defineEventHandler } from "h3";
import {
  createAccessToken,
  getRefreshTokenFromCookie,
  setRefreshTokenCookie,
  updateRefreshToken,
  verifyRefreshToken,
  setAccessTokenCookie,
  deleteAccessTokenCookie,
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
      throw new Error("user-not-found");
    }

    const accessToken = createAccessToken(user);

    setAccessTokenCookie(event, accessToken);

    delete user.password;

    return { accessToken, user };
  } catch (error) {
    deleteRefreshTokenCookie(event);
    deleteAccessTokenCookie(event);

    await handleError(error);
  }
});
