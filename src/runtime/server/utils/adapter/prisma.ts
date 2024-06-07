import type { PrismaClient } from '@prisma/client'
import { defineAdapter } from './utils'

export const usePrismaAdapter = defineAdapter<PrismaClient>((prisma) => {
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

    session: {
      async findById(id, userId) {
        return prisma.session.findUnique({
          where: {
            id,
            userId,
          },
        })
      },

      async findManyByUserId(userId) {
        return prisma.session.findMany({
          where: {
            userId,
          },
        })
      },

      async create(data) {
        return prisma.session.create({
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
        await prisma.session.update({
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
        await prisma.session.delete({
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
        await prisma.session.deleteMany({
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
