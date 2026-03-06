import type { NitroApp } from 'nitropack/types'
import { createStorage } from 'unstorage'
import { defineNitroPlugin } from 'nitropack/runtime'
import { useUnstorageAdapter, setEventContext } from '#auth_utils'
// import fsDriver from 'unstorage/drivers/fs'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  // const storage = createStorage({
  //   driver: fsDriver({ base: './playground/unstorage_data' }),
  // })

  const storage = createStorage() // in memory

  const adapter = useUnstorageAdapter(storage)

  nitroApp.hooks.hook('request', event => setEventContext(event, adapter))
})
