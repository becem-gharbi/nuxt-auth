import { decode, encode } from "./jwt";
import { getConfig } from "#auth";
import type { EmailVerifyPayload } from "../../../types";
import type { H3Event } from "h3";

export async function createEmailVerifyToken(payload: EmailVerifyPayload) {
  const config = getConfig();

  const emailVerifyToken = await encode(
    payload,
    config.private.accessToken.jwtSecret + "email-verify",
    config.private.accessToken.maxAge!
  );

  return emailVerifyToken;
}

export async function verifyEmailVerifyToken(emailVerifyToken: string) {
  const config = getConfig();

  const payload = await decode<EmailVerifyPayload>(
    emailVerifyToken,
    config.private.accessToken.jwtSecret + "email-verify"
  );

  return payload;
}
