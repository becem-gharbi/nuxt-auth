import { defineEventHandler, createError } from "h3";
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
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(event);

    const payload = await verifyRefreshToken(refreshToken);

    const newRefreshToken = await updateRefreshToken(payload.id);

    setRefreshTokenCookie(event, newRefreshToken);

    const user = await findUser({ id: payload.userId });

    const accessToken = createAccessToken(user);

    setAccessTokenCookie(event, accessToken);

    return { accessToken };
  } catch (error) {
    deleteRefreshTokenCookie(event);
    deleteAccessTokenCookie(event);

    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
