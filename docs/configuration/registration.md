# Registration

In the OAuth case, a new user is automatically registered.

In credentials case with email/password, the module provides a `register` function that is returned by [`useAuth`](/usage/composables.html#useauth) composable to register a new user requiring essential information are: `name`, `email` and `password`. Additionally, it automatically generates a default avatar based on the provided `name`. For OAuth login scenarios, the avatar is retrieved from the respective provider whenever accessible.

## Configuration

The configuration can be set via the `registration` key in the `auth` configuration of your `nuxt.config` file.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  auth: {
    registration: {
      enabled: true, // The registration can be disabled for limited user base.
      requireEmailVerification: true, // Allow non-verified users.
      passwordValidationRegex: "^.+$", // Constraint for password strength.
      emailValidationRegex: "^.+$", // Constraint for email.
      defaultRole: "user", // Role assigned to new users.
    },
  },
  // ...
});
```
