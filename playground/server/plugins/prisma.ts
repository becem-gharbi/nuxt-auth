import type { NitroApp } from 'nitropack'
import { PrismaClient } from '@prisma/client'
import { prismaAdapter } from '../utils/adapter'

// @ts-expect-error importing an internal module
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const client = new PrismaClient()

  const adapter = prismaAdapter(client)

  nitroApp.hooks.hook('request', (event) => {
    event.context._authAdapter = adapter
    event.context.prisma = client
  })

  nitroApp.hooks.hook('auth:email', (from, message) => {
    console.log(from, message)
  })
})
