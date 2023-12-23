import { useState } from '#imports'

interface TokenStore {
  access_token: string;
  expires: number;
}

function memoryStorage () {
  let store: TokenStore | null = null

  return {
    get value () {
      return store
    },
    set value (data: TokenStore | null) {
      if (process.client) { store = data }
    }
  }
}

const memory = memoryStorage()

export function useAuthToken () {
  const state = useState<TokenStore | null>('auth-token', () => null)

  if (process.client && state.value) {
    memory.value = { ...state.value }
    state.value = null
  }

  return {
    get value () {
      if (process.client) {
        return memory.value
      }
      return state.value
    },

    set value (data: TokenStore | null) {
      if (process.client) {
        memory.value = data
      } else {
        state.value = data
      }
    },

    get expired () {
      if (this.value) {
        const msRefreshBeforeExpires = 3000
        const expires = this.value.expires - msRefreshBeforeExpires
        return expires < Date.now()
      }
      return false
    }
  }
}
