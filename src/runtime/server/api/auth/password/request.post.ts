//@ts-ignore
import { useRuntimeConfig } from "#imports";
import { defineEventHandler, createError, readBody } from "h3";
import { sendMail } from "../../../utils/mail";
import { createResetPasswordToken } from "../../../utils/token";
import { findUser } from "../../../utils/user";

const config = useRuntimeConfig();
const redirectUrl =
  config.public.auth.baseUrl + config.public.auth.redirect.passwordReset;

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event);

    const user = await findUser({ email: email });

    if (user) {
      const resetPasswordToken = createResetPasswordToken({
        userId: user.id,
      });

      const fullRedirectUrl = redirectUrl + "?token=" + resetPasswordToken;

      await sendMail({
        to: user.email,
        subject: "Password Reset",
        html: `
            <h2>Hello ${user.name}</h2>
            <br>
            <a href="${fullRedirectUrl}"style="background-color:#206bc4;color:white;padding:10px;border-radius:5px;margin:20px;text-decoration: none;">Reset My password</a>
            `,
      });
    }

    return {};
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
