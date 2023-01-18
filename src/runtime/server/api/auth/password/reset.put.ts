import { defineEventHandler, createError, readBody } from "h3";
import { deleteManyRefreshToken, verifyResetPasswordToken } from "#auth";
import { changePassword } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const { password, token } = await readBody(event);

    const payload = verifyResetPasswordToken(token);

    await changePassword(payload.userId, password);

    await deleteManyRefreshToken(payload.userId);

    return {};
  } catch (error) {
    console.warn(error);
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
