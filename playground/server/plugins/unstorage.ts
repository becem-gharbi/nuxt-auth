import type { NitroApp } from 'nitropack'
import { createStorage } from 'unstorage'
// import fsDriver from 'unstorage/drivers/fs'
import consola from 'consola'
import { defineNitroPlugin } from 'nitropack/runtime'
import { useUnstorageAdapter, setEventContext } from '#auth_utils'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  if (process.env.NUXT_ADAPTER === 'unstorage') {
    consola.success('Running with Unstorage adapter')

    // const storage = createStorage({
    //   driver: fsDriver({ base: './playground/unstorage_data' }),
    // })

    const storage = createStorage()

    const adapter = useUnstorageAdapter(storage)

    nitroApp.hooks.hook('request', event => setEventContext(event, adapter))
  }
})
