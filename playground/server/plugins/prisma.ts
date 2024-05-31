import { PrismaClient } from '@prisma/client'
import type { NitroApp } from 'nitropack'

// @ts-expect-error importing an internal module
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const prisma = new PrismaClient()

  nitroApp.hooks.hook('request', (event) => {
    event.context.prisma = prisma
  })

  nitroApp.hooks.hook('auth:email', (from, message) => {
    console.log(from, message)
  })
})
