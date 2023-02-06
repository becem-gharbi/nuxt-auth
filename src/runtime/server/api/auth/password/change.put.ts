import { defineEventHandler, readBody } from "h3";

import {
  deleteManyRefreshTokenByUser,
  getAccessTokenFromHeader,
  verifyAccessToken,
  changePassword,
  findUser,
  verifyPassword,
  handleError,
  privateConfig,
} from "#auth";

import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    const { currentPassword, newPassword } = await readBody(event);

    const schema = z.object({
      currentPassword: z.string().min(1),
      newPassword: z
        .string()
        .regex(RegExp(privateConfig.registration?.passwordValidationRegex)),
    });

    schema.parse({ currentPassword, newPassword });

    const accessToken = getAccessTokenFromHeader(event);

    if (!accessToken) {
      throw new Error("unauthorized");
    }

    const payload = verifyAccessToken(accessToken);

    const user = await findUser({ id: payload.userId });

    if (
      !user ||
      user.provider !== "default" ||
      !verifyPassword(currentPassword, user.password)
    ) {
      throw new Error("wrong-password");
    }

    await changePassword(user.id, newPassword);

    await deleteManyRefreshTokenByUser(payload.userId);

    return {};
  } catch (error) {
    await handleError(error);
  }
});
