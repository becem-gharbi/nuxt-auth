//@ts-ignore
import { useRuntimeConfig } from "#imports";
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

const config = useRuntimeConfig();

type ResetPasswordPayload = {
  userId: number;
};

type EmailVerifyPayload = {
  userId: number;
};

type AccessTokenPayload = {
  userId: number;
};

type RefreshTokenPayload = {
  id: number;
  uid: string;
  userId: number;
};

/*************** Access token ***************/

export function createAccessToken(payload: AccessTokenPayload) {
  const accessToken = jwt.sign(payload, config.auth.accessTokenSecret, {
    expiresIn: config.auth.accessTokenExpiresIn,
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
    config.auth.accessTokenSecret
  ) as AccessTokenPayload;
  return payload;
}

/*************** Refresh token ***************/

export async function createRefreshToken(userId: number) {
  const refreshToken = await prisma.refreshToken.create({
    data: {
      uid: uuidv4(),
      userId: userId,
    },
  });

  return refreshToken;
}

export async function updateRefreshToken(refreshTokenId: number) {
  const refreshToken = await prisma.refreshToken.update({
    where: {
      id: refreshTokenId,
    },
    data: {
      uid: uuidv4(),
    },
  });
  return refreshToken;
}

export function setRefreshTokenCookie(
  event: H3Event,
  payload: RefreshTokenPayload
) {
  const refreshToken = jwt.sign(payload, config.auth.refreshTokenSecret);

  setCookie(event, config.public.auth.refreshTokenCookieName, refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: config.auth.refreshTokenMaxAge,
    sameSite: "lax",
  });
}

export function getRefreshTokenFromCookie(event: H3Event) {
  const refreshToken = getCookie(
    event,
    config.public.auth.refreshTokenCookieName
  );
  return refreshToken;
}

export function verifyRefreshToken(refreshToken: string) {
  const payload = jwt.verify(
    refreshToken,
    config.auth.refreshTokenSecret
  ) as RefreshTokenPayload;
  return payload;
}

export async function deleteRefreshToken(refreshTokenId: number) {
  await prisma.refreshToken.delete({
    where: {
      id: refreshTokenId,
    },
  });
}

export function deleteRefreshTokenCookie(event: H3Event) {
  deleteCookie(event, config.public.auth.refreshTokenCookieName);
}

/*************** Reset Password token ***************/

export function createResetPasswordToken(payload: ResetPasswordPayload) {
  const resetPasswordToken = jwt.sign(
    payload,
    config.auth.accessTokenSecret + "reset-password",
    {
      expiresIn: "5m",
    }
  );
  return resetPasswordToken;
}

export function verifyResetPasswordToken(resetPasswordToken: string) {
  const payload = jwt.verify(
    resetPasswordToken,
    config.auth.accessTokenSecret + "reset-password"
  ) as ResetPasswordPayload;
  return payload;
}

/*************** Email Verify token ***************/

export function createEmailVerifyToken(payload: EmailVerifyPayload) {
  const emailVerifyToken = jwt.sign(
    payload,
    config.auth.accessTokenSecret + "email-verify",
    {
      expiresIn: "5m",
    }
  );
  return emailVerifyToken;
}

export function verifyEmailVerifyToken(emailVerifyToken: string) {
  const payload = jwt.verify(
    emailVerifyToken,
    config.auth.accessTokenSecret + "email-verify"
  ) as EmailVerifyPayload;
  return payload;
}
