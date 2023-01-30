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
      token: z.string().min(1),
      password: z
        .string()
        .regex(RegExp(privateConfig.registration?.passwordValidationRegex)),
    });

    schema.parse({ password, token });

    const payload = verifyResetPasswordToken(token);

    await changePassword(payload.userId, password);

    await deleteManyRefreshTokenByUser(payload.userId);

    return {};
  } catch (error) {
    await handleError(error);
  }
});
