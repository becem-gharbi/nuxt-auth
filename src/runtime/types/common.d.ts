export type KnownErrors =
  'Unauthorized'
  | 'Account suspended'
  | 'Account not verified'
  | 'Wrong credentials'
  | 'Email already used'
  | 'Email not accepted'
  | 'Wrong password'
  | 'Password reset not requested'
  | 'Oauth name not accessible'
  | 'Oauth email not accessible'
  | 'Registration disabled'
  | 'Something went wrong'

export type MailMessage = {
  to: string
  subject: string
  html: string
}

export interface AuthenticationData {
  access_token: string
  expires_in: number
}

export interface Response {
  status: string
}
