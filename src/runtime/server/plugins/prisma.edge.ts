import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import type { NitroApp } from 'nitropack'
import { getConfig } from '../utils'
// @ts-ignore
// eslint-disable-next-line import/named
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp:NitroApp) => {
  const config = getConfig()
  const prisma = new PrismaClient(config.private.prisma as any).$extends(withAccelerate())

  nitroApp.hooks.hook('request', (event) => {
    // @ts-ignore
    event.context.prisma = prisma
  })
})
