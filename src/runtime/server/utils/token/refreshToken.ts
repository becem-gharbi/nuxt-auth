import { randomUUID } from 'uncrypto'
import { setCookie, getCookie, deleteCookie, getHeader } from 'h3'
import type { H3Event } from 'h3'
import type { RefreshTokenPayload, UserBase, RefreshTokenBase } from '../../../types'
import { getConfig } from '../config'
import { encode, decode } from './jwt'

export async function createRefreshToken(event: H3Event, userId: UserBase['id']) {
  const userAgent = getHeader(event, 'user-agent')

  const uid = randomUUID()

  const refreshTokenEntity = await event.context._authAdapter.refreshToken.create({
    userId,
    userAgent: userAgent ?? null,
    uid,
  })

  const payload: RefreshTokenPayload = {
    id: refreshTokenEntity.id,
    uid,
    userId,
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

export async function updateRefreshToken(event: H3Event, id: RefreshTokenBase['id'], userId: UserBase['id']) {
  const uid = randomUUID()

  await event.context._authAdapter.refreshToken.update(id, {
    uid,
  })

  const refreshToken = await signRefreshToken({ id, uid, userId })

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

  const refreshTokenEntity = await event.context._authAdapter.refreshToken.findById(payload.id)

  if (!refreshTokenEntity) {
    throw new Error('unauthorized')
  }

  const userAgent = getHeader(event, 'user-agent') ?? null

  if (refreshTokenEntity.uid !== payload.uid || refreshTokenEntity.userAgent !== userAgent) {
    await event.context._authAdapter.refreshToken.delete(payload.id)
    throw new Error('unauthorized')
  }

  return payload
}

export function deleteRefreshTokenCookie(event: H3Event) {
  const config = getConfig()
  deleteCookie(event, config.private.refreshToken.cookieName!)
}
