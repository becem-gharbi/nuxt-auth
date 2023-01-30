import { defineEventHandler, readBody } from "h3";
import {
  deleteRefreshTokenCookie,
  handleError,
  getAccessTokenFromHeader,
  verifyAccessToken,
  deleteManyRefreshTokenByUser,
  findRefreshTokenById,
  deleteRefreshToken,
} from "#auth";

import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readBody(event);

    const schema = z.object({
      id: z.number(),
    });

    schema.parse({ id });

    const accessToken = getAccessTokenFromHeader(event);

    if (!accessToken) {
      throw new Error("unauthorized");
    }

    const payload = verifyAccessToken(accessToken);

    const refreshTokenEntity = await findRefreshTokenById(id);

    if (!refreshTokenEntity || refreshTokenEntity.userId !== payload.userId) {
      throw new Error("unauthorized");
    }

    await deleteRefreshToken(id);

    return {};
  } catch (error) {
    await handleError(error);
  }
});
