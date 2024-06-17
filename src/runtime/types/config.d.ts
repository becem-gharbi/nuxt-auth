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

type OauthBase = Record<string, {
  clientId: string
  clientSecret: string
  scopes: string
  authorizeUrl: string
  tokenUrl: string
  userUrl: string
}>

type OauthGoogle = {
  google?: {
    clientId: string
    clientSecret: string
    scopes: 'email profile'
    authorizeUrl: 'https://accounts.google.com/o/oauth2/auth'
    tokenUrl: 'https://accounts.google.com/o/oauth2/token'
    userUrl: 'https://www.googleapis.com/oauth2/v3/userinfo'
  }
}

type OauthGitHub = {
  github?: {
    clientId: string
    clientSecret: string
    scopes: 'user:email'
    authorizeUrl: 'https://github.com/login/oauth/authorize'
    tokenUrl: 'https://github.com/login/oauth/access_token'
    userUrl: 'https://api.github.com/user'
  }
}

export type PrivateConfigWithoutBackend = {
  backendEnabled: false
}

export type PrivateConfigWithBackend = {
  backendEnabled: true

  accessToken: {
    jwtSecret: string
    maxAge?: number
    customClaims?: Record<string, unknown>
  }

  refreshToken: {
    cookieName?: string
    jwtSecret: string
    maxAge?: number
  }

  oauth?: OauthBase & OauthGoogle & OauthGitHub

  email?: {
    from: string
    actionTimeout?: number
    provider?: MailSendgridProvider | MailResendProvider | MailHookProvider
    templates?: {
      passwordReset?: string
      emailVerify?: string
    }
  }

  registration: {
    enabled?: boolean
    requireEmailVerification?: boolean
    passwordValidationRegex?: string
    emailValidationRegex?: string
    defaultRole?: string
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
  refreshToken: {
    cookieName?: string
  }
}

export type PrivateConfig = PrivateConfigWithBackend | PrivateConfigWithoutBackend

export type ModuleOptions = PrivateConfig & PublicConfig
