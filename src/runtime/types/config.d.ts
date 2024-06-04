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
    customClaims?: Record<string, unknown>
  }

  refreshToken: {
    cookieName?: string
    jwtSecret: string
    maxAge?: number
  }

  oauth?: Record<string, {
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

export type ModuleOptions = PrivateConfig & PublicConfig
