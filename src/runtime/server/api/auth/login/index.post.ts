import { defineEventHandler, readBody } from "h3";
import { z } from "zod";
import {
  createRefreshToken,
  setRefreshTokenCookie,
  createAccessToken,
  findUser,
  verifyPassword,
  handleError,
  getConfig,
  signRefreshToken,
} from "#auth";

export default defineEventHandler(async (event) => {
  const config = getConfig(event);

  try {
    const { email, password } = await readBody(event);

    const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    schema.parse({ email, password });

    const user = await findUser(event, { email });

    if (
      !user ||
      user.provider !== "default" ||
      !verifyPassword(password, user.password)
    ) {
      throw new Error("wrong-credentials");
    }

    if (
      !user.verified &&
      config.private.registration?.requireEmailVerification
    ) {
      throw new Error("account-not-verified");
    }

    if (user.suspended) {
      throw new Error("account-suspended");
    }

    const payload = await createRefreshToken(event, user);

    setRefreshTokenCookie(event, signRefreshToken(event, payload));

    const sessionId = payload.id;

    const accessToken = createAccessToken(event, user, sessionId);

    return { accessToken };
  } catch (error) {
    await handleError(error);
  }
});
