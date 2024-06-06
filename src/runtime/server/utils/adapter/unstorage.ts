import type { Storage } from 'unstorage'
import { randomUUID } from 'uncrypto'
import { defineAdapter } from './utils'
import type { User, RefreshToken } from '#build/types/auth_adapter'

export const defineUnstorageAdapter = defineAdapter<Storage>((storage) => {
  if (!storage) {
    throw new Error('[nuxt-auth] Unstorage client not defined')
  }

  return {
    name: 'unstorage',
    source: storage,

    user: {
      async findById(id) {
        return storage.getItem<User>(`users:id:${id}:data`)
      },

      async findByEmail(email) {
        const id = await storage.getItem<string>(`users:email:${email}`)
        return id ? this.findById(id) : null
      },

      async create(data) {
        const id = randomUUID()
        await storage.setItem(`users:id:${id}:data`, {
          ...data,
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        await storage.setItem(`users:email:${data.email}`, id)
        return { id }
      },

      async update(id, data) {
        const user = await this.findById(id)
        await storage.setItem(`users:id:${id}:data`, {
          ...user,
          ...data,
          updatedAt: new Date(),
        })
      },
    },

    refreshToken: {
      async findById(id, userId) {
        return storage.getItem<RefreshToken>(`users:id:${userId}:tokens:${id}`)
      },

      async findManyByUserId(userId) {
        const tokens = await storage.getKeys(`users:id:${userId}:tokens`).then((keys) => {
          return storage.getItems<RefreshToken>(keys)
        })
        return tokens.map(token => token.value)
      },

      async create(data) {
        const id = randomUUID()
        await storage.setItem(`users:id:${data.userId}:tokens:${id}`,
          {
            ...data,
            id,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        return { id }
      },

      async update(id, data) {
        const token = await this.findById(id, data.userId)
        await storage.setItem(`users:id:${data.userId}:tokens:${id}`, {
          ...token,
          ...data,
          updatedAt: new Date(),
        })
      },

      async delete(id, userId) {
        await storage.removeItem(`users:id:${userId}:tokens:${id}`)
      },

      async deleteManyByUserId(userId, excludeId) {
        const tokens = await this.findManyByUserId(userId)
        const tokensFiltered = tokens.filter(token => token.id !== excludeId)
        await Promise.all(tokensFiltered.map((token) => {
          return storage.removeItem(`users:id:${userId}:tokens:${token.id}`)
        }))
      },
    },
  }
})
