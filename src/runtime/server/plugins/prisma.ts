import { PrismaClient } from '@prisma/client'
import type { NitroApp } from 'nitropack'
import { getConfig } from '../utils'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const config = getConfig()
  const prisma = new PrismaClient(config.private.prisma || undefined)

  nitroApp.hooks.hook('request', (event) => {
    event.context.prisma = prisma
  })
})
