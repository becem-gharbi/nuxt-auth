## Nuxt Auth
## ⚠️ *Under development*

## Features

- Email/password authentication
- Email verification & password reset flow
- Oauth login (Google, Github ...)
- Route middleware auth protection
- Database agnostic (Prisma based)
- Auth operations through `useAuth` composable
- Auto refresh of access token through `useAuthFetch` composable
- Add dynamic custom claims to access token
- Customizable email templates
- Typescript support

## Demo

For a demonstration follow this [link](https://nuxt-auth-starter.vercel.app/)

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
    accessTokenSecret:   // Access token secret key HS256
    refreshTokenSecret:  // Refresh token secret key HS256
    accessTokenExpiresIn:  // Access token'JWT expiresIn;
    refreshTokenMaxAge: // Refresh token's cookie maxAge
    accessTokenClaims: // Custom claims added to access token (optional)

    oauth: { // Oauth providers's config (optional)
      //...
      google: {
      },
      //...
    },

    smtp: { // SMTP server's config (required)
    },

    emailTemplates: { // Html email templates (optional)
    },

    baseUrl: // Nuxt app base url
    enableGlobalAuthMiddleware: // Enable auth middleware on every page
    refreshTokenCookieName:
    redirect: {
      login: // Path to redirect to when login is required
      logout: // Path to redirect to after logout
      home: //  Path to redirect to after successful login
      callback: // Path to redirect to after login with provider
      passwordReset: // Path to redirect to for password reset
      emailVerify:  // Path to redirect to after email verification
    }
  },
  //...
});
```

<br>

Setup Prisma if not already set

```bash
npx prisma init
```

<br>

Copy the default schema definition to your `prisma/schema.prisma` file & optionally add your custom fields

```prisma
model User {
  id            Int            @id @default(autoincrement())
  name          String
  email         String         @unique
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
  createdAt DateTime @default(now())
}

enum Role {
  user
  admin
}

enum Provider {
  default
  google
  github
  facebook
}
```

<br>

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

<br>

For adding custom claims to the access token's payload, set the accessTokenClaims option in the `nuxt.config.ts`. For **User** related dynamic values, use the [mustache](https://github.com/janl/mustache.js/) syntax.

```javascript
accessTokenClaims: {
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": ["user", "admin"],
    "x-hasura-default-role": "{{role}}",
    "x-hasura-user-id": "{{id}}",
  },
},
```

<br>

For adding your own email templates, set the emailTemplates options in `nuxt.config.ts`. For variable interpolation use the [mustache](https://github.com/janl/mustache.js/) syntax. Exposed variables are **User properties** and **link** for redirection url.

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
     </body>
    </html>
    `
}
```

## Appendix

![workflow](https://github.com/becem-gharbi/nuxt-auth/blob/beta/workflow.png)

## Development

- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.
