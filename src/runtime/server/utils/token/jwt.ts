import { jwtVerify, SignJWT } from "jose";
import type { JWTPayload } from "jose";

async function encode(payload: JWTPayload, key: string, maxAge: number) {
  const secret = new TextEncoder().encode(key);
  const exp = `${maxAge}s`;

  return new SignJWT(payload)
    .setExpirationTime(exp)
    .setIssuer("nuxt-auth")
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret);
}

async function decode<T>(token: string, key: string) {
  const secret = new TextEncoder().encode(key);

  const { payload } = await jwtVerify(token, secret);

  return payload as T;
}

export { encode, decode };
