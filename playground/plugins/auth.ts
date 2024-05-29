import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  enforce: 'pre',
  hooks: {
    'auth:loggedIn': () => {
    },
  },
})
