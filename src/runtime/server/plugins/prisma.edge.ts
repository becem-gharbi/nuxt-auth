import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { getConfig } from '../utils'
// eslint-disable-next-line import/named
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp) => {
  const config = getConfig()
  const prisma = new PrismaClient(config.private.prisma).$extends(withAccelerate())

  nitroApp.hooks.hook('request', (event) => {
    event.context.prisma = prisma
  })
})
