import type { NitroApp } from 'nitropack'
import { PrismaClient } from '@prisma/client'
import consola from 'consola'
import { definePrismaAdapter } from '#auth'

// @ts-expect-error importing an internal module
import { defineNitroPlugin, useRuntimeConfig } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const config = useRuntimeConfig()

  if (config.adapter === 'prisma') {
    consola.success('Running with Prisma adapter')

    const prisma = new PrismaClient()

    const prismaAdapter = definePrismaAdapter(prisma)

    nitroApp.hooks.hook('request', (event) => {
      event.context._authAdapter = prismaAdapter
      event.context.prisma = prisma
    })
  }
})
