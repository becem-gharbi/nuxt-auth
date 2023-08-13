# Nuxt Auth

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A fairly complete solution to handle authentication for your Nuxt 3 project

## Features

- ✔️ Email/password authentication
- ✔️ Email verification & password reset flows
- ✔️ Oauth login (Google, Github ...)
- ✔️ Route middleware protection
- ✔️ Database agnostic (Prisma based)
- ✔️ Auth operations via `useAuth` composable
- ✔️ Auto refresh of access token via `useAuthFetch` composable
- ✔️ Add dynamic custom claims to access token
- ✔️ Customizable email templates
- ✔️ User session management via `useAuthSession` composable
- ✔️ Admin management via `useAuthAdmin` composable
- ✔️ Edge deployment on Vercel, Netlify, Cloudflare ...

## Installation

Add `@bg-dev/nuxt-auth` dependency to your project

```bash
# Using npm
npm install --save-dev @bg-dev/nuxt-auth

# Using yarn
yarn add --dev @bg-dev/nuxt-auth
```

## Setup

Add `@bg-dev/nuxt-auth` to the `modules` section of `nuxt.config.ts` and set `auth` config option

```js
export default defineNuxtConfig({
  modules: ["@bg-dev/nuxt-auth"],

  auth: {
    accessToken: {
      jwtSecret: "", // JWT secret (required)
      maxAge: 30 * 60, // 30 Minutes
      customClaims: {}, // Dynamic custom claims
    },
    refreshToken: {
      cookieName: "auth_refresh_token",
      jwtSecret: "", // JWT secret (required)
      maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    oauth: { // Oauth providers's config (optional)
      "<provider>": {
        clientId: "",
        clientSecret: "",
        scopes: "",
        authorizeUrl: "",
        tokenUrl: "",
        userUrl: ""
      }
    },
    smtp: { // SMTP server's config (optional)
        host: "",
        port: "",
        user: "",
        pass: "",
        from: ""
    },
    emailTemplates: { // Html email templates (optional)
        passwordReset: "",
        emailVerify: ""
    },
    prisma: {}, // Prisma client options (optional)
    registration: {
        enable: true,
        requireEmailVerification: true,
        passwordValidationRegex: "",
        defaultRole: "user"
    },
    baseUrl: "", // Nuxt app base url, used for external redirects
    enableGlobalAuthMiddleware: false, // Enable auth middleware on every page
    webhookKey: "", // Webhook key used in the Webhook-Key header
    redirect: {
      login: "", // Path to redirect to when login is required
      logout: "", // Path to redirect to after logout
      home: "", //  Path to redirect to after successful login
      callback: "", // Path to redirect to after login with provider
      passwordReset: "", // Path to redirect to for password reset
      emailVerify: "", // Path to redirect to after email verification
    },
    admin: {
      enable: false, // Enable admin API
    }
  },.
});
```

Setup Prisma if not already set

```bash
npx prisma init
```

Copy the default schema definition to your `prisma/schema.prisma` file & optionally add your custom fields

#### SQL

```prisma
model User {
  id            Int            @id @default(autoincrement())
  name          String
  email         String         @unique
  picture       String
  role          Role           @default(user)
  provider      Provider       @default(default)
  password      String?
  verified      Boolean        @default(false)
  suspended     Boolean        @default(false)
  refreshTokens RefreshToken[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model RefreshToken {
  id        Int      @id @default(autoincrement())
  uid       String
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

enum Role {
  user
  admin
}

enum Provider {
  default
  google
}
```

#### Mongo DB

```prisma

model User {
  id            String         @id @default(auto()) @map("_id") @db.ObjectId
  name          String
  email         String         @unique
  picture       String
  role          Role           @default(user)
  provider      Provider       @default(default)
  password      String?
  verified      Boolean        @default(false)
  suspended     Boolean        @default(false)
  refreshTokens RefreshToken[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model RefreshToken {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  uid       String
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id])
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

enum Role {
  user
  admin
}

enum Provider {
  default
  google
}
```

Run a migration to reflect schema changes to your database & generate prisma client

#### SQL

```bash
npx prisma migrate dev
```

#### Mongo DB

```bash
npx prisma db push
```

That's it! You can now use `@bg-dev/nuxt-auth` in your Nuxt app ✨

## Usage

### Route protection

For protecting page routes, 2 possible approachs can be used

- Globally enable and locally disable

```js
enableGlobalAuthMiddleware: true;
```

```js
definePageMeta({ auth: false });
```

- Locally enable

```js
definePageMeta({ middleware: "auth" }); // Redirects to login path when not loggedIn
```

```js
definePageMeta({ middleware: "guest" }); // Redirects to home path when loggedIn
```

### Custom claims

For adding custom claims to the access token's payload, set the customClaims accessToken's option in the `nuxt.config.ts`. For **User** related dynamic values, use the [mustache](https://github.com/janl/mustache.js/) syntax.

```js
customClaims: {
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": ["user", "admin"],
    "x-hasura-default-role": "{{role}}",
    "x-hasura-user-id": "{{id}}",
  },
},
```

### Email templates

For adding your own email templates, set the emailTemplates options in `nuxt.config.ts`. Exposed variables are **User**, **link** for redirection and **validityInMinutes** (equals to accessToken `maxAge`).

```js
emailTemplates: {
  passwordReset: `
    <html lang="en">
      <head>
        <style>
          body {
           background-color: #f1f5f9;
           color: #0f172a;
           font-family: "Arial";
           padding: 8px;
         }
        </style>
      </head>

     <body>
       <h2>Hello {{name}},</h2>
       <p>To reset your password, please follow this link</p>
       <a href="{{link}}">Reset your password</a>
       <p>Valid for {{validityInMinutes}} minutes</p>
     </body>
    </html>
    `,
}
```

### Authorization

For adding a server side auth protection, create `server/middleware/auth.ts` and copy the handler below. On protected server routes check `event.context.auth` property.

```js
import { getAccessTokenFromHeader, verifyAccessToken } from "#auth";

export default defineEventHandler((event) => {
  try {
    const accessToken = getAccessTokenFromHeader(event);
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      event.context.auth = payload;
    }
  } catch (error) {}
});
```

### Graphql authorization

For data fetching with Graphql, you can use [nuxt-apollo](https://github.com/becem-gharbi/nuxt-apollo) module.

```js
export default defineNuxtPlugin({
  enforce: "pre",
  hooks: {
    "apollo:http-auth": async (args) => {
      const accessToken = await getAccessToken();
      args.token = accessToken;
    },
  },
});
```

## Hooks

The module provides `auth:loggedIn` hook for implementing custom login on user login and logout events

```js
export default defineNuxtPlugin({
  enforce: "pre", // Should be registered before built-in plugin
  hooks: {
    "auth:loggedIn": async (loggedIn) => {},
  },
});
```

## Notes

- The module implements a JWT based authentication. The `Session` abstract used in the module refers to a `Refresh token stored in DB`

- An `admin` is a user with `role` equals `admin`.

- On production, include prisma generate step to the build command.

- For security reasons, it's recommended to add rate limiting and CORS policy.

- The redirect URI for oauth providers should be

```bash
{baseUrl}/api/auth/login/{provider}/callback
```

- The sessions are subject to expiration in case the user does not refresh his login. To flush this useless data, the module exposes the following REST API

```bash
curl -X DELETE -H "Webhook-Key: {webhookKey}" {baseUrl}/api/auth/session/revoke/expired
```

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contribution you make is greatly appreciated.

## License

[MIT License](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@bg-dev/nuxt-auth/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@bg-dev/nuxt-auth
[npm-downloads-src]: https://img.shields.io/npm/dt/@bg-dev/nuxt-auth.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@bg-dev/nuxt-auth
[license-src]: https://img.shields.io/npm/l/@bg-dev/nuxt-auth.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@bg-dev/nuxt-auth
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
