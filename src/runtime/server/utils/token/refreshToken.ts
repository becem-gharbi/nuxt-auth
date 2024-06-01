import { randomUUID } from 'node:crypto'
import { setCookie, getCookie, deleteCookie, getHeader } from 'h3'
import type { H3Event } from 'h3'
import type { RefreshTokenPayload, UserBase, RefreshTokenBase } from '../../../types'
import { getConfig } from '../config'
import { encode, decode } from './jwt'

export async function createRefreshToken(event: H3Event, user: UserBase) {
  const userAgent = getHeader(event, 'user-agent') ?? null

  const refreshTokenEntity = await event.context._authAdapter.refreshToken.create({
    userId: user.id,
    userAgent,
    uid: randomUUID(),
  })

  const payload: RefreshTokenPayload = {
    id: refreshTokenEntity.id,
    uid: refreshTokenEntity.uid,
    userId: refreshTokenEntity.userId,
  }

  return payload
}

export async function signRefreshToken(payload: RefreshTokenPayload) {
  const config = getConfig()
  const refreshToken = await encode(
    payload,
    config.private.refreshToken.jwtSecret,
    config.private.refreshToken.maxAge!,
  )

  return refreshToken
}

export async function decodeRefreshToken(refreshToken: string) {
  const config = getConfig()
  const payload = await decode<RefreshTokenPayload>(
    refreshToken,
    config.private.refreshToken.jwtSecret,
  )

  return payload
}

export async function updateRefreshToken(
  event: H3Event,
  refreshTokenId: RefreshTokenBase['id'],
) {
  const refreshTokenEntity = await event.context._authAdapter.refreshToken.update(refreshTokenId, {
    uid: randomUUID(),
  })

  const payload: RefreshTokenPayload = {
    id: refreshTokenEntity.id,
    uid: refreshTokenEntity.uid,
    userId: refreshTokenEntity.userId,
  }

  const refreshToken = await signRefreshToken(payload)

  return refreshToken
}

export function setRefreshTokenCookie(event: H3Event, refreshToken: string) {
  const config = getConfig()
  setCookie(event, config.private.refreshToken.cookieName!, refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: config.private.refreshToken.maxAge,
    sameSite: 'lax',
  })
}

export function getRefreshTokenFromCookie(event: H3Event) {
  const config = getConfig()
  const refreshToken = getCookie(
    event,
    config.private.refreshToken.cookieName!,
  )
  return refreshToken
}

export async function verifyRefreshToken(event: H3Event, refreshToken: string) {
  // check if the refreshToken is issued by the auth server && if it's not expired
  const payload = await decodeRefreshToken(refreshToken)
  const userAgent = getHeader(event, 'user-agent') ?? null

  const refreshTokenEntity = await event.context._authAdapter.refreshToken.findById(payload.id)

  if (
    !refreshTokenEntity // check if the refresh token is revoked (deleted from database)
    || refreshTokenEntity.uid !== payload.uid // check if the refresh token is fresh (not stolen)
    || refreshTokenEntity.userAgent !== userAgent
  ) {
    await event.context._authAdapter.refreshToken.delete(payload.id)
    throw new Error('unauthorized')
  }

  return payload
}

export function deleteRefreshTokenCookie(event: H3Event) {
  const config = getConfig()
  deleteCookie(event, config.private.refreshToken.cookieName!)
}
