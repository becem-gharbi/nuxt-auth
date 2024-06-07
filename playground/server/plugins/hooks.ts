import type { NitroApp } from 'nitropack'
import consola from 'consola'
import { defineAdapter, setEventContext } from '#auth_utils'

// @ts-expect-error importing an internal module
import { defineNitroPlugin } from '#imports'

const useAdapter = defineAdapter<undefined>(() => {
  return {

  }
})

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const adapter = useAdapter(undefined)

  nitroApp.hooks.hook('request', event => setEventContext(event, adapter))

  nitroApp.hooks.hook('auth:email', (from, message) => {
    consola.info('Email', from, message)
  })

  nitroApp.hooks.hook('auth:registration', (user) => {
    consola.info('Registration', user)
  })

  nitroApp.hooks.hook('auth:error', consola.error)
})
