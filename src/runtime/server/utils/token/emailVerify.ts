import { decode, encode } from "jwt-simple";
import { getConfig } from "#auth";
import type { EmailVerifyPayload } from "../../../types";
import type { H3Event } from "h3";

export function createEmailVerifyToken(
  event: H3Event,
  payload: EmailVerifyPayload
) {
  const config = getConfig(event);

  const emailVerifyToken = encode(
    payload,
    config.private.accessToken.jwtSecret + "email-verify",
    "HS256",
    {
      header: {
        expiresIn: config.private.accessToken.maxAge,
      },
    }
  );
  return emailVerifyToken;
}

export function verifyEmailVerifyToken(
  event: H3Event,
  emailVerifyToken: string
) {
  const config = getConfig(event);

  const payload = decode(
    emailVerifyToken,
    config.private.accessToken.jwtSecret + "email-verify"
  ) as EmailVerifyPayload;
  return payload;
}
