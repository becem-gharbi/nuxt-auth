import { getRequestFingerprint } from 'h3'
import type { H3Event } from 'h3'
import { createUnauthorizedError } from '../error'

export async function getFingerprintHash(event: H3Event) {
  const fingerprint = await getRequestFingerprint(event, {
    ip: false,
    userAgent: true,
    hash: 'SHA-1',
  })

  return fingerprint
}

export async function verifyFingerprint(event: H3Event, hash: string | null) {
  const fingerprintHash = await getFingerprintHash(event)

  if (fingerprintHash !== hash) {
    throw createUnauthorizedError()
  }
}
