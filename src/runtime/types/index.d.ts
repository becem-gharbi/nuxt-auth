import type {
  User as PrismaUser,
  Provider as PrismaProvider,
  RefreshToken as PrismaRefreshToken,
  Role,
} from '@prisma/client'

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
  userId: number
  userAgent: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Adapter<Options = unknown> {
  name: string
  options?: Options
  user: {
    findById: (id: UserBase['id']) => Promise<UserBase | null>
    findByEmail: (email: UserBase['email']) => Promise<UserBase | null>
    create: (data: Pick<UserBase, 'name' | 'email' | 'picture'>) => Promise<UserBase>
    update: (id: UserBase['id'], data: Omit<Partial<UserBase>, 'id'>) => Promise<void>
  }
  refreshToken: {
    findById: (id: RefreshTokenBase['id']) => Promise<RefreshTokenBase | null>
    findManyByUserId: (id: UserBase['id']) => Promise<RefreshTokenBase[]>
    create: (data: Pick<RefreshTokenBase, 'uid' | 'userId' | 'userAgent'>) => Promise<RefreshTokenBase>
    update: (id: RefreshTokenBase['id'], data: Omit<Partial<RefreshTokenBase>, 'id'>) => Promise<void>
    delete: (id: RefreshTokenBase['id']) => Promise<void>
    deleteManyByUserId: (id: UserBase['id'], excludeId?: RefreshTokenBase['id']) => Promise<void>
  }
}

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

export type Provider = Exclude<PrismaProvider, 'default'>

export interface User extends Omit<PrismaUser, 'password'> { }

export interface RefreshToken extends Omit<PrismaRefreshToken, 'uid'> { }

export interface Session {
  id: RefreshToken['id']
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
  userId: User['id']
}

export type EmailVerifyPayload = {
  userId: User['id']
}

export type AccessTokenPayload = {
  userId: User['id']
  sessionId: Session['id']
  userRole: string
  fingerprint: string | null
}

export type RefreshTokenPayload = {
  id: RefreshToken['id']
  uid: string
  userId: User['id']
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

  oauth?: Partial<
    Record<
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
