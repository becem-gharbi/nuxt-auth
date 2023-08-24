import { defineEventHandler, readBody } from "h3";
import {
  deleteManyRefreshTokenByUser,
  verifyResetPasswordToken,
  changePassword,
  handleError,
  privateConfig,
} from "#auth";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    const { password, token } = await readBody(event);

    const schema = z.object({
      token: z.string(),
      password: z
        .string()
        .regex(RegExp(privateConfig.registration?.passwordValidationRegex)),
    });

    schema.parse({ password, token });

    const payload = verifyResetPasswordToken(token);

    await changePassword(event, payload.userId, password);

    await deleteManyRefreshTokenByUser(event, payload.userId);

    return "ok";
  } catch (error) {
    await handleError(error);
  }
});
