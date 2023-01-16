import { defineEventHandler, createError, readBody } from "h3";
import { verifyResetPasswordToken } from "../../../utils/token";
import { changePassword } from "../../../utils/user";

export default defineEventHandler(async (event) => {
  try {
    const { password, token } = await readBody(event);

    const payload = verifyResetPasswordToken(token);

    await changePassword(payload.userId, password);

    return {};
  } catch (error) {
    console.warn(error);
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
