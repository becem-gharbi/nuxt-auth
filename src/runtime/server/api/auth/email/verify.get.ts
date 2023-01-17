import { defineEventHandler, getQuery, sendRedirect } from "h3";
import { verifyEmailVerifyToken } from "../../../utils/token";
import { setUserEmailVerified } from "../../../utils/user";
import { publicConfig } from "../../../utils/config";

export default defineEventHandler(async (event) => {
  try {
    const token = getQuery(event).token?.toString();

    if (token) {
      const payload = verifyEmailVerifyToken(token);

      await setUserEmailVerified(payload.userId);

      await sendRedirect(event, publicConfig.redirect.emailVerify);
    } else {
      throw new Error("token-not-found");
    }
  } catch (error) {
    await sendRedirect(
      event,
      publicConfig.redirect.emailVerify + "?error=" + error.message
    );
  }
});
