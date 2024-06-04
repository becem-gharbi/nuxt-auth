import consola from 'consola'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  hooks: {
    'auth:loggedIn': (state) => {
      consola.info('logged in', state)
    },
    'auth:fetchError': (response) => {
      consola.info('fetch error', response?._data?.message)
    },
  },
})
