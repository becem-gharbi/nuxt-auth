import { defineEventHandler, readBody } from "h3";
import { z } from "zod";
import {
  createRefreshToken,
  setRefreshTokenCookie,
  createAccessToken,
  findUser,
  verifyPassword,
  handleError,
  privateConfig,
  signRefreshToken,
} from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event);

    const schema = z.object({
      email: z.string().email(),
      password: z.string(),
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
      throw new Error("account-not-verified");
    }

    if (user.suspended) {
      throw new Error("account-suspended");
    }

    const payload = await createRefreshToken(event, user);

    setRefreshTokenCookie(event, signRefreshToken(payload));

    const sessionId = payload.id;

    const accessToken = createAccessToken(user, sessionId);

    return { accessToken };
  } catch (error) {
    await handleError(error);
  }
});
