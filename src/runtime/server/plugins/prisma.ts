import { PrismaClient } from '@prisma/client'
import { getConfig } from '../utils'
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp) => {
  const config = getConfig()
  const prisma = new PrismaClient(config.private.prisma)

  nitroApp.hooks.hook('request', (event) => {
    event.context.prisma = prisma
  })
})
