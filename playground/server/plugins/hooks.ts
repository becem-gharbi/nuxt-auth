import type { NitroApp } from 'nitropack'
import consola from 'consola'
import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  nitroApp.hooks.hook('auth:email', (from, message) => {
    consola.info('Email', from, message)
  })

  nitroApp.hooks.hook('auth:registration', (user) => {
    consola.info('Registration', user)
  })

  nitroApp.hooks.hook('auth:error', consola.error)
})
