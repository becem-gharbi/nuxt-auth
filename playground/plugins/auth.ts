export default defineNuxtPlugin({
  enforce: "pre",
  hooks: {
    "auth:loggedIn": async (state) => {
      console.log("AUTH LOGGED IN", state);
    },
  },
});
