import jwt from "jsonwebtoken";
import { getConfig } from "../config";
import type { ResetPasswordPayload } from "../../../types";
import type { H3Event } from "h3";

export function createResetPasswordToken(
  event: H3Event,
  payload: ResetPasswordPayload
) {
  const config = getConfig(event);
  const resetPasswordToken = jwt.sign(
    payload,
    config.private.accessToken.jwtSecret + "reset-password",
    {
      expiresIn: config.private.accessToken.maxAge,
    }
  );
  return resetPasswordToken;
}

export function verifyResetPasswordToken(
  event: H3Event,
  resetPasswordToken: string
) {
  const config = getConfig(event);

  const payload = jwt.verify(
    resetPasswordToken,
    config.private.accessToken.jwtSecret + "reset-password"
  ) as ResetPasswordPayload;
  return payload;
}
