import { encode, decode } from "jwt-simple";
import { getConfig } from "#auth";
import type { ResetPasswordPayload } from "../../../types";
import type { H3Event } from "h3";

export function createResetPasswordToken(
  event: H3Event,
  payload: ResetPasswordPayload
) {
  const config = getConfig(event);
  const resetPasswordToken = encode(
    payload,
    config.private.accessToken.jwtSecret + "reset-password",
    "HS256",
    {
      header: {
        expiresIn: config.private.accessToken.maxAge,
      },
    }
  );
  return resetPasswordToken;
}

export function verifyResetPasswordToken(
  event: H3Event,
  resetPasswordToken: string
) {
  const config = getConfig(event);

  const payload = decode(
    resetPasswordToken,
    config.private.accessToken.jwtSecret + "reset-password"
  ) as ResetPasswordPayload;
  return payload;
}
