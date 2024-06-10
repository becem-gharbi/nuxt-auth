import type { Storage } from 'unstorage'
import { randomUUID } from 'uncrypto'
import { defineAdapter } from './utils'
import type { User, Session } from '#auth_adapter'

export const useUnstorageAdapter = defineAdapter<Storage>((storage) => {
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
        const user: User = {
          ...data,
          id: randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        await storage.setItem(`users:id:${user.id}:data`, user)
        await storage.setItem(`users:email:${data.email}`, user.id)
        return user
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

    session: {
      async findById(id, userId) {
        return storage.getItem<Session>(`users:id:${userId}:sessions:${id}`)
      },

      async findManyByUserId(userId) {
        const sessions = await storage.getKeys(`users:id:${userId}:sessions`).then((keys) => {
          return storage.getItems<Session>(keys)
        })
        return sessions.map(session => session.value)
      },

      async create(data) {
        const id = randomUUID()
        await storage.setItem(`users:id:${data.userId}:sessions:${id}`,
          {
            ...data,
            id,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        return { id }
      },

      async update(id, data) {
        const session = await this.findById(id, data.userId)
        await storage.setItem(`users:id:${data.userId}:sessions:${id}`, {
          ...session,
          ...data,
          updatedAt: new Date(),
        })
      },

      async delete(id, userId) {
        await storage.removeItem(`users:id:${userId}:sessions:${id}`)
      },

      async deleteManyByUserId(userId, excludeId) {
        const sessions = await this.findManyByUserId(userId)
        const sessionsFiltered = sessions.filter(session => session.id !== excludeId)
        await Promise.all(sessionsFiltered.map((session) => {
          return storage.removeItem(`users:id:${userId}:sessions:${session.id}`)
        }))
      },
    },
  }
})
