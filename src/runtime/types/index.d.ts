export interface UserBase {
  id: number | string
  name: string
  email: string
  picture: string
  role: string
  provider: string
  password: string | null
  verified: boolean
  suspended: boolean
  requestedPasswordReset: boolean
  createdAt: Date
  updatedAt: Date
}

export interface RefreshTokenBase {
  id: number | string
  uid: string
  userId: number | string
  userAgent: string | null
  createdAt: Date
  updatedAt: Date
}

type UserCreateInput = Pick<UserBase, 'name' | 'email' | 'password' | 'picture' | 'provider' | 'role' | 'verified'>
type UserCreateOutput = Pick<UserBase, 'id'>
type UserUpdateInput = Omit<Partial<UserBase>, 'id'>
type RefreshTokenCreateInput = Pick<RefreshTokenBase, 'uid' | 'userAgent' | 'userId'>
type RefreshTokenCreateOutput = Pick<RefreshTokenBase, 'id'>
type RefreshTokenUpdateInput = Pick<RefreshTokenBase, 'uid'>

export interface Adapter<Options = unknown> {
  name: string
  options?: Options
  user: {
    findById: (id: UserBase['id']) => Promise<UserBase | null>
    findByEmail: (email: UserBase['email']) => Promise<UserBase | null>
    create: (input: UserCreateInput) => Promise<UserCreateOutput>
    update: (id: UserBase['id'], input: UserUpdateInput) => Promise<void>
  }
  refreshToken: {
    findById: (id: RefreshTokenBase['id']) => Promise<RefreshTokenBase | null>
    findManyByUserId: (id: UserBase['id']) => Promise<RefreshTokenBase[]>
    create: (input: RefreshTokenCreateInput) => Promise<RefreshTokenCreateOutput>
    update: (id: RefreshTokenBase['id'], input: RefreshTokenUpdateInput) => Promise<void>
    delete: (id: RefreshTokenBase['id']) => Promise<void>
    deleteManyByUserId: (id: UserBase['id'], excludeId?: RefreshTokenBase['id']) => Promise<void>
  }
}

export type KnownErrors =
  'Unauthorized'
  | 'Account suspended'
  | 'Account not verified'
  | 'Wrong credentials'
  | 'Email already used'
  | 'Wrong password'
  | 'Password reset not requested'
  | 'Oauth name not accessible'
  | 'Oauth email not accessible'
  | 'Registration disabled'
  | 'Something went wrong'

declare module '#app' {
  interface NuxtApp {
    $auth: {
      fetch: typeof $fetch
      _refreshPromise: Promise<void> | null
    }
  }
  interface RuntimeNuxtHooks {
    'auth:loggedIn': (state: boolean) => void
  }
}

declare module 'h3' {
  interface H3EventContext {
    _authAdapter: Adapter
    auth: AccessTokenPayload | undefined
  }
}

declare module 'nitropack' {
  interface NitroRuntimeHooks {
    'auth:email': (from: string, msg: MailMessage) => Promise<void> | void
  }
}

export interface Session {
  id: RefreshTokenBase['id']
  current: boolean
  ua: string | null
  updatedAt: Date
  createdAt: Date
}

export type MailMessage = {
  to: string
  subject: string
  html: string
}

export type ResetPasswordPayload = {
  userId: UserBase['id']
}

export type EmailVerifyPayload = {
  userId: UserBase['id']
}

export type AccessTokenPayload = {
  userId: UserBase['id']
  sessionId: RefreshTokenBase['id']
  userRole: string
  fingerprint: string | null
}

export type RefreshTokenPayload = {
  id: RefreshTokenBase['id']
  uid: string
  userId: UserBase['id']
}

interface MailSendgridProvider {
  name: 'sendgrid'
  apiKey: string
}

interface MailResendProvider {
  name: 'resend'
  apiKey: string
}

interface MailHookProvider {
  name: 'hook'
}

export interface AuthenticationData {
  access_token: string
  expires_in: number
}

export type PrivateConfigWithoutBackend = {
  backendEnabled: false
  refreshToken: {
    cookieName?: string
  }
}

export type PrivateConfigWithBackend = {
  backendEnabled: true

  accessToken: {
    jwtSecret: string
    maxAge?: number
    customClaims?: Record<string, object>
  }

  refreshToken: {
    cookieName?: string
    jwtSecret: string
    maxAge?: number
  }

  oauth?: Record<
      Provider,
      {
        clientId: string
        clientSecret: string
        scopes: string
        authorizeUrl: string
        tokenUrl: string
        userUrl: string
      }
    >

  email?: {
    from: string
    provider: MailSendgridProvider | MailResendProvider | MailHookProvider
    templates?: {
      passwordReset?: string
      emailVerify?: string
    }
  }

  registration: {
    enabled?: boolean
    requireEmailVerification?: boolean
    passwordValidationRegex?: string
    defaultRole: Role
  }
}

export type PublicConfig = {
  backendEnabled?: boolean
  backendBaseUrl?: string
  baseUrl: string
  enableGlobalAuthMiddleware?: boolean
  loggedInFlagName?: string
  redirect: {
    login: string
    logout: string
    home: string
    callback?: string
    passwordReset?: string
    emailVerify?: string
  }
}

export type PrivateConfig = PrivateConfigWithBackend | PrivateConfigWithoutBackend

export interface Response { status: string }
