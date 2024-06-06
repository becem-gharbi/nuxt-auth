import type { PrismaClient } from '@prisma/client'
import { defineAdapter } from './utils'

export const definePrismaAdapter = defineAdapter<PrismaClient>((client) => {
  if (!client) {
    throw new Error('Prisma client not defined')
  }

  return {
    name: 'prisma',

    user: {
      async findById(id) {
        return client.user.findUnique({
          where: {
            id,
          },
        })
      },

      async findByEmail(email) {
        return client.user.findUnique({
          where: { email },
        })
      },

      async create(data) {
        return client.user.create({
          data,
          select: {
            id: true,
          },
        })
      },

      async update(id, data) {
        await client.user.update({
          where: {
            id,
          },
          data,
          select: {
            id: true,
          },
        })
      },
    },

    refreshToken: {
      async findById(id, userId) {
        return client.refreshToken.findUnique({
          where: {
            id,
            userId,
          },
        })
      },

      async findManyByUserId(userId) {
        return client.refreshToken.findMany({
          where: {
            userId,
          },
        })
      },

      async create(data) {
        return client.refreshToken.create({
          data: {
            ...data,
            userId: data.userId,
          },
          select: {
            id: true,
          },
        })
      },

      async update(id, data) {
        await client.refreshToken.update({
          where: {
            id,
          },
          data: {
            uid: data.uid,
          },
          select: {
            id: true,
          },
        })
      },

      async delete(id, userId) {
        await client.refreshToken.delete({
          where: {
            id,
            userId,
          },
          select: {
            id: true,
          },
        })
      },

      async deleteManyByUserId(userId, excludeId) {
        await client.refreshToken.deleteMany({
          where: {
            userId,
            id: {
              not: excludeId,
            },
          },
        })
      },
    },
  }
})
