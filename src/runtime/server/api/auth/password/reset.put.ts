import { defineEventHandler, readBody } from "h3";
import {
  getConfig,
  deleteManyRefreshTokenByUser,
  verifyResetPasswordToken,
  changePassword,
  handleError,
  setUserRequestedPasswordReset,
  findUser,
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

    const payload = await verifyResetPasswordToken(token);

    const user = await findUser(event, { id: payload.userId });

    if (!user.requestedPasswordReset) {
      throw new Error("reset-not-requested");
    }

    await changePassword(event, payload.userId, password);

    await deleteManyRefreshTokenByUser(event, payload.userId);

    await setUserRequestedPasswordReset(event, payload.userId, false);

    return "ok";
  } catch (error) {
    await handleError(error);
  }
});
