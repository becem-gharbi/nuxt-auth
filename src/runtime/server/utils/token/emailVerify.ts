import jwt from "jsonwebtoken";
import { privateConfig } from "../config";
import type { EmailVerifyPayload } from "../../../types";

export function createEmailVerifyToken(payload: EmailVerifyPayload) {
  const emailVerifyToken = jwt.sign(
    payload,
    privateConfig.accessToken.jwtSecret + "email-verify",
    {
      expiresIn: privateConfig.accessToken.maxAge,
    }
  );
  return emailVerifyToken;
}

export function verifyEmailVerifyToken(emailVerifyToken: string) {
  const payload = jwt.verify(
    emailVerifyToken,
    privateConfig.accessToken.jwtSecret + "email-verify"
  ) as EmailVerifyPayload;
  return payload;
}
