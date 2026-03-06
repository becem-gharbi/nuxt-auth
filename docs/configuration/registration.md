# Registration

In the OAuth case, a new user is automatically registered.

In the credentials case with email/password, the module provides a `register` function that is returned by the [`useAuth`](/usage/composables.html#useauth) composable to register a new user, requiring the following essential information: `name`, `email`, and `password`. Additionally, it automatically generates a default avatar based on the provided `name`. For OAuth login scenarios, the avatar is retrieved from the respective provider whenever accessible.

## Configuration

The configuration can be set via the `registration` key in the `auth` configuration of your `nuxt.config` file.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  auth: {
    registration: {
      enabled: true, // The registration can be disabled for limited user base.
      requireEmailVerification: true, // Require email verification for new users.
      passwordValidationRegex: "^.+$", // Constraint for password strength.
      emailValidationRegex: "^.+$", // Constraint for email.
      defaultRole: "user", // Role assigned to new users.
    },
  },
  // ...
});
```
