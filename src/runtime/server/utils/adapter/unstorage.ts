import type { Storage } from 'unstorage'
import { randomUUID } from 'uncrypto'
import type { UserBase, RefreshTokenBase } from '../../../types'
import { defineAdapter } from './utils'

export const defineUnstorageAdapter = defineAdapter<Storage>((client) => {
  if (!client) {
    throw new Error('Unstorage client not defined')
  }

  return {
    name: 'unstorage',

    user: {
      async findById(id) {
        return client.getItem<UserBase>(`users:${id}`)
      },

      async findByEmail(email) {
        const itemsAll = await client.getKeys('users').then(keys => client.getItems<UserBase>(keys))
        const itemsFiltered = itemsAll.find(item => item.value.email === email)
        return itemsFiltered?.value ?? null
      },

      async create(data) {
        const id = randomUUID()
        await client.setItem(`users:${id}`, {
          ...data,
          id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
        return { id }
      },

      async update(id, data) {
        const item = await this.findById(id)
        await client.setItem(`users:${id}`, {
          ...item,
          ...data,
          updatedAt: Date.now(),
        })
      },
    },

    refreshToken: {
      async findById(id) {
        return client.getItem<RefreshTokenBase>(`refresh_tokens:${id}`)
      },

      async findManyByUserId(id) {
        const items = await client.getKeys('refresh_tokens').then((keys) => {
          return client.getItems<RefreshTokenBase>(keys)
        })
        const itemsFiltered = items.filter(item => item.value.userId === id)
        return itemsFiltered.map(item => item.value)
      },

      async create(data) {
        const id = randomUUID()
        await client.setItem(`refresh_tokens:${id}`,
          {
            ...data,
            id,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
        return { id }
      },

      async update(id, data) {
        const item = await this.findById(id)
        await client.setItem(`refresh_tokens:${id}`, {
          ...item,
          ...data,
          updatedAt: Date.now(),
        })
      },

      async delete(id) {
        await client.removeItem(`refresh_tokens:${id}`)
      },

      async deleteManyByUserId(id, excludeId) {
        const items = await this.findManyByUserId(id)
        const itemsFiltered = items.filter(item => item.id !== excludeId)
        await Promise.all(itemsFiltered.map((item) => {
          return client.removeItem(`refresh_tokens:${item.id}`)
        }))
      },
    },
  }
})
