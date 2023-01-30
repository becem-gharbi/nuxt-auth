import jwt from "jsonwebtoken";
import { privateConfig } from "../config";
import type { ResetPasswordPayload } from "../../../types";

export function createResetPasswordToken(payload: ResetPasswordPayload) {
  const resetPasswordToken = jwt.sign(
    payload,
    privateConfig.accessToken.jwtSecret + "reset-password",
    {
      expiresIn: privateConfig.accessToken.maxAge,
    }
  );
  return resetPasswordToken;
}

export function verifyResetPasswordToken(resetPasswordToken: string) {
  const payload = jwt.verify(
    resetPasswordToken,
    privateConfig.accessToken.jwtSecret + "reset-password"
  ) as ResetPasswordPayload;
  return payload;
}
