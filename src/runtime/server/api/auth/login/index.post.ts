import { defineEventHandler, readBody, createError } from "h3";
import {
  createRefreshToken,
  setRefreshTokenCookie,
  createAccessToken,
  setAccessTokenCookie,
  findUser,
  verifyPassword,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event);

    const user = await findUser({ email });

    if (!user.password || !verifyPassword(password, user.password)) {
      throw new Error("wrong-credentials");
    }

    if (!user.verified) {
      throw new Error("user-not-verified");
    }

    if (user.blocked) {
      throw new Error("user-blocked");
    }

    const refreshToken = await createRefreshToken(user);

    setRefreshTokenCookie(event, refreshToken);

    const accessToken = createAccessToken(user);

    setAccessTokenCookie(event, accessToken);

    delete user.password;

    return { accessToken, user };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
