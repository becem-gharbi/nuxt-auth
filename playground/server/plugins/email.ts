import type { NitroApp } from 'nitropack'
import consola from 'consola'

// @ts-expect-error importing an internal module
import { defineNitroPlugin } from '#imports'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  nitroApp.hooks.hook('auth:email', (from, message) => {
    consola.info('Email', from, message)
  })
})
