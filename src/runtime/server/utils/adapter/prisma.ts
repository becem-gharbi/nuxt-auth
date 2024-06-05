import type { PrismaClient, User, RefreshToken } from '@prisma/client'
import { defineAdapter } from './index'

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
            id: id as User['id'],
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
            id: id as User['id'],
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
            id: id as RefreshToken['id'],
            userId: userId as User['id'],
          },
        })
      },

      async findManyByUserId(id) {
        return client.refreshToken.findMany({
          where: {
            userId: id as User['id'],
          },
        })
      },

      async create(data) {
        return client.refreshToken.create({
          data: {
            ...data,
            userId: data.userId as User['id'],
          },
          select: {
            id: true,
          },
        })
      },

      async update(id, data) {
        await client.refreshToken.update({
          where: {
            id: id as RefreshToken['id'],
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
            id: id as RefreshToken['id'],
            userId: userId as User['id'],
          },
          select: {
            id: true,
          },
        })
      },

      async deleteManyByUserId(id, excludeId) {
        await client.refreshToken.deleteMany({
          where: {
            userId: id as User['id'],
            id: {
              not: excludeId as RefreshToken['id'],
            },
          },
        })
      },
    },
  }
})
