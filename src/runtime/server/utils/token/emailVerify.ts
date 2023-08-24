import { sign, verify } from "jsonwebtoken";
import { getConfig } from "#auth";
import type { EmailVerifyPayload } from "../../../types";
import type { H3Event } from "h3";

export function createEmailVerifyToken(
  event: H3Event,
  payload: EmailVerifyPayload
) {
  const config = getConfig(event);

  const emailVerifyToken = sign(
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

  const payload = verify(
    emailVerifyToken,
    config.private.accessToken.jwtSecret + "email-verify"
  ) as EmailVerifyPayload;
  return payload;
}
