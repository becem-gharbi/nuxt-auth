# Nuxt Directus Auth

A Nuxt 3 module to handle Directus authentication

## Features

- Support for Universal and SPA Nuxt 3 applications
- Implements Directus authentication through `useDirectusAuth` composable
- Auto refresh of access token through `useDirectusFetch` composable
- Route middleware auth protection
- Typescript support

## Demo

Follow this [link](https://directus-starter.bg-corner.tech)

## Installation

```bash
npm i @bg-dev/nuxt-auth
```

## Setup

Add `@bg-dev/nuxt-auth` to your nuxt modules and set `directusAuth` options

```javascript
export default defineNuxtConfig({
  //...
  modules: ["@bg-dev/nuxt-auth"],

  directusAuth: {
    nuxtBaseUrl: "http://localhost:3000", // Nuxt app base url
    enableGlobalAuthMiddleware: false, // Enable auth middleware on every page
    refreshTokenCookieName: "directus_refresh_token", // Directus refresh token cookie name (optional)
    redirect: {
      login: "/auth/login", // Path to redirect when login is required
      logout: "/auth/login", // Path to redirect after logout
      home: "/home", // Path to redirect after successful login
      resetPassword: "/auth/reset-password", // Path to redirect for password reset
      callback: "/auth/callback", // Path to redirect after login with provider
    },
  },
  //...
});
```

####

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

## Notes

- In production, Directus and Nuxt applications **SHOULD** share the same domain name
- Refer to [directus docs](https://docs.directus.io/self-hosted/sso.html) for configuration

## Appendix

![workflow](https://github.com/becem-gharbi/nuxt-auth/blob/main/workflow.png)

## Development

- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.
