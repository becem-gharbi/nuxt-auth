import type { PrismaClient, User as PrismaUser, RefreshToken as PrismaRefreshToken } from '@prisma/client'
import { defineAdapter } from './factory'

export const prismaAdapter = defineAdapter<PrismaClient, PrismaUser, PrismaRefreshToken>((client) => {
  if (!client) {
    throw new Error('[nuxt-auth] Prisma adapter requires a Prisma client')
  }

  return {
    name: 'prisma',

    user: {
      async findById(id) {
        return client.user.findUnique({
          where: { id },
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
            id,
          },
          data,
        })
      },
    },
    refreshToken: {
      async findById(id) {
        return client.refreshToken.findUnique({
          where: { id },
        })
      },

      async findManyByUserId(id) {
        return client.refreshToken.findMany({
          where: { userId: id },
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
            id,
          },
          data,
        })
      },

      async delete(id) {
        await client.refreshToken.delete({
          where: {
            id,
          },
        })
      },
    },
  }
})
