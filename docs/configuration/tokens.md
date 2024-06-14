# Tokens

Tokens play a crucial role in the authorization process within the module. They serve as secure identifiers that grant access to protected resources.

## Configuration

- The module employs the [`HS256`](https://www.loginradius.com/blog/engineering/jwt-signing-algorithms/#hs256) algorithm, utilizing symmetric encryption.
- You have the flexibility to customize encryption options via the `auth` configuration in your `nuxt.config` file.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  auth: {
    accessToken: {
      jwtSecret: "", // Required
      maxAge: 15 * 60, // The access token is valid for 15 minutes
    },
    refreshToken: {
      jwtSecret: "", // Required
      maxAge: 7 * 24 * 60 * 60, // The refresh token is valid for 7 days
      cookieName: "auth_refresh_token",
    },
  },
  // ...
});
```

### **Recommendation**

While you can set the values above directly in the `nuxt.config` file, it is mandatory to store sensitive information such as `jwtSecret` in environment variables. This practice ensures that your secrets remain secure and are not exposed to the public.

> You can use the command below to generate a secure secret for your JWT tokens.

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

```bash [.env]
NUXT_AUTH_ACCESS_TOKEN_JWT_SECRET=your_secret
NUXT_AUTH_REFRESH_TOKEN_JWT_SECRET=your_secret
```

## Custom claims

Some backend services require JWT claims for authorization such as [Hasura](https://hasura.io). To add dynamic custom claims to the access token's payload, `accessToken.customClaims` is provided. For injecting **User** related fields, use the [mustache](https://github.com/janl/mustache.js) syntax.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // ...
  auth: {
    accessToken: {
      customClaims: {
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user", "admin"],
          "x-hasura-default-role": "{{role}}",
          "x-hasura-user-id": "{{id}}",
        },
      },
    },
  },
  // ...
});
```
