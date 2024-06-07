import { getConfig } from '../config'
import { encode, decode } from './jwt'
import type { User } from '#auth_adapter'

type ResetPasswordPayload = {
  userId: User['id']
}

export async function createResetPasswordToken(payload: ResetPasswordPayload) {
  const config = getConfig()
  const resetPasswordToken = await encode(
    payload,
    config.private.accessToken.jwtSecret + 'p',
    config.private.email!.actionTimeout!,
  )

  return resetPasswordToken
}

export async function verifyResetPasswordToken(resetPasswordToken: string) {
  const config = getConfig()

  const payload = await decode<ResetPasswordPayload>(
    resetPasswordToken,
    config.private.accessToken.jwtSecret + 'p',
  )

  return payload
}
