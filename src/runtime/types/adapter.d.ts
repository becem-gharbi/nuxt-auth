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
