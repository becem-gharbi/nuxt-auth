import { encode, decode } from "./jwt";
import { getConfig } from "#auth";
import type { ResetPasswordPayload } from "../../../types";
import type { H3Event } from "h3";

export async function createResetPasswordToken(
  event: H3Event,
  payload: ResetPasswordPayload
) {
  const config = getConfig();
  const resetPasswordToken = await encode(
    payload,
    config.private.accessToken.jwtSecret + "reset-password",
    config.private.accessToken.maxAge!
  );

  return resetPasswordToken;
}

export async function verifyResetPasswordToken(
  event: H3Event,
  resetPasswordToken: string
) {
  const config = getConfig();

  const payload = await decode<ResetPasswordPayload>(
    resetPasswordToken,
    config.private.accessToken.jwtSecret + "reset-password"
  );

  return payload;
}
