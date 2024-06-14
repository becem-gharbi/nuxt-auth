# Composables

The module provides essential client-side composables, facilitating seamless integration with the backend.

## `useAuth`

The module provides a useAuth composable, which equips you the user with a comprehensive set of functions for managing authentication seamlessly within your project.

- `login` - Initiates the sign-in process using email and password credentials. Upon successful authentication, redirects to the specified `redirect.home` route.
- `loginWithProvider` - Enables sign-in functionality using OAuth providers. After authentication, redirects to the designated `redirect.callback` route.
- `logout` - Logs the user out of the application and redirects to the configured `redirect.logout` route.
- `fetchUser` - Retrieves and updates the user's information, refreshing the reactive state of useAuthSession.
- `register` - Facilitates user registration with required inputs including email, password, and name, providing seamless integration into the authentication flow.
- `requestPasswordReset` - Initiates the process for sending a password reset email to the user, allowing them to securely reset their password.
- `resetPassword` - Allows the user to reset their password securely after initiating a password reset request.
- `requestEmailVerify` - Triggers the sending of an email verification email, ensuring the validity of the user's email address.
- `changePassword` - Enables users to securely change their current password, providing an additional layer of account security.

### Error Handling

Some specific error messages are thrown by these methods.

- `login`
  - Account suspended
  - Account not verified
  - Wrong credentials
- `register`
  - Email already used
  - Account not verified
- `changePassword`
  - Wrong password
- `resetPassword`
  - Password reset not requested

## `useNuxtApp().$auth.fetch`

This function is a wrapper of `$fetch` API, provided by Nuxt, with automatic refresh of access token.

It should be used for fetching data from the server, as it automatically refreshes the access token if it's expired.

## `useAuthSession`

The `useAuthSession` composable is designed for session management, refresh, and storage.

- `user` - A read-only reactive state that contains information about the currently logged-in user.
- `getAccessToken` - Allows retrieval of a fresh access token, automatically refreshing it if it has expired. This functionality proves useful for passing the access token in fetch calls without relying on useAuthFetch.
- `revokeAllSessions` - Revokes all active sessions except the current one, enhancing security by invalidating unused sessions.
- `revokeSession` - Enables revocation of a single session, providing fine-grained control over session management.
- `getAllSessions` - Retrieves information about all active sessions, offering insights into the user's session history.
