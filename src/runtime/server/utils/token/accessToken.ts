import jwt from "jsonwebtoken";
import { getRequestHeader } from "h3";
import type { H3Event } from "h3";
import { privateConfig } from "../config";
import type { AccessTokenPayload, User } from "../../../types";
import Mustache from "mustache";

export function createAccessToken(user: User, sessionId: number | string) {
  let customClaims = privateConfig.accessToken.customClaims || {};

  if (customClaims) {
    const output = Mustache.render(JSON.stringify(customClaims), user);
    customClaims = Object.assign(JSON.parse(output));
  }

  const payload: AccessTokenPayload = {
    sessionId,
    userId: user.id,
    userRole: user.role,
    ...customClaims,
  };

  const accessToken = jwt.sign(payload, privateConfig.accessToken.jwtSecret, {
    expiresIn: privateConfig.accessToken.maxAge,
  });

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
export function verifyAccessToken(accessToken: string) {
  const payload = jwt.verify(
    accessToken,
    privateConfig.accessToken.jwtSecret
  ) as AccessTokenPayload;
  return payload;
}
