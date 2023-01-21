import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import {
  H3Event,
  setCookie,
  getCookie,
  getRequestHeader,
  deleteCookie,
} from "h3";
import { prisma } from "./prisma";
import { privateConfig, publicConfig } from "./config";
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
  ResetPasswordPayload,
  EmailVerifyPayload,
  User,
} from "../../types";

import Mustache from "mustache";

/*************** Access token ***************/

export function createAccessToken(user: User) {
  let customClaims = privateConfig.accessTokenClaims || {};

  if (customClaims) {
    const output = Mustache.render(JSON.stringify(customClaims), user);
    customClaims = Object.assign(JSON.parse(output));
  }

  const payload = {
    userId: user.id,
    ...customClaims,
  };

  const accessToken = jwt.sign(payload, privateConfig.accessTokenSecret, {
    expiresIn: privateConfig.accessTokenMaxAge,
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
    privateConfig.accessTokenSecret
  ) as AccessTokenPayload;
  return payload;
}

export function setAccessTokenCookie(event: H3Event, accessToken: string) {
  setCookie(event, publicConfig.accessTokenCookieName, accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: privateConfig.accessTokenMaxAge,
    sameSite: "lax",
  });
}

export function getAccessTokenFromCookie(event: H3Event) {
  const accessToken = getCookie(event, publicConfig.accessTokenCookieName);
  return accessToken;
}

export function deleteAccessTokenCookie(event: H3Event) {
  deleteCookie(event, publicConfig.accessTokenCookieName);
}
/*************** Refresh token ***************/

export async function createRefreshToken(user: User) {
  const refreshTokenEntity = await prisma.refreshToken.create({
    data: {
      uid: uuidv4(),
      userId: user.id,
    },
  });

  const payload = {
    id: refreshTokenEntity.id,
    uid: refreshTokenEntity.uid,
    userId: refreshTokenEntity.userId,
  };

  const refreshToken = jwt.sign(payload, privateConfig.refreshTokenSecret, {
    expiresIn: privateConfig.refreshTokenMaxAge,
  });

  return refreshToken;
}

export async function updateRefreshToken(refreshTokenId: number) {
  const refreshTokenEntity = await prisma.refreshToken.update({
    where: {
      id: refreshTokenId,
    },
    data: {
      uid: uuidv4(),
    },
  });

  const payload = {
    id: refreshTokenEntity.id,
    uid: refreshTokenEntity.uid,
    userId: refreshTokenEntity.userId,
  };

  const refreshToken = jwt.sign(payload, privateConfig.refreshTokenSecret, {
    expiresIn: privateConfig.refreshTokenMaxAge,
  });

  return refreshToken;
}

export function setRefreshTokenCookie(event: H3Event, refreshToken: string) {
  setCookie(event, publicConfig.refreshTokenCookieName, refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: privateConfig.refreshTokenMaxAge,
    sameSite: "lax",
  });
}

export function getRefreshTokenFromCookie(event: H3Event) {
  const refreshToken = getCookie(event, publicConfig.refreshTokenCookieName);
  return refreshToken;
}

export async function verifyRefreshToken(refreshToken: string) {
  const payload = jwt.verify(
    refreshToken,
    privateConfig.refreshTokenSecret
  ) as RefreshTokenPayload;

  await prisma.refreshToken.findFirstOrThrow({
    where: {
      userId: payload.userId,
      uid: payload.uid,
    },
  });

  return payload;
}

export async function deleteRefreshToken(refreshTokenId: number) {
  await prisma.refreshToken.delete({
    where: {
      id: refreshTokenId,
    },
  });
}

export async function deleteManyRefreshToken(userId: number) {
  await prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });
}

export function deleteRefreshTokenCookie(event: H3Event) {
  deleteCookie(event, publicConfig.refreshTokenCookieName);
}

/*************** Reset Password token ***************/

export function createResetPasswordToken(payload: ResetPasswordPayload) {
  const resetPasswordToken = jwt.sign(
    payload,
    privateConfig.accessTokenSecret + "reset-password",
    {
      expiresIn: "5m",
    }
  );
  return resetPasswordToken;
}

export function verifyResetPasswordToken(resetPasswordToken: string) {
  const payload = jwt.verify(
    resetPasswordToken,
    privateConfig.accessTokenSecret + "reset-password"
  ) as ResetPasswordPayload;
  return payload;
}

/*************** Email Verify token ***************/

export function createEmailVerifyToken(payload: EmailVerifyPayload) {
  const emailVerifyToken = jwt.sign(
    payload,
    privateConfig.accessTokenSecret + "email-verify",
    {
      expiresIn: "5m",
    }
  );
  return emailVerifyToken;
}

export function verifyEmailVerifyToken(emailVerifyToken: string) {
  const payload = jwt.verify(
    emailVerifyToken,
    privateConfig.accessTokenSecret + "email-verify"
  ) as EmailVerifyPayload;
  return payload;
}
