import type { NitroApp } from 'nitropack'
import { PrismaClient } from '@prisma/client'
import consola from 'consola'
import { definePrismaAdapter, setEventContext } from '#auth_utils'

// @ts-expect-error importing an internal module
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  if (process.env.NUXT_ADAPTER === 'prisma') {
    consola.success('Running with Prisma adapter')

    const prisma = new PrismaClient()

    const adapter = definePrismaAdapter(prisma)

    nitroApp.hooks.hook('request', event => setEventContext(event, adapter))
  }
})
