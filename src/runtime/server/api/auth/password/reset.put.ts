import { defineEventHandler, readBody } from "h3";
import {
  getConfig,
  deleteManyRefreshTokenByUser,
  verifyResetPasswordToken,
  changePassword,
  handleError,
} from "#auth";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const config = getConfig();

  try {
    const { password, token } = await readBody(event);

    const schema = z.object({
      token: z.string(),
      password: z
        .string()
        .regex(new RegExp(config.private.registration.passwordValidationRegex)),
    });

    schema.parse({ password, token });

    const payload = await verifyResetPasswordToken(event, token);

    await changePassword(event, payload.userId, password);

    await deleteManyRefreshTokenByUser(event, payload.userId);

    return "ok";
  } catch (error) {
    await handleError(error);
  }
});
