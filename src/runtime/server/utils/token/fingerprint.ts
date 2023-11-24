import { getRequestFingerprint } from 'h3'
import type { H3Event } from 'h3'
import { hashSync, compareSync } from '../bcrypt'

async function getFingerprint (event: H3Event) {
  const fingerprint = await getRequestFingerprint(event, {
    ip: false,
    userAgent: true,
    hash: false
  })

  return fingerprint ?? ''
}

export async function getFingerprintHash (event:H3Event) {
  const fingerprint = await getFingerprint(event)

  return fingerprint && hashSync(fingerprint, 12)
}

export async function verifyFingerprint (event: H3Event, hash:string) {
  const fingerprint = await getFingerprint(event)
  const match = compareSync(fingerprint, hash)

  if (match === false) {
    throw new Error('unauthorized')
  }
}
