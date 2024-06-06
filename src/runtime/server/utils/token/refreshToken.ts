import { randomUUID } from 'uncrypto'
import { setCookie, getCookie, deleteCookie, getHeader } from 'h3'
import type { H3Event } from 'h3'
import { getConfig } from '../config'
import { createUnauthorizedError } from '../error'
import { encode, decode } from './jwt'
import type { User, RefreshToken } from '#auth_adapter'

type RefreshTokenPayload = {
  id: RefreshToken['id']
  uid: RefreshToken['uid']
  userId: RefreshToken['userId']
}

export async function createRefreshToken(event: H3Event, userId: User['id']) {
  const userAgent = getHeader(event, 'user-agent')

  const uid = randomUUID()

  const refreshTokenEntity = await event.context.auth.adapter.refreshToken.create({
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

export async function updateRefreshToken(event: H3Event, id: RefreshToken['id'], userId: User['id']) {
  const uid = randomUUID()

  await event.context.auth.adapter.refreshToken.update(id, {
    uid,
    userId,
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

  const refreshTokenEntity = await event.context.auth.adapter.refreshToken.findById(payload.id, payload.userId)

  if (!refreshTokenEntity) {
    throw createUnauthorizedError()
  }

  const userAgent = getHeader(event, 'user-agent') ?? null

  if (refreshTokenEntity.uid !== payload.uid || refreshTokenEntity.userAgent !== userAgent) {
    await event.context.auth.adapter.refreshToken.delete(payload.id, payload.userId)
    throw createUnauthorizedError()
  }

  return payload
}

export function deleteRefreshTokenCookie(event: H3Event) {
  const config = getConfig()
  deleteCookie(event, config.private.refreshToken.cookieName!)
}
