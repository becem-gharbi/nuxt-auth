interface UserBase {
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

interface RefreshTokenBase {
  id: number | string
  uid: string
  userId: number
  userAgent: string | null
  createdAt: Date
  updatedAt: Date
}

interface Adapter<Options, User extends UserBase, RefreshToken extends RefreshTokenBase> {
  name: string
  options?: Options
  user: {
    findById: (id: User['id']) => Promise<User | null>
    findByEmail: (email: User['email']) => Promise<User | null>
    create: (data: Pick<User, 'name' | 'email' | 'picture'>) => Promise<User>
    update: (id: User['id'], data: Partial<User>) => Promise<void>
  }
  refreshToken: {
    findById: (id: RefreshToken['id']) => Promise<RefreshToken | null>
    findManyByUserId: (id: User['id']) => Promise<RefreshToken[]>
    create: (data: Pick<RefreshToken, 'uid' | 'userId' | 'userAgent'>) => Promise<RefreshToken>
    update: (id: RefreshToken['id'], data: Partial<RefreshToken>) => Promise<void>
    delete: (id: RefreshToken['id']) => Promise<void>
  }
}

type AdapterFactory<Options, User extends UserBase, RefreshToken extends RefreshTokenBase> = (opts?: Options) => Adapter<Options, User, RefreshToken>

export function defineAdapter<Options, User extends UserBase = UserBase, RefreshToken extends RefreshTokenBase = RefreshTokenBase>(factory: AdapterFactory<Options, User, RefreshToken>): AdapterFactory<Options, User, RefreshToken> {
  return factory
}
