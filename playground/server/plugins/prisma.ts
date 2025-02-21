import type { NitroApp } from 'nitropack/types'
import { PrismaClient } from '@prisma/client'
import consola from 'consola'
import { defineNitroPlugin } from 'nitropack/runtime'
import { usePrismaAdapter, setEventContext } from '#auth_utils'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  if (process.env.NUXT_ADAPTER === 'prisma') {
    consola.success('Running with Prisma adapter')

    const prisma = new PrismaClient()

    const adapter = usePrismaAdapter(prisma)

    nitroApp.hooks.hook('request', event => setEventContext(event, adapter))
  }
})
