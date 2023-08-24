import { defineEventHandler, getQuery, sendRedirect } from "h3";
import {
  getConfig,
  verifyEmailVerifyToken,
  setUserEmailVerified,
  handleError,
} from "#auth";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const config = getConfig(event);

  try {
    if (!config.public.redirect.emailVerify) {
      throw new Error("Please make sure to set emailVerify redirect path");
    }

    const token = getQuery(event).token?.toString();

    const schema = z.object({
      token: z.string(),
    });

    schema.parse({ token });

    if (token) {
      const payload = verifyEmailVerifyToken(event, token);

      await setUserEmailVerified(event, payload.userId);

      await sendRedirect(event, config.public.redirect.emailVerify);
    } else {
      throw new Error("token-not-found");
    }
  } catch (error) {
    await handleError(error, {
      event: event,
      url: config.public.redirect.emailVerify,
    });
  }
});
