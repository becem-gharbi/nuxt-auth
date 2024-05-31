import type { ResetPasswordPayload } from '../../../types'
import { getConfig } from '../config'
import { encode, decode } from './jwt'

export async function createResetPasswordToken(payload: ResetPasswordPayload) {
  const config = getConfig()
  const resetPasswordToken = await encode(
    payload,
    config.private.accessToken.jwtSecret + 'p',
    config.private.accessToken.maxAge!,
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
