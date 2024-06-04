import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  hooks: {
    'auth:loggedIn': (state) => {
      console.log('logged in', state)
    },
  },
})
