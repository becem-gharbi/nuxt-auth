import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  hooks: {
    'auth:loggedIn': (state) => {
      console.log('logged in', state)
    },
    'auth:fetchError': (response) => {
      console.log('fetch error', response?._data?.message)
    },
  },
})
