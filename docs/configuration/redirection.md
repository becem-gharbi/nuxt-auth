# Redirection

The module offers automatic redirection to predefined routes, a feature inspired by the functionality found in the [@nuxtjs/auth-next](https://auth.nuxtjs.org) Nuxt 2 module.

## Configuration

The configuration can be set through the `redirect` key in the `auth` configuration of your `nuxt.config` file.

::: warning
Please ensure that the routes specified in the configuration exist in your application.
:::

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  auth: {
    redirect: {
      // These are example routes, please replace them with your own
      login: "/auth/login",
      logout: "/auth/login",
      home: "/",
      callback: "/auth/callback",
      passwordReset: "/auth/reset-password",
      emailVerify: "/auth/verify-email",
    },
  },
  // ...
});
```

- **`login`** - The page that the user will be redirected to if login is required.
- **`logout`** - The page that the user will be redirected to after logging out.
- **`home`** - The page that the user will be redirected to after a successful login.
- **`callback`** - The page that the user will be redirected to after a successful authentication with a third-party provider.
- **`passwordReset`** - The page that the user will be redirected to after a password reset.
- **`emailVerify`** - The page that the user will be redirected to after verifying their email.
