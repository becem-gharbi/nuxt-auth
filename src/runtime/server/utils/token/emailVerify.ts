import jwt from "jsonwebtoken";
import { getConfig } from "../config";
import type { EmailVerifyPayload } from "../../../types";
import type { H3Event } from "h3";

export function createEmailVerifyToken(
  event: H3Event,
  payload: EmailVerifyPayload
) {
  const config = getConfig(event);

  const emailVerifyToken = jwt.sign(
    payload,
    config.private.accessToken.jwtSecret + "email-verify",
    {
      expiresIn: config.private.accessToken.maxAge,
    }
  );
  return emailVerifyToken;
}

export function verifyEmailVerifyToken(
  event: H3Event,
  emailVerifyToken: string
) {
  const config = getConfig(event);

  const payload = jwt.verify(
    emailVerifyToken,
    config.private.accessToken.jwtSecret + "email-verify"
  ) as EmailVerifyPayload;
  return payload;
}
