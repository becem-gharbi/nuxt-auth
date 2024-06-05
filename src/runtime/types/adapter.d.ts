/**
 * Resolves to 'string' if T is 'any' (unresolved) and 'number' if T is a number
 */
type NumberOrString<T> = (T extends string ? string : number) extends number ? number : string

export interface User {
  id: NumberOrString<UserId>
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

export interface RefreshToken {
  id: NumberOrString<RefreshTokenId>
  uid: string
  userId: User['id']
  userAgent: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: RefreshToken['id']
  current: boolean
  ua: string | null
  updatedAt: Date
  createdAt: Date
}

export type AccessTokenPayload = {
  userId: User['id']
  sessionId: RefreshToken['id']
  userRole: User['role']
  fingerprint: string | null
  provider: User['provider']
}

export type RefreshTokenPayload = {
  id: RefreshToken['id']
  uid: string
  userId: User['id']
}

declare module 'h3' {
  interface H3EventContext {
    _authAdapter: Adapter
    auth?: AccessTokenPayload
  }
}

type UserCreateInput = Pick<User, 'name' | 'email' | 'password' | 'picture' | 'provider' | 'role' | 'verified'>
type UserCreateOutput = Pick<User, 'id'>
type UserUpdateInput = Omit<Partial<User>, 'id'>
type RefreshTokenCreateInput = Pick<RefreshToken, 'uid' | 'userAgent' | 'userId'>
type RefreshTokenCreateOutput = Pick<RefreshToken, 'id'>
type RefreshTokenUpdateInput = Pick<RefreshToken, 'uid' | 'userId'>

export interface Adapter<Options = unknown> {
  name: string
  options?: Options
  user: {
    findById: (id: User['id']) => Promise<User | null>
    findByEmail: (email: User['email']) => Promise<User | null>
    create: (input: UserCreateInput) => Promise<UserCreateOutput>
    update: (id: User['id'], input: UserUpdateInput) => Promise<void>
  }
  refreshToken: {
    findById: (id: RefreshToken['id'], userId: User['id']) => Promise<RefreshToken | null>
    findManyByUserId: (id: User['id']) => Promise<RefreshToken[]>
    create: (input: RefreshTokenCreateInput) => Promise<RefreshTokenCreateOutput>
    update: (id: RefreshToken['id'], input: RefreshTokenUpdateInput) => Promise<void>
    delete: (id: RefreshToken['id'], userId: User['id']) => Promise<void>
    deleteManyByUserId: (userId: User['id'], excludeId?: RefreshToken['id']) => Promise<void>
  }
}
