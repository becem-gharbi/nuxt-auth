import { defineEventHandler, createError } from "h3";
import {
  createAccessToken,
  getRefreshTokenFromCookie,
  setRefreshTokenCookie,
  updateRefreshToken,
  verifyRefreshToken,
} from "../../utils/token";

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(event);

    if (!refreshToken) {
      throw new Error("Unauthorized");
    }

    const payload = await verifyRefreshToken(refreshToken);

    const newRefreshToken = await updateRefreshToken(payload.id);

    setRefreshTokenCookie(event, {
      id: newRefreshToken.id,
      uid: newRefreshToken.uid,
      userId: newRefreshToken.userId,
    });

    const accessToken = createAccessToken({
      userId: newRefreshToken.userId,
    });

    return { accessToken };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error,
    });
  }
});
