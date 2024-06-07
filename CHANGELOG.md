# Changelog

## v3.0.1-rc

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v3.0.0-beta.0...v3.0.1-rc)

### 🏡 Chore

- **release:** V3.0.0-rc ([5875141](https://github.com/becem-gharbi/nuxt-auth/commit/5875141))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v3.0.0-rc

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v3.0.0-beta.0...v3.0.0-rc)

## vv3.0.0-beta.5

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/70e293339fa43dcedde5dd235cd1b5dbea80fc22...vv3.0.0-beta.5)

### 🩹 Fixes

- Allow overwriting adapter Source ([#47](https://github.com/becem-gharbi/nuxt-auth/pull/47))

### 💅 Refactors

- Rename adapter Options to Source ([5780b45](https://github.com/becem-gharbi/nuxt-auth/commit/5780b45))
- ⚠️  Change event.context definition ([#45](https://github.com/becem-gharbi/nuxt-auth/pull/45))
- ⚠️  Rename `#auth` to `#auth_utils` ([d9d1bcc](https://github.com/becem-gharbi/nuxt-auth/commit/d9d1bcc))
- ⚠️  Change path of session endpoints ([#48](https://github.com/becem-gharbi/nuxt-auth/pull/48))
- Add max length validation for email & name ([ff5b4ad](https://github.com/becem-gharbi/nuxt-auth/commit/ff5b4ad))

### 🌊 Types

- Fix utils types & refactor ([b8412df](https://github.com/becem-gharbi/nuxt-auth/commit/b8412df))
- Rename `#build/types/auth_adapter` to `#auth_adapter` ([#46](https://github.com/becem-gharbi/nuxt-auth/pull/46))

#### ⚠️ Breaking Changes

- ⚠️  Change event.context definition ([#45](https://github.com/becem-gharbi/nuxt-auth/pull/45))
- ⚠️  Rename `#auth` to `#auth_utils` ([d9d1bcc](https://github.com/becem-gharbi/nuxt-auth/commit/d9d1bcc))
- ⚠️  Change path of session endpoints ([#48](https://github.com/becem-gharbi/nuxt-auth/pull/48))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>
- Becem <becem.gharbi@live.com>

## v3.0.0-beta.4

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/d3967fe2aa32156e3dfd2dad21414fecd835ac8d...vv3.0.0-beta.4)

### 🚀 Enhancements

- Add Email action timeout ([#43](https://github.com/becem-gharbi/nuxt-auth/pull/43))

### 🔥 Performance

- Skip refresh token verification when undefined ([5bf7521](https://github.com/becem-gharbi/nuxt-auth/commit/5bf7521))

### 🩹 Fixes

- Reset `requestedPasswordReset` to false on login ([1deca27](https://github.com/becem-gharbi/nuxt-auth/commit/1deca27))
- Allow overwriting ID type ([#44](https://github.com/becem-gharbi/nuxt-auth/pull/44))

### 💅 Refactors

- Code review ([b5739ad](https://github.com/becem-gharbi/nuxt-auth/commit/b5739ad))
- Rename filename of `#auth` type definition ([8b636a3](https://github.com/becem-gharbi/nuxt-auth/commit/8b636a3))

### 📖 Documentation

- Update JSDOC of composables ([#42](https://github.com/becem-gharbi/nuxt-auth/pull/42))

### 🏡 Chore

- Change setup files location ([a3c2514](https://github.com/becem-gharbi/nuxt-auth/commit/a3c2514))

### ✅ Tests

- Update basic ([17a8f35](https://github.com/becem-gharbi/nuxt-auth/commit/17a8f35))

### ❤️ Contributors

- Becem <becem.gharbi@live.com>

## v3.0.0-beta.3

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/vv3.0.0-beta.2...vv3.0.0-beta.3)

### 🚀 Enhancements

- Add `auth:fetchError` hook ([ab89ac9](https://github.com/becem-gharbi/nuxt-auth/commit/ab89ac9))
- Feat: add `emailValidationRegex` for email validation on registration ([#37](https://github.com/becem-gharbi/nuxt-auth/pull/37))
- Add `prisma` adapter ([#38](https://github.com/becem-gharbi/nuxt-auth/pull/38))
- Add `unstorage` adapter ([#39](https://github.com/becem-gharbi/nuxt-auth/pull/39))
- Allow augmenting adapter types e.g User ([916ab82](https://github.com/becem-gharbi/nuxt-auth/commit/916ab82))

### 🩹 Fixes

- Disallow token refresh when account not verified ([5672407](https://github.com/becem-gharbi/nuxt-auth/commit/5672407))

### 💅 Refactors

- Ensure auth refresh flow runs at the end ([#36](https://github.com/becem-gharbi/nuxt-auth/pull/36))

### 🌊 Types

- Define types of route middlewares `auth` and `guest` ([#35](https://github.com/becem-gharbi/nuxt-auth/pull/35))
- Add known oauth options for `google` and `github` ([06b9f82](https://github.com/becem-gharbi/nuxt-auth/commit/06b9f82))
- Resolve `provider` from `User` ([68a357f](https://github.com/becem-gharbi/nuxt-auth/commit/68a357f))

### 🏡 Chore

- ⚠️  Do not convert `createdAt` `updatedAt` to Date on user state ([82fc63c](https://github.com/becem-gharbi/nuxt-auth/commit/82fc63c))
- **playground:** Add adapter selection ([580b821](https://github.com/becem-gharbi/nuxt-auth/commit/580b821))
- **playground:** Avoid editing runtime config ([b48e24c](https://github.com/becem-gharbi/nuxt-auth/commit/b48e24c))

#### ⚠️ Breaking Changes

- ⚠️  Do not convert `createdAt` `updatedAt` to Date on user state ([82fc63c](https://github.com/becem-gharbi/nuxt-auth/commit/82fc63c))

### ❤️ Contributors

- Becem <becem.gharbi@live.com>

## v3.0.0-beta.2

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/ce6e049f69c74db2251dc4040f44c4ab4914bafe...vv3.0.0-beta.2)

### 🚀 Enhancements

- Add `provider` to access token payload ([#34](https://github.com/becem-gharbi/nuxt-auth/pull/34))

### 🔥 Performance

- ⚠️  Avoid registration of server handlers when respective configuration missing ([#33](https://github.com/becem-gharbi/nuxt-auth/pull/33))

### 🩹 Fixes

- Convert param id to number if possible ([9a88165](https://github.com/becem-gharbi/nuxt-auth/commit/9a88165))
- Assign role `default` on registration with credentials ([65a9813](https://github.com/becem-gharbi/nuxt-auth/commit/65a9813))

### 💅 Refactors

- ⚠️  Change server error messages ([#32](https://github.com/becem-gharbi/nuxt-auth/pull/32))

### 🌊 Types

- Set `accessToken.customClaims` values to `unknown` ([242be21](https://github.com/becem-gharbi/nuxt-auth/commit/242be21))

### 🏡 Chore

- **playground:** Pass prisma client to event context ([56e8604](https://github.com/becem-gharbi/nuxt-auth/commit/56e8604))
- Sync changelog ([e474411](https://github.com/becem-gharbi/nuxt-auth/commit/e474411))

### ✅ Tests

- Add render user avatar test ([ad503b1](https://github.com/becem-gharbi/nuxt-auth/commit/ad503b1))
- Add request password reset test ([454ec0e](https://github.com/becem-gharbi/nuxt-auth/commit/454ec0e))

#### ⚠️ Breaking Changes

- ⚠️  Avoid registration of server handlers when respective configuration missing ([#33](https://github.com/becem-gharbi/nuxt-auth/pull/33))
- ⚠️  Change server error messages ([#32](https://github.com/becem-gharbi/nuxt-auth/pull/32))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>
- Becem <becem.gharbi@live.com>

## v3.0.0-beta.1

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v3.0.0-beta...v3)

### 🚀 Enhancements

- ⚠️  Allow usage of custom data layer ([#30](https://github.com/becem-gharbi/nuxt-auth/pull/30))

### 🩹 Fixes

- Avoid delete of non-existant refresh token ([#31](https://github.com/becem-gharbi/nuxt-auth/pull/31))

### 💅 Refactors

- Change findUser to findUserById and findUserByEmail ([7ce97d6](https://github.com/becem-gharbi/nuxt-auth/commit/7ce97d6))

### 🏡 Chore

- Resolve import of nitro utils ([8f98519](https://github.com/becem-gharbi/nuxt-auth/commit/8f98519))
- **playground:** Change email provider to hook ([028697f](https://github.com/becem-gharbi/nuxt-auth/commit/028697f))

#### ⚠️ Breaking Changes

- ⚠️  Allow usage of custom data layer ([#30](https://github.com/becem-gharbi/nuxt-auth/pull/30))

### ❤️ Contributors

- Becem <becem.gharbi@live.com>

## v3.0.0-beta

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.6.0...v3.0.0-beta)

### 📖 Documentation

- Update 4.email.md ([aecf78f](https://github.com/becem-gharbi/nuxt-auth/commit/aecf78f))

### 🏡 Chore

- **lint:** Migrate to `@nuxt/eslint-config` ([67a2dcb](https://github.com/becem-gharbi/nuxt-auth/commit/67a2dcb))
- **lint:** Fix issues ([687a7b4](https://github.com/becem-gharbi/nuxt-auth/commit/687a7b4))
- Hide node deprecation warnings on build ([3c7d27a](https://github.com/becem-gharbi/nuxt-auth/commit/3c7d27a))
- ⚠️  Remove `useAuthFetch` ([#24](https://github.com/becem-gharbi/nuxt-auth/pull/24))
- ⚠️  Remove internal prisma instantiation ([#25](https://github.com/becem-gharbi/nuxt-auth/pull/25))
- ⚠️  Remove Custom email provider ([#26](https://github.com/becem-gharbi/nuxt-auth/pull/26))
- **playground:** Remove deprecated config options ([38c59b3](https://github.com/becem-gharbi/nuxt-auth/commit/38c59b3))
- ⚠️  Remove purge of expired sessions ([#27](https://github.com/becem-gharbi/nuxt-auth/pull/27))
- ⚠️  Rename `registration.enable` to `registration.enabled` ([#28](https://github.com/becem-gharbi/nuxt-auth/pull/28))
- ⚠️  Only except `.html` custom email templates ([#29](https://github.com/becem-gharbi/nuxt-auth/pull/29))
- Change password reset and email verification token's secrets ([9125a3f](https://github.com/becem-gharbi/nuxt-auth/commit/9125a3f))
- Resolve `@typescript-eslint/ban-ts-comment` overrides ([bf0ab12](https://github.com/becem-gharbi/nuxt-auth/commit/bf0ab12))

### ✅ Tests

- Add basic tests ([98c3e3a](https://github.com/becem-gharbi/nuxt-auth/commit/98c3e3a))

#### ⚠️ Breaking Changes

- ⚠️  Remove `useAuthFetch` ([#24](https://github.com/becem-gharbi/nuxt-auth/pull/24))
- ⚠️  Remove internal prisma instantiation ([#25](https://github.com/becem-gharbi/nuxt-auth/pull/25))
- ⚠️  Remove Custom email provider ([#26](https://github.com/becem-gharbi/nuxt-auth/pull/26))
- ⚠️  Remove purge of expired sessions ([#27](https://github.com/becem-gharbi/nuxt-auth/pull/27))
- ⚠️  Rename `registration.enable` to `registration.enabled` ([#28](https://github.com/becem-gharbi/nuxt-auth/pull/28))
- ⚠️  Only except `.html` custom email templates ([#29](https://github.com/becem-gharbi/nuxt-auth/pull/29))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>
- Becem <becem.gharbi@live.com>

## v2.6.0

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.5.1...v2.6.0)

### 🚀 Enhancements

- Support adding custom email templates via relative path ([#20](https://github.com/becem-gharbi/nuxt-auth/pull/20))

### 🔥 Performance

- Replace `uuid` with `crypto.randomUUID` ([b045232](https://github.com/becem-gharbi/nuxt-auth/commit/b045232))

### 🩹 Fixes

- **registration:** Inform user when account not verified ([#21](https://github.com/becem-gharbi/nuxt-auth/pull/21))

### 💅 Refactors

- No significant change ([ac16309](https://github.com/becem-gharbi/nuxt-auth/commit/ac16309))

### 📖 Documentation

- Mention new starter ([a8a4a47](https://github.com/becem-gharbi/nuxt-auth/commit/a8a4a47))
- Remove Nuxt version specification ([96fbae0](https://github.com/becem-gharbi/nuxt-auth/commit/96fbae0))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>
- Becem <becem.gharbi@live.com>

## v2.5.1

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.5.0...v2.5.1)

### 🔥 Performance

- Replace `mustache` with lightweight internal utility ([50041c3](https://github.com/becem-gharbi/nuxt-auth/commit/50041c3))
- Minify default email templates ([6f3f7e2](https://github.com/becem-gharbi/nuxt-auth/commit/6f3f7e2))

### 🏡 Chore

- **playground:** Use sqlite instead of mongo db ([79b72c0](https://github.com/becem-gharbi/nuxt-auth/commit/79b72c0))

### ❤️ Contributors

- Becem-gharbi ([@becem-gharbi](http://github.com/becem-gharbi))

## v2.5.0

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.4.8...v2.5.0)

### 🚀 Enhancements

- Support custom prisma client instantiation ([#17](https://github.com/becem-gharbi/nuxt-auth/pull/17))
- Add Hook email provider ([#18](https://github.com/becem-gharbi/nuxt-auth/pull/18))

### 🏡 Chore

- Revert pkg version ([05f109b](https://github.com/becem-gharbi/nuxt-auth/commit/05f109b))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>
- Becem <becem.gharbi@live.com>

## v2.4.8

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.4.7...v2.4.8)

### 💅 Refactors

- No significant change ([d802de6](https://github.com/becem-gharbi/nuxt-auth/commit/d802de6))
- Better concurrent refresh handling ([184a62e](https://github.com/becem-gharbi/nuxt-auth/commit/184a62e))
- Replace `process` with `import.meta` ([2070c8f](https://github.com/becem-gharbi/nuxt-auth/commit/2070c8f))
- Remove `try...catch` of flow plugin ([92ab51e](https://github.com/becem-gharbi/nuxt-auth/commit/92ab51e))
- Better code readibility ([ade5fd4](https://github.com/becem-gharbi/nuxt-auth/commit/ade5fd4))
- Format import statements ([ffb4428](https://github.com/becem-gharbi/nuxt-auth/commit/ffb4428))
- More refactoring ([bef2094](https://github.com/becem-gharbi/nuxt-auth/commit/bef2094))

### 🌊 Types

- Solve typecheck issues ([23b7d4f](https://github.com/becem-gharbi/nuxt-auth/commit/23b7d4f))

### 🏡 Chore

- **playground:** Remove user image ([9ef9134](https://github.com/becem-gharbi/nuxt-auth/commit/9ef9134))
- Transpile `mustache` ([a7738b2](https://github.com/becem-gharbi/nuxt-auth/commit/a7738b2))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v2.4.7

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.4.6...v2.4.7)

### 🔥 Performance

- Avoid extra refresh on oauth login fail ([271bc9b](https://github.com/becem-gharbi/nuxt-auth/commit/271bc9b))

### 🌊 Types

- Solve typecheck issues ([b36d6f2](https://github.com/becem-gharbi/nuxt-auth/commit/b36d6f2))

### 🏡 Chore

- Disable auto import ([4047b7e](https://github.com/becem-gharbi/nuxt-auth/commit/4047b7e))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v2.4.6

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.4.5...v2.4.6)

### 🩹 Fixes

- Auto-revoke active session if refresh fails ([67cd505](https://github.com/becem-gharbi/nuxt-auth/commit/67cd505))

### 💅 Refactors

- Only avoid auto-logout when page not found ([390de02](https://github.com/becem-gharbi/nuxt-auth/commit/390de02))
- No significant change ([57f20a9](https://github.com/becem-gharbi/nuxt-auth/commit/57f20a9))

### 📖 Documentation

- Update introduction ([fe7b271](https://github.com/becem-gharbi/nuxt-auth/commit/fe7b271))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v2.4.5

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.4.3...v2.4.5)

### 🩹 Fixes

- Avoid auto-logout on SSR error ([921662e](https://github.com/becem-gharbi/nuxt-auth/commit/921662e))

### 💅 Refactors

- Remove extra token check ([0391746](https://github.com/becem-gharbi/nuxt-auth/commit/0391746))
- No significant change ([309f48d](https://github.com/becem-gharbi/nuxt-auth/commit/309f48d))

### 📖 Documentation

- Change font family ([e8d8103](https://github.com/becem-gharbi/nuxt-auth/commit/e8d8103))

### 🏡 Chore

- **package.json:** Set homepage property ([1f98370](https://github.com/becem-gharbi/nuxt-auth/commit/1f98370))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v2.4.3

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.4.2...v2.4.3)

### 🔥 Performance

- Generate default user avatar internally ([984fa4d](https://github.com/becem-gharbi/nuxt-auth/commit/984fa4d))

### 🩹 Fixes

- Avoid `useFetch` call outside of script setup ([22466e5](https://github.com/becem-gharbi/nuxt-auth/commit/22466e5))

### 📖 Documentation

- Add more details and improve phrasing ([#16](https://github.com/becem-gharbi/nuxt-auth/pull/16))
- Ensure style concistency ([49db800](https://github.com/becem-gharbi/nuxt-auth/commit/49db800))
- No significant change ([d300746](https://github.com/becem-gharbi/nuxt-auth/commit/d300746))

### 🌊 Types

- Fix undefined configKey `auth` ([2ea4d74](https://github.com/becem-gharbi/nuxt-auth/commit/2ea4d74))

### 🏡 Chore

- **playground:** No significant change ([a919215](https://github.com/becem-gharbi/nuxt-auth/commit/a919215))
- Remove demo app ([ebfdfc3](https://github.com/becem-gharbi/nuxt-auth/commit/ebfdfc3))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>
- Behon Baker

## v2.4.2

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.3.8...v2.4.2)

### 🏡 Chore

- Bump version to 2.4 ([0dd9f8f](https://github.com/becem-gharbi/nuxt-auth/commit/0dd9f8f))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v2.3.8

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.3.7...v2.3.8)

### 💅 Refactors

- Add `backendEnabled` and `backendBaseUrl` config options ([da41425](https://github.com/becem-gharbi/nuxt-auth/commit/da41425))
- Always overwrite baseURL with backendBaseUrl ([90285ad](https://github.com/becem-gharbi/nuxt-auth/commit/90285ad))
- Set credentials to include for cross-site requests ([adbe673](https://github.com/becem-gharbi/nuxt-auth/commit/adbe673))
- Always provide `refreshToken.cookieName` config option ([b8d02ef](https://github.com/becem-gharbi/nuxt-auth/commit/b8d02ef))

### 📖 Documentation

- Update 1.tokens.md ([7c6c06a](https://github.com/becem-gharbi/nuxt-auth/commit/7c6c06a))
- Add frontend-only docs ([fcd8d4c](https://github.com/becem-gharbi/nuxt-auth/commit/fcd8d4c))

### 🌊 Types

- Remove extra assertions ([03723f0](https://github.com/becem-gharbi/nuxt-auth/commit/03723f0))
- Exclude `backendBaseUrl` option if backend is enabled ([88eed61](https://github.com/becem-gharbi/nuxt-auth/commit/88eed61))
- Solve typecheck issues ([d3d0eac](https://github.com/becem-gharbi/nuxt-auth/commit/d3d0eac))
- Minor refactoring ([6ce190a](https://github.com/becem-gharbi/nuxt-auth/commit/6ce190a))

### 🏡 Chore

- **demo:** Upgrade nuxt-auth to v2.3.7 ([e9a776e](https://github.com/becem-gharbi/nuxt-auth/commit/e9a776e))
- **playground:** Allow cross site requests ([d87d08e](https://github.com/becem-gharbi/nuxt-auth/commit/d87d08e))
- **demo:** Upgrade deps ([c17e8ed](https://github.com/becem-gharbi/nuxt-auth/commit/c17e8ed))
- **docs:** Upgrade non-major dependencies ([3f80d07](https://github.com/becem-gharbi/nuxt-auth/commit/3f80d07))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>
- Becem <becem.gharbi@live.com>

## v2.3.7

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.3.6...v2.3.7)

### 🩹 Fixes

- **refresh:** Wait until previous refresh call is completed ([07afcf6](https://github.com/becem-gharbi/nuxt-auth/commit/07afcf6))

### 💅 Refactors

- **refresh:** Only pass cookies on SSR ([a73b9df](https://github.com/becem-gharbi/nuxt-auth/commit/a73b9df))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v2.3.6

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.3.5...v2.3.6)

### 🩹 Fixes

- **_onLogout:** Clear user state after redirection ([30d544d](https://github.com/becem-gharbi/nuxt-auth/commit/30d544d))

### 💅 Refactors

- **plugin:** Implement new method for initialization check ([cfe6ebb](https://github.com/becem-gharbi/nuxt-auth/commit/cfe6ebb))
- **middleware:** Replace user with access token to check logged in status ([a1b8432](https://github.com/becem-gharbi/nuxt-auth/commit/a1b8432))
- No significant change ([c1d1c52](https://github.com/becem-gharbi/nuxt-auth/commit/c1d1c52))
- **_loggedIn:** Use computed value instead of get/set methods ([d8dc8a2](https://github.com/becem-gharbi/nuxt-auth/commit/d8dc8a2))
- **useAuthSession:** Rename _loggedIn to _loggedInFlag ([387c097](https://github.com/becem-gharbi/nuxt-auth/commit/387c097))
- **_refresh:** Remove extra _loggedInFlag set ([96addfb](https://github.com/becem-gharbi/nuxt-auth/commit/96addfb))
- Reload the page on logout ([97acee8](https://github.com/becem-gharbi/nuxt-auth/commit/97acee8))
- Use navigateTo instead of location.replace ([a61db44](https://github.com/becem-gharbi/nuxt-auth/commit/a61db44))

### 🏡 Chore

- **demo:** Upgrade nuxt-auth to v2.3.5 ([12fe4d6](https://github.com/becem-gharbi/nuxt-auth/commit/12fe4d6))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v2.3.5

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.3.4...v2.3.5)

### 💅 Refactors

- Specify auto-imported composables ([00847bd](https://github.com/becem-gharbi/nuxt-auth/commit/00847bd))
- Add `expires_in` to login & refresh response ([7f5a57e](https://github.com/becem-gharbi/nuxt-auth/commit/7f5a57e))
- No significant change ([4f1f565](https://github.com/becem-gharbi/nuxt-auth/commit/4f1f565))
- Create `useAuthToken` to handle access token storage ([cbd4508](https://github.com/becem-gharbi/nuxt-auth/commit/cbd4508))
- Change access token storage from cookie to memory ([13c2b2b](https://github.com/becem-gharbi/nuxt-auth/commit/13c2b2b))
- No significant change ([9632308](https://github.com/becem-gharbi/nuxt-auth/commit/9632308))
- Remove unused `accessTokenCookieName` config option ([e99fc73](https://github.com/becem-gharbi/nuxt-auth/commit/e99fc73))

### 📖 Documentation

- **tokens:** Remove `accessTokenCookieName`  config option ([9a29219](https://github.com/becem-gharbi/nuxt-auth/commit/9a29219))

### 🏡 Chore

- **playground:** Remove accessTokenCookieName ([b41732c](https://github.com/becem-gharbi/nuxt-auth/commit/b41732c))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v2.3.4

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.3.3...v2.3.4)

### 🌊 Types

- **getAllSessions:** Fix return type ([1fa06ed](https://github.com/becem-gharbi/nuxt-auth/commit/1fa06ed))

### 🏡 Chore

- **demo:** Upgrade deps ([a799763](https://github.com/becem-gharbi/nuxt-auth/commit/a799763))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v2.3.3

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.3.2...v2.3.3)

### 🩹 Fixes

- **getAllSessions:** Fix undefined `ua` property ([d04aa37](https://github.com/becem-gharbi/nuxt-auth/commit/d04aa37))

### 🏡 Chore

- **demo:** Upgrade deps ([702cec6](https://github.com/becem-gharbi/nuxt-auth/commit/702cec6))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v2.3.2

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.3.1...v2.3.2)

### 🩹 Fixes

- Sync login on multiple tabs ([28c7c32](https://github.com/becem-gharbi/nuxt-auth/commit/28c7c32))
- Delete refresh token cookie on server-side refresh fail ([7ae64bc](https://github.com/becem-gharbi/nuxt-auth/commit/7ae64bc))

### 💅 Refactors

- Verify user state on `_login` `_logout` handlers ([fa1b37f](https://github.com/becem-gharbi/nuxt-auth/commit/fa1b37f))
- **getAllSessions:** Move formatting on server-side ([017c830](https://github.com/becem-gharbi/nuxt-auth/commit/017c830))
- **getAllSessions:** Remove userId ([d94e1fa](https://github.com/becem-gharbi/nuxt-auth/commit/d94e1fa))
- **getAllSessions:** Move current session on top ([809486e](https://github.com/becem-gharbi/nuxt-auth/commit/809486e))

### 🏡 Chore

- **demo:** Upgrade deps ([d178162](https://github.com/becem-gharbi/nuxt-auth/commit/d178162))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v2.3.1

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.3.0...v2.3.1)

### 🩹 Fixes

- **revoke session:** Fix id parser ([4529197](https://github.com/becem-gharbi/nuxt-auth/commit/4529197))

### 🏡 Chore

- **demo:** Upgrade deps ([17b3e0a](https://github.com/becem-gharbi/nuxt-auth/commit/17b3e0a))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v2.3.0

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.2.1...v2.3.0)

### 🚀 Enhancements

- Add support for prisma accelerate on edge runtimes ([15acf8b](https://github.com/becem-gharbi/nuxt-auth/commit/15acf8b))

### 🔥 Performance

- Limit selection on DB queries ([eb8164d](https://github.com/becem-gharbi/nuxt-auth/commit/eb8164d))
- Fix bfcache failed ([d588217](https://github.com/becem-gharbi/nuxt-auth/commit/d588217))

### 🩹 Fixes

- **session revoke:** Parse `id` to int when needed ([ba7b3ef](https://github.com/becem-gharbi/nuxt-auth/commit/ba7b3ef))

### 💅 Refactors

- Add loggedInFlagName config option ([011cf5f](https://github.com/becem-gharbi/nuxt-auth/commit/011cf5f))

### 📖 Documentation

- Update edge deployment section ([4a77bb8](https://github.com/becem-gharbi/nuxt-auth/commit/4a77bb8))

### 🏡 Chore

- **demo:** Upgrade deps ([cc19286](https://github.com/becem-gharbi/nuxt-auth/commit/cc19286))
- **playground:** Update sql schema ([bf1a170](https://github.com/becem-gharbi/nuxt-auth/commit/bf1a170))
- **demo:** Upgrade deps ([114068d](https://github.com/becem-gharbi/nuxt-auth/commit/114068d))
- **demo:** Update prisma generate command in prod ([43491fd](https://github.com/becem-gharbi/nuxt-auth/commit/43491fd))
- Set tag to latest ([d4d55ed](https://github.com/becem-gharbi/nuxt-auth/commit/d4d55ed))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v2.2.1

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.2.0...v2.2.1)

### 🩹 Fixes

- Make sure provider plugin is registered first ([ba73ecf](https://github.com/becem-gharbi/nuxt-auth/commit/ba73ecf))

### 💅 Refactors

- **useAuthFetch:** Minor refactoring ([c40fcfb](https://github.com/becem-gharbi/nuxt-auth/commit/c40fcfb))
- Remove path check on auth server middleware ([45e9633](https://github.com/becem-gharbi/nuxt-auth/commit/45e9633))
- **composables:** Use named export ([095f689](https://github.com/becem-gharbi/nuxt-auth/commit/095f689))
- Create custom $fetch instance as alternative to useAuthFetch ([38507b5](https://github.com/becem-gharbi/nuxt-auth/commit/38507b5))

### 📖 Documentation

- Add useAuthFetch deprecation alert ([1a8fa89](https://github.com/becem-gharbi/nuxt-auth/commit/1a8fa89))
- Upgrade dependencies ([503cbe3](https://github.com/becem-gharbi/nuxt-auth/commit/503cbe3))

### 🌊 Types

- **useAuthFetch:** Set return type the same as $fetch ([b71bd79](https://github.com/becem-gharbi/nuxt-auth/commit/b71bd79))
- **useAuth:** Refactor and add missing return types ([28de251](https://github.com/becem-gharbi/nuxt-auth/commit/28de251))
- **useAuthSession:** Refactor and add missing types ([80b278d](https://github.com/becem-gharbi/nuxt-auth/commit/80b278d))
- Ignore specific typechecks ([123e30c](https://github.com/becem-gharbi/nuxt-auth/commit/123e30c))
- **accessToken:** Set fingerprint as null instead of empty string ([271c9f8](https://github.com/becem-gharbi/nuxt-auth/commit/271c9f8))
- **refreshToken:** Set userAgent as null instead of undefined ([caf5f65](https://github.com/becem-gharbi/nuxt-auth/commit/caf5f65))
- Set $auth.fetch type the same as $fetch ([d4cd4f1](https://github.com/becem-gharbi/nuxt-auth/commit/d4cd4f1))
- **composables:** Explicitly set return types ([3dceb53](https://github.com/becem-gharbi/nuxt-auth/commit/3dceb53))

### 🏡 Chore

- **lint:** Ignore #imports not found ([64f64b6](https://github.com/becem-gharbi/nuxt-auth/commit/64f64b6))
- **lint:** Check on release script ([44a6b69](https://github.com/becem-gharbi/nuxt-auth/commit/44a6b69))
- Rename nuxt plugins ([440e1db](https://github.com/becem-gharbi/nuxt-auth/commit/440e1db))
- **useAuthFetch:** Mark as deprecated ([5e131f5](https://github.com/becem-gharbi/nuxt-auth/commit/5e131f5))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>

## v2.2.0

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.1.0...v2.2.0)

### 🚀 Enhancements

- Add fingerprint check on access token verification ([6a9c604](https://github.com/becem-gharbi/nuxt-auth/commit/6a9c604))

### 🔥 Performance

- Avoid relying on useCookie for multi-tabs auto logout ([7865639](https://github.com/becem-gharbi/nuxt-auth/commit/7865639))
- Avoid access token check on non API requests ([e9b98e3](https://github.com/becem-gharbi/nuxt-auth/commit/e9b98e3))

### 💅 Refactors

- **useAuthSession:** Replace useCookie with js-cookie ([cc2ea24](https://github.com/becem-gharbi/nuxt-auth/commit/cc2ea24))
- **useAuth:** Remove delay on login ([ed7e39b](https://github.com/becem-gharbi/nuxt-auth/commit/ed7e39b))
- Create client-only plugin for Broadcast channel ([4d5050a](https://github.com/becem-gharbi/nuxt-auth/commit/4d5050a))
- Verify userAgent on token refresh ([5495a8f](https://github.com/becem-gharbi/nuxt-auth/commit/5495a8f))
- **refresh:** Pass user-agent to API ([cfe9bb6](https://github.com/becem-gharbi/nuxt-auth/commit/cfe9bb6))
- **fetch:** Pass user-agent to API ([827cdf7](https://github.com/becem-gharbi/nuxt-auth/commit/827cdf7))
- Add event argument to verifyAccessToken and createAccessToken ([1a2f6fc](https://github.com/becem-gharbi/nuxt-auth/commit/1a2f6fc))
- Create fingerprint server utility ([6438610](https://github.com/becem-gharbi/nuxt-auth/commit/6438610))
- Always return json on API response (or redirect) ([feeed74](https://github.com/becem-gharbi/nuxt-auth/commit/feeed74))
- **fingerprint:** Use h3 built-in hash option ([7dc51c6](https://github.com/becem-gharbi/nuxt-auth/commit/7dc51c6))
- Minor refactoring ([7fceab1](https://github.com/becem-gharbi/nuxt-auth/commit/7fceab1))

### 🌊 Types

- Update types.d.ts ([9153b39](https://github.com/becem-gharbi/nuxt-auth/commit/9153b39))

### 🏡 Chore

- **demo:** Upgrade dependencies ([42b4825](https://github.com/becem-gharbi/nuxt-auth/commit/42b4825))
- **demo:** Sync lock ([0c0f473](https://github.com/becem-gharbi/nuxt-auth/commit/0c0f473))
- **demo:** Upgrade nuxt to 3.8.2 ([7b6fb55](https://github.com/becem-gharbi/nuxt-auth/commit/7b6fb55))
- Set nuxt compatibility to 3.8.2 ([50ff905](https://github.com/becem-gharbi/nuxt-auth/commit/50ff905))
- **demo:** Set access token max age to 20 sec ([cb174c9](https://github.com/becem-gharbi/nuxt-auth/commit/cb174c9))
- **demo:** Upgrade deps ([4535cd7](https://github.com/becem-gharbi/nuxt-auth/commit/4535cd7))
- Set tag to latest ([5712684](https://github.com/becem-gharbi/nuxt-auth/commit/5712684))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>
- Becem <becem.gharbi@live.com>

## v2.1.0

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.0.2...v2.1.0)

### 🚀 Enhancements

- **deps:** Upgrade jose to v5 ([0ff01d1](https://github.com/becem-gharbi/nuxt-auth/commit/0ff01d1))

### 🔥 Performance

- Move default email templates to module setup ([bbf875c](https://github.com/becem-gharbi/nuxt-auth/commit/bbf875c))
- **login:** Reduce timeout to zero ([e775eb6](https://github.com/becem-gharbi/nuxt-auth/commit/e775eb6))

### 🩹 Fixes

- Auto logout when multiple tabs opened ([eae8f4f](https://github.com/becem-gharbi/nuxt-auth/commit/eae8f4f))

### 💅 Refactors

- Remove nuxt logo from default email templates ([990ef5e](https://github.com/becem-gharbi/nuxt-auth/commit/990ef5e))
- Minor refactoring ([7acadc5](https://github.com/becem-gharbi/nuxt-auth/commit/7acadc5))
- **useAuth:** Create _onlogin and _onLogout handlers ([cefe150](https://github.com/becem-gharbi/nuxt-auth/commit/cefe150))
- Avoid fetch on auto logout ([c81edda](https://github.com/becem-gharbi/nuxt-auth/commit/c81edda))
- **configOptions:** Add accessToken cookieName option ([b1c267b](https://github.com/becem-gharbi/nuxt-auth/commit/b1c267b))
- **login:** Resolve after redirection ([a7e7dec](https://github.com/becem-gharbi/nuxt-auth/commit/a7e7dec))
- Watch access token cookie on mounted ([1c853d8](https://github.com/becem-gharbi/nuxt-auth/commit/1c853d8))

### 📖 Documentation

- Change social card ([24b2929](https://github.com/becem-gharbi/nuxt-auth/commit/24b2929))
- Add cookieName to accessToken default config ([c9d097f](https://github.com/becem-gharbi/nuxt-auth/commit/c9d097f))

### 🏡 Chore

- **demo:** Upgrade dependencies ([d76e02c](https://github.com/becem-gharbi/nuxt-auth/commit/d76e02c))
- No significant change ([3a098e1](https://github.com/becem-gharbi/nuxt-auth/commit/3a098e1))
- Set tag to latest ([e032b0e](https://github.com/becem-gharbi/nuxt-auth/commit/e032b0e))

### ❤️ Contributors

- Becem-gharbi ([@becem-gharbi](http://github.com/becem-gharbi))

## v2.0.2

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.1.1-rc...v2.0.2)

### 📖 Documentation

- **readme:** Remove V2 from title ([c974f0c](https://github.com/becem-gharbi/nuxt-auth/commit/c974f0c))
- Add utils page ([389f6f2](https://github.com/becem-gharbi/nuxt-auth/commit/389f6f2))

### 🌊 Types

- Add types for bcrypt and jwt server utilities ([7f158c8](https://github.com/becem-gharbi/nuxt-auth/commit/7f158c8))

### 🏡 Chore

- **demo:** Upgrade dependencies ([072ae09](https://github.com/becem-gharbi/nuxt-auth/commit/072ae09))
- Add typecheck to release workflow ([f0860a9](https://github.com/becem-gharbi/nuxt-auth/commit/f0860a9))
- Remove rc suffix ([730948b](https://github.com/becem-gharbi/nuxt-auth/commit/730948b))
- Fix lint issues ([03ee52f](https://github.com/becem-gharbi/nuxt-auth/commit/03ee52f))
- **release:** V2.0.1 ([6578540](https://github.com/becem-gharbi/nuxt-auth/commit/6578540))
- Add funding btn ([cc609e1](https://github.com/becem-gharbi/nuxt-auth/commit/cc609e1))
- Expose bcrypt and jwt server utilities via #auth ([683e2e9](https://github.com/becem-gharbi/nuxt-auth/commit/683e2e9))
- Upgrade dependencies ([c720a1f](https://github.com/becem-gharbi/nuxt-auth/commit/c720a1f))
- Fix lint issues ([dfce5c8](https://github.com/becem-gharbi/nuxt-auth/commit/dfce5c8))

### ❤️ Contributors

- Becem-gharbi <becem.gharbi@live.com>
- Becem Gharbi <becem.gharbi@live.com>

## v2.0.1

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.1.1-rc...v2.0.1)

### 📖 Documentation

- **readme:** Remove V2 from title ([c974f0c](https://github.com/becem-gharbi/nuxt-auth/commit/c974f0c))

### 🏡 Chore

- **demo:** Upgrade dependencies ([072ae09](https://github.com/becem-gharbi/nuxt-auth/commit/072ae09))
- Add typecheck to release workflow ([f0860a9](https://github.com/becem-gharbi/nuxt-auth/commit/f0860a9))
- Remove rc suffix ([730948b](https://github.com/becem-gharbi/nuxt-auth/commit/730948b))
- Fix lint issues ([03ee52f](https://github.com/becem-gharbi/nuxt-auth/commit/03ee52f))

### ❤️ Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v2.1.1-rc

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.1.0-rc...v2.1.1-rc)

### 🔥 Performance

- Remove baseURL on internal $fetch ([3ef64c9](https://github.com/becem-gharbi/nuxt-auth/commit/3ef64c9))

### 📖 Documentation

- Update 4.email.md ([fb7b2cb](https://github.com/becem-gharbi/nuxt-auth/commit/fb7b2cb))
- Remove domain should be 127.0.0.1 warning ([b0e9e3e](https://github.com/becem-gharbi/nuxt-auth/commit/b0e9e3e))

### 🏡 Chore

- **demo:** Display module version ([034a271](https://github.com/becem-gharbi/nuxt-auth/commit/034a271))
- Fix lint issues ([cfa2097](https://github.com/becem-gharbi/nuxt-auth/commit/cfa2097))

### ❤️ Contributors

- Becem Gharbi <becem.gharbi@live.com>
- Becem <becem.gharbi@live.com>

## v2.1.0-rc

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.0.5-rc...v2.1.0-rc)

### 🚀 Enhancements

- Add Resend email provider ([b881cbc](https://github.com/becem-gharbi/nuxt-auth/commit/b881cbc))

### 🩹 Fixes

- **handleError:** Avoid returning server errors instead log them to console ([560dffe](https://github.com/becem-gharbi/nuxt-auth/commit/560dffe))
- **handleError:** Return all errors except for Prisma errors ([8c48120](https://github.com/becem-gharbi/nuxt-auth/commit/8c48120))

### 💅 Refactors

- Use vent.context.auth to check authorization on internal protected endpoints ([5adf8be](https://github.com/becem-gharbi/nuxt-auth/commit/5adf8be))
- Pass id as param on revoke single session endpoint ([e441c46](https://github.com/becem-gharbi/nuxt-auth/commit/e441c46))

### 📖 Documentation

- Add development domain should be 127.0.0.1 warning ([eda21a9](https://github.com/becem-gharbi/nuxt-auth/commit/eda21a9))
- Add Resend configuration to email section ([ae55731](https://github.com/becem-gharbi/nuxt-auth/commit/ae55731))

### 🏡 Chore

- **demo:** Upgrade dependencies ([dd722e9](https://github.com/becem-gharbi/nuxt-auth/commit/dd722e9))
- Fix ESlint issues ([ea9a546](https://github.com/becem-gharbi/nuxt-auth/commit/ea9a546))
- **playground:** Set access token max age to 10 sec ([d7915d7](https://github.com/becem-gharbi/nuxt-auth/commit/d7915d7))
- Upgrade dependencies ([dd9d9ce](https://github.com/becem-gharbi/nuxt-auth/commit/dd9d9ce))
- **playground:** Add forms ([560826a](https://github.com/becem-gharbi/nuxt-auth/commit/560826a))
- **playground:** Update config ([b2d991e](https://github.com/becem-gharbi/nuxt-auth/commit/b2d991e))
- **playground:** Change baseUrl host to 127.0.0.1 ([bc16f65](https://github.com/becem-gharbi/nuxt-auth/commit/bc16f65))
- Fix ESLint issues ([df9b281](https://github.com/becem-gharbi/nuxt-auth/commit/df9b281))
- **playground:** Switch email provider to Resend ([68d72a6](https://github.com/becem-gharbi/nuxt-auth/commit/68d72a6))
- Set tag to latest ([a253093](https://github.com/becem-gharbi/nuxt-auth/commit/a253093))

### ❤️ Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v2.0.5-rc

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.0.4-rc...v2.0.5-rc)

### 🩹 Fixes

- **passwordReset:** Allow only one password reset per password request ([0309a64](https://github.com/becem-gharbi/nuxt-auth/commit/0309a64))

### 💅 Refactors

- Remove unused server-side user utilities ([4fbdbf0](https://github.com/becem-gharbi/nuxt-auth/commit/4fbdbf0))

### 📖 Documentation

- Update composables content ([6ec56e6](https://github.com/becem-gharbi/nuxt-auth/commit/6ec56e6))
- Update setup content ([d828593](https://github.com/becem-gharbi/nuxt-auth/commit/d828593))
- Update setup content ([6821263](https://github.com/becem-gharbi/nuxt-auth/commit/6821263))

### 🏡 Chore

- **demo:** Upgrade dependencies ([47ba2b0](https://github.com/becem-gharbi/nuxt-auth/commit/47ba2b0))

### ❤️ Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v2.0.4-rc

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.0.3-rc...v2.0.4-rc)

### 💅 Refactors

- **generateAvatar:** Select background color from predefined colors ([70cacfc](https://github.com/becem-gharbi/nuxt-auth/commit/70cacfc))
- Remove extra vent argument ([6f54dc2](https://github.com/becem-gharbi/nuxt-auth/commit/6f54dc2))
- **useAuthSession:** Prefix internal apis with underscore ([c15013d](https://github.com/becem-gharbi/nuxt-auth/commit/c15013d))
- **defaults:** Set access token default maxAge to 15 min ([21d402a](https://github.com/becem-gharbi/nuxt-auth/commit/21d402a))

### 📖 Documentation

- Update docs link ([c89f7f9](https://github.com/becem-gharbi/nuxt-auth/commit/c89f7f9))
- Update 2.middlewares.md ([7328747](https://github.com/becem-gharbi/nuxt-auth/commit/7328747))
- Update composables content ([0eafadb](https://github.com/becem-gharbi/nuxt-auth/commit/0eafadb))
- Fix typo ([65ba2f0](https://github.com/becem-gharbi/nuxt-auth/commit/65ba2f0))

### 🌊 Types

- Mark user state as read-only ([402db04](https://github.com/becem-gharbi/nuxt-auth/commit/402db04))

### 🏡 Chore

- **demo:** Upgrade dependencies ([3933115](https://github.com/becem-gharbi/nuxt-auth/commit/3933115))

### ❤️ Contributors

- Becem Gharbi <becem.gharbi@live.com>
- Becem <becem.gharbi@live.com>

## v2.0.3-rc

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.0.2-rc...v2.0.3-rc)

### 🩹 Fixes

- Remove method from email custom config ([ef99be2](https://github.com/becem-gharbi/nuxt-auth/commit/ef99be2))

### 📖 Documentation

- **readme:** Update features ([55a3e56](https://github.com/becem-gharbi/nuxt-auth/commit/55a3e56))
- Update docs website ([4cb80ff](https://github.com/becem-gharbi/nuxt-auth/commit/4cb80ff))
- Add oauth redirect url setting ([d16b3a1](https://github.com/becem-gharbi/nuxt-auth/commit/d16b3a1))
- Update docs website ([88a0006](https://github.com/becem-gharbi/nuxt-auth/commit/88a0006))
- Update docs website ([aaa7c3e](https://github.com/becem-gharbi/nuxt-auth/commit/aaa7c3e))

### ❤️ Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v2.0.2-rc

[compare changes](https://github.com/becem-gharbi/nuxt-auth/compare/v2.0.1-rc...v2.0.2-rc)

### 💅 Refactors

- Remove admin API ([3c749cb](https://github.com/becem-gharbi/nuxt-auth/commit/3c749cb))

### 📖 Documentation

- **readme:** Add installation section ([aa713b7](https://github.com/becem-gharbi/nuxt-auth/commit/aa713b7))

### ❤️ Contributors

- Becem Gharbi <becem.gharbi@live.com>

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

