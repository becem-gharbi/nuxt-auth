import type { NitroApp } from 'nitropack'
// import { PrismaClient } from '@prisma/client'
import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import {
  defineUnstorageAdapter,
  // definePrismaAdapter
} from '#auth'

// @ts-expect-error importing an internal module
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  // const prisma = new PrismaClient()

  const storage = createStorage({
    driver: fsDriver({ base: './playground/tmp' }),
  })

  // const prismaAdapter = definePrismaAdapter(prisma)
  const unstorageAdapter = defineUnstorageAdapter(storage)

  nitroApp.hooks.hook('request', (event) => {
    event.context._authAdapter = unstorageAdapter
    // event.context.prisma = prisma
  })

  nitroApp.hooks.hook('auth:email', (from, message) => {
    console.log(from, message)
  })
})
