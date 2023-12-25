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

/**
 * This composable permits the storage of access token in memory
 * On server-side, it's stored with `useState`. On client-side its stored in a scoped memory.
 * Given that `useState` is accessible on global context, it's cleared on client-side.
 */
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
