import { defineEventHandler, readBody } from "h3";
import { z } from "zod";

import {
  createRefreshToken,
  setRefreshTokenCookie,
  createAccessToken,
  setAccessTokenCookie,
  findUser,
  verifyPassword,
  handleError,
  privateConfig,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event);

    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });

    schema.parse({ email, password });

    const user = await findUser({ email });

    if (
      !user ||
      user.provider !== "default" ||
      !verifyPassword(password, user.password)
    ) {
      throw new Error("wrong-credentials");
    }

    if (
      !user.verified &&
      privateConfig.registration?.requireEmailVerification
    ) {
      throw new Error("user-not-verified");
    }

    if (user.blocked) {
      throw new Error("user-blocked");
    }

    const refreshToken = await createRefreshToken(event, user);

    setRefreshTokenCookie(event, refreshToken);

    const accessToken = createAccessToken(user);

    setAccessTokenCookie(event, accessToken);

    delete user.password;

    return { accessToken, user };
  } catch (error) {
    await handleError(error);
  }
});
