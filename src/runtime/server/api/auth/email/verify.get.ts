import { defineEventHandler, getQuery, sendRedirect } from "h3";
import {
  verifyEmailVerifyToken,
  setUserEmailVerified,
  publicConfig,
  handleError,
} from "#auth";

import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    const token = getQuery(event).token?.toString();

    const schema = z.object({
      token: z.string().min(1),
    });

    schema.parse({ token });

    if (token) {
      const payload = verifyEmailVerifyToken(token);

      await setUserEmailVerified(payload.userId);

      await sendRedirect(event, publicConfig.redirect.emailVerify);
    } else {
      throw new Error("token-not-found");
    }
  } catch (error) {
    await handleError(error, { event, url: publicConfig.redirect.emailVerify });
  }
});
