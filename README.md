# Nuxt Auth V2

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

## Documentation 
A documentation website is on development.

You can check demo running on edge workers.
- Vercel edge https://nuxt-auth-demo.vercel.app
- Netlify edge https://nuxt-auth-demo.netlify.app
- Cloudflare pages https://nuxt-auth-c35.pages.dev

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
