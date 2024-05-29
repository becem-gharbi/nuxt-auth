import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import type { NitroApp } from 'nitropack'
import { getConfig } from '../utils'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const config = getConfig()
  const prisma = new PrismaClient(config.private.prisma || undefined).$extends(withAccelerate())

  nitroApp.hooks.hook('request', (event) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    event.context.prisma = prisma
  })
})
