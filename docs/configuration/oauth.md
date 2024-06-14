# OAuth login

Besides the local email/password login strategy, the module supports login with OAuth2 providers such as Google, and Github. Note that the tokens are issued by the module's backend and not by the OAuth provider. Thus authorization for the provider's services is not possible.

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
      },
    },
  },
  // ...
});
```

The redirect URI to be set on `oauth` configuration should be the following:

```bash
{baseUrl}/api/auth/login/{provider}/callback
```
