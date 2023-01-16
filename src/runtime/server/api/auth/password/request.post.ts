//@ts-ignore
import { useRuntimeConfig } from "#imports";
import { defineEventHandler, createError, readBody } from "h3";
import { createResetPasswordToken } from "../../../utils/token";
import { findUser } from "../../../utils/user";

const config = useRuntimeConfig();
const redirectUrl =
  config.public.auth.baseUrl + config.public.auth.redirect.resetPassword;

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event);

    const user = await findUser({ email: email });

    if (user) {
      const resetPasswordToken = createResetPasswordToken({
        userId: user.id,
      });

      const fullRedirectUrl = redirectUrl + "?token=" + resetPasswordToken;
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
