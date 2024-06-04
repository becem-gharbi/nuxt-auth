import type { RefreshTokenBase, UserBase } from './adapter'

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
  provider: string
}

export type RefreshTokenPayload = {
  id: RefreshTokenBase['id']
  uid: string
  userId: UserBase['id']
}

export interface AuthenticationData {
  access_token: string
  expires_in: number
}

export interface Response {
  status: string
}
