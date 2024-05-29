import { PrismaClient } from '@prisma/client'
import type { NitroApp } from 'nitropack'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const prisma = new PrismaClient()

  nitroApp.hooks.hook('request', (event) => {
    event.context.prisma = prisma
  })
})
