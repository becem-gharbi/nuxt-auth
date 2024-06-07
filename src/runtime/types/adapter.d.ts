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
  verified: boolean
  createdAt: Date
  updatedAt: Date
  suspended?: boolean | null
  password?: string | null
  requestedPasswordReset?: boolean | null
}

export interface Session {
  id: NumberOrString<SessionId>
  uid: string
  userAgent: string | null
  createdAt: Date
  updatedAt: Date
  userId: User['id']
}

type UserCreateInput = Pick<User, 'name' | 'email' | 'password' | 'picture' | 'provider' | 'role' | 'verified'>
type UserCreateOutput = User
type UserUpdateInput = Omit<Partial<User>, 'id'>
type SessionCreateInput = Pick<Session, 'uid' | 'userAgent' | 'userId'>
type SessionCreateOutput = Pick<Session, 'id'>
type SessionUpdateInput = Pick<Session, 'uid' | 'userId'>

export interface Adapter<SourceT = Source> {
  name: string
  source: SourceT
  user: {
    findById: (id: User['id']) => Promise<User | null>
    findByEmail: (email: User['email']) => Promise<User | null>
    create: (input: UserCreateInput) => Promise<UserCreateOutput>
    update: (id: User['id'], input: UserUpdateInput) => Promise<void>
  }
  session: {
    findById: (id: Session['id'], userId: User['id']) => Promise<Session | null>
    findManyByUserId: (id: User['id']) => Promise<Session[]>
    create: (input: SessionCreateInput) => Promise<SessionCreateOutput>
    update: (id: Session['id'], input: SessionUpdateInput) => Promise<void>
    delete: (id: Session['id'], userId: User['id']) => Promise<void>
    deleteManyByUserId: (userId: User['id'], excludeId?: Session['id']) => Promise<void>
  }
}
