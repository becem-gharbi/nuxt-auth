# OAuth login

Besides the local email/password login strategy, the module supports login with OAuth2 providers such as Google, and Github.

::: warning Important
Please note that `email` and `name` information are required for registration, otherwise not accessible error message will be returned.
:::

#### Options

The module can accept multiple OAuth2 providers via `oauth` config option:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  auth: {
    oauth: {
      "<provider>": {
        clientId: "",
        clientSecret: "",
        scopes: "",
        authorizeUrl: "",
        tokenUrl: "",
        userUrl: "",
        customParams: {},
      },
    },
  },
  // ...
});
```

To login with an OAuth2 provider the module implements this flow:

1. Via `authorizeUrl`: it requests an authorization code from the provider with `scope` to get user info and `state` to maintain the redirection path of the previously visited protected page. The provider handles user authentication and consent.
2. Via `tokenUrl`: it requests an access token from the OAuth2 authorization server with the authorization `code` returned earlier.
3. Via `userUrl`: it requests user info with the access token returned earlier. The `scope` should permit getting the user `name` and `email` fields.
4. The module checks if the user exists (stored in the database), if not it registers him.
5. The module issues an access token and a refresh token for this new session. Note the tokens issued by the OAuth provider are omitted, they are only needed to get user info.

The redirect URI to be set on `oauth` configuration should be the following:

```bash
{baseUrl}/api/auth/login/{provider}/callback
```
