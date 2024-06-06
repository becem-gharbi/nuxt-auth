import type { PrismaClient } from '@prisma/client'
import { defineAdapter } from './utils'

export const definePrismaAdapter = defineAdapter<PrismaClient>((prisma) => {
  if (!prisma) {
    throw new Error('[nuxt-auth] Prisma client not defined')
  }

  return {
    name: 'prisma',
    source: prisma,

    user: {
      async findById(id) {
        return prisma.user.findUnique({
          where: {
            id,
          },
        })
      },

      async findByEmail(email) {
        return prisma.user.findUnique({
          where: { email },
        })
      },

      async create(data) {
        return prisma.user.create({
          data,
          select: {
            id: true,
          },
        })
      },

      async update(id, data) {
        await prisma.user.update({
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
        return prisma.refreshToken.findUnique({
          where: {
            id,
            userId,
          },
        })
      },

      async findManyByUserId(userId) {
        return prisma.refreshToken.findMany({
          where: {
            userId,
          },
        })
      },

      async create(data) {
        return prisma.refreshToken.create({
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
        await prisma.refreshToken.update({
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
        await prisma.refreshToken.delete({
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
        await prisma.refreshToken.deleteMany({
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
