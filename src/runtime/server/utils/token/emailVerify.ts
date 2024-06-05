import { getConfig } from '../config'
import { decode, encode } from './jwt'
import type { User } from '#build/types/auth_adapter'

type EmailVerifyPayload = {
  userId: User['id']
}

export async function createEmailVerifyToken(payload: EmailVerifyPayload) {
  const config = getConfig()

  const emailVerifyToken = await encode(
    payload,
    config.private.accessToken.jwtSecret + 'e',
    config.private.email!.actionTimeout!,
  )

  return emailVerifyToken
}

export async function verifyEmailVerifyToken(emailVerifyToken: string) {
  const config = getConfig()

  const payload = await decode<EmailVerifyPayload>(
    emailVerifyToken,
    config.private.accessToken.jwtSecret + 'e',
  )

  return payload
}
