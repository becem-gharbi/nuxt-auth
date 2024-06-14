# Registration

The module facilitates user registration, requiring essential information are:

- Name
- Email
- Password

Additionally, it automatically generates a default avatar based on the provided `name`. For social login scenarios, the avatar is retrieved from the respective provider whenever accessible.

## Configuration

The configuration can be set through the `registration` key in the `auth` configuration of your `nuxt.config` file.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  auth: {
    registration: {
      enabled: true, // The registration can be disabled for limited user base.
      requireEmailVerification: true, // Allow non-verified users
      passwordValidationRegex: "^.+$", // Constraint for password strength
      emailValidationRegex: "^.+$", // Constaint for email
      defaultRole: "user", // Role assigned to new users
    },
  },
  // ...
});
```

## Composable

The module provides `register` function that is returned by [`useAuth`](/composables#useauth) composable to register a new user.

```vue
<script lang="ts" setup>
const { register, requestEmailVerify } = useAuth();

// Function to handle the registration process
const handleSubmit = async () => {
  try {
    await register({
      email: "john@example.com",
      name: "Johnathan Green",
      password: "your_password",
    });

    // Send email verification
    // This is only required if `requireEmailVerification` is set to `true`
    // Remember to have the email configuration set up
    await requestEmailVerify("john@example.com");
  } catch (error: any) {
    console.log(error.data.message);
    //TODO: show the user a toast message
  }
};
</script>
```
