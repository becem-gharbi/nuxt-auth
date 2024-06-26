import type { NitroApp } from 'nitropack'
import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import consola from 'consola'
import { useUnstorageAdapter, setEventContext } from '#auth_utils'

// @ts-expect-error importing an internal module
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  if (process.env.NUXT_ADAPTER === 'unstorage') {
    consola.success('Running with Unstorage adapter')

    const storage = createStorage({
      driver: fsDriver({ base: './playground/unstorage_data' }),
    })

    const adapter = useUnstorageAdapter(storage)

    nitroApp.hooks.hook('request', event => setEventContext(event, adapter))
  }
})
