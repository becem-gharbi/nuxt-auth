import type { NitroApp } from 'nitropack'
import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import consola from 'consola'
import { defineUnstorageAdapter } from '#auth'

// @ts-expect-error importing an internal module
import { defineNitroPlugin, useRuntimeConfig } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const config = useRuntimeConfig()

  if (config.adapter === 'unstorage') {
    consola.success('Running with Unstorage adapter')

    const storage = createStorage({
      driver: fsDriver({ base: './playground/unstorage_data' }),
    })

    const unstorageAdapter = defineUnstorageAdapter(storage)

    nitroApp.hooks.hook('request', (event) => {
      event.context._authAdapter = unstorageAdapter
    })
  }
})
