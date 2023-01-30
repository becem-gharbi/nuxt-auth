import jwt from "jsonwebtoken";
import { setCookie, getCookie, getRequestHeader, deleteCookie } from "h3";
import type { H3Event } from "h3";
import { privateConfig } from "../config";
import type { AccessTokenPayload, User } from "../../../types";

import Mustache from "mustache";

export function createAccessToken(user: User) {
  let customClaims = privateConfig.accessToken.customClaims || {};

  if (customClaims) {
    const output = Mustache.render(JSON.stringify(customClaims), user);
    customClaims = Object.assign(JSON.parse(output));
  }

  const payload = {
    userId: user.id,
    userRole: user.role,
    ...customClaims,
  };

  const accessToken = jwt.sign(payload, privateConfig.accessToken.jwtSecret, {
    expiresIn: privateConfig.accessToken.maxAge,
  });

  return accessToken;
}

export function getAccessTokenFromHeader(event: H3Event) {
  const authorization = getRequestHeader(event, "Authorization");
  if (authorization) {
    const accessToken = authorization.split("Bearer ")[1];
    return accessToken;
  }
}

export function verifyAccessToken(accessToken: string) {
  const payload = jwt.verify(
    accessToken,
    privateConfig.accessToken.jwtSecret
  ) as AccessTokenPayload;
  return payload;
}

export function setAccessTokenCookie(event: H3Event, accessToken: string) {
  setCookie(event, privateConfig.accessToken.cookieName!, accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: privateConfig.accessToken.maxAge,
    sameSite: "lax",
  });
}

export function getAccessTokenFromCookie(event: H3Event) {
  const accessToken = getCookie(event, privateConfig.accessToken.cookieName!);
  return accessToken;
}

export function deleteAccessTokenCookie(event: H3Event) {
  deleteCookie(event, privateConfig.accessToken.cookieName!);
}
