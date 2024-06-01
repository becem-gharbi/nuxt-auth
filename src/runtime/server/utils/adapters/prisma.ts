import type { PrismaClient, User as PrismaUser, RefreshToken as PrismaRefreshToken } from '@prisma/client'
import { defineAdapter } from './factory'

export const prismaAdapter = defineAdapter<PrismaClient>((client) => {
  if (!client) {
    throw new Error('[nuxt-auth] Prisma adapter requires a Prisma client')
  }

  return {
    name: 'prisma',

    user: {
      async findById(id) {
        return client.user.findUnique({
          where: {
            id: id as PrismaUser['id'],
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
        })
      },

      async update(id, data) {
        await client.user.update({
          where: {
            id: id as PrismaUser['id'],
          },
          data,
        })
      },
    },
    refreshToken: {
      async findById(id) {
        return client.refreshToken.findUnique({
          where: {
            id: id as PrismaRefreshToken['id'],
          },
        })
      },

      async findManyByUserId(id) {
        return client.refreshToken.findMany({
          where: {
            userId: id as PrismaUser['id'],
          },
        })
      },

      async create(data) {
        return client.refreshToken.create({
          data,
        })
      },

      async update(id, data) {
        await client.refreshToken.update({
          where: {
            id: id as PrismaRefreshToken['id'],
          },
          data,
        })
      },

      async delete(id) {
        await client.refreshToken.delete({
          where: {
            id: id as PrismaRefreshToken['id'],
          },
        })
      },

      async deleteManyByUserId(id, excludeId) {
        await client.refreshToken.deleteMany({
          where: {
            userId: id as PrismaUser['id'],
            id: {
              not: excludeId as PrismaRefreshToken['id'],
            },
          },
        })
      },
    },
  }
})
