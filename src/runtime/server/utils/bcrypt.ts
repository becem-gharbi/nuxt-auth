import crypto from 'node:crypto'
import { setRandomFallback, hashSync, compareSync } from 'bcryptjs'

if (!globalThis.crypto) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.crypto = crypto
}

setRandomFallback((len) => {
  const array = new Uint32Array(len)
  const a = globalThis.crypto.getRandomValues(array)
  return Array.prototype.slice.call(a)
})

export { hashSync, compareSync }
