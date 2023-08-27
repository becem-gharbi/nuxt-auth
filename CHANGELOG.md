# Changelog
## v2.0.1-rc

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v1.4.4...v2.0.1)

### 🔥 Performance

- Register server handlers conditionally ([dd789ab](https://github.com/becem-gharbi/nuxt-auth/commit/dd789ab))
- Use named imports ([cb1ef03](https://github.com/becem-gharbi/nuxt-auth/commit/cb1ef03))

### 🩹 Fixes

- Import prisma edge client on edge environments (support for cloudflare) ([dbf14e5](https://github.com/becem-gharbi/nuxt-auth/commit/dbf14e5))
- Detect edge env from nitro preset ([bd2d48a](https://github.com/becem-gharbi/nuxt-auth/commit/bd2d48a))
- Disable environment detection only on dev ([b8f48a8](https://github.com/becem-gharbi/nuxt-auth/commit/b8f48a8))
- **handleError:** Check if error exists ([cbea95d](https://github.com/becem-gharbi/nuxt-auth/commit/cbea95d))
- Use default import from nodemailer ([759cde1](https://github.com/becem-gharbi/nuxt-auth/commit/759cde1))
- Assign default value to passwordValidationRegex ([eca323e](https://github.com/becem-gharbi/nuxt-auth/commit/eca323e))
- **refresh:** Remove request body ([5af0fd4](https://github.com/becem-gharbi/nuxt-auth/commit/5af0fd4))
- Exclude current session on delete all sessions ([a3715f2](https://github.com/becem-gharbi/nuxt-auth/commit/a3715f2))
- Fix get accessToken on server side ([eba964f](https://github.com/becem-gharbi/nuxt-auth/commit/eba964f))

### 💅 Refactors

- Pass prisma instance via event context (support cloudflare) ([9b3a612](https://github.com/becem-gharbi/nuxt-auth/commit/9b3a612))
- Retreive config object on event lifecycle (support for cloudflare) ([508462c](https://github.com/becem-gharbi/nuxt-auth/commit/508462c))
- Move email default templates to event handlers ([2bb43d9](https://github.com/becem-gharbi/nuxt-auth/commit/2bb43d9))
- Always import getConfig from #auth ([2be2471](https://github.com/becem-gharbi/nuxt-auth/commit/2be2471))
- Replace logger with console on error handler ([66b8e18](https://github.com/becem-gharbi/nuxt-auth/commit/66b8e18))
- Create #auth on setup scope ([bcc4360](https://github.com/becem-gharbi/nuxt-auth/commit/bcc4360))
- Start setup with setting runtime config ([5b4cee8](https://github.com/becem-gharbi/nuxt-auth/commit/5b4cee8))
- Use relative import between server utils ([13efb59](https://github.com/becem-gharbi/nuxt-auth/commit/13efb59))
- **handleError:** Remove Prisma & JWT instance check ([7907466](https://github.com/becem-gharbi/nuxt-auth/commit/7907466))
- **sendEmail:** Replace nodemailer with HTTP client ([9e68078](https://github.com/becem-gharbi/nuxt-auth/commit/9e68078))
- Change default password reset email template ([87fd699](https://github.com/becem-gharbi/nuxt-auth/commit/87fd699))
- Change default email verification template ([2ef7b16](https://github.com/becem-gharbi/nuxt-auth/commit/2ef7b16))
- Remove extra credentials include from fetch calls ([21f46ab](https://github.com/becem-gharbi/nuxt-auth/commit/21f46ab))
- Refactor useAuthSession ([55c5191](https://github.com/becem-gharbi/nuxt-auth/commit/55c5191))
- Change fallback avatar properties ([4f8cd31](https://github.com/becem-gharbi/nuxt-auth/commit/4f8cd31))
- Replace useUser method with user reactive state ([9d2d34d](https://github.com/becem-gharbi/nuxt-auth/commit/9d2d34d))
- Expose auth session on event context ([05df8ea](https://github.com/becem-gharbi/nuxt-auth/commit/05df8ea))
- Remove unused event arg from getConfig utility ([623fb5d](https://github.com/becem-gharbi/nuxt-auth/commit/623fb5d))

### 📖 Documentation

- Create docus app ([121af26](https://github.com/becem-gharbi/nuxt-auth/commit/121af26))
- Define architecture ([3dec8dc](https://github.com/becem-gharbi/nuxt-auth/commit/3dec8dc))
- Update README ([631b22d](https://github.com/becem-gharbi/nuxt-auth/commit/631b22d))
- Update README ([7352172](https://github.com/becem-gharbi/nuxt-auth/commit/7352172))
- Add docs website to README ([8cea913](https://github.com/becem-gharbi/nuxt-auth/commit/8cea913))

### 🌊 Types

- Add prisma type to event context ([426ef45](https://github.com/becem-gharbi/nuxt-auth/commit/426ef45))
- Change auth type on event context ([6aa738b](https://github.com/becem-gharbi/nuxt-auth/commit/6aa738b))

### 🏡 Chore

- Upgrade dependencies ([d0ee118](https://github.com/becem-gharbi/nuxt-auth/commit/d0ee118))
- Upgrade prisma to latest ([1209bd3](https://github.com/becem-gharbi/nuxt-auth/commit/1209bd3))
- Add edge tag ([b34e444](https://github.com/becem-gharbi/nuxt-auth/commit/b34e444))
- Add environment detection log ([521b1a3](https://github.com/becem-gharbi/nuxt-auth/commit/521b1a3))
- Migrate from jsonwebtoken to jwt-simple ([f544c81](https://github.com/becem-gharbi/nuxt-auth/commit/f544c81))
- Set prisma as peer-dependency ([a89fbc8](https://github.com/becem-gharbi/nuxt-auth/commit/a89fbc8))
- Add cloudflare to edge supported presets ([bd8b3a5](https://github.com/becem-gharbi/nuxt-auth/commit/bd8b3a5))
- Fix signRefreshToken call ([24b5cf4](https://github.com/becem-gharbi/nuxt-auth/commit/24b5cf4))
- Create demo app ([175f8d4](https://github.com/becem-gharbi/nuxt-auth/commit/175f8d4))
- **demo:** Prepare first deployment ([39acdfd](https://github.com/becem-gharbi/nuxt-auth/commit/39acdfd))
- **demo:** Add auth pages ([1fa57b6](https://github.com/becem-gharbi/nuxt-auth/commit/1fa57b6))
- **demo:** Trigger new deployment ([31160b2](https://github.com/becem-gharbi/nuxt-auth/commit/31160b2))
- Migrate from jwt-simple to jose ([0758e11](https://github.com/becem-gharbi/nuxt-auth/commit/0758e11))
- **demo:** Add login form ([d31cf6e](https://github.com/becem-gharbi/nuxt-auth/commit/d31cf6e))
- **demo:** Upgrade dependencies ([e21ea5b](https://github.com/becem-gharbi/nuxt-auth/commit/e21ea5b))
- **demo:** Add register form ([47a6534](https://github.com/becem-gharbi/nuxt-auth/commit/47a6534))
- **demo:** Add reset password form ([7802e4d](https://github.com/becem-gharbi/nuxt-auth/commit/7802e4d))
- **demo:** Upgrade dependencies ([80214c0](https://github.com/becem-gharbi/nuxt-auth/commit/80214c0))
- **demo:** Upgrade dependencies ([14bc652](https://github.com/becem-gharbi/nuxt-auth/commit/14bc652))
- **demo:** Set prisma datasourceUrl ([d66a4de](https://github.com/becem-gharbi/nuxt-auth/commit/d66a4de))
- **demo:** Upgrade to nuxt v3.7 ([87f6cba](https://github.com/becem-gharbi/nuxt-auth/commit/87f6cba))
- **demo:** Disable SSR ([97bdec1](https://github.com/becem-gharbi/nuxt-auth/commit/97bdec1))
- **demo:** Enable ssr ([81d4196](https://github.com/becem-gharbi/nuxt-auth/commit/81d4196))
- **demo:** Upgrade dependencies ([29b3d27](https://github.com/becem-gharbi/nuxt-auth/commit/29b3d27))
- Remove logs ([dd15758](https://github.com/becem-gharbi/nuxt-auth/commit/dd15758))
- **demo:** Upgrade dependencies ([254f326](https://github.com/becem-gharbi/nuxt-auth/commit/254f326))
- THE MODULE IS EDGE COMPATIBLE ([4206c5c](https://github.com/becem-gharbi/nuxt-auth/commit/4206c5c))
- Strict nuxt compatibility to >=3.7 ([498e176](https://github.com/becem-gharbi/nuxt-auth/commit/498e176))
- Remove test api route ([c9f412e](https://github.com/becem-gharbi/nuxt-auth/commit/c9f412e))
- Set tag to latest ([68049b9](https://github.com/becem-gharbi/nuxt-auth/commit/68049b9))

### ❤️ Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v1.4.4

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v1.4.2...v1.4.4)

### 🩹 Fixes

- **useAuthFetch:** Remove logout when access token not found ([a96e471](https://github.com/becem-gharbi/nuxt-auth/commit/a96e471))
- Reset user state on fetchUser fail ([83f3130](https://github.com/becem-gharbi/nuxt-auth/commit/83f3130))
- Fix nuxt instance not available on SSR ([fa336cb](https://github.com/becem-gharbi/nuxt-auth/commit/fa336cb))

### 💅 Refactors

- Implement same session handling from nuxt-directus ([961670c](https://github.com/becem-gharbi/nuxt-auth/commit/961670c))

### 📖 Documentation

- Update Readme ([f661642](https://github.com/becem-gharbi/nuxt-auth/commit/f661642))

### 🏡 Chore

- Remove client-side session handling code ([93e69b8](https://github.com/becem-gharbi/nuxt-auth/commit/93e69b8))
- Disable admin API by default ([fab901a](https://github.com/becem-gharbi/nuxt-auth/commit/fab901a))
- Rename middleware common.global to common ([8732ff1](https://github.com/becem-gharbi/nuxt-auth/commit/8732ff1))
- **release:** V1.4.3 ([a398950](https://github.com/becem-gharbi/nuxt-auth/commit/a398950))
- Use console.error to log errors ([8bfd0ef](https://github.com/becem-gharbi/nuxt-auth/commit/8bfd0ef))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v1.4.3

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v1.4.2...v1.4.3)

### 🩹 Fixes

- **useAuthFetch:** Remove logout when access token not found ([a96e471](https://github.com/becem-gharbi/nuxt-auth/commit/a96e471))

### 💅 Refactors

- Implement same session handling from nuxt-directus ([961670c](https://github.com/becem-gharbi/nuxt-auth/commit/961670c))

### 📖 Documentation

- Update Readme ([f661642](https://github.com/becem-gharbi/nuxt-auth/commit/f661642))

### 🏡 Chore

- Remove client-side session handling code ([93e69b8](https://github.com/becem-gharbi/nuxt-auth/commit/93e69b8))
- Disable admin API by default ([fab901a](https://github.com/becem-gharbi/nuxt-auth/commit/fab901a))
- Rename middleware common.global to common ([8732ff1](https://github.com/becem-gharbi/nuxt-auth/commit/8732ff1))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v1.4.2

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v1.4.1...v1.4.2)

### 💅 Refactors

- Return <ok> instead of <{}> on REST success ([d40e227](https://github.com/becem-gharbi/nuxt-auth/commit/d40e227))
- Use default import from @prisma/client ([28fd331](https://github.com/becem-gharbi/nuxt-auth/commit/28fd331))

### 📖 Documentation

- Replace serverless with edge ([738c1d1](https://github.com/becem-gharbi/nuxt-auth/commit/738c1d1))

### 🏡 Chore

- Upgrade dependencies ([38eb02a](https://github.com/becem-gharbi/nuxt-auth/commit/38eb02a))
- Create dev package version ([4359929](https://github.com/becem-gharbi/nuxt-auth/commit/4359929))
- Update package keywords ([b44afe3](https://github.com/becem-gharbi/nuxt-auth/commit/b44afe3))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v1.4.1

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v1.4.0...v1.4.1)

### 🩹 Fixes

- **oauth:** Check name on oauth user fetch ([ed65013](https://github.com/becem-gharbi/nuxt-auth/commit/ed65013))

### 💅 Refactors

- Remove prisma validation errors from response ([6c197ec](https://github.com/becem-gharbi/nuxt-auth/commit/6c197ec))

### 🏡 Chore

- Upgrade dependencies ([296ceb0](https://github.com/becem-gharbi/nuxt-auth/commit/296ceb0))

### ❤️  Contributors

- Becem Gharbi ([@becem-gharbi](http://github.com/becem-gharbi))

## v1.4.0

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v1.3.5...v1.4.0)


### 🚀 Enhancements

  - Add uth:loggedIn hook ([0903edf](https://github.com/becem-gharbi/nuxt-auth/commit/0903edf))

### 🔥 Performance

  - Disable SSR on callback page ([2cfe78c](https://github.com/becem-gharbi/nuxt-auth/commit/2cfe78c))

### 🩹 Fixes

  - **middleware:** Replace redirect from.path to to.path in auth middleware ([cbac1dd](https://github.com/becem-gharbi/nuxt-auth/commit/cbac1dd))
  - **useAuth:** Import useNuxtApp ([2256a65](https://github.com/becem-gharbi/nuxt-auth/commit/2256a65))

### 📖 Documentation

  - **readme:** Add hooks section ([4a63983](https://github.com/becem-gharbi/nuxt-auth/commit/4a63983))

### 🏡 Chore

  - Configure Renovate ([300048e](https://github.com/becem-gharbi/nuxt-auth/commit/300048e))
  - Replace npm with pnpm ([1b39697](https://github.com/becem-gharbi/nuxt-auth/commit/1b39697))

### ❤️  Contributors

- Becem Gharbi ([@becem-gharbi](http://github.com/becem-gharbi))

## v1.3.5

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v1.3.6...v1.3.5)


### 🏡 Chore

  - **release:** V1.3.6 ([8e1b409](https://github.com/becem-gharbi/nuxt-auth/commit/8e1b409))

### ❤️  Contributors

- Becem Gharbi ([@becem-gharbi](http://github.com/becem-gharbi))

## v1.3.6

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v1.3.6...v1.3.6)

## v1.3.6

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v1.3.3...v1.3.6)


### 🩹 Fixes

  - Fix useRoute not defined ([d3263de](https://github.com/becem-gharbi/nuxt-auth/commit/d3263de))

### 🏡 Chore

  - **release:** V1.3.4 ([f93ca56](https://github.com/becem-gharbi/nuxt-auth/commit/f93ca56))

### ❤️  Contributors

- Becem Gharbi ([@becem-gharbi](http://github.com/becem-gharbi))

## v1.3.4

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v1.3.3...v1.3.4)


### 🩹 Fixes

  - Fix useRoute not defined ([d3263de](https://github.com/becem-gharbi/nuxt-auth/commit/d3263de))

### ❤️  Contributors

- Becem Gharbi ([@becem-gharbi](http://github.com/becem-gharbi))

## v1.3.3

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v1.3.2...v1.3.3)


### 🩹 Fixes

  - Remove DATABASE_URL env check ([717c4b0](https://github.com/becem-gharbi/nuxt-auth/commit/717c4b0))

### 📖 Documentation

  - **readme:** Add oauth redirect URI note ([31e3681](https://github.com/becem-gharbi/nuxt-auth/commit/31e3681))

### 🏡 Chore

  - Upgrade dependencies ([c2ed65f](https://github.com/becem-gharbi/nuxt-auth/commit/c2ed65f))

### ❤️  Contributors

- Becem Gharbi ([@becem-gharbi](http://github.com/becem-gharbi))
- Becem ([@becem-gharbi](http://github.com/becem-gharbi))

## v1.3.2

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v1.3.1...v1.3.2)


### 💅 Refactors

  - Allow `id` fields to be `string` ([cebe94b](https://github.com/becem-gharbi/nuxt-auth/commit/cebe94b))

### 📖 Documentation

  - Update README.md ([c7f22a1](https://github.com/becem-gharbi/nuxt-auth/commit/c7f22a1))
  - Add Mongo DB setup instructions ([f7af325](https://github.com/becem-gharbi/nuxt-auth/commit/f7af325))
  - Update readme ([745907c](https://github.com/becem-gharbi/nuxt-auth/commit/745907c))

### 🌊 Types

  - Resolve `id` fields from Prisma schema ([24a7bca](https://github.com/becem-gharbi/nuxt-auth/commit/24a7bca))

### 🏡 Chore

  - Upgrade dependencies ([de45f86](https://github.com/becem-gharbi/nuxt-auth/commit/de45f86))
  - Define prisma schema for Mongo DB ([8a65f05](https://github.com/becem-gharbi/nuxt-auth/commit/8a65f05))

### ❤️  Contributors

- Becem Gharbi ([@becem-gharbi](http://github.com/becem-gharbi))
- Becem ([@becem-gharbi](http://github.com/becem-gharbi))

## v1.3.1

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v1.3.0...v1.3.1)


### 🩹 Fixes

  - **logout:** Deleted cache of fetched data on logout ([e548110](https://github.com/becem-gharbi/nuxt-auth/commit/e548110))

### ❤️  Contributors

- Becem-gharbi

## v1.3.0

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v0.1.6...v1.3.0)


### 🚀 Enhancements

  - **admin:** Add admin API enable option ([81a61e4](https://github.com/becem-gharbi/nuxt-auth/commit/81a61e4))
  - **redirect:** On login required, return to previous page instead of home ([25324ae](https://github.com/becem-gharbi/nuxt-auth/commit/25324ae))

### 💅 Refactors

  - Remove unused condition check ([34b0715](https://github.com/becem-gharbi/nuxt-auth/commit/34b0715))
  - **session:** Remove accessToken cookieName config ([84aee80](https://github.com/becem-gharbi/nuxt-auth/commit/84aee80))

### 📖 Documentation

  - Add JSDoc to composables ([3637b34](https://github.com/becem-gharbi/nuxt-auth/commit/3637b34))
  - **readme:** Add serverless deployment feature ([cb1c079](https://github.com/becem-gharbi/nuxt-auth/commit/cb1c079))
  - **readme:** Add all module options to setup section ([8e73c2c](https://github.com/becem-gharbi/nuxt-auth/commit/8e73c2c))
  - **readme:** Add notes ([9be490b](https://github.com/becem-gharbi/nuxt-auth/commit/9be490b))
  - **readme:** Add explicit support to SQL db only ([5871419](https://github.com/becem-gharbi/nuxt-auth/commit/5871419))

### 🏡 Chore

  - Upgrade dependencies ([82c0fd5](https://github.com/becem-gharbi/nuxt-auth/commit/82c0fd5))
  - Set version to 1.0.0 ([318b644](https://github.com/becem-gharbi/nuxt-auth/commit/318b644))
  - **release:** V1.1.0 ([447245a](https://github.com/becem-gharbi/nuxt-auth/commit/447245a))
  - Set version to 1.2.0 ([4066ce4](https://github.com/becem-gharbi/nuxt-auth/commit/4066ce4))

### ❤️  Contributors

- Becem-gharbi

## v0.1.6

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v0.1.5...v0.1.6)


### 🚀 Enhancements

  - **session:** Store access token in localStorage ([166a58c](https://github.com/becem-gharbi/nuxt-auth/commit/166a58c))

### 🩹 Fixes

  - **refresh:** Set refresh token cookie after user check ([162bb66](https://github.com/becem-gharbi/nuxt-auth/commit/162bb66))

### 💅 Refactors

  - Replace bcrypt with bcryptjs, fix Cloudflare build ([ac355ba](https://github.com/becem-gharbi/nuxt-auth/commit/ac355ba))

### 🏡 Chore

  - Upgrade dependencies ([192410a](https://github.com/becem-gharbi/nuxt-auth/commit/192410a))

### ❤️  Contributors

- Becem-gharbi

## v0.1.5

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v0.1.4...v0.1.5)


### 🩹 Fixes

  - Fix runtimeConfig related warnings ([b308c73](https://github.com/becem-gharbi/nuxt-auth/commit/b308c73))

### ❤️  Contributors

- Becem-gharbi

## v0.1.4

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v0.1.3...v0.1.4)


### 🩹 Fixes

  - Check if account suspended on refresh handler ([3d1bd58](https://github.com/becem-gharbi/nuxt-auth/commit/3d1bd58))
  - Check if account suspended on oauth callback handler ([9b35972](https://github.com/becem-gharbi/nuxt-auth/commit/9b35972))

### 📖 Documentation

  - Add Graphql client authorization section to README ([e940c0d](https://github.com/becem-gharbi/nuxt-auth/commit/e940c0d))
  - Display total downloads ([a18128f](https://github.com/becem-gharbi/nuxt-auth/commit/a18128f))

### ❤️  Contributors

- Becem-gharbi

## v0.1.3

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v0.1.2...v0.1.3)


### 💅 Refactors

  - Refactor logger messages ([884a959](https://github.com/becem-gharbi/nuxt-auth/commit/884a959))

### 📖 Documentation

  - Update README ([82b9a77](https://github.com/becem-gharbi/nuxt-auth/commit/82b9a77))

### ❤️  Contributors

- Becem-gharbi

## v0.1.2

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v0.1.1...v0.1.2)


### 🩹 Fixes

  - Check error before redirect on login ([a57e56d](https://github.com/becem-gharbi/nuxt-auth/commit/a57e56d))

### 💅 Refactors

  - Redirect to logout page before fetch, on logout ([3075717](https://github.com/becem-gharbi/nuxt-auth/commit/3075717))

### ❤️  Contributors

- Becem-gharbi

## v0.1.1

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v1.3.0-rc.10...v0.1.1)


### 🏡 Chore

  - Remove semantic-release & github workflow ([eefbc9f](https://github.com/becem-gharbi/nuxt-auth/commit/eefbc9f))
  - Install changelogen ([5293fac](https://github.com/becem-gharbi/nuxt-auth/commit/5293fac))

### ❤️  Contributors

- Becem-gharbi

