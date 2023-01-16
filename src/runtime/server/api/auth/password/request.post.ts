import { defineEventHandler, createError, readBody } from "h3";
import { createResetPasswordToken } from "../../../utils/token";
import { findUser } from "../../../utils/user";

export default defineEventHandler(async (event) => {
  try {
    const { email, resetUrl } = await readBody(event);

    const user = await findUser({ email: email });

    if (user) {
      const resetPasswordToken = createResetPasswordToken({
        userId: user.id,
      });

      const fullResetUrl = resetUrl + "?token=" + resetPasswordToken;
      console.log(fullResetUrl);
    }

    return {};
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
