# Hooks

To extend the functionality of the module, custom hooks have been implemented.

## Nuxt hooks

### `auth:loggedIn`

This hook is triggered on login and logout events, providing the opportunity to incorporate asynchronous logic before executing redirection.

```ts
export default defineNuxtPlugin({
  hooks: {
    "auth:loggedIn": (loggedIn) => {},
  },
});
```

### `auth:fetchError`

This hook is triggered on fetch error and can be useful to globally display API errors.

```ts
export default defineNuxtPlugin({
  hooks: {
    "auth:fetchError": (response) => {},
  },
});
```

## Nitro hooks

### `auth:error`

This hook is triggered on server errors and can be useful to log and report errors.

```ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("auth:error", (error) => {});
});
```

### `auth:registration`

This hook is triggered after successful user registration.

```ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("auth:registration", (user) => {});
});
```
