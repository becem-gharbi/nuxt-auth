import { encode, decode } from "./jwt";
import { getRequestHeader } from "h3";
import { getConfig } from "#auth";
import mustache from "mustache";
import type { H3Event } from "h3";
import type { AccessTokenPayload, User, Session } from "../../../types";

export async function createAccessToken(user: User, sessionId: Session["id"]) {
  const config = getConfig();

  let customClaims = config.private.accessToken.customClaims || {};

  if (customClaims) {
    const output = mustache.render(JSON.stringify(customClaims), user);
    customClaims = Object.assign(JSON.parse(output));
  }

  const payload: AccessTokenPayload = {
    sessionId,
    userId: user.id,
    userRole: user.role,
    ...customClaims,
  };

  const accessToken = await encode(
    payload,
    config.private.accessToken.jwtSecret,
    config.private.accessToken.maxAge!
  );

  return accessToken;
}

/**
 * Get the access token from Authorization header
 * @param event
 * @returns accessToken
 */
export function getAccessTokenFromHeader(event: H3Event) {
  const authorization = getRequestHeader(event, "Authorization");
  if (authorization) {
    const accessToken = authorization.split("Bearer ")[1];
    return accessToken;
  }
}

/**
 * Check if the access token is issued by the server and not expired
 * @param accessToken
 * @returns accessTokenPayload
 */
export async function verifyAccessToken(accessToken: string) {
  const config = getConfig();

  const payload = await decode<AccessTokenPayload>(
    accessToken,
    config.private.accessToken.jwtSecret
  );

  return payload;
}
