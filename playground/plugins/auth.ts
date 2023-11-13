export default defineNuxtPlugin({
  enforce: 'pre',
  hooks: {
    'auth:loggedIn': (state) => {
      // console.log('AUTH LOGGED IN', state)
    }
  }
})
