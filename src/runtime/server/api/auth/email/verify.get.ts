//@ts-ignore
import { useRuntimeConfig } from "#imports";
import { defineEventHandler, getQuery, sendRedirect } from "h3";
import { verifyEmailVerifyToken } from "../../../utils/token";
import { setUserEmailVerified } from "../../../utils/user";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const token = getQuery(event).token?.toString();

    if (token) {
      const payload = verifyEmailVerifyToken(token);

      await setUserEmailVerified(payload.userId);

      await sendRedirect(event, config.public.auth.redirect.emailVerify);
    } else {
      throw new Error("token-not-found");
    }
  } catch (error) {
    await sendRedirect(
      event,
      config.public.auth.redirect.emailVerify + "?error=" + error.message
    );
  }
});
