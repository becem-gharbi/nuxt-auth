# Email

The API for sending emails depends on the provider used. The configuration can be set through the `email` property in the `auth` configuration of your `nuxt.config` file.

::: warning Important
Please note that only **HTML** messages are supported at this time.
:::

## Hook

This is the default provider. It allows sending emails via a Nitro hook.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  auth: {
    email: {
      actionTimeout: 30 * 60, // How long the action (e.g password reset) is valid.
      from: "", // The email address to send from.
      provider: {
        name: "hook",
      },
    },
  },
  // ...
});
```

Then you will need to register a handler for `auth:email` hook to send the message.

```ts [server/plugins/email.ts]
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("auth:email", (from, message) => {
    // send message
  });
});
```

## Sendgrid

If you choose to use [Sendgrid](https://sendgrid.com), you will need to provide an API key.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  auth: {
    email: {
      from: process.env.NUXT_AUTH_EMAIL_FROM, // The email address to send from.
      provider: {
        name: "sendgrid",
        apiKey: process.env.NUXT_AUTH_EMAIL_PROVIDER_API_KEY,
      },
    },
  },
  // ...
});
```

## Resend

If you choose to use [Resend](https://resend.com/), you will need to provide an API key.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  auth: {
    email: {
      from: process.env.NUXT_AUTH_EMAIL_FROM, // The email address to send from.
      provider: {
        name: "resend",
        apiKey: process.env.NUXT_AUTH_EMAIL_PROVIDER_API_KEY,
      },
    },
  },
  // ...
});
```

## Template Customization

Default [templates](https://github.com/becem-gharbi/nuxt-auth/tree/main/src/runtime/templates) are provided for email verification and password reset. To customize them, `email.templates` config option is provided. Templates can be added as HTML files with paths relative to the `srcDir`.

The variables below are injected with [mustache](https://github.com/janl/mustache.js) syntax:

- **name** - The user's name.
- **link** - for redirection.
- **validityInMinutes** - equals to `email.actionTimeout`.

It's recommended to use [maily.to](https://maily.to/) to build well-designed templates.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  auth: {
    email: {
      templates: {
        emailVerify: "./email_verify.html",
        passwordReset: "./password_reset.html",
      },
    },
  },
  // ...
});
```
