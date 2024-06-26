import { setRandomFallback, hashSync, compareSync } from 'bcryptjs'
import crypto from 'uncrypto'

if (!globalThis.crypto) {
  globalThis.crypto = crypto
}

setRandomFallback((len) => {
  const array = new Uint32Array(len)
  const a = globalThis.crypto.getRandomValues(array)
  return Array.prototype.slice.call(a)
})

export { hashSync, compareSync }
