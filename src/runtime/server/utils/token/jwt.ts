import { jwtVerify, SignJWT } from 'jose'
import type { JWTPayload } from 'jose'
import { createUnauthorizedError } from '../error'

async function encode(payload: JWTPayload, key: string, maxAge: number) {
  const secret = new TextEncoder().encode(key)
  const exp = `${maxAge}s`

  return await new SignJWT(payload)
    .setExpirationTime(exp)
    .setIssuer('nuxt-auth')
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret)
}

async function decode<T>(token: string, key: string) {
  const secret = new TextEncoder().encode(key)

  const { payload } = await jwtVerify<T>(token, secret).catch(() => {
    throw createUnauthorizedError()
  })

  return payload
}

export { encode, decode }
