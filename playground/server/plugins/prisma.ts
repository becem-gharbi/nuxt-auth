import { PrismaClient } from '@prisma/client'
import type { NitroApp } from 'nitropack'
import { prismaAdapter } from '#auth'

// @ts-expect-error importing an internal module
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const client = new PrismaClient()

  const adapter = prismaAdapter(client)

  nitroApp.hooks.hook('request', (event) => {
    event.context._authAdapter = adapter
  })

  nitroApp.hooks.hook('auth:email', (from, message) => {
    console.log(from, message)
  })
})
