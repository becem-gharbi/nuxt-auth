import type { H3Event } from 'h3'
import type { ResetPasswordPayload } from '../../../types'
import { encode, decode } from './jwt'
import { getConfig } from '#auth'

export async function createResetPasswordToken (payload: ResetPasswordPayload) {
  const config = getConfig()
  const resetPasswordToken = await encode(
    payload,
    config.private.accessToken.jwtSecret + 'reset-password',
    config.private.accessToken.maxAge!
  )

  return resetPasswordToken
}

export async function verifyResetPasswordToken (resetPasswordToken: string) {
  const config = getConfig()

  const payload = await decode<ResetPasswordPayload>(
    resetPasswordToken,
    config.private.accessToken.jwtSecret + 'reset-password'
  )

  return payload
}
