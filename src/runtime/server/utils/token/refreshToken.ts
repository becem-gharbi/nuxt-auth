import { encode, decode } from "./jwt";
import { v4 as uuidv4 } from "uuid";
import { setCookie, getCookie, deleteCookie, getHeader } from "h3";
import { getConfig } from "#auth";
import type { RefreshTokenPayload, User, RefreshToken } from "../../../types";
import type { PrismaClient } from "@prisma/client";
import type { H3Event } from "h3";

export async function createRefreshToken(event: H3Event, user: User) {
  const prisma = event.context.prisma as PrismaClient;

  const userAgent = getHeader(event, "user-agent");

  const refreshTokenEntity = await prisma.refreshToken.create({
    data: {
      uid: uuidv4(),
      userId: user.id,
      userAgent,
    },
  });

  const payload: RefreshTokenPayload = {
    id: refreshTokenEntity.id,
    uid: refreshTokenEntity.uid,
    userId: refreshTokenEntity.userId,
  };

  return payload;
}

export async function signRefreshToken(
  event: H3Event,
  payload: RefreshTokenPayload
) {
  const config = getConfig(event);
  const refreshToken = await encode(
    payload,
    config.private.refreshToken.jwtSecret,
    config.private.refreshToken.maxAge!
  );

  return refreshToken;
}

export async function updateRefreshToken(
  event: H3Event,
  refreshTokenId: RefreshToken["id"]
) {
  const prisma = event.context.prisma as PrismaClient;

  const refreshTokenEntity = await prisma.refreshToken.update({
    where: {
      id: refreshTokenId,
    },
    data: {
      uid: uuidv4(),
    },
  });

  const payload: RefreshTokenPayload = {
    id: refreshTokenEntity.id,
    uid: refreshTokenEntity.uid,
    userId: refreshTokenEntity.userId,
  };

  const config = getConfig(event);

  const refreshToken = await encode(
    payload,
    config.private.refreshToken.jwtSecret,
    config.private.refreshToken.maxAge!
  );

  return refreshToken;
}

export function setRefreshTokenCookie(event: H3Event, refreshToken: string) {
  const config = getConfig(event);
  setCookie(event, config.private.refreshToken.cookieName!, refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: config.private.refreshToken.maxAge,
    sameSite: "lax",
  });
}

export function getRefreshTokenFromCookie(event: H3Event) {
  const config = getConfig(event);
  const refreshToken = getCookie(
    event,
    config.private.refreshToken.cookieName!
  );
  return refreshToken;
}

export async function findRefreshTokenById(
  event: H3Event,
  id: RefreshToken["id"]
) {
  const prisma = event.context.prisma as PrismaClient;

  const refreshTokenEntity = await prisma.refreshToken.findUnique({
    where: {
      id,
    },
  });
  return refreshTokenEntity;
}

export async function verifyRefreshToken(event: H3Event, refreshToken: string) {
  const config = getConfig(event);
  //check if the refreshToken is issued by the auth server && if it's not expired
  const payload = await decode<RefreshTokenPayload>(
    refreshToken,
    config.private.refreshToken.jwtSecret
  );

  const refreshTokenEntity = await findRefreshTokenById(event, payload.id);

  if (
    !refreshTokenEntity || //check if the refresh token is revoked (deleted from database)
    refreshTokenEntity.uid !== payload.uid //check if the refresh token is fresh (not stolen)
  ) {
    throw new Error("unauthorized");
  }

  return payload;
}

export async function deleteRefreshToken(
  event: H3Event,
  refreshTokenId: RefreshToken["id"]
) {
  const prisma = event.context.prisma as PrismaClient;

  await prisma.refreshToken.delete({
    where: {
      id: refreshTokenId,
    },
  });
}

export async function deleteManyRefreshTokenByUser(
  event: H3Event,
  userId: User["id"]
) {
  const prisma = event.context.prisma as PrismaClient;

  await prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });
}

export async function findManyRefreshTokenByUser(
  event: H3Event,
  userId: User["id"]
) {
  const config = getConfig(event);
  const now = new Date();
  const minDate = new Date(
    now.getTime() - config.private.refreshToken.maxAge! * 1000
  );

  const prisma = event.context.prisma as PrismaClient;

  const refreshTokens = await prisma.refreshToken.findMany({
    where: {
      userId,
      updatedAt: {
        gt: minDate,
      },
    },
    select: {
      userId: true,
      uid: false,
      createdAt: true,
      id: true,
      updatedAt: true,
      userAgent: true,
    },
  });

  return refreshTokens;
}

export function deleteRefreshTokenCookie(event: H3Event) {
  const config = getConfig(event);
  deleteCookie(event, config.private.refreshToken.cookieName!);
}

export async function deleteManyRefreshTokenExpired(event: H3Event) {
  const config = getConfig(event);
  const now = new Date();
  const minDate = new Date(
    now.getTime() - config.private.refreshToken.maxAge! * 1000
  );

  const prisma = event.context.prisma as PrismaClient;

  await prisma.refreshToken.deleteMany({
    where: {
      updatedAt: {
        lt: minDate,
      },
    },
  });
}
