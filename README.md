## Nuxt Auth (rc)

A nuxt 3 module to handle authentication

## Features

✔️ Email/password authentication<br>
✔️ Email verification & password reset flows<br>
✔️ Oauth login (Google, Github ...)<br>
✔️ Route middleware protection<br>
✔️ Database agnostic (Prisma based)<br>
✔️ Auth operations via `useAuth` composable<br>
✔️ Auto refresh of access token via `useAuthFetch` composable<br>
✔️ Add dynamic custom claims to access token<br>
✔️ Customizable email templates<br>
✔️ Admin registration management<br>
✔️ User session management via `useAuthSession` composable

## 👉 Demo - [nuxt-auth-starter](https://nuxt-auth-starter.vercel.app) 

## Installation

```bash
npm i @bg-dev/nuxt-auth
```

## Setup

Add `@bg-dev/nuxt-auth` to your nuxt modules and set `auth` options

```javascript
export default defineNuxtConfig({
  //...
  modules: ["@bg-dev/nuxt-auth"],

  auth: {
    accessToken: {}, // Access token config
    refreshToken: {}, // Refresh token config
    oauth: {}, // Oauth providers's config (optional)
    smtp: {}, // SMTP server's config (required)
    emailTemplates: {}, // Html email templates (optional)
    prisma: {}, // Prisma client config
    registration: {}, // Configure registration state and constraints
    baseUrl: "", // Nuxt app base url
    enableGlobalAuthMiddleware: false, // Enable auth middleware on every page
    redirect: {
      login: "", // Path to redirect to when login is required
      logout: "", // Path to redirect to after logout
      home: "", //  Path to redirect to after successful login
      callback: "", // Path to redirect to after login with provider
      passwordReset: "", // Path to redirect to for password reset
      emailVerify: "", // Path to redirect to after email verification
    },
  },
  //...
});
```

Setup Prisma if not already set

```bash
npx prisma init
```

Copy the default schema definition to your `prisma/schema.prisma` file & optionally add your custom fields

```prisma
model User {
  id            Int            @id @default(autoincrement())
  name          String
  email         String         @unique
  picture       String?
  role          Role           @default(user)
  provider      Provider       @default(default)
  password      String?
  verified      Boolean        @default(false)
  blocked       Boolean        @default(false)
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

```bash
npx prisma migrate dev
```

## Usage

For protecting routes, 2 possible approachs can be used

- Globally enable and locally disable

```javascript
enableGlobalAuthMiddleware: true;
```

```javascript
definePageMeta({ auth: false });
```

- Locally enable

```javascript
definePageMeta({ middleware: "auth" }); // Redirects to login path when not loggedIn
```

```javascript
definePageMeta({ middleware: "guest" }); // Redirects to home path when loggedIn
```

For adding custom claims to the access token's payload, set the customClaims accessToken's option in the `nuxt.config.ts`. For **User** related dynamic values, use the [mustache](https://github.com/janl/mustache.js/) syntax.

```javascript
customClaims: {
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": ["user", "admin"],
    "x-hasura-default-role": "{{role}}",
    "x-hasura-user-id": "{{id}}",
  },
},
```

For adding your own email templates, set the emailTemplates options in `nuxt.config.ts`. Exposed variables are **User**, **link** for redirection and **validityInMinutes** (equals to accessToken `maxAge`).

```javascript
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

For adding a server side auth protection, create `server/middleware/auth.ts` and copy the handler below. On protected server routes check `event.context.auth` property.

```javascript
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

## Development

- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.
