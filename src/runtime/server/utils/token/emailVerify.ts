import { decode, encode } from "./jwt";
import { getConfig } from "#auth";
import type { EmailVerifyPayload } from "../../../types";
import type { H3Event } from "h3";

export async function createEmailVerifyToken(
  event: H3Event,
  payload: EmailVerifyPayload
) {
  const config = getConfig(event);

  const emailVerifyToken = await encode(
    payload,
    config.private.accessToken.jwtSecret + "email-verify",
    config.private.accessToken.maxAge!
  );

  return emailVerifyToken;
}

export async function verifyEmailVerifyToken(
  event: H3Event,
  emailVerifyToken: string
) {
  const config = getConfig(event);

  const payload = await decode<EmailVerifyPayload>(
    emailVerifyToken,
    config.private.accessToken.jwtSecret + "email-verify"
  );

  return payload;
}
