import type { Prisma, User, RefreshToken } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { defineAdapter } from '#auth'

export const prismaAdapter = defineAdapter<Prisma.PrismaClientOptions>((options) => {
  const client = new PrismaClient(options)

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
      async findById(id) {
        return client.refreshToken.findUnique({
          where: {
            id: id as RefreshToken['id'],
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
          data,
          select: {
            id: true,
          },
        })
      },

      async delete(id) {
        await client.refreshToken.delete({
          where: {
            id: id as RefreshToken['id'],
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
