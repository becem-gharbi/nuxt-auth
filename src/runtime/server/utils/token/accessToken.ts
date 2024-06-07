import { getRequestHeader } from 'h3'
import type { H3Event } from 'h3'
import { getConfig } from '../config'
import { mustache } from '../mustache'
import type { AccessTokenPayload } from '../../../types/common'
import { encode, decode } from './jwt'
import { getFingerprintHash, verifyFingerprint } from './fingerprint'
import type { User, Session } from '#auth_adapter'

export async function createAccessToken(event: H3Event, user: User, sessionId: Session['id']) {
  const config = getConfig()

  let customClaims = {}

  if (typeof config.private.accessToken.customClaims === 'object') {
    const template = JSON.stringify(config.private.accessToken.customClaims)
    const output = mustache.render(template, user)
    customClaims = JSON.parse(output)
  }

  const fingerprint = await getFingerprintHash(event)

  const payload: AccessTokenPayload = {
    ...customClaims,
    sessionId,
    fingerprint,
    userId: user.id,
    userRole: user.role,
    provider: user.provider,
    verified: user.verified,
    suspended: user.suspended,
  }

  const accessToken = await encode(
    payload,
    config.private.accessToken.jwtSecret,
    config.private.accessToken.maxAge!,
  )

  return {
    access_token: accessToken,
    expires_in: config.private.accessToken.maxAge,
  }
}

/**
 * Get the access token from Authorization header
 * @param event
 * @returns accessToken
 */
export function getAccessTokenFromHeader(event: H3Event) {
  const authorization = getRequestHeader(event, 'Authorization')
  if (authorization) {
    const accessToken = authorization.split('Bearer ')[1]
    return accessToken
  }
}

/**
 * Check if the access token is issued by the server and not expired
 * @param event H3Event
 * @param accessToken
 * @returns accessTokenPayload
 */
export async function verifyAccessToken(event: H3Event, accessToken: string) {
  const config = getConfig()

  const payload = await decode<AccessTokenPayload>(
    accessToken,
    config.private.accessToken.jwtSecret,
  )

  await verifyFingerprint(event, payload.fingerprint)

  return payload
}
