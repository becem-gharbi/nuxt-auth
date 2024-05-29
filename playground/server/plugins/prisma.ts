import { PrismaClient } from '@prisma/client'
import type { NitroApp } from 'nitropack'
// @ts-ignore

import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const prisma = new PrismaClient()

  nitroApp.hooks.hook('request', (event) => {
    event.context.prisma = prisma
  })
})
