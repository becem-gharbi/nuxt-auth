//@ts-ignore
import { useRuntimeConfig } from "#imports";
import { defineEventHandler, createError, readBody } from "h3";
import { createEmailVerifyToken } from "../../../utils/token";
import { findUser } from "../../../utils/user";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event);

    const user = await findUser({ email: email });

    if (user && !user.verified) {
      const emailVerifyToken = createEmailVerifyToken({
        userId: user.id,
      });

      const redirectUrl = config.public.auth.baseUrl + "/api/auth/email/verify";
      const fullRedirectUrl = redirectUrl + "?token=" + emailVerifyToken;
      console.log(fullRedirectUrl);
    }

    return {};
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
