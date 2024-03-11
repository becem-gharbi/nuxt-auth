import { v4 as uuidv4 } from 'uuid'
import { setCookie, getCookie, deleteCookie, getHeader } from 'h3'
import type { H3Event } from 'h3'
import type {
  RefreshTokenPayload,
  User,
  RefreshToken,
  Session
} from '../../../types'
import { getConfig } from '../config'
import { encode, decode } from './jwt'

export async function createRefreshToken (event: H3Event, user: User) {
  const prisma = event.context.prisma

  const userAgent = getHeader(event, 'user-agent') ?? null

  const refreshTokenEntity = await prisma.refreshToken.create({
    data: {
      uid: uuidv4(),
      userId: user.id,
      userAgent
    },
    select: {
      id: true,
      uid: true,
      userId: true
    }
  })

  const payload: RefreshTokenPayload = {
    id: refreshTokenEntity.id,
    uid: refreshTokenEntity.uid,
    userId: refreshTokenEntity.userId
  }

  return payload
}

export async function signRefreshToken (payload: RefreshTokenPayload) {
  const config = getConfig()
  const refreshToken = await encode(
    payload,
    config.private.refreshToken.jwtSecret,
    config.private.refreshToken.maxAge!
  )

  return refreshToken
}

export async function decodeRefreshToken (refreshToken: string) {
  const config = getConfig()
  const payload = await decode<RefreshTokenPayload>(
    refreshToken,
    config.private.refreshToken.jwtSecret
  )

  return payload
}

export async function updateRefreshToken (
  event: H3Event,
  refreshTokenId: RefreshToken['id']
) {
  const prisma = event.context.prisma

  const refreshTokenEntity = await prisma.refreshToken.update({
    where: {
      id: refreshTokenId
    },
    data: {
      uid: uuidv4()
    },
    select: {
      id: true,
      uid: true,
      userId: true
    }
  })

  const payload: RefreshTokenPayload = {
    id: refreshTokenEntity.id,
    uid: refreshTokenEntity.uid,
    userId: refreshTokenEntity.userId
  }

  const refreshToken = await signRefreshToken(payload)

  return refreshToken
}

export function setRefreshTokenCookie (event: H3Event, refreshToken: string) {
  const config = getConfig()
  setCookie(event, config.private.refreshToken.cookieName!, refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: config.private.refreshToken.maxAge,
    sameSite: 'lax'
  })
}

export function getRefreshTokenFromCookie (event: H3Event) {
  const config = getConfig()
  const refreshToken = getCookie(
    event,
    config.private.refreshToken.cookieName!
  )
  return refreshToken
}

export async function findRefreshTokenById (
  event: H3Event,
  id: RefreshToken['id']
) {
  const prisma = event.context.prisma

  const refreshTokenEntity = await prisma.refreshToken.findUnique({
    where: {
      id
    },
    select: {
      userId: true,
      uid: true,
      userAgent: true
    }
  })
  return refreshTokenEntity
}

export async function verifyRefreshToken (event: H3Event, refreshToken: string) {
  // check if the refreshToken is issued by the auth server && if it's not expired
  const payload = await decodeRefreshToken(refreshToken)
  const userAgent = getHeader(event, 'user-agent') ?? null

  const refreshTokenEntity = await findRefreshTokenById(event, payload.id)

  if (
    !refreshTokenEntity || // check if the refresh token is revoked (deleted from database)
    refreshTokenEntity.uid !== payload.uid || // check if the refresh token is fresh (not stolen)
    refreshTokenEntity.userAgent !== userAgent
  ) {
    throw new Error('unauthorized')
  }

  return payload
}

export async function deleteRefreshToken (
  event: H3Event,
  refreshTokenId: RefreshToken['id']
) {
  const prisma = event.context.prisma

  await prisma.refreshToken.delete({
    where: {
      id: refreshTokenId
    },
    select: {
      id: true
    }
  })
}

export async function deleteManyRefreshTokenByUser (
  event: H3Event,
  userId: User['id'],
  exclude?: Session['id']
) {
  const prisma = event.context.prisma

  await prisma.refreshToken.deleteMany({
    where: {
      userId,
      id: {
        not: exclude
      }
    }
  })
}

export async function findManyRefreshTokenByUser (
  event: H3Event,
  userId: User['id']
) {
  const config = getConfig()
  const now = new Date()
  const minDate = new Date(
    now.getTime() - config.private.refreshToken.maxAge! * 1000
  )

  const prisma = event.context.prisma

  const refreshTokens = await prisma.refreshToken.findMany({
    where: {
      userId,
      updatedAt: {
        gt: minDate
      }
    },
    select: {
      id: true,
      userAgent: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return refreshTokens
}

export function deleteRefreshTokenCookie (event: H3Event) {
  const config = getConfig()
  deleteCookie(event, config.private.refreshToken.cookieName!)
}

export async function deleteManyRefreshTokenExpired (event: H3Event) {
  const config = getConfig()
  const now = new Date()
  const minDate = new Date(
    now.getTime() - config.private.refreshToken.maxAge! * 1000
  )

  const prisma = event.context.prisma

  await prisma.refreshToken.deleteMany({
    where: {
      updatedAt: {
        lt: minDate
      }
    }
  })
}
