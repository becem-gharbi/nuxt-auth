import { PrismaClient } from '@prisma/client'
import type { NitroApp } from 'nitropack'
import { getConfig } from '../utils'
// @ts-ignore
// eslint-disable-next-line import/named
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const config = getConfig()
  const prisma = new PrismaClient(config.private.prisma)

  nitroApp.hooks.hook('request', (event) => {
    event.context.prisma = prisma
  })
})
